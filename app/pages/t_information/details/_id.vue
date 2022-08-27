<template>
  <!-- Content Wrapper. Contains page content -->
  <div align="left">
    <!-- Content Header (Page header) -->
    <tablet-header-view ref="header" :param="param"></tablet-header-view>
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <div class="box content ctm_subtitle margin_bottom_0" v-bind:style="{'margin-top':tabletHeight+'px'}">

      <!-- Main content -->
      <div class="box-body no-paddin">
        <form class="form-horizontal" autocomplete="off">
          <div class="box-body">
            <!-- <div class="margin_bottom_20">
              <button type="button" v-if="editPermission()" class="btn btn-default btn-lg btn-block" @click="onTransitionButton('/t_attendance/' + $route.params.operation_id + '/edit/' + item.id)">編 集</button>
            </div> -->
            <div class="form-group">
              <label class="col-sm-4 pull-left width_max font_18">お知らせID</label>
              <div class="col-sm-8 item-text font_18">
                {{item.id}}
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label width_max t_form_control font_18">更新日</label>
              <div class="col-sm-8 item-text font_18">
                {{df3(item.updatedAtForDisplay)}}
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label width_max t_form_control font_18">タイトル</label>
              <div class="col-sm-8 item-text font_18">
                {{item.title}}
              </div>
            </div>

            <div class="form-group">
              <label class="col-sm-4 control-label width_max t_form_control font_18">カテゴリー</label>
              <div class="col-sm-8 item-text font_18">
                {{getCategoryName(item.category)}}
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label width_max t_form_control font_18">本文</label>
              <div class="col-sm-8 item-text font_18">
                <span v-html="getColumData(item.body)"></span>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label width_max t_form_control font_18">表示設定</label>
              <div class="col-sm-8 item-text font_18">
                <label class="control control_checkbox">
                  <input type="checkbox" name="display" v-model="item.display" disabled>
                  <div class="control_indicator"></div>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label width_max t_form_control font_18">表示開始日時</label>
              <div class="col-sm-8 item-text font_18">
                {{df2(item.displayFrom)}}
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label width_max t_form_control font_18">表示終了日時</label>
              <div class="col-sm-8 item-text font_18">
                {{df2(item.displayTo)}}
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label width_max t_form_control font_18">登録日時</label>
              <div class="col-sm-8 item-text font_18">
                {{df(item.createdAt)}}
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-4 control-label width_max t_form_control font_18">更新日時</label>
              <div class="col-sm-8 item-text font_18">
                {{df(item.updatedAt)}}
              </div>
            </div>
          </div>
          <!-- /.box-body -->
          <div v-if="itemInfo" class="callout callout-success font_18"><p>{{itemInfo}}</p></div>
          <div v-if="error" class="callout callout-danger err-info font_18"><p>{{error}}</p></div>
          <div class="box-footer">
            <button type="button" class="btn btn-default btn-lg btn-block" onclick="window.history.back()">戻る</button>
          </div>
          <!-- /.box-footer -->
        </form>
      </div>
      <!-- /.box-body -->
    </div>
        <!-- /.box -->
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import TabletHeaderView from '~/components/TabletHeaderView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  
  export default {
    layout: 'everyone',
    data() {
      return {
        api: '/notifications',
        error: '',
        isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
        fullpage: true,
        tabletHeight: 0,
        category_id_options: [
          { name: "更新情報", value: 1 },
          { name: "メンテナンス情報", value: 2 },
          { name: "重要情報", value: 3 },
          { name: "不具合情報", value: 4 },
        ],
        param: {
          title: "お知らせ",
          isBackButtons: true,
          isHomeButtons: true,
          backPath: '/t_home'
        },
        updatedAt: '',
        item: {},
      }
    },
    components: {
      TabletHeaderView,
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
      $("body").css('background-color', '#FFF');
      this.getNotificationRequest();
    },
    watch: {
      $route: function(route) {
        this.getNotificationRequest();
      }
    },
    mounted() {
      this.tabletHeight = this.$refs.header.$el.clientHeight;
    }
  }

</script>
