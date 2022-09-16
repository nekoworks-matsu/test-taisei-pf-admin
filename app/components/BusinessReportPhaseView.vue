<template>
  <div>
    <ul class="accordion">
      <li>
        <button
          v-if="(0 < fieldDefinitions.length)"
          type="button"
          class="accordion__toggle"
          :class="{ 'is-active': isOpens[index] }"
          @click="handleToggle()"
        >
          <span v-text="title" />
        </button>
        <transition
          name="topSlide"
          @before-enter="beforeEnter"
          @enter="enter"
          @before-leave="beforeLeave"
          @leave="leave"
        >
          <div v-show="isOpens[index]" class="topSlide">

            <template v-for="(field, index) in fieldDefinitions">

              <!-- v-show なし -->
              <div class="form-group form_box_group" v-if="(field.businessReportDefinitionId == null)">

                <div class="form_box_group_title">
                  <label class="control-label">{{ field.group }}</label>
                </div>

                <div class="form_box_group_field" v-for="(col, index) in field.columns" v-bind:class='{ flex_textarea: (col.type == 6), vertical_layout: (col.type == 20), required: col.required }'>

                  <!-- 画面固有 業務報告書種別 workKbnForDisplayに値を設定している。値がある場合は以降の項目はv-show判定される -->
                  <select v-if="(col.type == 0 && isEdit)" class="form-control max_width_390" v-bind:id="col.id" v-model="workKbnForDisplay=fields['business_report_type'].value" @change="onSelectWorkKbn(col.id)">
                    <option v-bind:value="opt.id" v-for="opt in col.selectOptionDefinitions">{{ opt.label }}</option>
                  </select>
                  <div v-if="(col.type == 0 && !isEdit)" class="item-text">
                    {{ getNameByValue(workKbnForDisplay=fields['business_report_type'].value, col.selectOptionDefinitions) }}
                  </div>

                  <!-- テキスト, テキスト(ビル名) -->
                  <input v-if="(((col.type == 1) || (col.type == 12)) && isEdit)" type="text" v-bind:maxlength="col.maxlength" class="form-control" v-bind:id="col.id" v-model="fields[col.id].value" v-bind:placeholder="col.placeholder">
                  <div v-if="(((col.type == 1) || (col.type == 12)) && !isEdit)" class="item-text">
                    {{ getColumData(fields[col.id].value) }}
                  </div>

                  <!-- 日付 -->
                  <div v-if="(col.type == 2 && isEdit)" class="col-sm-2 max_width_200 min_width_180" style="padding-left: 0px;">
                    <vuejs-datepicker class="form-control date_picker_small" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="fields[col.id].value" v-bind:placeholder="col.placeholder"></vuejs-datepicker>
                  </div>
                  <div v-if="(col.type == 2 && isEdit)" class="col-sm-4 date_time" style="width: 220px;">
                    <select class="form-control input_hours_mm" style="width: 65px;" v-bind:id="col.id + 'hh'" v-model="fields[col.id].hours">
                      <option v-bind:value="n-1" v-for="n in 24">{{ timeConverter(n-1) }}</option>
                    </select>
                    <span class="margin_2">時</span>
                    <select class="form-control input_hours_mm" style="width: 65px;" v-bind:id="col.id + 'mm'" v-model="fields[col.id].minutes">
                      <option v-bind:value="n-1" v-for="n in 60">{{ timeConverter(n-1) }}</option>
                    </select>
                    <span class="margin_2">分</span>
                  </div>
                  <div v-if="(col.type == 2 && !isEdit)" class="item-text">
                    {{ df2(fields[col.id].value) }}
                  </div>

                  <!-- プルダウン -->
                  <select v-if="(((col.type == 4) || (col.type == 5) || (col.type == 9)) && isEdit)" class="form-control max_width_390" v-bind:id="col.id" v-model="fields[col.id].value">
                    <option v-bind:value="opt.id" v-for="opt in col.selectOptionDefinitions">{{ opt.label }}</option>
                  </select>
                  <div v-if="(((col.type == 4) || (col.type == 5) || (col.type == 9)) && !isEdit)" class="item-text">
                    {{ getNameByValue(fields[col.id].value, col.selectOptionDefinitions) }}
                  </div>

                  <!-- マルチセレクト -->
                  <div v-if="(col.type == 13 && isEdit)" v-for="(item, index) in fields[col.id].selected" class="display_flex margin_top_8 max_width_390" v-bind:id="col.id" v-model="fields[col.id].selected">
                    <select class="form-control" :value="item" @input="onMultiSelectBoxInput($event, index, fields[col.id].selected)">
                      <option v-bind:value="opt.id" v-for="opt in col.selectOptionDefinitions">{{ opt.label }}</option>
                    </select>
                    <span class="input-group-btn width_auto">
                      <button type="button" class="btn btn-danger btn-flat height_max" @click="onRemoveSelectBoxButtonClick($event, index, fields[col.id].selected)"><i class="fa fa-minus"></i></button>
                    </span>
                  </div>
                  <button v-if="(col.type == 13 && isEdit)" type="button" class="btn btn-success pull-right margin_top_8" @click="onAppendSelectBoxButtonClick($event, fields[col.id].selected)"><i class="fa fa-plus"></i></button>
                  <div v-if="(col.type == 13 && !isEdit)" v-for="(item, index) in fields[col.id].selected" class="display_flex margin_top_8">
                    <div class="item-text">
                      {{ getNameByValue(item, col.selectOptionDefinitions) }}
                    </div>
                  </div>

                  <!-- ステータスのチェックボックス：画面固有 -->
                  <div v-if="(col.type == 20 && isEdit)" class="item-text">
                    <label class="control control_checkbox">
                      <input type="checkbox" v-bind:name="col.name" v-bind:id="'checkbox_' + col.id" v-model="fields[col.id].value">
                      <div class="control_indicator"></div>
                    </label>
                  </div>
                  <div v-if="(col.type == 20 && !isEdit)" class="item-text">
                    <label class="control control_checkbox">
                      <input type="checkbox" v-bind:name="col.name" v-bind:id="'checkbox_' + col.id" v-model="fields[col.id].value" disabled>
                      <div class="control_indicator"></div>
                    </label>
                  </div>

                  <!-- テキストエリア -->
                  <div v-if="(col.type == 6 && isEdit)" class="flex_textarea_dummy" aria-hidden="true">{{fields[col.id].value}}</div>
                  <textarea v-if="(col.type == 6 && isEdit)" id="FlexTextarea" class="flex_textarea_textarea form-control" v-model="fields[col.id].value" v-bind:maxlength="col.maxlength" v-bind:placeholder="col.placeholder">{{fields[col.id].value}}</textarea>
                  <div v-if="(col.type == 6 && !isEdit)" class="item-text">
                    <span v-html="getColumData(fields[col.id].value)"></span>
                  </div>

                  <!-- 画像 -->
                  <div v-if="(col.type == 7)" class="item-text">
                    <span>※画像タブから設定・参照可能</span>
                  </div>

                </div>
              </div>

              <!-- v-show あり -->
              <div class="form-group form_box_group" v-if="(field.businessReportDefinitionId != null)" v-show="(workKbnForDisplay==field.businessReportDefinitionId)">

                <div class="form_box_group_title">
                  <label class="control-label">{{ field.group }}</label>
                </div>

                <div class="form_box_group_field" v-for="(col, index) in field.columns" v-bind:class='{ flex_textarea: col.type == 6, required: col.required }'>

                  <!-- テキスト -->
                  <input v-if="(col.type == 1 && isEdit)" type="text" v-model="fields[col.id].value" v-bind:maxlength="col.maxlength" class="form-control" v-bind:id="col.id" v-bind:placeholder="col.placeholder">
                  <div v-if="(col.type == 1 && !isEdit)" class="item-text">
                    {{ getColumData(fields[col.id].value) }}
                  </div>

                  <!-- テキストエリア -->
                  <div v-if="(col.type == 6 && isEdit)" class="flex_textarea_dummy" aria-hidden="true">{{fields[col.id].value}}</div>
                  <textarea v-if="(col.type == 6 && isEdit)" id="FlexTextarea" class="flex_textarea_textarea form-control" v-model="fields[col.id].value" v-bind:maxlength="col.maxlength" v-bind:placeholder="col.placeholder">{{fields[col.id].value}}</textarea>
                  <div v-if="(col.type == 6 && !isEdit)" class="item-text">
                    <span v-html="getColumData(fields[col.id].value)"></span>
                  </div>
                </div>
              </div>

            </template>

          </div>
        </transition>
      </li>
    </ul>
  </div>

