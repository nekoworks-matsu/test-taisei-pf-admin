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
                <li class="current">{{param.title}}詳細</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}詳細</h1>
          </section>
          <div class="button_header_btn">
            <button type="button" class="btn btn-info global_btn" v-if="checkMenuPermission('Master:ReportObjectDefinition:update')" @click="onTransitionButton('/company_report_object_definitions/edit/' + item.id)">編集</button>
          </div>
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
                    <label class="control-label">業務種別</label>
                  </div>
                  <div class="form_box_group_field">
                    {{ getNameByValue(this.reportObjectGroupDefinition.operationTypeId, this.operationTypes) }}
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務グループ</label>
                  </div>
                  <div class="form_box_group_field">
                    {{ this.reportObjectGroupDefinition.name }}
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">業務名</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{ item.name }}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">報告書表示設定</label>
                  </div>
                  <div class="form_box_group_field">
                    {{ getNameByValue(item.useAsReport, param.columns[0].options) }}
                  </div>
                </div>

              </div>
              <!-- /.box-body -->

              <div name="report_body">
                <report-field-view :param="reportFieldParam" :list="reportFields" :isEdit="false"></report-field-view>
              </div>

              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_center border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/company_report_object_definitions')">戻る</button>
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
  import ReportFieldView from '~/components/ReportFieldView'
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
    // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/companies/' + localStorage.getItem('company_id') + '/report-object-definitions',
        fullpage: true,
        loading: true,
        error: '',
        reportObjectGroupDefinition: {},
        operationTypes: [],
        param: {
          title: "業務・業務項目",
          columns: [
            { name: '報告書表示設定', column: 'useAsReport', options: [
              { name: '表示', display:'表示', value: true },
              { name: '非表示', display:'非表示', value: false }
            ]},
          ]
        },
        updatedAt: '',
        item: {},
        reportFieldParam: {
          contentTitle: '業務項目',
          columnName: ['必須', '項目名', '種別', 'プレースホルダ', '一覧検索条件', '日報検索条件', '一覧表示条件', '日報表示条件', 'バリデーション設定', 'プルダウン項目設定'],
          maxlength:32,
          options: []
        },
        reportFields:[],
      }
    },
    components: {
      ReportFieldView,
      ModalAlertView,
      Loading,
    },
    methods: {

      /**
       * 表示対象の業務取得.
       */
      getReportObjectDefinition() {
        var filter = {
          'include': [
            { relation: 'reportObjectGroupDefinition' },
            {
              relation: 'reportFieldDefinitions',
              scope: {
                'include': [
                  { relation: 'selectOptionDefinitions' },
                  { relation: 'fieldValidations' }
                ]
              }
            }
          ]
        };
        this.onRead(this.api, filter, data => {
          this.item = data;
          this.reportObjectGroupDefinition = (data.reportObjectGroupDefinition) ? data.reportObjectGroupDefinition : {};
          const reportFieldDefinitions = (data.reportFieldDefinitions) ? data.reportFieldDefinitions : [];
          reportFieldDefinitions.sort((a, b) => {
            if (a.fieldIndex < b.fieldIndex) return -1;
            if (a.fieldIndex > b.fieldIndex) return 1;
            return 0;
          });
          reportFieldDefinitions.map((v) => {
            // 表示用に値を更新
            v.displayIndex = (v.displayIndex != null) ? true : false
            return v;
          });
          this.reportFields = reportFieldDefinitions;
        });
      },

      /**
       * 業務項目種別.
       */
      getReportFieldOptions() {
        this.reportFieldParam.options = [
          { name: 'テキスト', value: 1 },
          { name: 'テキスト(複数行)', value: 6 },
          { name: 'テキスト(数字)', value: 3 },
          { name: '日付(年月日時分)', value: 2 },
          { name: 'セレクトボックス', value: 4 },
          { name: 'セレクトボックス(メンバー)', value: 5 },
          { name: 'セレクトボックス(フロア)', value: 9 },
          { name: 'チェックボックス(フロア)', value: 8 },
          { name: '画像', value: 7 },
          { name: '動画', value: 10 },
        ];
      },

      /**
       * 一覧からIDを元に名称を返却する.
       */
      getNameByValue(id, list) {
        var obj = list.find(obj => obj.value === id);
        return (obj != undefined) ? obj.name : '';
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
      }

    },
    created() {
      const key = "Master:ReportObjectDefinition:view";
      this.checkDisplayPermission(key, () => {
        this.loading = false;
        this.getReportFieldOptions();
        this.getReportObjectDefinition();
        this.getOperationTypes();
      });
    },
    watch: {
      $route: function(route) {
        this.getReportObjectDefinition();
      }
    }
  }

</script>
