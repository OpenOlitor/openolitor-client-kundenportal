'use strict';

angular.module('openolitor-kundenportal').directive('ooAboKorbinhalt', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        abo: '=',
        zusatzabos: '='
      },
      transclude: true,
      templateUrl: 'scripts/abos/list/lieferungen/lieferungen.html',
      controller: function($scope,  $rootScope, LieferungenListModel, $filter) {
        $scope.lieferungen = undefined;
        $scope.projekt = $rootScope.projekt;
        $scope.maxKoerbe = 6;
        $scope.today = new Date();
        $scope.rand = Math.floor((Math.random() * 100) + 1);
        $scope.lieferungenZusatzabo = {};

        $scope.showLoading = function() {
          return $scope.loading || $scope.template.creating > 0;
        };

        $scope.getLastLieferung = function() {
          var filtered = $filter('dateRange')($scope.lieferungen, $scope.abo.start, $scope.abo.ende, 'datum');
          if(filtered !== undefined && filtered.length > 0) {
            return filtered[0];
          }
          return {};
        };

        $scope.getZusatzlieferung = function(date, zusatzabo) {
          if(angular.isUndefined($scope.lieferungenZusatzabo[zusatzabo.id])) {
            return;
          }
          var lieferungen = $scope.lieferungenZusatzabo[zusatzabo.id];
          var retL;
          angular.forEach(lieferungen, function(lieferung) {
            if(!angular.isUndefined(lieferung.datum) && !angular.isUndefined(date) && lieferung.datum.getTime() === date.getTime()) {
              retL = lieferung;
            }
          });
          return retL;
        };

        var unwatch = $scope.$watch('abo', function(abo) {
          if (abo) {
            LieferungenListModel.query({abotypId: abo.abotypId}, function(data) {
              $scope.lieferungen = data;
            });
          }
        });

        var unwatchZ = $scope.$watch('zusatzabos', function(zusatzabos) {
          if (zusatzabos) {
            angular.forEach(zusatzabos, function(zusatzabo) {
              LieferungenListModel.zusatzabolieferungen({abotypId: $scope.abo.abotypId, zusatzabotypId: zusatzabo.abotypId}, function(data) {
                $scope.lieferungenZusatzabo[zusatzabo.id] = data;
              });
            });
          }
        });

        $scope.$on('destroy', function() {
          unwatch();
          unwatchZ();
        });

        $scope.calculatePreis = function(korbprodukt) {
          korbprodukt.preis = (korbprodukt.preisEinheit * korbprodukt.menge);
          return korbprodukt.preis;
        };

        $scope.showMore = function() {
          $scope.maxKoerbe = $scope.maxKoerbe + 5;
        };

      }
    };
  }
]);
