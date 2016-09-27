'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('LieferungenListModel', function($resource, API_URL) {
    return $resource(API_URL + 'kundenportal/abos/:abotypId/lieferungen/:id', {
      abotypId: '@abotypId',
      id: '@id'
    }, {
      'getLast': {
        method: 'GET',
        isArray: false,
        url: API_URL + 'kundenportal/abos/:abotypId/lieferungen/last'
      }
    });
  });
