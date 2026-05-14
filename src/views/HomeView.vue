<!--ホーム画面-->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreUser } from '../store/usersStore';
import { getCurrentTime } from '../getCurrentTime';
import { regInTime, regInTimeUd, chkAttData, regOutTime } from '../putInOutTimes';
import axios from 'axios';
import HeaderBanner from '../components/HeaderBanner.vue'
import SumAttendanceList from '../components/SumAttendanceList.vue';
import { getApplicationData, applicationRequest, approvalCompleted, getApprovalData, regApplicationData } from '../applicationApproval';
import { generateMonthList, generateYearList, getCalendar } from '../getCalendar';
import { setting_values } from '../config';

const now_daytime = ref(getCurrentTime());
const storeUser = useStoreUser();

interface SumAttendances {
    total_records: number;
    total_working_time: string;
};

interface Application_data {
    employee_id: number;
    year: number;
    month: number;
    application_status: number;
    approval_status: number;
};

interface Approval_data {
    employee_name: string;
    employee_id: number;
    year: number;
    month: number;
    application_status: number;
    approval_status: number;
};

interface Attendance {
    year: number;
    month: number;
    day: number;
    week: string;
    holiday: string;
    clock_in_time: string;
    clock_out_time: string;
    working_time: string;
    employee_post: string;
    break_time: string;
    remarks: string;
};

interface CalendarData {
    cal_year: number;
    cal_month: number;
    cal_day: number;
    cal_week: string;
    cal_holiday: string;
}

const attendances = ref<Attendance[]>([]);
const sumAttendances = ref<SumAttendances[]>([]);
const application_data = ref<Application_data>();
const approval_data = ref<Approval_data[] | null>(null);
const selected_break_time = ref<string[]>(['00:00:00', '01:00:00', '02:00:00', '03:00:00']);
const selected_time = ref<string>('01:00:00');
const calendar = ref<CalendarData[]>([]);
const selectedEmployeeId = ref<number | null>(null);
const showFormModal = ref(false);
const caldata = ref<{ selected_year: number; selected_month: number; calendar: CalendarData[]; } | null>(null);
const selectedApproval = ref<Approval_data | null>(null); //1

const db_connect_url = `${setting_values.db_connect_url}/api/getdatabase`;

