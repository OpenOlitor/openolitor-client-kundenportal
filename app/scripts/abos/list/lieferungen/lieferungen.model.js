'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('LieferungenListModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kundenportal/abos/:abotypId/vertriebe/:vertriebId/lieferungen/:id', {
      abotypId: '@abotypId',
      vertriebId: '@vertriebId',
      id: '@id'
    });
  });
