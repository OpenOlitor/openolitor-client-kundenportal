'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('LastLieferplanungenController', ['$scope', 'NgTableParams', 'LastLieferplanungenModel',
    'LIEFEREINHEIT',
    function($scope, NgTableParams, LastLieferplanungenModel, LIEFEREINHEIT) {
      $scope.entries = [];
      $scope.shownEntries = 1;

      $scope.liefereinheiten = LIEFEREINHEIT;

      LastLieferplanungenModel.query(function(data) {
        $scope.entries = data;
      });

      $scope.calculatePreis = function(korbprodukt) {
        korbprodukt.preis = (korbprodukt.preisEinheit * korbprodukt.menge);
        return korbprodukt.preis;
      };

      $scope.showMore = function() {
        $scope.shownEntries = $scope.shownEntries + 2;
      };

      $scope.hasCommonLieferdatum = function(planung) {
        if(!angular.isUndefined(planung.commonLieferdatum)) {
          return true;
        }
        var commonDate;
        var retValue = true;
        angular.forEach(planung.lieferungen, function(lieferung) {
          if(angular.isUndefined(commonDate) ||
            (!angular.isUndefined(lieferung.datum) && lieferung.datum.getTime() === commonDate.getTime())) {
            commonDate = lieferung.datum;
          } else {
            retValue = false;
          }
        });
        if(retValue) {
          planung.commonLieferdatum = commonDate;
        }
        return retValue;
      };
    }
  ]);
