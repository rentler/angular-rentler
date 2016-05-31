(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('RangeValidator', RangeValidator);

  RangeValidator.$inject = [];

  function RangeValidator() {
    var validator = {
      validate: validate,
      message: message
    };

    return validator;
    
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
    
    function message(field, opts) {
        var minmax = _.isArray(opts) ? opts : opts.range,
            min = minmax[0],
            max = minmax[1];
          
        if (_.isNumber(min) && !_.isNumber(max))
          return 'Must be at least ' + min;
        else if (!_.isNumber(min) && _.isNumber(max))
          return 'Must be under ' + max;
        else
          return 'Must be ' + min + '–' + max;
    }
  }

})();
