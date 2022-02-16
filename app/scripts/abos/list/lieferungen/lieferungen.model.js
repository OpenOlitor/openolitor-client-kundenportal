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
  })
  .factory('ZusatzabosModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kundenportal/abos/:aboId/zusatzabos', {
      aboId: '@aboId'
    });
  })
  .factory('LieferungenByAbotypListModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kundenportal/abos/:abotypId/lieferungen/:id', {
      abotypId: '@abotypId',
      id: '@id'
    });
  });
