"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx_1 = require("rxjs/Rx");
var BaseService = (function () {
    /**
     * Instance name for future usage
     */
    function BaseService(TypeName) {
        if (TypeName === void 0) { TypeName = null; }
        this.TypeName = TypeName;
        this.data = [];
        this._dataSource = new Rx_1.BehaviorSubject([]);
        this._changeSource = new Rx_1.ReplaySubject(1);
        this._loadSource = new Rx_1.ReplaySubject(1);
        this._updateSource = new Rx_1.ReplaySubject(1);
        this._createSource = new Rx_1.ReplaySubject(1);
        this._deleteSource = new Rx_1.ReplaySubject(1);
        this.INSTANCE_NAME = TypeName;
        this.setupRXSources();
    }
    /**
     * This method should be invoked from outside the service.
     * You should use this method for filter the data which is coming from the server.
     * @param IFilterOperation<T> filter The operation you wanted to see
     * @returns {Observable<T[]>} a shared observable from the data query
     */
    BaseService.prototype.filter = function (filter) {
        return this._dataSource.map(function (m) { return m.filter(filter); }).share();
    };
    /**
     * This method should be invoked from outside the service,
     * when you create a new instance from the type T. When you use this method,
     * it should save the object into the remote repository.
     * @param T instance
     */
    BaseService.prototype.create = function (instance) {
        this._createSource.next(instance);
    };
    /**
     * This method should be invoked from outside the service,
     * when you update an instance from the type T.
     * When you use this method, it should save the object into the remote repository.
     * @param T instance
     */
    BaseService.prototype.update = function (instance) {
        this._updateSource.next(instance);
    };
    /**
     * This method should be invoked from outside the service,
     * when you delete an instance from the type T.
     * When you use this method, it should remove the object from the remote repository.
     * @param T instance
     */
    BaseService.prototype.delete = function (instance) {
        this.deleteByKey(instance[this.KeyField]);
    };
    /**
     * This method should be invoked from outside the service,
     * when you delete an instance from the type T by it's key field.
     * When you use this method, it should remove the object from the remote repository.
     * @param T instance
     */
    BaseService.prototype.deleteByKey = function (key) {
        this.find(key).first().subscribe(this._deleteSource);
    };
    /**
     * Returns with the first entity with the given key field
     * @return {T} instance
     */
    BaseService.prototype.find = function (key) {
        var _this = this;
        return this.filter(function (instance) { return _this.getKey(instance) === key; })
            .map(function (arr) { return arr.length > 0 ? arr[0] : null; });
    };
    /**
     * Gets all the KEYFIELD values from this repository
     * @return {any[]} KEYFIELD's value array
     */
    BaseService.prototype.getKeys = function () {
        return this.data.map(this.getKey.bind(this));
    };
    /**
     * Returns the KEYFIELD value from the given instance
     * @return {any} KEYFIELD value
     */
    BaseService.prototype.getKey = function (instance) {
        return instance[this.KeyField];
    };
    /**
     * Clears the local data from the repository
     */
    BaseService.prototype.clearAll = function () {
        this.getKeys().forEach(this.deleteByKey.bind(this));
    };
    /**
     * This method should be invoked from inside the service,
     * when you load multiple instances from the type T.
     * When you use this method, add an array to the local data source.
     * @param instances T[] Array of newly added instances
     */
    BaseService.prototype.load = function (instances) {
        this._loadSource.next(instances);
    };
    Object.defineProperty(BaseService.prototype, "dataSource", {
        /**
         * @return {Observable<T[]>}
         */
        get: function () {
            return this._dataSource.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseService.prototype, "createSource", {
        /**
         * @return {Observable<T[]>}
         */
        get: function () {
            return this._createSource.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseService.prototype, "updateSource", {
        /**
         * @return {Observable<T[]>}
         */
        get: function () {
            return this._updateSource.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseService.prototype, "deleteSource", {
        /**
         * @return {Observable<T[]>}
         */
        get: function () {
            return this._deleteSource.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Error handling method (only logging)
     */
    BaseService.prototype.errorHandler = function () {
        console.error('{arguments} => ', arguments);
    };
    /**
     * Setup, and initialize RXJS sources
     */
    BaseService.prototype.setupRXSources = function () {
        var _this = this;
        this._changeSource.scan(function (dataStore, operation) {
            return operation(dataStore);
        }, this.data).subscribe(this._dataSource);
        this._updateSource.map(function (instance) {
            return function (dataStore) {
                return _this._update(instance, dataStore);
            };
        }).subscribe(this._changeSource);
        this._createSource.map(function (instance) {
            return function (dataStore) {
                dataStore.push(instance);
                return dataStore;
            };
        }).subscribe(this._changeSource);
        this._loadSource.map(function (instances) {
            return function (dataStore) {
                instances.forEach(function (instance) {
                    if (!dataStore.find(function (x) { return x[_this.KeyField] === instance[_this.KeyField]; })) {
                        dataStore.push(instance);
                    }
                    else {
                        _this._update(instance, dataStore);
                    }
                });
                return dataStore;
            };
        }).subscribe(this._changeSource);
        this._deleteSource.map(function (instanceToDelete) {
            return function (dataStore) {
                return dataStore.filter(function (instance) {
                    return instance[_this.KeyField] !== instanceToDelete[_this.KeyField];
                });
            };
        }).subscribe(this._changeSource);
    };
    /**
     * A helper method for handle the RXJS sources.
     * @param T instance is the updated entity
     * @param any dataStore is the service's private data array
     */
    BaseService.prototype._update = function (instance, dataStore) {
        var _this = this;
        var index = dataStore.findIndex(function (i) {
            return i[_this.KeyField] === instance[_this.KeyField];
        });
        if (index >= 0) {
            dataStore[index] = instance;
        }
        else {
            throw new Error('Instance not found in the data source!');
        }
        return dataStore;
    };
    return BaseService;
}());
exports.BaseService = BaseService;
