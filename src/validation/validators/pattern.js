(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('PatternValidator', PatternValidator);

  PatternValidator.$inject = [];

  function PatternValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;

      var regexp = _.isRegExp(opts) ? opts : opts.pattern;

      return regexp.test(value);
    }

    var pattern = {
      message: 'Field is invalid.',
      validate: validate
    };

    return pattern;
  }

})();
