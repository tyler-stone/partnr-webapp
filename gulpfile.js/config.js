var env = (process.env.ENV || 'local').toLowerCase();

var src = './src/';
var dest = './dest/';

module.exports = {
  env: {
    name: env
  },
  src: src,
  dest: dest,


  browserify: {
    src: src + 'js/app.js',
    dest: dest + 'js/',
    debug: (env !== 'production'),
    destName: 'app.js'
  },


  sass: {
    src: src + 'sass/application.scss',
    dest: dest + 'css',
    settings: {
      includePaths: [
        src + 'sass/',
        './node_modules'
      ]
    }
  },


  browsersync: {
    host: 'lcl.partnr-up.com',
    server: {
      index: './index.html',
      baseDir: './dest'
    },
    open: 'external'
  },

  rename: {
    files: [
      {
        name: './index.html',
        dest: './dest'
      },
      {
        name: './node_modules/font-awesome/fonts/fontawesome-webfont.woff',
        dest: './dest/fonts'
      },
      {
        name: './node_modules/font-awesome/fonts/fontawesome-webfont.woff2',
        dest: './dest/fonts'
      },
      {
        name: './node_modules/font-awesome/fonts/fontawesome-webfont.ttf',
        dest: './dest/fonts'
      },
      {
        name: './src/assets/**/*',
        dest: './dest/assets'
      },
      {
        name: './src/img/**/*',
        dest: './dest/img'
      }

    ]
  }
};
