(function () {
  'use strict';
  
  angular
  	.module('rentler.core', []);
	  
}());
angular.module("rentler.core").run(["$templateCache", function($templateCache) {$templateCache.put("validation/directives/validateMsg/validateMsg.html","<div class=\"help-block\" ng-if=\"messages.length > 0\">\n  <div ng-repeat=\"message in messages | limitTo:1\">{{message}}</div>\n</div>");}]);
(function () {
  'use strict';
  
  angular
    .module('rentler.core')
    .directive('rValidator', Directive);
    
  Directive.$inject = [];
  
  function Directive() {
    var directive = {
      restrict: 'EA',
      scope: {
        rValidator: '='
      },
      controller: Ctrl
    };
    return directive;
  }
  
  Ctrl.$inject = ['$scope', '$attrs'];
  
  function Ctrl($scope, $attrs) {
    var vm = this;
    
    if (!_.has($scope.rValidator, 'validate') &&
        !_.isFunction($scope.rValidator.validate))
      throw 'Invalid Validator.';
    
    vm.attr = $attrs.rValidator;
    vm.validator = $scope.rValidator;
  }
    
})();
(function () {
  'use strict';

  angular
    .module('rentler.core')
	  .directive('rValidateMsg', ValidateMsgDirective);

  ValidateMsgDirective.$inject = [];

  function ValidateMsgDirective() {
    var directive = {
      restrict: 'A',
      require: ['^form', '^rValidator'],
      scope: true,
      link: link,
      replace: true,
      templateUrl: 'validation/directives/validateMsg/validateMsg.html'
    };

    return directive;

    function link(scope, element, attrs, ctrls) {
      // Get controllers
      var formCtrl = ctrls[0],
          rValidatorCtrl = ctrls[1];

      // Get binding
      var bind = attrs.rValidateMsg;
      
      // Find field name
      var fieldName = _.last(bind.split('.'));
      
      // ngRepeat
      if (_.has(scope.$parent, '$index')) {
        // Get item binding
        var item = attrs.rValidateMsg.split('.')[0];
        
        // Find ngRepeat collection
        var ngRepeatElem = element;
        var ngRepeatCollection, ngRepeatItem;
        do {
          ngRepeatElem = ngRepeatElem.parent();
          
          // No element
          if (!ngRepeatElem) break;
          
          // No ngRepeat
          if (!ngRepeatElem[0].hasAttribute('ng-repeat') &&
              !ngRepeatElem[0].hasAttribute('data-ng-repeat'))
            continue;
          
          // Get ngRepeat expression
          var ngRepeatExp = ngRepeatElem.attr('ng-repeat') || 
                            ngRepeatElem.attr('data-ng-repeat');
                            
          // Deconstrcut ngRepeat expression      
          var ngRepeatMatch = ngRepeatExp.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
          
          // Get ngRepeat item
          var ngRepeatItemMatch = ngRepeatMatch[1].match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
          ngRepeatItem = ngRepeatItemMatch[3] || ngRepeatItemMatch[1];
          
          // Get ngRepeat collection
          ngRepeatCollection = _.last(ngRepeatMatch[2].split('.'));
        } while (ngRepeatItem !== item);
        
        fieldName = ngRepeatCollection + '[' + scope.$index + '].' + fieldName;
      }
      
      // Build path to field error
      var path = rValidatorCtrl.attr;
      
      // Get validator
      var validator = rValidatorCtrl.validator;

      scope.$watch(path, function () {
        // Not submitted no validation
        if (!formCtrl.$submitted) return;
        
        // Add approriate classes
        scope.messages = _.has(validator.errors, fieldName) ? validator.errors[fieldName] : [];
      }, true);
    }
  }

})();
(function () {
  'use strict';

  angular
    .module('rentler.core')
    .directive('ngModel', ValidateDirective);

  ValidateDirective.$inject = [];

  function ValidateDirective() {
    var directive = {
      restrict: 'A',
      require: ['ngModel', '?^rValidator'],
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrls) {
      // Get controllers
      var ngModelCtrl = ctrls[0],
          rValidatorCtrl = ctrls[1];
          
      // No validation
      if (!rValidatorCtrl) return;

      // If there is no validator then return
      var validator = _.get(rValidatorCtrl, 'validator');
      if (!validator) return;
      
      // Find field name
      var fieldName = _.last(attrs.ngModel.split('.'));
      
      // ngRepeat
      if (_.has(scope, '$index')) {
        // TODO: Check field for '[]'
        
        // Get item binding
        var item = attrs.ngModel.split('.')[0];
        
        // Find ngRepeat collection
        var ngRepeatElem = element;
        var ngRepeatCollection, ngRepeatItem;
        do {
          ngRepeatElem = ngRepeatElem.parent();
          
          // No element
          if (!ngRepeatElem) break;
          
          // No ngRepeat
          if (!ngRepeatElem[0].hasAttribute('ng-repeat') &&
              !ngRepeatElem[0].hasAttribute('data-ng-repeat'))
            continue;
          
          // Get ngRepeat expression
          var ngRepeatExp = ngRepeatElem.attr('ng-repeat') || 
                            ngRepeatElem.attr('data-ng-repeat');
                            
          // Deconstrcut ngRepeat expression      
          var ngRepeatMatch = ngRepeatExp.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
          
          // Get ngRepeat item
          var ngRepeatItemMatch = ngRepeatMatch[1].match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
          ngRepeatItem = ngRepeatItemMatch[3] || ngRepeatItemMatch[1];
          
          // Get ngRepeat collection
          ngRepeatCollection = _.last(ngRepeatMatch[2].split('.'));
        } while (ngRepeatItem !== item);
        
        fieldName = ngRepeatCollection + '[' + scope.$index + '].' + fieldName;
      }
      
      // Not in validator schema
      if (!_.has(validator.schema, fieldName))
        return;
      
      // Watch for changes on the field
      scope.$watch(attrs.ngModel, function () {
        // Validate
        validator.validate();

        // Get the number of errors for the field
        var length = validator.errors[fieldName].length;
        var isValid = length === 0;
        
        // Set validity
        ngModelCtrl.$setValidity('', isValid);
      });
    }
  }

}());
(function () {
  'use strict';

  angular
  	.module('rentler.core')
	  .directive('rValidateClass', ValidateClassDirective);

  ValidateClassDirective.$inject = ['Validation'];

  function ValidateClassDirective(Validation) {
    var directive = {
      restrict: 'A',
      require: ['^form', '^rValidator'],
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrls) {
      // Get controllers
      var formCtrl = ctrls[0],
          rValidatorCtrl = ctrls[1];

      // Get binding
      var bind = attrs.rValidateClass;
      
      // Find field name
      var fieldName = _.last(bind.split('.'));
      
      // ngRepeat
      if (_.has(scope, '$index')) {
        // Get item binding
        var item = attrs.rValidateClass.split('.')[0];
        
        // Find ngRepeat collection
        var ngRepeatElem = element;
        var ngRepeatCollection, ngRepeatItem;
        do {
          ngRepeatElem = ngRepeatElem.parent();
          
          // No element
          if (!ngRepeatElem) break;
          
          // No ngRepeat
          if (!ngRepeatElem[0].hasAttribute('ng-repeat') &&
              !ngRepeatElem[0].hasAttribute('data-ng-repeat'))
            continue;
          
          // Get ngRepeat expression
          var ngRepeatExp = ngRepeatElem.attr('ng-repeat') || 
                            ngRepeatElem.attr('data-ng-repeat');
                            
          // Deconstrcut ngRepeat expression      
          var ngRepeatMatch = ngRepeatExp.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
          
          // Get ngRepeat item
          var ngRepeatItemMatch = ngRepeatMatch[1].match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
          ngRepeatItem = ngRepeatItemMatch[3] || ngRepeatItemMatch[1];
          
          // Get ngRepeat collection
          ngRepeatCollection = _.last(ngRepeatMatch[2].split('.'));
        } while (ngRepeatItem !== item);
        
        fieldName = ngRepeatCollection + '[' + scope.$index + '].' + fieldName;
      }
      
      // Build path to errors
      var path = rValidatorCtrl.attr;
      
      // Get validator
      var validator = rValidatorCtrl.validator;

      scope.$watch(path, function () {
        // Not submitted no validation
        if (!formCtrl.$submitted || !_.has(validator.errors, fieldName)) return;
        
        // Get the number of errors for the field
        var length = validator.errors[fieldName].length;
        
        // Add approriate classes
        if (length === 0) element.removeClass(Validation.getClasses().error).addClass(Validation.getClasses().success);
        else if (length > 0) element.addClass(Validation.getClasses().error).removeClass(Validation.getClasses().success);
      }, true);
    }
  }

}());
(function () {
  'use strict';
  
  angular
  	.module('rentler.core')
	.directive('ngForm', FormDirective);
	
  FormDirective.$inject = ['$parse'];
  
  function FormDirective($parse) {
	  var directive = {
      restrict: 'EA',
      require: 'form',
      link: link
    };
    
    return directive;
    
    function link(scope, elem, attrs, ctrl) {
      // Find submit button
      var btns = [elem.find('button'), elem.find('input')];
      
      var submitBtn = _.find(btns, function (btn) {
        for (var i = 0; i < btn.length; i++)
          return btn[i].type.toLowerCase() === 'submit';
      });
      
      // Submit button clicked
      angular.element(submitBtn).bind('click', function (e) {
        e.preventDefault();
        
        if (!attrs.ngSubmit || !_.isUndefined(angular.element(this).attr('ng-click')))
          return;
        
        submit();
        
        return;
      });
      
      // Enter key
      elem.bind('keydown', function (e) {
        var keyCode = e.keyCode || e.which;
        
        if (keyCode !== 13) return;
        
        if (attrs.ngSubmit) submit();
        
        if (submitBtn) submitBtn.click();
      });
      
      // Submit handler
      elem.on('submit', function () {
        submit();
      });
      
      // Submit
      function submit() {
        ctrl.$submitted = true;
        $parse(attrs.ngSubmit)(scope);
      }
    }
  }
  
})();
(function () {
  'use strict';

  angular
  	.module('rentler.core')
	  .directive('form', FormDirective);

  FormDirective.$inject = [];

  function FormDirective() {
    var directive = {
      restrict: 'E',
      require: '^form',
      link: {
        pre: pre
      }
    };

    return directive;

    function pre(scope, element, attrs, ctrl) {
      element.on('submit', function () {
        ctrl.$submitted = true;
      });
    }
  }

}());
(function () {
  'use strict';
  
  angular
  	.module('rentler.core')
	.factory('Instantiable', InstantiableFactory);
	
  InstantiableFactory.$inject = [];
  
  function InstantiableFactory() {
	var mixin = {
	  create: create
	};
	
	return mixin;
	
	function create(opts) {
	  var _this = this;
	  
	  var instance = _.cloneDeep(_this);
	  
	  _.assign(instance, opts);
	  
	  _.bindAll(instance, _.functions(instance));
    
	  return instance;
	}
  }
  
}());
(function () {
  'use strict';
  
  angular
  	.module('rentler.core')
	.factory('RequiredIfValidator', RequiredIfValidator);
	
  RequiredIfValidator.$inject = ['RequiredValidator'];
  
  function RequiredIfValidator(RequiredValidtor) {
	function validate(value, instance, opts) {
	  if (!opts || !_.isFunction(opts))
	  	return true;
	  
	  var required = opts(instance);
	  
	  return RequiredValidtor.validate(value, instance, required);
	}
	
	var requiredif = {
	  message: 'Required',
	  validate: validate
	};
	
	return requiredif;
  }
	
})();
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
      message: 'Required',
      validate: validate
    };

    return required;
  }

})();

