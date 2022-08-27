<template>
  <div class="content-wrapper ts_content_wrapper">
  <loading
    :active.sync="loading"
    :can-cancel=false
    :on-cancel="onCancel"
    :is-full-page="fullpage"></loading>
  
    <!-- <section class="content-header">
      <h1>
        {{param.title}}登録
        <small></small>
      </h1>
    </section> -->
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
          <form class="form-horizontal" action="/pdf" name="report_form">
            <div class="box-body">
              <div class="form-group required form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">報告年月</label>
                </div>
                  <div class="display_flex">
                    <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="param.reportYearMonth" placeholder="YYYY/MM" minimum-view='month'></vuejs-datepicker>
                    <button type="button" class="btn btn-primary margin_left_10" @click="readReportData">読込</button>
                  </div>
              </div>
              <!-- <div class="form-group">
                <div class="no-margin pull-right">
                  <button type="button" class="btn btn-primary margin_right_20" @click="readReportData">読込</button>
                </div>
              </div> -->

              <div class="form-group form_box_group" v-if="readReportFlag">
                <div class="form_box_group_title">
                  <label class="control-label">コメント</label>
                </div>
                <div class="form_box_group_field flex_textarea">
                  <div class="flex_textarea_dummy_one" aria-hidden="true">{{item.comment}}</div>
                  <textarea id="FlexTextarea" v-model="item.comment" class="flex_textarea_monthly form-control" placeholder="※改行で複数行入力可"></textarea>
                </div>
              </div>
            </div>
          </form>
        

          <div name="report_body" v-if="readReportFlag">
            <monthly-report :param="param" :list="list" :isEdit="true"></monthly-report>
            <div class="monthly_report_tb_margin_s">
              <div class="box-body">
                <h3 class="box-title with-border">日次グラフ</h3>
              </div>

              <div v-for="(chartData, index) in this.chartDatas">
              <div v-if="chartData != null">
                <div v-if="chartData.appear">
                  <div class="box-header" v-if="chartData.header!=null">
                    <h2 class="box-title font_18 font_bold">{{chartData.header}}</h2>
                  </div>
                  <div class="box-header with-border margin_left_15">
                    <h4 class="box-title">{{chartData.label}}</h4>
                  </div>
                  <div class="overflow_auto">
                    <chart v-bind:id="'chart_'+index" v-if="chartData.type==1" :param="chartData.chartData" :width="800" class="margin_left_15"></chart>
                    <circle-chart v-if="chartData.type==2" ref="child1" :param="chartData.chartData" :width="800" class="margin_left_15 margin_top_20"></circle-chart >
                  </div>

                  <div class="form-group padding_bottom_30 margin_top_20 margin_right_m15">
                    <label class="col-sm-2 control-label margin_top_5 text-right">備考</label>
                    <div class="col-sm-10 flex_textarea">
                      <div class="flex_textarea_dummy_one" aria-hidden="true"></div>
                      <textarea id="FlexTextarea" v-model="chartData.note" class="flex_textarea_monthly form-control" placeholder="※改行で複数行入力可"></textarea>
                    </div>
                  </div>
                  <div class="box-header">
                  </div>
                </div>
                </div>
              </div>


              <div class="box-header with-border">
              </div>
            </div>

            <div>
              <monthly-report :param="scheduleParam" :list="scheduleList" :isEdit="true"></monthly-report>
            </div>

            <div class="monthly_report_tb_margin_s">
              <div class="box-body">
                <h3 class="box-title with-border">その他</h3>
              </div>
              <div class="form-group mothly_report_other_bg" v-for="(other, index) in this.otherList">
                <div class="box-body margin_left_0">
                  <div class="form-group margin_right_m15 required">
                    <label class="col-sm-2 control-label margin_top_5 to_right_btn">タイトル</label>
                    <div class="col-sm-10">
                      <input type="text" maxlength="64" class="form-control" v-model="other.title">
                    </div>
                  </div>
                  <div class="form-group margin_right_m15 margin_top_5">
                    <label class="col-sm-2 control-label margin_top_5 to_right_btn">本文</label>
                    <div class="col-sm-10 flex_textarea margin_top_5">
                      <div class="flex_textarea_dummy_one" aria-hidden="true"></div>
                      <textarea id="FlexTextarea" maxlength="512" class="flex_textarea_monthly form-control" v-model="other.body" placeholder="※改行で複数行入力可"></textarea>
                    </div>
                  </div>
                  <div class="margin_top_100 margin_right_m15">
                    <label class="col-sm-2 control-label margin_top_10 to_right_btn">写真</label>
                    <div class="col-sm-10">
                      <!-- <p>&nbsp;※ファイル容量5MB以下</p> -->
                    <!-- </div>
                    <div class="report_file_select"> -->

                      <div class="float_left padding_right_30" v-for="(image, imgIndex) in other.monthlyReportOtherImages">
                        <input v-bind:id="'file_select'+index+'_'+imgIndex" class="col-sm-8 control-label" style="display:none" type="file" accept="image/*" @change="onAddFile">
                        <div class="margin_top_5">
                          <button type="button" class="btn btn-primary" @click="onSelectFileClick(index+'_'+imgIndex)">ファイル選択</button>&nbsp;※ファイル容量5MB以下 
                        </div>
                        <div class="margin_top_5 img_div_monthly_report padding_bottom_25">
                          <img v-bind:src="getImageUrl(image)" v-bind:id="'img_source'+index+'_'+imgIndex" v-bind:class="{ img_thumbnail_monthly_report: image!=null, opacity_0: image==null}" data-toggle="modal" v-bind:data-target="'#modal'" @click="onImgClick(index+'_'+imgIndex)">
                          <button type="button" v-if="image!=null" class="btn btn-danger pull-right-top" @click="onDeleteFileClick(index+'_'+imgIndex)"><i class="fa fa-times"></i></button>
                        </div>
                      </div>
                    
                    </div>
                    <div class="box-body padding_bottom_7">
                      <button type="button" class="btn btn-danger pull-right pull-bottom" @click.stop="onTappedDeleteOther(index)"><i class="fa fa-minus"></i></button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="box-body margin_top_m10 padding_bottom_30">
                <button type="button" class="btn btn-success pull-right margin_right_m10" @click.stop="onTappedAddOther"><i class="fa fa-plus"></i></button>
              </div>
            </div>
            <div v-if="error" class="callout callout-danger err-info margin_side_15">
              <p>{{error}}</p>
            </div>
            <!-- <div class="box-footer padding_bottom_20">
              <button type="button" class="btn btn-default" onclick="window.history.back()">キャンセル</button>
              <button type="button" v-bind:disabled="uploading" class="btn btn-warning pull-right" @click="onAddButtonClick">登 録</button>
            </div> -->
            <div class="box-footer form_button_flex flex_right border_top">
              <button type="button" class="btn btn-default global_btn form_button_flex_item" onclick="window.history.back()">キャンセル</button>
              <button type="button" v-bind:disabled="uploading" class="btn btn-warning global_btn form_button_flex_item"  @click="onAddButtonClick">登録</button>
            </div>
          </div>
        </div>
      </div>
      <template>
        <modal-img-view　ref="child" :id="'modal'" :title="'拡大プレビュー'"></modal-img-view>
      </template>
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert"></modal-alert-view>
      </template>
    </section>
  </div>
