(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('Validatable', Validatable);

  Validatable.$inject = ['$injector'];

  function Validatable($injector) {
    var mixin = {
      validation: {},
      validate: validate
    };
    
    return mixin;
    
    function validate(fields) {
      var _this = this;
      
      if (_.isEmpty(_this.schema))
        return;
      
      // Initialize validation
      _this.validation = _this.validation || {};
      _this.validation.errors = {};

      _.forIn(_this.schema, function (validators, field) {
        // If field(s) are provided skip those that aren't included
        if (fields && (_.isString(fields) && fields !== field) ||
                      (_.isArray(fields) && !_.includes(fields, field)))
          return;

        // Reset validation for field
        _this.validation.errors[field] = [];

        _.forIn(validators, function (validatorOpts, validatorName) {
          // Get the validator and validate
          var factoryValidatorName = _.capitalize(validatorName + 'Validator'),
              validator = $injector.get(factoryValidatorName),
              isValid = validator.validate(_this[field], _this, validatorOpts);
          
          // Add any errors to the field if invalid
          if (!isValid) {
            var message = _.isString(validatorOpts.message) ? validatorOpts.message :
                          _.isFunction(validatorOpts.message) ? validatorOpts.message(field, validatorOpts) :
                          _.isString(validator.message) ? validator.message :
                          _.isFunction(validator.message) ? validator.message(field, validatorOpts) :
                          'Invalid';

            _this.validation.errors[field].push(message);
          }

        });
      });

      _this.validation.isValid = _(_this.validation.errors)
                                    .values()
                                    .flatten()
                                    .value()
                                    .length === 0;

      _this.validation.timestamp = _.now();

      return _this.validation.isValid;
    }
  }

})();