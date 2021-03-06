<template>
  <b-card-group class="card-member">
    <b-col v-for="(account, index) in OrderAccounts" :key="index" :sm="sm" :md="md" :lg="lg">
      <b-card no-body border-variant="dark" class="mt-2 mb-2">
        <b-card-header
          :header-bg-variant="GetCardColor(account)"
          header-text-variant="white"
          class="text-capitalize"
        >
          <span class="click-able" @click="FilterAccount(account)">
            <text-highlight :queries="GetQuery">{{account.username}}</text-highlight>
          </span>
          <span class="float-right">{{ GetActiveBanData(account) ? '[BANNED]' : '' }}</span>
        </b-card-header>

        <b-card-body>
          <b-list-group>
            <b-list-group-item>
              Account Id:
              <span class="float-right">
                <text-highlight :queries="GetQuery">{{account.id}}</text-highlight>
              </span>
            </b-list-group-item>
            <b-list-group-item>
              Email:
              <span class="float-right">
                <text-highlight :queries="GetQuery">{{account.email}}</text-highlight>
              </span>
            </b-list-group-item>
            <b-list-group-item>
              Last Ip:
              <span class="float-right">
                <text-highlight :queries="GetQuery">{{account.lastIp}}</text-highlight>
              </span>
            </b-list-group-item>
            <b-list-group-item>
              Last Login:
              <span class="float-right">
                <text-highlight :queries="GetQuery">{{GetDate(account.lastLogin)}}</text-highlight>
              </span>
            </b-list-group-item>
            <b-list-group-item>
              Joindate:
              <span class="float-right">{{GetDate(account.joinDate)}}</span>
            </b-list-group-item>
            <b-list-group-item>
              <b-button
                v-b-toggle="'account-access-' + index"
                variant="dark"
                block
              >Toggle Account Access</b-button>
              <b-collapse :id="'account-access-' + index">
                <b-row class="mt-3">
                  <b-container>
                    <b-table
                      responsive
                      striped
                      bordered
                      :items="account.accountAccess"
                      :fields="TableFields"
                      :sort-compare-options="{ numeric: true, sensitivity: 'base' }"
                    >
                      <template v-slot:cell(realmId)="data">{{GetRealmNameById(data.value)}}</template>
                      <template v-slot:cell(gmlevel)="data">
                        <font :color="GetGameRankColor(data.value)">{{GetGameRankName(data.value)}}</font>
                      </template>
                    </b-table>
                  </b-container>
                </b-row>
              </b-collapse>
            </b-list-group-item>
          </b-list-group>
        </b-card-body>

        <b-card-footer :footer-bg-variant="GetCardColor(account)" footer-text-variant="white">
          <b-button
            v-b-toggle="'account-controls-' + index"
            variant="dark"
            block
          >Toggle Account Controls</b-button>
          <b-collapse :id="'account-controls-' + index">
            <b-row class="mt-2">
              <b-col sm="12" md="6" lg="6" class="mt-2">
                <b-button variant="dark" block @click="OpenRoleEditor(account)">Manage Access</b-button>
              </b-col>
              <b-col sm="12" md="6" lg="6" class="mt-2">
                <b-button variant="dark" block disabled>Manage Account</b-button>
              </b-col>
              <b-col sm="12" md="6" lg="6" class="mt-2">
                <b-button
                  variant="warning"
                  block
                  :to="'/admin/members/search?query=' + account.email"
                >View Profile</b-button>
              </b-col>
              <b-col sm="12" md="6" lg="6" class="mt-2">
                <b-button
                  variant="warning"
                  block
                  @click="OpenCharacterEditor(account)"
                >View Characters</b-button>
              </b-col>

              <b-col sm="12" md="6" lg="6" class="mt-2">
                <b-button
                  variant="danger"
                  block
                  :disabled="GetActiveBanData(account) != null"
                  @click="OpenAccountBanEditor(account)"
                >Ban</b-button>
              </b-col>
              <b-col sm="12" md="6" lg="6" class="mt-2">
                <b-button variant="light" block @click="UnBanAccount(account)">Unban</b-button>
              </b-col>

              <b-col sm="12" md="6" lg="6" class="mt-2">
                <b-button
                  variant="danger"
                  block
                  :disabled="GetActiveBanData(account) != null"
                  @click="OpenAccountMuteEditor(account)"
                >Mute</b-button>
              </b-col>
              <b-col sm="12" md="6" lg="6" class="mt-2">
                <b-button variant="light" block @click="UnMuteAccount(account)">Unmute</b-button>
              </b-col>
              <b-col sm="12" md="6" lg="6" class="mt-2">
                <b-button variant="dark" block @click="OpenBanHistory(account)">Ban History</b-button>
              </b-col>
              <b-col sm="12" md="6" lg="6" class="mt-2">
                <b-button variant="dark" block @click="OpenMuteHistory(account)">Mute History</b-button>
              </b-col>
            </b-row>
          </b-collapse>
        </b-card-footer>
      </b-card>
    </b-col>
    <edit-access-component :roles="roles" :realms="realms" ref="editAccessComponent"></edit-access-component>
    <character-view-component
      :roles="roles"
      :realms="realms"
      :user="user"
      ref="characerViewComponent"
    ></character-view-component>
    <account-ban-component ref="accountBanComponent"></account-ban-component>
    <account-mute-component ref="accountMuteComponent"></account-mute-component>
    <account-view-ban-history-component ref="accountViewBanHistoryComponent"></account-view-ban-history-component>
    <account-view-mute-history-component ref="accountViewMuteHistoryComponent"></account-view-mute-history-component>
  </b-card-group>
</template>

