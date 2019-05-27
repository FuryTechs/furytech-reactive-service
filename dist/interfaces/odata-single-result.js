"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataSingleResult = /** @class */ (function () {
    function ODataSingleResult() {
        /**
         * The query result in an array
         */
        this.value = undefined;
    }
    Object.defineProperty(ODataSingleResult.prototype, "Context", {
        /**
         * The '@odata.context' variable returned by the OData service
         */
        get: function () {
            return this['@odata.context'];
        },
        enumerable: true,
        configurable: true
    });
    return ODataSingleResult;
}());
exports.ODataSingleResult = ODataSingleResult;
