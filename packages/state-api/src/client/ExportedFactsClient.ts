export class ExportedFactsClient {
  async getExportedFacts(
    submissionId: string,
    stateCode: string,
    accountId: string
  ): Promise<{ exportedFacts: Record<string, any> }> {
    // Mock implementation
    return { exportedFacts: { mock: 'fact' } };
  }
}
