(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('LengthValidator', LengthValidator);

  LengthValidator.$inject = [];

  function LengthValidator() {
    function validate(value, instance, opts) {
      if (!opts || !value)
        return true;

      var minmax = _.isArray(opts) ? opts : opts.length,
          min = minmax[0] || (value ? value.length : 0),
          max = minmax[1] || (value ? value.length : 0);

      return (_.isString(value) || _.isArray(value)) && value.length >= min && value.length <= max;
    }

    var length = {
      validate: validate,
      message: function (field, opts) {
        var min = opts.length[0],
            max = opts.length[1];
          
        if (_.isNumber(min) && !_.isNumber(max))
          return 'Must be at least ' + min + ' characters long';
        else if (!_.isNumber(min) && _.isNumber(max))
          return 'Must be under ' + max + ' characters long';
        else
          return 'Must be ' + min + '–' + max + ' characters long';
      }
    };

    return length;
  }

})();
