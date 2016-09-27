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
      templateUrl: 'scripts/abos/list/lieferungen/lieferungen.html',
      controller: function($scope,  $rootScope, NgTableParams, LieferungenListModel, LIEFEREINHEIT) {
        $scope.lieferungen = undefined;
        $scope.projekt = $rootScope.projekt;

        $scope.liefereinheiten = LIEFEREINHEIT;

        $scope.showLoading = function() {
          return $scope.loading || $scope.template.creating > 0;
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
              if ($scope.lieferungenTableParams) {
                $scope.lieferungenTableParams.reload();
              }
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

      }
    };
  }
]);
