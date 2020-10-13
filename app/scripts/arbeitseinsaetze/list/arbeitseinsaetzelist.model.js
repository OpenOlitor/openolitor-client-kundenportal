'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('ArbeitseinsaetzeListModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kundenportal/arbeitseinsaetze/:id', {
      id: '@id'
    });
  });
