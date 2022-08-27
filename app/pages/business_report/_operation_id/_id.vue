<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper ts_content_wrapper sidebar_scroll">
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
                <li>{{param.operation}}</li>
                <li class="current">{{param.title}}一覧</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}一覧</h1>
            <!-- <div class="pull-right" v-if="!isRemoveAdd">
            <button type="button" class="btn btn-info width_140" @click="$router.push(param.list.add)"><i class="fa fa-plus"></i>&nbsp;&nbsp;登 録</button>
          </div> -->
          </section>
          <div class="button_header_btn" v-if="!isRemoveAdd">
            <button type="button" class="btn btn-info global_btn" @click="onAddButton(param.list.add)"><i class="fa fa-plus"></i>&nbsp;&nbsp;登 録</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="box-group flex_boxgroup">
        <template>
          <div class="box margin_bottom_0 box_search_utility">
            <div class="box-header with-border box_head">
              <h3 class="box-title">{{param.title}}を検索する<small></small></h3>
            </div>
            <!-- /.box-header -->
            <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
            <div class="box-body no-paddin">
              <form name="searchForm" class="form-horizontal" style="margin:0;" v-on:submit.prevent="search" autocomplete="off">
                <div class="box-body">
                  <div class="form-group" v-for="form in searchForm" v-if="form.availableForSearch">
                    <template v-if="form.type==2">
                      <label class="col-sm-2 control-label">{{form.name}}</label>
                      <div class="col-sm-10">
                        <div>
                          <input class="checkbox_position" type="radio" name="searchRadios" id="searchRadios1" value="option1" v-model="item.radioButtonState">
                          <!-- <label class="search_type" for="searchRadios1">年月日</label> -->
                          <div class="majoritem_search_ui width_200">
                            <div class="date_select_btn">
                              <button type="button" class="btn btn-default btn_width50" @click="setDay(-7)"><i class="fa fa-angle-double-left"></i><span>　1週間前</span></button>
                              <button type="button" class="btn btn-default btn_width50" @click="setDay(-1)"><i class="fa fa-angle-left"></i><span>　1日前</span></button>
                            </div>
                            <div class="date_select padding_top_5">
                              <vuejs-datepicker class="form-control date_picker" :clear-button="false" :format="DatePickerFormat" :language="language" name="datepicker" id="searchDate" v-model="item.searchDate" v-bind:placeholder="'カレンダーから選ぶ'"></vuejs-datepicker>
                            </div>
                            <div class="date_select_btn padding_top_5">
                              <button type="button" class="btn btn-default btn_width50" @click="setDay(1)"><span>1日後　</span><i class="fa fa-angle-right"></i></button>
                              <button type="button" class="btn btn-default btn_width50" @click="setDay(7)"><span>1週間後　</span><i class="fa fa-angle-double-right"></i></button>
                            </div>
                            
                          </div>
                        </div>
                        <div class="margin_top_10">
                          <input class="checkbox_position" type="radio" name="searchRadios" id="searchRadios2" value="option2" v-model="item.radioButtonState">
                          <!-- <label class="search_type padding_top_5" for="searchRadios2">範囲</label> -->
                          <div class="majoritem_search_ui display_flex">
                            <div class="two_date_picker_search_start">
                              <vuejs-datepicker class="form-control two_date_picker width_200" :value="startShowAt.value" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" id="startShowAt" @input="inputDate($event, form.fieldIndex, form.type, true ,form.id)" v-bind:placeholder="'カレンダーから選ぶ'"></vuejs-datepicker>
                              <div class="display_flex margin_top_5">
                                <select class="form-control search_datetime" id="start_hh" v-model="start_hh" >
                                  <option v-bind:value="opt.value" v-for="opt in param.hh_op">{{opt.name}}</option>
                                </select>
                                <select class="form-control search_datetime" id="start_mm" v-model="start_mm" >
                                  <option v-bind:value="opt.value" v-for="opt in param.mm_op">{{opt.name}}</option>
                                </select>
                                <span>から</span>
                              </div>
                            </div> 
                            
                            <!-- <span class="margin_right_10 margin_top_7px">から</span> -->
                            <div class="two_date_picker_search_end margin_top_10">
                              <vuejs-datepicker class="form-control two_date_picker width_200" :value="endShowAt.value" :clear-button="true" :format="DatePickerFormat" :language="language" id="endShowAt" name="datepicker" @input="inputDate($event, form.fieldIndex, form.type, false ,form.id)" v-bind:placeholder="'カレンダーから選ぶ'"></vuejs-datepicker>
                              <div class="display_flex margin_top_5">
                                <select class="form-control search_datetime" id="end_hh" v-model="end_hh">
                                  <option v-bind:value="opt.value" v-for="opt in param.hh_op">{{opt.name}}</option>
                                </select>
                                <select class="form-control search_datetime" id="end_mm" v-model="end_mm">
                                  <option v-bind:value="opt.value" v-for="opt in param.mm_op">{{opt.name}}</option>
                                </select>
                                <span>まで</span>
                              </div>
                            </div> 
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-if="(form.type==1)||(form.type==3)||(form.type==6)">
                      <label class="col-sm-2 control-label">{{form.name}}</label>
                      <div class="col-sm-10">
                        <input type="text" class="form-control" :value="getValue(form.fieldIndex)" @input="inputSearch($event.target.value, form.fieldIndex, form.type ,form.id)">
                      </div>
                    </template>
                    <template v-if="(form.type==4)||(form.type==5)">
                      <label class="col-sm-2 control-label">{{form.name}}</label>
                      <div class="col-sm-10">
                        <select class="form-control" :value="getValue(form.fieldIndex)" @input="inputSearch($event.target.value, form.fieldIndex, form.type, form.id)">
                          <option></option>
                          <option v-bind:value="opt.id" v-for="opt in form.selectOptionDefinitions">{{opt.label}}</option>
                        </select>
                      </div>
                    </template>
                  </div>
                </div>
                <!-- /.box-body -->
                <div class="box-footer clearfix">
                  <div class="no-margin text_align_center">
                    <button type="submit" class="btn btn-warning search_button_width">検 索</button>
                  </div>
                </div>
                <!-- /.box-footer -->
              </form>
            </div>
            <!-- /.box-body -->

          </div>
        </template>
        <list-view @onImgClick="onImgClick" :list="items" :param="param.list" :count="count" :limit="limit" :offset="offset" :onSearch2="search2"></list-view>
      </div>
    </section>
    <template>
      <modal-img-view　@toDetails="toDetails"　ref="child" :id="'modal'" :title="'拡大プレビュー'" :transition="true"></modal-img-view>
    </template>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->  
