export enum AuditLogElement {
    CYBER_ONLY = "CYBER_ONLY",
    DETAIL = "DETAIL",
    EMAIL = "EMAIL",
    EVENT_ERROR_MESSAGE = "EVENT_ERROR_MESSAGE",
    EVENT_ID = "EVENT_ID",
    EVENT_STATUS = "EVENT_STATUS",
    EVENT_TYPE = "EVENT_TYPE",
    GOOGLE_ANALYTICS_ID = "GOOGLE_ANALYTICS_ID",
    MEF_SUBMISSION_ID = "MEF_SUBMISSION_ID",
    XXX_CODE = "XXX_CODE",
    REMOTE_ADDRESS = "REMOTE_ADDRESS",
    REQUEST_METHOD = "REQUEST_METHOD",
    REQUEST_URI = "REQUEST_URI",
    RESPONSE_STATUS_CODE = "RESPONSE_STATUS_CODE",
    SADI_TID_HEADER = "SADI_TID_HEADER",
    SADI_USER_UUID = "SADI_USER_UUID",
    STATE_ID = "STATE_ID",
    TAX_PERIOD = "TAX_PERIOD",
    TAX_RETURN_ID = "TAX_RETURN_ID",
    TIN_TYPE = "TIN_TYPE",
    TIMESTAMP = "TIMESTAMP",
    USER_TIN = "USER_TIN",
    USER_TIN_TYPE = "USER_TIN_TYPE",
    USER_TYPE = "USER_TYPE",
    DATA_IMPORT_BEHAVIOR = "DATA_IMPORT_BEHAVIOR",
}

export namespace AuditLogElement {
    export enum DetailElement {
        STATE_ACCOUNT_ID = "STATE_ACCOUNT_ID",
        MESSAGE = "MESSAGE",
    }

    function toCamelCase(str: string): string {
        return str.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    }

    export function toString(element: AuditLogElement | DetailElement): string {
        return toCamelCase(element.toString());
    }
}
