import { TaxReturnIdAndSubmissionId } from '@df/data-models/src/models/TaxReturnIdAndSubmissionId';

export class SqsConnectionSetupService {
  constructor() {
    // TODO: Initialize SQS client
  }

  setup(messageListener: (message: any) => void): Promise<void> {
    throw new Error('Method not implemented.');
  }

  sendListOfSubmissionAndTaxReturnIdsToPendingSubmissionQueue(
    taxReturnIdAndSubmissionIds: TaxReturnIdAndSubmissionId[]
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }

  cleanup(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
