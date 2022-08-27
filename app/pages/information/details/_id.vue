<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <!-- Content Header (Page header) -->
    <section class="content_head">
      <div class="ts_content_head">
        <div class="ts_breadcrumb">
          <ol>
            <li>{{param.title}}</li>
            <li class="current">{{param.title}}詳細</li>
          </ol>
        </div>
        <h1 class="ts_content_heading">{{param.title}}詳細</h1>
      </div>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <div class="box-header with-border information_bar">
            <p class="information_id">ID:{{item.id}}</p>
            <p class="information_category">{{getCategoryName(item.category)}}</p>
            <p class="information_date">{{df3(item.updatedAtForDisplay)}}</p>
          </div>
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal" autocomplete="off">
              <div class="box-body">
                <label class="font_20">{{item.title}}</label>
                <div>
                  <span v-html="getColumData(item.body)"></span>
                </div>
              </div>
              <!-- /.box-body -->
              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_center border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" onclick="window.history.back()">戻る</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->

      </div>
      <!-- /.box-group -->

    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import ListView from '~/components/ListView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/notifications',
        error: '',
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        fullpage: true,
        category_id_options: [
          { name: "更新情報", value: 1 },
          { name: "メンテナンス情報", value: 2 },
          { name: "重要情報", value: 3 },
          { name: "不具合情報", value: 4 },
        ],
        param: {
          title: "お知らせ",
          columns: [
          ]
        },
        updatedAt: '',
        item: {},
      }
    },
    components: {
      ListView,
      Loading
    },
    methods: {
      getNotificationRequest() {
        this.onRead(this.api, "", data => {
          this.item = data;
        });
      },
      getCategoryName(id) {
        var find = this.category_id_options.find(val => val.value == id);
        if (find != undefined) {
          return find.name;
        }
      },
    },
    created() {
      this.getNotificationRequest();
    },
    watch: {
      $route: function(route) {
        this.getNotificationRequest();
      }
    }
  }

</script>
