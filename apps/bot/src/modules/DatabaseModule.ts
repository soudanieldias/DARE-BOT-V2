import { getDataSource } from '@dare-bot/database';
import { logger } from '@/shared/logger';

export class DatabaseModule {
  async bootstrap(): Promise<void> {
    try {
      logger.info('DataBase', 'Inicializando PostgreSQL...');
      await getDataSource();
      logger.info('DataBase', 'PostgreSQL Inicializado com Sucesso!');
    } catch (error) {
      logger.error('DataBase', error);
    }
  }
}
