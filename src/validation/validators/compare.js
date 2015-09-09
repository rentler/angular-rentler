(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('CompareValidator', CompareValidator);

  CompareValidator.$inject = [];

  function CompareValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;

      var compareField = _.isString(opts) ? opts : opts.compare;

      return value === instance[compareField];
    }

    function message(field, opts) {
      return _.format('Field and {0} must be the same', opts);
    }

    var compare = {
      message: message,
      validate: validate
    };

    return compare;
  }

})();
