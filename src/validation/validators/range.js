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
        
      if (_.isUndefined(value) || _.isNull(value))
        return true;

      var minmax = _.isArray(opts) ? opts : opts.range,
          min = minmax[0] || value,
          max = minmax[1] || value;

      if (_.isBoolean(value))
        return false;
        
      if (_.isArray(value))
        return value.length >= min && value.length <= max;

      return _.isNumber(+value) && +value >= min && +value <= max;
    }

    var range = {
      validate: validate,
      message: 'Invalid'
    };

    return range;
  }

})();
