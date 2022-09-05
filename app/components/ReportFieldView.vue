<template>
  <div class="monthly_report_tb_margin">
    <h3 class="box-title with-border">{{param.contentTitle}}</h3>
    <div class="box-body no-padding">
      <div class="monthly_report_date">
        <table class="table table-bordered table-hover multi_table" role="grid" v-if="isTablet==null">
          <thead>
            <tr role="row">
              <th v-if="isEdit"></th>
              <th>{{param.columnName[0]}}</th>
              <th>{{param.columnName[1]}}<a class="color_red2" v-if="isEdit">※</a></th>
              <th>{{param.columnName[2]}}</th>
              <th>{{param.columnName[3]}}</th>
              <th>{{param.columnName[4]}}</th>
              <th>{{param.columnName[5]}}</th>
              <th>{{param.columnName[6]}}</th>
              <th>{{param.columnName[7]}}</th>
              <th>{{param.columnName[8]}}</th>
              <th>{{param.columnName[9]}}</th>
              <th v-if="isEdit"></th>
            </tr>
          </thead>
          <tbody>
            <tr role="row" v-for="(item, index) in list" @click="" v-bind:id="index" v-bind:class="{changed_background: (index == changedIndex)}">
              <!-- 表示順 -->
              <td width="10%" v-if="isEdit">
                <button type="button" class="btn btn-default" @click.stop="onTappedUp(index)"><i class="fa fa-caret-up fa-lg"></i></button>&nbsp;
                <button type="button" class="btn btn-default" @click.stop="onTappedDown(index)"><i class="fa fa-caret-down fa-lg"></i></button>
              </td>

              <!-- 必須項目かどうか -->
              <td width="5%" class="vertical_align_middle" v-if="isEdit">
                <label class="control control_checkbox">
                  <input type="checkbox" name="required" v-bind:id="'checkbox_required_'+index" @change="onCheckbox(index, 'checkbox_required_'+index, 'required')" checked v-if="item.required">
                  <input type="checkbox" name="required" v-bind:id="'checkbox_required_'+index" @change="onCheckbox(index, 'checkbox_required_'+index, 'required')" v-if="!item.required">
                  <div class="control_indicator"></div>
                </label>
              </td>
              <td width="5%" class="vertical_align_middle pointer_events_none" v-if="!isEdit">
                <label class="control control_checkbox">
                  <input type="checkbox" id="'required'+index" name="required" v-model="item.required" disabled>
                  <div class="control_indicator"></div>
                </label>
              </td>

              <!-- 項目名 -->
              <td width="20%" class="" v-if="isEdit">
                <input type="text" maxlength="32" class="form-control" :placeholder="'例）'+param.columnName[1]" v-model="item.name">
              </td>
              <td width="20%" class="pointer_events_none" v-if="!isEdit">
                <span v-html="getColumData(item.name)"></span>
              </td>

              <!-- 種別 -->
              <td width="20%" class="" v-if="isEdit">
                <select class="form-control  max_width_390" v-bind:id="'type_'+index" v-model="item.type" @change="onSelect(index, 'type_'+index)">
                  <option v-bind:value="opt.value" v-for="opt in param.options">{{opt.name}}</option>
                </select>
              </td>
              <td width="20%" class="pointer_events_none" v-if="!isEdit">
                {{ getNameByValue(item.type, param.options) }}
              </td>

              <!-- プレースホルダ -->
              <td width="20%" class="" v-if="isEdit">
                <input type="text" maxlength="32" class="form-control" :placeholder="'例）'+param.columnName[3]" v-model="item.placeholder">
              </td>
              <td width="20%" class="pointer_events_none" v-if="!isEdit">
                <span v-html="getColumData(item.placeholder)"></span>
              </td>

              <!-- 一覧検索対象かどうか -->
              <td width="5%" class="vertical_align_middle" v-if="isEdit">
                <label class="control control_checkbox">
                  <input type="checkbox" name="availableForSearch" v-bind:id="'checkbox_available_for_search_'+index" @change="onCheckbox(index, 'checkbox_available_for_search_'+index, 'availableForSearch')" checked v-if="item.availableForSearch">
                  <input type="checkbox" name="availableForSearch" v-bind:id="'checkbox_available_for_search_'+index" @change="onCheckbox(index, 'checkbox_available_for_search_'+index, 'availableForSearch')" v-if="!item.availableForSearch">
                  <div class="control_indicator"></div>
                </label>
              </td>
              <td width="5%" class="vertical_align_middle pointer_events_none" v-if="!isEdit">
                <label class="control control_checkbox">
                  <input type="checkbox" id="'availableForSearch_'+index" name="availableForSearch" v-model="item.availableForSearch" disabled>
                  <div class="control_indicator"></div>
                </label>
              </td>

              <!-- 日報で時間指定した際の検索条件とするかどうか -->
              <td width="5%" class="vertical_align_middle" v-if="isEdit">
                <label class="control control_checkbox" v-if="item.type == '2'">
                  <input type="checkbox" name="reportExtractField" v-bind:id="'checkbox_report_extract_field_'+index" @change="onCheckbox(index, 'checkbox_report_extract_field_'+index, 'reportExtractField')" checked v-if="item.reportExtractField">
                  <input type="checkbox" name="reportExtractField" v-bind:id="'checkbox_report_extract_field_'+index" @change="onCheckbox(index, 'checkbox_report_extract_field_'+index, 'reportExtractField')" v-if="!item.reportExtractField">
                  <div class="control_indicator"></div>
                </label>
                <label class="control control_checkbox" v-if="item.type != '2'">
                  <input type="checkbox" name="reportExtractField" v-bind:id="'checkbox_report_extract_field_'+index" @change="onCheckbox(index, 'checkbox_report_extract_field_'+index, 'reportExtractField')" checked v-if="item.reportExtractField" disabled>
                  <input type="checkbox" name="reportExtractField" v-bind:id="'checkbox_report_extract_field_'+index" @change="onCheckbox(index, 'checkbox_report_extract_field_'+index, 'reportExtractField')" v-if="!item.reportExtractField" disabled>
                  <div class="control_indicator"></div>
                </label>
              </td>
              <td width="5%" class="vertical_align_middle pointer_events_none" v-if="!isEdit">
                <label class="control control_checkbox">
                  <input type="checkbox" id="'reportExtractField_'+index" name="reportExtractField" v-model="item.reportExtractField" disabled>
                  <div class="control_indicator"></div>
                </label>
              </td>

              <!-- 一覧表示対象かどうか -->
              <td width="5%" class="vertical_align_middle" v-if="isEdit">
                <label class="control control_checkbox">
                  <input type="checkbox" name="displayIndex" v-bind:id="'checkbox_display_index_'+index" @change="onCheckbox(index, 'checkbox_display_index_'+index, 'displayIndex')" checked v-if="item.displayIndex">
                  <input type="checkbox" name="displayIndex" v-bind:id="'checkbox_display_index_'+index" @change="onCheckbox(index, 'checkbox_display_index_'+index, 'displayIndex')" v-if="!item.displayIndex">
                  <div class="control_indicator"></div>
                </label>
              </td>
              <td width="5%" class="vertical_align_middle pointer_events_none" v-if="!isEdit">
                <label class="control control_checkbox">
                  <input type="checkbox" id="'displayIndex_'+index" name="displayIndex" v-model="item.displayIndex" disabled>
                  <div class="control_indicator"></div>
                </label>
              </td>

              <!-- 日報に表示するかどうか -->
              <td width="5%" class="vertical_align_middle" v-if="isEdit">
                <label class="control control_checkbox">
                  <input type="checkbox" name="availableForReport" v-bind:id="'checkbox_available_for_report_'+index" @change="onCheckbox(index, 'checkbox_available_for_report_'+index, 'availableForReport')" checked v-if="item.availableForReport">
                  <input type="checkbox" name="availableForReport" v-bind:id="'checkbox_available_for_report_'+index" @change="onCheckbox(index, 'checkbox_available_for_report_'+index, 'availableForReport')" v-if="!item.availableForReport">
                  <div class="control_indicator"></div>
                </label>
              </td>
              <td width="5%" class="vertical_align_middle pointer_events_none" v-if="!isEdit">
                <label class="control control_checkbox">
                  <input type="checkbox" id="'availableForReport_'+index" name="availableForReport" v-model="item.availableForReport" disabled>
                  <div class="control_indicator"></div>
                </label>
              </td>

              <!-- バリデーション設定 -->
              <td width="5%" v-if="isEdit">
                <button type="button" v-if="(item.type == '1' || item.type == '6' || item.type == '7' || item.type == '3' || item.type == '9')"
                 class="btn btn-primary" v-bind:id="'field_validation_'+index" v-bind:disabled="false" data-toggle="modal" v-bind:data-target="'#modal_validation_'+index">設定
                </button>
                <button type="button" v-else
                 class="btn btn-primary" v-bind:id="'field_validation_'+index" v-bind:disabled="true" data-toggle="modal" v-bind:data-target="'#modal_validation_'+index">設定
                </button>
              </td>
              <td width="5%" v-if="!isEdit">
                <button type="button" v-if="(item.type == '1' || item.type == '6' || item.type == '7' || item.type == '3' || item.type == '9')"
                 class="btn btn-primary" v-bind:id="'field_validation_'+index" v-bind:disabled="false" data-toggle="modal" v-bind:data-target="'#modal_validation_'+index">詳細
                </button>
                <button type="button" v-else
                 class="btn btn-primary" v-bind:id="'field_validation_'+index" v-bind:disabled="true" data-toggle="modal" v-bind:data-target="'#modal_validation_'+index">詳細
                </button>
              </td>

              <!-- プルダウン項目設定 -->
              <td width="5%" v-if="isEdit">
                <button type="button" v-if="item.type == '4'"
                  class="btn btn-primary" v-bind:id="'select_option_'+index" v-bind:disabled="false" data-toggle="modal" v-bind:data-target="'#modal_select_option_'+index">設定
                </button>
                <button type="button" v-else
                  class="btn btn-primary" v-bind:id="'select_option_'+index" v-bind:disabled="true" data-toggle="modal" v-bind:data-target="'#modal_select_option_'+index">設定
                </button>
              </td>
              <td width="5%" v-if="!isEdit">
                <button type="button" v-if="item.type == '4'"
                 class="btn btn-primary" v-bind:id="'select_option_'+index" v-bind:disabled="false" data-toggle="modal" v-bind:data-target="'#modal_select_option_'+index">詳細
                </button>
                <button type="button" v-else
                 class="btn btn-primary" v-bind:id="'select_option_'+index" v-bind:disabled="true" data-toggle="modal" v-bind:data-target="'#modal_select_option_'+index">詳細
                </button>
              </td>

              <td width="5%" v-if="isEdit"><button type="button" v-bind:disabled="item.deletable" class="btn btn-danger" @click.stop="onTappedDelete(index)"><i class="fa fa-minus"></i></button></td>

              <template>
                <modal-validation-view ref="modalValidation" :id="'modal_validation_'+index" :isEdit="isEdit" :index="index" :title="'バリデーション設定'" :type="item.type" :values="item.fieldValidations" @okButtonClick="onOKButtonClick4Validation"></modal-validation-view>
              </template>
              <template>
                <modal-select-option-view ref="modalSelectOption" :id="'modal_select_option_'+index" :isEdit="isEdit" :index="index" :title="'プルダウンラベル設定'" :type="item.type" :values="item.selectOptionDefinitions" @okButtonClick="onOKButtonClick4SelectOption"></modal-select-option-view>
              </template>
            </tr>
          </tbody>
        </table>
        <div class="box-body pull-right" v-if="isEdit">
          <button type="button" class="btn btn-success" @click.stop="onTappedAddNew"><i class="fa fa-plus"></i></button>
        </div>
      </div>
    </div>
    <div class="box-header with-border">
    </div>
  </div>
