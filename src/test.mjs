// import { createConnection } from "mysql";
// import * as fs from "fs";

// export async function resetDB() {
//   const connection = createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     multipleStatements: true,
//   });
//   connection.connect();
//   connection.query("DROP DATABASE IF EXISTS test_db");
//   connection.query("CREATE DATABASE test_db");
//   connection.query("use test_db");
//   // test.dump を初期データとして入れるよ
//   const seedSQLFile = fs.readFileSync(
//     "./docker/compose/db/init/test.dump",
//     "utf8"
//   );
//   const queries = seedSQLFile.split(";");
//   for (const query of queries) {
//     await new Promise<void>((resolve) =>
//       connection.query(query).on("result", resolve)
//     );
//   }
//   connection.end();
// }


// これはESMの記述
// データベース接続設定
import { createConnection } from 'mysql2/promise';

// export const getSqlData = async (): Promise<any[]> => {
    async function getSqlData() {
    // データベース接続設定値
    const connection = await createConnection({
        host: 'localhost',
        user: 'h_yamada',
        password: 'H_yamada134',
        database: 'kintai_management',
    });

    try {
        console.log('データベースに接続されました。');

        // データを取得する関数
        const [rows] = await connection.query('SELECT * FROM employee_master');
        console.log('取得したデータ: ', rows);

        // クエリ結果を返却
        // return rows as any[];
    } catch (err) {
        console.error('クエリエラー: ', err);
        // return [];
    } finally {
        // データベース接続終了
        await connection.end();
        console.log('データベース接続を終了しました。');
    }
    }
// };
getSqlData();