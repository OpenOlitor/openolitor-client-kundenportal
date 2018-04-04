'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('ArbeitsangebotParticipateController', ['$scope', '$uibModalInstance',
    '$log', 'arbeitsangebot', 'arbeitseinsatz',

    function($scope, $uibModalInstance, $log, arbeitsangebot, arbeitseinsatz) {
      $scope.arbeitsangebot = arbeitsangebot;
      if(arbeitsangebot) {
        $scope.formDaten = {
          arbeitsangebotId: arbeitsangebot.id,
          anzahlPersonen: 1,
          bemerkungen: undefined
        };
      } else if(arbeitseinsatz) {
        $scope.formDaten = {
          arbeitsangebotId: arbeitseinsatz.arbeitsangebotId,
          anzahlPersonen: arbeitseinsatz.anzahlPersonen,
          bemerkungen: arbeitseinsatz.bemerkungen
        };
      }


      $scope.ok = function() {
        $uibModalInstance.close($scope.formDaten);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    }
  ]);
