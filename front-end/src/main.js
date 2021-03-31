import Vue from 'vue'
import App from './App.vue'
import router from './router'

const utils = require('./utils');

import IconBase from 'feather-icons-vue'
Vue.use(IconBase)

Vue.config.productionTip = false

new Vue({
  router,
  data() {
    return {
      loggedIn: false
    }
  },
  async created() {
    this.loggedIn = await utils.isLoggedIn();
  },
  watch: {
    '$route': async function() {
      this.loggedIn = await utils.isLoggedIn();
    }
  },
  render: h => h(App)
}).$mount('#app')
