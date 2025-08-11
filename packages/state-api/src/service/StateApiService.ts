import { v4 as uuidv4 } from 'uuid';
import { AuthorizationCodeRepository } from '../repository/AuthorizationCodeRepository';
import { AuthorizationTokenService } from './AuthorizationTokenService';
import { CachedDataService } from './CachedDataService';
import { DirectFileClient } from '../client/DirectFileClient';
import { ExportedFactsClient } from '../client/ExportedFactsClient';
import { StateApiS3Client } from '../client/StateApiS3Client';
import { AuthorizationCode } from '../model/AuthorizationCode';
import { StateAndAuthCode } from '../model/StateAndAuthCode';
import { TaxReturnXml } from '../model/TaxReturnXml';
import { EncryptData } from '../model/EncryptData';
import { StateProfileDTO } from '../model/StateProfileDTO';
import { StateProfile } from '../model/StateProfile';
import { AuthCodeRequest } from '../model/AuthCodeRequest';
import { TaxReturnToExport } from '../model/TaxReturnToExport';

export class StateApiService {
  private readonly authorizationCodeExpiresInterval = 600;

  constructor(
    private readonly acRepo: typeof AuthorizationCodeRepository,
    private readonly authorizationTokenService: AuthorizationTokenService,
    private readonly dfClient: DirectFileClient,
    private readonly efClient: ExportedFactsClient,
    private readonly cachedDS: CachedDataService,
    private readonly stateApiS3Client: StateApiS3Client
  ) {}

  async createAuthorizationCode(acq: AuthCodeRequest): Promise<string> {
    const { stateCode, taxYear, taxReturnUuid, submissionId } = acq;
    const stateProfile = await this.cachedDS.getStateProfileByStateCode(stateCode);
    if (!stateProfile) {
      throw new Error(`State profile not found for state code: ${stateCode}`);
    }
    const status = await this.dfClient.getStatus(taxYear, taxReturnUuid, submissionId);

    const isAccepted = status.status.toLowerCase() === 'accepted';
    const isPending = status.status.toLowerCase() === 'pending';

    const submissionOk = status.exists && (isAccepted || (!stateProfile.acceptedOnly && isPending));

    if (submissionOk) {
      const code = uuidv4();
      const ac = new AuthorizationCode();
      ac.authorizationCode = code;
      ac.taxReturnUuid = taxReturnUuid;
      ac.taxYear = taxYear;
      ac.expiresAt = new Date(Date.now() + this.authorizationCodeExpiresInterval * 1000);
      ac.stateCode = stateCode;
      ac.submissionId = submissionId;

      await this.acRepo.save(ac);
      return code;
    } else {
      if (!status.exists) {
        throw new Error('Tax return not found');
      } else if (stateProfile.acceptedOnly) {
        throw new Error('Tax return not accepted');
      } else {
        throw new Error('Tax return not accepted or pending');
      }
    }
  }

  async authorize(saCode: StateAndAuthCode): Promise<AuthorizationCode> {
    const authorizationCode = await this.acRepo.findByAuthorizationCode(saCode.authorizationCode);

    if (!authorizationCode) {
      throw new Error('Authorization code not found');
    }

    if (authorizationCode.stateCode !== saCode.stateCode) {
      throw new Error('Mismatched state code');
    }

    if (authorizationCode.expiresAt.getTime() < Date.now()) {
      throw new Error('Authorization code has expired');
    }

    return authorizationCode;
  }

  async getStateProfile(stateCode: string): Promise<StateProfile> {
    const stateProfile = await this.cachedDS.getStateProfileByStateCode(stateCode);
    if (!stateProfile) {
      throw new Error(`State profile not found for state code: ${stateCode}`);
    }
    return stateProfile;
  }

  // TODO: Implement other methods
}
