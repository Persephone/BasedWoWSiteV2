import {
  UPDATE_PAGE_TITLE,
  ADMIN_REQUEST,
  ADMIN_SUCCESS,
  ADMIN_ERROR,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_LOGOUT,
  VOTE_REQUEST_BEGIN,
  VOTE_REQUEST_SUCCESS,
  VOTE_REQUEST_ERROR,
  VOTE_TIMERS_REQUEST,
  VOTE_TIMERS_SUCCESS,
  VOTE_TIMERS_ERROR,
  VOTE_BEGIN,
  VOTE_SUCCESS,
  VOTE_ERROR,
  UPDATE_USER,
  NEWS_REQUEST,
  NEWS_SUCCESS,
  NEWS_ERROR,
  NEWS_UPDATE,
  NEWS_UPDATE_ARRAY,
  NEWS_INSERT,
  NEWS_DELETE,
  NEWS_COMMENTS_REQUEST,
  NEWS_COMMENTS_SUCCESS,
  NEWS_COMMENTS_ERROR,
  NEWS_COMMENTS_INSERT,
  CHANGELOG_SET_DATA,
  CHANGELOG_REQUEST,
  CHANGELOG_SUCCESS,
  CHANGELOG_ERROR,
  CHANGELOG_INSERT,
  CHANGELOG_UPDATE,
  CHANGELOG_DELETE,
  PVPSTATS_ADD_TOPARENATEAMS,
  PVPSTATS_ADD_TOPARENATEAMMEMBERS,
  PVPSTATS_ADD_TOPHKPLAYERS,
  PVPSTATS_SET_DATA
} from "./mutation-types";
import Vue from "vue";

export const mainMutations = {
  [UPDATE_PAGE_TITLE](state, title) {
    state.PageTitle = title;
  }
};

export const adminMutations = {
  [ADMIN_REQUEST](state) {
    state.Admin.Loading = true;
  },
  [ADMIN_SUCCESS](state, payload) {
    state.Admin.Data = payload;
    state.Admin.Loading = false;
  },
  [ADMIN_ERROR](state) {
    state.Admin.Loading = false;
  }
};

export const authMutations = {
  [AUTH_REQUEST](state) {
    state.User.Status = "loading";
  },
  [AUTH_SUCCESS](state, payload) {
    const { token, userDTO } = payload;
    Vue.set(state.User, "Status", "success");
    Vue.set(state.User, "Token", token);
    Vue.set(state.User, "User", userDTO);
  },
  [AUTH_ERROR](state) {
    state.User.Status = "error";
  },
  [AUTH_LOGOUT](state) {
    state.User.Status = "";
    state.User.Token = "";
    state.User.User = null;
    state.Vote.Timers.Data = [];
  },
  // Payload format: { index: "" | number, value: any }
  [UPDATE_USER](state, payload) {
    const { index, value } = payload;
    Vue.set(state.User.User, index, value);
    const userJSON = JSON.stringify(state.User.User);
    localStorage.setItem("user", userJSON);
  }
};

export const voteMutations = {
  [VOTE_REQUEST_BEGIN](state) {
    state.Vote.Sites.Loading = true;
  },
  [VOTE_REQUEST_SUCCESS](state, payload) {
    Vue.set(state.Vote.Sites, "Data", payload);
    state.Vote.Sites.Loading = false;
  },
  [VOTE_REQUEST_ERROR](state) {
    state.Vote.Sites.Loading = false;
  },
  [VOTE_TIMERS_REQUEST](state) {
    state.Vote.Timers.Loading = true;
  },
  [VOTE_TIMERS_SUCCESS](state, payload) {
    Vue.set(state.Vote.Timers, "Data", payload);
    state.Vote.Timers.Loading = false;
  },
  [VOTE_TIMERS_ERROR](state) {
    state.Vote.Timers.Loading = false;
  },
  [VOTE_BEGIN](state) {
    state.Vote.Status = true;
  },
  [VOTE_SUCCESS](state, payload) {
    const { id, unsetTime } = payload;
    const site = state.Vote.Timers.Data.find(timer => timer.site == id);
    if (site != null) {
      site.unsetTimer = unsetTime;
    } else {
      state.Vote.Timers.Data.push({ site: id, unsetTimer: unsetTime });
    }

    state.Vote.Status = true;
  },
  [VOTE_ERROR](state) {
    state.Vote.Status = false;
  }
};

export const newsMutations = {
  [NEWS_REQUEST](state) {
    Vue.set(state.News, "Loading", true);
  },
  [NEWS_SUCCESS](state, payload) {
    Vue.set(state.News, "Data", payload);
    Vue.set(state.News, "Loading", false);
  },
  [NEWS_ERROR](state) {
    state.News.Loading = false;
  },
  [NEWS_UPDATE](state, payload) {
    const { newsid, index, value } = payload;
    const news = state.News.Data.find(x => x.id == newsid);
    if (news != null) {
      Vue.set(news, index, value);
    }
  },
  [NEWS_UPDATE_ARRAY](state, payload) {
    const { newsid, updates } = payload;
    const news = state.News.Data.find(x => x.id == newsid);
    if (news != null) {
      for (const update of updates) {
        Vue.set(news, update.index, update.value);
      }
    }
  },
  [NEWS_INSERT](state, news) {
    state.News.Data.unshift(news);
  },
  [NEWS_DELETE](state, news) {
    const index = state.News.Data.findIndex(x => x == news);
    state.News.Data.splice(index, 1);
  },
  [NEWS_COMMENTS_INSERT](state, newsId) {
    state.News.Comments.push({
      newsId: newsId,
      isLoading: false,
      comments: []
    });
  },
  [NEWS_COMMENTS_REQUEST](state, newsId) {
    const comments = state.News.Comments.find(x => x.newsId == newsId);
    comments.isLoading = true;
  },
  [NEWS_COMMENTS_SUCCESS](state, payload) {
    const { newsId, commentData } = payload;
    const comments = state.News.Comments.find(x => x.newsId == newsId);
    comments.comments = commentData;
    comments.isLoading = false;
  },
  [NEWS_COMMENTS_ERROR](state, newsId) {
    const comments = state.News.Comments.find(x => x.newsId == newsId);
    comments.isLoading = false;
  }
};

export const changelogMutations = {
  [CHANGELOG_SET_DATA](state, payload) {
    const { type, data } = payload;
    Vue.set(state.Changelog, type, data);
  }
};

export const pvpStatsMutations = {
  [PVPSTATS_SET_DATA](state, payload) {
    const { type, data } = payload;
    Vue.set(state.PvPStats, type, data);
  },
  [PVPSTATS_ADD_TOPARENATEAMS] (state, payload) {
    state.PvPStats.TopArenaTeams.push(payload);
  },
  [PVPSTATS_ADD_TOPARENATEAMMEMBERS] (state, payload) {
    state.PvPStats.TopTeamMembers.push(payload);
  },
  [PVPSTATS_ADD_TOPHKPLAYERS] (state, payload) {
    state.PvPStats.TopHKPlayers.push(payload);
  }
}