<template>
  <div class="login-box ts_login">
    <!-- /.login-logo -->
    <div class="login-box-body">
      <div class="login-logo">
        <span class="logo-lg">
          <img class="login_logo" src="~/assets/t_logo.svg" />
        </span>
        <p class="login-env-msg-stg" v-if="env=='staging'">【 検証環境 】</p>
        <p class="login-env-msg-dev" v-if="env=='dev_server'">【 開発環境 】</p>
      </div>
      <p class="login-box-msg">ログイン</p>
      <div v-if="error" class="callout callout-danger">
        <p>{{error}}</p>
      </div>
      <form v-on:submit.prevent="login">
        <div class="form-group has-feedback">
          <input type="loginid" maxlength="255" class="form-control" placeholder="アカウントID" v-model="loginid" id="loginid_clear"/>
          <span class="glyphicon glyphicon-user form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback">
          <input type="password" maxlength="32" class="form-control" placeholder="パスワード" v-model="password" id="password_clear" v-if="!isDisplay"/>
          <input type="text" maxlength="32" class="form-control" placeholder="パスワード" v-model="password" id="password_clear" v-if="isDisplay"/>
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="ts_checkbox">
          <input type="checkbox" id="password_display" v-model="isDisplay">
          <label for="password_display"><span></span>パスワードを表示する</label>
        </div>
        <div class="form-group">
          <div class="ts_login_btn_wrap">
            <button type="submit" class="btn btn-info btn-block btn_green">
              <i class="fa fa-refresh fa-spin" v-show="loading"></i>
              <i v-show="!loading">ログイン</i>
            </button>
          </div>
          <!-- /.col -->
        </div>
      </form>
      <nuxt-link to="/login_pwd_reminder" class="login_pwd_reminder_msg">メールアドレス登録済でパスワードを忘れた方はこちら</nuxt-link>
    </div>
    <!-- /.login-box-body -->
  </div>
  <!-- /.login-box -->
</template>

<script>
import request from 'superagent'
import { event } from '~/plugins/events.js'

export default {
  layout: 'everyone',
  data() {
    return {
      loginid: '',
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
          localStorage.setItem('userid', res.body.member.loginId);
          localStorage.setItem('username', res.body.member.name);
          localStorage.setItem('member_id', res.body.member.id);
          localStorage.setItem('token', res.body.token);
          localStorage.setItem('building_list',JSON.stringify(res.body.buildings));
          localStorage.setItem('role', this.getAuthority(res.body.member.role));
          localStorage.setItem('is_tablet', "false");
          
          localStorage.setItem('company_id', res.body.member.companyId);

          // this.$router.push('/select_building');
          if(!this.$router.redirect){ //NOTE:新規ログインの場合
            if (this.getAuthority(res.body.member.role) == "systemApproval") {
              this.$router.push('/select_company');
            } else {
              this.$router.push('/select_building');
            }
          }else{// NOTE: トークン切れて再ログインした場合ビルID存在判定
            this.$router.push(this.$router.redirect);
            // this.$router.push('/select_building');
            // var buildings_id = localStorage.getItem('buildings_id');
            // for(const id in res.body.buildings){
            //   if (buildings_id == res.body.buildings[id].id){
            //     localStorage.setItem('buildings_name', res.body.buildings[id].name);
            //   }
            // }
            // if(buildings_id){
            //   var selected_buildings_id = res.body.buildings.find( (v) => v.id == buildings_id);
            //   if( selected_buildings_id == undefined){//NOTE:対象ビル削除された場合
            //     this.$router.push('/select_building');
            //   }else{
            //     this.$router.push(this.$router.redirect);
            //   }
            // }else{
            //   this.$router.push('/select_building');
            // }
          }
          delete this.$router.redirect;
        } else if (res.body) {
          if (!res.body.member.activated) {
            this.error = 'このアカウントIDは現在ご利用になれません'
          } else {
            this.error = res.body.error.message;
          }
        }
      });
    },
  //   onClick: function() {
  //     this.isChecked = !this.isChecked;
  //   },
  //   computed: {
  //   inputType: function () {
  //     return this.isChecked ? "text" : "password";
  //   },
  // }
  },
  created() {
    $("body").removeClass("skin-black");
    $("body").removeClass("skin-black-light");
    $("body").removeClass("fixed");
    $("body").addClass("aaaa");
  }
};
</script>
<style lang="stylus" scoped></style>
