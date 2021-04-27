(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('EmailValidator', EmailValidator);

  EmailValidator.$inject = [];

  function EmailValidator() {
    var validator = {
      message: 'Invalid',
      validate: validate
    };

    return validator;

    function validate(value, instance, opts) {
      if (!opts || _.isNil(value))
        return true;

      if (_.isUndefined(value) || _.isNull(value))
        return true;

      var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return pattern.test(value);
    }
  }

})();
