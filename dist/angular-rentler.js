(function () {
  'use strict';
  
  angular
  	.module('rentler.core', []);
	  
}());
angular.module("rentler.core").run(["$templateCache", function($templateCache) {$templateCache.put("validation/directives/validateMsg/validateMsg.html","<div class=\"text-danger\" ng-if=\"messages.length > 0\">\n    <div ng-repeat=\"message in messages | limitTo:1\">{{message}}</div>\n</div>");}]);
(function () {
  'use strict';

  angular
    .module('rentler.core')
	  .directive('rValidateMsg', ValidateMsgDirective);

  ValidateMsgDirective.$inject = [];

  function ValidateMsgDirective() {
    var directive = {
      restrict: 'A',
      require: '^form',
      scope: true,
      link: link,
      replace: true,
      templateUrl: 'validation/directives/validateMsg/validateMsg.html'
    };

    return directive;

    function link(scope, element, attrs, ctrl) {
      // Get the field binding
      var bind = attrs.rValidateMsg;

      // Find validation
      var i = _.lastIndexOf(bind, '.'), path, model;
      while (_.lastIndexOf(bind, '.', i) > -1 &&
             !_.has(model, 'validation')) {
        i = _.lastIndexOf(bind, '.', i) - 1;
        path = bind.substring(0, i + 1);
        model = _.result(scope, path);
      }

      // No validation
      if (!_.has(model, 'validation')) return;

      // Find field name
      var fieldName = _.last(bind.split('.'));

      // Get path to validation
      path += '.validation';

      scope.$watch(path, function () {
        // Not sumbitted
        if (!ctrl.$submitted) return;

        // Set messages
        scope.messages = _.has(model.validation.errors, fieldName) ? model.validation.errors[fieldName] : [];
      }, true);
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
      require: '^form',
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrl) {
      // Get binding
      var bind = attrs.rValidateClass;
      
      // Find validation
      var i = _.lastIndexOf(bind, '.'), path, model;
      while (_.lastIndexOf(bind, '.', i) > -1 &&
             !_.has(model, 'validation')) {
        i = _.lastIndexOf(bind, '.', i) - 1;
        path = bind.substring(0, i + 1);
        model = _.result(scope, path);
      }
      
      // No validation
      if (!_.has(model, 'validation')) return;
      
      // Find field name
      var fieldName = _.last(bind.split('.'));

      // Get path to validation
      path += '.validation';

      scope.$watch(path, function () {
        // Not submitted no validation
        if (!ctrl.$submitted || !_.has(model.validation.errors, fieldName)) return;
        
        // Get the number of errors for the field
        var length = model.validation.errors[fieldName].length;
        
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
    .directive('ngModel', ValidateDirective);

  ValidateDirective.$inject = [];

  function ValidateDirective() {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrl) {
      // Find validatable
      var i = _.lastIndexOf(attrs.ngModel, '.'), path, model;
      while (_.lastIndexOf(attrs.ngModel, '.', i) > -1 &&
             !_.has(model, 'validate') &&
             !_.isFunction(model, 'validate')) {
        i = _.lastIndexOf(attrs.ngModel, '.', i) - 1;
        path = attrs.ngModel.substring(0, i + 1);
        model = _.result(scope, path);
      }
      
      // Not validatable
      if (!_.has(model, 'validate')) return;

      scope.$watch(attrs.ngModel, function () {
        // Find field name
        var fieldName = _.last(attrs.ngModel.split('.'));

        // Validate
        var isValid = model.validate(fieldName);

        // Set validity
        ctrl.$setValidity('', isValid);
      });
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
	  message: 'Field is required.',
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
      message: 'Field is required.',
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

      var minmax = _.isArray(opts) ? opts : opts.range,
          min = minmax[0] || value,
          max = minmax[1] || value;

      if (_.isNull(value) || _.isBoolean(value) || _.isArray(value))
        return false;

      return _.isNumber(+value) && +value >= min && +value <= max;
    }

    var range = {
      validate: validate,
      message: 'Field is out of range'
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
        
      if (_.isNumber(value))
        return true;

      return _.isString(value) && !_.isNaN(+value);
    }

    var numeric = {
      message: 'Field must be a number.',
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
      message: 'Field is mandatory.',
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

      return _.isString(value) && value.length >= min && value.length <= max;
    }

    var length = {
      validate: validate,
      message: function (field, opts) {
        return _.format('{0} must be between {1} and {2} characters long.',
          _.capitalize(field),
          opts[0],
          opts[1]);
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
        return _.format('{0} must be equal to {1}',
          _.capitalize(field),
          opts);
      }
    };

    function validate(value, instance, opts) {
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

      var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return pattern.test(value);
    }

    var required = {
      message: 'Invalid email address.',
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

      var compareField = _.isString(opts) ? opts : opts.compare;

      return value === instance[compareField];
    }

    function message(field, opts) {
      return _.format('Field and {0} must be the same', opts);
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
	  
	  _.bindAll(instance);
	  
	  return instance;
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