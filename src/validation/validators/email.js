(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('EmailValidator', EmailValidator);

  EmailValidator.$inject = [];

  function EmailValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;

      var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return pattern.test(value);
    }

    var required = {
      message: 'Invalid Email',
      validate: validate
    };

    return required;
  }

})();
