(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('NumericValidator', NumericValidator);

  NumericValidator.$inject = [];

  function NumericValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;

      if (_.isNumber(value))
        return true;

      return _.isNumber(+value);
    }

    var numeric = {
      message: 'Field must be a number.',
      validate: validate
    };

    return numeric;
  }

})();
