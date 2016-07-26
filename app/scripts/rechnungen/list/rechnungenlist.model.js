'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('RechnungenListModel', function($resource, API_URL) {
    return $resource(API_URL + 'kundenportal/rechnungen/:id', {
      id: '@id'
    });
  });
