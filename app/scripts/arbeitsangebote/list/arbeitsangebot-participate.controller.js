'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('ArbeitsangebotParticipateController', ['$scope', '$uibModalInstance',
    '$log', 'arbeitsangebot', 'arbeitseinsatz', 'ArbeitsangeboteListModel','lodash',

    function($scope, $uibModalInstance, $log, arbeitsangebot, arbeitseinsatz, ArbeitsangeboteListModel,lodash) {
      $scope.arbeitsangebot = arbeitsangebot;
      $scope.maxVacancies = Number.MAX_ASFE_INTEGER;

      if(arbeitsangebot) {
        $scope.formDaten = {
          arbeitsangebotId: arbeitsangebot.id,
          anzahlPersonen: 1,
          bemerkungen: undefined
        };
        if (!arbeitsangebot.mehrPersonenOk){
          $scope.maxVacancies = arbeitsangebot.anzahlPersonen - arbeitsangebot.anzahlEingeschriebene;
        }
      } else if(arbeitseinsatz) {
        ArbeitsangeboteListModel.query(function(data) {
          arbeitsangebot = lodash.filter(data, function(aa){
            return  (aa.id === arbeitseinsatz.arbeitsangebotId);
          });

          if (arbeitsangebot[0] && !arbeitsangebot[0].mehrPersonenOk){
            $scope.maxVacancies = arbeitsangebot[0].anzahlPersonen - (arbeitsangebot[0].anzahlEingeschriebene - arbeitseinsatz.anzahlPersonen);
          }

        });
        $scope.formDaten = {
          arbeitsangebotId: arbeitseinsatz.arbeitsangebotId,
          anzahlPersonen: arbeitseinsatz.anzahlPersonen,
          bemerkungen: arbeitseinsatz.bemerkungen
        };
      }

      $scope.getArbeitAngebot = function(arbeitseinsatz) {
        if ($scope.arbeitseinsatzList) {
          var ret = undefined;
          angular.forEach($scope.arbeitseinsatzList, function(arbeitseinsatz) {
            if (arbeitseinsatz.arbeitsangebotId === arbeitsangebot.id) {
              ret = arbeitseinsatz;
            }
          });
          return ret;
        }
        return undefined;
      };

      $scope.ok = function() {
        $uibModalInstance.close($scope.formDaten);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };
    }
  ]);
