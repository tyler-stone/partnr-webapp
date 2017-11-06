module.exports = ['$rootScope', '$http', '$log', '$q', '$state', 'principal', function($rootScope, $http, $log, $q, $state, principal) {
    var routeObject = function() {
        this.name = "";
        this.params = {};
        this.sref = "";
    };

    var resolveToHome = function() {
        return constructRouteObject($state.get("home.feed"), null);
    };

    var findStates = function(search, exact) {
        var states = $state.get();

        if (exact) {
            // if it's an exact search, only look
            // at the state name and match it to
            // the search parameter
            return states.filter(function(el) {
                return el.name === search;
            });
        } else {
            // if it's not exact, see if the
            // state name contains the search string
            // or if the string is in the list of relevant
            // entities
            return states.filter(function(el) {
                var matches = false;
                matches = el.name.indexOf(search) > -1;

                if (el.data && el.data.entities) {
                    matches |= (el.data.entities.indexOf(search) > -1);
                }

                return matches;
            });
        }
    };

    var extractParams = function(url) {
        // looks at the url and extracts any url parameters

        // this pattern will match:
        // /projects/{project_id:int}/applications -> project_id
        // /projects/{id:int}					   -> id
        var pattern = new RegExp("{(\\w+):\\w+}");
        var matches = pattern.exec(url);
        var result = {};

        if (matches !== null) {
            // add them to the new object and set them
            // for future processing
            for (var i = 1; i < matches.length; i++) {
                result[matches[i]] = "";
            }
        }

        return result;
    };

    var getObject = function(link) {
        $log.debug("[ROUTE UTILS] GET " + link);
        return $http({
            method: 'GET',
            url: link,
            headers: principal.getHeaders()
        });
    };

    var defaultStateParamResolveStrategy = function(apiLink, route) {
        var deferred = $q.defer();

        // if there aren't any paramaters, we don't need
        // to go through this mess
        if (Object.keys(route.params).length > 0) {
            // do a request on the API to get detailed entity
            // information

            // here, we ASSUME that the information we need
            // for the url parameters is hidden in the
            // object details
            getObject(apiLink).then(function(result) {
                for (var key in route.params) {
                    // check if the parameter key is nested
                    // the naming convention is as follows:

                    // attribute        - if the parameter belongs to the entity,
                    //			          there will be no prefix (i.e. id)
                    // entity_attribute - if the parameter belongs to another entity,
                    //					  there will be a prefix (i.e. in application_list,
                    //					  project_id would refer to a project's id)
                    if (key.indexOf("_") > -1) {
                        // so, it's nested like project_id or something
                        // prepare a regex to extract the entity name and attribute
                        var pattern = new RegExp("^(\\w+)_(\\w+)$");
                        var matches = pattern.exec(key);

                        if (matches !== null) {
                            var dependencyName = matches[1];
                            var dependencyAttr = matches[2];

                            // grab the parameter value from the object. if it doesn't
                            // exist in the object, assume it's the top level attribute
                            try {
                              var attrValue = result.data[dependencyName][dependencyAttr];
                            } catch (exc) {
                              var attrValue = result.data[dependencyAttr];
                            }
                            route.params[key] = attrValue;
                        } else {
                            $log.debug("[ROUTE UTILS] Error parsing key: " + key);
                        }
                    } else {
                        // it's not nested, so something like id

                        // in this case, we need to see if the state corresponds
                        // directly to the entity or indirectly. for example:
                        // the 'project' state contains the 'role' entity, so the
                        // 'id' parameter refers to the project id, not the role id

                        // extract the entity from the state name
                        // i.e. application_list -> application
                        var pattern = new RegExp("^(\\w+)_?")
                        var matches = pattern.exec(route.name);

                        if (matches !== null) {
                            var parentEntity = matches[1];

                            if (apiLink.indexOf(parentEntity) > -1) {
                                // if the api contains the name of the entity,
                                // the state belongs to the entity and we can just use
                                // the param key name
                                route.params[key] = result.data[key];
                            } else {
                                // if the api does not contain the name of the entity,
                                // that means we have a sub-entity. first, search for
                                // the entity name in the object and then use the key
                                route.params[key] = result.data[parentEntity][key];
                            }
                        } else {
                            $log.debug("[ROUTE UTILS] Error parsing key: " + key);
                        }
                    }

                    if (route.params[key] === undefined) {
                        $log.debug("[ROUTE UTILS] Error retrieving URL parameter for " + key + " from REST object");
                    }
                }

                $log.debug("[ROUTE UTILS] Route params resolved");
                $log.debug(route.params);

                deferred.resolve(route.params);
            });
        } else {
            $log.debug("[ROUTE UTILS] Route params resolved");
            $log.debug(route.params);

            deferred.resolve(route.params);
        }

        return deferred.promise;
    };

    var entityStateResolveStrategy = function(apiLink, entity, entityId) {
        // we're trying to resolve the api link to a relevant state
        // and in any situation, we default to a detailed page of that entity

        // the common state format should follow this standard:
        // entityname        - detailed entity information
        // entityname_list   - for a list of valid entities
        // entityname_action - to perform an action on entity. we don't
        //					   really want that state for our use case here

        // converts the plural entity to singluar, i.e. projects -> project
        // because states follow the singular notation
        var entitySingular = entity.substring(0, entity.length - 1);

        // get any states that contain that entity in the name of the state
        // or have the entity listed under their 'entities' attribute
        var states = findStates(entitySingular, false);
        var chosenState = null;

        if (states.length === 1) {
            // if there's only one state, great. we'll just use that one
            chosenState = states[0];
        } else if (states.length > 1) {
            // ok, more than one. we'll search for a specific match between
            // the entity name and the state name to *hopefully* get a detail state
            var specificState = findStates(entitySingular, true);
            chosenState = specificState[0];
        } else {
            $log.debug("[ROUTE UTILS] entity path could not be resolved");
        }

        if (chosenState === null) {
            $log.debug("[ROUTE UTILS] resolving to home.feed");
            chosenState = $state.get("home.feed");
        }

        return chosenState;
    };

    var resolveEntityLink = function(apiLink, searchData, customParamResolveStrategy) {
        // pattern for /api/v1/{entity}/{entityId}
        var pattern = new RegExp("^\/api\/" + $rootScope.apiVersion + "\/(\\w+)\/(\\d+)");
        var matches = pattern.exec(apiLink);

        if (matches !== null) {
            var entity = matches[1];
            var entityId = matches[2];
            $log.debug("[ROUTE UTILS] Extracted entity: " + entity);

            var deferred = $q.defer();
            var chosenState = entityStateResolveStrategy(apiLink, entity, entityId);
            var paramResolveStrategy = (customParamResolveStrategy ? customParamResolveStrategy : defaultStateParamResolveStrategy);
            var route = new routeObject();

            route.name = chosenState.name;
            route.params = {};

            while (chosenState.parent !== undefined) {
                Object.assign(route.params, extractParams(chosenState.url));
                chosenState = $state.get(chosenState.parent);
            }

            paramResolveStrategy(apiLink, route, searchData).then(function(resolvedParams) {
                route.params = resolvedParams;
                route.sref = route.name + "(" + angular.toJson(route.params) + ")";
                deferred.resolve(route);
            });

            return deferred.promise;
        } else {
            $log.debug("[ROUTE UTILS] Error parsing api route: " + apiLink);
            return resolveToHome();
        }
    };

    return {
        resolveEntityLink: resolveEntityLink,
        resolveEntityLinkAndGo: function(apiLink, searchData, customParamResolveStrategy) {
            resolveEntityLink(apiLink, searchData, customParamResolveStrategy).then(function(route) {
                $state.go(route.name, route.params);
            });
        }
    };
}];
