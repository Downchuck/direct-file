import { AppDataSource } from '../data-source';
import { StateProfile } from '../model/StateProfile';

export const StateProfileRepository = AppDataSource.getRepository(StateProfile).extend({
  findByStateCode(stateCode: string): Promise<StateProfile | null> {
    return this.findOne({ where: { stateCode } });
  },
});
