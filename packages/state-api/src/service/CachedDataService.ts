import { StateProfileRepository } from '../repository/StateProfileRepository';
import { StateProfile } from '../model/StateProfile';

export class CachedDataService {
  async getStateProfileByStateCode(stateCode: string): Promise<StateProfile | null> {
    const stateProfile = await StateProfileRepository.findByStateCode(stateCode);
    if (!stateProfile) {
      return null;
    }
    return stateProfile;
  }

  async getStateProfile(accountId: string): Promise<StateProfile | null> {
    const stateProfile = await StateProfileRepository.findOne({ where: { accountId } });
    if (!stateProfile) {
      return null;
    }
    return stateProfile;
  }

  async retrievePublicKeyFromCert(cert: string, expDate: Date): Promise<string> {
    // Mock implementation
    return 'mock-public-key';
  }
}
