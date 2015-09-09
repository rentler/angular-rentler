(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('EqualsValidator', EqualsValidator);

  function EqualsValidator() {
    var equals = {
      validate: validate,
      message: function (field, opts) {
        return _.format('{0} must be equal to {1}',
          _.capitalize(field),
          opts);
      }
    };

    function validate(value, instance, opts) {
      var otherValue = _.has(opts, 'equals') ? opts.equals : opts;

      return _.isEqual(value, otherValue);
    }

    return equals;
  }

}());
