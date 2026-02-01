import { getDataSource } from '@/database/client';

export class DatabaseModule {
  async bootstrap(): Promise<void> {
    try {
      console.log('[DataBase] Inicializando MySQL...');
      await getDataSource();
      console.log('[DataBase] MySQL Inicializado com Sucesso!');
    } catch (error) {
      console.error('[DataBase] Erro ao conectar:', error);
    }
  }
}
