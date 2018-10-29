'use strict';

//import './../styles/main.scss';
//require('./styles/main.scss');

require('./scripts/app.js');

require('./styles/bootstrap_cosmo.css');
require('./styles/custom_style.css');
require('./styles/main.scss');


//require('./scripts/root.js');
// var glob = require( 'glob' )
// var path = require( 'path' );

// glob.sync( './scripts/**/*.js' ).forEach( function( file ) {
//   require( path.resolve( file ) );
// });

// require('fs').readdirSync(__dirname + '/').forEach(function(file) {
//   if (file.match(/\.js$/) !== null && file !== 'index.js') {
//     var name = file.replace('.js', '');
//     exports[name] = require('./' + file);
//   }
// });