</template>

<script>
  import ModalValidationView from '~/components/ModalValidationView'
  import ModalSelectOptionView from '~/components/ModalSelectOptionView'
  export default {
    name: 'ReportFieldView',
    props: {
      param: Object,
      list: Array,
      count: Number,
      limit: Number,
      isTablet: Object,
      isRemoveAdd: Boolean,
      isEdit: Boolean,
      offset: 0,
    },
    data() {
      return {
        changedIndex: null,
        fullpage: true,
        DatePickerFormat: 'd',
        language:{
          language: 'Japanese', 
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          days: ['日', '月', '火', '水', '木', '金', '土'], 
          rtl: false, 
          ymd: 'yyyy-MM-dd', 
          yearSuffix: '年'
        }
      }
    },

    components: {
      ModalValidationView,
      ModalSelectOptionView
    },

    methods: {

      /**
       * 「種別」選択時の処理.
       */
      onSelect(index, id) {
        var selectbox = document.getElementById(id);

        // reportExtractField(日報で時間指定した際の検索条件とするかどうか)の処理
        var reportExtractField = document.getElementById('checkbox_report_extract_field_'+index);
        if (selectbox.value == '2') {
          reportExtractField.disabled = false; // 見た目
        } else {
          reportExtractField.disabled = true;  // 見た目
          reportExtractField.checked  = false; // 見た目
          this.list[index]['reportExtractField'] = false; // データ
        }

        // FieldValidation 表示処理
        var fieldValidation = document.getElementById('field_validation_'+index);
        if (selectbox.value == '1' || selectbox.value == '6' || selectbox.value == '7' ||
            selectbox.value == '3' || selectbox.value == '9') {
          fieldValidation.disabled = false; // 見た目
          this.$refs.modalValidation[index].changeSelect(Number(selectbox.value), {});
        } else {
          fieldValidation.disabled = true;  // 見た目
        }

        // SelectOptionDefinition 表示処理
        var selectOption = document.getElementById('select_option_'+index);
        if (selectbox.value == '4') {
          selectOption.disabled = false; // 見た目
        } else {
          selectOption.disabled = true;  // 見た目
        }
      },

      /**
       * チェック時の共通処理.
       *   一覧検索条件
       *   日報検索条件
       *   一覧表示条件
       *   日報表示条件
       */
      onCheckbox(index, id, key) {
        var checkbox = document.getElementById(id);
        var tempChecked = checkbox.checked;
        switch(key) {
          case 'reportExtractField':
            // 全クリア
            document.getElementsByName('reportExtractField').forEach((item) => item.checked = false);  // 見た目
            this.list.forEach((item) => item.reportExtractField = false); // データ
            // 上書き
            checkbox.checked = tempChecked; // 見た目
            break
          default:
            break
        }
        // 上書き
        this.list[index][key] = checkbox == null ? false : checkbox.checked; // データ
      },

      /**
       * 「↑」ボタン押下時の処理.
       */
      onTappedUp(index) {
        if (index != 0) {
          this.changedIndex = index - 1;
          const orizin = this.list[index];
          const targetOrizin = this.list[index - 1];
          this.list[index] = targetOrizin;
          this.list[index - 1] = orizin;
          this.list.splice();

          // 見た目の追従
          // 必須
          document.getElementById('checkbox_required_' + index).checked = targetOrizin.required;
          document.getElementById('checkbox_required_' + (index - 1)).checked = orizin.required;
          // 一覧検索条件
          document.getElementById('checkbox_available_for_search_' + index).checked = targetOrizin.availableForSearch;
          document.getElementById('checkbox_available_for_search_' + (index - 1)).checked = orizin.availableForSearch;
          // 日報検索条件
          document.getElementById('checkbox_report_extract_field_' + index).checked = targetOrizin.reportExtractField;
          document.getElementById('checkbox_report_extract_field_' + (index - 1)).checked = orizin.reportExtractField;
          // 一覧表示条件
          document.getElementById('checkbox_display_index_' + index).checked = targetOrizin.displayIndex;
          document.getElementById('checkbox_display_index_' + (index - 1)).checked = orizin.displayIndex;
          // 日報表示条件
          document.getElementById('checkbox_available_for_report_' + index).checked = targetOrizin.availableForReport;
          document.getElementById('checkbox_available_for_report_' + (index - 1)).checked = orizin.availableForReport;
          // バリデーション項目
          const orizinValidation = document.getElementById('field_validation_' + index).disabled;
          const targetOrizinValidation = document.getElementById('field_validation_' + (index - 1)).disabled;
          document.getElementById('field_validation_' + index).disabled = targetOrizinValidation;
          document.getElementById('field_validation_' + (index - 1)).disabled = orizinValidation;
          // プルダウン項目
          const orizinSelectOption = document.getElementById('select_option_' + index).disabled;
          const targetOrizinSelectOption = document.getElementById('select_option_' + (index - 1)).disabled;
          document.getElementById('select_option_' + index).disabled = targetOrizinSelectOption;
          document.getElementById('select_option_' + (index - 1)).disabled = orizinSelectOption;
          setTimeout(() => {
            this.changedIndex = null}
          ,700)
        }
      },

      /**
       * 「↓」ボタン押下時の処理.
       */
      onTappedDown(index) {
        if (index != (this.list.length - 1)) {
          this.changedIndex = index + 1;
          const orizin = this.list[index];
          const targetOrizin = this.list[index + 1];
          this.list[index] = targetOrizin;
          this.list[index + 1] = orizin;
          this.list.splice();

          // 見た目の追従
          // 必須
          document.getElementById('checkbox_required_' + index).checked = targetOrizin.required;
          document.getElementById('checkbox_required_' + (index + 1)).checked = orizin.required;
          // 一覧検索条件
          document.getElementById('checkbox_available_for_search_' + index).checked = targetOrizin.availableForSearch;
          document.getElementById('checkbox_available_for_search_' + (index + 1)).checked = orizin.availableForSearch;
          // 日報検索条件
          document.getElementById('checkbox_report_extract_field_' + index).checked = targetOrizin.reportExtractField;
          document.getElementById('checkbox_report_extract_field_' + (index + 1)).checked = orizin.reportExtractField;
          // 一覧表示条件
          document.getElementById('checkbox_display_index_' + index).checked = targetOrizin.displayIndex;
          document.getElementById('checkbox_display_index_' + (index + 1)).checked = orizin.displayIndex;
          // 日報表示条件
          document.getElementById('checkbox_available_for_report_' + index).checked = targetOrizin.availableForReport;
          document.getElementById('checkbox_available_for_report_' + (index + 1)).checked = orizin.availableForReport;
          // バリデーション項目
          const orizinValidation = document.getElementById('field_validation_' + index).disabled;
          const targetOrizinValidation = document.getElementById('field_validation_' + (index + 1)).disabled;
          document.getElementById('field_validation_' + index).disabled = targetOrizinValidation;
          document.getElementById('field_validation_' + (index + 1)).disabled = orizinValidation;
          // プルダウン項目
          const orizinSelectOption = document.getElementById('select_option_' + index).disabled;
          const targetOrizinSelectOption = document.getElementById('select_option_' + (index + 1)).disabled;
          document.getElementById('select_option_' + index).disabled = targetOrizinSelectOption;
          document.getElementById('select_option_' + (index + 1)).disabled = orizinSelectOption;
          setTimeout(() => {
            this.changedIndex = null}
          ,700)
        }
      },

      /**
       * 削除ボタン押下時の処理.
       */
      onTappedDelete(index) {
          this.list.splice(index, 1);
      },

      /**
       * 追加ボタン押下時の処理.
       */
      onTappedAddNew() {
        if (this.list.length == 0) {
          this.list.push({
            'id': '',
            'required': true,
            'name': '',
            'type': 2,
            'placeholder': '',
            'availableForSearch': true,
            'reportExtractField': true,
            'displayIndex': true,
            'availableForReport': true,
            'fieldValidations': [ { 'id': '', 'type': 0, 'textValue': '', 'numberValue': '' } ],
            'selectOptionDefinitions': [ { 'id': '', 'label': ''} ]
          });
        } else {
          this.list.push({
            'id': '',
            'required': false,
            'name': '',
            'type': 1,
            'placeholder': '',
            'availableForSearch': false,
            'reportExtractField': false,
            'displayIndex': false,
            'availableForReport': false,
            'fieldValidations': [ { 'id': '', 'type': 0, 'textValue': '', 'numberValue': '' } ],
            'selectOptionDefinitions': [ { 'id': '', 'label': ''} ]
          });
        }
      },

      /**
       * リストからIDを元に名称を取得する.
       */
      getNameByValue(id, list) {
        var obj = list.find(obj => obj.value === id);
        return (obj != undefined) ? obj.name : '';
      },

      /**
       * モーダル表示.
       */
      openModal(id) {
        var modal_content = document.getElementsByName(id);
      },

      /**
       * モーダルを閉じてデータを受け取る.
       *   バリデーション項目
       */
      onOKButtonClick4Validation(index, item) {
        this.list[index].fieldValidations = item;
        $('#modal_validation_' + index).modal('hide');
      },

      /**
       * モーダルを閉じてデータを受け取る.
       *   プルダウン項目
       */
      onOKButtonClick4SelectOption(index, item) {
        this.list[index].selectOptionDefinitions = item;
        $('#modal_select_option_' + index).modal('hide');
      }
    },

    updated() {
    },

    mounted() {
      this.$emit('child-data', this.list)
      this.list.push({
        'id': '',
        'required': true,
        'name': '',
        'type': 2,
        'placeholder': '',
        'availableForSearch': true,
        'reportExtractField': true,
        'displayIndex': true,
        'availableForReport': true,
        'fieldValidations': [ { 'id': '', 'type': 0, 'textValue': '', 'numberValue': '' } ],
        'selectOptionDefinitions': [ { 'id': '', 'label': ''} ]
      });
    }
  }

</script>
