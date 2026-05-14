// putEmployeeData.ts @従業員を登録・更新する
import axios from 'axios';
import { setting_values } from './config.js';

const db_connect_url = `${setting_values.db_connect_url}/api/getdatabase`;

// 従業員チェック処理
export const EmployeeDataCheck = async (login_id: string) => {
    try {

        console.log(login_id);
        const response = await axios.get(db_connect_url, {
            params: {
                queryName: 'EmployeeDataCheck', // 呼び出しクエリ
                queryParams: JSON.stringify([login_id]), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
        console.log(response);
        let result = true;
        if (response.data[0].count > 0) {
            result = false;
        };
        return result;
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
}

// 従業員登録処理
export const regEmployeeData = async (employeeData: {
    employee_name: string, employee_kana: string, mail_address: string, employee_post: string, login_id: string, pass_word: string
    // }): Promise<{ success: boolean, employee_id: number }> => {
}) => {
    try {

        const employeeDataArr = [
            employeeData.employee_name, employeeData.employee_kana, employeeData.mail_address, employeeData.employee_post, employeeData.login_id, employeeData.pass_word
        ];
        console.log(employeeDataArr);
        const response = await axios.put(db_connect_url, {
            params: {
                queryName: 'regEmployeeData', // 呼び出しクエリ
                queryParams: JSON.stringify(employeeDataArr), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
}

// 従業員チェック処理
export const regEmployeeIdPool = async () => {
    try {

        const response = await axios.put(db_connect_url, {
            params: {
                queryName: 'regEmployeeIdPool', // 呼び出しクエリ
                queryParams: JSON.stringify([]), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
}



