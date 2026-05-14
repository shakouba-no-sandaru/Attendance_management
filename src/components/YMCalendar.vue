<!-- YMCalendar.vue @年月カレンダー -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { generateMonthList, generateYearList, getCalendar } from '../getCalendar';
import { getCurrentTime } from '../getCurrentTime';

interface CalendarData {
    cal_year: number;
    cal_month: number;
    cal_day: number;
    cal_week: string;
    cal_holiday: string;
}


// 現在時刻
const now_daytime = ref(getCurrentTime());

// List用年月取得
const cal_year_list = generateYearList(2024, 2034);
const cal_month_list = generateMonthList();

// 選択された年月
const selected_year = ref<number>(now_daytime.value.year);
const selected_month = ref<number>(now_daytime.value.month);

// 選択された年と月を基にカレンダーを計算
// const calendar = computed(() => {
//   if (selected_year.value && selected_month.value) {
//     return getCalendar(selected_year.value, selected_month.value);
//   }
//   return [];
// });
const calendar = ref<CalendarData[]>([]);

// カレンダーデータを渡す用emit定義
const emit = defineEmits(['calendar_data']);
const handleChange = () => {
  if (selected_year.value && selected_month.value) {
    emit('calendar_data', { selected_year: selected_year.value, selected_month: selected_month.value, calendar });
  }
};

// // 選択変更時カレンダー取得情報更新
// watch([selected_year, selected_month], () => {
//   console.log('選択された年月:', selected_year.value, selected_month.value);
//   console.log('カレンダー:', calendar.value);
// });
// 選択変更時カレンダー取得情報更新（非同期対応）
watch([selected_year, selected_month], async () => {
  if (selected_year.value && selected_month.value) {
    console.log('選択された年月:', selected_year.value, selected_month.value);
    calendar.value = await getCalendar(selected_year.value, selected_month.value);
    console.log("カレンダー:", calendar.value);
    handleChange();
  }
}, { immediate: true }); // マウント時にも実行

onMounted(handleChange);

</script>

<template>
  <div class="cal-calendar">
    <div class="cal-controls">
      <select id="year_list" v-model="selected_year" @change="handleChange">
        <option v-for="year in cal_year_list" :key="year.value" :value="year.label">{{ year.label }}年</option>
      </select>
      <select id="month" v-model="selected_month" @change="handleChange">
        <option v-for="month in cal_month_list" :key="month.value" :value="month.label">{{ month.label }}月</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.cal-calendar {
  padding-left: 40px;
  width: 100%;
  height: 5vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: 'BIZ UDPGothic';
}

.cal-controls {
  height: 100px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.cal-controls select {
  font-size: 1rem;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #aaa;
  background-color: #f8f8f8;
  cursor: pointer;
  width: 180px;
  text-align: center;
  font-family: 'BIZ UDPGothic';
}

.cal-controls select:focus {
  border-color: #007bff;
  outline: none;
}
</style>
