import {
  ReplaySubject,
  Observable,
  BehaviorSubject
} from 'rxjs';

export abstract class BaseService<T> {

  /**
   * The primary KEY field's name of the T typed instance
   */
  protected abstract get KeyField(): string;

  /**
   * The OData endpoint name
   */
  protected abstract get EndpointName(): string;
  protected readonly INSTANCE_NAME;

  private data: T[] = [];
  private _dataSource: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  private _changeSource: ReplaySubject<IMapOperation<T>> = new ReplaySubject<IMapOperation<T>>(1);
  private _loadSource: ReplaySubject<T[]> = new ReplaySubject<T[]>(1);
  private _updateSource: ReplaySubject<T> = new ReplaySubject<T>(1);
  private _createSource: ReplaySubject<T> = new ReplaySubject<T>(1);
  private _deleteSource: ReplaySubject<T> = new ReplaySubject<T>(1);

  /**
   * Instance name for future usage
   */

  constructor(protected TypeName: string = null) {
    this.INSTANCE_NAME = TypeName;
    this.setupRXSources();
  }

  /**
   * This method should be invoked from outside the service.
   * You should use this method for filter the data which is coming from the server.
   * @param IFilterOperation<T> filter The operation you wanted to see
   * @returns {Observable<T[]>} a shared observable from the data query
   */
  public filter(filter: IFilterOperation<T>): Observable<T[]> {
    return this._dataSource.map((m) => m.filter(filter)).share();
  }

  /**
   * This method should be invoked from outside the service,
   * when you create a new instance from the type T. When you use this method,
   * it should save the object into the remote repository.
   * @param T instance
   */
  public create(instance: T): void {
    this._createSource.next(instance);
  }

  /**
   * This method should be invoked from outside the service,
   * when you update an instance from the type T.
   * When you use this method, it should save the object into the remote repository.
   * @param T instance
   */
  public update(instance: T): void {
    this._updateSource.next(instance);
  }

  /**
   * This method should be invoked from outside the service,
   * when you delete an instance from the type T.
   * When you use this method, it should remove the object from the remote repository.
   * @param T instance
   */
  public delete(instance: T): void {
    this.deleteByKey(instance[this.KeyField]);
  }

  /**
   * This method should be invoked from outside the service,
   * when you delete an instance from the type T by it's key field.
   * When you use this method, it should remove the object from the remote repository.
   * @param T instance
   */
  public deleteByKey(key: any): void {
    this.find(key).first().subscribe(this._deleteSource);
  }

  /**
   * Returns with the first entity with the given key field
   * @return {T} instance
   */
  public find(key: any): Observable<T> {
    return this.filter((instance: T) => this.getKey(instance) === key)
      .map((arr: T[]) => arr.length > 0 ? arr[0] : null);
  }

  /**
   * Gets all the KEYFIELD values from this repository
   * @return {any[]} KEYFIELD's value array
   */
  public getKeys(): any[] {
    return this.data.map(this.getKey.bind(this));
  }

  /**
   * Returns the KEYFIELD value from the given instance
   * @return {any} KEYFIELD value
   */
  public getKey(instance: T): any {
    return instance[this.KeyField];
  }

  /**
   * Clears the local data from the repository
   */
  public clearAll(): void {
    this.getKeys().forEach(this.deleteByKey.bind(this));
  }

  /**
   * This method should be invoked from inside the service,
   * when you load multiple instances from the type T.
   * When you use this method, add an array to the local data source.
   * @param instances T[] Array of newly added instances
   */
  protected load(instances: T[]): void {
    this._loadSource.next(instances);
  }

  /**
   * @return {Observable<T[]>}
   */
  public get dataSource(): Observable<T[]> {
    return this._dataSource.asObservable();
  }

  public get createSource(): Observable<T> {
    return this._createSource.asObservable();
  }

  public get updateSource(): Observable<T> {
    return this._updateSource.asObservable();
  }

  protected get deleteSource(): Observable<T> {
    return this._deleteSource.asObservable();
  }
  /**
   * Error handling method (only logging)
   */
  protected errorHandler() {
    console.error('{arguments} => ', arguments);
  }

  /**
   * Setup, and initialize RXJS sources
   */
  protected setupRXSources() {
    this._changeSource.scan((dataStore, operation) => {
      return operation(dataStore);
    }, this.data).subscribe(this._dataSource);

    this._updateSource.map((instance: T) => {
      return (dataStore) => {
        return this._update(instance, dataStore);
      };
    }).subscribe(this._changeSource);

    this._createSource.map((instance: T) => {
      return (dataStore) => {
        dataStore.push(instance);
        return dataStore;
      };
    }).subscribe(this._changeSource);

    this._loadSource.map((instances: T[]) => {
      return (dataStore): T[] => {
        instances.forEach((instance) => {
          if (!dataStore.find((x) => x[this.KeyField] === instance[this.KeyField])) {
            dataStore.push(instance);
          } else {
            this._update(instance, dataStore);
          }
        });
        return dataStore;
      };
    }).subscribe(this._changeSource);

    this._deleteSource.map((instanceToDelete: T) => {
      return (dataStore) => {
        return dataStore.filter((instance) => {
          return instance[this.KeyField] !== instanceToDelete[this.KeyField];
        });
      };
    }).subscribe(this._changeSource);
  }

  /**
   * A helper method for handle the RXJS sources.
   * @param T instance is the updated entity
   * @param any dataStore is the service's private data array
   */
  private _update(instance: T, dataStore: any): T[] {
    let index = dataStore.findIndex((i) => {
      return i[this.KeyField] === instance[this.KeyField];
    });

    if (index >= 0) {
      dataStore[index] = instance;
    } else {
      throw new Error('Instance not found in the data source!');
    }
    return dataStore;
  }
}

export interface IFilterOperation<T> extends Function {
  (instance: T): boolean;
}
export interface IMapOperation<T> extends Function {
  (instance: T[]): T[];
}
