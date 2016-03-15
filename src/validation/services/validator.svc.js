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
        schema: schema,
        model: model,
        errors: {},
        isValid: true,
        timestamp: 0
      };
      
      return validator;
      
      function validate(fields) {
        var _this = this;
        
        _validate(schema);
        
        function _validate(schema) {
          // Iterate each field
          _.forIn(schema, function (validators, field) {
            // Skip field if not included in field(s)
            if (fields && (_.isString(fields) && fields !== field) ||
                          (_.isArray(fields) && !_.includes(fields, field)))
                return;
                
            
            // Skip if validateIf results in falsey
            if (_.has(validators, 'validateIf') &&
                _.isFunction(validators.validateIf) && 
                validators.validateIf(model) === false)
                return;
                
            // Reset validation for field
            _this.errors[field] = [];
            
            // Iterate each validator
            _.forIn(validators, function (validatorOpts, validatorName) {
              // Skip non-validators
              if (validatorName === 'validateIf')
                return;
              
              // Collections
              if (validatorName === 'collection') {
                // Iterate collection items
                _.forIn(_.result(model, field), function (value, index) {
                  // Build schema with indices
                  var itemSchema = _.mapKeys(validatorOpts, function (itemValue, itemField) {
                    return field + '[' + index + '].' + itemField;
                  });
                  
                  // Validate
                  _validate(itemSchema);
                });
                
                return;
              }
              
              // Get the validator and validate
              var factoryValidatorName = _.upperFirst(validatorName) + 'Validator',
                  validator = $injector.get(factoryValidatorName),
                  isValid = validator.validate(_.result(model, field), model, validatorOpts);
                  
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
        }
        
        _this.isValid = _(_this.errors)
                          .values()
                          .flatten()
                          .value()
                          .length === 0;
        
        var isValid = _(_this.errors)
                        .pick(fields || _.keys(schema))
                        .values()
                        .flatten()
                        .value()
                        .length === 0;
                        
        _this.timestamp = _.now();

        return isValid;
      }
      

      
    }
  }
    
})();