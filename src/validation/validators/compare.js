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
      return _.format('Must Match', opts);
    }

    var compare = {
      message: message,
      validate: validate
    };

    return compare;
  }

})();