const fetchData = async (employee_id: number, selected_year: number, selected_month: number) => {
    try {
        // APIを呼び出してデータを取得
        const response = await axios.get(db_connect_url, {
            params: {
                queryName: 'getSumAttendances',
                queryParams: JSON.stringify([employee_id, selected_year, selected_month]),
            }, // クエリ名をリクエストに含める
        });
        sumAttendances.value = response.data;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


// 出勤処理
const handleClockIn = async () => {
    try {
        const chkAttDayData = {
            employee_id: storeUser.users[0].employee_id,
            year: now_daytime.value.year,
            month: now_daytime.value.month,
            day: now_daytime.value.day,
            clock_in_time: '',
            clock_out_time: '',
            break_time: '',
            remarks: ''
        };

        const inTimeData = {
            employee_id: storeUser.users[0].employee_id,
            year: now_daytime.value.year,
            month: now_daytime.value.month,
            day: now_daytime.value.day,
            clock_in_time: `${now_daytime.value.hour}:${now_daytime.value.minute}:${now_daytime.value.second}`,
        };
        const confirmation = confirm(`出勤時間を登録しますか？`);
        if (confirmation) {
            const chk_result = await chkAttData(chkAttDayData);

            // 勤怠情報が既に登録されていない場合INSERT
            if (chk_result[0].chkAttData == 0) {
                const result = await regInTime(inTimeData);
                alert('出勤時刻が登録されました。');
            }
            // 勤怠情報が既に登録されている場合UPDATE
            else if (chk_result[0].chkAttData >= 1) {
                const resultUd = await regInTimeUd(inTimeData);
                alert('出勤時刻が登録されました。');
            }
        }
    } catch (error) {
        console.error('出勤登録中にエラーが発生しました:', error);
        alert('出勤登録に失敗しました。');
    }
};

// 退勤処理
const handleClockOut = async () => {
    try {
        const outTimeData = {
            clock_out_time: `${now_daytime.value.hour}:${now_daytime.value.minute}:${now_daytime.value.second}`,
            break_time: selected_time.value,
            employee_id: storeUser.users[0].employee_id,
            year: now_daytime.value.year,
            month: now_daytime.value.month,
            day: now_daytime.value.day,
        };
        const confirmation = confirm(`退勤時間を登録しますか？`);
        if (confirmation) {
            await regOutTime(outTimeData);
            alert('退勤時刻が登録されました。');
        }
    } catch (error) {
        console.error('退勤登録中にエラーが発生しました:', error);
        alert('退勤登録に失敗しました。');
    }
};


// 申請状況取得
const fetchApplicationData = async () => {
    try {
        // APIを呼び出してデータを取得
        const response = await getApplicationData(storeUser.users[0].employee_id);
        console.log(response);
        application_data.value = response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// 承認状況取得
const fetchApprovalData = async () => {
    try {
        // APIを呼び出してデータを取得
        const response = await getApprovalData();
        console.log(response);
        approval_data.value = response;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


// // 承認
// const handlApprovalCompleted = async (employee_id: number) => {
//     try {
//         // APIを呼び出してデータを取得
//         const response = await approvalCompleted(employee_id);
//         console.log(response);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// };

// 翌月申請データ作成
const handlRegApplicationData = async (employee_id: number, employee_name: string, year: number, month: number) => {
    const confirmation = confirm(`${employee_name}の${year}年${month}月分の勤怠を承認しますか？`);
    if (confirmation) {
        alert(`${employee_name}の${year}年${month}月分の勤怠を承認しました`);
        try {
            // 承認APIを呼び出してデータを取得
            const response_1 = await approvalCompleted(employee_id);
            console.log(response_1);

            // 翌月申請データ作成APIを呼び出してデータを取得
            const response_2 = await regApplicationData(employee_id);
            console.log(response_2);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        await fetchApprovalData();
    } else {
        alert(`承認をキャンセル`);
    }
};

// カレンダー取得
const fetchCalData = async (employee_id: number, selected_year: number, selected_month: number) => {
    try {
        // APIを呼び出してデータを取得
        const response = await axios.get(db_connect_url, {
            params: {
                queryName: 'getAttendances',
                queryParams: JSON.stringify([employee_id, selected_year, selected_month]),
            }, // クエリ名をリクエストに含める
        });
        attendances.value = response.data;
        console.log('カレンダーデータ➀', attendances.value);

        calendar.value = await getCalendar(selected_year, selected_month);
        console.log('カレンダーデータ➁', calendar.value);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// const handleShowFormModal = async (employeeId: number, selectedYear: number, selectedMonth: number) => {
//     selectedEmployeeId.value = employeeId;

//     console.log(`確認ボタン押下: 社員ID=${employeeId}, 年=${selectedYear}, 月=${selectedMonth}`);

//     // `fetchCalData` を実行してデータ取得
//     await fetchCalData(employeeId, selectedYear, selectedMonth);

//     // データ取得後にモーダルを開く
//     showFormModal.value = true;
// };

//2
const handleShowFormModal = async (approval: Approval_data) => {
    selectedApproval.value = approval;
    await fetchCalData(approval.employee_id, approval.year, approval.month);
    showFormModal.value = true;
};

const intervalId = setInterval(() => {
    now_daytime.value = getCurrentTime();
}, 1000);

onMounted(async () => {
    fetchData(storeUser.users[0].employee_id, now_daytime.value.year, now_daytime.value.month);
    fetchApplicationData();
    fetchApprovalData();
    // clearInterval(intervalId);
});



</script>

<template>
    <HeaderBanner />
    <div class="home-standard">
        <div class="home-button-and-timer">
            <div class="home-button-container">
                <button type="button" @click="handleClockIn">出勤</button>
                <div class="home-button-row">
                    <button type="button" @click="handleClockOut">退勤</button>
                    <div class="home-break-time-container">
                        <label for="break_time_list">休憩時間:</label>
                        <select id="break_time_list" v-model="selected_time">
                            <option v-for="(break_time, index) in selected_break_time" :key="index" :value="break_time">
                                {{
                                    break_time }}</option>
                        </select>
                    </div>
                </div>

            </div>
            <div class="current-time">
                <h2>現在の時間</h2>
                <h3>
                    {{ now_daytime.year }}年
                    {{ now_daytime.month }}月
                    {{ now_daytime.day }}日
                    {{ now_daytime.week }}曜日
                </h3>
                <!-- <h1 :title="`${now_daytime.hour}時${now_daytime.minute}分${now_daytime.second}秒`"> -->
                <h1>
                    {{ now_daytime.hour }}時
                    {{ now_daytime.minute }}分
                    {{ now_daytime.second }}分
                </h1>
            </div>
        </div>

        <div class="home-kintai-container">
            <!-- 勤怠情報 (左) -->
            <div class="home-kintai-info">
                <p>勤怠情報</p>
                <div class="table">
                    <table border="1">
                        <thead>
                            <tr>
                                <th>年</th>
                                <th>月</th>
                                <th>出勤回数</th>
                                <th>勤務時間計</th>
                            </tr>
                        </thead>
                        <tr v-for="sumAttendance in sumAttendances" :key="sumAttendance.total_records">
                            <td>{{ now_daytime.year }}</td>
                            <td>{{ now_daytime.month }}</td>
                            <td>{{ sumAttendances[0].total_records }}</td>
                            <td>{{ sumAttendances[0].total_working_time }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <!-- メッセージ枠（右） -->
            <div class="home-message-box">
                <div class="home-message-title">メッセージ</div>
                <div class="home-message-content">
                    <div
                        v-if="application_data && application_data.application_status === 1 && application_data.approval_status === 0">
                        <div class="home-message-line">
                            上長に{{ application_data.year }}年{{ application_data.month }}月の勤怠を申請中です。
                        </div>
                    </div>
                    <div v-if="approval_data">
                        <div v-if="storeUser.users[0].employee_post !== 1">
                            <div class="home-message-line" v-for="(approval, index) in approval_data" :key="index">
                                {{ approval.employee_name }}({{ approval.employee_id }})の{{ approval.year }}年{{
                                    approval.month }}月の勤怠を承認待ちです。
                                <div class="home-message-buttons">
                                    <!-- <button class="home-approval-check" type="button"
                                        @click="handleShowFormModal(approval.employee_id, approval.year, approval.month)">確認</button>

                                    <SumAttendanceList v-if="showFormModal" @close="showFormModal = false" :dataSet="{
                                        selectedDays: calendar.map(d => ({ year: d.cal_year, month: d.cal_month, day: d.cal_day, week: d.cal_week, holiday: d.cal_holiday })) || [],
                                        employee_id: approval.employee_id,
                                        employee_name: approval.employee_name
                                    }" /> -->
                                    <button class="home-approval-check" type="button"
                                        @click="handleShowFormModal(approval)">確認</button>

                                    <button class="home-approval-button" type="button"
                                        @click="handlRegApplicationData(approval.employee_id, approval.employee_name, approval.year, approval.month)">承認</button>
                                </div>
                            </div>
                            <SumAttendanceList v-if="showFormModal && selectedApproval" @close="showFormModal = false"
                                :dataSet="{
                                    selectedDays: calendar.map(d => ({
                                        year: d.cal_year,
                                        month: d.cal_month,
                                        day: d.cal_day,
                                        week: d.cal_week,
                                        holiday: d.cal_holiday
                                    })),
                                    employee_id: selectedApproval.employee_id,
                                    employee_name: selectedApproval.employee_name
                                }" />

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.home-standard {
    font-family: 'BIZ UDPGothic';
}

.home-button-and-timer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 130px;
    padding: 20px;
    padding-right: 200px;
}

/* ボタン */
.home-button-container {
    padding-top: 10px;
    padding-left: 40px;
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 30px;
}

.home-button-row {
    display: flex;
    align-items: center;
    gap: 40px;
}

.home-button-container button {
    width: 300px;
    height: 60px;
    padding: 0px;
    font-size: 2rem;
    color: white;
    background-color: #9e9d9d;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'BIZ UDPGothic';
}

.home-button-container button:hover {
    background-color: #4b4b4b;
}

.current-time {
    flex: 1;
    background: #f4f4f4;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: 'BIZ UDPGothic', sans-serif;
    /* 落ち着いた和風フォント */
    font-size: 1.2rem;
    color: #333;
    /* 落ち着いた文字色 */
    letter-spacing: 5px;
    line-height: 0.01px;
}

/* 休憩時間 */
.home-break-time-container {
    display: flex;
    align-items: center;
}

.home-break-time-container label {
    margin-right: 10px;
    font-size: 1.5rem;
}

.home-break-time-container select {
    padding: 10px;
    font-size: 1.7rem;
    border-radius: 5px;
    font-family: 'BIZ UDPGothic';
}

/* 勤怠時間 */
.home-kintai-container {
    padding-top: 30px;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
}

.home-kintai-info {
    width: 50%;
    min-width: 300px;
    background: #e2e2e2;
    padding: 20px;
    padding-top: 0px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}

.home-kintai-info table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    background: white;
}

.home-kintai-info th {
    padding: 10px;
    font-size: 1.3rem;
    text-align: center;
    color: white;
    background: #000000;
}

.home-kintai-info td {
    padding: 20px;
    font-size: 1.3rem;
}

.home-kintai-info p {
    font-size: 2rem;
    color: #000000;
    text-align: center;
    margin-bottom: 10px;
}

/* メッセージ */
.home-message-box {
    width: 50%;
    height: 500px;
    background: white;
    padding: 0;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    text-align: left;
    font-size: 1.4rem;
    overflow: hidden;
}

.home-message-title {
    background: #d3d3d3;
    padding: 10px;
    text-align: center;
}

.home-message-content {
    padding: 15px;
}

.home-message-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #ccc;
}

.home-message-buttons {
    display: flex;
    gap: 10px;
}

.home-approval-button {
    padding: 6px 12px;
    font-size: 1rem;
    color: white;
    background-color: #9e9d9d;
    border: none;
    border-radius: 5px;
    cursor: pointer;

}

.home-approval-button:hover {
    background-color: #4b4b4b;
}

.home-approval-check {
    padding: 6px 12px;
    font-size: 1rem;
    color: white;
    background-color: #e74c3c;
    border: none;
    border-radius: 5px;
    cursor: pointer;

}

.home-approval-check:hover {
    background-color: #c0392b;
}

@media screen and (max-width: 600px) {
  .home-button-and-timer {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 10px;
  }

  .home-button-container {
    align-items: center;
    padding: 0;
  }

  .home-button-container button {
    width: 200px;
    font-size: 1.3rem;
    height: 50px;
  }

  .home-button-row {
    flex-direction: column;
    gap: 15px;
  }

  .home-break-time-container label {
    font-size: 1rem;
  }

  .home-break-time-container select {
    font-size: 1.2rem;
    padding: 5px;
    width: 150px;
  }

  .current-time {
    padding: 15px;
    font-size: 1rem;
    letter-spacing: 1px;
    line-height: 1.5;
    width: 90%;
  }

  .home-kintai-container {
    flex-direction: column;
    gap: 20px;
    padding: 0 10px;
  }

  .home-kintai-info,
  .home-message-box {
    width: 100%;
    min-width: auto;
  }

  .home-kintai-info th,
  .home-kintai-info td {
    font-size: 1rem;
    padding: 10px;
  }

  .home-message-box {
    height: auto;
    font-size: 1rem;
  }

  .home-message-line {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .home-message-buttons {
    flex-direction: row;
    justify-content: flex-start;
  }

  .home-approval-check,
  .home-approval-button {
    font-size: 0.9rem;
    padding: 5px 10px;
  }
}

</style>
