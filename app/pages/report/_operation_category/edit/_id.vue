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
          <!-- <div class="button_header_btn">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/report/edit/' + $route.params.report_id + '/' + item.id)">編集</button>
          </div> -->
        </div>
      </div>
    </section>

    <!-- <section class="content-header">
      <h1>
        {{param.title}}編集
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-default width_140" @click="onTransitionButton('/report/' + $route.params.operation_category + '/details/' + item.id)">キャンセル</button>
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
                  <label class="control-label">ID</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{item.id}}
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group" v-if="isHeadquartersMode">
                <div class="form_box_group_title">
                  <label class="control-label">ビル</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    {{getBuildingName(item.buildingId)}}
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

              <div class="form-group form_box_group" v-if="param.isApply">
                <div class="form_box_group_title">
                  <label class="control-label">ステータス</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    <span v-bind:is="'StatusComponent'" :value="item.status"></span>
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group required">
                <div class="form_box_group_title">
                  <label class="control-label">天候</label>
                </div>
                <div class="form_box_group_field">
                  <input type="text" maxlength="32" class="form-control" v-model="item.weather"> 
                </div> 
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">ビルオーナー</label>
                </div>
                <div class="form_box_group_field">
                  <input type="text" maxlength="64" class="form-control" v-model="item.buildingOwner"> 
                </div>
              </div>

              <div class="form-group form_box_group required">
                <div class="form_box_group_title">
                  <label class="control-label">報告責任者</label>
                </div>
                <div class="form_box_group_field">
                  <select class="form-control" v-model="item.reportedBy">
                    <option v-bind:value="opt.value" v-for="opt in members">{{opt.name}}</option>
                  </select>
                </div>
              </div>

              <div class="form-group form_box_group ">
                <div class="form_box_group_title">
                  <label class="control-label">特記事項</label>
                </div>
                <div class="form_box_group_field flex_textarea">
                  <div class="flex_textarea_dummy" aria-hidden="true">{{item.notice}}</div>
                  <textarea id="FlexTextarea" class="flex_textarea_textarea form-control" maxlength="512" placeholder="※改行で複数行入力可" v-model="item.notice" :rows="getRows(item.notice)">{{item.notice}}</textarea>
                </div>
              </div>

              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">依頼事項</label>
                </div>
                <div class="form_box_group_field flex_textarea">
                  <div class="flex_textarea_dummy" aria-hidden="true">{{item.comment}}</div>
                  <textarea id="FlexTextarea" class="flex_textarea_textarea form-control" maxlength="512" placeholder="※改行で複数行入力可" v-model="item.comment" :rows="getRows(item.comment)">{{item.comment}}</textarea>
                </div>
              </div>
              <input type="hidden" v-model="this.item.id" name="report_id"/>
              <input type="hidden" name="token"/>
              <input type="hidden" name="label_switch"/>
              <input type="hidden" v-model="this.param.title" name="report_title"/>
              <input type="hidden" v-model="this.param.categorylist" name="list"/>
              <input type="hidden" name="buildingName"/>
              <input type="hidden" name="buildingId"/>
              <input type="hidden" name="buildingOwner"/>
              <input type="hidden" name="status"/>
              <input type="hidden" name="approver"/>
              <input type="hidden" name="reportDefinitionId"/>
              <input type="hidden" name="operationReportTemplateId"/>
              <input type="hidden" name="allMembers"/>
              <input type="hidden" name="header"/>
              <input type="hidden" name="isApproval"/>
              <input type="hidden" name="approveAttendance"/>
              <input type="hidden" name="approveReportSections"/>
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

              <div class="box-body padding_0 margin_bottom_10" v-if="checkItemPermission(permissionKey)">
                <div class="box-header with-border margin_bottom_10">
                  <h2 class="box-title font_18">本部コメント</h2>※ 報告書非表示
                </div>
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">コメント</label>
                  </div>
                  <div class="form_box_group_field flex_textarea padding_right_0">
                    <div class="flex_textarea_dummy" aria-hidden="true">{{headquartersComment}}</div>
                    <textarea id="FlexTextarea" class="flex_textarea_textarea form-control" v-model="headquartersComment" v-bind:maxlength="512" v-bind:placeholder="'※改行で複数行入力可'"></textarea>
                  </div>
                </div>
              </div>

              <div class="box-body padding_0 margin_bottom_10" v-if="param.isApply">
                <div class="box-header with-border margin_bottom_10">
                  <h2 class="box-title font_18">申請コメント</h2>※ 報告書非表示
                </div>
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">コメント</label>
                  </div>
                  <div class="form_box_group_field flex_textarea padding_right_0">
                    <div class="flex_textarea_dummy" aria-hidden="true"></div>
                    <textarea id="FlexTextarea" class="flex_textarea_textarea form-control" v-model="item['approveComment']" v-bind:maxlength="512" v-bind:placeholder="'※改行で複数行入力可'"></textarea>
                  </div>
                </div>
              </div>
              <!-- 承認履歴動的 -->
              <div v-if="item.status && param.isApply">
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
                      <td class="vertical_align_middle">{{getMember(app.memberId, true)}}</td>
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
            </div>
            <div class="box-body">
              <div v-if="this.isAttendanceNull">
                  <div class="box-header with-border">
                    <h2 class="box-title font_18 font_bold">業務項目件数</h2>
                  </div>
                  <div class="box-header margint_left_minus_10">
                    <table class="table table-bordered table-hover counts" v-for="col in countList">
                      <thead>
                        <tr role="row">
                          <th>{{col.label}}</th>
                          <th class="count_table">{{showCount(col)}}</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
              </div>
              <div role="grid" v-for="cols in this.list" v-if="readReportFlag">
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
                    <tr role="row" v-for="(col_data, index) in cols.data_list" @click="$router.push(col_data.path)" v-if="!isHeadquartersMode">
                      <td>{{index + 1}}</td>
                      <td v-for="col in col_data.columns" class="report break_word" v-html="getColumData(col.value)"></td>
                      <!-- 改行含むテキストを表示する際、HTMLのソースコードの改行が影響するため一行で表記している -->
                    </tr>
                    <tr role="row" v-for="(col_data, index) in cols.data_list" v-if="isHeadquartersMode">
                      <td>{{index + 1}}</td>
                      <td v-for="col in col_data.columns" class="report break_word" style="pointer-events: none;" v-html="getColumData(col.value)"></td>
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
                          <th class="count_table">{{showCount(col)}}</th>
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
              <button type="button" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" @click="onDeleteFunc()">削除</button>
              <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/report/' + $route.params.operation_category + '/details/' + item.id)">キャンセル</button>
              <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton('temporary')" v-if="param.isApply">仮保存</button>
              <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton('main')" v-if="item.status && param.isApply">保存して再申請</button>
              <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton('main')" v-if="!item.status && param.isApply">保存して申請</button>
              <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton('main')" v-if="!param.isApply">保存</button>
            </div>
            <!-- /.box-footer -->
          </form>
        </div>
        <!-- /.box-body -->
      </div>
      <!-- /.box -->
    </section>
    <template>
      <modal-img-view　ref="child" :id="'modal'" :title="'拡大プレビュー'"></modal-img-view>
    </template>
    <template>
      <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert" @onconfirm="postReportRequest"></modal-alert-view>
    </template>
    <template>
      <modal-alert-view　ref="alert2" :id="'modal_alert2'" :param="alert" @onconfirm="deleteFunc"></modal-alert-view>
    </template>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
