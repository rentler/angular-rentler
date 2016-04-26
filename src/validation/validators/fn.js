(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('FnValidator', Factory);

  Factory.$inject = [];

  function Factory() {
    var validator = {
      validate: validate,
      message: 'Invalid'
    };

    return validator;
    
    function validate(value, instance, opts) {
      if (!opts) return true;
      
      var fn = _.isFunction(opts) ? opts : opts.fn;
      
      var isValid = fn(instance);

      return isValid;
    }
  }

})();
