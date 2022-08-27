<template>
  <div class="box_search_utility" v-bind:class="{'box': tablet==null, 't_box': tablet!=null , 'margin_bottom_0': tablet==null }">
    <!-- <div class="box-header">
      <h3 class="box-title"><i class="fa fa-search"></i> 検索条件<small></small></h3>
    </div> -->
    <div class="box-header with-border box_head" v-if="tablet==null">
      <h3 class="box-title">{{title}}を検索する<small></small></h3>
    </div>
    <div class="t_box_head" v-if="tablet!=null">
      <h3 class="t_heading">検索条件</h3>
      <!-- <h3 class="box-title"><i class="fa fa-search"></i> 検索条件<small></small></h3> -->
    </div>
    <!-- /.box-header -->
    <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
    <div class="box-body no-paddin" v-if="tablet==null">
      <form class="form-horizontal" style="margin:0;" v-on:submit.prevent="search">
        <div class="box-body">
          <div class="form-group" v-for="item in sitems">
            <label v-bind:for="item.column" class="col-sm-2 control-label" v-if="item.type!='twoDateInput'">{{item.name}}</label>
            
            <div class="col-sm-10" v-if="!item.type">
              <input type="text" class="form-control" v-bind:maxlength="item.maxlength" v-bind:id="item.column" v-model="input[item.column]">
            </div>
            <div class="col-sm-10" v-if="item.type=='select'">
              <select class="form-control" v-bind:id="item.column" v-model="input[item.column]">
                <option v-bind:value="opt.value" v-for="opt in item.options">{{opt.name}}</option>
              </select>
            </div>
            <div class="col-sm-10" v-if="item.type=='isTextSelect'">
              <select class="form-control" v-bind:id="item.column" @change="isTextSelect(item.column, $event.target.value)">
                <option v-bind:value="opt.value" v-for="opt in item.options">{{opt.name}}</option>
              </select>
            </div>
            <div class="col-sm-10" v-if="item.type=='isBooleanSelect'">
              <select class="form-control" v-bind:id="item.column" @change="isBooleanSelect(item.column, $event.target.value)">
                <option v-bind:value="opt.value" v-for="opt in item.options">{{opt.name}}</option>
              </select>
            </div>

            <label class="col-sm-2 control-label" v-if="item.type=='twoDateInput'">{{item.name}}</label>
            <div class="col-sm-5" v-if="item.type=='twoDateInput'" v-for="obj in item.columns">
              <input type="date" class="form-control" v-bind:id="obj.column" v-bind:placeholder="obj.placeholder" v-model="input[obj.column]">
              <button type="button" class="btn btn-xs btn-info pull-right edgeonly" @click="input[obj.column]=''"><i class="fa fa-times-circle"></i></button>
            </div>

            <div class="col-sm-10" v-if="item.type=='oneDateInputPicker'" v-for="obj in item.columns">
              <vuejs-datepicker class="form-control date_picker date_picker_search" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="input[obj.column]"  v-bind:placeholder="obj.placeholder"></vuejs-datepicker>
              <button type="button" class="btn btn-xs btn-info pull-right edgeonly" @click="input[obj.column]=''"><i class="fa fa-times-circle"></i></button>
            </div>

            <div class="col-sm-5 input_notes_flex" v-if="item.type=='twoDateInputPicker'" v-for="(obj, index) in item.columns"> 
              <vuejs-datepicker class="form-control date_picker date_picker_search" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="input[obj.column]"  v-bind:placeholder="obj.placeholder"></vuejs-datepicker>
              <p class="input_notes_flex_text" v-if="index==0">から</p>
              <p class="input_notes_flex_text" v-else>まで</p>
            </div>
            <div class="col-sm-5" v-if="item.type=='checkbox'">
              <label v-bind:for="item.column" class="control control_checkbox">
                <input type="checkbox">
                <div class="control_indicator" style="margin-top: 0px"></div>
                <label style="font-weight: 700; margin-left: 30px; margin-right: 30px">{{item.name}}</label>
              </label>
            </div>
             <div class="col-sm-10 padding_top_7 checkbox_list" v-if="item.type=='twoCheckbox'">
              <template v-for="(column, index) in item.columns">
                <label v-bind:for="column.columnName" class="control control_checkbox">
                  <input type="checkbox" name="twoCheckbox" v-bind:id="column.column+'_'+index" :value="column.value">
                  <div class="control_indicator margin_top_0"></div>
                  <label class="search_input_checkbox" v-bind:for="column.column+'_'+index">{{column.label}}</label>
                </label>
              </template>
            </div>  
            <div class="col-sm-10 padding_top_7 checkbox_list" v-if="item.type=='multiCheckbox'">
              <template v-for="(column, index) in item.columns">
                <label v-bind:for="column.columnName" class="control control_checkbox">
                  <input type="checkbox" name="multiCheckbox" v-bind:id="column.column+'_'+index" :value="column.value">
                  <div class="control_indicator margin_top_0"></div>
                  <label class="search_input_checkbox" v-bind:for="column.column+'_'+index">{{column.label}}</label>
                </label>
              </template>
            </div>  
            <div class="col-sm-5 input_notes_flex" v-for="(obj, index) in item.columns"　v-if="item.type=='twoDateInputPickerMonth'">
              <!-- <template v-for="(obj, index) in item.columns">
                <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormatMonth" :language="language" name="datepicker" v-model="input[obj.column]" minimum-view='month'  v-bind:placeholder="obj.placeholder" v-bind:class='{margin_left_10: index!=0}'></vuejs-datepicker>
                <div class="margin_left_10 margin_top_7px" v-if="index==0">〜</div>
              </template> -->
              <vuejs-datepicker class="form-control date_picker date_picker_search" :clear-button="true" :format="DatePickerFormatMonth" :language="language" name="datepicker" v-model="input[obj.column]" minimum-view='month'  v-bind:placeholder="obj.placeholder"></vuejs-datepicker>
              <p class="input_notes_flex_text" v-if="index==0">から</p>
              <p class="input_notes_flex_text" v-else>まで</p>
            </div>
          </div>
        </div>
        <!-- /.box-body -->
        <div class="box-footer clearfix">
          <div class="no-margin text_align_center">
            <button type="submit" class="btn btn-warning global_btn">検 索</button>
          </div>
        </div>
        <!-- /.box-footer -->
      </form>
    </div>

    <div class="box-body no-paddin" v-if="tablet!=null">
      <form class="form-horizontal" style="margin:0;" onsubmit="return false;">
        <div class="box-body">
          <div class="t_form_parts t_form_parts_short" v-for="item in sitems">
            <div class="t_form_parts_title" v-if="item.type!='twoDateInput'">
              <label v-bind:for="item.column">{{item.name}}</label>
            </div>
            <div class="t_form_parts_field" v-if="!item.type">
              <input type="text" class="form-control" v-bind:maxlength="item.maxlength" v-bind:id="item.column" v-bind:placeholder="item.name" v-model="input[item.column]">
            </div>
            <div class="t_form_parts_field" v-if="item.type=='select'">
              <p></p>
              <select class="form-control _t_form_parts_content" v-bind:id="item.column" v-model="input[item.column]">
                <option v-bind:value="opt.value" v-for="opt in item.options">{{opt.name}}</option>
              </select>
            </div>
            <label class="col-sm-2 control-label" v-if="item.type=='twoDateInput'">{{item.name}}</label>
            <div class="t_form_parts_field" v-if="item.type=='twoDateInput'" v-for="obj in item.columns">
              <p></p>
              <input type="date" class="form-control" v-bind:id="obj.column" v-bind:placeholder="obj.placeholder" v-model="input[obj.column]">
              <button type="button" class="btn btn-xs btn-info pull-right edgeonly" @click="input[obj.column]=''"><i class="fa fa-times-circle"></i></button>
            </div>

            <div class="t_form_parts_field" v-if="item.type=='oneDateInputPicker'" v-for="obj in item.columns">
              <p></p>
              <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="input[obj.column]" v-bind:placeholder="obj.placeholder"></vuejs-datepicker>
              <button type="button" class="btn btn-xs btn-info pull-right edgeonly" @click="input[obj.column]=''"><i class="fa fa-times-circle"></i></button>
            </div>
            <div class="t_form_parts_field" v-if="item.type=='twoDateInputPicker' && tablet!=null">
              <p></p>
              <div class="t_form_datepicker">
                <!-- <button type="submit" class="t_form_datepicker_toggle" @click="exchangeRange(item.columns)" v-if="isRange[item.id]==true">
									<img src="../../app/assets/t_change_arrow.svg" alt="">
								</button> -->
                <div class="t_form_datepicker_body">
                  <div v-for="(obj, index) in item.columns" v-if="isRange[item.id] || index==0">
                    <vuejs-datepicker class="form-control input_date_picker _t_form_parts_content" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="input[obj.column]"  v-bind:placeholder="obj.placeholder" v-bind:class='{margin_top_30: index!=0}'></vuejs-datepicker>
                  </div>
                </div>
              </div>
              <!-- <vuejs-datepicker class="form-control input_date_picker input-lg width_225" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="input[obj.column]"  v-bind:placeholder="obj.placeholder" v-bind:class='{margin_left_20: index!=0}' v-for="(obj, index) in item.columns"></vuejs-datepicker> -->
            </div>
            <button class="t_form_add" v-if="item.type=='twoDateInputPicker' && tablet!=null && (isRange[item.id]==false || isRange[item.id]==undefined)" @click="searchRange(item.id)"><span class="t_form_add_icon"></span>期間の範囲を追加</button>
            <button class="t_form_add" v-if="item.type=='twoDateInputPicker' && tablet!=null && isRange[item.id]==true" @click="searchRange(item.id)"><span class="t_form_add_icon t_form_add_icon_close"></span>閉じる</button>             
          </div>
        </div>
        <!-- /.box-body -->
        <div class="box-footer clearfix">
          <div class="no-margin" style="text-align: center;">
            <button type="submit" class="btn btn-info global_btn t_main_button" @click="search">検 索</button>
          </div>
        </div>
        <!-- /.box-footer -->
      </form>
    </div>
    <!-- /.box-body -->

  </div>
  <!-- /.box -->
