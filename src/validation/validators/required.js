(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('RequiredValidator', RequiredValidator);

  RequiredValidator.$inject = [];

  function RequiredValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;

      return !(_.isNull(value) || _.isUndefined(value) || (_.isString(value) && _.trim(value) === '') || (_.isArray(value) && _.isEmpty(value)));
    }

    var required = {
      message: 'Field is required.',
      validate: validate
    };

    return required;
  }

})();
