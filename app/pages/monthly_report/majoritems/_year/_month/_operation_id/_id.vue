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
                <li>データ分析</li>
                <li class="current">月次件数:{{param.title}}一覧</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">月次件数:{{param.title}}一覧</h1>
          </section>
        </div>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1>
        月次件数:{{param.title}}一覧
        <small></small>
      </h1>
    </section> -->

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <list-view :list="items" :param="param.list" :count="count" :limit="limit" :offset="offset" :onSearch2="search2" :isRemoveAdd="true"></list-view>
      </div>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->  
</template>

<script>
import ListView from '~/components/ListView'
import { event } from "~/plugins/events.js";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import moment from 'moment'

export default {
  data() {
    return {
      end_hh:'-1',
      end_mm:'-1',
      start_hh:'-1',
      start_mm:'-1',
      showAt: '',
      count: 0,
      limit: 20,
      where: '',
      offset: 0,
      error:'',
      fullpage: true,
      item:{
        searchDate: new Date(),
        radioButtonState: "option1",
      },
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
        api: '/buildings/' + localStorage.getItem('buildings_id') + '/report-objects/monthly-aggregation',
        search_field:0,
        search_label:'',
        mm_op:[],
        hh_op:[],
        search_item:{},
        title: this.getMajorItemsTitle(JSON.parse(localStorage.getItem('report_list'))),
        list: {
          title: '検索結果',
          columns: [],
          init_val: {
            connect_type: 0
          },
          items: [],
          icon: 'fa-dot-circle-o',
          add: '/majoritems/add/' + this.$route.params.id,
          // read: '/majoritems/details/' + this.$route.params.id + '/',
          read: '/majoritems/' + this.$route.params.operation_id + '/' + this.$route.params.id + '/details/',
        }
      }
    }
  },
  components: {
    ListView,
    Loading
  },
  methods: {
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
        if (to == "start") {
          retShowAt = showAt + '-01T00:00:00.000Z';
        } else if (to == "end") {
          retShowAt = showAt + '-31T23:59:59.999Z';
        }
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
      if((!showAt && (hour!='-1')) || (!showAt && (minute!='-1'))){
        if (isFrom) {
          errorMessageList.push('年月日(From)を入力してください');
        } else {
          errorMessageList.push('年月日(To)を入力してください');
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
      var startShowAt = this.convertShowAtDate(this.startShowAt);
      var endShowAt   = this.convertShowAtDate(this.endShowAt);
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
        errorMessageList.push('日時の入力を確認してください');
        this.error = errorMessageList.join('\n');
        return this.error;
      }
      return this.error;
    },
    /**
     * 各変数を初期化
     */
    init() {
      this.setMajoritemsTitle();
      this.setMembers();
      this.$nextTick(function() {
        this.error = '';
        this.startShowAt = '';
        this.endShowAt = '';
        this.end_hh = '-1';
        this.end_mm = '-1';
        this.start_mm = '-1';
        this.start_hh =　'-1';
        //this.param.api = '/report-objects/search-by-business-date';
        this.search();
      })
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
    /**
     * リクエストデータ取得
     */
    getSendData(api, searchField, yearMonth) {
      var sendData = {
        reportObjectDefinitionId: this.$route.params.id,
        year: this.$route.params.year,
        month: this.$route.params.month,
        order: [{ reportFieldDefinitionId: searchField, direction: 'DESC', inputType:2}],
        limit: this.limit,
        offset: this.offset
      }
      return sendData;
    },
    /**
     * リクエストデータ取得(カウント用)
     */
    getCountCondition(yearMonth) {
      var sendData = {
        reportObjectDefinitionId: this.$route.params.id,
        year: this.$route.params.year,
        month: this.$route.params.month,
      }
      return sendData;
    },
    /**
     * 検索結果表示項目取得
     */
    getCellList(reportFieldDefinitions) {
      var columnsList = [];
      reportFieldDefinitions.forEach(function(obj) {
        if(obj.displayIndex != null ){
          var columns = { name: obj.name, column: 'column' + obj.fieldIndex, type: 'datetime', fieldIndex: obj.fieldIndex, displayIndex: obj.displayIndex, types: obj.type, id: obj.id }
          if (obj.type == 4) {
            columns['selectOptionDefinitions'] = obj.selectOptionDefinitions 
          }
          columnsList.push(columns) 
        }
      })
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
            id: columnsList[cnt].id
          }
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
        report_obj.reportFields.forEach(function(reportObj) {
          columnsList.forEach(function(columnObj) {
            if (columnObj.fieldIndex != null) {
              if (reportObj.reportFieldDefinitionId == columnObj.id) {
                var key_name = columnObj.column;
                if (columnObj.types == 2) {
                  item_value[key_name] = reportObj.dateValue;
                } else if (columnObj.types == 3) {
                  item_value[key_name] = reportObj.numberValue;
                } else if (columnObj.types == 4) {
                  //TODO特殊
                  var selectOption = columnObj.selectOptionDefinitions.find((v) => v.id === reportObj.selectOptionDefinitionId);
                  item_value[key_name] = selectOption.label;
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
    search(where) {
      this.where = this.getWhere(where);
      this.count = 0;
      this.offset = 0;
      var search_field = 0;

      this.onSearch('/report-object-definitions/' + this.$route.params.id +'/report-field-definitions', null, null, (val1) => {
        val1.reportFieldDefinitions.forEach(function(obj) {
          if (obj.reportExtractField) search_field = obj.id //検索条件フィールド
        })
        var send_date, count_cond = {};
        var startShowAt = this.getShowAtDateTime(this.showAt, this.start_hh, this.start_mm, "start");
        var endShowAt   = this.getShowAtDateTime(this.showAt, this.end_hh, this.end_mm, "end");
        if(this.getDateError() != '') return; 
        send_date = this.getSendData(this.param.api, search_field, this.$route.query.year_month);
        count_cond = this.getCountCondition(this.$route.query.year_month);
        
        this.onSearch(this.param.api, send_date, null, (val) => {
          var columns_list = this.getCellList(val.reportObjectDefinition.reportFieldDefinitions);
          const search_item = []
          const majoritem_title = val.reportObjectDefinition.name //大項目名
          var file_id = 0;
          var search_label = '';
          val.reportObjectDefinition.reportFieldDefinitions.forEach(function(obj) {
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
          this.items = this.getItemList(val.reportObjects, columns_list, this.members);
          this.$nextTick(function() {
              this.itemsWatch && setTimeout(() => this.itemsWatch(val), 1)
            })
          })
          if (this.param.api == '/report-objects/search-by-business-date') {
            count_cond.businessDate = moment(this.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD");
            count_cond.buildingId = localStorage.getItem("buildings_id");
          }

          if (!this.param.list.disablePaging) {
            this.onCount(this.param.api, count_cond, (count) => {
              this.count = count.count
            })
          }
        }
      )
    },
    search2(offset) {
      this.offset = offset;
      var search_field = 0;

      this.onSearch('/report-object-definitions/' + this.$route.params.id +'/report-field-definitions', null, null, (val1) => {
        val1.reportFieldDefinitions.forEach(function(obj) {
          if (obj.reportExtractField) search_field = obj.id //検索条件フィールド
        })
      var send_date;
      var startShowAt = this.getShowAtDateTime(this.startShowAt, this.start_hh, this.start_mm, "start");
      var endShowAt   = this.getShowAtDateTime(this.endShowAt, this.end_hh, this.end_mm, "end");
      if(this.getDateError() != '') return; 
      send_date = this.getSendData(this.param.api, search_field, this.$route.query.year_month);

      this.onSearch(this.param.api, send_date, null, (val) => {
         var columns_list = this.getCellList(val.reportObjectDefinition.reportFieldDefinitions);
          const search_item = []
          const majoritem_title = val.reportObjectDefinition.name //大項目名
        
          var file_id = 0;
          var search_label = '';

          val.reportObjectDefinition.reportFieldDefinitions.forEach(function(obj) {
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
    })
    },
    getMajorItemsTitle(report_list) {
      for (var i = 0; i < report_list.length; i++) {
        for (var j = 0; j < report_list[i].majoritems.length; j++) {
          for (var k = 0; k < report_list[i].majoritems[j].reportObjectDefinitions.length; k++) {
            if (report_list[i].majoritems[j].reportObjectDefinitions[k].id == this.$route.params.id) {
              return report_list[i].majoritems[j].reportObjectDefinitions[k].name;
            }
          }
        }
      }
    },
    setMajoritemsTitle() {
      var report_list = JSON.parse(localStorage.getItem('report_list'));
      this.param.title = this.getMajorItemsTitle(report_list);
    },
    setDay(day) {
      const res = this.item.searchDate.getDate() + day;
      const tmp = new Date(this.item.searchDate);
      tmp.setDate(res);
      this.$set(this.item, "searchDate", tmp);
    },
  },
  
  beforeDestroy() {
    event.off('search')
  },
  created() {
    const key = "Report:Monthly:view";
    this.checkDisplayPermission(key, () => {
      this.setMajoritemsTitle();
      this.showAt = this.$route.params.year + `-` + this.$route.params.month;
      this.search();
    });
  },
  mounted() {
    this.init();
  },
  watch: {
    $route: function(route) {
      this.init();
    }
  }
}
</script>

<style lang="stylus" scoped></style>
