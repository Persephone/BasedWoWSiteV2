<template>
  <div class="container text-center">
    <div class="d-flex justify-content-center" v-if="loading" id="atom-spinner">
      <semipolar-spinner :animation-duration="2000" :size="250" :color="'#7289da'"/>
    </div>
    <div v-else id="online-section">
      <div v-for="realm in realms" :key="realm.id">
        <h4>{{ realm.name }}</h4>
        <p class="lead h4">There are {{ realm.allianceOnline + realm.hordeOnline }} players online</p>
        <p class="h4">
          <img src="/static/images/alliance_min.png" title="Alliance">
          {{ realm.allianceOnline }} - {{ realm.hordeOnline }}
          <img
            src="/static/images/horde_min.png"
            title="Horde"
          >
        </p>
        <br>
        <div class="table-responsive">
          <table class="table table-striped table-bordered" ts-wrapper>
            <thead>
              <th ts-criteria="name|lowercase" ts-default="ascending">Character</th>
              <th ts-criteria="class|parseInt">Class</th>
              <th ts-criteria="race|parseInt">Race</th>
              <th ts-criteria="faction|lowercase">Faction</th>
              <th ts-criteria="level|parseInt">Level</th>
              <th ts-criteria="zone|parseInt">Map</th>
            </thead>
            <tbody>
              <tr v-for="player in realm.players" :key="player.name">
                <td>
                  <strong>{{ player.name }}</strong>
                </td>
                <td>
                  <img class="online-image" :src="'/static/images/class/' + player.class + '.gif'">
                </td>
                <td>
                  <img
                    class="online-image"
                    :src="'/static/images/race/' + player.race + '-' + player.gender + '.gif'"
                  >
                </td>
                <td>
                  <img class="online-image" :src="'/static/images/' + GetFaction(player.race)">
                </td>
                <td>
                  <strong>{{ player.level }}</strong>
                </td>
                <td>
                  <strong>{{ GetZoneName(player.zone) }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GetZone from "@/helpers/Maps";
import { SemipolarSpinner } from "epic-spinners";
import { Realm } from "../../data/models/Realm";
import { EventBus } from "@/helpers/EventBus.js";
import config from "../../../static/config/config";

const STATUS_API = process.env.API.STATUS;

export default {
  data() {
    return {
      realms: [],
      loading: false,
      UpdateTimer: null
    };
  },
  components: {
    "semipolar-spinner": SemipolarSpinner
  },
  methods: {
    async PopulateRealms() {
      this.loading = true;

      this.realms = [];

      for (const realm of config.REALMS) {
        const newRealm = new Realm(realm.id, realm.name);

        try {
          const onlinePlayerData = await this.LoadOnlinePlayers(realm.chardb);
          const { aonline, honline, result } = onlinePlayerData;
          newRealm.allianceOnline = aonline;
          newRealm.hordeOnline = honline;
          newRealm.players = result;
        } catch (err) {
          this.$toasted.error(err);
        }

        this.realms.push(newRealm);
      }
    },
    async LoadOnlinePlayers(database) {
      const data = await this.$http.post(`${STATUS_API}/online/players`, {
        database: database
      });
      return data.data;
    },
    GetZoneName(zoneId) {
      return GetZone(zoneId);
    },
    GetFaction(race) {
      switch (parseInt(race, 10)) {
        case 2:
        case 5:
        case 6:
        case 8:
        case 9:
        case 10:
          return "horde_min.png";
        case 1:
        case 3:
        case 4:
        case 7:
        case 11:
          return "alliance_min.png";
      }
    },
    async UpdateOnlinePlayers() {
      for (const realm of this.realms) {
        const database = config.REALMS.find(r => r.id == realm.id);
        const onlinePlayerData = await this.LoadOnlinePlayers(database.chardb);
        const { aonline, honline, result } = onlinePlayerData;
        realm.allianceOnline = aonline;
        realm.hordeOnline = honline;
        realm.players = result;
      }
    }
  },
  created() {
    this.PopulateRealms()
      .then()
      .catch(err => console.log(err))
      .finally(() => (this.loading = false));

    this.UpdateTimer = setInterval(() => {
      this.UpdateOnlinePlayers();
    }, 60000);
  },
  updated() {},
  beforeDestroy() {
    // Prevent memory leaks
    clearInterval(this.UpdateTimer);
  }
};
</script>

<style scoped>
#atom-spinner {
  margin-top: 40%;
}

.online-image {
  height: 1.25vw;
  width: 1.25vw;
}
</style>
