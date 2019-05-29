<template>
  <div>
    <div class="d-flex justify-content-center" v-if="IsLoading" id="atom-spinner">
      <semipolar-spinner :animation-duration="2000" :size="200" :color="'#7289da'"/>
    </div>
    <div v-else>
      <div class="form-group">
        <h4 class="text-center">Create News</h4>

        <div class="form-group">
          <label>News Title</label>
          <b-input
            id="news-title"
            type="text"
            class="form-control news-title"
            name="News Title"
            v-model="NewTitle"
            v-validate="'required|min:10|max:50'"
            :class="{'error': errors.has('News Title') }"
          ></b-input>
          <b-tooltip placement="bottom" target="news-title">{{ errors.first('News Title') }}</b-tooltip>
        </div>
        <div class="form-group">
          <label>News Content</label>
          <b-textarea
            id="news-content"
            class="form-control news-content"
            name="News Content"
            v-model="NewContent"
            v-validate="'required|min:100|max:1000'"
            :class="{'error': errors.has('News Content') }"
          ></b-textarea>
          <b-tooltip placement="bottom" target="news-content">{{ errors.first('News Content') }}</b-tooltip>
        </div>

        <label>Author</label>
        <select
          id="news-author"
          class="form-group form-control"
          name="Select Author"
          v-model="NewAuthor"
          v-validate="'required|select'"
          :class="{'error': errors.has('Select Author') }"
        >
          <option disabled>Select Author</option>
          <option v-for="(admin, index) in Admins" :key="index" :value="admin">{{ admin.username }}</option>
        </select>
        <b-tooltip placement="bottom" target="news-author">{{ errors.first('Select Author') }}</b-tooltip>

        <div class="form-group">
          <label>Image</label>
          <b-input
            id="news-image"
            type="text"
            class="form-control"
            name="Author Image"
            placeholder="URL to news avatar..."
            v-model="NewImage"
            v-validate="'required|url|image'"
            :class="{'error': errors.has('Author Image') }"
          ></b-input>
          <b-tooltip placement="bottom" target="news-image">{{ errors.first('Author Image') }}</b-tooltip>

          <div class="form-group">
            <div class="container">
              <div class="row">
                <label>Image Preview</label>
              </div>
              <div class="row">
                <img class="news-avatar" :src="NewImage" @error="InvalidImage" @load="ValidImage">
              </div>
            </div>
          </div>
        </div>

        <button class="button update-account" @click="CreateNews" name="create">
          <i class="fa fa-check-circle"></i>
          <span>Create News</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { SemipolarSpinner } from "epic-spinners";

const API_NEWS = process.env.API.NEWS;

export default {
  props: ["Admins", "User"],
  name: "news-admin-create",
  data() {
    return {
      NewTitle: "",
      NewContent: "",
      NewAuthor: "Select Author",
      NewImage: "",
      ImageAccepted: false,

      IsLoading: false
    };
  },
  components: {
    "semipolar-spinner": SemipolarSpinner
  },
  computed: {
    GetAdmins() {
      return this.Admins.filter(admins => admins.id != this.NewsAuthor.id);
    }
  },
  methods: {
    async isFormValid() {
      const result = await this.$validator.validateAll();
      return result;
    },
    async CreateNews() {
      const formValid = await this.isFormValid();
      if (!formValid) {
        return;
      }

      try {
        await this.$dialog.confirm(`Continue creating ${this.NewTitle}?`);
      } catch (e) {
        return;
      }

      this.IsLoading = true;

      let result;

      try {
        result = await this.$http.post(`${API_NEWS}/create`, {
          title: this.NewTitle,
          content: this.NewContent,
          author: this.NewAuthor.id,
          image: this.NewImage
        });
      } catch (error) {
        this.$toasted.error(error);
        return;
      } finally {
        this.IsLoading = false;
      }

      if (result.data.newsid >= 0) {
        const news = {
          id: result.data.newsid,
          title: this.NewTitle,
          content: this.NewContent,
          author: this.NewAuthor.username,
          image: this.NewImage,
          date: new Date(),
          totalComments: 0
        };
        this.$toasted.success(`${this.NewTitle} has been created successfully`);
        this.$store.commit("NEWS_INSERT", news);
      } else {
        this.$toasted.error(result.data);
      }

      this.NewTitle = "";
      this.NewContent = "";
      this.NewAuthor.id = "";
      this.NewImage = "";
    },
    InvalidImage() {
      this.ImageAccepted = false;
    },
    ValidImage() {
      this.ImageAccepted = true;
    }
  },
  created() {
    this.$validator.extend("select", {
      getMessage: () => "Please select an Author",
      validate: () => {
        return typeof this.NewAuthor == "object";
      }
    });
    this.$validator.extend("image", {
      getMessage: () => "Please enter a valid avatar URL",
      validate: () => {
        return this.ImageAccepted == true;
      }
    });
  }
};
</script>

<style scoped lang="css">
#atom-spinner {
  margin-top: 40%;
}

.news-avatar {
  max-height: 25%;
  max-width: 25%;
}

.news-content {
  min-height: 200px;
  max-height: 600px;
}
</style>