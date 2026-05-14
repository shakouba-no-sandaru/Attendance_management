<!--勤怠管理画面-->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import HeaderBanner from '../components/HeaderBanner.vue'
import YMCalendar from '../components/YMCalendar.vue';
import SumAttendanceList from '../components/SumAttendanceList.vue';
import AttUpdateForm from '../components/AttUpdateForm.vue';
import { useStoreUser } from '../store/usersStore';
import { getCurrentTime } from '../getCurrentTime';
import { getApplicationData, applicationRequest, approvalCompleted } from '../applicationApproval';
import { setting_values } from '../config';

const now_daytime = ref(getCurrentTime()); // 初期値を設定
const storeUser = useStoreUser();
const showFormModal = ref(false);
const showAttFormModal = ref(false);

// const hd = new Holidays('JP');
// const holidays = hd.getHolidays(new Date().getFullYear()).map(h => h.date);
// console.log(holidays); // 祝日リストを取得

interface CalendarData {
    cal_year: number;
    cal_month: number;
    cal_day: number;
    cal_week: string;
    cal_holiday: string;
    clock_in_time?: string;
    clock_out_time?: string;
    working_time?: string;
    break_time?: string;
    remarks?: string;
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

interface Application_data {
    employee_id: number;
    year: number;
    month: number;
    application_status: number;
    approval_status: number;
};

const attendances = ref<Attendance[]>([]);
const caldata = ref<{ selected_year: number; selected_month: number; calendar: CalendarData[]; } | null>(null);
const employee = computed(() => storeUser.users[0] || null);
const filteredAttendances = ref<CalendarData[]>([]);
const application_data = ref<Application_data>();
const selectedAttUpdate = ref<{ employee_id: number, year: number, month: number, day: number, clock_in_time: string, clock_out_time: string, break_time: string, remarks: string } | null>(null);

const db_connect_url = `${setting_values.db_connect_url}/api/getdatabase`;

// リスト取得時にカレンダー取得
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
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// 表示切り替え処理
const updateTable = () => {
    if (caldata.value) {
        filteredAttendances.value = caldata.value.calendar.map((day) => {
            const attendance = attendances.value.find(
                (att) =>
                    att.year === day.cal_year &&
                    att.month === day.cal_month &&
                    att.day === day.cal_day

            );
            return {
                ...day,
                cal_holiday: day.cal_holiday || "",
                clock_in_time: attendance?.clock_in_time || '',
                clock_out_time: attendance?.clock_out_time || '',
                working_time: attendance?.working_time || '',
                break_time: attendance?.break_time || '',
                remarks: attendance?.remarks || '',
            };
        });
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

// 上長申請
const appRequest = async () => {
    try {
        const confirmation = confirm("本当に申請しますか？");
        if (confirmation) {
            // YESの場合の処理
            // APIを呼び出してデータを取得
            const response = await applicationRequest(storeUser.users[0].employee_id);
            console.log(response);
            console.log("申請処理を実行しました。");
            alert("申請が完了しました。");
            fetchApplicationData();
        } else {
            // NOの場合の処理
            console.log("申請処理がキャンセルされました。");
            alert("申請をキャンセルしました。");
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// 勤怠データ取得
const handleAttUpdate = async (employee_id: number, year: number, month: number, day: number) => {
    try {
        console.log("修正情報：", employee_id, year, month, day);

        // APIを呼び出してデータを取得
        const response = await axios.get(db_connect_url, {
            params: {
                queryName: 'getAttUpdateInfo',
                queryParams: JSON.stringify([employee_id, year, month, day]),
            }, // クエリ名をリクエストに含める
        });
        const data = response.data[0];
        const attupdateform = {
            employee_id,
            year,
            month,
            day,
            clock_in_time: data?.clock_in_time || '',
            clock_out_time: data?.clock_out_time || '',
            break_time: data?.break_time || '',
            remarks: data?.remarks || '',
        };

        console.log("修正情報2：", attupdateform);
        selectedAttUpdate.value = attupdateform;
        showAttFormModal.value = true;

    } catch (error) {
        console.error('Error fetching data:', error);
    }


};

onMounted(() => {
    // 初回データ取得
    fetchCalData(storeUser.users[0].employee_id, now_daytime.value.year, now_daytime.value.month).then(() => {
        updateTable();
    });
    fetchApplicationData();
});

</script>

<template>
    <HeaderBanner />
    <YMCalendar @calendar_data="(event) => {
        caldata = event;
        if (caldata?.selected_year && caldata?.selected_month) {
            fetchCalData(employee?.employee_id || 0, caldata.selected_year, caldata.selected_month);
        }
    }" />
    <div class="att-standard">
        <div class="att-styled-button">
            <button type="button" @click="() => updateTable()">表示する</button>
            <button @click="showFormModal = true">帳票出力</button>
        </div>
        <SumAttendanceList v-if="showFormModal" @close="showFormModal = false" :dataSet="{
            selectedDays: caldata?.calendar.map(d => ({ year: d.cal_year, month: d.cal_month, day: d.cal_day, week: d.cal_week, holiday: d.cal_holiday })) || [],
            employee_id: storeUser.users[0].employee_id,
            employee_name: storeUser.users[0].employee_name
        }" />

        <div class="att-table-main">
            <div class="att-table-title">{{ filteredAttendances[0]?.cal_year }}年{{ filteredAttendances[0]?.cal_month }}月
                <button class="att-approval-req-button" :class="{
                    'approval-possible': application_data.application_status === 0,
                    'approval-pending': application_data.application_status === 1
                }" v-if="application_data" type="button" @click="() => appRequest()"
                    :disabled="application_data.application_status === 1">
                    {{
                        application_data.application_status === 0
                            ? `${application_data.year}年${application_data.month}月の勤怠を上長に申請する`
                            : application_data.application_status === 1
                                ? `${application_data.year}年${application_data.month}月分を申請中です`
                                : "申請完了"
                    }}
                </button>
            </div>
            <table border="1" class="att-table-style">
                <thead>
                    <tr>
                        <th>日</th>
                        <th>週</th>
                        <th>祝日</th>
                        <th>出勤時間</th>
                        <th>退勤時間</th>
                        <th>休憩時間</th>
                        <th>勤務時間</th>
                        <th>備考</th>
                        <th>修正</th>
                    </tr>
                </thead>
                <tr :class="{ 'att-sunday': day.cal_week === '日', 'att-saturday': day.cal_week === '土', 'att-holiday': day.cal_holiday !== '' }"
                    v-for="(day, index) in filteredAttendances" :key="index">
                    <td>{{ day.cal_day }}</td>
                    <td>{{ day.cal_week }}</td>
                    <td>{{ day.cal_holiday }}</td>
                    <td>{{ day.clock_in_time }}</td>
                    <td>{{ day.clock_out_time }}</td>
                    <td>{{ day.break_time }}</td>
                    <td>{{ day.working_time }}</td>
                    <td>{{ day.remarks }}</td>
                    <td>
                        <button class="att-update-button"
                            @click="handleAttUpdate(storeUser.users[0].employee_id, filteredAttendances[0]?.cal_year, filteredAttendances[0]?.cal_month, day.cal_day)">修正</button>
                    </td>
                </tr>
                <AttUpdateForm v-if="showAttFormModal" :attupdateform="selectedAttUpdate"
                    @close="showAttFormModal = false" @update="() => {
                        showAttFormModal = false;
                        fetchCalData(storeUser.users[0].employee_id, filteredAttendances[0]?.cal_year, filteredAttendances[0]?.cal_month).then(() => {
                            updateTable();
                        });
                    }" />
            </table>
        </div>

        <router-link to="/home">
            <button class="att-back-home">Homeへ戻る</button>
        </router-link>
    </div>
</template>

<style>
.att-standard {
    font-family: 'BIZ UDPGothic';
}

.att-styled-button {
    padding-top: 30px;
    padding-left: 500px;
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 80px;
    margin-bottom: 60px;
}

.att-styled-button button {
    width: 150px;
    height: 50px;
    background-color: #1a73e8;
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    font-family: 'BIZ UDPGothic';
}

.att-styled-button button:hover {
    background-color: #1558c3;
}

.att-approval-req-button {
    width: 300px;
    height: 50px;
    background-color: #7c7c7c;
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    font-family: 'BIZ UDPGothic';
}

/* 申請可能（青色） */
.att-approval-req-button.approval-possible {
    background-color: #e74c3c;
    color: white;
}

.att-approval-req-button.approval-possible:hover {
    background-color: #c0392b;
}

/* 申請中（灰色・非アクティブ） */
.att-approval-req-button.approval-pending {
    background-color: #a0a0a0;
    color: #dcdcdc;
    cursor: not-allowed;
    box-shadow: none;
}

/* 全体のテーブルスタイル */
.att-table-main {
    margin: 20px auto;
    width: 100%;
    max-width: 1200px;
    border-collapse: collapse;
    overflow: hidden;
}

.att-table-title {
    font-size: 2rem;
    margin-bottom: 15px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
}

.att-table-style {
    width: 100%;
}

.att-approval-req-button {
    position: absolute;
    right: 0;
    font-family: 'BIZ UDPGothic';
}

/* ヘッダー部分 */
.att-table-main thead tr {
    background-color: #000000;
    color: white;
    font-size: 20px;
}

/* 各カラムのサイズ調整 */
.att-table-main thead th,
.att-table-main td {
    padding: 10px 12px;
    text-align: center;
    border: 1px solid black;
}

/* カラムの幅指定 */
.att-table-main th:nth-child(1),
.att-table-main td:nth-child(1),
.att-table-main th:nth-child(2),
.att-table-main td:nth-child(2) {
    width: 5%;
}

.att-table-main th:nth-child(3),
.att-table-main td:nth-child(3) {
    width: 12%;
}

.att-table-main th:nth-child(4),
.att-table-main th:nth-child(5),
.att-table-main th:nth-child(6),
.att-table-main th:nth-child(7),
.att-table-main td:nth-child(4),
.att-table-main td:nth-child(5),
.att-table-main td:nth-child(6),
.att-table-main td:nth-child(7) {
    width: 10%;
}

.att-table-main td:nth-child(8) {
    text-align: left;
    padding-left: 10px;
}

.att-table-main th:nth-child(9),
.att-table-main td:nth-child(9) {
    width: 7%;
}



/* 日曜日の背景色を赤に */
.att-sunday {
    background-color: #f8d7da;
    color: black;
}

/* 土曜日の背景色を青に */
.att-saturday {
    background-color: #d1ecf1;
    color: black;
}

/* 日曜日の背景色を赤に */
.att-holiday {
    background-color: #f8d7da;
    color: black;
}

.att-back-home {
    width: 150px;
    height: 50px;
    background-color: #7c7c7c;
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    font-family: 'BIZ UDPGothic';
}

.att-back-home:hover {
    background-color: #2e2e2e;
}



/* 修正ボタン */
.att-update-button {
    padding: 8px 12px;
    font-size: 1rem;
    color: white;
    background-color: #d9534f;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'BIZ UDPGothic';
}

.att-update-button:hover {
    background-color: #c9302c;
}
</style>