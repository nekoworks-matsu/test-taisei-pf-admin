<template>
  <div class="login-box ts_login">
    <div class="login-box-body">
      <div class="login-logo">
        <span class="logo-lg">
          <img class="login_logo" src="~/assets/t_logo.svg" />
        </span>
        <p class="login-env-msg-stg" v-if="env=='staging'">【 検証環境 】</p>
        <p class="login-env-msg-dev" v-if="env=='dev_server'">【 開発環境 】</p>
      </div>
      <!-- /.login-logo -->
      <p class="login-box-msg">パスワード再発行</p>
      <p class="ts_login_description">登録済のメールアドレスを入力して下さい。<br>本人確認のためのメールをお送りします。</p>
      <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>

      <form v-on:submit.prevent="reset" autocomplete="off">
        <div class="form-group has-feedback">
          <input type="email" maxlength="255" class="form-control" placeholder="メールアドレス" v-model="email" autocomplete="off">
          <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
        </div>
        <div class="ts_login_btn_wrap">
          <button type="submit" v-bind:disabled="this.loading" class="btn btn-warning btn-block btn_green">送信</button>
        </div>
      </form>

      <div class="login-box-body" v-if="comp">
        <p class="login-box-msg">ご登録いただいているメールアドレスに、<br/>パスワードに関する<br/>ご案内メールを送信しました。<br/>メールをご確認下さい。</p>
        <nuxt-link to="/login">ログイン画面へ</nuxt-link>
      </div>
    </div>
    <!-- /.login-box-body -->
  </div>
  <!-- /.login-box -->
</template>

<script>
  import request from 'superagent'

  export default {
    layout: 'everyone',
    data() {
      return {
        email: '',
        comp: false,
        error: '',
        loading: false,
        env: process.env.ENV
      }
    },
    methods: {
      reset() {
        this.error = '';
        const url = process.env.API_SERVER + '/members/request-password-reset';
        let req = { url: window.location.origin + window.location.pathname + '#/login/pwd_reset/' };
        if(this.email) {
          req.email = this.email;
        }
        this.loading = true;
        request.post(url).send(req).end((err, res) => {
                  this.loading = false;
          if (res && res.ok) {
            this.comp = true;
          } else if(res && res.body && res.body.error) {
            if (res.body.error.code == 'EMAIL_REQUIRED') {
              this.error = 'メールアドレスは必須です';
            } else {
              this.error = 'メールアドレスが見つかりません';
            }
          } else if(res === undefined) {
            alert('APIサーバーに接続できません'); // APIサーバのみ接続不能になった場合の処理
          }
        });
      },
    },
  }

</script>
