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