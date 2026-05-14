// getCalendar.ts @カレンダー生成用のデータを取得する

import axios from 'axios';
import { setting_values } from './config.js';

const db_connect_url = `${setting_values.db_connect_url}/api/getdatabase`;

// 年リスト生成
export const generateYearList = (start_year: number, end_year: number) => {
    return Array.from({ length: end_year - start_year + 1 }, (_, i) => ({
        value: start_year + i,
        label: start_year + i,
    }))
};

// 月リスト生成
export const generateMonthList = () => {
    return Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        label: i + 1,
    }))
};

// カレンダー生成
export const getCalendar = async (cal_year: number, cal_month: number) => {

    const days_in_month = new Date(cal_year, cal_month, 0).getDate();
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
        // APIを呼び出してデータを取得
        const response = await axios.get(db_connect_url, {
            params: {
                queryName: 'getHolidayData',
                queryParams: JSON.stringify([cal_year,cal_month]),
            }, // クエリ名をリクエストに含める
        });
        const holidayData = response.data.reduce((acc: Record<number, string>, item: { day: number; holiday: string }) => {
            acc[item.day] = item.holiday;
            return acc;
        }, {});
        
    return Array.from({ length: days_in_month }, (_, i) => {
        const cal_day = i + 1;
        const date = new Date(cal_year, cal_month - 1, cal_day);
        const cal_week = weekdays[date.getDay()];
        const cal_holiday = holidayData[cal_day] || "";
        return {
            cal_year, cal_month, cal_day, cal_week,cal_holiday
        };
    });
};

