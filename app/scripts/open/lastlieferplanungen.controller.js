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
    }
  ]);
