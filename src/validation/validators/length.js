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
        if (_.isNumber(opts[0]) && !_.isNumber(opts[1]))
          return 'Must Be At Least ' + opts[0] + ' Characters Long';
        else if (!_.isNumber(opts[0]) && _.isNumber(opts[1]))
          return 'Must Be Under ' + opts[1] + ' Characters Long';
        else
          return 'Must Be ' + opts[0] + '–' + opts[1] + ' Characters Long';
      }
    };

    return length;
  }

})();
