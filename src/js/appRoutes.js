require('./auth/login.html');
require('./auth/login_form.html');
require('./chat/chat.html');
require('./chat/chat_conversation.html');
require('./conversations/list_conversation.html');
require('./conversations/project_conversation.html');
require('./feed/feed.html');
require('./feed/feed_activity.html');
require('./home/home.html');
require('./landing/landing.html');
require('./modals/alert_modal.html');
require('./modals/confirm_modal.html');
require('./modals/select_categories_modal.html');
require('./notifications/list_notifications.html');
require('./partners/partners.html');
require('./projects/applications/list_applications.html');
require('./projects/roles/role_card.html');
require('./projects/taskmgr/list_tasks.html');
require('./projects/taskmgr/milestone.html');
require('./projects/taskmgr/milestone_form.html');
require('./projects/taskmgr/milestone_tile.html');
require('./projects/taskmgr/task_form.html');
require('./projects/taskmgr/task_tile.html');
require('./projects/create_project.html');
require('./projects/edit_project.html');
require('./projects/list_project.html');
require('./projects/project.html');
require('./projects/project_tile.html');
require('./projects/project_wrapper.html');
require('./projects/user_list_project.html');
require('./search/search_page.html');
require('./settings/settings.html');
require('./shared/header.html');
require('./shared/connection/connection_connect_btn.html');
require('./shared/connection/connection_connected_btn.html');
require('./shared/connection/connection_requested_btn.html');
require('./shared/connection/connection_respond_btn.html');
require('./shared/connection/remove_popover.html');
require('./shared/connection/requested_popover.html');
require('./shared/connection/respond_popover.html');
require('./skills/category_button.html');
require('./skills/skill_category_editor.html');
require('./toaster/toasts.html');
require('./user/profile/create_profile.html');
require('./user/profile/edit_profile.html');
require('./user/profile/profile.html');
require('./user/profile/profile_activity.html');
require('./user/profile/profile_connections.html');
require('./user/profile/profile_projects.html');
require('./user/profile/profile_skills.html');
require('./user/profile/profile_wrapper.html');
require('./user/create.html');
require('./user/forgot_password.html');
require('./user/reset_password.html');
require('./user/user_card.html');

