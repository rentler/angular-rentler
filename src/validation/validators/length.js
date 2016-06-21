(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('LengthValidator', LengthValidator);

  LengthValidator.$inject = [];

  function LengthValidator() {
    var validator = {
      validate: validate,
      message: message
    };

    return validator;
    
    function validate(value, instance, opts) {
      if (!opts || _.isNil(value) || (_.isString(value) && value.length === 0))
        return true;

      var minmax = _.isArray(opts) ? opts : opts.length,
          min = minmax[0] || (value ? value.length : 0),
          max = minmax[1] || (value ? value.length : 0);

      return (_.isString(value) || _.isArray(value)) && value.length >= min && value.length <= max;
    }
    
    function message(field, opts) {
      var minmax = _.isArray(opts) ? opts : opts.length,
          min = minmax[0],
          max = minmax[1];
          
        if (_.isNumber(min) && !_.isNumber(max)) return min + ' Characters Minimum';
        else if (!_.isNumber(min) && _.isNumber(max)) return max + ' Characters Maximum';
        else if (min === max) return 'Must be ' + min + ' Characters';
        else return 'Must Be ' + min + '–' + max + ' Characters';
    }
  }

})();
