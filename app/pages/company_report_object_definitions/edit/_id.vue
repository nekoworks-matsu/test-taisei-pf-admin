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
                    <label class="control-label">業務グループ</label>
                  </div>
                  <div class="form_box_group_field">
                    {{ this.reportObjectGroupDefinition.name }}
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">業務名</label>
                  </div>
                  <div class="form_box_group_field">
                    <input type="text" maxlength="32" class="form-control" placeholder="例）業務カテゴリ名" v-model="item.name">
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">報告書表示設定</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control  max_width_390" v-bind:id="'useAsReport'" v-model="item.useAsReport">
                      <option v-bind:value="opt.value" v-for="opt in param.columns[2].options">{{opt.name}}</option>
                    </select>
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
                <report-field-view :param="reportFieldParam" :list="reportFields" :isEdit="true"></report-field-view>
              </div>

              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" v-if="checkMenuPermission('Master:ReportObjectDefinition:delete')" @click="onDeleteFunc()">削除</button>
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/company_report_object_definitions/details/' + item.id)">キャンセル</button>
                <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton">保存</button>
              </div>
              <!-- /.box-footer -->
            </form>

          </div>
          <!-- /.box-body -->
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
        reportObjectGroupDefinition: {},
        alert: {
          title: 'test',
        },
        param: {
          title: "業務・業務項目",
          columns: [
            { name: '業務グループID', column: 'reportObjectGroupDefinitionId' },
            { name: '業務名', column: 'name'},
            // { name: 'ソート', column: 'sort'},
            { name: '報告書表示設定', column: 'useAsReport', options: [
              { name: '表示', value: true },
              { name: '非表示', value: false }
            ]},
            { name: '項目名', column: 'reportFields' },
            { name: '登録日時', column: 'createdAt' },
          ]
        },
        tmpUpdatedAt: "",
        error: "",
        itemInfo: "",
        item: {},
        reportFieldParam: {
          contentTitle: '業務項目',
          columnName: ['必須', '項目名', '種別', 'プレースホルダ', '一覧検索条件', '日報検索条件', '一覧表示条件', '日報表示条件', 'バリデーション設定', 'プルダウン項目設定'],
          maxlength:32,
          options: []
        },
        reportFields:[],
        operationTypes: [],
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
          include: [
            { relation: 'reportObjectGroupDefinition' },
            {
              relation: 'reportFieldDefinitions',
              scope : {
                include: [
                  { relation: 'fieldValidations' },
                  { relation: 'selectOptionDefinitions' }
                ]
              }
            }
          ]
        };
        this.onRead(this.api, filter, data => {
          this.item = data;
          this.reportObjectGroupDefinition = (data.reportObjectGroupDefinition) ? data.reportObjectGroupDefinition : {};
          this.tmpUpdatedAt = data.updatedAt;
          const reportFieldDefinitions = (data.reportFieldDefinitions) ? data.reportFieldDefinitions : [];
          reportFieldDefinitions.sort((a, b) => {
            if (a.fieldIndex < b.fieldIndex) return -1;
            if (a.fieldIndex > b.fieldIndex) return 1;
            return 0;
          });
          reportFieldDefinitions.map((v) => {
            // 表示用に値を更新
            v.displayIndex = (v.displayIndex != null) ? true : false
            v.deletable = true;
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
        this.onDelete(this.api, '/company_report_object_definitions');
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
        if (send_data) {
          this.req(this.api + '/' + parseInt(this.$route.params.id), 'patch', send_data, (err, res) => {
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
        }
      },
      getPostData() {
        var postReportFields = [];
        var isHasReportExtractField = false;
        for (const key in this.reportFields) {
          var availableForSearch = this.reportFields[key].availableForSearch;
          if (this.reportFields[key].reportExtractField){
            availableForSearch = true;
            isHasReportExtractField = true;
          }
          postReportFields.push({
            'id': this.reportFields[key].id,
            'fieldIndex': parseInt(key),
            'name': this.reportFields[key].name,
            'type': this.reportFields[key].type,
            'placeholder': this.reportFields[key].placeholder,
            'required': this.reportFields[key].required,
            'reportExtractField': this.reportFields[key].reportExtractField,
            'displayIndex': (this.reportFields[key].displayIndex) ? parseInt(key) : null, // チェックされている場合、fieldIndexと同じ値を設定する
            'availableForSearch': availableForSearch,
            'availableForReport': this.reportFields[key].availableForReport,
            'validations': this.reportFields[key].fieldValidations?.filter((a) => a.numberValue)
              .map((v) => { return {
                'id': v.id,
                'type': v.type,
                'textValue': v.textValue,
                'numberValue': parseInt(v.numberValue)
              }}),
            'selectOptions': this.reportFields[key].selectOptionDefinitions?.filter((v) => v.label)
              .map((v) => { return {
                'id': v.id,
                'label': v.label
              }})
          });
        }
        if (!isHasReportExtractField){
          this.error = '日報検索条件の業務項目を必ず1つ含めてください。'
          return null;
        }
        return {
          reportObjectGroupDefinitionId: this.item.reportObjectGroupDefinitionId,
          name: this.item.name,
          // sort: this.item.sort, // リクエストしない
          useAsReport: this.item.useAsReport,
          reportFields: postReportFields
        }
      },

      /**
       * 子ビューからデータ取得.
       */
      childData(reportFields) {
        this.reportFields = reportFields;
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
      const key = "Master:ReportObjectDefinition:update";
      this.checkDisplayPermission(key, () => {
        this.loading = false;
        this.getReportFieldOptions();
        this.getReportObjectDefinition();
        this.getOperationTypes();
      });
    }
  }

</script>
