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
                <li>{{param.operation}}</li>
                <li>{{param.title}}一覧</li>
                <li>{{param.title}}詳細</li>
                <li class="current">{{param.title}}編集</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}編集</h1>
          </section>
        </div>
      </div>
    </section>

    <!-- <section class="content-header">
      <h1>
        {{param.title}}編集
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-default width_140" @click="onTransitionButton('/report_approval/details/' + $route.params.report_id + '/' + item.id)">キャンセル</button>
        </div>
      </h1>
    </section> -->

    <!-- Main content -->
    <section class="content">
      <div class="box">
        <div class="box-header with-border box_head">
          <h2 class="box-title with-border">{{param.title}}情報</h2>
        </div>
        <!-- /.box-header -->
        <div class="box-body">
          <form class="form-horizontal" action="/pdf" name="report_form">
            <div class="box-body">
              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="col-sm-4 control-label">報告書承認ID</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{item.id}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">報告書ID</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{item.reportId}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">報告日</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                   {{df3(item.reportedAt)}}
                  </div>
                </div>
              </div>
              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">ステータス</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    <span v-bind:is="'StatusComponent'" :value="item.status"></span>
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">天候</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{item.weather}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">ビルオーナー</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{getColumData(item.buildingOwner)}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">報告責任者</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{getMembersName(item.reportedBy)}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">特記事項</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text" v-html="getColumData(item.notice)"></div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">依頼事項</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text" v-html="getColumData(item.comment)"></div>
                </div>
              </div>

              <input type="hidden" v-model="this.item.reportId" name="report_id"/>
              <input type="hidden" name="token"/>
              <input type="hidden" name="label_switch"/>
              <input type="hidden" v-model="this.param.title" name="report_title"/>
              <input type="hidden" v-model="this.param.categorylist" name="list"/>
              <input type="hidden" name="buildingName"/>
              <input type="hidden" name="buildingId"/>
              <input type="hidden" name="status"/>
              <input type="hidden" name="buildingOwner"/>
              <input type="hidden" name="approver"/>
              <input type="hidden" name="reportDefinitionId"/>
              <input type="hidden" name="operationReportTemplateId"/>
              <input type="hidden" name="allMembers"/>
              <input type="hidden" name="header"/>
              <input type="hidden" name="isApproval"/>
              <input type="hidden" name="approveAttendance"/>
              <input type="hidden" name="approveReportSections"/>
              <input type="hidden" name="reportSections"/>
              <input type="hidden" name="floors"/>
              <input type="hidden" name="date"/>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">登録日時</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{df(item.createdAt)}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">更新日時</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{df(this.tmpUpdatedAt)}}
                  </div>
                </div>
              </div>

              <div class="box-body padding_0 margin_bottom_10" v-if="item.status!='2'">
                <div class="box-header with-border margin_bottom_10">
                  <h2 class="box-title font_18">承認/差戻しコメント</h2>
                </div>
                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">承認/差戻し</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control" v-model="request['actionType']" v-if="item.status!='4'">
                      <option></option>
                      <option value="1">承認</option>
                      <option value="2">差戻し</option>
                    </select>
                    <select class="form-control" v-model="request['actionType']" disabled v-if="item.status=='4'">
                      <option value="2">差戻し</option>
                    </select>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">コメント</label>
                  </div>
                  <div class="form_box_group_field flex_textarea padding_right_0">
                    <div class="flex_textarea_dummy" aria-hidden="true"></div>
                    <textarea id="FlexTextarea" class="flex_textarea_textarea form-control" v-bind:maxlength="512" v-bind:placeholder="'※改行で複数行入力可'" v-model="request['comment']"></textarea>
                  </div>
                </div>
              </div>
              <!-- 承認履歴動的 -->
              <div v-if="item.status">
                <div class="box-header with-border margin_bottom_20">
                  <h2 class="box-title font_18">承認申請履歴</h2>
                </div>
                <table class="table table-bordered table-hover report margin_bottom_15" role="grid">
                  <thead>
                    <tr role="row">
                      <th>担当者</th>
                      <th>報告責任者</th>
                      <th>日時</th>
                      <th>コメント</th>
                      <th>アクション</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr role="row" class="pointer_events_none"  v-for="app in approval">
                      <td class="vertical_align_middle">{{getMember(app.memberId)}}</td>
                      <td class="vertical_align_middle">{{getMember(app.approveReport.reportedBy, true)}}</td>
                      <td class="vertical_align_middle">{{df2(app.updatedAt)}}</td>
                      <!-- <td>{{getColumData(app.comment)}}</td> -->
                      <td v-html="getColumData(app.comment)"></td>
                      <td class="vertical_align_middle">{{getActionStatus(parseInt(app.actionType))}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- 承認履歴動的 -->
              
              <!-- <div class="no-margin pull-right">
                <button type="button" class="btn btn-primary" @click="readReportData">日次データ読み込み</button>
              </div> -->
               <!-- <div class="no-margin pull-left">
                <button type="button" class="btn btn-primary" @click="outPdf" v-bind:disabled="isDisabledPDF">PDFダウンロード</button>
              </div> -->
            </div>
            <div class="box-body">
              <div v-if="this.isAttendanceNull">
                <div class="box-header with-border">
                  <h2 class="box-title font_18 font_bold">業務項目件数</h2>
                </div>
                <div class="box-header margint_left_minus_10">
                  <table class="table table-bordered table-hover counts" v-for="coll in countList">
                    <thead>
                      <tr role="row">
                        <th>{{coll.label}}</th>
                        <th class="count_table">{{coll.count}}</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
              <div role="grid" v-for="cols in this.list">
                <div class="box-header with-border clear_left" v-if="showMajorItemGroup(cols)!=null">
                  <h2 class="box-title font_18 font_bold">{{showMajorItemGroup(cols)}}</h2>
                </div>
                <h3 class="box-title with-border font_18 clear_left">{{cols.label}}</h3>
                <table class="table table-bordered table-hover report" role="grid">
                  <thead>
                    <tr role="row">
                      <th style="width: 61px;" v-if="cols.columns">No.</th>
                      <th v-for="col in cols.columns">{{col.name}}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <!-- <tr role="row" v-for="col_data in cols.data_list" @click="$router.push(col_data.path)"> -->
                    <tr role="row" class="pointer_events_none" v-for="(col_data, index) in cols.data_list">
                      <td>{{index + 1}}</td>
                      <td v-for="col in col_data.columns" class="report break_word" v-html="getColumData(col.value)"></td>
                      <!-- <td v-for="col in col_data.columns" class="report break_word">{{col.value}}</td> -->
                      <!-- 改行含むテキストを表示する際、HTMLのソースコードの改行が影響するため一行で表記している -->
                    </tr>
                  </tbody>
                </table>
                <div v-for="image in cols.image_list" class="display_inline_block margin_right_15">
                  <div class="display_inline_block">No.{{getImageNo(image.id)}}:{{image.event}}</div>
                  <br/>
                  <img v-bind:id="'img_source_'+image.id" v-bind:src="imageHeaderUrl+image.value" class="img_thumbnail_report" data-toggle="modal" v-bind:data-target="'#modal'" @click="onImgClick(image.id)">
                </div>
                <div v-if="cols.sort==null&&isAttendanceNull==false">
                  <div class="box-header with-border">
                    <h2 class="box-title font_18 font_bold">業務項目件数</h2>
                  </div>
                  <div class="box-header margint_left_minus_10">
                    <table class="table table-bordered table-hover counts" v-for="col in countList">
                      <thead>
                        <tr role="row">
                          <th>{{col.label}}</th>
                          <!-- <th class="count_table">{{showCount(coll)}}</th> -->
                          <th class="count_table">{{col.count}}</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
            <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
            <div class="box-footer form_button_flex flex_right border_top">
              <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/report_approval/details/' + $route.params.report_id + '/' + item.id)">キャンセル</button>
              <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton" v-if="item.status!='2'">保存</button>
              <!-- <button type="button" class="btn btn-danger" @click="onDelete(api, '/report/' + $route.params.report_id)">削 除</button> -->
            </div>
            <!-- /.box-footer -->
          </form>
        </div>
        <!-- /.box-body -->
      </div>
    </section>
      <template>
        <modal-img-view　ref="child" :id="'modal'" :title="'拡大プレビュー'"></modal-img-view>
      </template>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
import ReportView from "~/components/ReportView";
import ModalImgView from '~/components/ModalImgView'
import StatusComponent from '~/components/StatusComponent'
import Loading from 'vue-loading-overlay';
import moment from 'moment'
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  data() {
    return {
      error: '',
      itemInfo: '',
      tmpUpdatedAt: '',
      fullpage: true,
      DatePickerFormat: 'yyyy/MM/dd',
      readReportFlag: true,
      download_check :true,
      members: {},
      allMembers: {},
      regdisabled: false,
      isDisabledPDF: true,
      list: [],
      countList: [],
      groupNames: [],
      reportObjectGroup: [],
      oldReportedAt: '',
      oldItem:{},
      requestDate: '',
      isAttendanceNull: false,
      reportSections: {},
      floors: '',
      approveReportReportObjects: {},
      approval: [],
      approvalAttendance: '',
      approveReports: '',
      request: {},
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
        categorylist:[],
        list: [],
        columns: [
          { name: '承認/差戻し', column: 'actionType', type: 'datePicker', required: true },
          // { name: '報告日', column: 'report_date', type: 'datePicker', required: true },
          // { name: '天候', column: 'weather', required: true, maxlength: 32 },
          // { name: '報告者', column: 'reporter', type: 'select' ,required: true, options: [] },
          // { name: '特記事項', column: 'notice', placeholder: '特記事項', type: 'textarea', maxlength: 512 },
          // { name: '依頼事項', column: 'comment', placeholder: '依頼事項', type: 'textarea', maxlength: 512 },
        ],
      },
      // api: '/reports',
      api: '/approve-reports',
    };
  },
  components: {
    ReportView,
    ModalImgView,
    StatusComponent,
    Loading
  },
  methods: {
    outPdf(){
      // if(this.checkDate()==false) return;
      document.report_form.token.value = localStorage.getItem('token');
      document.report_form.label_switch.value = localStorage.getItem('display_object_if_empty');
      document.report_form.buildingId.value = parseInt(localStorage.getItem('buildings_id'));
      document.report_form.buildingName.value = localStorage.getItem('buildings_name');
      document.report_form.report_id.value = this.item.reportId;
      document.report_form.reportDefinitionId.value = this.$route.params.report_id;
      document.report_form.operationReportTemplateId.value = this.item.operationReportTemplateId;
      // document.report_form.date.value = this.requestDate;this.changeDateFormat(this.item.reportedAt)
      const statuses = ['申請中','差戻し','再申請中','承認済','未申請'];
      if (this.item.status == undefined){
        document.report_form.status.value = statuses[4];
      }else{
        document.report_form.status.value = statuses[this.item.status-1];
      }
      document.report_form.date.value = this.changeDateFormat(this.item.reportedAt);
      document.report_form.buildingOwner.value = this.item.buildingOwner;
      if (this.item.status == 4) {
        document.report_form.approver.value = this.getMember(this.approval[0].memberId, false);
      } else {
        document.report_form.approver.value = " ";
      }
      document.report_form.isApproval.value = true;
      document.report_form.header.value = JSON.stringify(this.getHeaderInfo());
      document.report_form.allMembers.value = JSON.stringify(this.allMembers);
      document.report_form.approveAttendance.value = JSON.stringify(this.approveAttendances);
      document.report_form.approveReportSections.value = JSON.stringify(this.getApproveReportSections());
      document.report_form.reportSections.value = JSON.stringify(this.reportSections);
      document.report_form.floors.value = JSON.stringify(this.floors);
      document.report_form.method="post";
      document.report_form.submit();
    },
    getHeaderInfo() {
      return {
        id: this.item.reportId,
        reportedAt: this.item.reportedAt,
        weather: this.item.weather,
        buildingOwner: this.item.buildingOwner,
        member: {name: this.getMembersName(this.item.reportedBy)},
        notice: this.item.notice,
        comment: this.item.comment,
        createdAt: this.item.createdAt,
        updatedAt: this.item.updatedAt
      }
    },
    getApproveReportObject(approveReportReportObjects) {
      return {
        buildingId: approveReportReportObjects.buildingId,
        continuation: approveReportReportObjects.continuation,
        id: approveReportReportObjects.reportObjectId,
        reportFields: approveReportReportObjects.approveReportFields,
        reportObjectDefinitionId: approveReportReportObjects.reportObjectDefinitionId,
        reportedBy: approveReportReportObjects.reportedBy
      }
    },
    getApproveReportSections() {
      var report = this.reportSections;
      for (var i = 0; i < this.reportSections.length; i++) {
        if (this.reportSections[i].reportObjectDefinition != undefined) {
          report[i].reportObjectDefinition.reportObjectGroupDefinition = JSON.stringify(this.reportSections[i].reportObjectDefinition.reportObjectGroupDefinition);
          report[i].reportObjectDefinition.reportFieldDefinitions = JSON.stringify(this.reportSections[i].reportObjectDefinition.reportFieldDefinitions);
        
          delete this.reportSections[i].reportObjects;
          for (var j = 0; j < this.approveReportReportObjects.length; j++) {
            if (this.reportSections[i].reportObjectDefinition.id == this.approveReportReportObjects[j].approveReportObject.reportObjectDefinitionId) {
              if (this.reportSections[i].reportObjects == undefined) {
                report[i].reportObjects = [this.getApproveReportObject(this.approveReportReportObjects[j].approveReportObject)];
              } else {
                report[i].reportObjects.push(this.getApproveReportObject(this.approveReportReportObjects[j].approveReportObject));
              }
            }
          }
        } else {
          delete report[i];
        }
      }
      this.reportSections = report.filter(v => v);
      return this.reportSections;
    },
    checkDate(){
      if (this.item.reportedAt == null) {
        alert('報告日を選択してください');
        return false;
      }
        
      if (this.item.weather !=this.oldItem.weather) this.download_check = false;
      if (this.item.reportedAt !=this.oldItem.reportedAt) this.download_check = false;
      if (this.item.notice !=this.oldItem.notice) this.download_check = false;
      if (this.item.comment !=this.oldItem.comment) this.download_check = false;
      if (this.item.reportedBy !=this.oldItem.reportedBy) this.download_check = false;
      if(!this.download_check) {
        alert('詳細情報が編集されているため、日次データ読み込み後「更新」してから再度実行してください');
        return false;
      }
      return true;
    },
    onUpdateButton(){
      var api = '/reports/' + parseInt(this.item.reportId) + '/status';
      var request = {
        "memberId": parseInt(localStorage.getItem('member_id')),
        "actionType": this.request.actionType,
        "comment": this.request.comment
      }
      this.req(
        api,
        'post',
        request,
        (err, res) => {
          if (res && res.ok) {
            this.error = "";
            this.download_check = true;
            Object.assign(this.oldItem,this.item);
            this.itemInfo = "更新完了";
            setTimeout(() => (this.itemInfo = ""), 3000);
            this.item.status = res.body.approveReport.reportStatus;
            this.request = {};
            this.approval = this.reverseArray(res.body.approveLogs);
            this.tmpUpdatedAt = res.body.approveReport.updatedAt;
            if (res.body.approveReport.reportStatus == 4) {
              this.isDisabledPDF = false;
              this.request.actionType = 2;
            } else {
              this.isDisabledPDF = true;
            }
          } else if (err) {
            this.download_check = false;
            this.error = this.getErrorMsg2(res, this.param.columns);
          }
        }
      );
    },
    getAttendances(val) {
      var data_list = [];
      var attendances = '';
      if (val == undefined || val.length == 0) {
        this.isAttendanceNull = true;
        if (localStorage.getItem('display_object_if_empty') == "true") {
          attendances = {label: '勤務スタッフ 【勤務員無し】'};
        }
      } else {
        for (var i = 0; i < val.length; i++) {
          var columns = [];
          var path = '/attendance/details/' + val[i].id;
          columns.push({value: this.df2(val[i].attendedAt)});
          columns.push({value: this.df2(val[i].leftAt)});
          columns.push({value: this.getWorkShift(val[i].workShift)});
          columns.push({value: this.getMember(val[i].memberId)});
          data_list.push({path, columns});
        }
        attendances = {label: '勤務スタッフ', columns: [{ name: "出勤時間" },{ name: "退勤時間" },{ name: "シフト" },{ name: "メンバー名" }], data_list};
      }
      if(!attendances=='') this.list.push(attendances);
    },
    getColumData(val) {
      if (val == null || val == "") {
        return '---'
      }
      if (val.label != null) {
        return val.label;
      }
      if (val.name != null) {
        return val.name;
      }
      if (!isNaN(val)){
        return val; 
      }
      //return val;
      return val.replace(/\r?\n/g, '<br>');
    },
    getColumnsData(val, reportObjectDefinition, cnt) {
      var data = [];
      for (var i = 0; i < reportObjectDefinition.reportObjectDefinition.reportFieldDefinitions.length; i++) {
        if (!reportObjectDefinition.reportObjectDefinition.reportFieldDefinitions[i].availableForReport) {
          continue;
        }
        //var report = val.reportObjects[cnt].reportFields.find( (v) => v.reportFieldDefinitionId === val.reportObjectDefinition.reportFieldDefinitions[i].id )
        var report = val[cnt].approveReportObject.approveReportFields.find( (v) => v.reportFieldDefinitionId === reportObjectDefinition.reportObjectDefinition.reportFieldDefinitions[i].id )
        if (report==null){
          // data.push({value:"---"});
        }else{
          switch (reportObjectDefinition.reportObjectDefinition.reportFieldDefinitions[i].type) {
            case 1:
            case 6:
              if (!reportObjectDefinition.reportObjectDefinition.reportFieldDefinitions[i].name.includes("URL")){
                data.push({value: this.getColumData(report.textValue)});
              }
              break;
            case 2:
              data.push({value: this.getColumData(this.df2(report.dateValue))});
              break;
            case 3:
              data.push({value: this.getColumData(report.numberValue)});
              break;
            case 4:
              data.push({value: this.getSelectValue(report.reportObjectDefinitionId, report.selectOptionDefinitionId)});
              break;
            case 5:
              data.push({value: this.getMember(report.memberId)});
              break;
            case 8:
            case 9:
              data.push({value: this.getColumData(this.displayFloorFormat(this.getExtractFloorsData(this.getReportFieldFloors(report.approveReportFieldFloors)), null, true))});
            default:
              break;
          }
        }
      }
      return data;
    },
    getReportFieldFloors(approveFloors) {
      if (approveFloors != undefined) {
        for (var i = 0; i < approveFloors.length; i++) {
          for (var j = 0; j < this.floors.length; j++) {
            if (approveFloors[i].floorId == this.floors[j].id) {
              approveFloors[i].floor = this.floors[j];
            }
          }
        }
        return approveFloors;
      }
      return '';      
    },
    getSelectValue(reportId, selectId) {
      for (var i = 0; i < this.reportSections.length; i++) {
        if (this.reportSections[i].reportObjectDefinition.id == reportId) {
          for (var j = 0; j < this.reportSections[i].reportObjectDefinition.reportFieldDefinitions.length; j++) {
            if (this.reportSections[i].reportObjectDefinition.reportFieldDefinitions[j].selectOptionDefinitions != undefined) {
              var find = this.reportSections[i].reportObjectDefinition.reportFieldDefinitions[j].selectOptionDefinitions.find(value => value.id == selectId);
              if (find != undefined) {
                return find.label;
              }
            }
          } 
        }
      }
    },
    getReportFiledDefinition(val) {
      var data = [];
      // NOTE: 大項目データ項目定義回数ループ
      for (var i = 0; i < val.reportObjectDefinition.reportFieldDefinitions.length; i++) {
        if (val.reportObjectDefinition.reportFieldDefinitions[i].type != 7 && val.reportObjectDefinition.reportFieldDefinitions[i].type != 10 && val.reportObjectDefinition.reportFieldDefinitions[i].availableForReport == true){
          if (!val.reportObjectDefinition.reportFieldDefinitions[i].name.includes("URL")){
            data.push({name: val.reportObjectDefinition.reportFieldDefinitions[i].name});
          }
        }
      }
      return data;
    },
    sortReportObject(reportObjectDefinition, val) {
      var findReportExtractField = reportObjectDefinition.reportObjectDefinition.reportFieldDefinitions.find(val => val.reportExtractField == true);
      val.sort(function(a, b) {
        if (a.approveReportObject.approveReportFields[findReportExtractField.fieldIndex].dateValue < b.approveReportObject.approveReportFields[findReportExtractField.fieldIndex].dateValue) {
          return -1;
        } else {
          return 1
        }
      });
    },
    getReportData(reportObjectDefinition, val) {
      this.sortReportObject(reportObjectDefinition, val);
      var data_list = [];
      // NOTE: 大項目データ回数ループ
      var image_list = [];        
      for (var i = 0; i < val.length; i++) {
        //var path = '/majoritems/' + this.$route.params.report_id + '/' + val.reportObjects[i].reportObjectDefinitionId + '/details/' + val.reportObjects[i].id;
        var path = ''
        var columns = this.getColumnsData(val, reportObjectDefinition, i);
        var dateValue = ""
        var eventName = ""
        var imageUrl = ""
        var id = 0
        for (var j = 0; j < val[i].approveReportObject.approveReportFields.length; j++) {
          if (val[i].approveReportObject.approveReportFields[j].reportFieldDefinitionId == 170 || val[i].approveReportObject.approveReportFields[j].reportFieldDefinitionId == 181){
            eventName = val[i].approveReportObject.approveReportFields[j].textValue;
          }
          for (var k = 0; k < reportObjectDefinition.reportObjectDefinition.reportFieldDefinitions.length; k++){
            if (reportObjectDefinition.reportObjectDefinition.reportFieldDefinitions[k].id == val[i].approveReportObject.approveReportFields[j].reportFieldDefinitionId) {
              if (reportObjectDefinition.reportObjectDefinition.reportFieldDefinitions[k].type == 2){
                dateValue = this.df2(val[i].approveReportObject.approveReportFields[j].dateValue);
              } else if (reportObjectDefinition.reportObjectDefinition.reportFieldDefinitions[k].type == 7){
                if (val[i].approveReportObject.approveReportFields[j].textValue != null){
                  imageUrl = val[i].approveReportObject.approveReportFields[j].textValue;
                  id = j;
                }
              }         
            }
          }
        }
        if (imageUrl != "") {
          image_list.push({value: imageUrl, id:i+"_"+val[i].approveReportObject.id+"_"+id, date: dateValue,event: eventName});
        }

       data_list.push({path, columns});
      }
      var data = {label: reportObjectDefinition.reportObjectDefinition.name, sort: reportObjectDefinition.reportObjectDefinition.id, columns: this.getReportFiledDefinition(reportObjectDefinition), data_list: data_list,image_list: image_list};
      // var data = {label: reportObjectDefinition.reportObjectDefinition.name, sort: reportObjectDefinition.reportObjectDefinition.sort, columns: this.getReportFiledDefinition(reportObjectDefinition), data_list: data_list,image_list: image_list};
      return data;
    },
    onImgClick(tag){
      var images = document.getElementById("img_source_"+tag);
      var imgSrc = images.src
      this.$refs.child.showImage(imgSrc)
    },
    getReportSections(operationId, val) {
      if (operationId == undefined){
        operationId = 1;
      }
      var reportObject = [];
      var reportData = {};
      var reportObjects = this.getReportObjects(operationId);
      var displayList = {};
      var that = this;
      // reportObjects.majoritems.sort(function(a,b){
      //   if(a.id < b.id) return -1;
      //   if(a.id > b.id) return 1;
      //   return 0;
      // });
      reportObjects.majoritems.forEach(function(category) {
        // that.groupNames.push({"groupName": category.name, "columnName": category.reportObjectDefinitions[0].sort})
        category.reportObjectDefinitions.forEach(function(obj) {
          var countValue = that.getReportObjectCount(obj.id, val);
          that.countList.push({label: obj.name, sort: obj.sort, count: countValue});
          if (countValue == 0) {
            if (localStorage.getItem('display_object_if_empty') == "true") {
              reportData = {label: obj.name + ' 【報告事項無し】', sort: obj.id};
            }
          } else {
            reportData = that.getReportData(that.getReportObjectDefinition(obj.id), that.getReportObject(obj.id, val));
          }
          if (Object.keys(reportData).length != 0) {
            that.setMajorItemGroup(reportData);
            that.list.push(reportData);
            reportData = {};
          }

        });
      });
      // this.countList.sort(function(a,b){
      //   if(a.sort < b.sort) return -1;
      //   if(a.sort > b.sort) return 1;
      //   return 0;
      // });
      // this.list.sort(function(a,b){
      //   if(a.sort < b.sort) return -1;
      //   if(a.sort > b.sort) return 1;
      //   return 0;
      // });
    },
    getReportObjectDefinition(operationCategoryId) {
      var found = this.reportSections.find(function(ele){
        if (ele.reportObjectDefinition != null) {
          if (ele.reportObjectDefinition.id == operationCategoryId) {
            return ele;
          }
        }
      });
      if (found != null) return found;
    },
    getOperationId(templateId) {
      var templateList = JSON.parse(localStorage.getItem('template_list'));
      var found = templateList.find(ele => ele.templateId == templateId);
      if (found != null) return found.operationCategoryId;
    },
    removeNullReportSections(reportSections) {
      var ret = [];
      for (var i = 0; i < reportSections.length; i++) {
        if (reportSections[i].reportObjectDefinition != undefined) {
          ret.push(reportSections[i]);
        }
      }
      return ret;
    },
    convertReportList(reportSections, reportList) {
      var majoritems = [];
      var convertReportList = reportList;
      for (var i = 0; i < reportList.majoritems.length; i++) {
        var filter = reportSections.filter(data =>  data.reportObjectDefinition.reportObjectGroupDefinition.id == reportList.majoritems[i].id);
        var reportObjectDefinitions = [];
        for (var j = 0; j < filter.length; j++) {
          reportObjectDefinitions.push({id: filter[j].reportObjectDefinition.id, name: filter[j].reportObjectDefinition.name, operationCategoryId: filter[j].reportObjectDefinition.operationCategoryId, path: '/majoritems/' + filter[j].reportObjectDefinition.id, sort: filter[j].reportObjectDefinition.sort})
        }
        convertReportList.majoritems[i].reportObjectDefinitions = reportObjectDefinitions;
      }
      return convertReportList;
    },
    getReportObjects(operationId) {
      var reportList = JSON.parse(localStorage.getItem('report_list'));
      var found = reportList.find(ele => ele.id == operationId);
      if (found != null) {
        return this.convertReportList(this.removeNullReportSections(this.reportSections), found);
      }
      // if (found != null) return found;
    },
    getTemplateId(operationCategoryId) {
      this.item.operationReportTemplateId = operationCategoryId;
      this.getReportInfoRequest();
    },
    getReportObject(reportObjectId, val) {
      var found = val.filter(ele => ele.approveReportObject.reportObjectDefinitionId == reportObjectId);
      return found;
    },
    getReportObjectCount(reportObjectId, val) {
      if (val == undefined) return 0;
      var found = val.filter(ele => ele.approveReportObject.reportObjectDefinitionId == reportObjectId);
      return found.length;
    },
    getReportsPreview(reportTemplateId, date, data){
      // NOTE: 入力年月日 + 業務日付切替時間
      var searchDate = date;
      this.requestDate = searchDate;
      var api = '/reports/preview?reportDefinitionId=' + this.$route.params.report_id + '&operationCategoryId=' + reportTemplateId + '&buildingId=' + localStorage.getItem('buildings_id') + '&date=' + date;
      this.req(api, 'get', null, (err, res) => {
        if (res.body) {
          // this.getAttendances(res.body.attendances);
          // this.getReportSections(res.body.reportSections);
          this.getApprovalLogs(data, res.body.reportSections);
        }
      });
    },
    readReportData() {
      if (this.item.reportedAt == null) {
        alert('報告日を選択してください');
        return;
      }
      if (this.list.length === 0) {
        this.getTemplateId(this.$route.params.report_id);
      }
      this.readReportFlag = true;
    },
    getRows(text) {
      if (text == undefined || text == null) {
        return 1;
      }
      return text.split("\n").length;
    },
    getImageNo(id) {
      return parseInt(id.substring(0, id.indexOf("_"))) + 1;
    },
    getMembersInfoRequest(){
      let buildingId = localStorage.getItem('buildings_id');
      let api = '/buildings/'+ buildingId +'/members';
      var where = {"and":[{"operationTypeId": this.getOperationTypeId(this.$route.params.report_id)}, {"role":{"neq":3}}]};
      var member = [];
      this.onSearch('/buildings/'+ buildingId, null, null, buil => {
        this.floors = buil.floors;
        this.onSearch(api, null, where, val => {
          val.forEach(function(obj){
            member.push({name: obj.name, value: obj.id});
          });
          this.members = member;

          this.getTemplateId(this.$route.params.report_id);
          //this.getReportInfoRequest();
        }); 
      });
      
    },
    getMembersAllRequest(){
      let buildingId = localStorage.getItem('buildings_id');
      let api = '/buildings/'+ buildingId +'/members';
      var where = {"and":[{"operationTypeId": this.getOperationTypeId(this.$route.params.report_id)}]};
      var member = [];
      this.onSearch(api, null, where, val => {
        val.forEach(function(obj){
          member.push({id: obj.name, name: obj.name, value: obj.id});
        });
        this.allMembers = member;
      }); 
    },
    setReportTitle() {
      var report_list = JSON.parse(localStorage.getItem('report_list'));
      for (var i = 0; i < report_list.length; i++) {
        if (report_list[i].id == this.$route.params.report_id) {
          this.param.title = '日報承認';
          this.param.operation = report_list[i].name.replace(/報告書/g, '');
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
    getMember(val) {
      for (var i = 0; i < this.allMembers.length; i++) {
        if (this.allMembers[i].value == val) {
          return this.allMembers[i].name;
        }
      }
    },
    getApprovalLogs(data, reportSections) {
      this.req('/reports/' + data.reportId, 'get', null, (err, res) => {
        this.approval = this.reverseArray(res.body.approveLogs);
        this.item.status = res.body.approveReport.reportStatus;
        this.reportSections = reportSections;
        this.approveReportReportObjects = (data.approveReportReportObjects == undefined) ? [] : data.approveReportReportObjects;
        this.tmpUpdatedAt = data.updatedAt;
        this.oldReportedAt = data.reportedAt;
        this.approveAttendances = (data.approveAttendances == undefined) ? [] : data.approveAttendances;
        this.getAttendances(data.approveAttendances);
        this.getReportSections(this.$route.params.report_id, this.approveReportReportObjects);
      });
    },
    getReportInfoRequest() {
      var api = '/approve-reports';
      this.onRead(api, '', data => {
        this.item = data;
        if (data.reportStatus == 4) {
          this.isDisabledPDF = false;
          this.request.actionType = "2";
        }
        Object.assign(this.oldItem,data.report);
        this.getReportsPreview(this.$route.params.report_id, this.changeDateFormat(this.item.reportedAt), data);
        //this.getApprovalLogs(data, reportSections);
      });
    },
    setMajorItemGroup(reportData){
      var groupName = null
      var reportList = JSON.parse(localStorage.getItem('report_list'));
      
      reportList.forEach((job) => {
        var groups = job.majoritems;
        groups.forEach((group) => {
          // var first = group.reportObjectDefinitions[0]
          if (group.reportObjectDefinitions != null){
            group.reportObjectDefinitions.forEach((reportObjectDefinition) => {
              if (reportData.sort == reportObjectDefinition.id) {
                const include = this.groupNames.find((v) => v.groupName === group.name);
                if (include == undefined){
                  this.groupNames.push({"columnId":reportData.sort,"groupName":group.name});
                  groupName = group.name;                
                }
              }
            })
          }
        })
      })
    },
    showMajorItemGroup(cols){
      var groupName = null;
      this.groupNames.forEach((group) => {
        if (group.columnId == cols.sort){
          groupName = group.groupName;
        }
      })
      return groupName;
    },
    showCount(cols){
      if (cols.data_list == null){
        return 0
      } else {
        return cols.data_list.length
      }
    },
    getMembersName(id) {
      for (var i = 0; i < this.members.length; i++) {
        if (id == this.members[i].value) {
          return this.members[i].name;
        }
      }
    }
  },
  created() {
    const key = (parseInt(this.$route.params.report_id) == 1) ? "Security:ApproveReport:update" : "Cleaning:ApproveReport:update";
    this.checkDisplayPermission(key, () => {
      this.setReportTitle();
      this.getMembersInfoRequest();
      this.getMembersAllRequest();
      this.param.categorylist = localStorage.getItem('report_list');
    });
  },
  mounted() {
    document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
  },
  watch: {
    item: {
      handler(val) {
        if (this.oldReportedAt !== val.reportedAt) {
          this.list = [];
          this.countList = [];
          this.isAttendanceNull = false;
          this.readReportFlag = false;
          this.error = '';
        }
        this.oldReportedAt = val.reportedAt;
      },
      deep: true,
    }
  },
};
</script>
