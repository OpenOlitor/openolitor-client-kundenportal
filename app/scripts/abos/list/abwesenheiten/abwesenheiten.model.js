'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('AbwesenheitenListModel', function($resource, API_URL) {
    return $resource(API_URL +
      'kundenportal/abos/:aboId/abwesenheiten/:id', {
        id: '@id',
        aboId: '@aboId'
      });
  });
