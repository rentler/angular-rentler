﻿(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('PatternValidator', PatternValidator);

  PatternValidator.$inject = [];

  function PatternValidator() {
    var validator = {
      message: 'Invalid',
      validate: validate
    };

    return validator;
    
    function validate(value, instance, opts) {
      if (!opts || _.isNil(value))
        return true;

      var regexp = _.isRegExp(opts) ? opts : opts.pattern;

      return regexp.test(value);
    }
  }

})();
