<!-- LoginView.vue @ ホーム画面-->
<script setup type="module" lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreUser } from '../store/usersStore';
import { setting_values } from '../config';

const storeUser = useStoreUser();
const router = useRouter();

// ログイン用フォーム入力値
const loginId = ref('');
const passWord = ref('');
const noLoginMsg = ref('');

const handleLogin = async () => {
    const result = await storeUser.userLogin(loginId.value, passWord.value);
    if (result) {
        // ログイン成功でホーム画面へ
        router.push('/home');
    } else {
        noLoginMsg.value = "ログインできませんでした";
    }
};

</script>
<template>
    <div class="login-Sytle">
        <h1>出退くん</h1>

        <form @submit.prevent="handleLogin" :class="setting_values.ope_environment === 'ope_dev' ? 'form-setting-dev' : 'form-setting-pro'">
            <!-- <div :class="setting_values.ope_environment === 'ope_dev' ? 'head-navigation-dev' : 'head-navigation-pro'"> -->
            <div class="form-group">
                <label for="loginId">ログインID</label>
                <input v-model="loginId" type="text" id="loginId" placeholder="ログインIDを入力" required />
            </div>
            <div class="form-group">
                <label for="passWord">パスワード</label>
                <input v-model="passWord" type="password" id="passWord" placeholder="パスワードを入力" required />
            </div>
            <button type="submit">ログイン</button>
            <p>{{ noLoginMsg }}</p>
        </form>
    </div>

    <!-- <router-link to="/home">
        <button @click="storeUser.increment">開発用ログイン★Homeへ戻る★</button>
    </router-link>

    <p>count:{{ storeUser.count }}</p>
    <p>LoginUser:{{ storeUser.users }}</p> -->


</template>




<style scoped>
/* 画面全体を中央配置 */

.login-Sytle {
    display: flex;
    flex-direction: column;
    justify-content: center;    /* 垂直方向の中央揃え */
    align-items: center;    /* 水平方向の中央揃え */
    height: 80vh;    /* ビューポート全体の高さを確保 */
    text-align: center;
    font-family: 'BIZ UDPGothic';
}

/* フォームのデザイン */
.form-setting-dev {
    display: flex;
    flex-direction: column;
    align-items: center;    /* 入力要素を中央揃え */
    background: #f39455;
    padding: 50px;
    border-radius: 12px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    width: 280px;
    height: 250px;
}

.form-setting-pro {
    display: flex;
    flex-direction: column;
    align-items: center;    /* 入力要素を中央揃え */
    background: #abc8ec;
    padding: 50px;
    border-radius: 12px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    width: 280px;
    height: 250px;
}

.form-group {
    display: flex;
    flex-direction: column;
    align-items: center; /* 入力フィールドを中央揃え */
    width: 100%;
}

/* ラベル */
label {
    font-size: 1rem;
    text-align: center;
    color: black;
    margin-bottom: 8px;
}

/* 入力フィールド */
input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
}

/* ボタン */
button {
    width: 60%;
    padding: 12px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: #1a73e8;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 8px;
    margin-bottom: 8px;
}

button:hover {
    background-color: #1558c3;
}

p{
    color: red;
}


@media screen and (max-width: 480px) {
  .form-setting-dev,
  .form-setting-pro {
    width: 90%;
    height: auto;
    padding: 30px 20px;
    box-sizing: border-box;
  }

  input {
    font-size: 1rem;
  }

  button {
    width: 100%;
  }
}


</style>