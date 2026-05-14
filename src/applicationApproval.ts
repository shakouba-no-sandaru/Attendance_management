// applicationApproval.ts @申請/承認を管理

/*申請状況ステータス*/
// 0:未申請、1:申請中、2:申請完了
// 
/*承認状況ステータス*/
// 0:未承認、1:申請完了

import axios from 'axios';
import { setting_values } from './config.js';

const db_connect_url = `${setting_values.db_connect_url}/api/getdatabase`;

// 対象ユーザの最新年月の申請状況を取得
export const getApplicationData = async (employee_id: number) => {
    try {
        // APIを呼び出してデータを取得
        const response = await axios.get(db_connect_url, {
            params: {
                queryName: 'getAppData',
                queryParams: JSON.stringify([employee_id]),
            }, // クエリ名をリクエストに含める
        });
        console.log(response);
        return response.data[0];

    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
};

// getApplicationData(1);


// 承認状況を取得
export const getApprovalData = async () => {
    try {
        // APIを呼び出してデータを取得
        const response = await axios.get(db_connect_url, {
            params: {
                queryName: 'getApprovalData',
                queryParams: JSON.stringify([]),
            }, // クエリ名をリクエストに含める
        });
        console.log(response);
        return response.data;

    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
};


// 上長申請（申請状況ステータスを0から1に更新）
export const applicationRequest = async (employee_id: number) => {
    try {
        const response = await axios.put(db_connect_url, {
            params: {
                queryName: 'appRequest', // 呼び出しクエリ
                queryParams: JSON.stringify([employee_id]), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
        console.log(response);
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
};

// applicationRequest(1);

// 承認（承認状況ステータスを0から1に更新）
export const approvalCompleted = async (employee_id: number) => {
    try {
        const response = await axios.put(db_connect_url, {
            params: {
                queryName: 'appCompleted', // 呼び出しクエリ
                queryParams: JSON.stringify([employee_id]), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
        console.log(response);
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
};

// approvalCompleted(1);

// 従業員ID管理データ取得
export const regEmployeeNowId = async () => {
    try {
        const response = await axios.get(db_connect_url, {
            params: {
                queryName: 'regEmployeeNowId', // 呼び出しクエリ
                queryParams: JSON.stringify([]), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
        return response.data[0].employee_id;
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
}

// 新規ユーザ申請状況作成（新規で作成当月の申請状況を作成する）
export const regNewUserAppData = async (employee_id: number, year: number, month: number) => {
    try {
        const response = await axios.put(db_connect_url, {
            params: {
                queryName: 'regNewUserAppData', // 呼び出しクエリ
                queryParams: JSON.stringify([employee_id, year, month]), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
        console.log(response);
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
};


// 翌月申請状況作成（翌月の申請状況を作成する）
export const regApplicationData = async (employee_id: number) => {
    try {
        const response = await axios.put(db_connect_url, {
            params: {
                queryName: 'regAppData', // 呼び出しクエリ
                queryParams: JSON.stringify([employee_id]), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
        console.log(response);
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
};

// regApplicationData(1);