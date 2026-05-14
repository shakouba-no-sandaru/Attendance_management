// putInOutTimes.ts @出勤・退勤時間を登録する
import axios from 'axios';
import { setting_values } from './config.js';

const db_connect_url = `${setting_values.db_connect_url}/api/getdatabase`;


// 出勤時間登録処理INSERT
export const regInTime = async (inTime: {
    employee_id: number, year: number, month: number, day: number, clock_in_time: string
}): Promise<boolean> => {
    try {

        const inTimeDataArr = [
            inTime.employee_id, inTime.year, inTime.month, inTime.day, inTime.clock_in_time
        ];
        console.log(inTimeDataArr);
        const response = await axios.put(db_connect_url, {
            params: {
                queryName: 'regInTime', // 呼び出しクエリ
                queryParams: JSON.stringify(inTimeDataArr), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
        return response.data;
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
}

// 出勤時間登録処理UPDATE
export const regInTimeUd = async (inTime: {
    employee_id: number, year: number, month: number, day: number, clock_in_time: string
}): Promise<boolean> => {
    try {

        const inTimeDataArr = [
            inTime.clock_in_time, inTime.employee_id, inTime.year, inTime.month, inTime.day
        ];
        console.log(inTimeDataArr);
        const response = await axios.put(db_connect_url, {
            params: {
                queryName: 'regInTimeUd', // 呼び出しクエリ
                queryParams: JSON.stringify(inTimeDataArr), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
        return response.data;
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
}

// regInTime({ employee_id: 1, year: 2025, month: 1, day: 2, clock_in_time: "11:00:00", clock_out_time: "22:00:00", break_time: "1:00:00", remarks: "なし" });

// 退勤時間登録処理
export const regOutTime = async (OutTime: {
    clock_out_time: string, break_time: string, employee_id: number, year: number, month: number, day: number
}): Promise<void> => {
    try {

        const outTimeDataArr = [
            OutTime.clock_out_time, OutTime.break_time, OutTime.employee_id, OutTime.year, OutTime.month, OutTime.day
        ];
        console.log(outTimeDataArr);
        const response = await axios.put(db_connect_url, {
            params: {
                queryName: 'regOutTime', // 呼び出しクエリ
                queryParams: JSON.stringify(outTimeDataArr), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
        console.log(response);
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
}


// 勤怠時間登録状況確認（）
export const chkAttData = async (ediattupdateformData: {
    clock_in_time: string | null;
    clock_out_time: string | null;
    break_time: string | null;
    remarks: string | null;
    employee_id: number;
    year: number;
    month: number;
    day: number;
}) => {
    try {

        const response = await axios.get(db_connect_url, {
            params: {
                queryName: 'chkAttData', // 呼び出しクエリ
                queryParams: JSON.stringify([ediattupdateformData.employee_id, ediattupdateformData.year, ediattupdateformData.month, ediattupdateformData.day]), // 任意のパラメータ(カンマ区切り複数指定可)
            }

        });
        return response.data;
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
}

// 勤怠時間一括登録処理
export const regAttInsert = async (ediattupdateformData: {
    employee_id: number;
    year: number;
    month: number;
    day: number;
    clock_in_time: string | null;
    clock_out_time: string | null;
    break_time: string | null;
    remarks: string | null;
}) => {
    try {

        const ediattupdateformDataArr = [
            ediattupdateformData.employee_id,
            ediattupdateformData.year,
            ediattupdateformData.month,
            ediattupdateformData.day,
            ediattupdateformData.clock_in_time,
            ediattupdateformData.clock_out_time,
            ediattupdateformData.break_time,
            ediattupdateformData.remarks
        ];
        console.log(ediattupdateformDataArr);
        const response = await axios.put(db_connect_url, {
            params: {
                queryName: 'regAttInsert', // 呼び出しクエリ
                queryParams: JSON.stringify(ediattupdateformDataArr), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
}

// 勤怠時間一括更新処理
export const regAttUpdate = async (ediattupdateformData: {
    clock_in_time: string | null;
    clock_out_time: string | null;
    break_time: string | null;
    remarks: string | null;
    employee_id: number;
    year: number;
    month: number;
    day: number;
}) => {
    try {

        const ediattupdateformDataArr = [
            ediattupdateformData.clock_in_time,
            ediattupdateformData.clock_out_time,
            ediattupdateformData.break_time,
            ediattupdateformData.remarks,
            ediattupdateformData.employee_id,
            ediattupdateformData.year,
            ediattupdateformData.month,
            ediattupdateformData.day
        ];
        console.log(ediattupdateformDataArr);
        const response = await axios.put(db_connect_url, {
            params: {
                queryName: 'regAttUpdate', // 呼び出しクエリ
                queryParams: JSON.stringify(ediattupdateformDataArr), // 任意のパラメータ(カンマ区切り複数指定可)
            }
        });
    } catch (error) {
        console.warn('データ送信エラー：', error);
        throw error;
    }
}