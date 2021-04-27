'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('RechnungenListController', ['$scope', 'NgTableParams', 'RechnungenListModel', 'KontoDatenModel',
    'FileUtil', '$location', '$anchorScroll', 'gettext', 'ProjektService',
    function($scope, NgTableParams, RechnungenListModel, KontoDatenModel, FileUtil, $location, $anchorScroll, gettext, ProjektService) {
      $scope.rechungenTableParams = undefined;
      $scope.kontodaten = undefined;

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};
      $scope.maxRechnungen = 3;

      RechnungenListModel.query(function(data) {
        $scope.entries = data;
        if($scope.rechungenTableParams) {
          $scope.rechungenTableParams.reload();
        }
      });

      KontoDatenModel.query(function(data) {
        $scope.kontodaten = data;
      });

      ProjektService.resolveProjekt(false).then(function(projekt) {
        $scope.projekt = projekt;
      });

      if (!$scope.rechungenTableParams) {
        $scope.rechungenTableParams = new NgTableParams({ // jshint ignore:line
          counts: [],
          sorting: {
            datum: 'asc'
          }
        }, {
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            var limitedEntries = $scope.entries.slice(-$scope.maxRechnungen);
            params.total(limitedEntries.length);
            return limitedEntries;
          }

        });
      }

      $scope.teilnehmerNummerToKonto = function(teilnehmerNummer) {
        if (teilnehmerNummer.length === 9){
            return( teilnehmerNummer.substring(0,2) + "-" + teilnehmerNummer.substring(2,8).replace(/^0+/, '') + "-" + teilnehmerNummer.substring(8) );
        } else {
            return "";
        }
      }

      $scope.downloadRechnung = function(rechnung) {
        rechnung.isDownloading = true;
        FileUtil.downloadGet('kundenportal/rechnungen/' + rechnung.id +
          '/aktionen/downloadrechnung', 'Rechnung ' + rechnung.id,
          'application/pdf',
          function() {
            rechnung.isDownloading = false;
          });
      };

      $scope.downloadMahnung = function(rechnung, fileId) {
        rechnung.isDownloadingMahnung = true;
        FileUtil.downloadGet('kundenportal/rechnungen/' + rechnung.id +
          '/aktionen/download/' + fileId, 'Rechnung ' + rechnung.id + ' Mahnung',
          'application/pdf',
          function() {
            rechnung.isDownloadingMahnung = false;
          });
      };

      $scope.getRechnungStatus = function(rechnung) {
        if(angular.isDefined(rechnung)) {
          switch(rechnung.status) {
            case 'Erstellt':
                  return gettext('Erstellt');
            case 'Verschickt':
                  return gettext('Verschickt');
            case 'MahnungVerschickt':
                  return gettext('MahnungVerschickt');
            case 'Bezahlt':
                  return gettext('Bezahlt');
            case 'Storniert':
                  return gettext('Storniert');
          }
        }
        return '';
      };

      $scope.statusClass = function(rechnung) {
        if(angular.isDefined(rechnung)) {
          switch(rechnung.status) {
            case 'Erstellt':
            case 'Verschickt':
            case 'MahnungVerschickt':
              if(rechnung.faelligkeitsDatum < new Date()) {
                return 'fa-circle-o red';
              } else {
                return 'fa-circle-o';
              }
              break;
            case 'Bezahlt':
              return 'fa-check-circle-o';
            case 'Storniert':
              return 'fa-times-circle-o';
          }
        }
        return '';
      };

      $scope.displayDetails = function(rechnung) {
        rechnung.detailsVisible = !rechnung.detailsVisible;
        rechnung.rechnungsPositionen = undefined;
        if(rechnung.detailsVisible) {
          RechnungenListModel.get({id: rechnung.id}, function(data) {
            rechnung.rechnungsPositionen = data.rechnungsPositionen;
          });
        }
      };

      $scope.gotoAbo = function(aboId) {
        $location.hash('abo' + aboId);
        $anchorScroll();
      };

      $scope.showMore = function() {
        $scope.maxRechnungen = $scope.maxRechnungen + 3;
        if($scope.rechungenTableParams) {
          $scope.rechungenTableParams.reload();
        }
      };
    }
  ]);
