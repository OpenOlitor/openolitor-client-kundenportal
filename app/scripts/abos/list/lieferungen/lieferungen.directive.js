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
            LieferungenListModel.query({abotypId: abo.abotypId, vertriebId: abo.vertriebId}, function(data) {
              var filtered = $filter('dateRange')(data, $scope.abo.start, $scope.abo.ende, 'datum');
              $scope.lieferungen = filtered;
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

        $scope.hasBemerkungenPreview = function(lieferung) {
          if(!angular.isUndefined(lieferung) && lieferung.lieferplanungBemerkungen && lieferung.lieferplanungBemerkungen.length > 0 && lieferung.lieferplanungBemerkungen.split('<div>').length > 3) {
            if(!angular.isUndefined(lieferung.bemerkungenPreview)) {
              return lieferung.bemerkungenPreview;
            } else {
              lieferung.bemerkungenPreview = true;
              var bemSplit = lieferung.lieferplanungBemerkungen.split('<div>');
              lieferung.bemerkungenShort = bemSplit[0] + '<div>' + bemSplit[1];
              return lieferung.bemerkungenPreview;
            }
          } else {
            return false;
          }
        };

        $scope.hasBemerkungenFullview = function(lieferung) {
          if(!angular.isUndefined(lieferung) && lieferung.lieferplanungBemerkungen && lieferung.lieferplanungBemerkungen.length > 0 && lieferung.lieferplanungBemerkungen.split('<div>').length > 3) {
            return !lieferung.bemerkungenPreview;
          } else {
            return !angular.isUndefined(lieferung) && !angular.isUndefined(lieferung.lieferplanungBemerkungen);
          }
        };

        $scope.toggleBemerkungenPreview = function(lieferung) {
          lieferung.bemerkungenPreview = !lieferung.bemerkungenPreview;
        };

      }
    };
  }
]);
