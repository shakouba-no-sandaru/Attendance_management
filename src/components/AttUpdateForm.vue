<!-- AttUpdateForm.vue @従業員登録フォーム -->
<script setup lang="ts">
import { ref, onMounted, computed, defineProps, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreUser } from '../store/usersStore';
import axios from 'axios';
import HeaderBanner from '../components/HeaderBanner.vue'
import { regAttInsert, chkAttData, regAttUpdate } from '../putInOutTimes'
import { getCurrentTime } from '../getCurrentTime';

const storeUser = useStoreUser();

const props = defineProps<{
  attupdateform: {
    employee_id: number;
    year: number;
    month: number;
    day: number;
    clock_in_time: string;
    clock_out_time: string;
    break_time: string;
    remarks: string;
  } | null;
}>();

// INSERT/UPDATE用変数
const ediattupdateform = ref({
  clock_in_time: '',
  clock_out_time: '',
  break_time: '',
  remarks: '',
  employee_id: 0,
  year: 0,
  month: 0,
  day: 0
});

const emit = defineEmits(['close', 'update']);
const now_daytime = ref(getCurrentTime());
const formatTime = (time: string | null) => {
  return time ? time.slice(0, 5) : "00:00"; // "HH:mm" 形式にする
};

// props がセットされたタイミングで初期値として代入
watch(
  () => props.attupdateform,
  (newVal) => {
    if (newVal) {
      ediattupdateform.value = {
        clock_in_time: newVal.clock_in_time ? formatTime(newVal.clock_in_time) : '',
        clock_out_time: newVal.clock_out_time ? formatTime(newVal.clock_out_time) : '',
        break_time: newVal.break_time ? formatTime(newVal.break_time) : '',
        remarks: newVal.remarks || '',
        employee_id: newVal.employee_id,
        year: newVal.year,
        month: newVal.month,
        day: newVal.day
      };
    }
  },
  { immediate: true } // 初回マウント時にも実行
);

// 勤怠データ一括登録・更新処理
const handleSubmit = async () => {
  const toSend = {
    ...ediattupdateform.value,
    clock_in_time: ediattupdateform.value.clock_in_time || null,
    clock_out_time: ediattupdateform.value.clock_out_time || null,
    break_time: ediattupdateform.value.break_time || null,
    remarks: ediattupdateform.value.remarks || null
  };
  console.log("登録情報：", toSend);

  // 勤怠情報有無の確認
  const chk_result = await chkAttData(toSend);

  // 勤怠情報が既に登録されていない場合は新規挿入
  if (chk_result[0].chkAttData == 0) {
    console.log("勤怠データ登録処理");
    const insert_result = await regAttInsert(toSend);
  }

  // 勤怠情報が既に登録されている場合は更新
  else if (chk_result[0].chkAttData >= 1) {
    console.log("勤怠データ更新処理");
    const update_result = await regAttUpdate(toSend);
  }

  alert('更新が完了が完了しました');

  emit('update');
  emit('close');

};


</script>

<template>
  <div class="emp-modal-backdrop">
    <div class="emp-modal-content" @click.stop>
      <h2>勤怠修正フォーム</h2>
      <form @submit.prevent="handleSubmit">

        <div class="emp-form-group">
          氏名：
          {{ props.attupdateform?.year }}年{{ props.attupdateform?.month }}月{{ props.attupdateform?.day }}日
        </div>

        <div class="emp-form-group">
          <label>出勤時間</label>
          <div class="emp-input-clear-wrapper">
            <input v-model="ediattupdateform.clock_in_time" type="time" />
            <button type="button" class="clear-button" @click="ediattupdateform.clock_in_time = ''">×</button>
          </div>
        </div>

        <div class="emp-form-group">
          <label>退勤時間</label>
          <div class="emp-input-clear-wrapper">
            <input v-model="ediattupdateform.clock_out_time" type="time" />
            <button type="button" class="clear-button" @click="ediattupdateform.clock_out_time = ''">×</button>
          </div>
        </div>

        <div class="emp-form-group">
          <label>休憩時間</label>
          <div class="emp-input-clear-wrapper">
            <input v-model="ediattupdateform.break_time" type="time" />
            <button type="button" class="clear-button" @click="ediattupdateform.break_time = ''">×</button>
          </div>
        </div>

        <div class="emp-form-group">
          <label>備考</label>
          <div class="emp-input-clear-wrapper">
            <input v-model="ediattupdateform.remarks" type="text" />
            <button type="button" class="clear-button" @click="ediattupdateform.remarks = ''">×</button>
          </div>
        </div>

        <div class="emp-button-group">
          <button type="submit">登録</button>
          <button type="button" @click="$emit('close')">閉じる</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* モーダルの背景 */
.emp-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-family: 'BIZ UDPGothic';
}

/* モーダルの内容 */
.emp-modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 400px;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

/* 入力項目を整列 */
.emp-form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 15px;
}

.emp-form-group label {
  margin-bottom: 5px;
}

.emp-form-group input,
.emp-form-group select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

/* ボタンスタイル */
.emp-button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.emp-button-group button {
  width: 48%;
  padding: 12px;
  font-size: 1rem;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.emp-button-group button:hover {
  background-color: #388E3C;
}

/* 閉じるボタンの色 */
.emp-button-group button:nth-child(2) {
  background-color: #d9534f;
}

.emp-button-group button:nth-child(2):hover {
  background-color: #c9302c;
}

.emp-input-clear-wrapper {
  position: relative;
  width: 100%;
}

.emp-input-clear-wrapper input {
  width: 100%;
  padding-right: 2rem;
  /* ボタンがかぶらないように右余白を追加 */
}

.clear-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
  padding: 0;
}

.clear-button:hover {
  color: #000;
}
</style>
