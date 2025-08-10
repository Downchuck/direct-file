import * as fs from 'fs/promises';
import * as path from 'path';
import { IBatchRepository } from './interfaces/IBatchRepository';
import { SubmissionBatch } from '../domain/SubmissionBatch';
import { UserSubmission } from '../domain/UserSubmission';
import { ISynchronousDocumentStoreService } from '../services/interfaces/ISynchronousDocumentStoreService';

export class DocumentStorageBatchRepository implements IBatchRepository {
  private batchesDir = path.join(__dirname, '..', 'batches');

  constructor(private synchronousDocumentStoreService: ISynchronousDocumentStoreService) {
    this.init();
  }

  private async init() {
    try {
      await fs.mkdir(this.batchesDir, { recursive: true });
    } catch (error) {
      console.error('Error creating batches directory:', error);
    }
  }

  async getCurrentWritingBatch(applicationId: string): Promise<number> {
    const taxYear = new Date().getFullYear() - 1;
    const taxYearDir = path.join(this.batchesDir, applicationId, taxYear.toString());

    try {
      const entries = await fs.readdir(taxYearDir, { withFileTypes: true });
      const batchDirs = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => parseInt(entry.name, 10))
        .filter((num) => !isNaN(num));

      if (batchDirs.length === 0) {
        return 0;
      }

      const mostRecentBatch = Math.max(...batchDirs);
      // In a real scenario, we would check the age and size of the batch.
      // For now, we will just return the most recent batch number.
      return mostRecentBatch;
    } catch (error) {
      // If the directory doesn't exist, it means there are no batches yet.
      return 0;
    }
  }

  async addSubmission(submissionBatch: SubmissionBatch, userSubmission: UserSubmission): Promise<void> {
    const taxYear = new Date().getFullYear() - 1;
    // TODO: get application id from a config object
    const submissionDir = path.join(
      this.batchesDir,
      'some-application-id',
      taxYear.toString(),
      submissionBatch.batchId.toString(),
      userSubmission.submissionId
    );

    await fs.mkdir(submissionDir, { recursive: true });

    const manifest = await this.synchronousDocumentStoreService.getObjectAsString(userSubmission.manifestXmlPath);
    const submission = await this.synchronousDocumentStoreService.getObjectAsString(userSubmission.submissionXmlPath);
    const userContext = await this.synchronousDocumentStoreService.getObjectAsString(userSubmission.userContextPath);

    await fs.writeFile(path.join(submissionDir, 'manifest.xml'), manifest);
    await fs.writeFile(path.join(submissionDir, 'submission.xml'), submission);
    await fs.writeFile(path.join(submissionDir, 'userContext.json'), userContext);
  }
  async getSubmissionBatch(applicationId: string, batchId: number): Promise<SubmissionBatch | undefined> {
    const taxYear = new Date().getFullYear() - 1;
    const batchDir = path.join(
      this.batchesDir,
      applicationId,
      taxYear.toString(),
      batchId.toString()
    );

    try {
      await fs.access(batchDir);
      return new SubmissionBatch(batchId, batchDir);
    } catch (error) {
      return undefined;
    }
  }

  async getUnprocessedBatches(applicationId: string): Promise<SubmissionBatch[]> {
    const taxYear = new Date().getFullYear() - 1;
    const taxYearDir = path.join(this.batchesDir, applicationId, taxYear.toString());
    const currentBatch = await this.getCurrentWritingBatch(applicationId);

    try {
      const entries = await fs.readdir(taxYearDir, { withFileTypes: true });
      const batchDirs = entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => parseInt(entry.name, 10))
        .filter((num) => !isNaN(num) && num !== currentBatch);

      return batchDirs.map(batchId => new SubmissionBatch(batchId, path.join(taxYearDir, batchId.toString())));
    } catch (error) {
      return [];
    }
  }
}
