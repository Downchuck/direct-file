import { AuditService } from '../AuditService';
import { AuditEventContextHolder } from '../AuditEventContextHolder';
import { AuditLogElement } from '../AuditLogElement';
import { Event, EventId, EventPrincipal, EventStatus, UserType } from '../events';
import { Logger } from '../Logger';

describe('AuditService', () => {
    let auditService: AuditService;
    let auditEventContextHolder: AuditEventContextHolder;
    let logger: Logger;

    beforeEach(() => {
        auditEventContextHolder = new AuditEventContextHolder();
        logger = {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
        };
        auditService = new AuditService(auditEventContextHolder, logger);
    });

    it('should add event property to context holder', () => {
        const addValueToEventMapSpy = jest.spyOn(auditEventContextHolder, 'addValueToEventMap');
        auditService.addEventProperty(AuditLogElement.USER_TIN, 'test-tin');
        expect(addValueToEventMapSpy).toHaveBeenCalledWith(AuditLogElement.USER_TIN, 'test-tin');
    });

    it('should add audit properties to MDC', () => {
        const event = new Event(
            EventStatus.SUCCESS,
            EventId.TAX_RETURN_CREATE,
            new EventPrincipal('user-id', 'test@test.com', UserType.SYS),
            'error message'
        );
        const mdc = auditService.addAuditPropertiesToMDC(event);
        expect(mdc.get('eventStatus')).toBe('00');
        expect(mdc.get('eventId')).toBe('TAX_RETURN_CREATE');
        expect(mdc.get('userType')).toBe('SYS');
        expect(mdc.get('eventErrorMessage')).toBe('error message');
    });

    it('should log with info level on success', () => {
        const event = new Event(
            EventStatus.SUCCESS,
            EventId.TAX_RETURN_CREATE,
            new EventPrincipal('user-id', 'test@test.com', UserType.SYS)
        );
        auditService.addAuditPropertiesToMDC(event);
        auditEventContextHolder.addValueToEventMap(
            AuditLogElement.EVENT_STATUS,
            EventStatus.SUCCESS
        );
        auditService.performLog();
        expect(logger.info).toHaveBeenCalled();
    });

    it('should log with error level on failure', () => {
        const event = new Event(
            EventStatus.FAILURE,
            EventId.TAX_RETURN_CREATE,
            new EventPrincipal('user-id', 'test@test.com', UserType.SYS)
        );
        auditService.addAuditPropertiesToMDC(event);
        auditEventContextHolder.addValueToEventMap(
            AuditLogElement.EVENT_STATUS,
            EventStatus.FAILURE
        );
        auditService.performLog();
        expect(logger.error).toHaveBeenCalled();
    });
});
