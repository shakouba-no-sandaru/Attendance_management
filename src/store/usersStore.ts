// userStore.ts //
import { defineStore } from 'pinia';
import axios from 'axios';
import { setting_values } from '../config.js';

const db_connect_url = `${setting_values.db_connect_url}/api/getdatabase`;

export const useStoreUser = defineStore('users', {
    state: () => ({
        count: 0,
        users: [{
            employee_id: 0,
            employee_name: '',
            employee_kana: '',
            mail_address: '',
            employee_post: 0,
            login_id: '',
            pass_word: ''
        }],
    }),

    getters: {
        doubleCount: (state) => state.count * 2,
    },
    actions: {
        increment() {
            this.count++;
        },
        async userLogin(inputLoginId: string, inputPassWord: string) {
            try {
                console.log('inputLoginId:', inputLoginId);
                const response = await axios.get(db_connect_url, {
                    params: {
                        queryName: 'getLoginInfo', // 呼び出しクエリ
                        queryParams: JSON.stringify([inputLoginId]), 
                    },
                });
                console.log('response.data:', response.data);

                const users = response.data;

                // 入力値とDBデータ比較
                const user = users.find(
                    (user: any) => user.login_id === inputLoginId && user.pass_word === inputPassWord
                );

                // ログイン判定処理
                if (user) {
                    console.log("ログインに成功しました");
                    this.users = [user];
                    this.count++;
                    return true;
                } else {
                    if (response.data.length == 0) {
                        console.warn('ユーザが見つかりませんでした');
                        return false;
                    }
                    console.warn("ログインに失敗しました");
                    return false;
                }
            } catch (error) {
                console.error('ログイン中にエラーが発生しました:', error);
            }
        },
        userLogout() {
            // ストア初期化
            this.$reset();
        },
    },
    persist: true,
})