(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('RangeValidator', RangeValidator);

  RangeValidator.$inject = [];

  function RangeValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;
        
      if (_.isUndefined(value) || _.isNull(value))
        return true;

      var minmax = _.isArray(opts) ? opts : opts.range,
          min = minmax[0] || value,
          max = minmax[1] || value;

      if (_.isBoolean(value))
        return false;
        
      if (_.isArray(value))
        return value.length >= min && value.length <= max;

      return _.isNumber(+value) && +value >= min && +value <= max;
    }

    var range = {
      validate: validate,
      message: 'Invalid'
    };

    return range;
  }

})();

(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('PatternValidator', PatternValidator);

  PatternValidator.$inject = [];

  function PatternValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;
        
      if (_.isUndefined(value) || _.isNull(value))
        return true;

      var regexp = _.isRegExp(opts) ? opts : opts.pattern;

      return regexp.test(value);
    }

    var pattern = {
      message: 'Field is invalid.',
      validate: validate
    };

    return pattern;
  }

})();

(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('NumericValidator', NumericValidator);

  NumericValidator.$inject = [];

  function NumericValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;
        
      if (_.isNumber(value) || _.isUndefined(value) || _.isNull(value))
        return true;

      return _.isString(value) && !_.isNaN(+value);
    }

    var numeric = {
      message: 'Must Be a Number',
      validate: validate
    };

    return numeric;
  }

})();

