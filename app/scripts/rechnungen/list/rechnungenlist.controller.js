'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('RechnungenListController', ['$scope', 'NgTableParams', 'RechnungenListModel', 'KontoDatenModel',
    'FileUtil', '$location', '$anchorScroll',
    function($scope, NgTableParams, RechnungenListModel, KontoDatenModel, FileUtil, $location, $anchorScroll) {
      $scope.rechungenTableParams = undefined;
      $scope.kontodaten = undefined;

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};

      RechnungenListModel.query(function(data) {
        $scope.entries = data;
        if($scope.rechungenTableParams) {
          $scope.rechungenTableParams.reload();
        }
      });

      KontoDatenModel.query(function(data) {
        $scope.kontodaten = data;
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
            params.total($scope.entries.length);
            return $scope.entries;
          }

        });
      }

      $scope.teilnehmerNummerToKonto = function(teilnehmerNummer) {
        return( teilnehmerNummer.substring(0,2) + "-" + teilnehmerNummer.substring(2,8).replace(/^0+/, '') + "-" + teilnehmerNummer.substring(8) );
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
    }
  ]);
