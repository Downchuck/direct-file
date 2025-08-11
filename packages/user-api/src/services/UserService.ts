import { User } from '../models/User';

export class UserService {
  public async getUserById(id: string): Promise<User | null> {
    // In a real implementation, this would fetch from a database.
    // For now, we'll return a mock user.
    if (id === '1') {
      return {
        id: '1',
        accessGranted: true,
        externalId: 'ext-123',
        emailCipherText: 'mock-email-cipher',
        tinCipherText: 'mock-tin-cipher',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  }
}