(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('MandatoryValidator', MandatoryValidator);

  MandatoryValidator.$inject = [];

  function MandatoryValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;

      return _.isBoolean(value) && value === true;
    }

    var mandatory = {
      message: 'Must Agree to Continue',
      validate: validate
    };

    return mandatory;
  }

})();

(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('LengthValidator', LengthValidator);

  LengthValidator.$inject = [];

  function LengthValidator() {
    function validate(value, instance, opts) {
      if (!opts || !value)
        return true;

      var minmax = _.isArray(opts) ? opts : opts.length,
          min = minmax[0] || (value ? value.length : 0),
          max = minmax[1] || (value ? value.length : 0);

      return (_.isString(value) || _.isArray(value)) && value.length >= min && value.length <= max;
    }

    var length = {
      validate: validate,
      message: function (field, opts) {
        if (_.isNumber(opts[0]) && !_.isNumber(opts[1]))
          return 'Must Be At Least ' + opts[0] + ' Characters Long';
        else if (!_.isNumber(opts[0]) && _.isNumber(opts[1]))
          return 'Must Be Under ' + opts[1] + ' Characters Long';
        else
          return 'Must Be ' + opts[0] + '–' + opts[1] + ' Characters Long';
      }
    };

    return length;
  }

})();

(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('EqualsValidator', EqualsValidator);

  function EqualsValidator() {
    var equals = {
      validate: validate,
      message: function (field, opts) {
        return _.format('{0} Must Match {1}',
          _.capitalize(field),
          opts);
      }
    };

    function validate(value, instance, opts) {
      if (_.isUndefined(value) || _.isNull(value))
        return true;
      
      var otherValue = _.has(opts, 'equals') ? opts.equals : opts;

      return _.isEqual(value, otherValue);
    }

    return equals;
  }

}());

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
        
      if (_.isUndefined(value) || _.isNull(value))
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

