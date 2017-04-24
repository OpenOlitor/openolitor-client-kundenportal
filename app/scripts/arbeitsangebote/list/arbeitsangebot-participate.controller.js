'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('ArbeitsangebotParticipateController', ['$scope', '$uibModalInstance',
    '$log', 'arbeitsangebot',

    function($scope, $uibModalInstance, $log, arbeitsangebot) {
      $scope.arbeitsangebot = arbeitsangebot;
      $scope.formDaten = {
        arbeitsangebotId: arbeitsangebot.id,
        anzahlPersonen: 1,
        bemerkung: undefined
      };

      $scope.ok = function() {
        $uibModalInstance.close($scope.formDaten);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    }
  ]);
