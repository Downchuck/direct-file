import { AuditEventContextHolder } from './AuditEventContextHolder';
import { AuditLogElement } from './AuditLogElement';
import { Event, EventStatus } from './events';
import { Logger } from './Logger';

export class AuditService {
    constructor(
        private readonly auditEventContextHolder: AuditEventContextHolder,
        private readonly logger: Logger
    ) {}

    public addAuditPropertiesToMDC(event: Event): Map<string, string> {
        const mdc = new Map<string, string>();
        mdc.set(AuditLogElement.toString(AuditLogElement.EVENT_STATUS), event.eventStatus);
        mdc.set(AuditLogElement.toString(AuditLogElement.EVENT_ID), event.eventId);

        if (event.eventPrincipal.userType) {
            mdc.set(AuditLogElement.toString(AuditLogElement.USER_TYPE), event.eventPrincipal.userType);
        }
        if (event.eventErrorMessage) {
            mdc.set(AuditLogElement.toString(AuditLogElement.EVENT_ERROR_MESSAGE), event.eventErrorMessage);
        }
        return mdc;
    }

    public addEventProperty(property: AuditLogElement, value: unknown): void {
        if (value !== null && value !== undefined) {
            this.auditEventContextHolder.addValueToEventMap(property, value);
        }
    }

    public performLog(): void {
        const properties = this.auditEventContextHolder.getEventContextProperties();
        const eventStatus = properties.get(AuditLogElement.toString(AuditLogElement.EVENT_STATUS));

        const logMethod = eventStatus === EventStatus.SUCCESS ? this.logger.info : this.logger.error;

        properties.set(AuditLogElement.toString(AuditLogElement.CYBER_ONLY), true);

        const logObject: {[key: string]: unknown} = {};
        properties.forEach((value, key) => {
            logObject[key] = value;
        });

        logMethod("audit event", logObject);
    }
}