(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('CompareValidator', CompareValidator);

  CompareValidator.$inject = [];

  function CompareValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;
        
      if (_.isUndefined(value) || _.isNull(value))
        return true;

      var compareField = _.isString(opts) ? opts : opts.compare;

      return value === instance[compareField];
    }

    function message(field, opts) {
      return _.format('Must Match', opts);
    }

    var compare = {
      message: message,
      validate: validate
    };

    return compare;
  }

})();

(function () {
  'use strict';

  angular
    .module('rentler.core')
    .factory('AlphanumericValidator', AlphanumericValidator);

  AlphanumericValidator.$inject = [];

  function AlphanumericValidator() {
    function validate(value, instance, opts) {
      if (!opts)
        return true;
      
      if (_.isUndefined(value) || _.isNull(value))
        return true;

      return _.isString(value);
    }

    var alphanumeric = {
      message: 'Field must be alphanumeric.',
      validate: validate
    };

    return alphanumeric;
  }

})();

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
(function () {
  'use strict';
  
  angular
    .module('rentler.core')
  	.provider('Validation', ValidationProvider);
	  
  ValidationProvider.$inject = [];
  
  function ValidationProvider() {
	var classes = {
	  success: 'has-success',
	  warning: 'has-warning',
	  error: 'has-error'	
	};
	
	this.setClasses = setClasses;
	this.$get = Validation;
	
	function setClasses(opts) {
	  opts = _.pick(opts, _.keys(classes));
	  _.merge(classes, opts);
	}
	
	function Validation() {
	  var service = {
		getClasses: getClasses
	  };
	  
	  return service;
	  
	  function getClasses() {
		return classes;
	  }
	}
  }
  
}());
(function () {
  'use strict';

  angular
    .module('rentler.core')
    .provider('DataModel', DataModelProvider);

  DataModelProvider.$inject = [];

  function DataModelProvider() {
    var baseUrl;

    this.setBaseUrl = function (value) {
      baseUrl = value;
    };

    this.$get = DataModel;

    DataModel.$inject = ['$q', '$http', '$injector', 'Instantiable'];

    function DataModel($q, $http, $injector, Instantiable) {
      
      var mixin = {
        get: get,
        list: list,
        save: save,
        remove: remove,
        http: http,
        relationalize: relationalize,
        progress: { }
      };
      
      _.assign(mixin, _.cloneDeep(Instantiable));

      return mixin;

      function get(id) {
        var _this = this;

        var url = buildUrl(_this.url, id, _this);

        _this.progress.get = true;

        var promise = $http({
          method: 'GET',
          url: url
        })
        .then(function (response) {

          _.assign(_this, response.data);

          _this.relationalize();

          return _this;
        })
        .finally(function () {
          _this.progress.get = false;
        });

        return promise;
      }

      function list(options) {
        var _this = this;

        _this.progress.list = true;

        var url = buildUrl(_this.url, null, _this, options);

        var promise = $http({
          method: 'GET',
          url: url
        })
        .then(function (response) {
          _.assign(_this, response.data);

          _.assign(_this, {
            // Pager helper functions here
          });

          _.forEach(_this.items, function (item) {
            item = _this.create(item);
          });

          return _this;
        })
        .finally(function () {
          _this.progress.list = false;
        });

        return promise;
      }

      function save() {
        var _this = this;

        _this.progress.save = true;

        var url = buildUrl(_this.url, null, _this);
        
        var data = _.pick(_this, _.keys(_this.schema));

        var promise = $http({
          method: 'POST',
          url: url,
          data: data
        })
        .then(function (response) {
          _.assign(_this, response.data);

          _this.relationalize();

          return _this;
        })
        .finally(function () {
          _this.progress.save = false;
        });

        return promise;
      }

      function remove(id) {
        var _this = this;

        _this.progress.remove = true;

        var url = buildUrl(_this.url, id, _this);

        var promise = $http({
          method: 'DELETE',
          url: url
        })
        .finally(function () {
          _this.progress.remove = false;
        });

        return promise;
      }
      
      function http(opts) {
        var _this = this;
        
        _this.progress[opts.name] = true;
        
        opts.url = buildUrl(_this.url + opts.url, null, _this);
        
        var promise = $http(opts)
        .finally(function () {
          _this.progress[opts.name] = false;
        });
        
        return promise;
      }

      function buildUrl(resourceUrl, id, model, params) {
        resourceUrl = baseUrl + resourceUrl;

        var match;
        var url = resourceUrl;
        var pattern = /:(\*)?[a-zA-Z0-9]+/g;

        do {
          match = pattern.exec(resourceUrl);

          if (!match) continue;

          var param = match[0];

          var field = param.replace(/\W+/g, '');

          if (param.indexOf('*') > -1 && id) url = url.replace(param, id);
          else if (_.has(model, field) && !_.isNull(_.result(model, field)) && !_.isUndefined(_.result(model, field))) url = url.replace(param, _.result(model, field));
        } while (match);

        url = url.replace(/\/:\*[a-zA-Z0-9]+/g, '');

        if (params) url += querystring(params);

        return url;
      }

      function relationalize() {
        var _this = this;
        
        if (!_.has(_this, 'relations') || _.keys(_this.relations).length === 0) return;

        _.forIn(_this.relations, function (modelName, field) {
          if (!_.has(_this, field)) return;

          var datamodel = $injector.get(modelName);
          _this[field] = datamodel.create(_this[field]);
        });
      }
      
      function querystring(params) {
        var query = _.map(params, function (value, key) {
          return key + '=' + encodeURIComponent(value);
        }).join('&');
    
        if (query.length > 0) query = '?' + query;
    
        return query;
      }
    }
  }

}());