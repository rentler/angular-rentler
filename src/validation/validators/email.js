(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('EmailValidator', EmailValidator);

  EmailValidator.$inject = [];

  function EmailValidator() {
    var validator = {
      message: 'Invalid Email',
      validate: validate
    };
    
    return validator;
    
    function validate(value, instance, opts) {
      if (!opts)
        return true;
        
      if (_.isUndefined(value) || _.isNull(value))
        return true;

      var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return pattern.test(value);
    }
  }

})();
