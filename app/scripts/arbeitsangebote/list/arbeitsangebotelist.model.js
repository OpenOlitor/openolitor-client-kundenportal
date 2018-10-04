'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('ArbeitsangeboteListModel', function($resource, API_URL) {
    return $resource(API_URL + 'kundenportal/arbeitsangebote/:id', {
      id: '@id'
    });
  });
