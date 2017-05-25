import { Observable } from 'rxjs/Rx';
export declare abstract class BaseService<T> {
    protected TypeName: string;
    /**
     * The primary KEY field's name of the T typed instance
     */
    protected readonly abstract KeyField: string;
    /**
     * The OData endpoint name
     */
    protected readonly abstract EndpointName: string;
    protected readonly INSTANCE_NAME: any;
    private data;
    private _dataSource;
    private _changeSource;
    private _loadSource;
    private _updateSource;
    private _createSource;
    private _deleteSource;
    /**
     * Instance name for future usage
     */
    constructor(TypeName?: string);
    /**
     * This method should be invoked from outside the service.
     * You should use this method for filter the data which is coming from the server.
     * @param IFilterOperation<T> filter The operation you wanted to see
     * @returns {Observable<T[]>} a shared observable from the data query
     */
    filter(filter: IFilterOperation<T>): Observable<T[]>;
    /**
     * This method should be invoked from outside the service,
     * when you create a new instance from the type T. When you use this method,
     * it should save the object into the remote repository.
     * @param T instance
     */
    create(instance: T): void;
    /**
     * This method should be invoked from outside the service,
     * when you update an instance from the type T.
     * When you use this method, it should save the object into the remote repository.
     * @param T instance
     */
    update(instance: T): void;
    /**
     * This method should be invoked from outside the service,
     * when you delete an instance from the type T.
     * When you use this method, it should remove the object from the remote repository.
     * @param T instance
     */
    delete(instance: T): void;
    /**
     * This method should be invoked from outside the service,
     * when you delete an instance from the type T by it's key field.
     * When you use this method, it should remove the object from the remote repository.
     * @param T instance
     */
    deleteByKey(key: any): void;
    /**
     * Returns with the first entity with the given key field
     * @return {T} instance
     */
    find(key: any): Observable<T>;
    /**
     * Gets all the KEYFIELD values from this repository
     * @return {any[]} KEYFIELD's value array
     */
    getKeys(): any[];
    /**
     * Returns the KEYFIELD value from the given instance
     * @return {any} KEYFIELD value
     */
    getKey(instance: T): any;
    /**
     * Clears the local data from the repository
     */
    clearAll(): void;
    /**
     * This method should be invoked from inside the service,
     * when you load multiple instances from the type T.
     * When you use this method, add an array to the local data source.
     * @param instances T[] Array of newly added instances
     */
    protected load(instances: T[]): void;
    /**
     * @return {Observable<T[]>}
     */
    readonly dataSource: Observable<T[]>;
    /**
     * @return {Observable<T[]>}
     */
    readonly createSource: Observable<T>;
    /**
     * @return {Observable<T[]>}
     */
    readonly updateSource: Observable<T>;
    /**
     * @return {Observable<T[]>}
     */
    protected readonly deleteSource: Observable<T>;
    /**
     * Error handling method (only logging)
     */
    protected errorHandler(): void;
    /**
     * Setup, and initialize RXJS sources
     */
    protected setupRXSources(): void;
    /**
     * A helper method for handle the RXJS sources.
     * @param T instance is the updated entity
     * @param any dataStore is the service's private data array
     */
    private _update(instance, dataStore);
}
export interface IFilterOperation<T> extends Function {
    (instance: T): boolean;
}
export interface IMapOperation<T> extends Function {
    (instance: T[]): T[];
}
