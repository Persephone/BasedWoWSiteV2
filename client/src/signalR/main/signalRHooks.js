import store from "@/store";

export default class SignalrHooks {
  constructor(connection, vm) {
    this.connection = connection;
    this.vm = vm;
  }

  OnOnlineUsersUpdate() {
    this.connection.on("UpdateOnlineUsers", (userCount, visitorCount) => {
      store.commit("stats/SetOnlineUsers", userCount);
      store.commit("stats/SetOnlineVisitors", visitorCount);
    });
  }

  OnUpdateUserInformations() {
    this.connection.on("UpdateUserInformations", (user, count) => {
      store.commit("stats/SetNewestUser", user);
      store.commit("stats/SetTotalUserCount", count);
    });
  }

  OnReceiveShoutBoxMessage() {
    this.connection.on("ReceiveShoutBoxMessage", shout => {
      store.commit("shoutbox/AddNewShout", shout);
    });
  }

  OnClearShoutBox() {
    this.connection.on("ClearShoutBox", () => {
      store.commit("shoutbox/SetShouts", []);
    });
  }

  OnEditShout() {
    this.connection.on("EditShout", shout => {
      store.commit("shoutbox/EditShout", shout);
    });
  }

  OnDeleteShout() {
    this.connection.on("DeleteShout", id => {
      store.commit("shoutbox/DeleteShout", id);
    });
  }

  async OnLogout() {
    this.connection.on("LogoutUser", async () => {
      await store.dispatch("user/Logout");
    });
  }

  OnValidateVersion() {
    this.connection.on("ValidateVersion", version => {
      const currentVersion = store.getters.GetWebsiteVersion;
      if (currentVersion !== version) {
        if (currentVersion.length === 0) {
          store.commit("UpdateWebsiteVersion", version);
        } else {
          this.vm.$bvToast.toast(
            "There has been deployed a new website version. The website will reload shortly to apply the new updates.",
            {
              title: "Website Update",
              variant: "primary",
              solid: true,
              autoHideDelay: 6000,
              noCloseButton: true
            }
          );
          setTimeout(() => window.location.reload(true), 5500);
        }
      }
    });
  }

  OnSynchronizeAccountData() {
    this.connection.on("SynchronizeAccountData", data => {
      const { vp, dp } = data;
      store.commit("user/UpdateUser", { index: "vp", value: vp });
      store.commit("user/UpdateUser", { index: "dp", value: dp });
    });
  }

  // ------------------ CHAT HOOKS -------------------
  OnMessageReceived() {
    this.connection.on("SendMessage", message => {
      store.commit("chat/AddGroupMessage", message);
    });
  }

  OnGroupChatCreated() {
    this.connection.on("GroupChatCreated", (groupChat, createdBy) => {
      store.commit("chat/GroupChatCreated", groupChat);
      this.vm.$bvToast.toast(`${createdBy} has started a new chat with you!`, {
        title: "Chat",
        variant: "success",
        solid: true
      });
    });
  }

  OnGroupChatUpdated() {
    this.connection.on("GroupChatUpdated", groupChat => {
      store.commit("chat/GroupChatUpdated", groupChat);
    });
  }

  OnGroupChatRemoved() {
    this.connection.on("GroupChatRemoved", (id, leaver) => {
      store.commit("chat/GroupChatRemoved", id);
      this.vm.$bvToast.toast(`${leaver} has left the chat.`, {
        title: "Chat",
        variant: "warning",
        solid: true
      });
    });
  }

  // -------------------------------------------------
  RunHooks() {
    this.OnOnlineUsersUpdate();
    this.OnUpdateUserInformations();
    this.OnReceiveShoutBoxMessage();
    this.OnClearShoutBox();
    this.OnEditShout();
    this.OnDeleteShout();
    this.OnLogout();
    this.OnValidateVersion();
    this.OnSynchronizeAccountData();
    this.OnMessageReceived();
    this.OnGroupChatUpdated();
    this.OnGroupChatRemoved();
    this.OnGroupChatCreated();
  }
}
