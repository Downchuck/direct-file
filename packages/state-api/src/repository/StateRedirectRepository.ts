import { AppDataSource } from '../data-source';
import { StateRedirect } from '../model/StateRedirect';

export const StateRedirectRepository = AppDataSource.getRepository(StateRedirect).extend({});
