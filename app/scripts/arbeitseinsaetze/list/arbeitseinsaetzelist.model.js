'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('ArbeitseinsaetzeListModel', function($resource, API_URL) {
    return $resource(API_URL + 'kundenportal/arbeitseinsaetze/:id', {
      id: '@id'
    });
  });
