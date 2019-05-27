/**
 * Interface for use a filter operation
 */
export declare type IFilterOperation<T> = (instance: T, index: number) => boolean;
export declare type FilterType = 'eq' | 'contains' | 'gte' | 'lte' | 'gt' | 'lt';
/**
 * @description this interface will be used to define one filter for the Http requests
 */
export interface HttpFilter<T> {
    value: T[keyof T];
    field: keyof T;
    filterType: FilterType;
}
