(function () {
  'use strict';
  
  angular
    .module('rentler.core')
    .factory('Validator', Factory);
    
  Factory.$inject = ['$injector'];
  
  function Factory($injector) {
    var service = {
      create: create
    };
    
    return service;
    
    function create(schema, model) {
      var validator = {
        validate: validate,
        errors: {},
        isValid: true,
        timestamp: 0
      };
      
      function validate(fields) {
        var _this = this;
        
        _.forIn(schema, function (validators, field) {
          // If field(s) are provided skip those that aren't included
          if (fields && (_.isString(fields) && fields !== field) ||
                        (_.isArray(fields) && !_.includes(fields, field)))
            return;
          
          // Skip if validate function results in falsey
          if (_.has(validators, 'validateIf') && 
              _.isFunction(validators.validateIf) && 
              !validators.validateIf(model))
            return;
            
          // Reset validation for field
          _this.errors[field] = [];
          
          _.forIn(validators, function (validatorOpts, validatorName) {
            // Skip validate field as it is special
            if (validatorName.toLowerCase() === 'validateif')
              return;
              
            // Get the validator and validate
            var factoryValidatorName = _.upperFirst(validatorName) + 'Validator',
                validator = $injector.get(factoryValidatorName),
                isValid = validator.validate(model[field], model, validatorOpts);
                
            // Add any errors to the field if invalid
            if (!isValid) {
              var message = _.isString(validatorOpts.message) ? validatorOpts.message :
                            _.isFunction(validatorOpts.message) ? validatorOpts.message(field, validatorOpts) :
                            _.isString(validator.message) ? validator.message :
                            _.isFunction(validator.message) ? validator.message(field, validatorOpts) :
                            'Invalid';

              _this.errors[field].push(message);
            }
          });
        });
        
        _this.isValid = _(_this.errors)
                          .values()
                          .flatten()
                          .value()
                          .length === 0;
        
        _this.timestamp = _.now();
        
        var isValid = _(_this.errors)
                        .pick(fields || _.keys(schema))
                        .values()
                        .flatten()
                        .value()
                        .length === 0;

        return isValid;
      }
      
      return validator;
    }
  }
    
})();