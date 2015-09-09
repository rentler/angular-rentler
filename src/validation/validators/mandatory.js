(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('MandatoryValidator', MandatoryValidator);

  MandatoryValidator.$inject = [];

  function MandatoryValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;

      return _.isBoolean(value) && value === true;
    }

    var mandatory = {
      message: 'Field is mandatory.',
      validate: validate
    };

    return mandatory;
  }

})();
