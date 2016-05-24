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
        
      if (_.isNumber(value) || _.isUndefined(value) || _.isNull(value))
        return true;

      return _.isString(value) && !_.isNaN(+value);
    }

    var numeric = {
      message: 'Must be a number',
      validate: validate
    };

    return numeric;
  }

})();
