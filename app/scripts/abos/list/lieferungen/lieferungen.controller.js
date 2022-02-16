'use strict';

angular.module('openolitor-kundenportal')
      .controller('LieferungenListController', ['$scope',  '$rootScope', 'NgTableParams', 'LieferungenListModel', '$filter', 'LIEFEREINHEIT', 'ZusatzabosModel', 'LieferungenByAbotypListModel', 'lodash',
  function($scope,  $rootScope, NgTableParams, LieferungenListModel, $filter, LIEFEREINHEIT, ZusatzabosModel, LieferungenByAbotypListModel, lodash) {
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
            //only consider main abos. zusatzabos do not have abotyp 
            if (lieferung.abotyp){
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
                  var lieferungen = lodash.filter($scope.lieferungen, {'datum': lieferung.datum});
                  var total = lodash.reduce(lieferungen, function(sum, l){
                    return sum + l.lieferpositionen.length;
                  }, 0 );
                  params.total(total);
                  var lieferpositionen = [];
                  angular.forEach(lieferungen, function(l){
                    if (!l.abotyp){
                      l.lieferpositionen = lodash.map(l.lieferpositionen, function (lp){
                        return _.extend({},lp, {'zusatzabo':l.abotypBeschrieb});
                      })
                    }
                    lieferpositionen = lieferpositionen.concat(l.lieferpositionen);
                  });
                  return lieferpositionen;
                }

              });
            }
          });
        };

        var unwatch = $scope.$watch('abo', function(abo) {
          if (abo) {
            ZusatzabosModel.query({aboId: abo.id}, function(zusatzabos) {
              LieferungenListModel.query({abotypId: abo.abotypId, vertriebId: abo.vertriebId}, function(data) {
                var filtered = $filter('dateRange')(data, $scope.abo.start, $scope.abo.ende, 'datum');
                $scope.lieferungen = filtered;
                angular.forEach(zusatzabos, function(zusatzabo){
                  LieferungenByAbotypListModel.query({abotypId: zusatzabo.abotypId}, function(data) {
                    var filtered = $filter('dateRange')(data, zusatzabo.start, zusatzabo.ende, 'datum');
                    $scope.lieferungen = $scope.lieferungen.concat(filtered);
                    createLieferungenTableParams();
                  });
                });
              });
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
]);