</template>

<script>

  export default {
    name: 'BusinessReportPhaseView',
    props: {
      title: { type: String, required: true },           // アコーディオンの名称
      index: { type: Number, required: true },           // どのPhaseの情報かを識別するための情報.
      isOpens: { type: Array, required: true },          // アコーディオン開閉を制御するための情報. [false, false, false] のように保持.
      fieldDefinitions: { type: Array, required: true }, // フィールド定義.
      fields: { type: Object, required: true },          // フィールドデータ.
      isEdit: { type: Boolean, required: true },         // 登録・編集するかどうか.
    },
    data() {
      return {
        alert: {
          title: 'test',
          message: '',
          note: '',
          isConfirm: false,
        },
        error: '',
        fullpage: true,
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
        // localStorageからbusinessReportGroupDefinitionを取得
        businessReportGroupDefinition: JSON.parse(localStorage.getItem('business_report_group_definitions')).filter((v) => v.id === Number(this.$route.params.report_group_id))[0],
        workKbnForDisplay: 0, // 業務報告書種別に応じて表示する項目を切り替えるための情報
      }
    },
    components: {
    },
    computed: {
    },
    methods: {

      // マルチセレクトに関する処理
      /**
       * マルチセレクト項目を生成する.
       */
      createMultiSelectBox(column, key) {
        if (column[key] === undefined) {
          this.$set(column, key,[""]);
        }
      },
      /**
       * プルダウン項目選択時の処理.
       */
      onMultiSelectBoxInput(e, index, selected) {
        selected.splice(index, 1, e.target.value);
      },
      /**
       * プルダウン項目追加.
       */
      onAppendSelectBoxButtonClick(value, selected) {
        this.handleToggle();
        selected.push("");
        setTimeout(() => this.handleToggle(), 500);
      },
      /**
       * プルダウン項目削除.
       */
      onRemoveSelectBoxButtonClick(e, index, selected) {
        this.handleToggle();
        selected.splice(index, 1);
        setTimeout(() => this.handleToggle(), 500);
      },


      // アコーディオン開閉を制御する処理
      /**
       * メニューを開閉する.
       */
      handleToggle() {
        this.isOpens.splice(this.index, 1, !this.isOpens[this.index]);
      },
      /**
       * スライド開閉要素の高さ取得.
       */
      beforeEnter(el) { el.style.height = '0' },
      enter(el) { el.style.height = el.scrollHeight + 'px' },
      beforeLeave(el) { el.style.height = el.scrollHeight + 'px' },
      leave(el) { el.style.height = '0' },


      /**
       * リストからIDを元に名称を取得する.
       */
      getNameByValue(id, list) {
        var obj = list?.find(obj => obj.id === id);
        return (id && obj != undefined) ? obj.label : '';
      },

      /**
       * 業務報告書種別に応じて表示する項目を切り替える.
       */
      onSelectWorkKbn(id) {
        this.handleToggle();
        var selectbox = document.getElementById(id);
        switch(selectbox.value) {
          case '1': // 電気作業報告書
            this.workKbnForDisplay = 1;
            break;
          case '2': // 空調作業報告書
            this.workKbnForDisplay = 2;
            break;
          case '3': // 衛生作業報告書
            this.workKbnForDisplay = 3;
            break;
          case '4': // 防災作業報告書
            this.workKbnForDisplay = 4;
            break;
          case '5': // 建築作業報告書
            this.workKbnForDisplay = 5;
            break;
          case '5': // その他作業報告書
            this.workKbnForDisplay = 6;
            break;
          default:
            this.workKbnForDisplay = 0;
            break;
        }
        setTimeout(() => this.handleToggle(), 500);
      }

    },

    created() {
      //console.log('BusinessReportPhaseView - created');
      //console.dir(this.fieldDefinitions);
      //console.dir(this.fields);
    },

    mounted() {
      //console.log('BusinessReportPhaseView - mounted');

      // 親コンポーネントへアコーディオン開閉を制御するための情報を渡す
      this.$emit('updateOpenAccordions', this.isOpens);
    },

    updated() {
      //console.log('BusinessReportPhaseView - updated');

      // 親コンポーネントへ更新されたデータを渡す
      this.$emit('updateBusinessReportFieldsPerPhase', this.index, this.fields);
    },

  }
</script>

<style lang="stylus" scoped>
  .accordion {
    list-style: none;
    margin-left: -30px;
  }
  .accordion__toggle {
    background: #efefef;
    border: none;
    font-weight: bold;
    line-height: 2.80;
    text-align: left;
    width: 50%;
    position: relative;
    &::before,
    &::after {
      content: '';
      display: inline-block;
      width: 18px;
      height: 3px;
      background-color: #444;
      position: absolute;
      top: 50%;
      right: 22px;
    }
    &::before {
      transform: translate(0, -50%);
    }
    &::after {
      transition: all 0.3s ease-in-out;
      transform: translate(0, -50%) rotate(90deg);
    }
    &.is-active {
      width: 100%;
      &::after {
        transform: translate(0, -50%) rotate(0deg);
      }
    }
  }
  .topSlide {
    transition: height 0.3s ease-in-out;
    overflow: hidden;
    overflow-y: scroll;
  }
  .topSlide-enter-active {
    animation-duration: 0.3s;
    animation-fill-mode: both;
  }
  .topSlide-leave-active {
    animation-duration: 0.3s;
    animation-fill-mode: both;
  }
  .control_checkbox {
    position: relative;
  }
</style>
