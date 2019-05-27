export declare class ODataQueryResult<T> {
    '@odata.context': string;
    '@odata.count': number;
    /**
     * The '@odata.context' variable returned by the OData service
     */
    readonly Context: string;
    /**
     * The '@odata.count' variable returned by the OData service
     */
    readonly Count: number;
    /**
     * The query result in an array
     */
    value: Array<T>;
}
