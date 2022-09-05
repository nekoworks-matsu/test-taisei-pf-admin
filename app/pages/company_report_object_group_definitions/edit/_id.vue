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
                    <label class="control-label">業務種別</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control" v-model="item.operationTypeId">
                      <option v-bind:value="opt.value" v-for="opt in operationTypes" >{{opt.name}}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">業務グループ名</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="64" class="form-control" placeholder="例）防災センター業務" v-model="item.name">
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label" for="autoCreate">自動登録設定</label>
                  </div>   
                  <div class="form_box_group_field">
                    <div class="item-text">
                      <label class="control control_checkbox">
                        <input type="checkbox" id="autoCreate" name="autoCreate" v-model="item.autoCreate">
                        <div class="control_indicator"></div>
                      </label>
                    </div>
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

              <div name="report_body">
                <report-object-view :param="reportObjectParam" :list="reportObjectDefinitions" :isEdit="true"></report-object-view>
              </div>

              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_right border_top">
              <!--  <button type="button" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" v-if="checkMenuPermission('Master:ReportObjectGroupDefinition:delete')" @click="onDeleteFunc()">削 除</button> -->
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/company_report_object_group_definitions/details/' + item.id)">キャンセル</button>
                <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton">保存</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>


        </div>
        <!-- /.box -->

      </div>
      <!-- /.box-group -->
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert" @onconfirm="deleteFunc"></modal-alert-view>
      </template>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import ReportObjectView from '~/components/ReportObjectView'
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/companies/' + localStorage.getItem('company_id') + '/report-object-group-definitions',
        loading: true,
        fullpage: true,
        operationTypes: [],
        alert: {
          title: 'test',
        },
        param: {
          title: "業務グループ",
          columns: [
            { name: '業務種別', column: 'operationTypeId' },
            { name: '業務グループ名', column: 'name'},
            { name: '自動登録設定', column: 'autoCreate' },
            { name: '登録日時', column: 'createdAt' },
          ]
        },
        tmpUpdatedAt: "",
        error: "",
        itemInfo: "",
        item: {},
        reportObjectParam: {
          contentTitle: '業務',
          columnName: ['業務名'],
          maxlength:32,
          options: []
        },
        reportObjectDefinitions:[],
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
      ReportObjectView,
      ModalAlertView,
      Loading
    },
    methods: {

      /**
       * 表示対象の業務グループとそれに紐づく業務を取得.
       */
      getReportObjectGroupDefinition() {
        var filter = {
          'include': [{ relation: 'reportObjectDefinitions' }]
        };
        this.onRead(this.api, filter, data => {
          this.item = data;
          this.reportObjectDefinitions = (data.reportObjectDefinitions) ? data.reportObjectDefinitions : [];
          this.reportObjectDefinitions.sort(function(a,b){
            if(a.sort < b.sort) return -1;
            if(a.sort > b.sort) return 1;
              return 0;
          });
           // 関連テーブルに登録済みデータ
          this.tmpUpdatedAt = data.updatedAt;
        });
      },

      /**
       * 業務種別取得(契約会社IDで絞る).
       */
      getOperationTypes() {
        var api_url = '/companies/' + localStorage.getItem('company_id') + '/operation-types';
        var where = {};
        this.onSearch(api_url, null, where, res => {
          const list = [{ name: '', display: '', value: '' }];
          res.forEach(function(obj) {
            list.push({ name: obj.name, display: obj.name, value: obj.id});
          });
          this.operationTypes = list;
        });
      },

      /**
       * 一覧からIDを元に名称を返却する.
       */
      getNameByValue(id, list) {
        var obj = list.find(obj => obj.value === id);
        return (obj != undefined) ? obj.name : '';
      },

      /**
       * 削除ボタン押下時の処理.
       */
      onDeleteFunc() {
        this.alert.title = '';
        this.alert.message = 'こちらのデータを削除いたします。<br>よろしいでしょうか？<br>';
        this.alert.note = '※この操作は取り消すことはできません。'
        this.alert.isConfirm = true;
        $('#modal_alert').modal('show')
      },
      deleteFunc() {
        this.onDelete(this.api, '/company_report_object_group_definitions');
      },

      /**
       * 更新ボタン押下時の処理.
       */
      onUpdateButton() {
        this.error = ''
        this.updateRequest()
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
          }
        });
      },
      getPostData() {
        return {
          operationTypeId: this.item.operationTypeId,
          name: this.item.name,
          autoCreate: this.item.autoCreate,
          reportObjectList: this.reportObjectDefinitions.map((v) => v.id)
        }
      },

      /**
       * 子ビューからデータ取得.
       */
      childData(reportObjectDefinitions) {
        this.reportObjectDefinitions = reportObjectDefinitions;
      },
    },
    created() {
      const key = "Master:ReportObjectGroupDefinition:update";
      this.checkDisplayPermission(key, () => {
        this.loading = false;
        this.getOperationTypes();
        this.getReportObjectGroupDefinition();
      });
    }
  }

</script>
