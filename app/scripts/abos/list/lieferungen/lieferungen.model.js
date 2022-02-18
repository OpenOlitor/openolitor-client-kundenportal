'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .factory('ZusatzabosModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kundenportal/abos/:aboId/zusatzabos', {
      aboId: '@aboId'
    });
  })
  .factory('LieferungenMainAndAdditionalListModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kundenportal/abos/:abotypId/vertriebe/:vertriebId/abo/:aboId/lieferungenMainAndAdditional', {
      abotypId: '@abotypId',
      vertriebId: '@vertriebId',
      aboId: '@aboId'
    });
  });