import ReportView from "~/components/ReportView"
import ModalImgView from '~/components/ModalImgView'
import ModalAlertView from '~/components/ModalAlertView'
import StatusComponent from '~/components/StatusComponent'
import Loading from 'vue-loading-overlay';
import moment from 'moment'
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  data() {
    return {
      error: '',
      permissionKey: '',
      itemInfo: '',
      tmpUpdatedAt: '',
      isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
      DatePickerFormat: 'yyyy/MM/dd',
      readReportFlag: true,
      download_check :true,
      members: {},
      allMembers: {},
      regdisabled: false,
      list: [],
      countList: [],
      groupNames: [],
      groupList: [],
      reportObjectGroup: [],
      oldReportedAt: '',
      oldItem:{},
      requestDate: '',
      isAttendanceNull: false,
      isChangeReportedAt: false,
      approval: [],
      item: '',
      headquartersComment: '',
      headquartersCommentId: '',
      buildingId: '',
      buildingName: '',
      isDisplay: '',
      fullpage: true,
      alert: {
        title: 'test',
        message: '',
        note: '',
        isConfirm: ''
      },
      request: {},
      buildingTemplates: [],
      businessStartTime: '',
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
        isApply: this.toBoolean(localStorage.getItem('is_apply')), // 申請フラグ(仮) 
        categorylist:[],
        list: [],
        columns: [
          { name: '報告日', column: 'report_date', type: 'datePicker', required: true },
          { name: '天候', column: 'weather', required: true, maxlength: 32 },
          { name: '報告責任者', column: 'reporter', type: 'select' ,required: true, options: [] },
          { name: '特記事項', column: 'notice', placeholder: '特記事項', type: 'textarea', maxlength: 512 },
          { name: '依頼事項', column: 'comment', placeholder: '依頼事項', type: 'textarea', maxlength: 512 },
          { name: 'ビルオーナー', column: 'buildingOwner', required: true, maxlength: 64 },
        ],
      },
      api: '/reports',
    };
  },
  components: {
    ReportView,
    ModalImgView,
    ModalAlertView,
    StatusComponent,
    Loading
  },
  methods: {
    outPdf(){
      if(this.checkDate()==false) return;
      document.report_form.token.value = localStorage.getItem('token');
      document.report_form.label_switch.value = this.isDisplay;
      document.report_form.buildingId.value = parseInt(this.buildingId);
      document.report_form.buildingName.value = this.buildingName;
      // document.report_form.report_id.value = this.$route.params.report_id;
      document.report_form.reportDefinitionId.value = this.$route.params.id;
      const statuses = ['申請中','差戻し','再申請中','承認済','未申請'];
      if (this.item.status == undefined){
        document.report_form.status.value = statuses[4];
      }else{
        document.report_form.status.value = statuses[this.item.status-1];
      }
      document.report_form.operationReportTemplateId.value = this.item.operationCategoryId;
      document.report_form.date.value = this.requestDate;
      document.report_form.buildingOwner.value = this.item.buildingOwner;

      if (this.item.status == 4) {
        document.report_form.approver.value = this.getMember(this.approval[0].memberId, false);
      } else {
        document.report_form.approver.value = " ";
      }
      document.report_form.isApproval.value = false;
      document.report_form.method="post";
      document.report_form.submit();
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
      if (this.item.buildingOwner !=this.oldItem.buildingOwner) this.download_check = false;
      if(!this.download_check) {
        alert('詳細情報が編集されているため、日次データ読み込み後「更新」してから再度実行してください');
        return false;
      }
      return true;
    },
    onUpdateButton(mode) {
      this.error = '';
      if (!this.readReportFlag) {
        alert('日次データが読み込まれていません')
        return;
      }
      // NOTE:登録済みチェック
      this.regdisabled = true; //NOTE:更新ボタンの活性状況制御
      var reportedAtStart = this.getReportedRangeTime(this.item.reportedAt, this.businessStartTime, true);
      var reportedAtEnd = this.getReportedRangeTime(this.item.reportedAt, this.businessStartTime, false);
      var count_cond = {
        and:[
          {reportedAt:{ gte:this.df_utc(reportedAtStart)}},
          {reportedAt:{ lte:this.df_utc(reportedAtEnd)}},
          {operationCategoryId: this.item.operationCategoryId},
          {reportDefinitionId: this.$route.params.id},
          {id:{neq: this.item.id}}
        ]
      };
      if (this.isChangeReportedAt) {
        this.onCount('/buildings/' + parseInt(this.buildingId) + '/reports', count_cond, (res) => {
          if (res.count > 0) {
            this.error = 'この日付の'+this.param.title + 'は既に登録されています';
            return;
          } else {
            this.getBuildingInfoRequest(mode, parseInt(this.buildingId));
          }
        })
      } else {
        this.getBuildingInfoRequest(mode, parseInt(this.buildingId));
      }
      
      this.regdisabled = false; //NOTE:更新ボタンの活性状況制御
    },
    headquartersCommentRequest() {
      if (this.headquartersComment != '') {
        // 本部コメントのリクエスト処理(post)
        var request = {
          "comment": this.headquartersComment,
          "reportId": parseInt(this.$route.params.id)
        }
        this.req('/report/'+this.$route.params.id+'/comments', 'get', null, (err, res) => {
          if (res.body.length == 0) {
            this.req('/comments', 'post', request, (err, res) => {
            });
          } else {
            this.req('/comments/' + parseInt(this.headquartersCommentId), 'patch', request, (err, res) => {
            });
          }
        });
      }
    },
    getBuildingInfoRequest(mode, buildingId) {
      this.req('/buildings/' + buildingId, 'get', null, (err, res) => {
        if (res.body) {
          this.updateReport(mode, res.body.buildingSetting.approveNotificationActive);
        }
      });
    },
    updateReport(mode, approveNotificationActive){
      //this.item.reportedAt = this.getReportedRangeTime(this.item.reportedAt, this.businessStartTime, true);
      var request = {
        weather: this.item.weather,
        reportedAt: this.item.reportedAt,
        notice: (this.item.notice == null) ? "" : this.item.notice,
        comment: (this.item.comment == null) ? "" : this.item.comment,
        reportedBy: this.item.reportedBy,
        buildingId: parseInt(this.item.buildingId),
        operationCategoryId: this.item.operationCategoryId,
        approveComment: this.item.approveComment,
        buildingOwner: this.item.buildingOwner
      }
      this.request = request;
      if (mode == 'main') {
        if (approveNotificationActive) {
          if (this.item.status) {
            this.alert.title = '';
            this.alert.message = this.param.title + "の更新と再申請を同時におこないます。<br>ビルオーナーに申請通知メールが送信されますが、続行してよろしいですか？<br>";
            this.alert.note = "※申請をおこなわずに更新のみおこなう場合は、[キャンセル]をクリック後、<br>[仮更新]をクリックしてください。"
            this.alert.isConfirm = true;
            $('#modal_alert').modal('show')
            // if (!confirm(this.param.title + "の更新と再申請を同時におこないます。\nビルオーナーに申請通知メールが送信されますが、続行してよろしいですか？\n※申請をおこなわずに更新のみおこなう場合は、[キャンセル]をクリック後、\n[仮更新]をクリックしてください。")) {
            //   return;
            // }
          } else {
            this.alert.title = '';
            this.alert.message = this.param.title + "の更新と申請を同時におこないます。<br>ビルオーナーに申請通知メールが送信されますが、続行してよろしいですか？<br>";
            this.alert.note = "※申請をおこなわずに更新のみおこなう場合は、[キャンセル]をクリック後、<br>[仮更新]をクリックしてください。"
            this.alert.isConfirm = true;
            $('#modal_alert').modal('show')
            // if (!confirm(this.param.title + "の更新と申請を同時におこないます。\nビルオーナーに申請通知メールが送信されますが、続行してよろしいですか？\n※申請をおこなわずに更新のみおこなう場合は、[キャンセル]をクリック後、\n[仮更新]をクリックしてください。")) {
            //   return;
            // }
          }
          
        } else {
          if (this.item.status) {
            this.alert.title = '';
            this.alert.message = this.param.title + "の更新と再申請を同時におこないます。<br>続行してよろしいですか？<br>";
            this.alert.note = "※申請をおこなわずに更新のみおこなう場合は、[キャンセル]をクリック後、<br>[仮更新]をクリックしてください。"
            this.alert.isConfirm = true;
            $('#modal_alert').modal('show')
            // if (!confirm(this.param.title + "の更新と再申請を同時におこないます。\n続行してよろしいですか？\n※申請をおこなわずに更新のみおこなう場合は、[キャンセル]をクリック後、\n[仮更新]をクリックしてください。")) {
            //   return;
            // }
          } else {
            this.alert.title = '';
            this.alert.message = this.param.title + "の更新と申請を同時におこないます。<br>続行してよろしいですか？<br>";
            this.alert.note = "※申請をおこなわずに更新のみおこなう場合は、[キャンセル]をクリック後、<br>[仮更新]をクリックしてください。"
            this.alert.isConfirm = true;
            $('#modal_alert').modal('show')
            // if (!confirm(this.param.title + "の更新と申請を同時におこないます。\n続行してよろしいですか？\n※申請をおこなわずに更新のみおこなう場合は、[キャンセル]をクリック後、\n[仮更新]をクリックしてください。")) {
            //   return;
            // }
          }
        }
        this.request.apply = true;
      } else if (mode == 'temporary') {
        if (this.item.approveComment != null && this.item.approveComment != '') {
          this.alert.title = '';
          this.alert.message = "報告書の更新(申請しない)のみのため、「申請コメント」は登録されません。<br>このまま「申請コメント」を登録せず更新しますか？";
          this.alert.note = ""
          this.alert.isConfirm = true;
          $('#modal_alert').modal('show')
          // if (!confirm("報告書の更新(申請しない)のみのため、「申請コメント」は登録されません。\nこのまま「申請コメント」を登録せず更新しますか？")) {
          //   return;
          // }
        } else {
          this.postReportRequest();
        }
        this.request.apply = false;
      }
    },
    postReportRequest() {
      this.onUpdate(
        this.api,
        this.request,
        (err, res) => {
          if (res && res.ok) {
            this.headquartersCommentRequest();
            this.error = "";
            this.download_check = true;
            Object.assign(this.oldItem,this.item);
            this.itemInfo = "更新完了";
            setTimeout(() => (this.itemInfo = ""), 3000);
            if (res.body.approveLogs != undefined) {
              this.approval = this.reverseArray(res.body.approveLogs);
            }
            if (res.body.approveReport != undefined) {
              this.item.status = res.body.approveReport.reportStatus;
            }
            this.item['approveComment'] = '';
            this.tmpUpdatedAt = res.body.report.updatedAt;
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
      if (val.length == 0) {
        this.isAttendanceNull = true;
        if (this.isDisplay) {
          attendances = {label: '勤務スタッフ 【勤務員無し】'};
        }
      } else {
        for (var i = 0; i < val.length; i++) {
          var columns = [];
          var path = '/attendance/' + this.$route.params.id + '/details/' + val[i].id;
          columns.push({value: this.df2(val[i].attendedAt)});
          columns.push({value: this.df2(val[i].leftAt)});
          columns.push({value: this.getWorkShift(val[i].workShift)});
          var memberName = "---";
          if (val[i].member != null) {
            memberName = val[i].member.name;       
          }
          columns.push({value: memberName });
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
      //return val;
      if (!isNaN(val)){
        return val; 
      }
            
      return val.replace(/\r?\n/g, '<br>');
    },
    getColumnsData(val, cnt) {
      var data = [];
      for (var i = 0; i < val.reportObjectDefinition.reportFieldDefinitions.length; i++) {
        if (!val.reportObjectDefinition.reportFieldDefinitions[i].availableForReport) {
          continue;
        }
        var report = val.reportObjects[cnt].reportFields.find( (v) => v.reportFieldDefinitionId === val.reportObjectDefinition.reportFieldDefinitions[i].id )
        if (report==null){
          // data.push({value:"---"});
        }else{
          switch (val.reportObjectDefinition.reportFieldDefinitions[i].type) {
            case 1:
            case 6:
              if (!val.reportObjectDefinition.reportFieldDefinitions[i].name.includes("URL")){
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
              data.push({value: this.getColumData(report.selectOptionDefinition)});
              break;
            case 5:
              data.push({value: this.getColumData(report.member)});
              break;
            case 8:
            case 9:
              data.push({value: this.getColumData(this.displayFloorFormat(this.getExtractFloorsData(report.reportFieldFloors), null, true))});
            default:
              break;
          }
        }
      }
      return data;
    },
    getReportFiledDefinition(val) {
      var data = [];
      // NOTE: 大項目データ項目定義回数ループ
      for (var i = 0; i < val.reportObjectDefinition.reportFieldDefinitions.length; i++) {
        if (val.reportObjectDefinition.reportFieldDefinitions[i].type != 7&&val.reportObjectDefinition.reportFieldDefinitions[i].type != 10 && val.reportObjectDefinition.reportFieldDefinitions[i].availableForReport == true){
          if (!val.reportObjectDefinition.reportFieldDefinitions[i].name.includes("URL")){
            data.push({name: val.reportObjectDefinition.reportFieldDefinitions[i].name});
          }
         }
      }
      return data;
    },
    sortReportObject(val) {
      var findReportExtractField = val.reportObjectDefinition.reportFieldDefinitions.find(reportObjectDefinition => reportObjectDefinition.reportExtractField == true);
      val.reportObjects.sort(function(a, b) {
        if (a.reportFields[findReportExtractField.fieldIndex].dateValue < b.reportFields[findReportExtractField.fieldIndex].dateValue) {
          return -1;
        } else {
          return 1
        }
      });
    },
    getReportData(val) {
      this.sortReportObject(val);
      var data_list = [];
      // NOTE: 大項目データ回数ループ
      var image_list = [];    
      for (var i = 0; i < val.reportObjects.length; i++) {
        var path = '/majoritems/' + this.$route.params.id + '/' + val.reportObjects[i].reportObjectDefinitionId + '/details/' + val.reportObjects[i].id;
        var columns = this.getColumnsData(val, i);
        var dateValue = ""
        var eventName = ""
        var imageUrl = ""
        var id = 0

        for (var j = 0; j < val.reportObjects[i].reportFields.length; j++) {
          if (val.reportObjects[i].reportFields[j].reportFieldDefinitionId == 170 || val.reportObjects[i].reportFields[j].reportFieldDefinitionId == 181){
            eventName = val.reportObjects[i].reportFields[j].textValue;
          }
          for (var k = 0; k < val.reportObjectDefinition.reportFieldDefinitions.length; k++){
            if (val.reportObjectDefinition.reportFieldDefinitions[k].id == val.reportObjects[i].reportFields[j].reportFieldDefinitionId) {
              if (val.reportObjectDefinition.reportFieldDefinitions[k].type == 2){
                dateValue = this.df2(val.reportObjects[i].reportFields[j].dateValue);
              } else if (val.reportObjectDefinition.reportFieldDefinitions[k].type == 7){
                if (val.reportObjects[i].reportFields[j].textValue != null){
                  imageUrl = val.reportObjects[i].reportFields[j].textValue;
                  id = j;
                }
              }         
            }
          }
        }
        if (imageUrl != "") {
          image_list.push({value: imageUrl, id:i+"_"+val.reportObjects[i].id+"_"+id, date: dateValue,event: eventName});
        }

        data_list.push({path, columns});
      }
      var data = {label: val.reportObjectDefinition.name, sort: val.reportObjectDefinition.id, columns: this.getReportFiledDefinition(val), data_list: data_list,image_list: image_list};
      //var data = {label: val.reportObjectDefinition.name, sort: val.reportObjectDefinition.sort, columns: this.getReportFiledDefinition(val), data_list: data_list,image_list: image_list};
      return data;
    },
    onImgClick(tag){
      var images = document.getElementById("img_source_"+tag);
      var imgSrc = images.src
      this.$refs.child.showImage(imgSrc)
    },
    setReportObjectGroup(val) {
      for (var i = 0; i < val.length; i++ ) {
        var find = this.reportObjectGroup.find(value => value.id == val[i].reportObjectDefinition.reportObjectGroupDefinitionId);
        if (find == undefined) {
          this.reportObjectGroup.push(val[i].reportObjectDefinition.reportObjectGroupDefinition);
        }
      }
      // this.reportObjectGroup.sort(function(a,b){
      //   if(a.id < b.id) return -1;
      //   if(a.id > b.id) return 1;
      //   return 0;
      // });
    },
    getReportSections(val) {
      this.setReportObjectGroup(val);
      var reportObject = [];
      var reportData = {};
      var sort_val = [];
      this.reportObjectGroup.forEach(value => {
        var filter = val.filter(obj => obj.reportObjectDefinition.reportObjectGroupDefinitionId == value.id);
        filter.forEach(ope => {
          sort_val.push(ope);
        });
      });
      // NOTE: 大項目定義回数ループ
      for (var i = 0; i < sort_val.length; i++ ) {
        if (Object.keys(val[i]).length){
          // NOTE: 大項目のデータがない時&&大項目表示ラベル制御が表示の時
          if (sort_val[i].reportObjects === undefined) {
            this.countList.push({label: sort_val[i].reportObjectDefinition.name, sort: sort_val[i].reportObjectDefinition.sort});
            if (this.isDisplay) {
              reportData = {label: sort_val[i].reportObjectDefinition.name + ' 【報告事項無し】', sort: sort_val[i].reportObjectDefinition.id};
            }
          } else {
            reportData = this.getReportData(sort_val[i]);
            this.countList.push(reportData);
          }
          if (Object.keys(reportData).length != 0) {
            this.setMajorItemGroup(reportData);
            this.list.push(reportData);
            reportData = {};
          }
        }
      }
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
    getTemplateId(operationCategoryId) {
      var templateList = JSON.parse(localStorage.getItem('template_list'));
      this.item.operationReportTemplateId = this.$route.params.operation_category;
      this.readReportsPreview(this.item.operationReportTemplateId, this.changeDateFormat(this.item.reportedAt));
    },
    readReportsPreview(reportTemplateId, date){
      // NOTE: 入力年月日 + 業務日付切替時間
      var searchDate = date;
      this.requestDate = searchDate;
      var api = '/reports/preview?operationCategoryId=' + reportTemplateId + '&buildingId=' + localStorage.getItem('buildings_id') + '&date=' + this.requestDate;
      this.req(api, 'get', null, (err, res) => {
        if (res.body) {
          this.getAttendances(res.body.attendances);
          this.getReportSections(res.body.reportSections);
          this.param.categorylist = JSON.stringify([this.getCategoryList(res.body.reportSections)]);
        }
      });
    },
    readReportData() {
      if (this.item.reportedAt == null) {
        alert('報告日を選択してください');
        return;
      }
      if (this.list.length === 0) {
        // this.getTemplateId(this.$route.params.id);
        this.item.operationCategoryId = parseInt(this.$route.params.operation_category);
        this.readReportsPreview(this.item.operationCategoryId, this.changeDateFormat(this.item.reportedAt));
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
      var api;
      if (this.isHeadquartersMode) {
        api = '/members'
      } else {
        let buildingId = localStorage.getItem('buildings_id');
        api = '/buildings/'+ buildingId +'/members';
      }
      var where = {"and":[{"operationTypeId": this.getOperationTypeId(this.$route.params.operation_category)}, {"role":{"neq":3}}]};
      var member = [];
      this.onSearch(api, null, where, val => {
        val.forEach(function(obj){
          member.push({name: obj.name, value: obj.id});
        });
        this.members = member;

        this.getReportInfoRequest();
      }); 
    },
    getMembersAllRequest(){
      var api;
      if (this.isHeadquartersMode) {
        api = '/members'
      } else {
        let buildingId = localStorage.getItem('buildings_id');
        api = '/buildings/'+ buildingId +'/members';
      }
      var where = {"and":[{"operationTypeId": this.getOperationTypeId(this.$route.params.operation_category)}]};
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
      const operationCategories = JSON.parse(localStorage.getItem('operation_categories'));
      const currentCategory = operationCategories.find(val => val.id == parseInt(this.$route.params.operation_category));

      for (var i = 0; i < report_list.length; i++) {
        if (report_list[i].operation_type_id == currentCategory.operationTypeId) {
          this.param.title = '日報';
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
    getMember(val, isId) {
      for (var i = 0; i < this.allMembers.length; i++) {
        if (this.allMembers[i].value == val) {
          return this.allMembers[i].name;
        }
      }
    },
    getHeadquartersCommentRequest(id) {
      this.req('/report/' + id + '/comments', 'get', null, (err, val) => {
        if (val.body.length != 0) {
          this.headquartersComment = val.body[val.body.length - 1].comment;
          this.headquartersCommentId = val.body[val.body.length - 1].id;
        }
      });
    },
    getReportObjects(reportObjectDefinition, id) {
      var that = this;
      var clean = reportObjectDefinition.filter(this.isNotEmpty);
      var filter = clean.filter(val =>  val.reportObjectDefinition.reportObjectGroupDefinitionId == id);
      filter.sort(function(a,b){
        if(a.reportObjectDefinition.sort < b.reportObjectDefinition.sort) return -1;
        if(a.reportObjectDefinition.sort > b.reportObjectDefinition.sort) return 1;
        return 0;
      });
      var res = [];
      filter.forEach(function(obj) {
        res.push({
          id: obj.reportObjectDefinition.id,
          name: obj.reportObjectDefinition.name,
          operationCategoryId: obj.reportObjectDefinition.operationCategoryId,
          path: '/majoritems/' + obj.reportObjectDefinition.id,
          sort: obj.reportObjectDefinition.sort
        })
      });
      return res;
    },
    getMajorItems(reportDefinition) {
      var categoryList = [];
      for (var i = 0; i < this.groupNames.length; i++) {
        var find = categoryList.find(val => val.id == this.groupNames[i].id);
        if (find == undefined) {
          categoryList.push({
            name: this.groupNames[i].groupName, 
            id: this.groupNames[i].id, 
            reportObjectDefinitions: this.getReportObjects(reportDefinition, this.groupNames[i].id)
          });
        }
      }
      return categoryList; 
    },
    getCategoryList(reportDefinition) {
      var reportList = JSON.parse(localStorage.getItem('report_list'));
      var find = reportList.find(val => val.operation_type_id == reportDefinition[0].reportObjectDefinition.reportObjectGroupDefinition.operationTypeId);
      find.majoritems = this.getMajorItems(reportDefinition);
      return find;
    },
    getBuildingInfo(buildingId) {
      var that = this;
      this.onSearch('/buildings/' + buildingId, null, null, function(val) {
        that.buildingId = buildingId;
        that.buildingName = val.name;
        that.isDisplay = val.buildingSetting.displayObjectIfEmpty;
        that.businessStartTime = moment(val.buildingSetting.businessStartTime, 'HH:mm:ss').add(9, 'h').format('HH:mm:ss');
        that.buildingTemplates = val.operationCategory;
        that.createMenulistRequest('/companies/'+localStorage.getItem("company_id")+'/operation-categories');
      });
    },
    getReportInfoRequest() {
      var api = '/reports';
      const url = api + '/' + this.$route.params.id + '?' + this.now;
      this.req(url, 'get', null, (err, res) => {
          this.item = res.body.report;
          const data = res.body;
          if (data.approveReport != undefined) {
            this.item.status = data.approveReport.reportStatus;
            this.approval = this.reverseArray(data.approveLogs);
          }
          this.getHeadquartersCommentRequest(data.report.id);
          localStorage.setItem('buildings_id',data.report.buildingId);
          this.getBuildingInfo(data.report.buildingId);
          Object.assign(this.oldItem,data.report);
          this.tmpUpdatedAt = this.item.updatedAt;
          this.oldReportedAt = this.item.reportedAt;
      });

    },
    getBuildingName(val) {
      var buildings = JSON.parse(localStorage.getItem('building_list'));
      var buil = buildings.find(function(obj){
        return (obj.id == val);
      });
      if (buil == undefined) return '';
      return buil.name;
    },
    isNotEmpty(obj){
      return Object.keys(obj).length;
    },
    /**
     * APIから取得した業務及び大項目のデータを変換
     */
    convertReportObjectDefinitions(operationCategoryContents) {
      var reportObjectGroupDefinitions = [];
      var reportObject;
      var find;
      if (operationCategoryContents != null) {
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
      }
      
      reportObjectGroupDefinitions.sort(function(a,b){
        if(a.sort < b.sort) return -1;
        if(a.sort > b.sort) return 1;
          return 0;
      });
      return reportObjectGroupDefinitions;
    },
    /**
     * 共通UI表示項目の作成
     */
    createMenulistRequest(api) {
      var parameter = { where: {buildingId: this.buildingId} ,include: [{relation: 'operationCategoryContents',scope:{include:[{relation: 'reportObjectGroupDefinition',scope:{include:[{relation: 'reportObjectDefinitions'}]}}]}}] };
      this.onSearch(api, parameter, null, (val) => {
        this.filterMenulistToMemberRequest('/members/' + localStorage.getItem('member_id'), val);
      });
    },
    /**
     * 共通UI表示項目のメンバーごとのフィルタ
     */
    filterMenulistToMemberRequest(api, val) {
      this.onSearch(api, null, null, (res) => {
        var report_hierarchy = [];
        // NOTE: メンバーごとの業務filter処理追加
        for (var i = 0; i < val.length; i++) {
          if (this.checkItemPermission('Common:forSystemApproval')){
            report_hierarchy.push({ name: val[i].reportName, operation_name: val[i].reportName.replace(/報告書/g, ''), operation_type_id: val[i].operationTypeId, id: val[i].id, path: '/report/' + val[i].operationTypeId + '/' + val[i].id, majoritems: this.convertReportObjectDefinitions(val[i].operationCategoryContents)});
          }else{
            for (var j = 0; j < res.memberOperationCategories.length; j++) {
              if (val[i].operationTypeId == res.memberOperationCategories[j].operationTypeId) {
                report_hierarchy.push({ name: val[i].reportName, operation_name: val[i].reportName.replace(/報告書/g, ''), operation_type_id: val[i].operationTypeId, id: val[i].id, path: '/report/' + val[i].operationTypeId + '/' + val[i].id, majoritems: this.convertReportObjectDefinitions(val[i].operationCategoryContents)});
              }
            }
          }
        }
        report_hierarchy.sort(function(a,b){
          if(a.operation_type_id < b.operation_type_id) return -1;
          if(a.operation_type_id > b.operation_type_id) return 1;
          return 0;
        });
        this.groupList = report_hierarchy;
        this.readReportData();
      });
    },
    setMajorItemGroup(reportData){
      var reportList;
      if (this.isHeadquartersMode) {
        reportList = this.groupList;
        //this.createMenulistRequest('/companies/'+localStorage.getItem("company_id")+'/operation-categories', reportData);
      } else {
        reportList = JSON.parse(localStorage.getItem('report_list'));
      }
      this.setGroupNames(reportList, reportData);
    },
    setGroupNames(list, reportData) {
      var groupName = null
      list.forEach((job) => {
        var groups = job.majoritems;
        groups.forEach((group) => {
          if (group.reportObjectDefinitions != null){
            group.reportObjectDefinitions.forEach((reportObjectDefinition) => {
              if (reportData.sort == reportObjectDefinition.id) {
                const include = this.groupNames.find((v) => v.groupName === group.name);
                if (include == undefined){
                  this.groupNames.push({columnId: reportData.sort, groupName:group.name, id: group.id});
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
    deleteFunc() {
      this.onDelete(this.api, '/report/' + this.$route.params.operation_category);
    },
    onDeleteFunc() {
      this.alert.title = '';
      this.alert.message = 'こちらのデータを削除いたします。<br>よろしいでしょうか？<br>';
      this.alert.note = '※この操作は取り消すことはできません。'
      this.alert.isConfirm = true;
      $('#modal_alert2').modal('show')
    }
  },
  created() {
    this.permissionKey = (parseInt(this.$route.params.id) == 1) ? "Security:Report:update:headquartersComment" : "Cleaning:Report:update:headquartersComment";
    const key = (parseInt(this.$route.params.id) == 1) ? "Security:Report:update" : "Cleaning:Report:update";
    this.checkDisplayPermission(key, () => {
      this.setReportTitle();
      this.getMembersInfoRequest();
      this.getMembersAllRequest();
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
          this.groupNames = [];
          this.isAttendanceNull = false;
          this.readReportFlag = false;
          this.isChangeReportedAt = true;
          this.error = '';
        }
        this.oldReportedAt = val.reportedAt;
      },
      deep: true,
    }
  },
};
</script>
