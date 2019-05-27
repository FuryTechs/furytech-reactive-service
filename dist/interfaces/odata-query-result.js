"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataQueryResult = /** @class */ (function () {
    function ODataQueryResult() {
        /**
         * The query result in an array
         */
        this.value = [];
    }
    Object.defineProperty(ODataQueryResult.prototype, "Context", {
        /**
         * The '@odata.context' variable returned by the OData service
         */
        get: function () {
            return this['@odata.context'];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ODataQueryResult.prototype, "Count", {
        /**
         * The '@odata.count' variable returned by the OData service
         */
        get: function () {
            return this['@odata.count'];
        },
        enumerable: true,
        configurable: true
    });
    return ODataQueryResult;
}());
exports.ODataQueryResult = ODataQueryResult;
