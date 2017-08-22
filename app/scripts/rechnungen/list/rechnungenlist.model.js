'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('RechnungenListModel', function ($resource, API_URL) {
    return $resource(API_URL + 'kundenportal/rechnungen/:id', {
      id: '@id'
    });
  })

  .factory('KontoDatenModel', function ($resource, API_URL) {
    return $resource(API_URL + 'kundenportal/kontodaten', {
    }, { 'query': { method: 'GET', isArray: false } });
  })