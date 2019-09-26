<template>
  <b-card no-body>
    <b-tabs
      v-model="BankTabIndex"
      pills
      small
      card
      vertical
      end
      active-nav-item-class="bank-tab-right"
    >
      <b-tab v-for="tab in BankTabs" :key="tab.tabId" class="bank-tab">
        <template v-slot:title>
          <div class="item-container">
            <b-img
              class="item"
              v-b-tooltip.hover
              :title="tab.tabName"
              rounded
              :src="'https://wow.zamimg.com/images/wow/icons/large/' + tab.tabIcon + '.jpg'"
            ></b-img>
          </div>
        </template>
        <b-card-text>
          <div v-if="ItemsLoading" class="center-content">
            <b-spinner style="width: 4rem; height: 4rem;" variant="primary" label="Spinning"></b-spinner>
          </div>

          <b-row class="bank-items" v-if="!ItemsLoading">
            <b-col
              cols="6"
              md="3"
              lg="1"
              v-for="item in GetItemsForActiveTab"
              :key="item.itemEntry"
              class="inventory-item"
            >
              <b-badge variant="dark">
                <item
                  :eSlot="item.slot"
                  :entry="item.itemEntry"
                  :item="item.item"
                  :realm="realm.id"
                ></item>
                {{item.itemCount}}
              </b-badge>
            </b-col>
          </b-row>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
export default {
  name: "GuildBankComponent",
  props: ["guild", "realm"],
  data() {
    return {
      TabsLoading: false,
      ItemsLoading: false,
      BankTabs: [],
      BankItems: [],
      BankTabIndex: 0
    };
  },
  computed: {
    GetItemsForActiveTab() {
      return this.BankItems.filter(x => x.slot === this.BankTabIndex);
    }
  },
  watch: {
    BankTabIndex: function(val, old) {
      this.$emit("tabChange", this.GetBankTabById(val));
    }
  },
  methods: {
    async GetGuildBankTabs() {
      this.TabsLoading = true;

      const BankTabs = await this.$store.dispatch(
        "user/guild/GetGuildBankTabs",
        {
          GuildId: this.guild.id,
          RealmType: this.realm.id
        }
      );

      this.BankTabs = BankTabs;

      this.TabsLoading = false;
    },
    async GetGuildBankItems() {
      this.ItemsLoading = true;

      try {
        const BankItems = await this.$store.dispatch(
          "user/guild/GetGuildBankItems",
          {
            GuildId: this.guild.id,
            RealmType: this.realm.id
          }
        );

        this.BankItems = this.MergeDuplicateItems(BankItems);

        await this.GetItemIcons();
      } finally {
        this.ItemsLoading = false;
      }
    },
    async GetItemIcons() {
      const displayIdsList = this.BankItems.map(x => x.item.displayId);
      await this.$store.dispatch("armory/GetItemIcons", displayIdsList);
    },
    MergeDuplicateItems(items) {
      return items.reduce(function(accumulator, cur) {
        const entry = cur.itemEntry;
        const found = accumulator.find(x => x.itemEntry == entry);
        if (found) found.itemCount += cur.itemCount;
        else accumulator.push(cur);
        return accumulator;
      }, []);
    },
    GetBankTabById() {
      return this.BankTabs.find(x => x.tabId === this.BankTabIndex);
    }
  },
  created() {
    this.GetGuildBankTabs();
    this.GetGuildBankItems();
  }
};
</script>

<style scoped>
.item {
  padding: 6px;
}

.item-container {
  margin-top: 0.2rem;
  background-image: url("~@/assets/images/armory/equipment_slots/item_frame.png");
  background-repeat: no-repeat;
  background-position: top center;
  min-width: 68px;
  min-height: 68px;
}

.card-body {
  height: 100%;
}

.bank-tab {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}

.bank-items {
  padding: 1px;
}

.inventory-item {
  padding: 2px;
  margin-bottom: 0.25rem;
}
</style>