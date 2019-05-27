import { BehaviorSubject, Observable } from 'rxjs';
import { HttpFilter, IFilterOperation, Order, OrderDirection, PagingOperation } from './interfaces';
export declare abstract class BaseService<T> {
    protected abstract readonly KeyField: keyof T;
    protected readonly _orderEvent: BehaviorSubject<Order<T>>;
    protected readonly _filterEvent: BehaviorSubject<Array<HttpFilter<T>>>;
    protected readonly _pagerEvent: BehaviorSubject<PagingOperation>;
    protected readonly dataCount: BehaviorSubject<number>;
    /**
     * @description Actual data storage, set to the initial state
     */
    private readonly data;
    private readonly _dataSource;
    private readonly _changeSource;
    private readonly _loadQueryToSource;
    private readonly _loadSingleToSource;
    private readonly _updateSource;
    private readonly _createSource;
    private readonly _deleteSource;
    constructor();
    /**
     * This method should be invoked from outside the service.
     * You should use this method for filter the data which is coming from the server.
     * @param _filter filter The operation you wanted to see
     * @returns a shared observable from the data query
     */
    filterExisting(_filter: IFilterOperation<T>): Observable<Array<T>>;
    /**
     * This method should be invoked from outside the service,
     * when you create a new instance from the type T. When you use this method,
     * it should save the object into the remote repository.
     * @param instance the instance which should be created
     */
    create(instance: T): Promise<void>;
    /**
     * This method should be invoked from outside the service,
     * when you update an instance from the type T.
     * When you use this method, it should save the object into the remote repository.
     * @param instance which should be updated
     */
    update(instance: T): Promise<void>;
    /**
     * This method should be invoked from outside the service,
     * when you delete an instance from the type T.
     * When you use this method, it should remove the object from the remote repository.
     * @param instance which should be deleted
     */
    delete(instance: T): Promise<void>;
    /**
     * This method should be invoked from outside the service,
     * when you delete an instance from the type T by it's key field.
     * When you use this method, it should remove the object from the remote repository.
     * @param key which instance should be deleted
     */
    deleteBy(key: T[keyof T], field?: keyof T): Promise<void>;
    setPager(count?: number, page?: number): void;
    orderBy(column: keyof T, direction: OrderDirection): void;
    /**
     * Returns with the first entity with the given key field
     * @returns instance as observable
     */
    findBy(value: T[keyof T], field?: keyof T): Observable<T>;
    /**
     * Returns the KEYFIELD value from the given instance
     * @returns the value of the key field
     */
    getValue(instance: T, field?: keyof T): T[keyof T];
    /**
     * External sources can subscribe for data count change
     */
    subscribeDataCount(): Observable<number>;
    /**
     * This method should be invoked from inside the service,
     * when you load multiple instances from the type T.
     * When you use this method, add an array to the local data source.
     * @param instances Array of newly added instances
     */
    loadQuery(instances: Array<T>): void;
    /**
     * This method should be invoked from inside the service,
     * when you load single instance from the type T.
     * When you use this method, add an instance to the local data source.
     * @param instance Instance of newly added instances
     */
    loadSingle(instance: T): void;
    /**
     * @returns the data source as an observable
     */
    readonly dataSource: Observable<Array<T>>;
    /**
     * @returns the creation observable
     */
    readonly createSource: Observable<T>;
    /**
     * @returns entity updates observable
     */
    readonly updateSource: Observable<T>;
    /**
     * @returns entity deletions observable
     * @todo it was protected, does it needed as a protected one?
     */
    readonly deleteSource: Observable<T>;
    protected _loadSourceHandler(instances: Array<T>, dataStore: Array<T>): Array<T>;
    protected _loadSingleToSourceHandler(instance: T, dataStore: Array<T>): Array<T>;
    /**
     * Setup, and initialize RXJS sources
     */
    protected setupRXSources(): void;
    /**
     * A helper method for handle the RXJS sources.
     * @param instance is the updated entity
     * @param dataStore is the service's private data array
     */
    private _update;
}
