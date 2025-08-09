import { AppDataSource } from '../data-source';
import { AuthorizationCode } from '../model/AuthorizationCode';

export const AuthorizationCodeRepository = AppDataSource.getRepository(AuthorizationCode).extend({
  findByAuthorizationCode(authorizationCode: string): Promise<AuthorizationCode | null> {
    return this.findOne({ where: { authorizationCode } });
  },
});
