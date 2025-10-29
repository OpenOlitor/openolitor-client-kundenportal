'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('AbwesenheitenListModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL +
      'kundenportal/abos/:aboId/abwesenheiten/:id', {
        id: '@id',
        aboId: '@aboId'
      });
  });