<script>
import moment from "moment";
import UserHelper from "@/helpers/UserHelper";
import CharactersViewComponent from "@/components/Admin/Characters/CharactersViewComponent";
import AccountEditAccessComponent from "@/components/Admin/Accounts/Actions/AccountEditAccessComponent";
import AccountBanComponent from "@/components/Admin/Accounts/Actions/AccountBanComponent";
import AccountMuteComponent from "@/components/Admin/Accounts/Actions/AccountMuteComponent";
import AccountViewBanHistoryComponent from "@/components/Admin/Accounts/Views/AccountViewBanHistoryComponent";
import AccountViewMuteHistoryComponent from "@/components/Admin/Accounts/Views/AccountViewMuteHistoryComponent";
import { setTimeout } from "timers";

export default {
  name: "AccountViewComponent",
  props: ["user", "accounts", "roles", "sm", "md", "lg", "query", "realms"],
  data() {
    return {
      TableFields: [
        //{ key: "accountId", sortable: true, tdClass: "th-accountId" },
        {
          key: "gmlevel",
          label: "Rank",
          sortable: true,
          tdClass: "th-gmlevel"
        },
        {
          key: "realmId",
          label: "Realm",
          sortable: true,
          tdClass: "th-realmid"
        }
      ]
    };
  },
  components: {
    "edit-access-component": AccountEditAccessComponent,
    "character-view-component": CharactersViewComponent,
    "account-ban-component": AccountBanComponent,
    "account-mute-component": AccountMuteComponent,
    "account-view-ban-history-component": AccountViewBanHistoryComponent,
    "account-view-mute-history-component": AccountViewMuteHistoryComponent
  },
  computed: {
    OrderAccounts() {
      const temp = [...this.accounts];
      return temp.sort((a, b) => (a.id > b.id ? 1 : -1));
    },
    GetQuery() {
      return this.query ? this.query : "";
    }
  },
  methods: {
    FilterAccount(account) {
      this.$router.push(`/admin/accounts/search?query=${account.email}`);
    },
    GetBanData(account) {
      return account.accountBanned;
    },
    GetActiveBanData(account) {
      const banData = this.GetBanData(account);
      const banned = banData.find(x => x.active === 1);
      return banned;
    },
    GetCardColor(account) {
      const banned = this.GetActiveBanData(account);
      return banned ? "danger" : account.online ? "success" : "info";
    },
    GetRealmById(id) {
      return this.realms.find(x => x.id == id);
    },
    GetRealmNameById(id) {
      const realm = this.GetRealmById(id);
      return realm ? realm.name : "Global";
    },
    OpenRoleEditor(account) {
      if (!UserHelper.IsAdmin()) {
        this.$bvToast.toast("You are not authorized to perform action.", {
          title: "Unauthorized",
          variant: "danger",
          solid: true
        });
        return;
      }
      this.$refs.editAccessComponent.show(account);
    },
    OpenCharacterEditor(account) {
      this.$refs.characerViewComponent.show(account);
      this.$router.replace({
        query: Object.assign({}, this.$route.query, {
          characters: account.username
        })
      });
    },
    OpenAccountBanEditor(account) {
      if (!UserHelper.IsAdmin()) {
        this.$bvToast.toast("You are not authorized to perform action.", {
          title: "Unauthorized",
          variant: "danger",
          solid: true
        });
        return;
      }
      this.$refs.accountBanComponent.show(account);
    },
    OpenAccountMuteEditor(account) {
      if (!UserHelper.IsAdmin()) {
        this.$bvToast.toast("You are not authorized to perform action.", {
          title: "Unauthorized",
          variant: "danger",
          solid: true
        });
        return;
      }
      this.$refs.accountMuteComponent.show(account);
    },
    OpenBanHistory(account) {
      this.$refs.accountViewBanHistoryComponent.show(account);
    },
    OpenMuteHistory(account) {
      this.$refs.accountViewMuteHistoryComponent.show(account);
    },
    async UnBanAccount(account) {
      if (!UserHelper.IsAdmin()) {
        this.$bvToast.toast("You are not authorized to perform action.", {
          title: "Unauthorized",
          variant: "danger",
          solid: true
        });
        return;
      }

      const check = await this.$bvModal.msgBoxConfirm(
        `Are you sure you wish to unban ${account.username}?`,
        {
          centered: true,
          okTitle: "Yes"
        }
      );

      if (!check) return;

      await this.$store.dispatch("admin/UnBanAccount", account);

      this.$bvToast.toast(`${account.username} has been unbanned.`, {
        title: "Success",
        variant: "success",
        solid: true
      });
    },
    async UnMuteAccount(account) {
      if (!UserHelper.IsAdmin()) {
        this.$bvToast.toast("You are not authorized to perform action.", {
          title: "Unauthorized",
          variant: "danger",
          solid: true
        });
        return;
      }

      const check = await this.$bvModal.msgBoxConfirm(
        `Are you sure you wish to unmute ${account.username}?`,
        {
          centered: true,
          okTitle: "Yes"
        }
      );

      if (!check) return;

      await this.$store.dispatch("admin/UnMuteAccount", account);

      this.$bvToast.toast(`${account.username} has been unmuted.`, {
        title: "Success",
        variant: "success",
        solid: true
      });
    },
    GetGameRankColor(rank) {
      return UserHelper.GetGameRankColor(rank);
    },
    GetGameRankName(rank) {
      return UserHelper.GetGameRankName(rank);
    },
    GetDate(date) {
      return moment(date).format("MMMM Do YYYY, HH:mm:ss");
    }
  },
  mounted() {
    const query = this.$route.query;
    if (query) {
      const username = query.characters;
      if (username) {
        const account = this.accounts.find(x => x.username == username);
        if (account) {
          this.$refs.characerViewComponent.show(account);
        }
      }
    }
  }
};
</script>