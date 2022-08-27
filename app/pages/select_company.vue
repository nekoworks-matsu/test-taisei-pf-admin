<template>
  <div class="login-box wide ts_login">
        
        <!-- /.login-logo -->

    <div class="display_flex two_login" v-if="hasPermission">
      <div class="login-box-body two_login_select_box">
        <div class="login-logo">
          <span class="logo-lg">
            <img class="login_logo" src="~/assets/t_logo.png" />
          </span>
          <p class="login-env-msg-stg" v-if="env=='staging'">【 検証環境 】</p>
          <p class="login-env-msg-dev" v-if="env=='dev_server'">【 開発環境 】</p>
        </div>
        <p class="login-box-msg ts_mt60">契約会社を選択してください</p>
          
        <form v-on:submit.prevent="selects">
          <div class="fform-group has-feedback form_selectbox">
            <select class="form-control" v-model="selectedCompany">
              <option v-for="category in categories" v-bind:value="category">
                 {{ category.name }}
              </option>
            </select>
          </div>
          <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
          <div class="form-group ts_mt90">
            <div class="pull-left col-xs-4">
              <button type="button" v-if="error" @click="back" class="btn btn-default btn-block btn-flat">
                <i v-show="!loading">もどる</i>
              </button>
            </div>
           <!-- /.col -->
            <div>

              <button type="submit" class="btn btn-info btn-block btn_green" v-bind:disabled="this.selectedCompany.id==null">
                <i v-show="loading"></i>
                <i v-show="!loading">決定</i>
              </button>
            </div>
                <!-- /.col -->
          </div>
        </form>
        <div class="two_login_btn">
          <a class="ts_login_onHeadquartersMode" @click="onSystemApprovalMode()">
            <i v-show="!loading">「T-Spider 管理者」に切り替える方はこちら</i>
          </a>
        </div>
          <!-- <div class="two_login_box_btn two_login_btn"> 
            <button @click="onSystemApprovalMode()" class="btn btn-info btn-block height_max">
              <i v-show="!loading">T-Spider 管理者</i>
            </button>
          </div> -->
      </div>
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
      hasPermission: true,
      role: '',
      categories: [{id: null, name: '【契約会社を選択】', value: null}],
      selectedCompany: {id: null, name: '【契約会社を選択】', value: null},
      api: '/companies',
      env: process.env.ENV
    }
  },
  methods: {
    selects() {
      localStorage.setItem("is_system_approval_mode", false);
      localStorage.setItem('company_id', this.selectedCompany.id);
      localStorage.setItem('company_name', this.selectedCompany.value);
      this.$router.push('/select_building');
    },
    getCompanies() {
      var company_id = localStorage.getItem('company_id');
      // var company_name = localStorage.getItem('company_name')

      // this.onSearch('/companies/' + company_id, null, null, val => {
      //   this.categories[1] = {id: val.id, name: 'ID ' + val.id + ' : ' + val.name, value: val.name};
      // });
      this.onSearch('/companies', null, null, val => {
        this.hasPermission = this.checkItemPermission('Common:forSystemApproval');
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
    onSystemApprovalMode() {
      localStorage.setItem("is_system_approval_mode", true);
      localStorage.setItem("is_headquarters_mode", false);
      this.$router.push(this.$router.redirect ? this.$router.redirect : '/');
    }
  },
  created() {
    $("body").removeClass("skin-black");
    $("body").removeClass("skin-black-light");
    $("body").removeClass("fixed");
    this.role = localStorage.getItem("role");
    localStorage.removeItem('search_item');
    this.getCompanies();
  } 
};
</script>
<style lang="stylus" scoped></style>
