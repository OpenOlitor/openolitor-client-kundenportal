'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('LieferungenListModel', function($resource, API_URL) {
    return $resource(API_URL + 'kundenportal/abos/:abotypId/vertriebe/:vertriebId/lieferungen/:id', {
      abotypId: '@abotypId',
      vertriebId: '@vertriebId',
      id: '@id'
    });
  });
