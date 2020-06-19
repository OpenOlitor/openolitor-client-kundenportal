'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('ArbeitsangeboteListModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kundenportal/arbeitsangebote/:id', {
      id: '@id'
    });
  });
