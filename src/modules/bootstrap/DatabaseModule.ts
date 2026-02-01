import { getDataSource } from '@/database/client';
import { logger } from '@/shared/logger';

export class DatabaseModule {
  async bootstrap(): Promise<void> {
    try {
      logger.info('DataBase', 'Inicializando MySQL...');
      await getDataSource();
      logger.info('DataBase', 'MySQL Inicializado com Sucesso!');
    } catch (error) {
      logger.error('DataBase', error);
    }
  }
}
