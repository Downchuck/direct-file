import { AuditLogElement } from './AuditLogElement';

export class AuditEventContextHolder {
    private readonly auditEventProperties = new Map<string, unknown>();
    private readonly auditEventDetailProperties = new Map<string, unknown>();

    public getEventContextProperties(): Map<string, unknown> {
        const outputProperties = new Map<string, unknown>(this.auditEventProperties);
        if (this.auditEventDetailProperties.size > 0) {
            outputProperties.set(
                AuditLogElement.toString(AuditLogElement.DETAIL),
                new Map(this.auditEventDetailProperties)
            );
        }
        return outputProperties;
    }

    public addValueToEventMap(key: AuditLogElement, value: unknown): void {
        this.auditEventProperties.set(AuditLogElement.toString(key), value);
    }

    public addValueToEventDetailMap(key: AuditLogElement.DetailElement, value: string): void {
        this.auditEventDetailProperties.set(AuditLogElement.toString(key), value);
    }
}
