// https://cli.vuejs.org/guide/mode-and-env.html#example-staging-mode
process.env.VUE_APP_VERSION = require('./package.json').version

const appConfig = require('./src/app.config')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

/** @type import('@vue/cli-service').ProjectOptions */
module.exports = {
  configureWebpack: {
    // We provide the app's title in Webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: appConfig.title,
    // Set up all the aliases we use in our app.
    resolve: {
      alias: require('./aliases.config').webpack,
    },
    performance: {
      // Only enable performance hints for production builds,
      // outside of tests.
      hints:
        process.env.NODE_ENV === 'production' &&
        !process.env.VUE_APP_TEST &&
        'warning',
    },
  /*   plugins: [
      new HardSourceWebpackPlugin(),
    ] */
  },
  css: {
    // Enable CSS source maps.
    sourceMap: true,
    loaderOptions: {
      sass: {
        data: `@import "@design";`
      }
    }
  },
  // Configure Webpack's dev server.
  // https://cli.vuejs.org/guide/cli-service.html
  devServer: {
    // proxy: 'http://admin.ipetbooking.daydream-lab.com'
    proxy: 'https://admin.ipetbooking.docker.yeachase.com'
    // proxy: 'http://admin.jtails.daydream-lab.com'
    /* ...(process.env.VUE_APP_BASE_URL
     ? // Proxy API endpoints to the production base URL.
     { proxy: { '/api': { target: process.env.VUE_APP_BASE_URL } } }
     : // Proxy API endpoints a local mock API.
     { before: require('./tests/mock-api') }), */
  },
  // 建置前端靜態檔案時要擺放的目錄
  // 在 package.json 也要調整 "build" 這個 script
  outputDir: process.env.VUE_APP_BUILD_MODE === 'admin-app-build'
    ? './public-app'
    : '../public',
  // compile 的檔案 outputDir 下的資料夾名稱
  assetsDir: process.env.VUE_APP_BUILD_MODE === 'admin-app-build'
    ? ''
    : 'admin',
  publicPath: process.env.VUE_APP_BUILD_MODE === 'admin-app-build'
    ? './'
    : '/',
  // 開發階段修改 index.html 來讓 js/css 可以作用
  // 上線階段則會修改 Laravel 的樣版
  indexPath:
    process.env.NODE_ENV === 'production' && process.env.VUE_APP_BUILD_MODE !== 'admin-app-build'
      ? '../resources/views/admin/index.blade.php'
      : 'index.html',
};

// '../public/admin-app-build/index.html'
// '../resources/views/admin-app-build/index.html'
