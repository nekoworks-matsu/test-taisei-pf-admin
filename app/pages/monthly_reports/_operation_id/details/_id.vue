<template>
  <div class="content-wrapper ts_content_wrapper">
    <loading
    :active.sync="loading"
    :can-cancel=false
    :on-cancel="onCancel"
    :is-full-page="fullpage"></loading>

    <!-- <section class="ts_content_head">
      <h1>
        {{param.title}}詳細
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-info width_140" @click="onTransitionButton('/monthly_reports/' + $route.params.operation_id + '/edit/' + $route.params.id)">編 集</button>
        </div>
      </h1>
    </section> -->
    <section class="content_head">
      <div class="ts_content_head">
        <div class="button_header">
          <section>
            <div class="ts_breadcrumb">
              <ol>
                <li>{{param.operation}}</li>
                <li>月次報告書一覧</li>
                <li class="current">月次報告書詳細</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">月次報告書詳細</h1>
          </section>
          <div class="button_header_btn">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/monthly_reports/' + $route.params.operation_id + '/edit/' + $route.params.id)">編集</button>
          </div>
        </div>
      </div>
    </section>
    <section class="content">
      <div class="box">
        <div class="box-header with-border box_head">
          <h2 class="box-title with-border">{{param.title}}情報</h2>
        </div>
        <div class="box-body no-paddin">
          <form class="form-horizontal" action="/monthly_report_pdf" name="report_form">
            <div class="box-body">
              <!--<div class="margin_bottom_30">
                <button type="button" v-bind:disabled="readingFlag" class="btn btn-primary global_btn" @click="downloadPdf">PDFダウンロード</button>
              </div> -->
              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">報告年月</label>
                </div>
                  <!-- <div class="col-sm-8">
                    <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="param.reportYearMonth" placeholder="YYYY/MM" minimum-view='month'></vuejs-datepicker>
                  </div> -->
                <div class="form_box_group_field">
                  <div class="item-text">{{dfMonth(param.reportYearMonth)}}</div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">コメント</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text"><span v-html="getColumData(item.comment)"></span></div>
                </div>
              </div>
              <!-- <div class="no-margin pull-left">
                <button type="button" v-bind:disabled="readingFlag" class="btn btn-primary" @click="downloadPdf">PDFダウンロード</button>
              </div> -->
            </div>
            <input type="hidden" name="report_title"/>
            <input type="hidden" name="token"/>
            <input type="hidden" name="reportDate"/>
            <input type="hidden" name="comment"/>
            <input type="hidden" name="topics"/>
            <input type="hidden" name="schedules"/>
            <input type="hidden" name="charts"/>
            <input type="hidden" name="images"/>
            <input type="hidden" name="others"/>
            <input type="hidden" name="buildingName"/>
            <input type="hidden" name="operationName"/>
          </form>


          <div name="report_body" v-if="readReportFlag">
            <div v-if="list.length != 0">
              <monthly-report :param="param" :list="list" :isEdit="false"></monthly-report>
            </div>
            <div class="monthly_report_tb_margin_s">
              <div class="box-body">
                <h3 class="box-title with-border">日次グラフ</h3>
              </div>

              <div v-for="(chartData, index) in this.chartDatas" v-if="chartData != null">
                <div v-if="chartData.appear">
                  <div class="box-header" v-if="chartData.header!=null">
                    <h2 class="box-title font_18 font_bold">{{chartData.header}}</h2>
                  </div>
                  <div class="box-header with-border margin_left_15">
                    <h4 class="box-title">{{chartData.label}}</h4>
                  </div>
                  <div class="overflow_auto">
                    <chart v-bind:id="'chart_'+index" v-if="chartData.type==1" :param="chartData.chartData" :width="800" class="margin_left_15"></chart>
                    <circle-chart v-bind:id="'chart_'+index" v-if="chartData.type==2" ref="child1" :param="chartData.chartData" :width="800" class="margin_left_15 margin_top_20"></circle-chart >
                  </div>
                  <div class="form-group padding_bottom_30 margin_top_20 margin_right_m15">
                    <label class="col-sm-2 control-label margin_top_7px text-right">備考</label>
                    <div class="col-sm-10 item-text">
                      <span v-html="getColumData(chartData.note)"></span>
                    </div>
                  </div>
                  <div class="box-header">
                  </div>
                </div>
              </div>

              <div class="box-header with-border">
              </div>
            </div>

            <div v-if="scheduleList.length != 0">
              <monthly-report :param="scheduleParam" :list="scheduleList" :isEdit="false"></monthly-report>
            </div>

            <div class="monthly_report_tb_margin_s" v-if="this.otherList.length!=0">
              <div class="box-body">
                <h3 class="box-title with-border">その他</h3>
              </div>
              <div class="form-group mothly_report_other_bg" v-for="(other, index) in this.otherList">
                <div class="box-body margin_left_0">
                  <div class="form-group margin_right_m15 overflow_auto">
                    <label class="col-sm-2 control-label margin_top_7px to_right_btn">タイトル</label>
                    <div class="col-sm-10 item-text">
                      {{getColumData(other.title)}}
                    </div>
                  </div>
                  <div class="form-group margin_right_m15 margin_top_7px overflow_auto">
                    <label class="col-sm-2 control-label margin_top_7px to_right_btn">本文</label>
                    <div class="col-sm-10 item-text">
                      <span v-html="getColumData(other.body)"></span>
                    </div>
                  </div>
                  <div class="margin_right_m15">
                    <label class="col-sm-2 control-label margin_top_10 to_right_btn">写真</label>
                    <div class="col-sm-10 margin_top_10">
                      <p>&nbsp;※ファイル容量5MB以下</p>
                    </div>
                    <div class="report_file_select">
                      <div class="float_left padding_right_30" v-for="(image, imgIndex) in other.monthlyReportOtherImages">
                        <input v-bind:id="'file_select'+index+'_'+imgIndex" class="col-sm-8 control-label" style="display:none" type="file" accept="image/*" @change="onAddFile">
                        <div class="margin_top_5 img_div_monthly_report padding_bottom_25">
                          <img v-bind:src="getImageUrl(image)" v-bind:id="'img_source'+index+'_'+imgIndex" v-bind:class="{ img_thumbnail_monthly_report: image!=null, opacity_0: image==null}" data-toggle="modal" v-bind:data-target="'#modal'" @click="onImgClick(index+'_'+imgIndex)">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="itemInfo" class="callout callout-success margin_side_15">
              <p>{{itemInfo}}</p>
            </div>
            <div v-if="error" class="callout callout-danger err-info margin_side_15">
              <p>{{error}}</p>
            </div>
            <div class="box-footer form_button_flex flex_center border_top">
              <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/monthly_reports/' + $route.params.operation_id)">戻る</button>
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
  import ListView from '~/components/ListView'
  import MonthlyReport from '~/components/MonthlyReport'
  import Chart from '~/components/Chart';
  import CircleChart from '~/components/CircleChart';
  import ModalImgView from '~/components/ModalImgView'
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
    // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';
  import request from 'superagent'
  
  export default {
    data() {
      return {
        operationId: this.$route.params.operation_id,
        monthlyReportsId: this.$route.params._id,
        error: '',
        isOwner: false,
        fullpage: true,
        maxMajorItemsSize: 0,
        loadedMajorItemSize: 0,
        operationCategories: [],
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
        buildingId: "",
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
        param: {
          columns: [
            { name: 'その他 タイトル', nameLabel:'Other', column: 'title'},
            { name: '今後のイベント タイトル',nameLabel:'Schedules', column: 'title'},
            { name: '特記事項 タイトル',nameLabel:'Topics', column: 'notice'}
          ],
          maxlength:512,
          reportYearMonth: this.$route.params.year ? this.$route.params.year + '-' + this.$route.params.month : undefined,
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
      ListView,
      Loading
    },
    methods: {
      downloadPdf() {
        const apiUrl = '/pdf-generate';
        const requestBody = {
          type: 'monthlyReport',
          async: false,
          monthlyReport: {
            id: parseInt(this.$route.params.id)
          }
        };
        this.req(apiUrl, 'post', requestBody, (err, res) => {
          const responseBody = res.body;
          if(responseBody.complete) {
            const filePath = process.env.RESOURCE_SERVER + responseBody.monthlyReport.objectKey;
            request
              .get(filePath)
              .set('Accept', 'application/pdf')
              .responseType('blob')
              .then(res => {
                const url = URL.createObjectURL(res.body);
                const a = document.createElement("a");
                document.body.appendChild(a);
                a.download = responseBody.monthlyReport.fileName;
                a.href = url;
                a.click();
                a.remove()
                setTimeout(() => {
                  URL.revokeObjectURL(url);
                }, 1000);
              });
          }
        });
      },
      outPdf(){
        var images = [];

        for (let i=0; i<this.chartDatas.length; i++) {
          var canvasParentDiv = document.getElementById("chart_"+i);
          if (canvasParentDiv != null){
            var canvas = canvasParentDiv.children[0];
            if (canvas != null){
              var imgB64_dst = canvas.toDataURL();  
              images.push(imgB64_dst);
            }else{
              images.push(null);
            }
          }else{
            images.push(null);
          }
        }

        document.report_form.token.value = localStorage.getItem('token');
        document.report_form.images.value = JSON.stringify(images);
        document.report_form.topics.value = JSON.stringify(this.list);
        document.report_form.schedules.value = JSON.stringify(this.scheduleList);
        document.report_form.charts.value = JSON.stringify(this.chartDatas);
        document.report_form.others.value = JSON.stringify(this.otherList);

        var dateSplit = this.changeDateFormat2(this.param.reportYearMonth);
        document.report_form.report_title.value = dateSplit+"-"+this.param.title;
        document.report_form.reportDate.value = dateSplit;
        document.report_form.comment.value = this.item.comment;
        document.report_form.buildingName.value = localStorage.getItem('buildings_name');

        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        document.report_form.operationName.value = target.operation_name;
        
        document.report_form.method="post";
        document.report_form.submit();
        // document.report_form.label_switch.value = localStorage.getItem('display_object_if_empty');
        // document.report_form.buildingId.value = parseInt(localStorage.getItem('buildings_id'));
        // document.report_form.buildingName.value = localStorage.getItem('buildings_name');
        // // document.report_form.report_id.value = this.$route.params.report_id;
        // document.report_form.reportDefinitionId.value = this.$route.params.report_id;
        // document.report_form.operationReportTemplateId.value = this.item.operationReportTemplateId;
        // document.report_form.date.value = this.requestDate;
        // document.report_form.buildingOwner.value = this.item.buildingOwner;
        // document.report_form.method="post";
        // document.report_form.submit();
      },
      getReportObjectGroupDefinitions(operationCategoryContents) {
        var reportObjectGroupDefinitions = [];
        var reportObject;
        var find;
        operationCategoryContents.forEach((content) => {
          find = reportObjectGroupDefinitions.find(val => val.id == content.reportObjectGroupDefinitionId);
          if (find == undefined) {
            var sort = 999;
            if (content.reportObjectGroupDefinition.reportObjectDefinitions != null){
              if (content.reportObjectGroupDefinition.reportObjectDefinitions.length > 0) {
                sort = content.reportObjectGroupDefinition.reportObjectDefinitions[0].sort;
              }
            }
            content.reportObjectGroupDefinition.sort = sort;          
            reportObjectGroupDefinitions.push(content.reportObjectGroupDefinition);
          }
        });
        reportObjectGroupDefinitions.sort(function(a,b){
          if(a.sort < b.sort) return -1;
          if(a.sort > b.sort) return 1;
            return 0;
        });
        return reportObjectGroupDefinitions;
      },
      onCancel() {
      },
      setTitle() {
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        const operationCategories = JSON.parse(localStorage.getItem('operation_categories'));
        const currentCategory = operationCategories.find(val => val.id == parseInt(this.$route.params.operation_id));
        var target = reportList.find((report) => {
          return (report.operation_type_id == currentCategory.operationTypeId);
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
        var fromDate1 = new Date(toDate1.getFullYear(), toDate1.getMonth() + 1, 1)
        var toDate2 = new Date(toDate1.getFullYear(), toDate1.getMonth() + 1, 1)
        var fromDate2 = new Date(toDate1.getFullYear(), toDate1.getMonth() + 2, 1)
        this.param.disabledDates = {"to":toDate1,"from":fromDate1};
        this.scheduleParam.disabledDates = {"to":toDate2,"from":fromDate2};
        this.readReportFlag = true;

        this.list = [];
        this.scheduleList = [];
        this.chartDatas = [];
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
        var buildingId = this.isHeadquartersMode ? this.buildingId : parseInt(localStorage.getItem('buildings_id'));
        let preview_api = '/monthly-reports/preview?'+'buildingId='+buildingId+'&operationCategoryId='+this.$route.params.operation_id+'&reportYear='+dateSplit[0]+'&reportMonth='+dateSplit[1];
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
                  } else {
                    nextDate.setDate(nextDate.getDate()+1)
                  }
                }
              }.bind(this))
              this.scheduleList.sort(function(a,b){
                  if (a.day < b.day) return -1;
                  if (a.day > b.day) return 1;
                  return 0;
              });
            }
     
            this.graphIds = res.body.graphDefinitionIds;
            this.headers = [];
            this.loading = true;
            this.readingFlag = true;
            this.maxMajorItemsSize = this.graphIds.length;
            this.loadedMajorItemSize = 0;
            this.graphIndex = 0;
            this.getGraphData();
          }
        })
      },

      /**
       * 大項目定義グループの重複チェック
       */
      isReportObjectGroupDefinitionsExists(reportObjectDefinitions, reportObjectGroupDefinitions) {
        for (var i = 0; i < reportObjectGroupDefinitions.length; i++) {
          if (reportObjectGroupDefinitions[i].id == reportObjectDefinitions.reportObjectGroupDefinition.id) {
            return true;
          }
        }
        return false;
      },
      /**
       * 大項目の表示チェック
       */
      isReportObjectDefinition(reportObjectDefinitionsId, buildingOperations) {
        for (var i = 0; i < buildingOperations.length; i++) {
          if ((reportObjectDefinitionsId == buildingOperations[i].reportObjectDefinitionId) && buildingOperations[i].useAsReport) return true;
        }
        return false;
      },
      /**
       * 特定(id)の大項目定義グループの大項目取得
       */
      getReportObjectDefinitionOfGroup(reportObjectDefinitions, id, buildingOperations) {
        var res = [];
        for (var i = 0; i < reportObjectDefinitions.length; i++) {
          if (reportObjectDefinitions[i].reportObjectGroupDefinitionId == id  && this.isReportObjectDefinition(reportObjectDefinitions[i].id, buildingOperations ) ) {
            res.push({name: reportObjectDefinitions[i].name, sort: reportObjectDefinitions[i].sort, id: reportObjectDefinitions[i].id, path: '/majoritems/' + reportObjectDefinitions[i].id, operationCategoryId: reportObjectDefinitions[i].operationCategoryId});
          } 
        }
        res.sort(function(a,b){
          if(a.sort < b.sort) return -1;
          if(a.sort > b.sort) return 1;
            return 0;
        });
        return res;
      },
      /**
       * APIから取得した業務及び大項目のデータを変換
       */
      convertReportObjectDefinitions(reportObjectDefinitions, buildingOperations) {
        var reportObjectGroupDefinitions = [];
        var reportObjects;
        for (var i = 0; i < reportObjectDefinitions.length; i++) {
          if (reportObjectGroupDefinitions.length == 0) {
            reportObjects = this.getReportObjectDefinitionOfGroup(reportObjectDefinitions, reportObjectDefinitions[i].reportObjectGroupDefinition.id, buildingOperations);
            if (reportObjects.length != 0) {
              reportObjectGroupDefinitions.push({ name: reportObjectDefinitions[i].reportObjectGroupDefinition.name, id: reportObjectDefinitions[i].reportObjectGroupDefinition.id, reportObjectDefinitions: reportObjects});
            }
          }
          if(!this.isReportObjectGroupDefinitionsExists(reportObjectDefinitions[i], reportObjectGroupDefinitions)) {
            reportObjects = this.getReportObjectDefinitionOfGroup(reportObjectDefinitions, reportObjectDefinitions[i].reportObjectGroupDefinition.id, buildingOperations);
            if (reportObjects.length != 0) {
              reportObjectGroupDefinitions.push({ name: reportObjectDefinitions[i].reportObjectGroupDefinition.name, id: reportObjectDefinitions[i].reportObjectGroupDefinition.id, reportObjectDefinitions: reportObjects});
            }
          }
        }
        return reportObjectGroupDefinitions;
      },
       /**
       * 共通UI表示項目のメンバーごとのフィルタ
       */
      filterMenulistToMemberRequest(api, val, operations) {
        this.onSearch(api, null, null, (res) => {
          var report_hierarchy = [];
          // NOTE: メンバーごとの業務filter処理追加
          for (var i = 0; i < val.length; i++) {
            if (this.checkItemPermission('Common:forSystemApproval')){
              var operation = operations.find((ope) => {
                  return (ope.id == val[i].operationCategoryId)
              });

              operation.reportObjectDefinitions.sort(function(a,b){
                if(a.sort < b.sort) return -1;
                if(a.sort > b.sort) return 1;
                  return 0;
              });
              report_hierarchy.push({ name: val[i].operationCategory.reportName, operation_name: val[i].operationCategory.operationName, id: val[i].operationCategoryId, path: '/report/' + val[i].operationCategoryId, majoritems: this.convertReportObjectDefinitions(operation.reportObjectDefinitions, val[i].operations)});
            }else{
              for (var j = 0; j < res.memberOperationCategories.length; j++) {
                if (val[i].operationCategoryId == res.memberOperationCategories[j].operationCategoryId) {
                  var operation = operations.find((ope) => {
                    return (ope.id == val[i].operationCategoryId)
                  });

                  operation.reportObjectDefinitions.sort(function(a,b){
                    if(a.sort < b.sort) return -1;
                    if(a.sort > b.sort) return 1;
                      return 0;
                  });
                  report_hierarchy.push({ name: val[i].operationCategory.reportName, operation_name: val[i].operationCategory.operationName, id: val[i].operationCategoryId, path: '/report/' + val[i].operationCategoryId, majoritems: this.convertReportObjectDefinitions(operation.reportObjectDefinitions, val[i].operations)});
                }
              }
            }
          }
          localStorage.setItem('report_list', JSON.stringify(report_hierarchy));

          this.getGraphData();
        });
      },
      /**
       * 業務項目の詳細取得
       */
      operationCategoriesRequest(api, val) {
        this.onSearch(api, null, null, (operation) => {
          this.filterMenulistToMemberRequest('/members/' + localStorage.getItem('member_id'), val, operation);
        });
      },
      /**
       * 共通UI表示項目の作成
       */
      createMenulistRequest(api, operationReports) {
        this.onSearch(api, null, null, (val) => {
          var targetOperationReports = operationReports.filter(operation => operation.active == true);
          
          var targetTemplate = [];
          for (var i = 0; i < val.length; i++) {
            for (var j = 0; j < targetOperationReports.length; j++) {
              if (val[i].id == targetOperationReports[j].operationReportTemplateId) {
                targetTemplate.push(val[i]);
              }
            }
          }
          this.operationCategoriesRequest('/operation-categories', targetTemplate);
        });
      },
      getDisplayObjectIfEmpty() {
        var buildingId = this.isHeadquartersMode ? this.buildingId : parseInt(localStorage.getItem('buildings_id'));
        this.onSearch('/buildings/' + buildingId, null, null, res => {
          var historyTemplates = res.buildingOperationReports.map(function(row) {
            return {id: row.operationReportTemplateId, operationId: row.operationReportTemplate.operationCategoryId};
          })
          var setHistoryTemplates = Array.from(new Set(historyTemplates));
          localStorage.setItem('history_templates', JSON.stringify(setHistoryTemplates));

          this.createMenulistRequest('/building/' + buildingId +  '/report-definitions', res.buildingOperationReports);
        });
      },
      setGraphHeader(){
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        this.chartDatas.forEach((chartData) => {
          reportList.forEach((job) => {
            var groups = job.majoritems;
            if (this.isHeadquartersMode) {
              const operationCategories = JSON.parse(localStorage.getItem('operation_categories'));
              const currentCategory = operationCategories.find(val => val.id == parseInt(this.$route.params.operation_id));
              const operationCategory = this.operationCategories.find(val => val.operationTypeId == currentCategory.operationTypeId);
              groups = this.getReportObjectGroupDefinitions(operationCategory.operationCategoryContents)
            }
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

        var buildingId = this.isHeadquartersMode ? this.buildingId : parseInt(localStorage.getItem('buildings_id'));
        let graph_api = "/graphs?buildingId="+buildingId+'&graphDefinitionId='+graphId+'&from='+fromStr+'&to='+toStr;
        this.req(graph_api, 'get', null, (err, res) => {
          this.loading = true;
          this.loadedMajorItemSize += 1;
          if (this.loadedMajorItemSize == this.maxMajorItemsSize){
            this.readingFlag = false;
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
                this.chartDatas[graphIndex] = {id:reportObjectDefinitionId,appear:false,header:header,graphDefinitionId:graphId,label:obj.reportObjectDefinitionName+" : 総件数"+total+"件",type:obj.graphData.graphType,note:this.graphMemo[graphIndex],chartData:{labels:labels,data:chartData}};
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
              if (this.isHeadquartersMode) {
                const operationCategories = JSON.parse(localStorage.getItem('operation_categories'));
                const currentCategory = operationCategories.find(val => val.id == parseInt(this.$route.params.operation_id));
                const operationCategory = this.operationCategories.find(val => val.operationTypeId == currentCategory.operationTypeId);
                groups = this.getReportObjectGroupDefinitions(operationCategory.operationCategoryContents)
              }
              
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
              this.chartDatas[graphIndex] = {id:reportObjectDefinitionId,appear:true,header:header,graphDefinitionId:graphId,label:obj.reportObjectDefinitionName+" : 総件数"+total+"件",type:obj.graphData.graphType,note:this.graphMemo[graphIndex],chartData:{labels:labels,data:chartData}};
              // this.chartDatas.push({appear:true,header:header,graphDefinitionId:graphId,label:obj.reportObjectDefinitionName+" : 総件数"+total+"件",type:obj.graphData.graphType,note:"",chartData:{labels:labels,data:chartData}});
            }else{
              this.chartDatas[graphIndex] = {id:reportObjectDefinitionId,appear:true,header:header,graphDefinitionId:graphId,total: total,label:obj.reportObjectDefinitionName+" ＞ "+obj.reportFieldDefinitionName+" : 総件数"+total+"件",type:obj.graphData.graphType,note:this.graphMemo[graphIndex],chartData:{labels:label,data:chartData}};
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
      getReportData() {
        let api_for_list = '/monthly-reports/' + this.$route.params.id;
        this.onSearch(api_for_list, null, null, (val) => {
          this.param.reportYearMonth = new Date(val.reportYear + "/" + ("0"+val.reportMonth).slice(-2)+"/01");
          var dateSplit = this.changeDateFormat2(this.param.reportYearMonth).split("/");
          let fromStr = dateSplit[0] +"-"+dateSplit[1]+"-01";;
          var toDate1 = new Date(fromStr); 
          toDate1 = new Date(toDate1.getFullYear(), toDate1.getMonth(), 1)
          var fromDate1 = new Date(toDate1.getFullYear(), toDate1.getMonth() + 1, 0)
          var toDate2 = new Date(toDate1.getFullYear(), toDate1.getMonth() + 1, 1)
          var fromDate2 = new Date(toDate1.getFullYear(), toDate1.getMonth() + 2, 0)
          this.param.disabledDates = {"to":toDate1,"from":fromDate1};
          this.scheduleParam.disabledDates = {"to":toDate2,"from":fromDate2};
          this.item.comment = val.comment;
          this.buildingId = val.buildingId;

          if (val.monthlyReportGraphs != null){
            var graphData = val.monthlyReportGraphs;
            graphData.forEach(function(obj) {
              this.graphMemo.push(obj.note);
              this.graphIds.push(obj.graphDefinitionId);
            }.bind(this));
            this.loading = true;
            this.readingFlag = true;
            this.maxMajorItemsSize = this.graphIds.length;
            this.loadedMajorItemSize = 0;
            this.graphIndex = 0;

            this.operationCategories = [];
            var parameter = { where: {buildingId: this.buildingId} ,include: [{relation: 'operationType'},{relation: 'operationCategoryContents',scope:{include:[{relation: 'reportObjectGroupDefinition',scope:{include:[{relation: 'reportObjectDefinitions'}]}}]}}] };
            var operationCategory = null;
            this.onSearch('/companies/'+localStorage.getItem("company_id")+'/operation-categories', parameter, null, (val) => {
                val.forEach(operation => {
                  this.operationCategories.push(operation);
                });
                this.getGraphData();
            });
          }

          if (val.monthlyReportOthers != null){
            val.monthlyReportOthers.forEach(function(obj) {
              if (obj.monthlyReportOtherImages == null){
                obj.monthlyReportOtherImages = [null];
              }else{
                if (obj.monthlyReportOtherImages.length != 3) {
                  obj.monthlyReportOtherImages.push(null);
                }
              }
              this.otherList.push(obj);
            }.bind(this))
          } 
          if (val.monthlyReportSchedules != null){
              for (let i=0; i<val.monthlyReportSchedules.length; i++) {
                var obj = val.monthlyReportSchedules[i];
                var scheduleDate = new Date(obj.scheduleDate);
                this.scheduleList.push({"day":scheduleDate,"weekday":this.getWeekDayStr(scheduleDate),"text":obj.title,"path":""});
              }

              this.scheduleList.sort(function(a,b){
                if (a.day < b.day) return -1;
                if (a.day > b.day) return 1;
                return 0;
              });

          }

          if (val.monthlyReportTopics != null){
            val.monthlyReportTopics.forEach(function(obj) {
              var reportDate = new Date(obj.reportDate);
              this.list.push({"day":reportDate,"weekday":this.getWeekDayStr(reportDate),"text":obj.notice,"path":""});
            }.bind(this));

            this.list.sort(function(a,b){
                if (a.day < b.day) return -1;
                if (a.day > b.day) return 1;
                return 0;
              });
          }
          this.readReportFlag = true;          
        });

      },
      onAddButtonClick() {
        this.error = ''

        var dateSplit = this.changeDateFormat2(this.param.reportYearMonth).split("/");
        var count_cond = {
          and:[
            {reportYear: dateSplit[0]},
            {reportMonth: dateSplit[1]},
            {operationReportTemplateId: parseInt(this.$route.params.operation_id)},
            {buildingId:  (isHeadquartersMode ? this.buildingId : parseInt(localStorage.getItem('buildings_id')))}
          ]
        };
        this.onCount('/monthly-reports', count_cond, (res) => {
          if (res.count > 1) {
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
              monthlyReportTopics.push({ reportDate:dateSplit[0] +"-"+dateSplit[1]+"-"+('0' + obj.day.getDate()).slice(-2), notice: obj.text})
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
              monthlyReportSchedules.push({ scheduleDate:obj.day.getFullYear() +"-"+(('0' + (obj.day.getMonth()+1)).slice(-2))+"-"+('0' + obj.day.getDate()).slice(-2), title: obj.text, body: ""});
            }else{
              if (obj.text == null && obj.text != ""){
                errorMessage = "今後のイベント:日付が入力されていません。";
              }
            }
          }
        })
        const otherListData = JSON.parse(JSON.stringify(this.otherList));
        for (let i=0; i<otherListData.length; i++) {
          for (let j=0; j<otherListData[i].monthlyReportOtherImages.length; j++) {
            if (otherListData[i].monthlyReportOtherImages[j] == null){
              otherListData[i].monthlyReportOtherImages.pop();
            }else{
              if (otherListData[i].monthlyReportOtherImages[j].filePath == null){
                otherListData[i].monthlyReportOtherImages[j] = {"filePath":otherListData[i].monthlyReportOtherImages[j]};
              }
            }
          }
          if (otherListData[i].monthlyReportOtherImages.length == 0 && otherListData[i].title == "" && otherListData[i].body == "") {
            otherListData.pop();
          }
        }

        var send_data = {
          buildingId: (isHeadquartersMode ? this.buildingId : parseInt(localStorage.getItem('buildings_id'))),
          operationReportTemplateId: parseInt(this.$route.params.operation_id),
          reportYear: parseInt(dateSplit[0]),
          reportMonth: parseInt(dateSplit[1]),
          comment: this.item.comment,
          reportedBy: Number(localStorage.getItem('member_id')),
          monthlyReportTopics:monthlyReportTopics,
          monthlyReportGraphs:monthlyReportGraphs,
          monthlyReportSchedules:monthlyReportSchedules,
          monthlyReportOther:otherListData
        }
        let api_for_list = '/monthly-reports/' + this.$route.params.id;
        this.req(api_for_list, 'patch', send_data, (err, res) => {
          if (err && err.status == 401) {
            this.store.clear();
            this.$router.push("/login");
            event.emit("login-update");
          }else if (err) {
            this.error = this.getMonthlyReportErrorMsg(res, this.param.columns)
            return;
          } else if (res.body) {
            this.itemInfo = '更新完了'
            setTimeout(() => (this.itemInfo = ''), 3000)
          }
        })
      },
      onUpdateButton() {

      },
      isNoInputCheck(item) {
         if(!item.reportYearMonth) {
            this.alert.title = '';
            this.alert.message = '報告年月を入力してください。';
            this.alert.note = '';
            this.alert.isConfirm = false;
            $('#modal_alert').modal('show')
            // alert('報告年月を入力してください');
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
        // this.onDeleteFileClick(index);
        //TODO消された時の画像の再紐付け アップロード後のurlをsrc bindする?
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
        //TODOここのtestはfileIDを入れる
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
      const key = (parseInt(this.$route.params.operation_id) == 1) ? "Security:MonthlyReport:view" : "Cleaning:MonthlyReport:view";
      this.checkDisplayPermission(key, () => {
        if (localStorage.getItem('role') == 'owner') {
          this.isOwner = true;
        }
        this.setTitle();
        this.getReportData();
      });
    },
    updated() {
      document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
    }
  }

</script>

<style lang="stylus" scoped>

</style>
