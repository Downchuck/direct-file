export enum EventId {
    TAX_RETURN_CREATE = "TAX_RETURN_CREATE",
    TAX_RETURN_UPDATE = "TAX_RETURN_UPDATE",
    TAX_RETURN_SUBMIT = "TAX_RETURN_SUBMIT",
    TAX_RETURN_SIGN = "TAX_RETURN_SIGN",
    TAX_RETURN_GET_STATUS = "TAX_RETURN_GET_STATUS",
    TAX_RETURN_GET_STATUS_INTERNAL = "TAX_RETURN_GET_STATUS_INTERNAL",
    TAX_RETURN_GET_BY_TAXRETURNID = "TAX_RETURN_GET_BY_TAXRETURNID",
    TAX_RETURN_GET_ALL_BY_USERID = "TAX_RETURN_GET_ALL_BY_USERID",
    TAX_RETURN_DELETE = "TAX_RETURN_DELETE",
    TAX_RETURN_PREVIEW = "TAX_RETURN_PREVIEW",
    TAX_RETURN_GET_POPULATED_DATA = "TAX_RETURN_GET_POPULATED_DATA",
    TAX_RETURN_GET_RETURN_PREFERENCES = "TAX_RETURN_GET_RETURN_PREFERENCES",
    USER_INFO_GET = "USER_INFO_GET",
    CREATE_STATE_TAX_AUTHORIZATION_CODE = "CREATE_STATE_TAX_AUTHORIZATION_CODE",
    PDF_READ = "PDF_READ",
    GET_STATE_PROFILE = "GET_STATE_PROFILE",
    CREATE_XML = "CREATE_XML",
    KEEP_ALIVE = "KEEP_ALIVE",
    GET_STATE_EXPORTED_FACTS_INTERNAL = "GET_STATE_EXPORTED_FACTS_INTERNAL",
}

export enum UserType {
    SYS = "SYS",
}

export enum EventStatus {
    SUCCESS = "00",
    FAILURE = "01",
}

export class EventPrincipal {
    constructor(
        public readonly userId: string | null,
        public readonly email: string | null,
        public readonly userType: UserType | null
    ) {}
}

export class Event {
    constructor(
        public readonly eventStatus: EventStatus,
        public readonly eventId: EventId,
        public readonly eventPrincipal: EventPrincipal,
        public readonly eventErrorMessage?: string,
        public readonly email?: string,
        public readonly mefSubmissionId?: string,
        public readonly taxPeriod?: string,
        public readonly userTin?: string,
        public readonly userTinType?: string,
        public readonly cyberOnly: boolean = true
    ) {}
}
