export class DirectFileClient {
  async getStatus(
    taxYear: number,
    taxReturnUuid: string,
    submissionId: string
  ): Promise<{ status: string; exists: boolean }> {
    // Mock implementation
    return { status: 'accepted', exists: true };
  }
}
