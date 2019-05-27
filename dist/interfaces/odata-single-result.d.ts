export declare class ODataSingleResult<T> {
    '@odata.context': string;
    /**
     * The '@odata.context' variable returned by the OData service
     */
    readonly Context: string;
    /**
     * The query result in an array
     */
    value: T;
}
