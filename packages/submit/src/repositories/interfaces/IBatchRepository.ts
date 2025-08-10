import { SubmissionBatch } from '../../domain/SubmissionBatch';
import { UserSubmission } from '../../domain/UserSubmission';

export interface IBatchRepository {
  getCurrentWritingBatch(applicationId: string): Promise<number>;
  addSubmission(submissionBatch: SubmissionBatch, userSubmission: UserSubmission): Promise<void>;
  getSubmissionBatch(applicationId: string, batchId: number): Promise<SubmissionBatch | undefined>;
  getUnprocessedBatches(applicationId: string): Promise<SubmissionBatch[]>;
}
