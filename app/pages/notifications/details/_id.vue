<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper ts_content_wrapper">
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <!-- Content Header (Page header) -->
    <section class="content_head">
      <div class="ts_content_head">
        <div class="button_header">
          <section>
            <div class="ts_breadcrumb">
              <ol>
                <li>マスタ情報</li>
                <li>お知らせ一覧</li>
                <li class="current">お知らせ詳細</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">お知らせ詳細</h1>
          </section>
          <div class="button_header_btn" v-if="isSystemApprovalMode">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/notifications/edit/' + item.id)">編 集</button>
          </div>
        </div>  
      </div>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- <div class="box-header with-border">
            <h3 class="box-title with-border">{{param.title}}詳細情報</h3>
          </div> -->
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal form_box">
              <div class="box-body">
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">ID</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{item.id}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">更新日</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{df3(item.updatedAtForDisplay)}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">タイトル</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{item.title}}</div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">カテゴリー</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{getCategoryName(item.category)}}</div>
                  </div>
                </div>
                
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">本文</label>
                  </div>
                  <div class="form_box_group_field">
                    <span v-html="getColumData(item.body)"></span>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">表示設定</label>
                  </div>
                  <div class="form_box_group_field">
                    <label class="control control_checkbox">
                      <input type="checkbox" name="display" v-model="item.display" disabled>
                      <div class="control_indicator"></div>
                    </label>
                  </div>
                </div>
                
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">表示開始日時</label>
                  </div>
                  <div class="form_box_group_field">
                    {{df2(item.displayFrom)}}
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">表示終了日時</label>
                  </div>
                  <div class="form_box_group_field">
                    {{df2(item.displayTo)}}
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">登録日時</label>
                  </div>
                  <div class="form_box_group_field">
                    {{df(item.createdAt)}}
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">更新日時</label>
                  </div>
                  <div class="form_box_group_field">
                    {{df(item.updatedAt)}}
                  </div>
                </div>
              </div>
              <!-- /.box-body -->
              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_center border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/notifications')">戻る</button>
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
