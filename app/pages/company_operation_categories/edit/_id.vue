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
            <form class="form-horizontal" autocomplete="off">
              <div class="box-body">

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">ビル</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{ getNameByValue(item.buildingId, this.buildings) }}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務種別</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{ getNameByValue(item.operationTypeId, this.operationTypes) }}
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
                <report-object-group-view :param="reportObjectGroupParam" :list="reportObjectGroups" :isEdit="true"></report-object-group-view>
              </div>

              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" v-if="checkMenuPermission('Master:OperationCategory:delete')" @click="onDeleteFunc()">削除</button>
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/company_operation_categories/details/' + item.id)">キャンセル</button>
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
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert" @onconfirm="deleteFunc"></modal-alert-view>
      </template>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import ReportObjectGroupView from '~/components/ReportObjectGroupView'
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/companies/' + localStorage.getItem('company_id') + '/operation-categories',
        loading: true,
        fullpage: true,
        buildings: [],
        operationTypes: [],
        alert: {
          title: 'test',
        },
        param: {
          title: "ビル別業務グループ",
          columns: [
            { name: '契約会社ID', column: 'companyId' },
            { name: 'ビルID', column: 'buildingId'},
            { name: 'ビル別業務グループ名', column: 'name'},
            { name: '表示タイトル', column: 'reportName'},
            { name: '業務種別', column: 'operationTypeId' },
            { name: '業務グループ', column: 'reportObjectGroupList' },
            { name: '登録日時', column: 'createdAt' },
          ]
        },
        tmpUpdatedAt: "",
        error: "",
        itemInfo: "",
        item: {},
        reportObjectGroupParam: {
          contentTitle: '業務グループ',
          columnName: ['業務グループ名'],
          maxlength:32,
          options: []
        },
        reportObjectGroups:[],
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
      ReportObjectGroupView,
      ModalAlertView,
      Loading
    },
    methods: {
      /**
       * 表示対象の業務カテゴリとそれに紐づく業務グループを取得.
       */
      getOperationCategory() {
        var api_url = this.api;
        var filter = {
          'include': [{
            'relation': 'operationCategoryContents',
            'scope': {
              'include': [{
                'relation': 'reportObjectGroupDefinition'
              }]
            }
          }]
        };
        var where = { 'and': [{ 'id': this.$route.params.id }] };
        this.onSearch(api_url, filter, where, res => {
          if (0 < res.length) {
            var operationCategory = res[0];

            this.item = {
              'id': operationCategory.id,
              'companyId': operationCategory.companyId,
              'buildingId': operationCategory.buildingId,
              'operationTypeId': operationCategory.operationTypeId,
              'name': operationCategory.name,
              'reportName': operationCategory.reportName,
              'createdAt': operationCategory.createdAt,
              'updatedAt': operationCategory.updatedAt,
              'deletedAt': operationCategory.deletedAt
            };
            this.tmpUpdatedAt = operationCategory.updatedAt;

            const list = [];
            if (operationCategory.operationCategoryContents != undefined) {
              operationCategory.operationCategoryContents.forEach(function(obj) {
                var reportObjectGroupDefinition = obj.reportObjectGroupDefinition;
                list.push({ id: reportObjectGroupDefinition.id, name: reportObjectGroupDefinition.name, sort: obj.sort });
              });
            }
            list.sort(function(a,b){
              if(a.sort < b.sort) return -1;
              if(a.sort > b.sort) return 1;
              return 0;
            });
            this.reportObjectGroups = list;
          }
          this.getReportObjectGroups();
        });
      },

      /**
       * 表示対象の業務グループ取得(紐付け可能なデータ).
       *   契約会社と業務種別で絞り込み.
       */
      getReportObjectGroups() {
        var api_url = '/companies/' + localStorage.getItem('company_id') + '/report-object-group-definitions';
        var where = { 'and': [{ 'operationTypeId': this.item.operationTypeId }] };
        this.onSearch(api_url, null, where, data => {
          const list = [{ name: '', display: '', value: '' }];
          data.forEach(function(obj) {
            list.push({ name: obj.name, display: obj.name, value: obj.id });
          });
          this.reportObjectGroupParam.options = list;
        });
      },

      /**
       * ビル情報取得(契約会社IDで絞る).
       */
      getBuildings() {
        var api_url = '/buildings'
        var where = {'and':[{'companyId': parseInt(localStorage.getItem('company_id'))}]};
        this.onSearch(api_url, null, where, res => {
          const list = [{ name: '', value: '' }];
          res.forEach(function(obj) {
            list.push({ name: obj.name, display: obj.name, value: obj.id });
          });
          this.buildings = list;
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
        var api_url = this.api;
        this.onDelete(api_url, '/company_operation_categories');
      },

      /**
       * 更新ボタン押下時の処理.
       */
      onUpdateButton() {
        this.error = '';
        this.updateRequest();
      },
      updateRequest() {
        var api_url = this.api;
        var send_data = this.getPostData();
        this.req(api_url + '/' + parseInt(this.$route.params.id), 'patch', send_data, (err, res) => {
          if (err) {
            this.error = this.getErrorMsg2(res, this.param.columns);
            return;
          } else if (res.body) {
            this.error = "";
            this.itemInfo = "更新完了";
            this.tmpUpdatedAt = res.body.updatedAt;
            setTimeout(() => this.itemInfo = '', 3000);
          }
        });
      },
      getPostData() {
        return {
          buildingId: this.item.buildingId,
          name: this.item.name,
          reportName: this.item.name,
          operationTypeId: this.item.operationTypeId,
          reportObjectGroupList: this.reportObjectGroups.map((v) => v.id)
        }
      },

      /**
       * 子ビューからデータ取得.
       */
      childData(reportObjectGroups) {
        this.reportObjectGroups = reportObjectGroups;
      }
    },

    created() {
      const key = "Master:OperationCategory:update";
      this.checkDisplayPermission(key, () => {
        this.loading = false;
        this.getBuildings();
        this.getOperationTypes();
        this.getOperationCategory();
      });
    }
  }

</script>
