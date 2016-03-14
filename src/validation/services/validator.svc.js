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
      
      function validate(fields) {
        var _this = this;
        
        _validate(schema);
        
        function _validate(schema) {
          _.forIn(schema, function (validators, field) {
            // If field(s) are provided skip those that aren't included
            if (fields && (_.isString(fields) && fields !== field) ||
                          (_.isArray(fields) && !_.includes(fields, field)))
              return;
            
            // Special validateif method can be put on the validator
            // in order to only validate if that function returns true
            if (_.has(validators, 'validateIf') && 
                _.isFunction(validators.validateIf) && 
                !validators.validateIf(model))
              return;
              
            // Reset validation for field
            _this.errors[field] = [];
            
            _.forIn(validators, function (validatorOpts, validatorName) {
              
              // Skip validate field as it is special
              // see the above comment
              if (validatorName.toLowerCase() === 'validateif')
                return;
                
              // Collections are a new addition allowing subschemas
              if (validatorName === 'collection') {
                var collectionSchema = validatorOpts;
                
                // build a schema out of the item in the collection
                _.forIn(model[field], function (item, index) {
                  var itemSchema = _.clone(collectionSchema);
                  itemSchema = _.mapKeys(itemSchema, function (value, key) {
                    return field + '[' + index + '].' + key;
                  });

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
        
        // Set model validation state
        _this.isValid = _(_this.errors)
                          .values()
                          .flatten()
                          .value()
                          .length === 0;
        
        // Set timestamp
        _this.timestamp = _.now();
        
        // Return model validation state for fields
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