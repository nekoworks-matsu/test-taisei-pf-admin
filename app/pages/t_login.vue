<template>
  <!-- <div class="login-box wide t_login_info_box_size"> -->
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
      <!-- <div class="login-box-body"> -->
        <p class="login-box-msg lead">ログイン</p>
        <div v-if="error" class="callout callout-danger">
          <p>{{error}}</p>
        </div>
        <form v-on:submit.prevent="login">
          <div class="form-group has-feedback">
            <input type="loginid" maxlength="255" class="form-control input-lg" autocomplete="off" placeholder="アカウントID" v-model="loginid" id="loginid_clear"/>
            <span class="glyphicon glyphicon-user form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <!-- <input type="" maxlength="32" class="form-control input-lg" autocomplete="off" placeholder="パスワード" v-model="password" id="password_clear"/> -->

            <input type="password" maxlength="32" class="form-control input-lg" placeholder="パスワード" v-model="password" id="password_clear" v-if="!isDisplay"/>
            <input type="text" maxlength="32" class="form-control input-lg" placeholder="パスワード" v-model="password" id="password_clear" v-if="isDisplay"/>
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          </div>
          <div class="ts_checkbox">
            <input type="checkbox" id="password_display" v-model="isDisplay">
            <label for="password_display"><span></span>パスワードを表示する</label>
          </div>
          <div class="ts_login_btn_wrap">
            <div class="form-group has-feedback">
              <button type="submit" class="btn btn-info btn-block btn_green">
                <i class="fa fa-refresh fa-spin" v-show="loading"></i>
                <i v-show="!loading">ログイン</i>
              </button>
            </div>
          </div>
        </form>
      </div>
    <!-- /.login-box-body -->
    </div>
  </div>
  <!-- /.login-box -->
</template>

<script>
//import Logo from '~/components/Logo.vue'
import request from 'superagent'
import { event } from '~/plugins/events.js'

export default {
  layout: 'everyone',
  data() {
    return {
      loginid: '',
      truePassword: '',
      password: '',
      error: '',
      isDisplay: false,
      env: process.env.ENV
    }
  },
  methods: {
    login() {
      this.error = '';
      this.loading = true;
      
      if (this.loginid == ""){
        this.error = "アカウントIDが必要です";
        this.loading = false;
        return;
      }
     
      const url = process.env.API_SERVER + '/members/login';
      // request.post(url).send({ loginId: this.loginid, password: this.truePassword }).end((err, res) => {
      request.post(url).send({ loginId: this.loginid, password: this.password }).end((err, res) => {
        this.loading = false;
        if (err) {
          let error_msg = '';
          if(res && res.body && res.body.error) {
            if (res.body.error.code == 'VALIDATION_FAILED' || res.body.error.message == 'Invalid loginId or password.') {
              res.body.error.message = 'アカウントIDまたはパスワードが違います'
            } else if (res.body.error.code == 'VALIDATION_FAILED' || res.body.error.message == 'user is not activated') {
              res.body.error.message = 'このアカウントIDは現在ご利用になれません'
            }
            error_msg = res.body.error.message;
          }
          this.error = error_msg;
        } else if (res && res.ok && res.body.member.activated) {
          if (res.body.member.role == 3){
            this.error = "このアカウントの権限ではご利用になれません";
            return
          }
          var memberId = localStorage.getItem('member_id');
          localStorage.setItem('userid', res.body.member.loginId);
          localStorage.setItem('username', res.body.member.name);
          localStorage.setItem('member_id', res.body.member.id);
          localStorage.setItem('token', res.body.token);
          localStorage.setItem('building_list',JSON.stringify(res.body.buildings));
          localStorage.setItem('role', this.getAuthority(res.body.member.role));
          localStorage.setItem('is_tablet', "true");

          if (this.getAuthority(res.body.member.role) == "systemApproval") {
            this.$router.push('/t_select_company');
          } else {
            this.$router.push('/t_select_building');
          }
          delete this.$router.redirect;
          event.emit('login-update');
        } else if (res.body) {
          if (!res.body.member.activated) {
            this.error = 'このアカウントIDは現在ご利用になれません'
          } else {
            this.error = res.body.error.message;
          }
        }
      });
    },
  },
  created() {
    $("body").removeClass("skin-black");
    $("body").removeClass("skin-black-light");
    $("body").removeClass("fixed");
    $("body").css('background-color', '');
  },
  watch: {
    // password: {
    //   handler(val) {
    //     if (this.truePassword.length > this.password.length){
    //       this.password = "";
    //       this.truePassword = "";
    //     }
    //     const replaced = this.password.replace(/\・/g, '');
    //     if (replaced == ""){
    //       return;
    //     }
    //     this.truePassword = this.truePassword + replaced;
    //     var replacedStr = "";
    //     for (let i = 0; i < this.password.length; i++) {
    //        replacedStr = replacedStr + "・";
    //     }
    //     this.password = replacedStr;
    //   },
    //   deep: true,
    // },
  }
};
</script>
<style lang="stylus" scoped></style>
