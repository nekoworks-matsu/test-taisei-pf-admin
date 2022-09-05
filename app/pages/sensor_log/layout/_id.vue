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
          </section>
          <!-- <div class="button_header_btn" v-if="!isRemoveAdd">
            <button type="button" class="btn btn-info global_btn" @click="onAddButton(param.list.add)"><i class="fa fa-plus"></i>&nbsp;&nbsp;登 録</button>
          </div> -->
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
              <form name="searchForm" class="form-horizontal" style="margin:0;">
                <div class="box-body">
                  <div class="form-group" v-for="form in searchForm" v-if="form.availableForSearch">
                    <label class="col-sm-2 control-label" v-if="form.type!=='cmpKeySelect'">{{form.name}}</label>
                    
                    <div class="col-sm-10" v-if="form.type=='date'">
                      <div class="majoritem_search_ui width_200">
                        <div class="date_select_btn">
                          <button type="button" class="btn btn-default btn_width50" @click="setDay(-7)"><i class="fa fa-angle-double-left"></i><span>　1週間前</span></button>
                          <button type="button" class="btn btn-default btn_width50" @click="setDay(-1)"><i class="fa fa-angle-left"></i><span>　1日前</span></button>
                        </div>
                        <div class="date_select padding_top_5">
                          <vuejs-datepicker class="form-control date_picker" :clear-button="false" :format="DatePickerFormat" :language="language" name="datepicker" id="searchDate" v-model="searchDate" v-bind:placeholder="'カレンダーから選ぶ'"></vuejs-datepicker>
                        </div>
                        <div class="date_select_btn padding_top_5">
                          <button type="button" class="btn btn-default btn_width50" @click="setDay(1)"><span>1日後　</span><i class="fa fa-angle-right"></i></button>
                          <button type="button" class="btn btn-default btn_width50" @click="setDay(7)"><span>1週間後　</span><i class="fa fa-angle-double-right"></i></button>
                        </div>
                      </div>
                    </div>

                    <div class="col-sm-10" v-if="form.type=='period'" style="float: left">
                      <div class="two_date_picker_search_start">
                        <vuejs-datepicker class="form-control two_date_picker width_200" :value="startShowAt.value" :clear-button="false" :format="DatePickerFormat" :language="language" name="datepicker" id="startShowAt" @input="inputDate($event, form.fieldIndex, form.type, true ,form.id)" v-bind:placeholder="'カレンダーから選ぶ'"></vuejs-datepicker>
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
                      <div class="two_date_picker_search_end margin_top_10">
                        <vuejs-datepicker class="form-control two_date_picker width_200" :value="endShowAt.value" :clear-button="false" :format="DatePickerFormat" :language="language" id="endShowAt" name="datepicker" @input="inputDate($event, form.fieldIndex, form.type, false ,form.id)" v-bind:placeholder="'カレンダーから選ぶ'"></vuejs-datepicker>
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
                    <div class="col-sm-10" v-if="!form.type">
                      <input type="text" class="form-control" v-bind:maxlength="form.maxlength" v-bind:id="form.column" v-model="input[form.column]">
                    </div>
                    <div class="col-sm-10" v-if="form.type=='select'">
                      <select class="form-control" v-bind:id="form.column" v-model="input[form.column]">
                        <option v-bind:value="opt.val" v-for="opt in form.options">{{opt.name}}</option>
                      </select>
                    </div>

                    <template v-if="form.type=='cmpKeySelect'">
                      {{setSearchItemLength(form.column)}}
                      <template v-for="(searchItem, i) in input[form.column]"> 
                        {{setKeyItem(form.column, i)}}
                        <label class="col-sm-2 control-label" :class="{'margin_top_40': i!=0}">{{form.name}}</label>
                        <div class="col-sm-10">
                          <div class="max_width_390" :class="[{ 'display_flex': inputIndex != 0 }, { 'margin_top_8': inputIndex != 0 }]" v-for="(item, inputIndex) in searchItem">
                            {{setKeyItemInput(form.column, i, inputIndex)}}
                            <select class="form-control search_sensor_key" :value="keyItems[i][inputIndex].type" @change="pushSelectKeys($event.target.value, i, inputIndex, form.column)">
                              <option v-bind:value="key.val" v-for="key in keys">{{key.name}}</option>
                            </select>
                            <select class="form-control search_sensor" :value="item.val" :class="{ 'margin_left_5': inputIndex != 0 }" @change="pushSelectObjects(keyItems[i][inputIndex].type, $event.target.value, i, inputIndex, form.column)" v-if="keyItems[i][inputIndex].length!==1">
                              <option v-bind:value="option.val" v-for="option in keyItems[i][inputIndex].val">{{option.name}}</option>
                            </select>
                            <!-- <span class="input-group-btn width_auto" v-if="i != 1">
                              <button type="button" class="btn btn-danger btn-flat height_max" @click="onRemoveSelectObject(i, form.column)"><i class="fa fa-minus"></i></button>
                            </span> -->
                          </div>
                          <div class="both_buttons">
                            <span class="input-group-btn width_auto padding_top_5" v-if="i !== 0">
                              <button type="button" class="btn btn-danger btn-flat height_max" @click="onRemoveSearchItems(form.column, i)"><i class="fa fa-minus"></i></button>
                            </span>
                            <span class="input-group-btn width_auto padding_top_5 flex_right_side">
                              <button type="button" class="btn btn-success btn-flat height_max" @click="onCopySearchItems(form.column, i)"><i class="fa fa-plus"></i> 条件コピー</button>
                            </span>
                          </div>
                        </div>
                      </template>
                      <div class="col-sm-10 margin_top_10">
                        <div class="max_width_390 to_right_btn">
                          <button type="button" class="btn btn-success" @click.stop="onAddSearchItems(form.column)"><i class="fa fa-plus"></i></button>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </form>
              <div class="box-footer clearfix">
                <div class="no-margin text_align_center">
                  <button class="btn btn-warning search_button_width" @click="generateSensorData()">グラフ生成</button>
                </div>
              </div>
            </div>
            <!-- /.box-body -->

          </div>
        </template>
        <!-- <list-view @onImgClick="onImgClick" :list="items" :param="param.list" :count="count" :limit="limit" :offset="offset" :onSearch2="search2"></list-view> -->

        <graph-view :key="resetKey" :chartDatas="chartDatas" :onRemoveGraph="onRemoveGraph"></graph-view>
      </div>
    </section>
    <template>
      <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert"></modal-alert-view>
    </template>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->  
