<template>
  <b-modal
    centered
    size="xl"
    id="guild-modal"
    v-if="Guild"
    @show="OpenModal()"
    @hide="CloseModal()"
    :title="Guild.name"
    header-bg-variant="warning"
  >
    <guild-view-component v-if="Guild" :guild="Guild" :realm="Realm" :user="user"></guild-view-component>
  </b-modal>
</template>

<script>
import GuildViewComponent from "./GuildViewComponent";

export default {
  name: "GuildComponent",
  props: ["user"],
  data() {
    return {};
  },
  components: {
    "guild-view-component": GuildViewComponent
  },
  computed: {
    ShowModal() {
      return this.$store.getters["user/guild/GuildViewComponent"].ShowModal;
    },
    Realm() {
      return this.$store.getters["user/guild/GuildViewComponent"].Realm;
    },
    Guild() {
      return this.$store.getters["user/guild/GuildViewComponent"].Guild;
    }
  },
  methods: {
    OpenModal() {
      const Guild = this.Guild.name;
      const RealmType = this.Realm.id;

      this.$router.replace({
        query: Object.assign({}, this.$route.query, {
          guild: Guild
        })
      });
    },
    CloseModal() {
      this.$store.dispatch("user/guild/CloseGuildComponent");

      const QUERY = this.$route.query;

      this.$router.replace({
        query: Object.assign({}, this.$route.query, {
          guild: undefined
        })
      });
    }
  }
};
</script>