module.exports = ['$compileProvider', '$logProvider', '$stateProvider', '$urlRouterProvider', function($compileProvider, $logProvider, $stateProvider, $urlRouterProvider) {

    if (window.location.host === 'app.partnr-up.com') {
      // these aren't working for now and I just want to deploy.
      $logProvider.debugEnabled(false);
      $compileProvider.debugInfoEnabled(false);
    }

    $stateProvider
        .state('site', {
            'abstract': true,
            resolve: {
                authorize: ['authorization', function(authorization) {
                    return authorization.authorize();
                }]
            }
        })

    .state('home', {
        parent: 'site',
        views: {
            'content@': {
                templateUrl: '/home/home.html',
                controller: 'HomeController',
            }
        },
        data: {
            roles: [],
            entities: []
        }
    })

    .state('home.feed', {
        parent: 'home',
        url: '/',
        views: {
            'feed@home': {
                templateUrl: '/feed/feed.html',
                controller: 'FeedController'
            }
        },
        data: {
            roles: [],
            entities: []
        }
    })

    .state('home.landing', {
        parent: 'home',
        url: '/landing',
        views: {
            'landing@home': {
                templateUrl: '/landing/landing.html',
                controller: 'LandingController'
            }
        },
        data: {
            roles: [],
            entities: []
        }
    })

    .state('login', {
        parent: 'site',
        url: '/account/login',
        views: {
            'content@': {
                templateUrl: '/auth/login.html',
                controller: 'LoginController',
            }
        },
        data: {
            roles: [],
            entities: []
        }
    })

    .state('account_create', {
        parent: 'site',
        url: '/account/create',
        views: {
            'content@': {
                templateUrl: '/user/create.html',
                controller: 'CreateUserController',
            }
        },
        data: {
            roles: [],
            entities: []
        }
    })

    .state('account_forgot_password', {
        parent: 'site',
        url: '/account/forgot_password',
        views: {
            'content@': {
                templateUrl: '/user/forgot_password.html',
                controller: 'ForgotPasswordController'
            }
        },
        data: {
            roles: [],
            entities: []
        }
    })

    .state('account_reset_password', {
        parent: 'site',
        url: '/account/reset_password?reset_password_token',
        views: {
            'content@': {
                templateUrl: '/user/reset_password.html',
                controller: 'ResetPasswordController'
            }
        },
        data: {
            roles: [],
            entities: []
        }
    })

    .state('profile_wrapper', {
        parent: 'site',
        url: '/profile/{id:int}',
        abstract: true,
        views: {
            'content@': {
                templateUrl: '/user/profile/profile_wrapper.html',
                controller: 'ProfileWrapperController'
            }
        }
    })

    .state('user', {
        parent: 'profile_wrapper',
        url: '',
        views: {
            'profileinfo': {
                templateUrl: '/user/profile/profile_activity.html',
                controller: 'ProfileActivityController'
            }
        },
        data: {
            roles: [],
            entities: ['user']
        }
    })

    .state('profile_projects', {
        parent: 'profile_wrapper',
        url: '',
        views: {
            'profileinfo': {
                templateUrl: '/user/profile/profile_projects.html',
                controller: 'ProfileProjectsController'
            }
        },
        data: {
            roles: [],
            entities: []
        }
    })

    .state('profile_skills', {
        parent: 'profile_wrapper',
        url: '',
        views: {
            'profileinfo': {
                templateUrl: '/user/profile/profile_skills.html',
                controller: 'ProfileSkillsController'
            }
        },
        data: {
            roles: [],
            entities: []
        }
    })

    .state('profile_create', {
        parent: 'site',
        url: '/profile/create',
        views: {
            'content@': {
                templateUrl: '/user/profile/create_profile.html',
                controller: 'CreateProfileController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: []
        }
    })

    .state('profile_edit', {
        parent: 'site',
        url: '/profile/edit',
        views: {
            'content@': {
                templateUrl: '/user/profile/edit_profile.html',
                controller: 'EditProfileController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: []
        }
    })

    .state('conversation_list', {
        parent: 'site',
        url: '/conversations',
        views: {
            'content@': {
                templateUrl: '/conversations/list_conversation.html',
                controller: 'ListConversationController',
            }
        },
        data: {
            roles: ['Admin'],
            entities: []
        }
    })

    .state('partners', {
        parent: 'site',
        url: '/partners',
        views: {
            'content@': {
                templateUrl: '/partners/partners.html',
                controller: 'PartnersController',
            }
        },
        data: {
            roles: ['Admin'],
            entities: []
        }
    })

    .state('portfolio', {
        parent: 'site',
        url: '/portfolio',
        views: {
            'content@': {
                templateUrl: '/portfolio/portfolio.html',
                controller: 'PortfolioController',
            }
        },
        data: {
            roles: ['Admin'],
            entities: []
        }
    })

    .state('user_project_list', {
        parent: 'site',
        url: '/projects/me',
        views: {
            'content@': {
                templateUrl: '/projects/user_list_project.html',
                controller: 'UserListProjectController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: ['project']
        }
    })

    .state('project_list', {
        parent: 'site',
        url: '/projects',
        views: {
            'content@': {
                templateUrl: '/projects/list_project.html',
                controller: 'ListProjectController'
            }
        },
        data: {
            roles: [],
            entities: ['project']
        }
    })

    .state('project_create', {
        parent: 'site',
        url: '/projects/create',
        views: {
            'content@': {
                templateUrl: '/projects/create_project.html',
                controller: 'CreateProjectController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: ['project']
        }
    })

    .state('project_wrapper', {
        parent: 'site',
        url: '/projects/{project_id:int}',
        abstract: true,
        views: {
            'content@': {
                templateUrl: '/projects/project_wrapper.html',
                controller: 'ProjectWrapperController'
            }
        }
    })

    .state('project', {
        parent: 'project_wrapper',
        url: '',
        views: {
            'projectinfo': {
                templateUrl: '/projects/project.html',
                controller: 'ProjectController'
            }
        },
        data: {
            roles: [],
            entities: ['project', 'comment', 'role', 'benchmark']
        }
    })

    .state('project_edit', {
        parent: 'project_wrapper',
        url: '/edit',
        views: {
            'projectinfo': {
                templateUrl: '/projects/edit_project.html',
                controller: 'EditProjectController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: ['project']
        }
    })

    .state('project_conversation', {
        parent: 'project_wrapper',
        url: '/messages',
        views: {
            'projectinfo': {
                templateUrl: '/conversations/project_conversation.html',
                controller: 'ProjectConversationController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: ['conversation']
        }
    })

    // this was formerly project_tasks
    // changing it to "task" until we have a state for
    // a specific task. This is to allow the link
    // resolve strategy to work.
    .state('task', {
        parent: 'project_wrapper',
        url: '/tasks',
        views: {
            'projectinfo': {
                templateUrl: '/projects/taskmgr/list_tasks.html',
                controller: 'ListTasksController'
            }
        },
        data: {
            roles: [],
            entities: ['task']
        }
    })

    .state('milestone', {
        parent: 'project_wrapper',
        url: '/milestones/{milestone_id:int}',
        views: {
            'projectinfo': {
                templateUrl: '/projects/taskmgr/milestone.html',
                controller: 'MilestoneController'
            }
        },
        data: {
            roles: [],
            entities: ['milestone']
        }
    })

    .state('project_milestones', {
        parent: 'project_wrapper',
        url: '/milestones',
        views: {
            'projectinfo': {
                templateUrl: '/projects/taskmgr/list_tasks.html',
                controller: 'ListTasksController'
            }
        },
        data: {
            roles: [],
            entities: ['milestone']
        }
    })

    .state('project_milestone_create', {
        parent: 'project_wrapper',
        url: '/milestones/create',
        views: {
            'projectinfo': {
                templateUrl: '/projects/taskmgr/milestone_form.html',
                controller: 'MilestoneFormController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: ['Milestone']
        }
    })

    .state('project_milestone_edit', {
        parent: 'project_wrapper',
        url: '/milestones/{milestone_id:int}/edit',
        views: {
            'projectinfo': {
                templateUrl: '/projects/taskmgr/milestone_form.html',
                controller: 'MilestoneFormController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: ['Milestone']
        }
    })

    .state('project_task_create', {
        parent: 'project_wrapper',
        url: '/tasks/create?mref',
        views: {
            'projectinfo': {
                templateUrl: '/projects/taskmgr/task_form.html',
                controller: 'TaskFormController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: ['Task']
        }
    })

    .state('project_task_edit', {
        parent: 'project_wrapper',
        url: '/tasks/{task_id:int}/edit?mref',
        views: {
            'projectinfo': {
                templateUrl: '/projects/taskmgr/task_form.html',
                controller: 'TaskFormController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: ['Task']
        }
    })

    .state('application_list', {
        parent: 'project_wrapper',
        url: '/applications',
        views: {
            'projectinfo': {
                templateUrl: '/projects/applications/list_applications.html',
                controller: 'ListApplicationsController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: ['application']
        }
    })

    .state('notification_list', {
        parent: 'site',
        url: '/notifications',
        views: {
            'content@': {
                templateUrl: '/notifications/list_notifications.html',
                controller: 'ListNotificationsController'
            }
        },
        data: {
            roles: ['Admin'],
            entities: ['notification']
        }
    })

    .state('search', {
        parent: 'site',
        url: '/search?q&entities',
        views: {
            'content@': {
                templateUrl: '/search/search_page.html',
                controller: 'SearchController'
            }
        },
        data: {
            roles: [],
            entities: []
        }
    })

    .state('settings', {
        parent: 'site',
        url: '/settings',
        views: {
            'content@': {
                templateUrl: '/settings/settings.html',
                conroller: 'SettingsController',
            }
        },
        data: {
            roles: ['Admin'],
            entities: []
        }
    });


    $urlRouterProvider.otherwise('/');
}];