</template>
<script>
  import ListView from '~/components/ListView';
  import MonthlyReport from '~/components/MonthlyReport';
  import ModalImgView from '~/components/ModalImgView';
  import { event } from "~/plugins/events.js";
  import Loading from 'vue-loading-overlay';
  import moment from 'moment'
  import 'vue-loading-overlay/dist/vue-loading.css';
  import ModalAlertView from '~/components/ModalAlertView';

  import GraphView from '~/components/GraphView';
  import BarChart from '~/components/BarChart';
  import PieChart from '~/components/PieChart';
  import LineChart from '~/components/LineChart';
  import PolarAreaChart from '~/components/PolarAreaChart';
  import BubbleChart from '~/components/BubbleChart';
  import Chart from '~/components/Chart';
  import CircleChart from '~/components/CircleChart';
  import Sjcl from 'sjcl';
  // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: "https://sensor.t-spider.cloud",
        auth: "cli_Sy2KQxy2hFktaJ:CSkK2uKO4UcgqAkykQ6CwUSMAWAWY0M1XdE2VgNR",
        operationId: this.$route.params.operation_id,
        monthlyReportsId: this.$route.params._id,
        isRemoveAdd: false,
        end_hh: Number(localStorage.getItem("business_start_time").slice(0, 2)),
        end_mm: Number(localStorage.getItem("business_start_time").slice(3, 5)),
        start_hh: Number(localStorage.getItem("business_start_time").slice(0, 2)),
        start_mm: Number(localStorage.getItem("business_start_time").slice(3, 5)),
        startShowAt: {value: null},
        endShowAt: {value: null},
        searchDate: null,
        error: '',
        isOwner: false,
        fullpage: true,
        maxMajorItemsSize: 0,
        loadedMajorItemSize: 0,
        loading: true,
        graphMemo: [],
        readingFlag: true,
        readReportFlag: false,
        graphIndex: 0,
        otherList:[],
        graphIds: [],
        headers: [],
        isPreview: false,
        imageIndex: null,
        uploading: false,
        buildingId: localStorage.getItem('buildings_id'),
        floors: [{val: '', name: ''}],
        areas: [{val: '', name: ''}],
        targets:[{val: '', name: ''}],
        categories: [{val: '', name: ''}],
        tags: [{val: '', name: ''}],
        graphs: [],
        graphCnt: 0,
        resetKey: 0,
        beforeSearchItem: [],
        graphTypes: [
          {val: 'bar', name: '棒グラフ'},
          {val: 'pie', name: '円グラフ'},
          {val: 'line', name: '折れ線グラフ'},
          {val: 'polarArea', name: '鶏頭図'},
          {val: 'bubble', name: 'バブルチャート'}
        ],
        stepUnits: [
          {val: '', name: ''},
          {val: 'hour', name: '時'},
          {val: 'day', name: '日'},
          {val: 'week', name: '週'},
          {val: 'month', name: '月'},
          {val: 'year', name: '年'},
          {val: 'hour_of_day', name: '日の時間'},
          {val: 'day_of_week', name: '週の日'},
          {val: 'day_of_month', name: '月の日'},
          {val: 'month_of_year', name: '年の月'},
        ],
        names: [
          {val: 'count', name: 'カウント'},
          {val: 'battery', name: 'バッテリー'}
        ],
        methods: [
          {val: 'count', name: '集計'},
          {val: 'sum', name: '合計'},
          {val: 'avg', name: '平均'},
          {val: 'min', name: '最小'},
          {val: 'max', name: '最大'},
        ],
        keys: [
          {val: '', name: ''},
          {val: 'floor', name: 'フロア'},
          {val: 'area', name: 'エリア'},
          {val: 'category', name: 'カテゴリ'},
          {val: 'target', name: '対象'}
        ],
        include: [
          'ids',
          'tagIds',
          'areaIds'
        ],
        keyItems: [
        ],
        input: {},
        item: {
          comment: "",
          memberId: 1,
        },
        alert: {
          title: 'test',
          message: '',
          note: '',
          isConfirm: false,
        },
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
        chartDatas:[],
        chartItem:{labels:['財布','カード類','スマホ','鍵','その他???'],data: [10, 10, 10, 5, 2]},
        searchForm: [],
        param: {
          columns: [],
          mm_op:[],
          hh_op:[],
          maxlength:512,
          reportYearMonth: this.$route.params.year ? this.$route.params.year + '-' + this.$route.params.month : undefined,
          operation: '清掃業務',
          title: 'センサーログ',
          contentTitle: '特記事項',
          cb: this.updateView,
          api: '/monthly-reports',
          icon: 'fa-user',
          success: '/monthly-reports/' + this.$route.params.operation_id,
          columnName: ['日','曜日','特記事項']
        },
        scheduleParam: {
          contentTitle: '今後のイベント',
          columnName: ['日','曜日','イベント'],
          maxlength:64
        },
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
        list: [],
        scheduleList:[],
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0
                }
              }
            ]
          }
        },
        chartTestData: {}
      }
    },
    components: {
      MonthlyReport,
      BarChart,
      PieChart,
      LineChart,
      PolarAreaChart,
      BubbleChart,
      Chart,
      CircleChart,
      ModalImgView,
      ModalAlertView,
      GraphView,
      Loading,
      Sjcl
    },
    methods: {
      init() {
        // this.getFloorRequest();
        this.getTagListRequest();
      },
      setParam() {
        if (this.$route.params.id == 1) {
          this.param.title = 'センサーログ(時間)';
          this.searchForm = [
            { name: '集計数', column: 'step', type: 'number', availableForSearch: false },
            { name: '集計単位', column: 'stepUnit', type: 'select', options: this.stepUnits, availableForSearch: false },
            { name: '開始時間', column: 'since', type: 'datetime', date:"", hour:"", minute:"", availableForSearch: false },
            { name: '終了時間', column: 'until', type: 'datetime' , date:"", hour:"", minute:"", availableForSearch: false },
            { name: '期間', column: 'period', type: 'period' , date:"", hour:"", minute:"", availableForSearch: true },
            { name: '集計対象', column: 'name', type: 'unUsed', options: this.names, required: true, availableForSearch: false },
            { name: '集計方式', column: 'method', type: 'unUsed', options: this.methods, required: true, availableForSearch: false },
            { name: 'フロア', column: 'floorId', type: 'select', options: this.floors, availableForSearch: false },
            { name: 'エリア', column: 'area', type: 'select', options: this.areas, availableForSearch: false },
            { name: '検索条件', column: 'searchs', type: 'cmpKeySelect', options: [], availableForSearch: true }
          ];
        } else if (this.$route.params.id == 2) {
          this.param.title = 'センサーログ(日付)';
          this.searchForm = [
            { name: '集計数', column: 'step', type: 'number', availableForSearch: false },
            { name: '集計単位', column: 'stepUnit', type: 'select', options: this.stepUnits, availableForSearch: false },
            { name: '開始時間', column: 'since', type: 'datetime', date:"", hour:"", minute:"", availableForSearch: false },
            { name: '終了時間', column: 'until', type: 'datetime' , date:"", hour:"", minute:"", availableForSearch: false },
            { name: '期間', column: 'period', type: 'period' , date:"", hour:"", minute:"", availableForSearch: true },
            { name: '集計対象', column: 'name', type: 'unUsed', options: this.names, required: true, availableForSearch: false },
            { name: '集計方式', column: 'method', type: 'unUsed', options: this.methods, required: true, availableForSearch: false },
            { name: 'フロア', column: 'floorId', type: 'select', options: this.floors, availableForSearch: false },
            { name: 'エリア', column: 'area', type: 'select', options: this.areas, availableForSearch: false },
            { name: '検索条件', column: 'searchs', type: 'cmpKeySelect', options: [], availableForSearch: true }
          ];
        }
        this.startShowAt = {value: moment(new Date()).add(-1, 'days').format()};
        this.endShowAt = {value: new Date()};

        this.param.hh_op = this.setSelectTime("hour");
        this.param.mm_op = this.setSelectTime("minute");

        this.input.name = 'count';
        this.input.method = 'sum';
      },
      setChartData() {
        this.chartDatas.push({label:"防犯警報 総件数 159件",type:1,note:" ",chartData:{labels:['1日 月','2日 火','3日 水','4日 木','5日 金','6日 土','7日 日','8日 月','9日 火','10日 水','11日 木','12日 金','13日 土','14日 日','15日 月','16日 火','17日 水','18日 木','19日 金','20日 土','21日 日','22日 月','23日 火','24日 水','25日 木','26日 金','27日 土','28日 日','29日 月','30日 火','31日 水'],data:[10, 5, 10, 2, 22, 8,4,4,5,0,2,12,5,20,2,4,5,6,0,0,0,2,4,5,1,5,12,0,1,3,2,0,20,10,11,2,4]}});
        this.chartDatas.push({label:"sample2 総件数 159件",type:1,note:" ",chartData:{labels:['1日 月','2日 火','3日 水','4日 木','5日 金','6日 土','7日 日','8日 月','9日 火','10日 水','11日 木','12日 金','13日 土','14日 日','15日 月','16日 火','17日 水','18日 木','19日 金','20日 土','21日 日','22日 月','23日 火','24日 水','25日 木','26日 金','27日 土','28日 日','29日 月','30日 火','31日 水'],data:[10, 5, 10, 2, 22, 8,4,4,5,0,2,12,5,20,2,4,5,6,0,0,0,2,4,5,1,5,12,0,1,3,2,0,20,10,11,2,4]}});
        this.chartDatas.push({label:"sample 総件数 159件",type:2,note:" ",chartData:{labels:['a', 'b', 'c', 'd', 'e', 'f', 'g'] ,data:[25, 30, 50, 14, 29, 5, 6]}});
      },
      setTestData() {
        // 複数棒グラフ
        this.chartTestData = {
          labels: ['2021年4月', '2021年5月', '2021年6月', '2021年4月', '2021年5月', '2021年6月'],
          datasets: [
            {
              label: '売上',
              data: [10, 20, 15],
              //type: 'bar',
              backgroundColor: '#4DBBAA',
              //borderColor: '#4DBBAA',
            },
            {
              label: '予算',
              data: [8, 22, 12, 8, 100, 12],
              //type: 'bar',
            },
            {
              label: '予算2',
              data: [8, 22, 12],
              //type: 'bar',
            }
          ]
        }
        this.options = {
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0
                }
              }
            ]
          }
        }
      },
      setDay(day) {
        const res = this.searchDate.getDate() + day;
        const tmp = new Date(this.searchDate);
        tmp.setDate(res);
        this.$set(this, "searchDate", tmp);
      },
      pushCmpSelectObjects(val, index, num, i, column) {
        this.graphs[index].searchItem[column][num].items[i] = val;
      },
      pushSelectKeys(type, i, inputIndex, column) {
        switch(type) {
          case 'floor':
            this.$set(this.keyItems[i], inputIndex, {type: type, val: this.floors});
            this.onResetSelectObject(i, inputIndex, column);
            break;
          case 'area':
            this.$set(this.keyItems[i], inputIndex, {type: type, val: this.areas});
            this.onResetSelectObject(i, inputIndex, column);
            break;
          case 'category':
            this.$set(this.keyItems[i], inputIndex, {type: type, val: this.categories});
            this.onResetSelectObject(i, inputIndex, column);
            break;
          case 'target':
            this.$set(this.keyItems[i], inputIndex, {type: type, val: this.targets});
            this.onResetSelectObject(i, inputIndex, column);
            break;
          case '':
            this.onRemoveSelectObject(i, inputIndex, column);
            this.onRemoveKeysObject(i, inputIndex);
            return;
            // this.$set(this.keyItems, i, {});
            break;
          default: 
            this.$set(this.keyItems[i], inputIndex, {type: type, val: this.tags});
            break;
        }
        if (this.input[column][i] !== null && inputIndex === this.input[column][i].length - 1) {
          this.onAddSelectItemObject(column, i);
        }
      },
      pushSelectObjects(key, val, i, inputIndex, column) {
        this.input[column][i].splice(inputIndex, 1, {key: key, val: val});
      },
      setSearchItemLength(column) {
        if (this.input[column] == undefined) {
          this.$set(this.input, column, [[null]])
        }
      },
      setSearchItemsLength(index, column) {
        if (this.graphs[index].searchItem[column] == undefined) {
          this.$set(this.graphs[index].searchItem, column, [{items: ['']}])
        }
      },
      setKeyItem(column, i) {
        if (this.keyItems[i] == undefined) {
          this.$set(this.keyItems, i, [null])
        }
      },
      setKeyItemInput(column, i, inputIndex) {
        if (this.keyItems[i][inputIndex] == undefined) {
          this.$set(this.keyItems[i], inputIndex, [null])
        }
      },
      onAddCmpSelectObject(searchItem) {
        searchItem.items.push('');
      },
      onRemoveCmpSelectObject(item, i) {
        item.items.splice(i, 1)
      },
      onAddCmpSelectObjects(index, column) {
        this.graphs[index].searchItem[column].push({items: ['']});
      },
      onRemoveCmpSelectObjects(index, i, column) {
        this.graphs[index].searchItem[column].splice(i, 1);
      },
      onAddSearchItems(column) {
        this.input[column].push([null]);
      },
      onRemoveSearchItems(column, i) {
        this.input[column].splice(i, 1);
        this.keyItems.splice(i, 1);
      },
      onCopySearchItems(column, i) {
        this.input[column].push(this.input[column][i].concat());
        this.keyItems.push(this.keyItems[i].concat());
      },
      onAddSelectItemObject(column, i) {
        this.input[column][i].push(null);
      },
      onRemoveSelectObject(i, inputIndex, column) {
        this.input[column][i].splice(inputIndex, 1);
      },
      onResetSelectObject(i, inputIndex, column) {
        this.input[column][i].splice(inputIndex, 1, '');
      },
      onRemoveKeysObject(i, inputIndex) {
        this.keyItems[i].splice(inputIndex, 1);
      },
      onAddGraph() {
        this.graphs.push({id: this.graphs[this.graphs.length - 1].id + 1, searchItem: {name: "count", method: "sum"}, val: 'bar'})
      },
      onRemoveGraph(id) {
        var find = this.chartDatas.findIndex(val => val.id == id);
        this.chartDatas.splice(find, 1);
        this.resetKey++;
      },
      getDoubleDigestNumber(number) {
        if ((number == null || number == "") && number != 0){
          return number;
        } 
        return ("00" + number).slice(-2)
      },
      timeEncode(time) {
        time = time.replace(/:/g, '%3A');
        time = time.replace(/\+/g, '%2B');
        return time;
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
      getSensorRequest(searchItem) {
        var query = '?buildingId=' + this.buildingId;
        if (searchItem.step) {
          query == '' ? query += '?step=' + searchItem.step : query += '&step=' + searchItem.step;
        }
        this.$route.params.id == 1 ? searchItem.stepUnit = 'hour' : searchItem.stepUnit = 'day';
        if (searchItem.stepUnit) {
          query == '' ? query += '?stepUnit=' + searchItem.stepUnit : query += '&stepUnit=' + searchItem.stepUnit;
        }
        if (this.searchDate != null) {
          var since = this.changeDateFormat(this.searchDate) + "T" + this.getDoubleDigestNumber("00") + ":" + this.getDoubleDigestNumber("00") + ":00.000+09:00";
          var until = this.changeDateFormat(this.searchDate) + "T" + this.getDoubleDigestNumber("23") + ":" + this.getDoubleDigestNumber("59") + ":00.000+09:00";
          query == '' ? query += '?time.since=' + this.timeEncode(since) + '&time.until=' + this.timeEncode(until) : query += '&time.since=' + this.timeEncode(since) + '&time.until=' + this.timeEncode(until);
        }
        if (this.startShowAt.value != null) {
          var time = this.timeDataFormat(this.startShowAt.value, this.start_hh, this.start_mm);
          query == '' ? query += '?time.since=' + this.timeEncode(time) : query += '&time.since=' + this.timeEncode(time);
        }
        if (this.endShowAt.value != null) {
          var time = this.timeDataFormat(this.endShowAt.value, this.end_hh, this.end_mm);
          query == '' ? query += '?time.until=' + this.timeEncode(time) : query += '&time.until=' + this.timeEncode(time);
        }
        if (searchItem.since_date) {
          var hour = (searchItem.since_hour == null || searchItem.since_hour == "") ? 0 : searchItem.since_hour - 1;
          var minute = (searchItem.since_minute == null || searchItem.since_minute == "") ? 0 : searchItem.since_minute - 1;
          var time = this.changeDateFormat(searchItem.since_date) + "T" + this.getDoubleDigestNumber(hour) + ":" + this.getDoubleDigestNumber(minute) + ":00.000+09:00";
          query == '' ? query += '?time.since=' + this.timeEncode(time) : query += '&time.since=' + this.timeEncode(time);
        }
        if (searchItem.until_date) {
          var hour = (searchItem.until_hour == null || searchItem.until_hour == "") ? 0 : searchItem.until_hour - 1;
          var minute = (searchItem.until_minute == null || searchItem.until_minute == "") ? 0 : searchItem.until_minute - 1;
          var time = this.changeDateFormat(searchItem.until_date) + "T" + this.getDoubleDigestNumber(hour) + ":" + this.getDoubleDigestNumber(minute) + ":00.000+09:00";
          query == '' ? query += '?time.until=' + this.timeEncode(time) : query += '&time.until=' + this.timeEncode(time);
        }
        if (searchItem.name) {
          query == '' ? query += '?name=' + searchItem.name : query += '&name=' + searchItem.name;
        }
        if (searchItem.method) {
          query == '' ? query += '?method=' + searchItem.method : query += '&method=' + searchItem.method;
        }
        if (searchItem.floorId) {
          query == '' ? query += '?floorId=[' + searchItem.floorId : query += '&floorId=' + searchItem.floorId;
        }
        if (searchItem.area) {
          query == '' ? query += '?area=' + searchItem.area : query += '&area=' + searchItem.area;
        }
        if (searchItem.tag) {
          var tag = '';
          searchItem.tag.forEach(val => {
            if (val !== null) {
              tag == '' ? tag += val.val : tag += '%20%2B' + val.val;
            }
          })
        }
        if (tag != '') {
          query == '' ? query += '?tag=' + tag : query += '&tag=' + tag;
        }
        return '/sensorLogs/aggregate' + query;
      },
      getFloorRequest() {
        this.onSearch('/buildings/' + this.buildingId, null, null, val => {
          var sortfloors = this.sortFloors(val.floors);
          for (var floor of sortfloors) {
            if (!floor.activated) continue;
            var name = (floor.type == 2) ? 'B' + floor.name : floor.name;
            if (floor.type != 3) {
              this.floors.push({val: floor.id, name: name + 'F'})
            } else {
              this.floors.push({val: floor.id, name: name})
            }
          }
          this.getAreaRequest();
        });
      },
      getAreaRequest() {
        var that = this;
        let building = '?perPage=0&used.buildingId=' + this.buildingId;
        this.getSensorHub('/areas' + building, null, function(res) {
          res.data.forEach(val => {
            that.areas.push({val: val.name, name: val.name})
          });
          // that.getTagRequest();
          that.getTagListRequest();
        });
      },
      getTagRequest() {
        var that = this;
        let building = '?perPage=0&used.buildingId=' + this.buildingId;
        this.getSensorHub('/tags'  + building, null, function(res) {
          res.data.forEach(val => {
            that.tags.push({val: val, name: val})
          });
          that.tags.sort(function(a, b){
            if (a.val > b.val) {
              return 1;
            } else {
              return -1;
            }
          });
          that.tags.unshift({});
          that.tags.splice(-1, 1);

          // that.searchForm[9].options = that.tags;
          that.graphs.push({id: 1, searchItem: {}, val: 'bar'})
          that.setParam();
        });
      },
      setTag(key, datas) {
        datas.forEach(data => {
          switch(key) {
            case 'floor':
              this.floors.push({val: key + '%3A' + data.replace(new RegExp("^" + key + ':'), ''), name: data.replace(new RegExp("^" + key + ':'), '')})
              break;
            case 'area':
              this.areas.push({val: key + '%3A' + data.replace(new RegExp("^" + key + ':'), ''), name: data.replace(new RegExp("^" + key + ':'), '')});
              break;
            case 'target':
              this.targets.push({val: key + '%3A' + data.replace(new RegExp("^" + key + ':'), ''), name: data.replace(new RegExp("^" + key + ':'), '')});
              break;
            case 'category':
              this.categories.push({val: key + '%3A' + data.replace(new RegExp("^" + key + ':'), ''), name: data.replace(new RegExp("^" + key + ':'), '')});
              break;
            default:
              break;
          }
        })
      },
      getTagListRequest() {
        this.onSearch('/buildings/' + this.buildingId, null, null, val => {});
        var that = this;
        let query = '?page=1&perPage=0&used=false&asStruct=false&sort=-id';
        this.getSensorHub('/tag_choice_lists/' + this.buildingId + '/tags' + query, null, function(res) {
          that.keys.forEach(key => {
            if (key.val !== '') {
              var data = res.data.filter(val => val.match(new RegExp("^" + key.val)));
              data.sort(function(a,b){
                if(a < b) return -1;
                if(a > b) return 1;
                return 0;
              });
              that.setTag(key.val, data);
            }
          });
          that.graphs.push({id: 1, searchItem: {}, val: 'bar'})
          that.setParam();
        });
      },
      removeDisplayGraph(id) {
        var find = this.chartDatas.findIndex(val => val.id == id);
        if (find != -1) {
          this.chartDatas.splice(find, 1);
        }
      },
      getLabels(res) {
        var labels = [];
        res.forEach(data => {
          labels.push(data.x)
        })
        return labels;
      },
      makeGraphLabel(graph, cnt) {
        if (graph.searchs[cnt] === null) {
          return '指定なし'
        }
        var label = '';
        graph.searchs[cnt].forEach(search => {
          if (search != null && search != '') {
            if (label !== '') {
              label += ', ';
            }
            label += search.val.substring(search.val.indexOf('%3A') + 3);
          } else if (label == ''){
            label = '指定なし';            
          }
        });
        return label;
      },
      makeData(res, graph) {
        var datas = [];
        res.forEach(data => {
          datas.push(data[graph.method]);
        })
        return datas;
      },
      getDataSet(res, graph, cnt) {
        return {
          label: this.makeGraphLabel(graph, cnt),
          data: this.makeData(res, graph)
        }
      },
      /**
        タグの一つずつのリクエストデータ取得
      */
      getRequestData(item, tag) {
        var data = {};
        Object.assign(data, item)
        data.tag = tag;
        return data;
      },
      /**
        複数タグ選択時のリクエストデータ整形
      */
      getSensorRequestsData(searchItem) {
        var item = {};
        Object.assign(item, searchItem)
        var requests = [];
        for (var i = 0; i < searchItem.searchs.length; i++) {
          requests.push(this.getRequestData(item, searchItem.searchs[i]))
        }
        return requests;
      },
      complementEmptyData(res) {
        var startHour = (this.start_hh == null || this.start_hh == "") ? 0 : this.start_hh - 1;
        var startMinute = (this.start_mm == null || this.start_mm == "") ? 0 : this.start_mm - 1;
        var start = moment(this.changeDateFormat(this.startShowAt.value) + "T" + this.getDoubleDigestNumber(startHour) + ":" + this.getDoubleDigestNumber(startMinute) + ":00.000+09:00");
        var endHour = (this.end_hh == null || this.end_hh == "") ? 0 : this.end_hh - 1;
        var endMinute = (this.end_mm == null || this.end_mm == "") ? 0 : this.end_mm - 1;
        var end = moment(this.changeDateFormat(this.endShowAt.value) + "T" + this.getDoubleDigestNumber(endHour) + ":" + this.getDoubleDigestNumber(endMinute) + ":00.000+09:00");
        
        if ((!moment(start).isValid()) && (!moment(end).isValid())) {
          return res;
        }
        
        if (!moment(end).isValid()) {
          end = moment();
        }

        while(start.unix() <= end.unix()) {
          var find = res.find(data => data.x == start.format('YYYY-MM-DD'));
          if (find == undefined) {
            res.push({name: 'count', x: start.format('YYYY-MM-DD'), sum: '0'});
          }
          start.add(1, 'days');
        }
        res.sort(function(a, b){
          return (a.x > b.x ? 1 : -1);
        });
        return res;
      },
      /**
        比較するタグの回数センサー情報の取得リクエスト
      */
      requestsSensorHub(requests, id, input, datasets, cnt, response) {
        if (requests.length === cnt) {
          this.chartDatas.unshift({
            id: id,
            type: 'bar',
            labels: this.getLabels(response),
            datasets: datasets
          });
          this.resetKey++;
        } else {
          var requestUrl = this.getSensorRequest(requests[cnt]);
          var that = this;
          this.getSensorHub(requestUrl, input, function(res) {
            datasets.push(that.getDataSet(that.complementEmptyData(res), input, cnt));
            that.requestsSensorHub(requests, id, input, datasets, cnt+1, res);
          });
        }
      },
      /**
       * 時間整形
       */
      timeDataFormat(day, hour, minute) {
        var hh = (hour == null || hour == "") ? 0 : hour - 1;
        var mm = (minute == null || minute == "") ? 0 : minute - 1;
        return this.changeDateFormat(day) + "T" + this.getDoubleDigestNumber(hh) + ":" + this.getDoubleDigestNumber(mm) + ":00.000+09:00";
      },
      /**
       *  グラフ生成押下時
       */
      generateSensorData() {
        this.error = '';
        // this.removeDisplayGraph(input.id);
        if (!this.checkTimePeriod()) {
          return;
        }
        var requests = this.getSensorRequestsData(this.input);
        this.graphCnt++;
        this.requestsSensorHub(requests, this.graphCnt, this.input, [], 0);
      },
      /**
       * リクエスト内容の時間をチェック
       */
      checkTimePeriod() {
        var startTime = this.timeDataFormat(this.startShowAt.value, this.start_hh, this.start_mm);
        var endTime = this.timeDataFormat(this.endShowAt.value, this.end_hh, this.end_mm);
        var diff = moment(endTime).diff(moment(startTime), 'days');

        if (diff < 0) {
          this.error = '期間の入力を確認してください';
          return false;
        }
        if (this.$route.params.id == 1 && diff > 3) {
          this.error = '期間を3日以内の範囲で選択してください';
          return false;
        }
        return true;
      },
      convertErrorMessage(message) {
        if (message.indexOf('required') != -1) {
          return '必須項目です'
        }
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
      
      getErrorMessage(columns, errors) {
        var err = '';
        errors.forEach(error => {
          var column = columns.input.find(input => input.column == error.field)
          if (err != '') {
            err += '\n';
          }
          err += column.name + ' : ' + this.convertErrorMessage(error.message);
        })
        return err;
      },
      getSensorHub(path, columns, callback) {
        var request =  {url: this.api + path, method: 'GET', headers: {'accept': 'application/json'}, }
        const [clientId, secretKey] = this.auth.split(':')
        request.headers['X-TSH-Client-Id'] = clientId
        request.headers['X-TSH-Date'] = (new Date).toISOString(),
        request.headers['X-TSH-Signature'] = this.generate(request, secretKey)
        fetch(request.url, {
          headers: request.headers
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (data.errors == undefined) {
            this.error = '';
            callback(data);  
          } else {
            this.error = this.getErrorMessage(columns, data.errors)
          }
        })
        .catch(error => {
        });
      },
      generate(request, secretKey) {
        return this.sign(this.stringToSign(request), secretKey)
      },
      stringToSign(request) {
        const url = new URL(request.url)
        return [
          request.method,
          url.hostname,
          url.pathname,
          this.canonicalString(request, (url.search||'').replace(/^\?/, '')),
        ].join('\n')
      },
      canonicalString(request, querystring) {
        return [
          'X-TSH-Client-Id=' + (request.headers['X-TSH-Client-Id'] || ''),
          'X-TSH-Date=' + (request.headers['X-TSH-Date'] || ''),
          'SignatureMethod=HmacSHA256',
          'SignatureVersion=1',
          ...querystring.split('&').filter(s => s.length),
        ].sort().join('&')
      },
      sign(stringToSign, secretKey) {
        const hmac = new Sjcl.misc.hmac(Sjcl.codec.utf8String.toBits(secretKey), Sjcl.hash.sha256);
        return Sjcl.codec.hex.fromBits(hmac.encrypt(stringToSign))
      },
    },
    mounted() {
      // this.setChartData();
      //this.renderChart(chartData, options)
    },
    created() {
      this.init();
      // this.setTestData();
    },
    updated() {
      //document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
    },
    watch: {
      $route: function(to, from) {
        this.init();
      },
    },
  }
</script>

<style lang="stylus" scoped></style>
