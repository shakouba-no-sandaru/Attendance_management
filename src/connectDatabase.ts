//connectDatabase.ts
// データベース接続設定
import express from 'express';
import cors from 'cors';
import { createConnection } from 'mysql2/promise';
import * as queryDataAcquisition from './queryDataAcquisition.js';
import { setting_values } from './config.js';

// フロントエンドからのリクエストを許可
const app = express();
app.use(cors());
app.use(express.json());

const executeQuery = async (queryFunction: (...args: any[]) => string, ...params: any[]) => {
    // データベース接続設定値
    const connection = await createConnection({
        host: setting_values.db_host,
        user: setting_values.db_user,
        password: setting_values.db_password,
        database: setting_values.db_name,
    });

    try {
        console.log('データベースに接続されました。');
        // データを取得する関数
        const query = queryFunction();
        console.log('実行するクエリ: ', query);
        const [rows] = await connection.query(query, params);
        console.log('QUERY RESULT: ', rows);

        return rows;
        // クエリ結果を返却
    } catch (err) {
        console.error('クエリエラー: ', err);
    } finally {
        // データベース接続終了
        await connection.end();
        console.log('データベース接続を終了しました。');
    }
}

// 取得用APIエンドポイントの定義
app.get('/api/getdatabase', async (req, res) => {
    try {
        console.log('DB取得処理', req.query);
        // クエリ名をリクエストクエリから取得
        const queryName = req.query.queryName as string;
        // それ以外の値があれば取得
        const queryParams = req.query.queryParams ? JSON.parse(req.query.queryParams as string) : [];

        const queryData = (queryDataAcquisition as any)[queryName];
        console.log('リクエストクエリ名：', queryName, queryData);
        console.log('追加パラメータ：', queryParams);

        // クエリを実行する
        const result = await executeQuery(queryData, ...queryParams);

        // クエリ結果をクライアントに返却
        res.json(result);

    } catch (err) {
        console.error('クエリエラー: ', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// 登録・更新用APIエンドポイントの定義
app.put('/api/getdatabase', async (req, res) => {
    try {
        console.log('DB更新処理', req.body);
        // クエリ名をリクエストクエリから取得
        const queryName = req.body.params?.queryName as string;
        // それ以外の値があれば取得
        const queryParams = req.body.params?.queryParams ? JSON.parse(req.body.params.queryParams as string) : [];

        const queryData = (queryDataAcquisition as any)[queryName];
        console.log('リクエストクエリ名：', queryName, queryData);
        console.log('追加パラメータ：', queryParams);

        // クエリを実行する
        const result = await executeQuery(queryData, ...queryParams);

        // クエリ結果をクライアントに返却
        res.json(result);

    } catch (err) {
        console.error('クエリエラー: ', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// 削除用APIエンドポイントの定義
app.delete('/api/getdatabase', async (req, res) => {
    try {
        console.log('DB削除処理', req.body);
        // クエリ名をリクエストクエリから取得
        const queryName = req.body.queryName as string;
        // それ以外の値があれば取得
        const queryParams = req.body.queryParams ? JSON.parse(req.body.queryParams as string) : [];

        const queryData = (queryDataAcquisition as any)[queryName];
        console.log('リクエストクエリ名：', queryName, queryData);
        console.log('追加パラメータ：', queryParams);

        // クエリを実行する
        const result = await executeQuery(queryData, ...queryParams);

        // クエリ結果をクライアントに返却
        res.json(result);

    } catch (err) {
        console.error('クエリエラー: ', err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// const PORT = 4000;
app.listen(setting_values.port, () => {
    console.log(`Server is running on ${setting_values.db_connect_url}`);
});

