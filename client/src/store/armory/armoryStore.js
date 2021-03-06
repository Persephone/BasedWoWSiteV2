import Vue from "vue";
import axios from "axios";

const API_URL = process.env.API.ARMORY;

export default {
  namespaced: true,
  // ----------------------------------------------------------------------------------
  state: {
    ItemDisplayInfoMap: new Map(),
    ArmoryViewComponent: {
      ShowModal: false,
      Character: null,
      Realm: null
    },
    InventoryViewComponent: {
      ShowModal: false,
      Character: null,
      Realm: null
    }
  },
  // ----------------------------------------------------------------------------------
  getters: {
    ArmoryViewComponent: state => state.ArmoryViewComponent,
    InventoryViewComponent: state => state.InventoryViewComponent,
    GetItemDisplayInfoMap: state => state.ItemDisplayInfoMap,
    GetItemIconByDisplayId: state => id => {
      const icon = state.ItemDisplayInfoMap.get(id);
      return icon;
    }
  },
  // ----------------------------------------------------------------------------------
  mutations: {
    ToggleArmoryComponent(state, data) {
      const { Realm, Character } = data;
      state.ArmoryViewComponent.ShowModal = !state.ArmoryViewComponent
        .ShowModal;
      state.ArmoryViewComponent.Character = Character;
      state.ArmoryViewComponent.Realm = Realm;
    },
    ToggleInventoryComponent(state, data) {
      const { Realm, Character } = data;
      state.InventoryViewComponent.ShowModal = !state.InventoryViewComponent
        .ShowModal;
      state.InventoryViewComponent.Character = Character;
      state.InventoryViewComponent.Realm = Realm;
    },
    SetItemDisplayInfo(state, data) {
      const { id, icon } = data;
      state.ItemDisplayInfoMap.set(id, icon);
    },
    SetMultipleItemDisplayInfo(state, data) {
      for (const displayInfo of data) {
        state.ItemDisplayInfoMap.set(displayInfo.id, displayInfo.icon);
      }
    }
  },
  // ----------------------------------------------------------------------------------
  actions: {
    GetItemIcon: async (context, id) => {
      if (id === 0) return;

      // Attempt to retrieve from cache first
      const icon = context.getters.GetItemIconByDisplayId(id);
      if (icon) return icon;

      try {
        const response = await axios.get(`${API_URL}/GetItemDisplayInfo/${id}`);
        context.commit("SetItemDisplayInfo", response.data);
        return Promise.resolve(response.data.icon);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    GetItemIcons: async (context, ids) => {
      if (ids.length === 0) return;

      const iconMap = Array.from(context.getters.GetItemDisplayInfoMap.keys());
      const displayIdsNotInCache = ids.filter(x => !iconMap.includes(x));

      if (displayIdsNotInCache.length === 0) return;

      try {
        const response = await axios.post(`${API_URL}/GetItemDisplayInfo`, {
          DisplayIds: displayIdsNotInCache
        });
        context.commit("SetMultipleItemDisplayInfo", response.data);
        return Promise.resolve(response.data.icon);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    GetCharacterInventory: async (context, payload) => {
      const { RealmType, Guid } = payload;
      try {
        const response = await axios.post(`${API_URL}/GetCharacterInventory`, {
          Guid,
          RealmType
        });
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    GetCharacterStats: async (context, payload) => {
      const { RealmType, Guid } = payload;
      try {
        const response = await axios.post(`${API_URL}/GetCharacterStats`, {
          Guid,
          RealmType
        });
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    GetCharacterItems: async (context, payload) => {
      const { RealmType, Guid } = payload;
      try {
        const response = await axios.post(`${API_URL}/GetCharacterItems`, {
          Guid,
          RealmType
        });
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    ShowArmoryComponent: async (context, data) => {
      const { Realm, Character } = data;

      context.commit("ToggleArmoryComponent", {
        Realm,
        Character
      });
    },
    CloseArmoryComponent: (context, data) => {
      context.commit("ToggleArmoryComponent", {
        Realm: null,
        Guild: null
      });
    },
    ShowInventoryComponent: async (context, data) => {
      const { Realm, Character } = data;

      context.commit("ToggleInventoryComponent", {
        Realm,
        Character
      });
    },
    CloseInventoryComponent: (context, data) => {
      context.commit("ToggleInventoryComponent", {
        Realm: null,
        Guild: null
      });
    }
  }
};
