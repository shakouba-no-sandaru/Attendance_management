// declare module 'mysql2/promise' {
//     import * as mysql from 'mysql2';
//     export * from 'mysql2';
//   }
  

import * as mysql from 'mysql2';

declare module 'mysql2/promise' {
  export * from 'mysql2';
  export interface Connection extends mysql.Connection {
    query<T = any>(sql: string, values?: any): Promise<[T[], mysql.FieldPacket[]]>;
    execute<T = any>(sql: string, values?: any): Promise<[T[], mysql.FieldPacket[]]>;
  }
  export function createConnection(connectionUri: string | mysql.ConnectionOptions): Promise<Connection>;
  export function createPool(config: mysql.PoolOptions): mysql.Pool;
}
