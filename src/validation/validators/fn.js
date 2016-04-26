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
      if (!opts || !_.isFunction(opts)) return true;
      
      var isValid = opts(instance);

      return isValid;
    }
  }

})();