</template>
<script>
import ListView from '~/components/ListView'
import ModalImgView from '~/components/ModalImgView'
import { event } from "~/plugins/events.js";
import Loading from 'vue-loading-overlay';
import moment from 'moment'
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  data() {
    return {
      isRemoveAdd: false,
      end_hh:'-1',
      end_mm:'-1',
      start_hh: Number(localStorage.getItem("business_start_time").slice(0, 2)),
      start_mm: Number(localStorage.getItem("business_start_time").slice(3, 5)),
      startShowAt: {value: new Date()},
      endShowAt:{},
      count: 0,
      limit: 20,
      where: '',
      offset: 0,
      order: [],
      error:'',
      fullpage: true,
      searchForm: '',
      imgId: 0,
      item:{
        searchDate: new Date(),
        radioButtonState: "option1",
      },
      input: {},
      components: null,
      DatePickerFormat: 'yyyy/MM/dd',
      members:[],
      language:{
        language: 'Japanese', 
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
        monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
        days: ['日', '月', '火', '水', '木', '金', '土'], 
        rtl: false, 
        ymd: 'yyyy-MM-dd', 
        yearSuffix: '年'
      },
      param: {
        // api: '/buildings/' + localStorage.getItem('buildings_id') + '/report-objects',
        api: '/business-report',
        search_field:0,
        search_label:'',
        mm_op:[],
        hh_op:[],
        search_item:{},
        title: this.getBusinessReportTitle(JSON.parse(localStorage.getItem('business_report_group_definitions'))),
        operation: this.getOperationName(JSON.parse(localStorage.getItem('report_list'))),
        list: {
          isIncludeImage: false,
          title: '検索結果',
          columns: [],
          init_val: {
            connect_type: 0
          },
          items: [],
          icon: 'fa-dot-circle-o',
          add: '/business_report/'+ this.$route.params.operation_id + '/' + this.$route.params.id +'/add/',
          read: '/business_report/' + this.$route.params.operation_id + '/' + this.$route.params.id +'/details/',
        }
      }
    }
  },
  components: {
    ListView,
    ModalImgView,
    Loading
  },
  methods: {
    onImgClick(tag){
      this.imgId = tag;
      var images = document.getElementById("img_source_"+tag);
      var imgSrc = images.src
      this.$refs.child.showImage(imgSrc)
    },
    /**
     * 日付変換(YYYY/MM/DD)
     */
    convertShowAtDate(showAt) {
      if(showAt){
        return showAt.getFullYear() + "/" +  parseInt(showAt.getMonth() + 1) + "/"+ showAt.getDate();
      } 
      return "";
    },
    /** 
     * 日付変換(YYYY/MM/DD HH:MM)
     */
    getShowAtDateTime(showAt, hh, mm, to) {
      var retShowAt;
      if (showAt) {
        retShowAt = this.convertShowAtDate(showAt) +' '+ this.convertTime(hh) + ':' + this.convertTime(mm) + ':59';
      } else if (to == "start") {
        retShowAt = '1900-01-01T09:00:00.000Z';
      } else if (to = "end") {
        retShowAt = '2999-12-31T23:59:59.999Z';
      }
      return retShowAt;
    },
    /**
     * 時間変換
     */
    convertTime(time) {
      if (time == "-1") return "00"
      if (String(time).length == 1) return "0" + time; 
      return time;
    },
    /**
     * 検索条件の入力エラーメッセージ取得
     */
    getInputShowAtError(showAt, hour, minute, isFrom) {
      let errorMessageList = [];
      if (showAt == "") {
        if ((hour != '-1') || (minute != '-1')) {
          if (isFrom) {
            errorMessageList.push('範囲(From)を入力してください');
          } else {
            errorMessageList.push('範囲(To)を入力してください');
          }
        }
      }
      if (errorMessageList.length != 0) {
        return errorMessageList.join('\n');
      }
      return errorMessageList;
    },
    /**
     * 検索条件(日付)のエラー取得
     */
    getDateError () {
      let errorMessageList = [];
      let start_createdDate_error = true;
      let end_createdDate_error = true;
      var start_hh = this.convertTime(this.start_hh);
      var start_mm = this.convertTime(this.start_mm);
      var end_hh = this.convertTime(this.end_hh);
      var end_mm = this.convertTime(this.end_mm);
      var startShowAt = this.convertShowAtDate(this.startShowAt.value);
      var endShowAt   = this.convertShowAtDate(this.endShowAt.value);
      var ret1, ret2;

      this.error = '';
      ret1 = this.getInputShowAtError(startShowAt, this.start_hh, this.start_mm, true);
      ret2 = this.getInputShowAtError(endShowAt, this.end_hh, this.end_mm, false);

      if (ret1.length != 0 || ret2.length != 0) {
        if (ret1.length != 0) errorMessageList.push(ret1);
        if (ret2.length != 0) errorMessageList.push(ret2);
        this.error = errorMessageList.join('\n');
        return this.error;
      }
      
      if (startShowAt) startShowAt = startShowAt + ' ' + start_hh + ':' + start_mm;
      if (endShowAt) endShowAt = endShowAt + ' ' + end_hh + ':' + end_mm;
    
      if(new Date(startShowAt) > new Date(endShowAt)) {
        errorMessageList.push('範囲の入力を確認してください');
        this.error = errorMessageList.join('\n');
        return this.error;
      }
      return this.error;
    },
    /**
     * 各変数を初期化
     */
    init() {
      const key = (parseInt(this.$route.params.operation_id ) == 1) ? "Security:ReportObject:search" : "Cleaning:ReportObject:search";
      // this.checkDisplayPermission(key,() => {
        this.setBusinessReportTitle();
        this.setMembers();
        this.$nextTick(function() {
          this.error = '';
          this.start_hh = Number(localStorage.getItem("business_start_time").slice(0, 2));
          this.start_mm = Number(localStorage.getItem("business_start_time").slice(3, 5));
          this.startShowAt.value = new Date();
          var endDate = moment(this.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");
          endDate = moment(endDate).add({ hours : 23, minutes : 59 });
          this.endShowAt.value = endDate.toDate();
          this.end_hh = endDate.get('hour');
          this.end_mm = endDate.get('minute');
          this.param.api = '/business-report/search-by-business-date';
          this.input = {};
          if (document.forms.searchForm.searchRadios1 != undefined) {
            this.item.radioButtonState = 'option1'
            document.forms.searchForm.searchRadios1.checked = true;
          }
          this.search();
        })
      // });
      const addKey = (parseInt(this.$route.params.operation_id ) == 1) ? "Security:ReportObject:create" : "Cleaning:ReportObject:create";
      this.isRemoveAdd = !this.checkMenuPermission(addKey);
    },
    /**
     * ビルごとのメンバー名取得
     */
    setMembers() {
      this.onSearch('/buildings/' + localStorage.getItem('buildings_id') +'/members', null, null, (val) => {
        this.members = val
      })
    },
    /**
     * whereのリクエスト内容取得
     */
    getWhere(where) {
      if (this.param.searchWhere) {
        where = where || {}
        Object.assign(where, this.param.searchWhere)
      }
      return where;
    },
    getConditionTime(start, end, search_field, api) {
      var conditions = [];
      if (api == "/business-report/search-by-business-date") {
        var startTime = moment(this.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");
        startTime = moment(startTime);
        var endTime = moment(this.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");
        endTime = moment(endTime).add(23, 'hours').add(59, 'minutes').add(59, 'seconds');
        conditions.push(
          {
            // businessReportFieldDefinitionId: search_field, 
            inputType: 2,
            innerConditions:[{ 
              searchType: 4, 
              dateValue: this.getDateRemoveMinutes(startTime) 
            }]
          },
          {
            // businessReportFieldDefinitionId: search_field, 
            inputType: 2,
            innerConditions:[{ 
              searchType: 3, 
              dateValue: this.getDateRemoveMinutes(endTime) 
            }]
          }
        );
      } else {
        conditions.push(
          {
            // businessReportFieldDefinitionId: search_field, 
            inputType: 2, 
            innerConditions:[{ 
              searchType: 4, 
              dateValue: this.getDateRemoveMinutes(this.df_utc(start))
            }]
          },
          {
            // businessReportFieldDefinitionId: search_field, 
            inputType: 2, 
            innerConditions:[{ 
              searchType: 3, 
              dateValue: this.df_utc(end) 
            }]
          }
        );
      }
      return conditions;
    },
    setConditions(api, start, end, search_field) {
      var conditions = [];
      conditions = this.getConditionTime(start, end, search_field, api);

      var keys = Object.keys(this.input);
      var innerCondition = [];
      var inputType;
      for (var i = 0; i < keys.length; i++) {
        if (this.input[keys[i]].value != "") {
          switch(this.input[keys[i]].inputType) {
            case 1:
            case 6:
              innerCondition = [{searchType: 2, textValue: "%" + this.input[keys[i]].value + "%"}];
              inputType = 1;
              break;
            case 3:
              innerCondition = [{searchType: 1, numberValue: parseInt(this.input[keys[i]].value)}];
              inputType = 3;
              break;
            case 4:
              innerCondition = [{searchType: 1, selectOptionDefinitionId: parseInt(this.input[keys[i]].value)}];
              inputType = 4;
              break;
            default:
              break;
          }
          conditions.push({
            // businessReportFieldDefinitionId: this.input[keys[i]].id, 
            inputType: inputType, 
            innerConditions: innerCondition
          });
        }
      }
      return conditions;
    },
    toDetails(){
      this.$router.push(this.param.list.read+this.imgId);
    },
    /**
     * リクエストデータ取得
     */
    getSendData(api, searchField, where, startShowAt, endShowAt, id, type, order_type, order) {
      var sendData = {
        businessReportDefinitionId: this.$route.params.id,
        businessReportFieldDefinitionId: searchField,
        order: [{ businessReportFieldDefinitionId: searchField, direction: 'DESC', inputType: 2 }],
        limit: this.limit,
        offset: this.offset
      }
      if (id != undefined && type != undefined && order_type != undefined) {
        sendData.order = [{ reportFieldDefinitionId: id, direction: order_type, inputType: type }]
      }
      if (order != undefined && order.length != 0) {
        sendData.order = order;
      }
      if (api == "/business-report/search-by-business-date") {
        // NOTE: 入力年月日
        var searchDate = moment(this.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD");
        sendData.businessDate = searchDate;
        sendData.buildingId = localStorage.getItem("buildings_id");
      } else {
        sendData.inputType = 2 //日付検索
      }
      sendData.conditions = this.setConditions(api, startShowAt, endShowAt, searchField);
      return sendData;
    },
    /**
     * リクエストデータ取得(カウント用)
     */
    getCountCondition(api, searchField, where, startShowAt, endShowAt) {
      var sendData = {
        buildingId: localStorage.getItem('buildings_id'),
        businessReportDefinitionId: this.$route.params.id,
        fieldIndex: searchField,
        inputType: 2, //日付検索
      }
     
      sendData.conditions = this.setConditions(api, startShowAt, endShowAt, searchField);
      return sendData;
    },
    /**
     * 検索結果表示項目取得
     */
    getCellList(reportFieldDefinitions) {
      var columnsList = [];
      var imageFlag = false;
      reportFieldDefinitions.forEach(function(obj) {
        if(obj.displayIndex != null ){
          var columns = { name: obj.name, column: 'column' + obj.fieldIndex, type: 'datetime', fieldIndex: obj.fieldIndex, displayIndex: obj.displayIndex, types: obj.type ,id: obj.id ,reportExtractField: obj.reportExtractField}
          if (obj.type == 4) {
            columns['selectOptionDefinitions'] = obj.selectOptionDefinitions 
          }
          if (obj.type == 7) {
            imageFlag = true;
          }
          columnsList.push(columns) 
        }
      })
      this.param.list.isIncludeImage = imageFlag;
      return columnsList;
    },
    /**
     * 検索結果変換
     */
    convertColumn(columnsList) {
      for (var cnt = 0; cnt < columnsList.length; cnt++) {
        if (columnsList[cnt].types == 2) {
          columnsList[cnt] = {
            name: columnsList[cnt].name,
            column: columnsList[cnt].column,
            fn: this.df2,
            type: 'datetime',
            fieldIndex: columnsList[cnt].fieldIndex,
            displayIndex: columnsList[cnt].displayIndex,
            types: columnsList[cnt].types,
            id: columnsList[cnt].id,
            sort: true,
            from: 'majoritem'
          } 
        } else if (columnsList[cnt].types == 4) {
          columnsList[cnt].sort = true;
          columnsList[cnt].from = 'majoritem';
        }
      }
      return columnsList;
    },
    /**
     * param設定
     */
    setParams(fileId, searchLabel, columnsList) {
      this.param.search_field = fileId;
      this.param.search_item.label = searchLabel;
      this.param.search_item.start_hh = -1;
      this.param.search_item.start_mm = -1;
      this.param.search_item.end_hh = -1;
      this.param.search_item.end_mm = -1;
      this.param.hh_op = this.setSelectTime("hour");
      this.param.mm_op = this.setSelectTime("minute");
      this.param.list.columns = columnsList;
    },
    /**
     * 時分のセレクトボックス設定
     */
    setSelectTime(type) {
      var conf = [];
      conf.push({ name: '--', value: -1 });
      var label = '';
      var cnt_num;
      if (type == 'hour') {
        cnt_num = 24;
      } else {
        cnt_num = 60;
      }
      for (var cnt = 0; cnt < cnt_num; cnt++) {
        cnt < 10 ? label = '0' + String(cnt) : label = String(cnt)
        conf.push({ name: label, value: cnt })
      }
      return conf;
    },
    /**
     * 表示項目取得
     */
    getItemList(reportObjects, columnsList, mems) {
      const item_list = [];
      let item_value = {};
      var that = this;
      reportObjects.forEach(function(report_obj) {
        item_value['id'] = report_obj.id;
        item_value['createdAt'] = report_obj.createdAt;
        item_value['updatedAt'] = report_obj.updatedAt;
        var key_name = [columnsList[0].column];
        report_obj.businessReportFields.forEach(function(reportObj) {
          columnsList.forEach(function(columnObj) {
            if (columnObj.fieldIndex != null) {
              if (reportObj.businessReportFieldDefinitionId == columnObj.id) {
                var key_name = columnObj.column;
                if (columnObj.types == 2) {
                  item_value[key_name] = reportObj.dateValue;
                } else if (columnObj.types == 3) {
                  item_value[key_name] = reportObj.numberValue;
                } else if (columnObj.types == 4) {
                  //TODO特殊
                  var selectOption = columnObj.selectOptionDefinitions.find((v) => v.id === reportObj.selectOptionDefinitionId);
                  var label = (selectOption == undefined) ? "" : selectOption.label;
                  item_value[key_name] = label;
                } else if (columnObj.types == 5 ) {
                  var member = mems.find((v) => v.id === reportObj.memberId);
                  item_value[key_name] = member.name;
                } else if (columnObj.types == 8 || columnObj.types == 9) {
                  item_value[key_name] = that.displayFloorFormat(that.getExtractFloorsData(reportObj.reportFieldFloors), null, true);
                } else {
                  item_value[key_name] = reportObj.textValue;
                }
              }
            }
          })
        })
        item_list.push(item_value);
        item_value = {};
      })
      return item_list;
    },
    setSearchForm(reportFieldDefinitions) {
      reportFieldDefinitions.sort(function(a,b){
        if(a.fieldIndex < b.fieldIndex) return -1;
        if(a.fieldIndex > b.fieldIndex) return 1;
        return 0;
      });
      this.searchForm = reportFieldDefinitions;
      this.setShowAtCondition(reportFieldDefinitions);
    },
    getSearchItem() {
      var searchItem = localStorage.getItem('search_item')
      return (searchItem !=  null) ? JSON.parse(searchItem) : {};
    },
    search(where) {
      var searchItem = this.getSearchItem();
      this.where = this.getWhere(where);
      this.offset = (searchItem.offset != null) ? searchItem.offset : 0;
      this.order = (searchItem.order != undefined) ? searchItem.order : null;
      // this.offset = 0;
      var search_field = 0;

      var start = {date: this.startShowAt, hour: this.start_hh, minute: this.start_mm};
      var end = {date: this.endShowAt, hour: this.end_hh, minute: this.end_mm}
      localStorage.setItem('search_item', JSON.stringify({api: this.param.api, date: this.item.searchDate, start: start, end: end, data: this.input}));

      this.onSearch('/business-report-definitions/' +this.$route.params.id +'/business-report-field-definitions', null, null, (val1) => {
        val1.businessReportFieldDefinitions.forEach(function(obj) {
          if (obj.reportExtractField) search_field = obj.id //検索条件フィールド
        })
        
        var send_data, count_cond = {};
        var startShowAt = this.getShowAtDateTime(this.startShowAt.value, this.start_hh, this.start_mm, "start");
        var endShowAt   = this.getShowAtDateTime(this.endShowAt.value, this.end_hh, this.end_mm, "end");
        this.error = '';
        if (this.item.radioButtonState == 'option2' ){
          if(this.getDateError() != '') return; 
        }
        
        if (this.order != null) {
          send_data = this.getSendData(this.param.api, search_field, where, startShowAt, endShowAt, undefined, undefined, undefined, this.order);
        } else {
          send_data = this.getSendData(this.param.api, search_field, where, startShowAt, endShowAt);
        }
        count_cond = this.getCountCondition(this.param.api, search_field, where, startShowAt, endShowAt);
        
        this.onSearch(this.param.api, send_data, null, (val) => {
          this.setSearchForm(val.businessReportDefinition.businessReportFieldDefinitions);
          var columns_list = this.getCellList(val.businessReportDefinition.businessReportFieldDefinitions);
          const search_item = []
          const majoritem_title = val.businessReportDefinition.name //大項目名
          var file_id = 0;
          var search_label = '';
          val.businessReportDefinition.businessReportFieldDefinitions.forEach(function(obj) {
            if(obj.displayIndex != -1 ){
              if(obj.type == 2) {
                file_id = obj.fieldIndex;
                search_label = obj.name;
              }
            }
          })
          columns_list.sort(function(a,b){
            if(a.displayIndex < b.displayIndex) return -1;
            if(a.displayIndex > b.displayIndex) return 1;
            return 0;
          });
            
          columns_list = this.convertColumn(columns_list);
          this.setParams(file_id, search_label, columns_list);
          this.items = this.getItemList(val.businessReports, columns_list, this.members);
          this.$nextTick(function() {
              this.itemsWatch && setTimeout(() => this.itemsWatch(val), 1)
            })
          })
          if (this.param.api == '/business-report/search-by-business-date') {
            // NOTE: 入力年月日
            var searchDate = moment(this.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD");
            count_cond.businessDate = searchDate;
            count_cond.buildingId = localStorage.getItem("buildings_id");
          }
          if (!this.param.list.disablePaging) {
            this.onCount(this.param.api, count_cond, (count) => {
              this.count = count.count
            })
          }
        }
      )

      // this.onSearch(this.param.api, send_data, null, (val) => {
      //   this.param.list.columns = [{name: '日時', column: 'time'}]
      //   this.items = [{time: '2022'}];
      //   console.log("foo")
      //   console.log(val)
      // })
    },
    search2(offset, id, type, order_type) {
      this.offset = offset;
      this.updateSearchItem(offset, id, type, order_type);
      this.onSearch('/business-report-definitions/' +this.$route.params.id +'/report-field-definitions', null, null, (val1) => {
        var search_field = 0
        val1.businessReportFieldDefinitions.forEach(function(obj) {
          if (obj.reportExtractField) search_field = obj.id //検索条件フィールド
        })

        var send_data;
        var startShowAt = this.getShowAtDateTime(this.startShowAt.value, this.start_hh, this.start_mm, "start");
        var endShowAt   = this.getShowAtDateTime(this.endShowAt.value, this.end_hh, this.end_mm, "end");
        this.error = '';
        if (this.item.radioButtonState == 'option2' ){
          if(this.getDateError() != '') return; 
        }
        send_data = this.getSendData(this.param.api, search_field, this.where, startShowAt, endShowAt, id, type, order_type);

        this.onSearch(this.param.api, send_data, null, (val) => {
          var columns_list = this.getCellList(val.businessReportDefinition.businessReportFieldDefinitions);
          const search_item = []
          const majoritem_title = val.reportObjectDefinition.name //大項目名
        
          var file_id = 0;
          var search_label = '';

          val.businessReportDefinition.businessReportFieldDefinitions.forEach(function(obj) {
            if(obj.displayIndex != -1 ){
              if(obj.type == 2) {
                file_id = obj.fieldIndex;
                search_label = obj.name;
              }
            }
            columns_list.sort(function(a,b){
              if(a.displayIndex < b.displayIndex) return -1;
              if(a.displayIndex > b.displayIndex) return 1;
              return 0;
            });
            if(obj.availableForSearch){
              search_field = obj.fieldIndex
              search_item.push({
                name: obj.name,
                type: 'oneDateInputPicker',
                columns: [
                  {
                    column: 'date',
                    columnName: 'date',
                    placeholder: obj.name + '（YYYY/MM/DD）',
                    type: 'date',
                    where: 'eq'
                  }
                ]
              });
            }              
          })
            
          columns_list = this.convertColumn(columns_list);
          this.setParams(file_id, search_label, columns_list);
          this.items = this.getItemList(val.reportObjects, columns_list, this.members);
          this.$nextTick(function() {
            this.itemsWatch && setTimeout(() => this.itemsWatch(val), 1)
          })
        })
      });
    },
    getBusinessReportTitle(business_report_group_definitions) {
      var find = undefined;
      for (var i = 0; i < business_report_group_definitions.length; i++) {
        find = business_report_group_definitions[i].businessReportDefinitions.find(val => val.id == this.$route.params.id)
        if (find != undefined) break;
      }
      return find.name;
    },
    getOperationName(report_list) {
      var find = report_list.find(val => val.id == this.$route.params.operation_id);
      return find.operation_name;
    },
    setBusinessReportTitle() {
      var report_list = JSON.parse(localStorage.getItem('report_list'));
      var business_report_group_definitions = JSON.parse(localStorage.getItem('business_report_group_definitions'));
      this.param.title = this.getBusinessReportTitle(business_report_group_definitions);
      this.param.operation = this.getOperationName(report_list);
    },
    setDay(day) {
      const res = this.item.searchDate.getDate() + day;
      const tmp = new Date(this.item.searchDate);
      tmp.setDate(res);
      this.$set(this.item, "searchDate", tmp);
    },
    inputDate(value, fieldIndex, type, isFrom, id) {
      if (isFrom) {
        this.startShowAt = { fieldIndex: fieldIndex, inputType: type, value: value ,id: id};
        this.start_hh = this.start_hh == -1 ? 0 : this.start_hh;
        this.start_mm = this.start_mm == -1 ? 0 : this.start_mm;

      } else {
        this.endShowAt = { fieldIndex: fieldIndex, inputType: type, value: value ,id: id};
        this.end_hh = this.end_hh == -1 ? 0 : this.end_hh;
        this.end_mm = this.end_mm == -1 ? 0 : this.end_mm;
      }
    },
    inputSearch(value, fieldIndex, type, id) {
      this.input["input" + fieldIndex] = { fieldIndex: fieldIndex, inputType: type, value: value , id: id};
    },
    isObjectEmpty(obj) {
      return !Object.keys(obj).length;
    },
    setShowAtCondition(reportFieldDefinitions) {
      for (var i = 0; i < reportFieldDefinitions.length; i++) {
        if (reportFieldDefinitions[i].availableForSearch && reportFieldDefinitions[i].type == 2) {
          if (this.isObjectEmpty(this.startShowAt)) {
            this.startShowAt = { fieldIndex: reportFieldDefinitions[i].fieldIndex, inputType: reportFieldDefinitions[i].type };
          }
          if (this.isObjectEmpty(this.endShowAt)) {
            this.endShowAt = { fieldIndex: reportFieldDefinitions[i].fieldIndex, inputType: reportFieldDefinitions[i].type };
          }
        }
      }
    },
    getValue(fieldIndex) {
      let searchItem = localStorage.getItem('search_item');
      var keys = Object.keys(this.input);
      for (var i = 0; i < keys.length; i++) {
        if (fieldIndex == this.input[keys[i]].fieldIndex) {
          return this.input[keys[i]].value;
        }
      }
    },
    setSearchItem() {
      let searchItem = localStorage.getItem('search_item');
      if (JSON.parse(searchItem) != null) {
        this.param.api = JSON.parse(searchItem).api;
        this.input = JSON.parse(searchItem).data;
        if (this.param.api == '/buildings/' + localStorage.getItem('buildings_id') + '/report-objects') {
          this.item.radioButtonState = 'option2';
          this.startShowAt = JSON.parse(searchItem).start.date;
          this.startShowAt.value = (JSON.parse(searchItem).start.date.value == undefined) ? null : new Date(JSON.parse(searchItem).start.date.value);
          this.start_hh = JSON.parse(searchItem).start.hour;
          this.start_mm = JSON.parse(searchItem).start.minute;

          this.endShowAt = JSON.parse(searchItem).start.date;
          this.endShowAt.value = (JSON.parse(searchItem).end.date.value == undefined) ? null : new Date(JSON.parse(searchItem).end.date.value);
          this.end_hh = JSON.parse(searchItem).end.hour;
          this.end_mm = JSON.parse(searchItem).end.minute;
        } else {
          this.item.radioButtonState = 'option1';
          this.item.searchDate = new Date(JSON.parse(searchItem).date);
        }
      }
    },
    onAddButton(path) {
      localStorage.removeItem('copy_majoritem');
      this.$router.push(path);
    },
    updateSearchItem(offset, id, type, order_type) {
      var searchItem = JSON.parse(localStorage.getItem('search_item'));
      searchItem['offset'] = offset;
      searchItem['order'] = [{ 'reportFieldDefinitionId': id, 'direction': order_type, 'inputType': type }];
      localStorage.setItem('search_item', JSON.stringify(searchItem));
    }
  },
  beforeDestroy() {
    event.off('search')
  },
  created() {
    const key = (parseInt(this.$route.params.operation_id ) == 1) ? "Security:ReportObject:search" : "Cleaning:ReportObject:search";
    // this.checkDisplayPermission(key,() => {
      this.param.api = '/report-objects/search-by-business-date';
      this.setBusinessReportTitle();
      this.setMembers();
      this.setSearchItem();
      var endDate = moment(this.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");
      endDate = moment(endDate).add({ hours : 23, minutes : 59 });
      this.endShowAt.value = endDate.toDate();
      this.end_hh = endDate.get('hour');
      this.end_mm = endDate.get('minute');

      this.search();
    // });
    const addKey = (parseInt(this.$route.params.operation_id ) == 1) ? "Security:ReportObject:create" : "Cleaning:ReportObject:create";
    this.isRemoveAdd = !this.checkMenuPermission(addKey);
  },
  mounted() {
    //this.init();
  },
  watch: {
    $route: function(route) {
      this.init();
    },
    item: {
      handler: function() {
        if (this.item.radioButtonState == "option1") {
          this.param.api = '/business-report/search-by-business-date';
          this.search();
        } else {
          this.param.api = '/business-report';
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="stylus" scoped></style>
