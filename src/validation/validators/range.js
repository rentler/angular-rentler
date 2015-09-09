(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('RangeValidator', RangeValidator);

  RangeValidator.$inject = [];

  function RangeValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;

      var minmax = _.isArray(opts) ? opts : opts.range,
          min = minmax[0] || value,
          max = minmax[1] || value;

      if (_.isNull(value) || _.isBoolean(value) || _.isArray(value))
        return false;

      return _.isNumber(+value) && +value >= min && +value <= max;
    }

    var range = {
      validate: validate,
      message: 'Field is out of range'
    };

    return range;
  }

})();
