process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.GENERATE_SOURCEMAP = 'false';
process.on('unhandledRejection', err => { console.error('UNHANDLED:', err); process.exit(1); });
require('./node_modules/react-scripts/config/env');
const webpack = require('./node_modules/webpack');
console.log('webpack loaded OK');
const configFactory = require('./node_modules/react-scripts/config/webpack.config');
console.log('configFactory loaded OK');
const config = configFactory('production');
console.log('webpack config created OK');
const { checkBrowsers } = require('./node_modules/react-dev-utils/browsersHelper');
const paths = require('./node_modules/react-scripts/config/paths');
checkBrowsers(paths.appPath, false).then(() => {
  console.log('browsers OK - starting webpack...');
  const compiler = webpack(config);
  console.log('compiler created');
  compiler.run((err, stats) => {
    if (err) { console.error('webpack error:', err.message); process.exit(1); }
    const info = stats.toJson('errors-warnings');
    if (stats.hasErrors()) {
      console.error('COMPILE ERRORS:');
      info.errors.forEach(e => console.error(e.message));
      process.exit(1);
    }
    console.log('BUILD SUCCESS');
    process.exit(0);
  });
}).catch(e => { console.error('error:', e.message); process.exit(1); });
