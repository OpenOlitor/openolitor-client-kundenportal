'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('ArbeitsangeboteModel',
function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kundenportal/arbeitsangebote/:id', {
      id: '@id'
    });
  });
