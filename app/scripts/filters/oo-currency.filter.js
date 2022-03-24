'use strict';

angular.module('openolitor-kundenportal').filter('ooCurrency', ['$filter', 'gettextCatalog','WAEHRUNG','EnumUtil', function($filter, gettextCatalog, WAEHRUNG, EnumUtil) {
  return function(value, currency, showTag) {
    var waehrungen = EnumUtil.asArray(WAEHRUNG);
    var result = '';
    var symbol = undefined;
    result += $filter('number')(value, 2);
    if(showTag) {
      var enumCurrency = waehrungen.find(i => i.id === currency);
      if (enumCurrency === undefined){
        waehrungen.find(i => i.id === "CHF");
      }
      // currency symbol pre number
      if ((gettextCatalog.getCurrentLanguage() === 'en_US') ||
         (gettextCatalog.getCurrentLanguage() === 'de_DE') ||
         (gettextCatalog.getCurrentLanguage() === 'fr_CH') ||
         (gettextCatalog.getCurrentLanguage() === 'de_CH')) {
        result = enumCurrency.value + ' ' + result;
      } else {
        result = result + ' ' + enumCurrency.value;
      }
    }
    return result;
  };
}]);
