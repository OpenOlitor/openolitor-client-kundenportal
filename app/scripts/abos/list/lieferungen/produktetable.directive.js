'use strict';

angular.module('openolitor-kundenportal').directive('ooAboKorbinhaltProdukte', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        lieferpositionen: '='
      },
      transclude: true,
      templateUrl: 'scripts/abos/list/lieferungen/produktetable.html',
      controller: function($scope, LIEFEREINHEIT) {
        $scope.lieferungen = undefined;

        $scope.liefereinheiten = LIEFEREINHEIT;

        $scope.calculatePreis = function(korbprodukt) {
          korbprodukt.preis = (korbprodukt.preisEinheit * korbprodukt.menge);
          return korbprodukt.preis;
        };

      }
    };
  }
]);
