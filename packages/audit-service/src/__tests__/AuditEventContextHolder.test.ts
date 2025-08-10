import { AuditEventContextHolder } from '../AuditEventContextHolder';
import { AuditLogElement } from '../AuditLogElement';

enum TinType {
    INDIVIDUAL = '0',
}

describe('AuditEventContextHolder', () => {
    it('should return a map of properties when fields are set', () => {
        const auditEventContextHolder = new AuditEventContextHolder();
        auditEventContextHolder.addValueToEventMap(AuditLogElement.USER_TIN, 'test-tin');
        auditEventContextHolder.addValueToEventMap(
            AuditLogElement.USER_TIN_TYPE,
            TinType.INDIVIDUAL
        );

        const expectedMap = new Map<string, unknown>();
        expectedMap.set('userTin', 'test-tin');
        expectedMap.set('userTinType', '0');

        const eventsMap = auditEventContextHolder.getEventContextProperties();
        expect(eventsMap).toEqual(expectedMap);
    });

    it('should return an empty map when no properties are set', () => {
        const auditEventContextHolder = new AuditEventContextHolder();
        const eventsMap = auditEventContextHolder.getEventContextProperties();
        expect(eventsMap).toEqual(new Map());
    });

    it('should handle detail properties correctly', () => {
        const auditEventContextHolder = new AuditEventContextHolder();
        auditEventContextHolder.addValueToEventDetailMap(
            AuditLogElement.DetailElement.STATE_ACCOUNT_ID,
            'test-account-id'
        );
        const eventsMap = auditEventContextHolder.getEventContextProperties();

        const expectedDetailMap = new Map<string, unknown>();
        expectedDetailMap.set('stateAccountId', 'test-account-id');

        const expectedMap = new Map<string, unknown>();
        expectedMap.set('detail', expectedDetailMap);

        expect(eventsMap).toEqual(expectedMap);
    });
});
