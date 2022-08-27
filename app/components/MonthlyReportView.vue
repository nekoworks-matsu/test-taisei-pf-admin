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
        <div class="ts_breadcrumb">
          <ol>
            <li>データ分析</li>
            <li class="current">月次件数</li>
          </ol>
        </div>
        <h1 class="ts_content_heading">月次件数</h1>
      </div>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- <div class="box-header with-border">
            <h2 class="box-title with-border">月次データ集計情報</h2>
            <div class="no-margin pull-right">
              <button type="button" class="btn btn-primary" @click="outCsv" v-bind:disabled="isPushCSV">CSVダウンロード</button>
            </div>
          </div> -->
          <div class="box-header with-border box_head">
            <h2 class="box-title with-border">月次件数を集計</h2>
          </div>
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal" action="/pdf" name="report_form">
              <div class="box-body">
                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">報告年月</label>
                  </div>
                  <div class="form_box_group_field">
                    <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="item.reportYearMonth" placeholder="カレンダーから選ぶ" minimum-view='month'></vuejs-datepicker>
                    <!-- <button type="button" class="btn btn-primary margin_left_10" @click="readReportData">読込</button> -->
                  </div>
                </div>
                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">報告書</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control max_width_390" v-model="item.targetReport" v-bind:disabled="reports.length==2">
                      <option v-bind:value="opt.id" v-for="opt in reports">{{opt.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="text_center margin_top_20">
                  <button type="button" class="btn btn-primary global_btn" @click="readReportData">読込</button>
                </div>
                <div class="border_top padding_top_40 margin_top_50">
                  <button type="button" class="btn btn-primary global_btn" @click="outCsv" v-bind:disabled="isPushCSV">CSVダウンロード</button>
                </div>
                <!-- <div class="no-margin pull-right">
                  <button type="button" class="btn btn-primary" @click="readReportData">読込</button>
                </div>
                 <div class="no-margin pull-left">
                  <button type="button" class="btn btn-primary" @click="outCsv" v-bind:disabled="isPushCSV">CSVダウンロード</button>
                </div> -->
              </div>
              <div class="box-body">
                <table class="table table-bordered table-noborder margin_top_20">
                  <tbody>
                    <tr v-for="cols in this.list" v-if="readReportFlag">
                      <td class="width_300" style="cursor: default;">{{cols.label}}</td>
                      <td v-if="cols.label=='勤務スタッフ'&&!checkItemPermission('Report:Monthly:search:forOwner')"><nuxt-link v-bind:to="{path: '/monthly_report' + cols.path + '/' + changeDateFormat2(item.reportYearMonth) + '/' + item.operationCategoryId}">{{cols.num}}件</nuxt-link></td>
                      <td v-if="cols.label!='勤務スタッフ'&&!checkItemPermission('Report:Monthly:search:forOwner')"><nuxt-link v-bind:to="{path: '/monthly_report/majoritems/' + changeDateFormat2(item.reportYearMonth) + '/' + item.operationCategoryId + '/' + cols.path}">{{cols.num}}件</nuxt-link></td>
                      <td v-if="checkItemPermission('Report:Monthly:search:forOwner')"><span>{{cols.num}}件</span></td>
                    </tr>
                  </tbody>
                </table>
                <!-- <div role="grid" v-for="cols in this.list" v-if="readReportFlag">
                  <h3 class="box-title with-border font_18">
                    {{cols.label}}
                    <nuxt-link v-bind:to="{path: '/monthly_report' + cols.path + '/' + changeDateFormat2(item.reportYearMonth) + '/' + item.operationCategoryId}" v-if="cols.label=='勤務スタッフ'&&!checkItemPermission('Report:Monthly:search:forOwner')">{{cols.num}}件</nuxt-link>
                    <nuxt-link v-bind:to="{path: '/monthly_report/majoritems/' + changeDateFormat2(item.reportYearMonth) + '/' + item.operationCategoryId + '/' + cols.path}" v-if="cols.label!='勤務スタッフ'&&!checkItemPermission('Report:Monthly:search:forOwner')">{{cols.num}}件</nuxt-link>
                    <span v-if="checkItemPermission('Report:Monthly:search:forOwner')">{{cols.num}}件</span>
                  </h3>
                  <table class="table table-bordered table-hover report" role="grid">
                    <thead>
                      <tr role="row">
                        <th v-for="col in cols.columns">{{col.name}}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr role="row" v-for="col_data in cols.data_list" @click="$router.push(col_data.path)">
                        <td v-for="col in col_data.columns" class="report">{{col.value}}</td> -->
                        <!-- 改行含むテキストを表示する際、HTMLのソースコードの改行が影響するため一行で表記している -->
                      <!-- </tr>
                    </tbody>
                  </table>
                </div> -->
              </div>
              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
      <!-- /.box -->
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
import ReportView from "./ReportView";
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import ModalAlertView from '~/components/ModalAlertView'

export default {
  data() {
    return {
      item: {
        reportYearMonth: new Date(),
        // reportYearMonth: this.$route.params.year ? this.$route.params.year + '-' + this.$route.params.month : undefined,
        targetReport: this.$route.params.id,
        targetOperationId: null
      },
      error: '',
      itemInfo: '',
      tmpUpdatedAt: '',
      DatePickerFormat: 'yyyy/MM',
      readReportFlag: false,
      download_check :true,
      reports: [],
      latestReportData: null,
      regdisabled: false,
      fullpage:true,
      list: [],
      oldItem:{},
      alert: {
        title: 'test',
        message: '',
        note: '',
        isConfirm: false,
      },
      isPushCSV: true,
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
        title: '',
        id: '',
        member: '',
        list: [],
        columns: [
          { name: '報告年月', column: 'report_date', type: 'datePicker', required: true },
          { name: '対象報告書', column: 'target_report', type: 'select' ,required: true, options: [] },
        ],
      },
      api: '/reports',
    };
  },
  components: {
    ReportView,
    ModalAlertView,
    Loading
  },
  methods: {
    outCsv(){
      if (this.latestReportData != null){
        var csvArray = [["カテゴリID", "業務名", "件数"]]
        csvArray.push(["","勤務スタッフ",this.latestReportData.attendanceCount])
        var reportSections = this.latestReportData.reportObjectCounts
        for (var i = 0; i < reportSections.length; i++ ) {
          csvArray.push([reportSections[i].reportObjectDefinitionId,reportSections[i].reportObjectDefinitionName,reportSections[i].count])
        }
        this.exportCsv(csvArray)
      }
    },
    updateReport(){
      var request = {
        weather: this.item.weather,
        reportedAt: this.item.reportedAt,
        notice: (this.item.notice == null) ? "" : this.item.notice,
        comment: (this.item.comment == null) ? "" : this.item.comment,
        reportedBy: this.item.reportedBy,
        buildingId: parseInt(localStorage.getItem('buildings_id')),
        operationReportTemplateId: this.item.operationReportTemplateId
      }
      this.onUpdate(this.api, request, (err, res) => {
        if (res && res.ok) {
          this.error = "";
          this.download_check = true;
          Object.assign(this.oldItem,this.item);
          this.itemInfo = "更新完了";
          setTimeout(() => (this.itemInfo = ""), 3000);
          this.tmpUpdatedAt = res.body.report.updatedAt;
        } else if (err) {
          this.download_check = false;
          this.error = this.getErrorMsg2(res, this.param.columns);
        }
      });
    },
    getAttendances(val) {
      this.list.push({ label: '勤務スタッフ', num: val, path: '/attendance' });
    },
    getColumData(val) {
      if (val == null) {
        return '---'
      }
      if (val.label != null) {
        return val.label;
      }
      if (val.name != null) {
        return val.name;
      }
      return val;
    },
    getColumnsData(val, cnt) {
      var data = [];
      for (var i = 0; i < val.reportObjects[cnt].reportFields.length; i++) {
        switch (val.reportObjectDefinition.reportFieldDefinitions[i].type) {
          case 1:
          case 6:
            data.push({value: this.getColumData(val.reportObjects[cnt].reportFields[i].textValue)});
            break;
          case 2:
            data.push({value: this.getColumData(this.df2(val.reportObjects[cnt].reportFields[i].dateValue))});
            break;
          case 3:
            data.push({value: this.getColumData(val.reportObjects[cnt].reportFields[i].numberValue)});
            break;
          case 4:
            data.push({value: this.getColumData(val.reportObjects[cnt].reportFields[i].selectOptionDefinition)});
            break;
          case 5:
            data.push({value: this.getColumData(val.reportObjects[cnt].reportFields[i].member)});
            break;
          default:
            break;
        }
      }
      return data;
    },
    getReportFiledDefinition(val) {
      var data = [];
      // NOTE: 大項目データ項目定義回数ループ
      for (var i = 0; i < val.reportObjectDefinition.reportFieldDefinitions.length; i++) {
        data.push({name: val.reportObjectDefinition.reportFieldDefinitions[i].name});
      }
      return data;
    },
    getReportData(val) {
      var data_list = [];
      // NOTE: 大項目データ回数ループ
      for (var i = 0; i < val.reportObjects.length; i++) {
        var path = '/majoritems/details/' + val.reportObjects[i].reportObjectDefinitionId + '/' + val.reportObjects[i].id;
        var columns = this.getColumnsData(val, i);
        data_list.push({path, columns});
      }
      var data = {label: val.reportObjectDefinition.name, columns: this.getReportFiledDefinition(val), data_list: data_list};
      return data;
    },
    getOperationCategoryId(reportTemplateId) {
      var templateList = JSON.parse(localStorage.getItem('template_list'));
      var find = templateList.find(val => val.templateId == reportTemplateId);
      return find.operationCategoryId;
    },
    getReportObjectDefinitions(reportTemplateId) {
      var reportObjectDefinition = JSON.parse(localStorage.getItem("report_list"));
      for (var i = 0; i < reportObjectDefinition.length; i++) {
        if (reportObjectDefinition[i].id == reportTemplateId) {
          return reportObjectDefinition[i];
        }
      }
    },
    getMajorItems(reportTemplateId) {
      var reportObjectDefinition = this.getReportObjectDefinitions(reportTemplateId);
      var majorItems = [];
      for (var i = 0; i < reportObjectDefinition.majoritems.length; i++) {
        for (var j = 0; j < reportObjectDefinition.majoritems[i].reportObjectDefinitions.length; j++) {
          majorItems.push({id: reportObjectDefinition.majoritems[i].reportObjectDefinitions[j].id, name: reportObjectDefinition.majoritems[i].reportObjectDefinitions[j].name})
        }
      }
      return majorItems;
    },
    sortMajorItems(val, reportTemplateId) {
      var majorItems = this.getMajorItems(reportTemplateId);

      majorItems.sort(function(a,b){
        if(a.id < b.id) return -1;
        if(a.id > b.id) return 1;
        return 0;
      });
      var sort = [];
      for (var i = 0; i < majorItems.length; i++) {
        for (var j = 0; j < val.length; j++) {
          if (majorItems[i].id == val[j].reportObjectDefinitionId) {
            sort.push({label: majorItems[i].name, path: majorItems[i].id, num: val[j].count});
          }
        }
      }
      return sort;
    },
    getReportSections(val, reportTemplateId) {
      var reportObject = [];
      var reportData = {};
      var sortItems = this.sortMajorItems(val, reportTemplateId);

      for (var i = 0; i < sortItems.length; i++) {
        this.list.push(sortItems[i]);
      }
    },
    getTemplateId(requestParam) {
      var templateList = JSON.parse(localStorage.getItem('template_list'));
      for (var i = 0; i < templateList.length; i++) {
        if (templateList[i].templateId == requestParam.targetReport) {
          this.item.operationReportTemplateId = templateList[i].templateId;
          this.item.operationCategoryId = templateList[i].operationCategoryId;
          this.getMonthlyReportCountRequest(this.item.operationReportTemplateId, this.changeDateFormat2(requestParam.reportYearMonth).substr(0, 4), this.changeDateFormat2(requestParam.reportYearMonth).substr(5, 7));
        }
      }
    },
    getMonthlyReportCountRequest(reportTemplateId, year, month){
      var onlyReport = this.checkItemPermission('Report:Monthly:search:forOwner');
      var api = '/buildings/' + localStorage.getItem('buildings_id') + '/reports/monthly-aggregation/count?operationCategoryId=' + reportTemplateId + '&year=' + year + '&month=' + month + '&onlyReport=' + onlyReport;
      this.req(api, 'get', null, (err, res) => {
        if (res.body) {
          this.latestReportData = res.body
          this.getAttendances(res.body.attendanceCount);
          this.getReportSections(res.body.reportObjectCounts, reportTemplateId);
          window.history.pushState(null, null, '/monthly_report/' + year + '/' + month + '/' + reportTemplateId);
        }
      });
    },
    /**
      * 必須項目の入力チェック
      */
    isNoInputCheck(item) {
      if (!item.reportYearMonth || !item.targetReport) {
        if (!item.reportYearMonth && !item.targetReport) {
          this.alert.title = '';
          this.alert.message = '報告年月と対象報告書を入力してください。';
          this.alert.note = '';
          this.alert.isConfirm = false;
          $('#modal_alert').modal('show')
          // alert('報告年月と対象報告書を入力してください');
        } else if(!item.reportYearMonth) {
          this.alert.title = '';
          this.alert.message = '報告年月を入力してください。';
          this.alert.note = '';
          this.alert.isConfirm = false;
          $('#modal_alert').modal('show')
          //alert('報告年月を入力してください');
        } else {
          this.alert.title = '';
          this.alert.message = '対象報告書を入力してください。';
          this.alert.note = '';
          this.alert.isConfirm = false;
          $('#modal_alert').modal('show')
          // alert('対象報告書を入力してください');
        }
        return true;
      }
      return false;
    },
    readReportData() {
      if (this.isNoInputCheck(this.item)) {
        return;
      }
      if (this.list.length === 0) {
        this.getTemplateId(this.item);
      }
      this.readReportFlag = true;
      this.isPushCSV = false;
    },
    getRows(text) {
      if (text == undefined || text == null) {
        return 1;
      }
      return text.split("\n").length;
    },
    getMembersInfo(){
      let buildingId = localStorage.getItem('buildings_id');
      let api = '/buildings/'+ buildingId +'/members';
      var member = [];
      this.onSearch(api, null, null, val => {
        val.forEach(function(obj){
          member.push({name: obj.name, value: obj.id});
        });
        this.members = member;
      }); 
    },
    setReportTitle() {
      var report_list = JSON.parse(localStorage.getItem('report_list'));
      for (var i = 0; i < report_list.length; i++) {
        if (report_list[i].id == this.$route.params.report_id) {
          this.param.title = report_list[i].name;
          break;
        }
      }
    },
    flexTextarea(el) {
      const dummy = el.querySelector('.flex_textarea_dummy');
      el.querySelector('.flex_textarea_textarea').addEventListener('input', e => {
        dummy.textContent = e.target.value + '\u200b';
      })
    },
    getReportsList() {
      var reportList = JSON.parse(localStorage.getItem('report_list'));
      var templateList = JSON.parse(localStorage.getItem('template_list'));
      var reports = [{ id: null, name: null }];
      for (var i = 0; i < reportList.length; i++) {
        for (var j = 0; j < templateList.length; j++) {
          if (reportList[i].id == templateList[j].templateId) {
            reports.push({ id: templateList[j].templateId, name: reportList[i].name, sort: templateList[j].templateId});
            if (reportList.length == 1) {
              this.item.targetReport = templateList[j].templateId;
            }
            break;
          }
        }
      }
      reports.sort(function(a,b){
        if(a.sort < b.sort) return -1;
        if(a.sort > b.sort) return 1;
        return 0;
      });
      
      this.reports = reports;
    },
    exportCsv(content){
      var formatCSV = '';
      for (var i = 0; i < content.length; i++) {
        var value = content[i];
        for (var j = 0; j < value.length; j++) {
          var innerValue = value[j]===null?'':value[j].toString();
          var result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0)
          result = '"' + result + '"';
          if (j > 0)
          formatCSV += ',';
          formatCSV += result;
        }
        formatCSV += '\n';
      }
      let reportName = this.reports.find( (v) => v.id == this.item.targetReport).name;
      let buildingName = localStorage.getItem('buildings_name');
      let date = this.changeDateFormat2(this.item.reportYearMonth).substr(0, 4) + "" + this.changeDateFormat2(this.item.reportYearMonth).substr(5, 7)
      var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      let blob = new Blob([bom, formatCSV], { type: 'text/csv' })
      let link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = buildingName + "_" + reportName + "_" + date + '月次報告.csv'
      link.click()
    }
  },
  mounted() {
    this.getReportsList();
    if (this.$route.params.year != null) {
      this.readReportData();
    }
  },
  watch: {
    item: {
      handler(val) {
        this.list = [];
        this.readReportFlag = false;
        this.isPushCSV = true;
        window.history.pushState(null, null, "/monthly_report");
      },
      deep: true,
    }
  },
};
</script>
