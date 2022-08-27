<template>
  <div class="default_background">
    <div
      class="wrapper"
      id="bodywrapper"
    >
    <nuxt />
    </div>
  </div>
</template>


<script>
import "@/node_modules/bootstrap/dist/js/bootstrap.min.js"
import "@/node_modules/bootstrap/dist/css/bootstrap.min.css";
import "@/node_modules/font-awesome/css/font-awesome.min.css";
import "@/node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css";
import "@/node_modules/bootstrap/dist/css/bootstrap.min.css";
import "@/node_modules/admin-lte/dist/css/AdminLTE.min.css";
import "@/node_modules/admin-lte/dist/css/skins/_all-skins.min.css";

import request from 'superagent'
import { event } from '~/plugins/events.js'
import { permission } from '~/store'

event.init()
export default {
  name: 'app',
  methods: {
    refreshToken(){
      const url = process.env.API_SERVER + '/members/refresh-token'
        request
          .post(url)
          .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
          .send()
          .end((err, res) => {
            if (res.ok) {
              localStorage.setItem('building_list',JSON.stringify(res.body.buildings));
              localStorage.setItem('token', res.body.token)
            }else{
              this.store.clearTablet();
              permission.clear();
              this.$router.push('/t_login');
            }
          })
    }
  },
  created() {
    window.refreshToken = () => {
      this.refreshToken()
    };
  }
}

</script>


<style>
html {
    height: 100%;
}
body {
  background-color:#ECF0F5;
  height: 100%;

}
</style>
