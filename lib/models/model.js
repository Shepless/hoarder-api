'use strict';

var util = require('util'),
    Class = require('class-extender'),
    ValidationBuilder = require('validation-builder-js'),
    Promise = require('bluebird'),
    DataStore = require('nedb'),
    rek = require('rekuire'),
    config = rek('lib/config');

exports.define = function (options) {
    if (options === void 0) {
        throw new Error('Model cannot be defined without an options object');
    }

    options.staticMethods = options.staticMethods || {};
    options.instanceMethods = options.instanceMethods || {};
    options.attrs._id = {
        type: String,
        required: true
    };

    var dataStore = Promise.promisifyAll(new DataStore({
            filename: util.format('%s/%s.db', config.dataLocation, options.name),
            autoload: true,
            usePromises: true
        })),
        defaultPrototype = {
            init: function (data) {
                var me = this;

                me._attrs = data;
                me._attrs._id = data._id || void 0;
                me.isNew = true;
                me.isDirty = true;

                function defineProperty(propName) {
                    var propertyDefinition = {};

                    propertyDefinition[propName] = {
                        get: function () {
                            propName = (propName === 'primaryKey') ? '_id' : propName;
                            return me._attrs[propName];
                        },
                        set: function (value) {
                            if (propName !== '_id' && propName !== 'primaryKey') {
                                me._attrs[propName] = value;
                                me.isDirty = true;
                            }
                        }
                    };

                    Object.defineProperties(me, propertyDefinition);
                }

                Object.keys(data).forEach(defineProperty);
                defineProperty('primaryKey');
                Object.keys(options.instanceMethods).forEach(function (instanceMethodName) {
                    me[instanceMethodName] = options.instanceMethods[instanceMethodName].bind(me);
                });
            },

            insert: Promise.method(function () {
                var me = this,
                    validation;

                validation = me.validate();

                if (!validation.isValid) {
                    return Promise.reject(validation);
                }

                return dataStore.insertAsync(me._attrs).then(function (modelData) {
                    me._id = modelData._id;
                    me.isNew = false;
                    me.isDirty = false;
                    return me;
                });
            }),

            update: Promise.method(function (data) {
                var me = this,
                    validation;

                if (data === void 0 && !me.isDirty) {
                    return me;
                }

                if (data) {
                    Object.keys(data).forEach(function (dataAttr) {
                        me._attrs[dataAttr] = data[dataAttr];
                    });
                }

                validation = me.validate();

                if (!validation.isValid) {
                    return Promise.reject(validation);
                }

                return dataStore.updateAsync({_id: me._id}, me._attrs).then(function () {
                    me.isDirty = false;
                    return me;
                });
            }),

            validate: function () {
                var me = this,
                    validationErrors = Object
                        .keys(options.attrs)
                        .map(function (attrKey) {
                            if (attrKey === '_id' && me.isNew) {
                                return void 0;
                            }

                            if (options.attrs[attrKey].validator) {
                                var result = options.attrs[attrKey].validator.run(me[attrKey]).forAll();

                                if (!result) {
                                    return options.attrs[attrKey].validatorMessage;
                                }
                            }

                            return void 0;
                        })
                        .filter(function (validationResults) {
                            return !!validationResults;
                        });

                return {
                    isValid: validationErrors.length === 0,
                    errors: validationErrors
                }
            },

            get isValid() {
                var me = this;

                return me.validate().isValid;
            },

            toJSON: function () {
                var me = this;

                return me._attrs;
            }
        },
        model = Class.extend(defaultPrototype);

    model.find = Promise.method(function (critera) {
        return dataStore.findAsync(critera).then(function (data) {
            return data.map(function (datum) {
                var newModel = new model(datum);

                newModel.isNew = false;
                newModel.isDirty = false;

                return newModel;
            });
        });
    });

    model.findOne = Promise.method(function (criteria) {
        return dataStore.findOneAsync(criteria).then(function (data) {
            if (!data) {
                return data;
            }

            var newModel = new model(data);

            newModel.isNew = false;
            newModel.isDirty = false;

            return newModel;
        });
    });

    model.remove = Promise.method(function (criteria, options) {
        options = options || {};
        return dataStore.removeAsync(criteria, options);
    });

    Object
        .keys(options.staticMethods)
        .forEach(function (attrKey) {
            model[attrKey] = options.staticMethods[attrKey].bind(model);
        });

    Object
        .keys(options.attrs)
        .forEach(function (attrKey) {
            var validator = ValidationBuilder.forge(),
                type = options.attrs[attrKey].type,
                required = options.attrs[attrKey].required;

            if (required) {
                switch (type) {
                    case String:
                        options.attrs[attrKey].validator = validator.isString().build();
                        options.attrs[attrKey].validatorMessage = util.format('%s.%s must be a string', options.name, attrKey);
                        break;
                    case Number:
                        options.attrs[attrKey].validator = validator.isNumber().build();
                        options.attrs[attrKey].validatorMessage = util.format('%s.%s must be a number', options.name, attrKey);
                        break;
                    case Boolean:
                        options.attrs[attrKey].validator = validator.isBoolean().build();
                        options.attrs[attrKey].validatorMessage = util.format('%s.%s must be a boolean', options.name, attrKey);
                        break;
                    case Array:
                        options.attrs[attrKey].validator = validator.isArray().build();
                        options.attrs[attrKey].validatorMessage = util.format('%s.%s must be an array', options.name, attrKey);
                        break;
                    case Object:
                        options.attrs[attrKey].validator = validator.isObject().build();
                        options.attrs[attrKey].validatorMessage = util.format('%s.%s must be an object', options.name, attrKey);
                        break;
                    case Date:
                        options.attrs[attrKey].validator = validator.isDate().build();
                        options.attrs[attrKey].validatorMessage = util.format('%s.%s must be a date', options.name, attrKey);
                        break;
                }
            }
        });

    model.dataStore = dataStore;
    model.dataStore.persistence.setAutocompactionInterval(config.dataCompactInterval);

    return model;
};