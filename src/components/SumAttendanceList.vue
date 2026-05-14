<!-- SumAttendanceList.vue @勤怠管理画面 -->
<script setup lang="ts">
import { ref, onMounted, computed, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import HeaderBanner from '../components/HeaderBanner.vue'
import YMCalendar from '../components/YMCalendar.vue';
import { useStoreUser } from '../store/usersStore';
import { getCurrentTime } from '../getCurrentTime';
import { generatePDF } from '../generatePDF';
import { getApplicationData, applicationRequest, approvalCompleted } from '../applicationApproval';
import { setting_values } from '../config';

const now_daytime = ref(getCurrentTime()); // 初期値を設定
const storeUser = useStoreUser();


interface SumAttendancesList {
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

interface SumAttendances {
    total_records: number;
    total_working_time: string;
};


const sumAttendances = ref<SumAttendances[]>([]);
const sumAttendancesList = ref<SumAttendancesList[]>([]);
const props = defineProps<{ dataSet: { selectedDays: { year: number; month: number; day: number; week: string; holiday: string }[]; employee_id: number; employee_name: string } }>();

const emit = defineEmits(['close']);

const db_connect_url = `${setting_values.db_connect_url}/api/getdatabase`;

// リスト取得時にカレンダー取得
const fetchCalData = async (employee_id: number, selected_year: number, selected_month: number) => {
    try {
        // APIを呼び出してデータを取得
        const response = await axios.get(db_connect_url, {
            params: {
                queryName: 'getSumAttendancesList',
                queryParams: JSON.stringify([employee_id, selected_year, selected_month]),
            }, // クエリ名をリクエストに含める
        });
        sumAttendancesList.value = response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

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

// PDF出力用の関数
const handleGeneratePDF = () => {
    const confirmation = confirm("PDFを出力しますか？");
    if (confirmation) {
        alert(`${props.dataSet.employee_name}の${props.dataSet.selectedDays[0].year}年${props.dataSet.selectedDays[0].month}月のPDFを出力します`);
        generatePDF(
            props.dataSet.employee_name,
            props.dataSet.selectedDays[0].year,
            props.dataSet.selectedDays[0].month,
            sumAttendancesList.value,
            {
                total_working_time: sumAttendances.value[0]?.total_working_time || '0:00',
                total_records: sumAttendances.value[0]?.total_records || 0
            }
        );
    } else {
        alert(`PDF出力をキャンセルしました`);
    }
};

const handleSubmit = async () => {
    emit('close');
};

onMounted(async () => {
    // 初回データ取得
    await fetchCalData(props.dataSet.employee_id, props.dataSet.selectedDays[0].year, props.dataSet.selectedDays[0].month);
    sumAttendancesList.value = props.dataSet.selectedDays.map(day => {
        const apiData = sumAttendancesList.value.find(item => item.day === day.day);
        return {
            year: day.year,
            month: day.month,
            day: day.day,
            week: day.week,
            holiday: day.holiday,
            clock_in_time: apiData?.clock_in_time || "",
            clock_out_time: apiData?.clock_out_time || "",
            working_time: apiData?.working_time || "",
            employee_post: apiData?.employee_post || "",
            break_time: apiData?.break_time || "",
            remarks: apiData?.remarks || ""
        };
    });
    fetchData(props.dataSet.employee_id, props.dataSet.selectedDays[0].year, props.dataSet.selectedDays[0].month);
});

</script>

<template>
    <div class="modal-backdrop" @submit.prevent="handleSubmit">
        <div class="modal-content" @click.stop>
            <div id="pdf-content">
                <div class="table-title">
                    {{ props.dataSet.selectedDays[0].year }}年{{ props.dataSet.selectedDays[0].month }}月　勤務表
                    　　　　　名前：{{ props.dataSet.employee_name }}
                </div>

                <table class="main-table">
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
                        </tr>
                    </thead>
                    <tr v-for="(day, index) in sumAttendancesList" :key="index">
                        <td>{{ day.day }}</td>
                        <td>{{ day.week }}</td>
                        <td>{{ day.holiday }}</td>
                        <td>{{ day.clock_in_time }}</td>
                        <td>{{ day.clock_out_time }}</td>
                        <td>{{ day.break_time }}</td>
                        <td>{{ day.working_time }}</td>
                        <td>{{ day.remarks }}</td>
                    </tr>
                </table>
                <!-- <table class="summary-table">
                    <tr>
                        <td>実労働時間</td>
                        <td>{{ sumAttendances[0]?.total_working_time }}</td>
                    </tr>
                    <tr>
                        <td>出勤回数</td>
                        <td>{{ sumAttendances[0]?.total_records }}</td>
                    </tr>
                </table> -->
                <div class="summary-table">
                    <div>
                        <td>実労働時間</td>
                        <td>{{ sumAttendances[0]?.total_working_time }}</td>
                        <td>出勤回数</td>
                        <td>{{ sumAttendances[0]?.total_records }}</td>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="close-button" type="button" @click="$emit('close')">閉じる</button>
                    <button class="pdf-button" @click="handleGeneratePDF">PDF</button>
                </div>
            </div>

        </div>
    </div>
</template>

<style>
/* 🔹 モーダルの背景 */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

/* 🔹 モーダルの内容 */
.modal-content {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 800px;
    max-height: 100vh;
    font-size: 0.6rem;
    text-align: center;
    overflow-y: auto;
}

.table-title {
    font-size: 13px;
    margin-bottom: 4px;
}

/* 🔹 テーブルヘッダー */
.modal-content thead th {
    background-color: #f2f2f2;
    border: 1px solid gray;
    font-weight: lighter;
}

/* 🔹 テーブルのセル */
.modal-content td {
    border: 1px solid gray;
    text-align: center;
}

/* 🔹 モーダル内のボタン */
.modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.main-table {
    width: 100%;
    border-collapse: collapse;
}

/* ヘッダーとセルのスタイル */
.main-table th,
td {
    border: 1px solid black;
    text-align: center;
    padding: 4px;
}

/* 列ごとの幅設定 */
.main-table th:nth-child(1),
.main-table td:nth-child(1) {
    width: 5%;
}

/* 日 */
.main-table th:nth-child(2),
.main-table td:nth-child(2) {
    width: 7%;
}

/* 週 */
.main-table th:nth-child(3),
.main-table td:nth-child(3) {
    width: 12%;
}

/* 祝日 */
.main-table th:nth-child(4),
.main-table td:nth-child(4),
.main-table th:nth-child(5),
.main-table td:nth-child(5),
.main-table th:nth-child(6),
.main-table td:nth-child(6),
.main-table th:nth-child(7),
.main-table td:nth-child(7) {
    width: 13%;
}

/* 出勤時間～勤務時間 */
.main-table th:nth-child(8),
.main-table td:nth-child(8) {
    width: 25%;
}

.summary-table td:nth-child(1),
.summary-table td:nth-child(3) {
    width: 150px;
}

.summary-table td:nth-child(2),
.summary-table td:nth-child(4) {
    width: 250px;
}

.summary-table {
    width: 40%;
    margin-top: 5px;
    border-collapse: collapse;

}

.summary-table td {
    border: 1px solid gray;
    text-align: center;
}

/* 🔹 閉じるボタン */
.close-button {
    width: 100px;
    height: 30px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.close-button:hover {
    background-color: #c0392b;
}

/* 🔹 PDFボタン */
.pdf-button {
    width: 100px;
    height: 30px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.pdf-button:hover {
    background-color: #2980b9;
}
</style>