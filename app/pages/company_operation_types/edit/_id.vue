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
                <li>{{param.title}}一覧</li>
                <li>{{param.title}}詳細</li>
                <li class="current">{{param.title}}編集</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}編集</h1>
          </section>
        </div>
      </div>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal" autocomplete="off" onsubmit="return false;">
              <div class="box-body">

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">業務種別名</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="64" class="form-control" placeholder="例）警備" v-model="item.name">
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">登録日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{df(item.createdAt)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">更新日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{df(this.tmpUpdatedAt)}}
                    </div>
                  </div>
                </div>
              </div>
              <!-- /.box-body -->

              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_right border_top">
                <!-- <button type="button" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" v-if="checkMenuPermission('Master:OperationType:delete')" @click="onDeleteFunc()">削 除</button> -->
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/company_operation_types/details/' + item.id)">キャンセル</button>
                <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton">保存</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body no-paddin -->
        </div>
        <!-- /.box -->

      </div>
      <!-- /.box-group -->
      <!-- 
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert" @onconfirm="deleteFunc"></modal-alert-view>
      </template>
       -->
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
  import { event } from '~/plugins/events.js'
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/companies/' + localStorage.getItem('company_id') + '/operation-types',
        loading: true,
        fullpage: true,
        alert: {
          title: 'test',
        },
        param: {
          title: "業務種別",
          columns: [
            { name: '契約会社ID', column: 'companyId' },
            { name: '業務種別名', column: 'name'},
            { name: '登録日時', column: 'createdAt' },
          ]
        },
        tmpUpdatedAt: "",
        error: "",
        itemInfo: "",
        item: {},
        DatePickerFormat: 'yyyy/MM/dd',
        language:{
          language: 'Japanese', 
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          days: ['日', '月', '火', '水', '木', '金', '土'], 
          rtl: false, 
          ymd: 'yyyy-MM-dd', 
          yearSuffix: '年'
        },
      }
    },
    components: {
      ModalAlertView,
      Loading
    },
    methods: {
      /**
       * 表示対象の業務種別取得.
       */
      getOperationType() {
        this.onRead(this.api, "", data => {
          this.item = data;
          this.tmpUpdatedAt = data.updatedAt;
        });
      },

      // 業務種別は削除できないようにコメントアウト
      // /**
      //  * 削除ボタン押下時の処理.
      //  */
      // onDeleteFunc() {
      //   this.alert.title = '';
      //   this.alert.message = 'こちらのデータを削除いたします。<br>よろしいでしょうか？<br>';
      //   this.alert.note = '※この操作は取り消すことはできません。'
      //   this.alert.isConfirm = true;
      //   $('#modal_alert').modal('show')
      // },
      // deleteFunc() {
      //   this.onDelete(this.api, '/company_operation_types');
      // },

      /**
       * 更新ボタン押下時の処理.
       */
      onUpdateButton() {
        this.error = '';
        this.updateRequest();
      },
      updateRequest() {
        var send_data = this.getPostData();
        this.req(this.api + '/' + parseInt(this.$route.params.id), 'patch', send_data, (err, res) => {
          if (err) {
            this.error = this.getErrorMsg2(res, this.param.columns);
            return;
          } else {
            this.error = "";
            this.itemInfo = "更新完了";
            this.tmpUpdatedAt = res.body.updatedAt;
            setTimeout(() => this.itemInfo = '', 3000);
            if (localStorage.getItem('company_id') == res.body.companyId) {
              let reportList = JSON.parse(localStorage.getItem('report_list'));
              let find = reportList.find(list => list.operation_type_id == res.body.id);
              find.operation_name = res.body.name;
              localStorage.setItem('report_list', JSON.stringify(reportList));
              event.emit('login-update');
            }
          }
        });
      },
      getPostData() {
        return {
          name: this.item.name
        }
      }
    },

    created() {
      const key = "Master:OperationType:update";
      this.checkDisplayPermission(key, () => {
        this.loading = false;
        this.getOperationType();
      });
    }
  }

</script>
