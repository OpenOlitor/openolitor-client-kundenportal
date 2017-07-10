'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('ProjektModel', function($resource, API_URL) {
    return $resource(API_URL + 'open/projekt', {
      
    }, {'query': {method:'GET', isArray: false}});
  });
