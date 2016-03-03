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
          return _.format('Must Be At Least {0} Characters Long', opts[0]);
        else if (!_.isNumber(opts[0]) && _.isNumber(opts[1]))
          return _.format('Must Be Under {0} Characters Long', opts[1]);
        else
          return _.format('Must Be {0}–{1} Characters Long',
            opts[0],
            opts[1]);
      }
    };

    return length;
  }

})();
