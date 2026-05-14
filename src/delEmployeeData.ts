// delEmployeeData.ts @従業員を削除する
import axios from 'axios';
import { setting_values } from './config.js';

const db_connect_url = `${setting_values.db_connect_url}/api/getdatabase`;

// 削除処理
export const delEmployeeData = async (employeeData:{employee_id: number,login_id: string}): Promise<void> => {
    try {
        const employeeDataArr = [
            employeeData.employee_id, employeeData.login_id
        ];
        console.log(employeeData);
        const response = await axios.delete(db_connect_url, {
            data: {
                queryName: 'delEmployeeData', // 呼び出しクエリ
                queryParams: JSON.stringify(employeeDataArr), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
        console.log(response);
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
}