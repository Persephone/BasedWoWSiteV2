import Vue from "vue";
import axios from "axios";

const API_URL = process.env.API.ACCOUNT;

export default {
  namespaced: true,
  // ----------------------------------------------------------------------------------
  state: {
    Account: null,
    Accounts: []
  },
  // ----------------------------------------------------------------------------------
  getters: {
    GetAccounts: state => state.Accounts,
    GetAccountData: state => state.Account
  },
  // ----------------------------------------------------------------------------------
  mutations: {
    SetAccount(state, data) {
      Vue.set(state, "Account", data);
    },
    SetAccounts: (state, roles) => {
      Vue.set(state, "Accounts", roles);
    },
    UpdateAccount(state, data) {
      const { oldAcc, newAcc } = data;
      Object.assign(oldAcc, newAcc);
    },
    UpdateAccountData(state, payload) {
      const { index, value } = payload;
      Vue.set(state.Account, index, value);
    }
  },
  // ----------------------------------------------------------------------------------
  actions: {
    SearchAccounts: async (context, query) => {
      try {
        const response = await axios.get(`${API_URL}/SearchAccounts/${query}`);
        const { accounts, count } = response.data;
        context.commit("SetAccounts", accounts);
        return Promise.resolve({ accounts, count });
      } catch (error) {
        return Promise.reject(error);
      }
    },
    GetAccountData: async context => {
      try {
        const result = await axios.get(`${API_URL}/GetAccountData`);
        context.commit("SetAccount", result.data);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    UpdateUsername: async (context, payload) => {
      const {
        Id,
        NewUsername,
        NewPassword,
        CurrentUsername,
        CurrentPassword
      } = payload;

      try {
        const result = await axios.post(`${API_URL}/Update/Username`, {
          Id,
          NewUsername,
          NewPassword,
          CurrentUsername,
          CurrentPassword
        });
        context.commit("UpdateAccountData", {
          index: "username",
          value: NewUsername
        });
        return Promise.resolve(result);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    UpdatePassword: async (context, payload) => {
      const {
        Id,
        NewUsername,
        NewPassword,
        CurrentUsername,
        CurrentPassword
      } = payload;

      try {
        const result = await axios.post(`${API_URL}/update/password`, {
          Id,
          NewUsername,
          NewPassword,
          CurrentUsername,
          CurrentPassword
        });
        return Promise.resolve(result);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    UpdateAccountAccess: async (context, payload) => {
      const { Account, AccessData } = payload;
      try {
        const result = await axios.post(`${API_URL}/UpdateAccountAccess`, {
          AccountId: Account.id,
          AccessData
        });
        context.commit("UpdateAccount", {
          oldAcc: Account,
          newAcc: result.data
        });
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }
};
