// getCurrentTime.ts @現在年月日時刻を取得する
export const getCurrentTime = (): {
    year: number,
    month: number,
    day: number,
    week: string,
    hour: string,
    minute: string,
    second: string
} => {
    // console.log("現在時刻取得");

    // 日時の取得
    const date = new Date();
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const current_datetime = {
        year: date.getFullYear(),  // 年
        month: date.getMonth() + 1,// 月
        day: date.getDate(),       // 日
        week: weekdays[date.getDay()],      // 曜日
        hour: String(date.getHours()).padStart(2, '0'),     // 時
        minute: String(date.getMinutes()).padStart(2, '0'), // 分
        second: String(date.getSeconds()).padStart(2, '0') // 秒
    };

    // console.log(`現在時刻を取得しました：${current_datetime}`);
    return current_datetime;
}
console.log(getCurrentTime());