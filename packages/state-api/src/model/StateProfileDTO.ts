export interface StateProfileDTO {
  stateCode: string;
  taxSystemName: string;
  landingUrl: string;
  defaultRedirectUrl?: string;
  departmentOfRevenueUrl?: string;
  filingRequirementsUrl?: string;
  transferCancelUrl?: string;
  waitingForAcceptanceCancelUrl?: string;
  certLocation?: string;
  acceptedOnly: boolean;
  certExpirationDate?: Date;
  customFilingDeadline?: string;
  archived: boolean;
}
