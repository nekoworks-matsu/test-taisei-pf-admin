<template>
  <div class="content-wrapper ts_content_wrapper">
    <loading
    :active.sync="loading"
    :can-cancel=false
    :on-cancel="onCancel"
    :is-full-page="fullpage"></loading>

    <section class="content_head">
      <div class="ts_content_head">
        <div class="button_header">
          <section>
            <div class="ts_breadcrumb">
              <ol>
                <li>{{param.operation}}</li>
                <li>{{param.title}}一覧</li>
                <li class="current">{{param.title}}登録</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}登録</h1>
          </section>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="box">
        <div class="box-header with-border box_head">
          <h2 class="box-title with-border">{{param.title}}情報</h2>
        </div>
        <div class="box-body no-paddin">
          <form class="form-horizontal" name="report_form">
            <div class="box-body">
              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">業務種別</label>
                </div>
                <div class="form_box_group_field">
                  <select class="form-control max_width_390" v-model="operationType" v-on:change="getReportObjectGroupDefinitions">
                    <option v-bind:value="opt.value" v-for="opt in operationTypes" >{{opt.name}}</option>
                  </select>
                </div>
              </div>
              <div class="form-group form_box_group" v-if="col.type!='hiddenColmun'" v-for="col in param.columns" v-bind:class='{required:col.required} '>
                <div class="box-header with-border" v-if="col.title">
                  <h3 class="box-title with-border">{{col.name}}</h3>
                </div>
                <div class="form_box_group_title" v-if="!col.title&&col.type!='threeTextInput'&&col.type!='hiddenColmun'&&col.type!='file'&&col.type!='texts'&&col.type!='requestText'&&col.type!='requestCheckbox'&&col.type!='checkbox'">
                  <label class="control-label">{{col.name}}</label>
                </div>
                <div class="form_box_group_field" v-if="!col.title && !col.type">
                  <input type="text" v-bind:maxlength="col.maxlength" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder || col.name" v-model="item[col.column]" v-bind:disabled="col.disabled">
                  <span v-if="col.text">{{col.text}}</span>
                </div>
                <div class="form_box_group_field" v-if="col.type=='select'">
                  <select class="form-control  max_width_390" v-bind:id="col.column" v-model="item[col.column]" v-bind:disabled="col.disabled">
                    <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                  </select>
                </div>
              </div>
            </div>

            <div name="report_body">
              <report-field-view :param="reportFieldParam" :list="reportFields" :isEdit="true"></report-field-view>
            </div>

            <div v-if="error" class="callout callout-danger err-info">
              <p>{{ error }}</p>
            </div>

            <div class="box-footer form_button_flex flex_right border_top">
              <button type="button" class="btn btn-default global_btn form_button_flex_item" onclick="window.history.back()" v-bind:disabled="this.isButtonDisabled" >キャンセル</button>
              <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onAddButton" v-bind:disabled="this.isButtonDisabled">登 録</button>
            </div>
            <!-- /.box-footer -->

          </form>
          <!-- /.form-horizontal -->
        </div>
        <!-- /.box-body -->
      </div>
      <!-- /.box -->
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
        isButtonDisabled: false,
        error: '',
        param: {
          title: '業務・業務項目',
          operation: 'マスタ情報',
          idLabel: '業務',
          columns: [
            { name: '業務グループ', column: 'reportObjectGroupDefinitionId', required: true, type: 'select', options: [] },
            { name: '業務名', column: 'name', required: true, placeholder: '例）防犯警報', maxlength: 32 },
            // { name: 'ソート', column: 'sort', required: true, placeholder: '1', maxlength: 11 },
            { name: '報告書表示設定', column: 'useAsReport', required: true, type: 'select', options: [
              { name: '表示', value: true },
              { name: '非表示', value: false }
            ]},
            { name: '項目名', column: 'reportFields', type: 'hiddenColmun' },
          ],
          init_val: {
            name: '',
            useAsReport: true
          },
          cb: this.updateView,
          icon: 'fa-user',
          success: '/company_report_object_definitions',
        },
        reportFieldParam: {
          contentTitle: '業務項目',
          columnName: ['必須', '項目名', '種別', 'プレースホルダ', '一覧検索条件', '日報検索条件', '一覧表示条件', '日報表示条件', 'バリデーション設定', 'プルダウン項目設定'],
          maxlength:32,
          options: []
        },
        operationTypes:[],
        operationType: '',
        reportFields:[],
        DatePickerFormat: 'yyyy/MM',
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
      updateView(val) {},
      onCancel() {},

      /**
       * 業務グループ取得(契約会社IDで絞る).
       */
      getReportObjectGroupDefinitions() {
        var api_url = '/companies/' + localStorage.getItem('company_id') + '/report-object-group-definitions';
        var where = {'and':[{'companyId': parseInt(localStorage.getItem('company_id'))}]};
        if (this.operationType != '') {
          where.and[0].operationTypeId = this.operationType;
        }
        this.onSearch(api_url, null, where, res => {
          const list = [{ name: '', display: '', value: '' }];
          res.forEach(function(obj) {
            list.push({ name: obj.name, display: obj.name, value: obj.id});
          });
        this.param.columns[0].options = list;
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
        ];
      },

      /**
       * 登録ボタン押下時処理.
       */
      onAddButton() {
        this.error = ''
        this.addRequest()
      },
      addRequest() {
        if (this.reportFields) {
          var send_data = this.getPostData();
          if (send_data) {
            this.req(this.api, 'post', send_data, (err, res) => {
              if (err) {
                this.error = this.getErrorMsg2(res, this.param.columns)
                return;
              } else if (res.body) {
                this.$router.push('/company_report_object_definitions/');
              }
            });
          }
        } else {
          this.error = '業務項目: 必須項目です'
        }
      },
      getPostData() {
        var postReportFields = [];
        var isHasReportExtractField = false;
        for (const key in this.reportFields) {
          var availableForSearch = this.reportFields[key].availableForSearch;
          if (this.reportFields[key].reportExtractField) {
            availableForSearch = true;
            isHasReportExtractField = true;
          }
          postReportFields.push({
            'fieldIndex': parseInt(key),
            'name': this.reportFields[key].name,
            'type': this.reportFields[key].type,
            'placeholder': this.reportFields[key].placeholder,
            'required': this.reportFields[key].required,
            'reportExtractField': this.reportFields[key].reportExtractField,
            'displayIndex': (this.reportFields[key].displayIndex) ? parseInt(key) : null, // チェックされている場合、fieldIndexと同じ値を設定する
            'availableForSearch': availableForSearch,
            'availableForReport': this.reportFields[key].availableForReport,
            'validations': this.reportFields[key].fieldValidations.filter((a) => a.numberValue)
              .map((v) => { return {
                'type': v.type,
                'textValue': v.textValue,
                'numberValue': parseInt(v.numberValue)
              }}),
            'selectOptions': this.reportFields[key].selectOptionDefinitions.filter((v) => v.label)
              .map((v) => { return {
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
          // sort: 1, // この段階ではソート順は決まらないためリクエストしない
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
      const key = "Master:ReportObjectDefinition:create";
      this.checkDisplayPermission(key, () => {
        this.getReportFieldOptions();
        this.getOperationTypes();
        this.getReportObjectGroupDefinitions();
        this.loading = false;
        if (this.param.init_val){
          this.item = this.param.init_val;
        }
        this.reportFields = [];
      });
    },
    watch: {
      item: {
        handler(val) {
          this.param.columns.forEach( e => {
            if (this.item[e.column] === '') {
              this.item[e.column] = undefined;
            }
          });
          if(this.param.cb != null) {
            this.param.cb(val);
          }
        },
        deep: true,
      },
    },
  }

</script>

<style lang="stylus" scoped>

</style>