</template>

<script>
  import MonthlyReport from '~/components/MonthlyReport'
  import Chart from '~/components/Chart';
  import CircleChart from '~/components/CircleChart';
  import ModalImgView from '~/components/ModalImgView';
  import ModalAlertView from '~/components/ModalAlertView';
  import Loading from 'vue-loading-overlay';
    // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';

  
  export default {
    data() {
      return {
        error: '',
        fullpage:true,
        maxMajorItemsSize: 0,
        loadedMajorItemSize: 0,
        readReportFlag: false,
        otherList:[],
        graphIds:[],
        headers: [],
        loading: false,
        isPreview: false,
        graphIndex: 0,
        imageIndex: null,
        uploading: false,
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
        chartDatas:[],
        chartItem:{labels:['財布','カード類','スマホ','鍵','その他???'],data: [10, 10, 10, 5, 2]},
        param: {
          columns: [
            { name: 'その他 タイトル', nameLabel:'Other', column: 'title'},
            { name: '今後のイベント タイトル',nameLabel:'Schedules', column: 'title'},
            { name: '特記事項 タイトル',nameLabel:'Topics', column: 'notice'}
          ],
          maxlength:512,
          reportYearMonth: "",
          title: '月次報告書登録',
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
        list: [],
        scheduleList:[]
      }
    },
    components: {
      MonthlyReport,
      Chart,
      CircleChart,
      ModalImgView,
      ModalAlertView,
      Loading
    },
    methods: {
      setTitle() {
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        this.param.title = "月次報告書";
        this.param.operation = target.operation_name;
      },
      readReportData() {
        if (!this.isNoInputCheck(this.param)) {
          return;
        }

        var dateSplit = this.changeDateFormat2(this.param.reportYearMonth).split("/");
        let fromStr = dateSplit[0] +"-"+dateSplit[1]+"-01";;
        var toDate1 = new Date(fromStr); 
        toDate1 = new Date(toDate1.getFullYear(), toDate1.getMonth(), 1)
        var fromDate1 = new Date(toDate1.getFullYear(), toDate1.getMonth() + 1, 0)
        var toDate2 = new Date(toDate1.getFullYear(), toDate1.getMonth() + 1, 1)
        var fromDate2 = new Date(toDate1.getFullYear(), toDate1.getMonth() + 2, 0)
        this.param.disabledDates = {"to":toDate1,"from":fromDate1};
        this.scheduleParam.disabledDates = {"to":toDate2,"from":fromDate2};
        this.readReportFlag = true;

        this.list = [];
        this.scheduleList = [];
        this.chartDatas = [];
        this.graphIds = [];
        this.otherList = [];
        this.otherList.splice();
        this.error = '';
        if (!this.readReportFlag) {
          this.alert.title = '';
          this.alert.message = '日次データが読み込まれていません。';
          this.alert.note = '';
          this.alert.isConfirm = false;
          $('#modal_alert').modal('show')
          // alert('日次データが読み込まれていません')
          return;
        }
        var templateIds = [];
        var tempIdStrs = "";
        var templateList = JSON.parse(localStorage.getItem('template_list'));
        for (var i = 0; i < templateList.length; i++) {
          console.log("temps:"+templateList[i].operationCategoryId);
          if (templateList[i].operationCategoryId == parseInt(this.$route.params.operation_id)) {
            templateIds.push(templateList[i].templateId);
            tempIdStrs += templateList[i].templateId;
          }
        }
        // var historicalTemplates = JSON.parse(localStorage.getItem('history_templates'));
        // var setInq = historicalTemplates.filter(val => val.operationId == parseInt(this.$route.params.operation_id));
        // for (var j = 0; j < setInq.length; j++) {
        //   if (!templateIds.some(ele => ele == setInq[j].id)) {
        //     templateIds.push(setInq[j].id);
        //     tempIdStrs += ","+setInq[j].id;
        //   }
        // }
        

        let preview_api = '/monthly-reports/preview?'+'buildingId='+localStorage.getItem('buildings_id')+'&operationCategoryId='+this.$route.params.operation_id+'&reportYear='+dateSplit[0]+'&reportMonth='+dateSplit[1];
        this.req(preview_api, 'get', null, (err, res) => {
          if (err == null && res.body != null){
            let topics = res.body.topics;
            let schedules = res.body.nextMonthSchedules;
            if (topics != null){
              topics.forEach(function(obj) {
                let title = obj.topic;
                if (title != ""){
                  let startDate = new Date(obj.date);
                  this.list.push({"day":startDate,"weekday":this.getWeekDayStr(startDate),"text":title,"path":""});
                }
              }.bind(this));
              this.list.sort(function(a,b){
                if (a.day < b.day) return -1;
                if (a.day > b.day) return 1;
                return 0;
              });
            }

            if (schedules != null){
              schedules.forEach(function(obj) {
                let title = obj.title;
                let startDate = new Date(obj.startDateTime);
                let endDate = new Date(obj.endDateTime);
                var nextDate = new Date(startDate);
                while (true){
                  let addDate = new Date(nextDate);
                  this.scheduleList.push({"day":addDate,"weekday":this.getWeekDayStr(nextDate),"text":title,"path":""});
                  if (nextDate.getDate() == endDate.getDate() && nextDate.getMonth() == endDate.getMonth() && nextDate.getFullYear() == endDate.getFullYear()) {
                    break;
                  } else if ((endDate-nextDate) == 86400000 && (endDate.getHours() == 0) && (endDate.getMinutes() == 0)) {
                    break;
                  }else {
                    nextDate.setDate(nextDate.getDate()+1)

                  }
                }
              }.bind(this))
              this.scheduleList.sort(function(a,b){
                if (a.day < b.day) return -1;
                if (a.day > b.day) return 1;
                return 0;
              });
              if (this.scheduleList.length == 0) {
                this.scheduleList.push({"day":"","weekday":"","text":"","path":""});
              }

              if (this.list.length == 0) {
                this.list.push({"day":"","weekday":"","text":"","path":""});
              }

              this.otherList.push({title:'',body:'',monthlyReportOtherImages:[null]});
            }
     
            this.graphIds = res.body.graphDefinitionIds;
            this.headers = [];
            this.loading = true;
            this.maxMajorItemsSize = this.graphIds.length;
            this.loadedMajorItemSize = 0;
            this.graphIndex = 0;
            this.getGraphData();
          }
        })

        // this.list.push({"day":"2021-02-01","weekday":"月","text":"特記事項Aテスト。","path":"/select_building"+this.$route.params.operation_id+"/2"});


        // this.otherList.push({title:'〇資格関連',body:'防火管理技能者・・・・・・藤原（１１月２６・２７日受講後取得）',monthlyReportOtherImages:[null]});
       
        // this.chartDatas.push({label:"防犯警報 総件数 159件",type:1,note:" ",chartData:{labels:['1日 a','2日 火','3日 水','4日 木','5日 金','6日 土','7日 日','8日 月','9日 火','10日 水','11日 木','12日 金','13日 土','14日 日','15日 月','16日 火','17日 水','18日 木','19日 金','20日 土','21日 日','22日 月','23日 火','24日 水','25日 木','26日 金','27日 土','28日 日','29日 月','30日 火','31日 水'],data:[10, 5, 10, 2, 22, 8,4,4,5,0,2,12,5,20,2,4,5,6,0,0,0,2,4,5,1,5,12,0,1,3,2,0,20,10,11,2,4]}});
      },
      onCancel() {
      console.log('User cancelled the loader.')
      },
      setGraphHeader(){
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        this.chartDatas.forEach((chartData) => {
          reportList.forEach((job) => {
            var groups = job.majoritems;
            groups.forEach((group) => {
              if (group.reportObjectDefinitions != null) {
                group.reportObjectDefinitions.forEach((reportObjectDefinition) => {
                  if (chartData.appear != null) {
                    if (chartData.appear) {
                      if (chartData.id == reportObjectDefinition.id) {
                        if (this.headers.indexOf(group.name) == -1){
                          this.headers.push(group.name);
                          chartData.header = group.name;
                        }
                      }
                    }
                  }
                })
              }
            })
          })
        })
      },
      getGraphData(){
        if (this.graphIds.length == 0){
          return;
        }
        let graphId = this.graphIds[0];
        this.graphIds.shift();
        let graphIndex = this.graphIndex;
        var dateSplit = this.changeDateFormat2(this.param.reportYearMonth).split("/");
        let fromStr = dateSplit[0] +"-"+dateSplit[1]+"-01";;
        var dt = new Date(fromStr); 
        var toStr = new Date(dt.getFullYear(), dt.getMonth() + 1, 0)
        toStr = dateSplit[0] +"-"+dateSplit[1]+"-"+toStr.getDate();
        let graph_api = "/graphs?buildingId="+localStorage.getItem('buildings_id')+'&graphDefinitionId='+graphId+'&from='+fromStr+'&to='+toStr;
        this.req(graph_api, 'get', null, (err, res) => {
          this.loading = true;
          this.loadedMajorItemSize += 1;
          if (this.loadedMajorItemSize == this.maxMajorItemsSize){
            this.loading = false;
          }
          if (err == null && res.body != null){
            var obj = res.body;
            let chartData = obj.graphData.dataSet.data;
            let label = obj.graphData.labels;
            let total = chartData.reduce((sum, element) => sum + element, 0);
            let reportObjectDefinitionId = obj.reportObjectDefinitionId;

            if (localStorage.getItem('display_object_if_empty') != "true") {
              if (total == 0){
                this.chartDatas[graphIndex] = {id:reportObjectDefinitionId,appear:false,header:header,graphDefinitionId:graphId,label:obj.reportObjectDefinitionName+" : 総件数"+total+"件",type:obj.graphData.graphType,note:"",chartData:{labels:labels,data:chartData}};
                if (this.loadedMajorItemSize == this.maxMajorItemsSize){
                  this.setGraphHeader();
                }
                return;
              }
            }

            var graphIdList = res.body.graphDefinitionIds;
            var includeFlag = false;
            var reportList = JSON.parse(localStorage.getItem('report_list'));
            reportList.forEach((job) => {
              var groups = job.majoritems;
              groups.forEach((group) => {
                if (group.reportObjectDefinitions != null) { 
                  group.reportObjectDefinitions.forEach((reportObjectDefinition) => {
                    if (reportObjectDefinition.id == reportObjectDefinitionId) {
                      includeFlag = true;
                    }
                  });
                }
              });
            });
            if (!includeFlag){
              if (this.loadedMajorItemSize == this.maxMajorItemsSize){
                this.setGraphHeader();
              }
              return;
            }

            var header = null;
            
            if (obj.graphData.aggregationType == 2){
              var labels = [];
              label.forEach(function(obj) {
              let labelDate = new Date(obj.replaceAll("-","/"));
              labels.push(labelDate.getDate()+"日 "+this.getWeekDayStr(labelDate));
              }.bind(this));
              this.chartDatas[graphIndex] = {id:reportObjectDefinitionId,appear:true,header:header,graphDefinitionId:graphId,label:obj.reportObjectDefinitionName+" ＞ "+obj.reportFieldDefinitionName+" : 総件数"+total+"件",type:obj.graphData.graphType,note:"",chartData:{labels:labels,data:chartData}};
            }else if (obj.graphData.unitType == 1){
              var labels = [];
              label.forEach(function(obj) {
              let labelDate = new Date(obj.replaceAll("-","/"));
              labels.push(labelDate.getDate()+"日 "+this.getWeekDayStr(labelDate));
              }.bind(this));
              this.chartDatas[graphIndex] = {id:reportObjectDefinitionId,appear:true,header:header,graphDefinitionId:graphId,label:obj.reportObjectDefinitionName+" : 総件数"+total+"件",type:obj.graphData.graphType,note:"",chartData:{labels:labels,data:chartData}};
              // this.chartDatas.push({appear:true,header:header,graphDefinitionId:graphId,label:obj.reportObjectDefinitionName+" : 総件数"+total+"件",type:obj.graphData.graphType,note:"",chartData:{labels:labels,data:chartData}});
            }else{
              this.chartDatas[graphIndex] = {id:reportObjectDefinitionId,appear:true,header:header,graphDefinitionId:graphId,total: total,label:obj.reportObjectDefinitionName+" ＞ "+obj.reportFieldDefinitionName+" : 総件数"+total+"件",type:obj.graphData.graphType,note:"",chartData:{labels:label,data:chartData}};
              // this.chartDatas.push({appear:true,header:header,graphDefinitionId:graphId,total: total,label:obj.reportObjectDefinitionName+" ＞ "+obj.reportFieldDefinitionName+" : 総件数"+total+"件",type:obj.graphData.graphType,note:"",chartData:{labels:label,data:chartData}});
            }
            // this.getGraphData()
          }
          if (this.loadedMajorItemSize == this.maxMajorItemsSize){
            this.setGraphHeader();
          }
        })
        this.graphIndex += 1;
        this.getGraphData();
      },
      onAddButtonClick() {
        this.error = ''

        var dateSplit = this.changeDateFormat2(this.param.reportYearMonth).split("/");
        var count_cond = {
          and:[
            {reportYear: dateSplit[0]},
            {reportMonth: dateSplit[1]},
            {operationCategoryId: parseInt(this.$route.params.operation_id)},
            {buildingId:  parseInt(localStorage.getItem('buildings_id'))}
          ]
        };
        this.onCount('/monthly-reports', count_cond, (res) => {
          if (res.count > 0) {
            this.error = 'この年月の'+this.param.title + 'は既に登録されています';
            return;
          } else {
            this.addRequest();
          }
        })
      },
      addRequest(){
        var dateSplit = this.changeDateFormat2(this.param.reportYearMonth).split("/");
        var monthlyReportTopics = [];
        var errorMessage = null;
        this.list.forEach(function(obj) {
          if (obj != null){
            if (obj.day != null && obj.day != ""){
              monthlyReportTopics.push({ reportDate:dateSplit[0] +"-"+dateSplit[1]+"-"+('0' + obj.day.getDate()).slice(-2), notice: obj.text, index: 0})
            }else{
              if (obj.text != null && obj.text != ""){
                errorMessage = "特記事項:日付が入力されていません。";
              }
            }
          }
        })
        var monthlyReportGraphs = [];
        var from = dateSplit[0] +"-"+dateSplit[1]+"-01";
        var dt = new Date(from); 
        var to = new Date(dt.getFullYear(), dt.getMonth() + 1, 0)
        to = dateSplit[0] +"-"+dateSplit[1]+"-"+to.getDate();
        this.chartDatas.forEach(function(obj) {
          monthlyReportGraphs.push({graphDefinitionId:obj.graphDefinitionId,note:obj.note,from: from, to:to});
        })
        var monthlyReportSchedules = [];
        this.scheduleList.forEach(function(obj) {
          if (obj != null){
            if (obj.day != null && obj.day != ""){
              monthlyReportSchedules.push({ scheduleDate:obj.day.getFullYear() +"-"+(('0' + (obj.day.getMonth()+1)).slice(-2))+"-"+('0' + obj.day.getDate()).slice(-2), title: obj.text, body: "" , index: 0});
            }else{
              if (obj.text == null && obj.text != ""){
                errorMessage = "今後のイベント:日付が入力されていません。";
              }
            }
          }
        })
        if (errorMessage != null) {
          this.error = errorMessage;
          return;
        }

        const otherListData = JSON.parse(JSON.stringify(this.otherList));
        for (let i=0; i<otherListData.length; i++) {
          for (let j=0; j<otherListData[i].monthlyReportOtherImages.length; j++) {
            if (otherListData[i].monthlyReportOtherImages[j] == null){
              otherListData[i].monthlyReportOtherImages.pop();
            }else{
              otherListData[i].monthlyReportOtherImages[j] = {"filePath":otherListData[i].monthlyReportOtherImages[j]};
            }
          }
          if (otherListData[i].monthlyReportOtherImages.length == 0 && otherListData[i].title == "" && otherListData[i].body == "") {
            otherListData.pop();
          }
        }

        var send_data = {
          buildingId: parseInt(localStorage.getItem('buildings_id')),
          operationCategoryId: parseInt(this.$route.params.operation_id),
          reportYear: parseInt(dateSplit[0]),
          reportMonth: parseInt(dateSplit[1]),
          comment: this.item.comment,
          reportedBy: Number(localStorage.getItem('member_id')),
          monthlyReportTopics:monthlyReportTopics,
          monthlyReportGraphs:monthlyReportGraphs,
          monthlyReportSchedules:monthlyReportSchedules,
          monthlyReportOther:otherListData
        }
        this.req(this.param.api, 'post', send_data, (err, res) => {
          if (err) {
            this.error = this.getMonthlyReportErrorMsg(res, this.param.columns)
            return;
          } else if (res.body) {
            this.$router.push('/monthly_reports/' + this.$route.params.operation_id);
          }
        })
      },
      onUpdateButton() {

      },
      isNoInputCheck(item) {
         if(!item.reportYearMonth) {
            this.alert.title = '';
            this.alert.message = '報告年月を選択してください。';
            this.alert.note = '';
            this.alert.isConfirm = false;
            $('#modal_alert').modal('show')
            // alert('報告年月を選択してください');
            return false;
          }
        return true;
      },
      flexTextarea(el) {
        const dummy = el.querySelector('.flex_textarea_dummy_one');
        if (el.querySelector('.flex_textarea_monthly') != null){
          el.querySelector('.flex_textarea_monthly').addEventListener('input', e => {
            dummy.textContent = e.target.value + '\u200b';
          })
        }
      },
      onImgClick(index){
        var images = document.getElementById("img_source"+index);
        var imgSrc = images.src
        this.$refs.child.showImage(imgSrc)
      },
      onDeleteFileClick(index){
        var indexes = index.split('_');
        if (this.otherList[indexes[0]].monthlyReportOtherImages.length == 3) {
          if (this.otherList[indexes[0]].monthlyReportOtherImages[2] == null){
            if (indexes[1] == 0) {
              var image = document.getElementById("img_source"+index);
              var newImage = document.getElementById("img_source"+indexes[0]+"_"+1);
              var src = newImage.src;
              var inputs = document.getElementById("file_select"+indexes[0]+"_"+1);
              this.otherList[indexes[0]].monthlyReportOtherImages.splice(indexes[1],1);
              newImage.src = null;
              inputs.value = "";
              image.src = src
              return;
            }
          }else{
            this.otherList[indexes[0]].monthlyReportOtherImages.push(null);
            var image1 = document.getElementById("img_source"+indexes[0]+"_"+0);
            var image2 = document.getElementById("img_source"+indexes[0]+"_"+1);
            var image3 = document.getElementById("img_source"+indexes[0]+"_"+2);
            var inputs = document.getElementById("file_select"+indexes[0]+"_"+2);
            inputs.value = "";
            if (indexes[1] == 0) {
              var src = image2.src;
              var src2 = image3.src;
              this.otherList[indexes[0]].monthlyReportOtherImages.splice(indexes[1],1);
              image3.src = null;
              image1.src = src;
              image2.src = src2;
              return;
            }else if (indexes[1] == 1) {
              var src = image3.src;
              this.otherList[indexes[0]].monthlyReportOtherImages.splice(indexes[1],1);
              image3.src = null;
              image2.src = src;
              return;
            }
          }
        }
        this.otherList[indexes[0]].monthlyReportOtherImages.splice(indexes[1],1);

        var image = document.getElementById("img_source"+index);
        image.src = null;
        var inputs = document.getElementById("file_select"+index);
        inputs.value = "";
      },
      onTappedAddOther(){
        this.otherList.push({title:'',body:'',monthlyReportOtherImages:[null]});
      },
      onTappedDeleteOther(index){
        this.otherList[index].monthlyReportOtherImages = null;
        this.otherList.splice(index,1);
      },
      onAddFile(event){
        var reader = new FileReader();
        var files = event.target.files;
        if (files[0]){
          if (files[0].size > 5000000) {
            var inputs = document.getElementById("file_select"+this.imageIndex);
            inputs.value = "";
            this.alert.title = '';
            this.alert.message = '5MB以下のファイル容量のファイルを選択してください。';
            this.alert.note = '';
            this.alert.isConfirm = false;
            $('#modal_alert').modal('show')
            // alert("5MB以下のファイル容量のファイルを選択してください");
            return
          }
        }

        var image = document.getElementById("img_source"+this.imageIndex);
        var resizeImage = new Image();
        var indexes = this.imageIndex.split('_');
        this.otherList[indexes[0]].monthlyReportOtherImages[indexes[1]] = "";
        if (this.otherList[indexes[0]].monthlyReportOtherImages.length != 3){
          if (indexes[1] == 0 && this.otherList[indexes[0]].monthlyReportOtherImages.length == 2) {
            if (this.otherList[indexes[0]].monthlyReportOtherImages[1] != null){
              this.otherList[indexes[0]].monthlyReportOtherImages.push(null);
            }
          }else{
            this.otherList[indexes[0]].monthlyReportOtherImages.push(null);
          }
        }else{
          this.otherList.splice();
        }

        this.multipartReq(
          "/files", 
          'post', 
          "monthly",
          files[0], 
          (err, res) => {
          if (err) {
            this.error = "imageError";
          } else if (res.body) {
            setTimeout(() => this.otherList[indexes[0]].monthlyReportOtherImages[indexes[1]] = res.body.fileId, 1000);
          }
        });
        reader.onload = function (event) {   
          resizeImage.onload = function (){
            this.ImgB64Resize(reader.result, resizeImage.width, resizeImage.height, 0,
              function(img_b64) {
                // Destination Image
                image.src = img_b64;
              }
            );
          }.bind(this);

          image.onload = function (){
          }; 
    
             
          image.onerror  = function (){           
            // alert('この画像は読み込めません。');  
          };
          resizeImage.src = reader.result;
          image.src = reader.result;

        }.bind(this);
        
        reader.onerror = function (){  
          // alert('このファイルは読み込めません。');  
        }
        
        if (files[0]){
          reader.readAsDataURL(files[0]);
        }
      },
      getImageUrl(fileId){
        if (fileId != null){
          if (fileId.filePath != null){
            return this.imageHeaderUrl + fileId.filePath;
          }else if (fileId != ""){
            return this.imageHeaderUrl + fileId;
          }
        }
        return "";
      },
      onSelectFileClick(index){
        //TODO recでcomponentの再描画
        // var test = "child1"
        // this.chartItem = {labels:['財布','カード類','スマホ','鍵','その他'],data: [1, 1, 1, 5, 2]};
        // this.$refs[test].reRenderChart();
        this.imageIndex = index
        document.getElementById("file_select"+index).click();
      },
      ImgB64Resize(imgB64_src, width, height, rotate, callback) {
        // Image Type
        var img_type = imgB64_src.substring(5, imgB64_src.indexOf(";"));
        // Source Image
        var img = new Image();
        img.onload = function() {
        // New Canvas
        var canvas = document.createElement('canvas');
        if(rotate == 90 || rotate == 270) {
              // swap w <==> h
              canvas.width = height;
              canvas.height = width;
          } else {
              canvas.width = width;
              canvas.height = height;
          }
          // Draw (Resize)
          var ctx = canvas.getContext('2d');
          if(0 < rotate && rotate < 360) {
              ctx.rotate(rotate * Math.PI / 180);
              if(rotate == 90)
                  ctx.translate(0, -height);
              else if(rotate == 180)
                  ctx.translate(-width, -height);
              else if(rotate == 270)
                  ctx.translate(-width, 0);
          }
          ctx.drawImage(img, 0, 0, width, height);
          // Destination Image
          var imgB64_dst = canvas.toDataURL(img_type);
          callback(imgB64_dst);
        };
      img.src = imgB64_src;
    }

    },
    created() {
      const key = (parseInt(this.$route.params.operation_id) == 1) ? "Security:MonthlyReport:create" : "Cleaning:MonthlyReport:create";
      this.checkDisplayPermission(key, () => {
        this.setTitle();
        this.param.reportYearMonth = new Date();
      });
    },
    updated() {
      document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
    },
    watch: {
      param: {
        handler(val) {
          this.list = [];
          this.readReportFlag = false;
        },
        deep: true,
    }
  },
  }

</script>

<style lang="stylus" scoped>

</style>
