<template>
  <div class="login-box ts_login" v-bind:class="{wide_input_pw:!comp}">
    <div class="login-box-body">
      <div class="login-logo">
        <span class="logo-lg">
          <img class="login_logo" src="~/assets/t_logo.svg" />
        </span>
        <p class="login-env-msg-stg" v-if="env=='staging'">【 検証環境 】</p>
        <p class="login-env-msg-dev" v-if="env=='dev_server'">【 開発環境 】</p>
      </div>
      <!-- /.login-logo -->
      <!-- <div class="login-box-body" v-if="!comp"> -->
      <p class="login-box-msg">パスワードを入力して下さい。</p>
      <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
      <form v-on:submit.prevent="reset" autocomplete="off">
        <div class="form-group has-feedback">
          <input type="password" maxlength="32" class="form-control" placeholder="パスワード（7文字以上32文字以下、半角英数字）" id="pass_new" v-model="password" autocomplete="off">
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback">
          <input type="password" maxlength="32" class="form-control" placeholder="パスワード(確認)" id="pass_new_conf"  v-model="password_conf" autocomplete="off">
          <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="form-group">
          <div class="ts_login_btn_wrap">
            <button type="submit" class="btn btn-warning btn-block">
              <i>リセット</i>
            </button>
          </div>
          <!-- /.col -->
        </div>
      </form>
    </div>
    <div class="login-box-body" v-if="comp">
      <p class="login-box-msg">パスワード再発行が完了しました。</p>
      <router-link to="/login">ログイン画面へ</router-link>
    </div>
      <!-- /.login-box-body -->
    <!-- </div> -->
  </div>
  <!-- /.login-box -->
</template>

<script>
  import request from 'superagent'
  export default {
    layout: 'everyone',
    data() {
      return {
        password: '',
        password_conf:'',
        comp: false,
        error: '',
        env: process.env.ENV
      }
    },
    methods: {
      reset() {
        let msg = [];
        this.error = '';
        if (this.password === '') {
          msg.push('パスワード ： 必須項目です');
        }
        if (this.password_conf === '') {
          msg.push('パスワード（確認） : 必須項目です');
        }
        if ((this.password !== '' && this.password_conf !== '') && this.password !== this.password_conf) {
          msg.push('パスワードが一致しません');
        }
        if (msg.length != 0) {
          this.error = msg.join('\n');
          return;
        }
        const url = process.env.API_SERVER + '/members/reset-password';
        request.post(url).send({ newPassword: this.password,oneTimePassword:this.$route.params.id  }).end((err, res) => {
          if (res.ok) {
            this.comp = true;
          } else if (res.status == 401) {
            this.error = 'URLが無効です';
          } else if (res.body) {
            this.error = this.getErrorMsg(res.body && res.body.error);
          }
        });
      },
    },
    created() {
      let pass_new = document.getElementById('pass_new');
      let pass_new_conf = document.getElementById('pass_new_conf');
      if(pass_new && pass_new.value) {
        pass_new.value = '';
      }
      if(pass_new_conf && pass_new_conf.value) {
        pass_new_conf.value = '';
      }
    }
  }

</script>