<!-- EmployeeRegistrationForm.vue @従業員登録フォーム -->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreUser } from '../store/usersStore';
import axios from 'axios';
import HeaderBanner from '../components/HeaderBanner.vue'
import { regEmployeeData, EmployeeDataCheck, regEmployeeIdPool } from '../putEmployeeData'
import { regNewUserAppData,regEmployeeNowId } from '../applicationApproval';
import { getCurrentTime } from '../getCurrentTime';

interface Registrationform {
  employee_name: string,
  employee_kana: string,
  mail_address: string,
  employee_post: string,
  login_id: string,
  pass_word: string
};
const storeUser = useStoreUser();
const registrationform = ref<Registrationform>({
  employee_name: '',
  employee_kana: '',
  mail_address: '',
  employee_post: '',
  login_id: '',
  pass_word: ''
});

// 役職リストをデータとして定義
const posts = ref([
  { value: 1, label: '一般' },
  { value: 2, label: '上長' },
  { value: 9, label: '管理者' },
]);

const emit = defineEmits(['close', 'update']);
const now_daytime = ref(getCurrentTime());

const handleSubmit = async () => {
  console.log("登録情報：", registrationform.value);
  const result = await EmployeeDataCheck(registrationform.value.login_id);
  if (!result) {
    alert(`ログインID[${registrationform.value.login_id}]は既にデータは登録済です`);
    return;
  }
  else {
    const result_regEmployeeData = await regEmployeeData(registrationform.value);
    const result_regEmployeeNowId = await regEmployeeNowId();
    const result_regNewUserAppData = await regNewUserAppData(result_regEmployeeNowId, now_daytime.value.year, now_daytime.value.month);
    const result_regEmployeeIdPool = await regEmployeeIdPool();
    alert('従業員の登録が完了が完了しました');
  }


  emit('update');
  emit('close');

};


</script>

<template>
  <div class="emp-modal-backdrop">
    <div class="emp-modal-content" @click.stop>
      <h2>従業員登録フォーム</h2>
      <form @submit.prevent="handleSubmit">
        <div class="emp-form-group">
          <label>氏名</label>
          <input v-model="registrationform.employee_name" placeholder="※氏名" required />
        </div>

        <div class="emp-form-group">
          <label>かな</label>
          <input v-model="registrationform.employee_kana" placeholder="かな" />
        </div>

        <div class="emp-form-group">
          <label>メールアドレス</label>
          <input v-model="registrationform.mail_address" placeholder="メールアドレス" />
        </div>

        <div class="emp-form-group">
          <label>役職</label>
          <select v-model="registrationform.employee_post" required>
            <option value="" disabled>役職を選択してください</option>
            <option v-for="post in posts" :key="post.value" :value="post.value">{{ post.label }}</option>
          </select>
        </div>

        <div class="emp-form-group">
          <label>ログインID</label>
          <input v-model="registrationform.login_id" placeholder="※ログインID" required />
        </div>

        <div class="emp-form-group">
          <label>パスワード</label>
          <input v-model="registrationform.pass_word" type="password" placeholder="※パスワード" required />
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
</style>