</template>

<script>
import moment from 'moment'

export default {
  name: "SearchInputView",
  props: {
    tablet: Object,
    param: Object,
    sitems: Array,
    onSearch2: Function
  },
  data() {
    return {
      input: {},
      error: '',
      DatePickerFormat: 'yyyy/MM/dd',
      DatePickerFormatMonth: 'yyyy/MM',
      isRange: [],
      title: '',
      language:{
        language: 'Japanese', 
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
        monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
        days: ['日', '月', '火', '水', '木', '金', '土'], 
        rtl: false, 
        ymd: 'yyyy-MM-dd', 
        yearSuffix: '年'
      },
    };
  },
  methods: {
    isErrorMessage(startDate, endDate) {
      let error = false;
      if(startDate && endDate) {
        let start = new Date(startDate);
        let end = new Date(endDate);
        if(start > end) {
          error = true;
        }
      }
      return error;
    },
    getDateError () {
      let err_msserge_list = [];
      this.error = '';

      if(this.input.startShowAt) {
        this.input.startShowAt = this.changeDateFormat(this.input.startShowAt); 
      }
      if(this.input.endShowAt) {
        this.input.endShowAt = this.changeDateFormat(this.input.endShowAt);
      }
      if(this.isErrorMessage(this.input.startShowAt, this.input.endShowAt)) {
        err_msserge_list.push('日時の入力を確認してください');
      }

      if(this.input.startCreatedAt) {
        this.input.startCreatedAt = this.changeDateFormat(this.input.startCreatedAt); 
        // start_updatedDate_error = this.dateCheck(this.input.startUpdatedAt);
      }
      if(this.input.endCreatedAt) {
        this.input.endCreatedAt = this.changeDateFormat(this.input.endCreatedAt); 
        // end_updatedDate_error = this.dateCheck(this.input.endUpdatedAt);
      }
      if(this.isErrorMessage(this.input.startCreatedAt, this.input.endCreatedAt)) {
        err_msserge_list.push('日時の入力を確認してください');
      }
      /*
      if(this.input.reportedStartAt) {
        this.input.reportedStartAt = this.changeStartDateFormat(this.input.reportedStartAt); 
      }
      if(this.input.reportedEndAt) {
        this.input.reportedEndAt = this.changeEndDateFormat(this.input.reportedEndAt); 
      }*/
      if(this.isErrorMessage(this.input.reportedStartAt, this.input.reportedEndAt)) {
        err_msserge_list.push('日時の入力を確認してください');
      }

      if(this.input.attendedStartAt) {
        this.input.attendedStartAt = this.changeDateFormat(this.input.attendedStartAt); 
      }
      if(this.input.attendedEndAt) {
        this.input.attendedEndAt = this.changeDateFormat(this.input.attendedEndAt);
      }
      if(this.input.leftStartAt) {
        this.input.leftStartAt = this.changeDateFormat(this.input.leftStartAt); 
      }
      if(this.input.leftEndAt) {
        this.input.leftEndAt = this.changeDateFormat(this.input.leftEndAt);
      }
      if(this.isErrorMessage(this.input.attendedStartAt, this.input.attendedEndAt)) {
        err_msserge_list.push('出勤時間の入力を確認してください');
      }
      if(this.isErrorMessage(this.input.leftStartAt, this.input.leftEndAt)) {
        err_msserge_list.push('退勤時間の入力を確認してください');
      }

      if (err_msserge_list.length != 0) {
        return err_msserge_list.join('\n');
      } else {
        return '';
      }
    },
    getIsWildCard(str) {
      if ((str.match('_')) || (str.match('%'))) {
        return true;
      }
      return false;
    },
    getReplacedWildCard(str) {
      str = str.replace(/_/g, '\\_');
      str = str.replace(/%/g, '\\%');
      return str;
    },
    getColumnList(values) {
      var columnNameList = [];
      for (var i = 0; i < values.length; i++) {
        if (!columnNameList.some(name => name == values[i].id.substring(0, values[i].id.indexOf("_")))) {
          columnNameList.push(values[i].id.substring(0, values[i].id.indexOf("_")));
        }
      }
      return columnNameList;
    },
    getTwoCheckboxValue() {
      var values = document.getElementsByName("twoCheckbox");
      var columnNameList = [];
      if (values.length != 0) {
        var columnNameList = this.getColumnList(values);
        var checks = [];
        for (var i = 0; i < columnNameList.length; i++) {
          checks.push({"columnName": columnNameList[i], "value": []});
          for (var j = 0; j < values.length; j++) {
            if ((columnNameList[i] == values[j].id.substring(0, values[j].id.indexOf("_"))) &&  values[j].checked) {
              checks[i].value.push(values[j].value);
            }
          }
        }
        for (var i = 0; i < checks.length; i++) {
          switch(checks[i].value.length) {
            case 0:
              this.input[checks[i].columnName] = {};
              break;
            case 1:
              if (checks[i].value[0] == 'true' || checks[i].value[0] == 'false') {
                this.input[checks[i].columnName] = checks[i].value[0] == 'true' ? true : false;
              } else {
                this.input[checks[i].columnName] = JSON.parse(checks[i].value[0]);
              }
              break;
            case 2:
              delete this.input[checks[i].columnName];
              break;
          }
        }
      }
    },
    getMultiCheckboxValue() {
      var values = document.getElementsByName("multiCheckbox");
      var columnNameList = [];
      if (values.length != 0) {
        var columnNameList = this.getColumnList(values);
        var checks = [];
        for (var i = 0; i < columnNameList.length; i++) {
          checks.push({"columnName": columnNameList[i], "value": []});
          for (var j = 0; j < values.length; j++) {
            if ((columnNameList[i] == values[j].id.substring(0, values[j].id.indexOf("_"))) &&  values[j].checked) {
              checks[i].value.push(values[j].value);
            }
          }
        }
        for (var i = 0; i < checks.length; i++) {
          if (checks[i].value.length != 0) {
            this.input[checks[i].columnName] = {"inq": checks[i].value};
          } else {
            this.input[checks[i].columnName] = {};
          }
        }

      }
    },
    setTwoCheckboxValue() {
      // if (JSON.parse(localStorage.getItem("search_item")) != null) {
      //   if (JSON.parse(localStorage.getItem("search_item")).notice != undefined) {
      //     return;
      //   }
      // }
      var values = document.getElementsByName("twoCheckbox");
      values.forEach(function (value){
        value.checked = true;
      });
    },
    setMultiCheckboxValue() {
      if (JSON.parse(localStorage.getItem("search_item")) != null) {
        if (localStorage.getItem("search_item").reportStatus == undefined) {
          return;
        }
      }
      var values = document.getElementsByName("multiCheckbox");
      values.forEach(function (value){
        value.checked = true;
      });
    },
    isTextSelect(column, value) {
      if (value != "") {
        this.input[column] = JSON.parse(value);
      } else {
        delete this.input[column];
      }
    },
    addSearchItem() {
      var searchItem = JSON.parse(localStorage.getItem('search_item'));
      return {"offset": searchItem.offset, "order": searchItem.order};
    },
    search() {
      this.error = this.getDateError();
      if(this.error != '') {
        return;
      }
      const p = [];
      const sitems = {};
      var queryItem = {};
      // console.log(this.addSearchItem());
      this.getTwoCheckboxValue();
      this.getMultiCheckboxValue();
      localStorage.setItem('search_item', JSON.stringify(this.input));
      this.sitems.map(sitem => sitem.columns ? [...sitem.columns] : [sitem]).forEach(e => e.forEach(item=> sitems[item.column] = item));
      for (const item in this.input) {
        if (this.input[item] === undefined || this.input[item] === '' || item === 'offset' || item === 'order') continue;
        const columnName = sitems[item].columnName || item;
        const ope = sitems[item] && sitems[item].where;
        let c = {};
        c[columnName] = {};
        if (this.input[item] == null){
          continue;
        }
        if (ope) {
          if((columnName==='attendedAt' || columnName==='reportedAt') && ope == 'gte'){
            c[columnName][ope] = this.df_utc(this.changeDateFormat(this.input[item])+ 'T00:00:00.000Z');
          } else if ((columnName==='attendedAt' || columnName==='reportedAt') && ope == 'lte'){
            c[columnName][ope] =  this.df_utc(this.changeDateFormat(this.input[item])+ 'T23:59:59.999Z');
          } else if (columnName==='reportYearMonth'){
            const ry = "reportYear";
            const rm = "reportMonth"
            const reportDt = new Date(this.input[item]);
            c[ry] = {};
            c[rm] = {};
            c[ry][ope] = reportDt.getFullYear();
            c[rm][ope] = reportDt.getMonth()+1;
          }else{
            c[columnName][ope] = this.input[item];
          }
        } else if(columnName === 'reportStatus') {
          c[columnName] = this.input[item];
        } else if(columnName === 'notice') {
          c[columnName] = this.input[item];
        } else if(columnName === 'headquartersComments') {
          c[columnName] = this.input[item];
        } else if (columnName == 'operationTypeId' && sitems[item].isQuery) {
          queryItem = {columnName: this.input[item]};
          delete c[columnName];
        } else if (this.input[item] == null) {
          c[columnName] = null;
        } else {
          const value = ('' + this.input[item]).trim().split(/[\s]+/);
          c = value.map(e => {
            const r = {};
            if (sitems[item].notlike) {
              if (columnName === 'buildingId') {
                r[columnName] = parseInt(e);
              } else {
                r[columnName] = e;
              }
            } else {
              if (this.getIsWildCard(e)) {
                r[columnName] = { like: '%' + this.getReplacedWildCard(e) + '%' }; 
              } else {
                if (columnName === 'activated' || columnName == 'prefectureId' || columnName == 'useAsReport' || columnName == 'autoCreate') {
                  r[columnName] = { eq: e }; 
                } else {
                  if (columnName == 'hasHeadquartersComment') {
                    r[columnName] = (e  == "true" ? true : false);
                  } else {
                    r[columnName] = { like: '%' + e + '%' }; 
                  }
                }
              }
            }
            return r;
          });
        }
        if (Object.keys(c).length == 0) continue;
        Array.isArray(c) ? p.push(...c) : p.push(c);
      }
      this.onSearch2(p.length ? { and: p } : null, queryItem);
    },
    dateCheck(datestr){
      datestr = datestr.replace(/-/g , '/').trim();
      if(!datestr.match(/^\d{4}\/\d{2}\/\d{2}$/)){
        return false;
      }
      return !isNaN(Date.parse(datestr));
    },
    changeDateFormat(value){
      return moment(value).format('YYYY-MM-DD');
    },
    changeStartDateFormat(value) {
      return moment(value).format('YYYY-MM-DD 00:00:00');
    },
    changeEndDateFormat(value){
      return moment(value).format('YYYY-MM-DD 23:59:59');
    },
    reverseMultiInput(input) {
      var keys = Object.keys(input);
      for (var i = 0; i < keys.length; i++) {
        if (input[keys[i]] != null) {
          if (Array.isArray(input[keys[i]].inq)) {
            var values = document.getElementsByName("multiCheckbox");
            for (var j = 0; j < values.length; j++) {
              for (var k = 0; k < input[keys[i]].inq.length; k++) {
                if (values[j].value == input[keys[i]].inq[k]) {
                  values[j].checked = true;
                }
              }
            }
          }
        }
      }
    },
    searchRange(id) {
      if (this.isRange[id] == undefined || this.isRange[id] == false) {
        this.$set(this.isRange, id, true);
      } else {
        this.$set(this.isRange, id, false);
      }
    },
    exchangeRange(columns) {
      var member1, member2;
      columns.forEach((value, index) => {
        if (index == 0) {
          member1 = value;
        } else {
          member2 = value;
        }
      })
      if (member1 != undefined && member2 != undefined) {
        var swap = this.input[member1.column];
        this.input[member1.column] = this.input[member2.column];
        this.input[member2.column] = swap;
      }
    },
    setTitle() {
      if (this.tablet == null) {
        if (this.param.title.indexOf('月次件数:')==0) {
          this.title = this.param.title.substr(5);
        } else {
          this.title = this.param.title;
        }
      }
    }
  },
  created() {
    let searchItem = localStorage.getItem('search_item');
    if (searchItem != null) {
      this.input = JSON.parse(searchItem);
    }
  },
  mounted() {
    this.setTwoCheckboxValue();
    this.setMultiCheckboxValue();
    this.reverseMultiInput(this.input);
    this.setTitle();
    this.search();
  }
}
</script>

<style>
@supports not (-ms-ime-align:auto) {
  .edgeonly {
    display: none;
  }
}
</style>
