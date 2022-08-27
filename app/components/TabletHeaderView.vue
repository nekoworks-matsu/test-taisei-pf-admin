<template>
  <!-- Main Header -->
  <header class="main-header max_height t_header" align="center">
    <div class="common_title t_header_color" v-bind:class="{ dev_bg_color: env=='dev_server', stg_bg_color: env=='staging'}">
      <div><button type="button" class="btn btn-default t_header_button" @click="onBackButtonClick" v-bind:class="{visibility_hidden:!param.isBackButtons}"><i class="fa fa-arrow-left"></i><span>戻る</span></button></div>
      <h1 class="text_align_center font_size_26">{{getTrimedName(param.title, 21)}}</h1>
      <div><button type="button" class="btn btn-default t_header_button" @click="onHomeButtonClick" v-bind:class="{visibility_hidden:!param.isHomeButtons}"><i class="fa fa-home"></i><br><span>ホーム</span></button></div>
    </div>
    <nav class="navbar navbar-static-top navbar_margin" role="navigation">
      <div class="navbar-custom-menu float_none">
        <ul class="nav navbar-nav t_header_width">
        <!-- User Account Menu -->
          <li class="dropdown user user-menu t_header_width t_login_font">
            <!-- Menu Toggle Button -->
            <a href="#" class="dropdown-toggle t_login_info" data-toggle="dropdown" @click="onLoginInfoClick">
              <span class="margin_right_20"><i class="fa fa-copyright"></i>&nbsp;{{getTrimedName(companyName, 15)}}</span>
              <div class="t_header_left_border"></div>
              <span class="margin_right_20"><i class="fa fa-building"></i>&nbsp;{{getTrimedName(buildingName, 15)}}</span>
              <div class="t_header_right_border"></div>
              <span style="margin_right_20"><i class="fa fa-user-circle"></i>&nbsp;{{getTrimedName(userName, 15)}}</span>
              <i class="glyphicon pull-right" v-bind:class="isDown?'glyphicon-chevron-down':'glyphicon-chevron-up'"></i>
            </a>
            <!--Responsible権限以外のはログアウトボタンを無効-->
            <ul class="dropdown-menu t_dropdown_menu">
              <li class="user-footer">
                <div class="">
                  <button class="t_dropdown_menu_button" @click.stop="onSelectCompanyButtonClick" v-if="checkItemPermission('Common:forSystemApproval')"><i class="fa fa-exchange-alt"></i>契約会社選択</button>
                  <button class="t_dropdown_menu_button" @click.stop="onSelectBuildingButtonClick"><i class="fa fa-exchange-alt"></i>ビル選択</button>
                  <button class="t_dropdown_menu_button" @click.stop="onLogoutButtonClick"><i class="fa fa-sign-out-alt"></i>ログアウト</button>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
  import request from 'superagent'
  import { event } from '~/plugins/events.js'

  export default {
    data() {
      return {
        isDown: true,
        isOnClick: false,
        companyName: '',
        buildingName: '',
        userName: '',
        role: localStorage.getItem('role'), 
        env: process.env.ENV
      }
    },
    props: {
      param: Object,
    },
    methods: {
      onLoginInfoClick() {
        this.isDown = !this.isDown;
        this.isOnClick = true;
      },
      onWindowClick() {
        if (!this.isDown && !this.isOnClick) {
          this.isDown = !this.isDown;
        } else {
          this.isOnClick = false;
        }
      },
      onLogoutButtonClick() {
        this.requestAbort();
        this.store.clear();
        this.$router.push('/t_login');
        localStorage.setItem("isInfoRead", false);
        delete this.$router.redirect;
        event.emit('login-update');
      },
      onSelectBuildingButtonClick() {
        this.requestAbort();
        this.$router.push('/t_select_building');
      },
      onSelectCompanyButtonClick() {
        this.requestAbort();
        this.$router.push('/t_select_company');
      },
      onBackButtonClick() {
        this.closeWebView();
        if (this.param.backPath){
          this.$router.push(this.param.backPath);
        }else{
          this.$router.back();
        }
        
      },
      onHomeButtonClick() {
        this.closeWebView();    
        this.$router.push("/t_home");
      },
    },
    created() {
      $("body").removeClass("skin-black");
      $("body").addClass("skin-black-light");
      $("body").addClass("fixed");

      this.userName = localStorage.getItem('username');
      this.companyName = localStorage.getItem('company_name');
      this.buildingName = localStorage.getItem('buildings_name');
    },
    mounted() {
      window.document.addEventListener('click', this.onWindowClick, false);
    },
    destroyed() {
      window.document.removeEventListener('click', this.onWindowClick, false);
    }
  }
</script>