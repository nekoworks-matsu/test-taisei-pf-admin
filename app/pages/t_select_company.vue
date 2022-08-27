<template>
  <div class="login-box ts_login ts_login_tablet">
    <div class="login-box-body">
      <div class="login-logo">
        <span class="logo-lg">
          <img class="login_logo" src="~/assets/t_logo.png" />
        </span>
        <p class="login-env-msg-stg font_20" v-if="env=='staging'">【 検証環境 】</p>
        <p class="login-env-msg-dev font_20" v-if="env=='dev_server'">【 開発環境 】</p>
      </div>
      <!-- /.login-logo -->
      <p class="login-box-msg lead">契約会社を選択してください</p>
      
      <form v-on:submit.prevent="selects">
        <div class="form-group has-feedback">
          <select class="form-control input-lg min-height-50" v-model="selectedCompany">
            <option v-for="category in categories" v-bind:value="category">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
        <div class="form-group margin_top_40 has-feedback">
          <button type="button" v-if="error" @click="back" class="btn btn-default btn-block btn-flat">
            <i v-show="!loading">もどる</i>
          </button>
          <button type="submit" class="btn btn-info btn-block btn_green" v-bind:disabled="this.selectedCompany.id==null">
            <!-- <i class="fa fa-refresh fa-spin" v-show="loading"></i> -->
            <i v-show="!loading">決定</i>
          </button>
        </div>
      </form>
    </div>
      <!-- /.login-box-body -->
  </div>
  <!-- /.login-box -->
</template>

<script>
import request from 'superagent'
import moment from 'moment'
import { event } from '~/plugins/events.js'

export default {
  layout: 'everyone',
  data() {
    return {
      loginid: '',
      password: '',
      error: '',
      categories: [{id: null, name: '【契約会社を選択】', value: null}],
      selectedCompany: {id: null, name: '【契約会社を選択】', value: null},
      api: '/companies',
      env: process.env.ENV
    }
  },
  methods: {
    selects() {
      localStorage.setItem("is_system_approval_mode", false);
      localStorage.setItem('company_name', this.selectedCompany.value);
      localStorage.setItem('company_id', this.selectedCompany.id);
      this.$router.push('/t_select_building');
    },
    getCompanies() {
      var company_id = localStorage.getItem('company_id');
      // var company_name = localStorage.getItem('company_name')
      
      // this.onSearch('/companies/' + company_id, null, null, val => {
      //   this.categories[1] = {id: val.id, name: 'ID ' + val.id + ' : ' + val.name, value: val.name};
      // });
      this.onSearch('/companies', null, null, val => {
        for (var i = 0; i < val.length; i++) {
          this.categories[i+1] = {id: val[i].id, name: val[i].name, value: val[i].name};
        }
        // localStorage.setItem('member_operation', JSON.stringify(val.memberOperationCategories));
      }); 
    },
    back(){
      this.$router.push("login")
      $('body').removeClass('skin-black')
      delete this.$router.redirect
      event.emit('login-update')
    },
  },
  created() {
    $("body").removeClass("skin-black");
    $("body").removeClass("skin-black-light");
    $("body").removeClass("fixed");
    $("body").css('background-color', '');
    localStorage.removeItem('search_item');
    this.getCompanies();
    this.checkRevision();
  },
};
</script>
<style lang="stylus" scoped></style>
