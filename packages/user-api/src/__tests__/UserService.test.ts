import { UserService } from '../services/UserService';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should return a user for a valid ID', async () => {
    const user = await userService.getUserById('1');
    expect(user).not.toBeNull();
    expect(user?.id).toBe('1');
  });

  it('should return null for an invalid ID', async () => {
    const user = await userService.getUserById('2');
    expect(user).toBeNull();
  });
});
