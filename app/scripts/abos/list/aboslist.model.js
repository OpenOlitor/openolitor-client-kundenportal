'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('AbosListModel', function($resource, API_URL) {
    return $resource(API_URL + 'kundenportal/abos/:id', {
      id: '@id'
    });
  });
