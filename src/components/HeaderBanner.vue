<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStoreUser } from '../store/usersStore';
import { getCurrentTime } from '../getCurrentTime';
import { setting_values } from '../config';

const now_daytime = ref(getCurrentTime()); // 初期値を設定
const storeUser = useStoreUser();
const employee = computed(() => storeUser.users[0] || null);

//ここは消しちゃダメ（カウントしたいときに戻す）
// const intervalId = setInterval(() => {
//   now_daytime.value = getCurrentTime();
// }, 1000);

onUnmounted(() => {
  // clearInterval(intervalId); // ← これ大事！
});

</script>

<template>
  <header class="head-header">
    <div class="head-header_top">
      <div class="head-logo">
        <img alt="Vue logo" class="head-logo-img" src="@/assets/work_man.png" width="125" height="125" />
      </div>
      <div class="head-title">
        <img alt="Vue logo" class="head-title-img" src="@/assets/shuttaikun_title.png" width="125" height="25" />
        <!-- <h1>出退くん</h1> -->
        <h3>
          毎月の就業時間を登録してください<br>
          <!-- <a href="https://www.likewell.tech/" target="_blank" rel="noopener">ライクウェル</a> -->
        </h3>
      </div>
      <div class="head-information">
        <!-- <p>現在時刻</p>
        <p :title="`${now_daytime.hour}時${now_daytime.minute}分${now_daytime.second}秒`">
          {{ now_daytime.year }}年
          {{ now_daytime.month }}月
          {{ now_daytime.day }}日
          {{ now_daytime.week }}曜日
          {{ now_daytime.hour }}時
          {{ now_daytime.minute }}分
        </p> -->
        <h2>ログイン情報</h2>
        <h2>ログイン名：{{ employee.employee_name }}　/　ログインID：{{ employee.login_id }}</h2>
      </div>
      <div class="head-logout">
        <router-link to="/">
          <button @click="storeUser.userLogout">ログアウト</button>
        </router-link>

      </div>
    </div>
    <div :class="setting_values.ope_environment === 'ope_dev' ? 'head-navigation-dev' : 'head-navigation-pro'">
      <nav>
        <ul>
          <li>
            <RouterLink to="/home">Home</RouterLink>
          </li>
          <li>
            <RouterLink to="/attendance">勤怠管理</RouterLink>
          </li>
          <li>
            <RouterLink to="/master">マスタ管理</RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.head-header {
  width: 100%;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f5f5f5;
  border-bottom: 2px solid #ccc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 100px;
  font-family: 'BIZ UDPGothic';
}

.head-header_top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
}

.head-logo {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.head-logo-img {
  width: 150px;
  height: 150px;
}

.head-title-img {
  width: 300px;
  height: 100px;
  padding-bottom: 20px;

}

.head-title {
  flex: 2;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px;
}

.head-title h1 {
  font-size: 2.5rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.head-title h3 {
  font-size: 1rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.head-information {
  flex: 3;
  text-align: center;
  line-height: 1.5em;
  margin: 20px auto;
  max-width: 600px;
  background: #abc8ec;
  border-radius: 4px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px 20px;
}

/* 内部のテキストスタイル */
.head-information p {
  margin: 10px 0;
  font-weight: bold;
  color: #333;
}

button {
  width: 110px;
  padding: 12px;
  font-size: 1rem;
  color: white;
  background-color: #1a73e8;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 20px;
  font-family: 'BIZ UDPGothic';
}

button:hover {
  background-color: #1558c3;
}

/* 本番環境用 */
.head-navigation-pro {
  background: #559cf3;
  padding: 10px 0;
  font-size: 1.5rem;
  position: relative;
  height: auto;
  min-height: 50px;
  z-index: 10;
}

.head-navigation-pro ul {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  list-style: none;
  margin: 0;
  padding: 0;
}

.head-navigation-pro li {
  width: 200px;
  text-align: center;
}

.head-navigation-pro li a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  text-decoration: none;
  color: #fff;
  font-size: 1.3rem;
}

.head-navigation-pro li a:hover {
  background-color: #05499c;
}


/* 開発環境用 */
.head-navigation-dev {
  background: #f39455;
  padding: 10px 0;
  font-size: 1.5rem;
  position: relative;
  height: auto;
  min-height: 50px;
  z-index: 10;
}

.head-navigation-dev ul {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  list-style: none;
  margin: 0;
  padding: 0;
}

.head-navigation-dev li {
  width: 200px;
  text-align: center;
}

.head-navigation-dev li a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  text-decoration: none;
  color: #fff;
  font-size: 1.3rem;
}

.head-navigation-dev li a:hover {
  background-color: #9c3005;
}

@media screen and (max-width: 600px) {
  .head-header {
    width: 100%;
    height: 300px;
  }

  .head-header_top {
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
  }

  .head-logo-img {
    width: 80px;
    height: 80px;
    align-items: left;
  }

  .head-title-img {
    width: 180px;
    height: auto;
    margin-top: 10px;
  }

  .head-title h3 {
    font-size: 0.8rem;
    margin-top: 5px;
  }

  .head-information {
    margin: 10px auto;
    padding: 10px;
    padding-top: 0px;
    padding-bottom: 0px;
    font-size: 0.7rem;
    max-width: 90%;
    background: #e3f1ff;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    line-height: 0.3px;
  }

  .head-logout {
    margin-top: 5px;
    text-align: center;
  }

  .head-logout button {
    width: 90px;
    font-size: 0.8rem;
    padding: 8px;
    margin-left: 0;
  }

  .head-navigation-pro ul,
  .head-navigation-dev ul {
    flex-direction: row;
    justify-content: space-around;
  }

  .head-navigation-pro li,
  .head-navigation-dev li {
    width: auto;
    flex: 1;
  }

  .head-navigation-pro li a,
  .head-navigation-dev li a {
    font-size: 1rem;
  }
}
</style>
