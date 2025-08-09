export class StateApiS3Client {
  async getTaxReturnXml(taxYear: number, taxReturnUuid: string, submissionId: string): Promise<string> {
    // Mock implementation
    return '<xml>mock tax return</xml>';
  }
}
