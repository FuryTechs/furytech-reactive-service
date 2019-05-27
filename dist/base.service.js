"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var BaseService = /** @class */ (function () {
    function BaseService() {
        this._orderEvent = new rxjs_1.BehaviorSubject(undefined);
        this._filterEvent = new rxjs_1.BehaviorSubject(undefined);
        this._pagerEvent = new rxjs_1.BehaviorSubject({ count: 20, page: 0 });
        this.dataCount = new rxjs_1.BehaviorSubject(0);
        /**
         * @description Actual data storage, set to the initial state
         */
        this.data = [];
        this._dataSource = new rxjs_1.BehaviorSubject([]);
        this._changeSource = new rxjs_1.ReplaySubject(1);
        this._loadQueryToSource = new rxjs_1.ReplaySubject(1);
        this._loadSingleToSource = new rxjs_1.ReplaySubject(undefined);
        this._updateSource = new rxjs_1.ReplaySubject(1);
        this._createSource = new rxjs_1.ReplaySubject(1);
        this._deleteSource = new rxjs_1.ReplaySubject(undefined);
        this.setupRXSources();
    }
    /**
     * This method should be invoked from outside the service.
     * You should use this method for filter the data which is coming from the server.
     * @param _filter filter The operation you wanted to see
     * @returns a shared observable from the data query
     */
    BaseService.prototype.filterExisting = function (_filter) {
        return this._dataSource.pipe(operators_1.map(function (dataArray) { return dataArray.filter(_filter); })).pipe(operators_1.share());
    };
    /**
     * This method should be invoked from outside the service,
     * when you create a new instance from the type T. When you use this method,
     * it should save the object into the remote repository.
     * @param instance the instance which should be created
     */
    BaseService.prototype.create = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._createSource.next(instance);
                return [2 /*return*/];
            });
        });
    };
    /**
     * This method should be invoked from outside the service,
     * when you update an instance from the type T.
     * When you use this method, it should save the object into the remote repository.
     * @param instance which should be updated
     */
    BaseService.prototype.update = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._updateSource.next(instance);
                return [2 /*return*/];
            });
        });
    };
    /**
     * This method should be invoked from outside the service,
     * when you delete an instance from the type T.
     * When you use this method, it should remove the object from the remote repository.
     * @param instance which should be deleted
     */
    BaseService.prototype.delete = function (instance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteBy(instance[this.KeyField], this.KeyField)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This method should be invoked from outside the service,
     * when you delete an instance from the type T by it's key field.
     * When you use this method, it should remove the object from the remote repository.
     * @param key which instance should be deleted
     */
    BaseService.prototype.deleteBy = function (key, field) {
        if (field === void 0) { field = this.KeyField; }
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findBy(key, field).toPromise()];
                    case 1:
                        instance = _a.sent();
                        this._deleteSource.next(instance);
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseService.prototype.setPager = function (count, page) {
        if (count === void 0) { count = 15; }
        if (page === void 0) { page = 0; }
        this._pagerEvent.next({ count: count, page: page });
    };
    BaseService.prototype.orderBy = function (column, direction) {
        if (direction) {
            this._orderEvent.next({ orderField: column, orderDirection: direction });
        }
        else {
            this._orderEvent.next(undefined);
        }
    };
    /**
     * Returns with the first entity with the given key field
     * @returns instance as observable
     */
    BaseService.prototype.findBy = function (value, field) {
        var _this = this;
        if (field === void 0) { field = this.KeyField; }
        return this.filterExisting(function (instance) { return _this.getValue(instance, field) === value; })
            .pipe(operators_1.map(function (arr) { return (arr.length > 0 ? arr[0] : undefined); }))
            .pipe(operators_1.first());
    };
    /**
     * Returns the KEYFIELD value from the given instance
     * @returns the value of the key field
     */
    BaseService.prototype.getValue = function (instance, field) {
        if (field === void 0) { field = this.KeyField; }
        return instance[field];
    };
    /**
     * External sources can subscribe for data count change
     */
    BaseService.prototype.subscribeDataCount = function () {
        return this.dataCount.asObservable();
    };
    // /**
    //  * Returns the KEYFIELD value from the given instance
    //  * @returns the value of the key field
    //  */
    // getValues(field: keyof T = this.KeyField): Array<T[keyof T]> {
    //   return this.data.map(this.getValue.bind(this));
    // }
    /**
     * This method should be invoked from inside the service,
     * when you load multiple instances from the type T.
     * When you use this method, add an array to the local data source.
     * @param instances Array of newly added instances
     */
    BaseService.prototype.loadQuery = function (instances) {
        this._loadQueryToSource.next(instances);
    };
    /**
     * This method should be invoked from inside the service,
     * when you load single instance from the type T.
     * When you use this method, add an instance to the local data source.
     * @param instance Instance of newly added instances
     */
    BaseService.prototype.loadSingle = function (instance) {
        this._loadSingleToSource.next(instance);
    };
    Object.defineProperty(BaseService.prototype, "dataSource", {
        /**
         * @returns the data source as an observable
         */
        get: function () {
            return this._dataSource.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseService.prototype, "createSource", {
        /**
         * @returns the creation observable
         */
        get: function () {
            return this._createSource.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseService.prototype, "updateSource", {
        /**
         * @returns entity updates observable
         */
        get: function () {
            return this._updateSource.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseService.prototype, "deleteSource", {
        /**
         * @returns entity deletions observable
         * @todo it was protected, does it needed as a protected one?
         */
        get: function () {
            return this._deleteSource.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    BaseService.prototype._loadSourceHandler = function (instances, dataStore) {
        var _this = this;
        // TODO: Temp solution since old objects won't be removed with this if statement
        dataStore.length = 0;
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
    BaseService.prototype._loadSingleToSourceHandler = function (instance, dataStore) {
        var _this = this;
        if (!dataStore.find(function (x) { return x[_this.KeyField] === instance[_this.KeyField]; })) {
            dataStore.length = 0;
            dataStore.push(instance);
        }
        else {
            this._update(instance, dataStore);
        }
        return dataStore;
    };
    /**
     * Setup, and initialize RXJS sources
     */
    BaseService.prototype.setupRXSources = function () {
        var _this = this;
        this._changeSource
            .pipe(operators_1.scan(function (dataStore, operation) { return operation(dataStore); }, this.data))
            .subscribe(function (d) {
            _this._dataSource.next(d);
        });
        this._updateSource
            .pipe(operators_1.map(function (instance) { return function (dataStore) { return _this._update(instance, dataStore); }; }))
            .subscribe(this._changeSource);
        this._createSource
            .pipe(operators_1.map(function (instance) { return function (dataStore) {
            dataStore.push(instance);
            return dataStore;
        }; }))
            .subscribe(this._changeSource);
        this._loadQueryToSource
            .pipe(
        // tslint:disable-next-line:arrow-return-shorthand
        operators_1.map(function (instances) { return function (dataStore) {
            return _this._loadSourceHandler(instances, dataStore);
        }; }))
            .subscribe(this._changeSource);
        this._loadSingleToSource
            .pipe(
        // tslint:disable-next-line:arrow-return-shorthand
        operators_1.map(function (instance) { return function (dataStore) {
            return _this._loadSingleToSourceHandler(instance, dataStore);
        }; }))
            .subscribe(this._changeSource);
        this._deleteSource
            .pipe(operators_1.map(function (instanceToDelete) { return function (dataStore) {
            return dataStore.filter(function (instance) { return instance[_this.KeyField] !== instanceToDelete[_this.KeyField]; });
        }; }))
            .subscribe(this._changeSource);
    };
    /**
     * A helper method for handle the RXJS sources.
     * @param instance is the updated entity
     * @param dataStore is the service's private data array
     */
    BaseService.prototype._update = function (instance, dataStore) {
        var _this = this;
        var index = dataStore.findIndex(function (_instance) { return _instance[_this.KeyField] === instance[_this.KeyField]; });
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
