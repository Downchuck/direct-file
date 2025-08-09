import { AppDataSource } from '../data-source';
import { StateLanguage } from '../model/StateLanguage';

export const StateLanguageRepository = AppDataSource.getRepository(StateLanguage).extend({});
