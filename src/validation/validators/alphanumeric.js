(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('AlphanumericValidator', AlphanumericValidator);

  AlphanumericValidator.$inject = [];

  function AlphanumericValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;
      
      if (_.isUndefined(value) || _.isNull(value))
        return true;

      return _.isString(value);
    }

    var alphanumeric = {
      message: 'Field must be alphanumeric.',
      validate: validate
    };

    return alphanumeric;
  }

})();
