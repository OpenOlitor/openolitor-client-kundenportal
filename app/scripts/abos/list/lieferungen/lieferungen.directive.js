'use strict';

angular.module('openolitor-kundenportal').directive('ooAboKorbinhalt', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        abo: '='
      },
      transclude: true,
      template: require('./lieferungen.html'),
      controller: function($scope,  $rootScope, NgTableParams, LieferungenListModel, $filter, LIEFEREINHEIT) {
        $scope.lieferungen = undefined;
        $scope.projekt = $rootScope.projekt;
        $scope.maxKoerbe = 6;
        $scope.today = new Date();
        $scope.rand = Math.floor((Math.random() * 100) + 1);

        $scope.liefereinheiten = LIEFEREINHEIT;

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

        var createLieferungenTableParams = function() {
          angular.forEach($scope.lieferungen, function(lieferung) {
            if (!lieferung.lieferungenTableParams) {
              lieferung.lieferungenTableParams = new NgTableParams({ // jshint ignore:line
                counts: [],
                sorting: {
                  datum: 'asc'
                }
              }, {
                getData: function(params) {
                  if (!lieferung) {
                    return;
                  }
                  params.total(lieferung.lieferpositionen.length);
                  return lieferung.lieferpositionen;
                }

              });
            }
          });
        };

        var unwatch = $scope.$watch('abo', function(abo) {
          if (abo) {
            LieferungenListModel.query({abotypId: abo.abotypId}, function(data) {
              $scope.lieferungen = data;
              createLieferungenTableParams();
            });
          }
        });
        $scope.$on('destroy', function() {
          unwatch();
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
