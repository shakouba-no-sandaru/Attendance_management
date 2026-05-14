<!-- MasterView.vue @ マスタ管理画面-->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreUser } from '../store/usersStore';
import axios from 'axios';
import HeaderBanner from '../components/HeaderBanner.vue'
import EmployeeRegistrationForm from '../components/EmployeeRegistrationForm.vue';
import { delEmployeeData } from '../delEmployeeData';
import { setting_values } from '../config';

const router = useRouter();
const storeUser = useStoreUser();

interface Employees {
    employee_id: number;
    employee_name: string;
    employee_kana: string;
    mail_address: string;
    post_name: string;
    login_id: string;
    pass_word: string;
};

const employees = ref<Employees[]>([]);
const showFormModal = ref(false);

const db_connect_url = `${setting_values.db_connect_url}/api/getdatabase`;

const fetchData = async () => {
    try {
        // APIを呼び出してデータを取得
        const response = await axios.get(db_connect_url, {
            params: { queryName: 'getEmployees' }, // クエリ名をリクエストに含める
        });
        employees.value = response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


onMounted(() => {
    fetchData();
});

const handleDelete = async (employee_id: number, login_id: string) => {
    console.log("削除情報：", employee_id, login_id);

    if (storeUser.users[0].login_id === login_id || storeUser.users[0].employee_post === 2 || storeUser.users[0].employee_post === 9) {
        const confirmation = confirm("本当に削除しますか？");
        if (confirmation) {
            const delEmployeeInfo = {
                employee_id,
                login_id
            };
            const result = await delEmployeeData(delEmployeeInfo);
            alert(`ログインID：${login_id}の情報を削除しました`);
            await fetchData();

            if (storeUser.users[0].login_id === login_id) {
                storeUser.userLogout();
                router.push('/');
            }
        } else {
            alert("削除をキャンセルしました。");
        }
    } else {
        alert(`本人・上長・管理者のみ削除可能です`);
    }
};


</script>

<template>
    <HeaderBanner />
    <div class="master-standard">
        <!-- 従業員登録フォーム処理 -->
        <div class="master-button-container">
            <button class="master-styled-button" @click="showFormModal = true">従業員新規登録</button>
            <EmployeeRegistrationForm v-if="showFormModal" @close="showFormModal = false" @update="fetchData" />
        </div>

        <!-- 従業員マスタ管理テーブル -->
        <div class="master-table-main">
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>氏名</th>
                        <th>カナ</th>
                        <th>メールアドレス</th>
                        <th>役職</th>
                        <th>ログインID</th>
                        <th>パスワード</th>
                        <th>削除</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="employee in employees" :key="employee.employee_id">
                        <td>{{ String(employee.employee_id).padStart(3,'0') }}</td>
                        <td>{{ employee.employee_name }}</td>
                        <td>{{ employee.employee_kana }}</td>
                        <td>{{ employee.mail_address }}</td>
                        <td>{{ employee.post_name }}</td>
                        <td>{{ employee.login_id }}</td>
                        <td>{{ employee.pass_word }}</td>
                        <td>
                            <button class="master-delete-button"
                                @click="handleDelete(employee.employee_id, employee.login_id)">削除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="master-button-container">
            <router-link to="/home">
                <button class="master-styled-button">Homeへ戻る</button>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.master-standard {
    font-family: 'BIZ UDPGothic';
}

/* ボタン全体のコンテナ */
.master-button-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
}

/* グレーのボタン */
.master-styled-button {
    width: 200px;
    height: 50px;
    background-color: #7c7c7c;
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: 'BIZ UDPGothic';
}

.master-styled-button:hover {
    background-color: #2e2e2e;
}

/* 削除ボタン */
.master-delete-button {
    padding: 8px 12px;
    font-size: 1rem;
    color: white;
    background-color: #d9534f;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'BIZ UDPGothic';
}

.master-delete-button:hover {
    background-color: #c9302c;
}

/* テーブル全体 */
.master-table-main {
    margin: 20px auto;
    width: 95%;
    max-width: 1200px;
    border-collapse: collapse;
    overflow: hidden;
}

/* テーブルタイトル */
.master-table-title {
    font-size: 2rem;
    margin-bottom: 15px;
    text-align: center;
}

/* テーブルヘッダー */
.master-table-main thead tr {
    background-color: #000000;
    color: white;
    font-size: 0.9rem;
}

/* 各カラムのスタイル */
.master-table-main th,
.master-table-main td {
    padding: 12px 15px;
    text-align: center;
    border: 1px solid black;
}

/* 幅調整 */
.master-table-main th:nth-child(1),
.master-table-main td:nth-child(1) {
    width: 2%;
}

.master-table-main th:nth-child(2),
.master-table-main th:nth-child(3),
.master-table-main td:nth-child(2),
.master-table-main td:nth-child(3) {
    width: 12%;
}

.master-table-main th:nth-child(4),
.master-table-main th:nth-child(6),
.master-table-main td:nth-child(4),
.master-table-main td:nth-child(6) {
    width: 13%;
}

.master-table-main th:nth-child(5),
.master-table-main th:nth-child(7),
.master-table-main th:nth-child(8),
.master-table-main td:nth-child(5),
.master-table-main td:nth-child(7),
.master-table-main td:nth-child(8) {
    width: 8%;
}
</style>