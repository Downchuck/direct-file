export interface TaxReturnToExport {
  status: string;
  submissionId: string;
  xml: string;
  exportedFacts: Record<string, any>;
}
