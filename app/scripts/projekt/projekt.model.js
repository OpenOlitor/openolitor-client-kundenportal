'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('ProjektModel', function($resource, API_URL) {
    return $resource(API_URL + 'kundenportal/projekt/:id', {
      id: '@id'
    }, {'query': {method:'GET', isArray: false}});
  });
