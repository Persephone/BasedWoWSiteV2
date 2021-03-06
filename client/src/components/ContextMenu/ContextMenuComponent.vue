<template>
  <div
    class="ctx-menu"
    :style="style"
    :hidden="!ctxMenuData"
    v-click-outside="resetCtx"
    @mouseleave="mouseLeft = true"
    @mouseenter="mouseLeft = false"
    @click.right.prevent
  >
    <!-- Check if there are options data -->
    <template v-if="ctxMenuData">
      <!-- Use template tag to loop through the options -->
      <template v-for="(item, index) in ctxMenuData">
        <!--
          Then check opton type default is undeifined then if the type is not divider
        -->
        <!-- Make sure to create a unique ref is will be needed later -->
        <div v-if="item.type !== 'divider'" :key="index" :ref="'ctx_' + index" :id="'ctx_' + index">
          <span v-text="item.title" class="ctx-menu-option"></span>
        </div>
        <div v-else :key="index" class="ctx-menu-divider">
          <span></span>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "ContextMenuComponent",
  data: () => ({
    style: null,
    ctxMenuData: null,
    configured: false,
    // the options schema
    // [
    //   {
    //     title: string,
    //     type: string, // default is undefined
    //     handler: function
    //   }
    // ]
    ctxMenuRect: null,
    // {
    //   y:number,
    //   x:number
    // },

    mouseLeft: false
  }),
  watch: {
    mouseLeft: _.debounce(function() {
      if (this.mouseLeft) {
        this.resetCtx();
      }
    }, 1500)
  },
  computed: {
    GetUser() {
      return this.$store.getters["user/GetUser"];
    }
  },
  methods: {
    resetCtx() {
      this.ctxMenuData = null;
      this.ctxMenuRect = null;
      this.configured = false;
    },
    onContextMenu(ev, ctxMenuData) {
      // prevent default behaviours
      ev.preventDefault();
      ev.stopPropagation();
      ctxMenuData = ctxMenuData.filter(x => {
        if (x.loginRequired && !this.GetUser) return false;
        if (this.GetUser && x.targetId == this.GetUser.id) return false;

        return true;
      });
      this.ctxMenuData = ctxMenuData;
      this.ctxMenuRect = {
        x: ev.x,
        y: ev.y
      };
      // populate the option
      this.onData();
      // then reevaluate and set context-menu position
      this.reevaluatePosition();
    },
    async reevaluatePosition() {
      if (this.ctxMenuRect) {
        // using $nextTick to delay and make sure that the context-menu
        // options are fully rendered which will help us
        // to get the accurate height
        await this.$nextTick();
        await this.$nextTick();

        let { x, y } = this.ctxMenuRect;
        // get the window current inner height and width
        let { innerHeight, innerWidth } = window;
        // get the component height and width through element.getClientRects
        let { height, width } = this.$el.getClientRects()[0];
        // then subtract window inner height and width with
        // context-menu event source points (x, y)
        let dY = innerHeight - y;
        let dX = innerWidth - x;
        // check if the context-menu height is not
        // longer than the available
        if (dY < height) {
          y = y - height;
        }
        if (dX < width) {
          x = x - width;
        }
        // set the position
        this.style = { left: x + "px", top: y + "px" };
      }
    },
    async onData() {
      if (this.configured) return;

      // validate if the ctxMenuData is an array and the lenght is not less then 1
      if (Array.isArray(this.ctxMenuData) && this.ctxMenuData.length) {
        await this.$nextTick();
        // loop through the options
        this.ctxMenuData.forEach((item, index) => {
          if (item.loginRequired && !this.GetUser) return;
          if (this.GetUser && item.targetId == this.GetUser.id) return;

          // if this option type is equal's to divider and the handler property value is a function
          if (item.type !== "divider" && typeof item.handler === "function") {
            // select the option element with the help of the refs id
            let refs = this.$refs["ctx_" + index];
            // accessing $refs prooerty with object square bracket notation alwasys returns arrays of
            // HTML Elements of Vue components instance
            // so you have to validate
            if (Array.isArray(refs)) {
              let el = refs[0];
              // then attach click event and pass an arrow function as a the
              // event handler callback
              const event = () => {
                item.handler();
                this.resetCtx();
              };

              el.addEventListener("click", event, false);
            }
          }
        });

        this.configured = true;
      }
    }
  },
  mounted() {
    // Listen on contextmenu event through the $root instance
    this.$root.$on("contextmenu", data => {
      // if the data is null reset and handler the action
      if (!data) {
        this.resetCtx();
      } else {
        this.onContextMenu(data.event, data.ctxMenuData);
      }
    });
  },
  beforeDestroy() {
    this.$root.$off("contextmenu", () => {});
  }
};
</script>

<style scoped>
.ctx-menu {
  min-width: 150px;
  height: fit-content;
  padding: 5px 0;
  position: fixed;
  border: 1px solid #61bff5;
  background-color: whitesmoke;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.52);
  border-radius: 3px;
  z-index: 999999;
}
.ctx-menu-option {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  height: 25px;
  padding: 0 10px;
  cursor: pointer;
}
.ctx-menu-option:hover {
  background: rgb(26, 128, 218, 0.8);
  color: #fafafa;
}
.ctx-menu-divider {
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ctx-menu-divider > span {
  width: 50px;
  height: 1px;
  background-color: #dcdfe6;
}
</style>
