﻿(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('CompareValidator', CompareValidator);

  CompareValidator.$inject = [];

  function CompareValidator() {
    var validator = {
      message: 'Must Match',
      validate: validate
    };

    return validator;
    
    function validate(value, instance, opts) {
      if (!opts)
        return true;
        
      if (_.isUndefined(value) || _.isNull(value))
        return true;

      var compareField = _.isString(opts) ? opts : opts.compare;

      return value === instance[compareField];
    }
  }

})();
