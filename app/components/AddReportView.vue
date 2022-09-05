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
            <li>{{param.operation}}</li>
            <li>{{param.title}}一覧</li>
            <li class="current">{{param.title}}登録</li>
          </ol>
        </div>
        <h1 class="ts_content_heading">{{param.title}}登録</h1>
      </div>
    </section>

    <!-- <section class="content-header">
      <h1>
        {{param.title}}登録
        <small></small>
      </h1>
    </section> -->

    <!-- Main content -->
    <section class="content">
      <div class="box">
          <div class="box-header with-border box_head">
            <h2 class="box-title with-border">{{param.title}}情報</h2>
          </div>
          <!-- /.box-header -->
        <div class="box-body no-paddin">
          <form class="form-horizontal" style="margin:0;">
            <div class="box-body">
              <div class="form-group form_box_group">
                <div class="form_box_group_title">
                  <label class="control-label">ID</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">
                    ※自動採番
                  </div>
                </div>
              </div>

              <div class="form-group form_box_group" v-if="col.type!='hiddenColmun'&&col.type=='datePicker'||readReportFlag" v-for="col in param.columns" v-bind:class='{required:col.required}'>
                <div class="box-header with-border" v-if="col.title">
                  <h3 class="box-title with-border">{{col.name}}</h3>
                </div>
                <div class="form_box_group_title" v-if="!col.title&&col.type!='threeTextInput'&&col.type!='hiddenColmun'&&col.type!='file'&&col.type!='datePicker'&&readReportFlag">
                  <label class="control-label" v-bind:for="col.column">{{col.name}}</label>
                </div>
                  
                <div class="form_box_group_field" v-bind:class="{ 'item-text': col.text }" v-if="!col.title && !col.type&&readReportFlag">
                  <input type="text" v-bind:maxlength="col.maxlength" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder" v-model="item[col.column]" v-bind:disabled="col.disabled" v-if="!col.text">
                  <span v-if="col.text">{{col.text}}</span>
                </div>

                <div class="form_box_group_title" v-if="col.type=='datePicker'">
                  <label class="control-label" v-bind:for="col.column">{{col.name}}</label>
                </div>
                  
                <div class="form_box_group_field display_flex" v-if="col.type=='datePicker'">
                  <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" :value="col.text" name="datepicker" v-model="item[col.column]"  v-bind:placeholder="col.placeholder"></vuejs-datepicker>
                  <button type="button" class="btn btn-primary margin_left_10" @click="onReadReportData">読込</button>
                    <!-- <div class="no-margin pull-right">
                    <!-- </div> -->
                </div>
                <div class="form_box_group_field" v-if="col.type=='select'&&readReportFlag">
                  <select class="form-control max_width_390" v-bind:id="col.column" v-model="item[col.column]" v-bind:disabled="col.disabled">
                    <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                  </select>
                </div>
                <div class="form_box_group_field flex_textarea" v-if="col.type=='textarea'&&readReportFlag">
                  <div class="flex_textarea_dummy" aria-hidden="true"></div>
                  <textarea id="FlexTextarea" class="flex_textarea_textarea form-control" v-model="item[col.column]=col.value" v-bind:maxlength="col.maxlength" v-bind:placeholder="(col.placeholder ? col.placeholder + '\n' : '') + '※改行で複数行入力可'"></textarea>
                </div>
              </div>

              <div class="box-body padding_0 margin_bottom_10" v-if="checkItemPermission(permissionKey) && readReportFlag" >
                <div class="box-header with-border margin_bottom_10">
                  <h2 class="box-title font_18">本部コメント</h2>※ 報告書非表示
                </div>
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">コメント</label>
                  </div>
                  <div class="form_box_group_field flex_textarea padding_right_0">
                    <div class="flex_textarea_dummy" aria-hidden="true"></div>
                    <textarea id="FlexTextarea" class="flex_textarea_textarea form-control" v-model="headquartersComment" v-bind:maxlength="512" v-bind:placeholder="'※改行で複数行入力可'"></textarea>
                  </div>
                </div>
              </div>

              <div class="box-body padding_0 margin_bottom_10" v-if="readReportFlag">
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
            </div>
            <div class="box-body">
              <div v-if="isAttendanceNull&&readReportFlag">
                <div class="box-header with-border">
                  <h2 class="box-title font_18 font_bold">業務項目件数</h2>
                </div>
                <div class="box-header margint_left_minus_10">
                  <table class="table table-bordered table-hover counts" v-for="coll in countList">
                    <thead>
                      <tr role="row">
                        <th>{{coll.label}}</th>
                        <th class="count_table">{{showCount(coll)}}</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
              <div role="grid" v-for="cols in this.list" v-if="readReportFlag">
                <div class="box-header with-border" v-if="showMajorItemGroup(cols)!=null">
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
                    <tr role="row" v-for="(col_data, index) in cols.data_list" @click="$router.push(col_data.path)">
                      <td>{{index + 1}}</td>
                      <td v-for="col in col_data.columns" class="report break_word" v-html="getColumData(col.value)"></td>
                      <!-- <td v-for="col in col_data.columns" class="report break_word" >{{col.value}}</td> -->
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
                    <table class="table table-bordered table-hover counts" v-for="coll in countList">
                      <thead>
                        <tr role="row">
                          <th>{{coll.label}}</th>
                          <th class="count_table">{{showCount(coll)}}</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>              
            <!-- /.box-body -->
            <div class="box-footer form_button_flex flex_right border_top">
              <button type="button" class="btn btn-default global_btn form_button_flex_item" onclick="window.history.back()">キャンセル</button>
              <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onAddButtonClick('temporary')" v-if="param.isApply">仮登録(未申請)</button>
              <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onAddButtonClick('main')" v-if="param.isApply">登録して申請</button>
              <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onAddButtonClick('noapply')" v-if="!param.isApply">登録</button>
            </div>
          <!-- /.box-footer -->
          </form>
        </div>
      <!-- /.box-body -->
    <!-- /.box -->
      </div>
      <template>
        <modal-img-view　ref="child" :id="'modal'" :title="'拡大プレビュー'"></modal-img-view>
      </template>
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert" @onconfirm="postReportRequest"></modal-alert-view>
      </template>
    </section>
  </div>
    <!-- /.content -->
  <!-- /.content-wrapper -->
</template>

<script>
  import moment from 'moment'
  import ModalImgView from '~/components/ModalImgView'
  import ModalAlertView from '~/components/ModalAlertView'
  import WorkStyleComponent from '~/components/WorkStyleComponent'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  
  export default {
    name: 'AddReportView',
    props: {
      param: Object,
    },
    data() {
      return {
        item: {},
        headquartersComment: '',
        permissionKey: '',
        list: [],
        imageHeaderUrl: 'https://staging-static.t-spider.cloud/',
        countList: [],
        groupNames: [],
        // regdisabled: false,
        reportObjectGroup: [],
        comment: '',
        error: '',
        DatePickerFormat: 'yyyy/MM/dd',
        readReportFlag: false,
        oldReportedAt: '',
        oldReportedAtTime: '',
        isAttendanceNull: false,
        fullpage: true,
        role: localStorage.getItem('role'), 
        alert: {
          title: 'test',
          message: '',
          note: '',
          isConfirm: false,
        },
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
    components: {
      ModalImgView,
      ModalAlertView,
      Loading
    },
    methods: {
      headquartersCommentRequest(id) {
        var request = {
          "comment": this.headquartersComment,
          "reportId": id
        }
        if (this.headquartersComment != '') {
          // 本部コメントのリクエスト処理(post)
          this.req('/comments', 'post', request, (err, res) => {
            if (err) {
            } else if (res.body) {
              this.$router.push('/report/' + this.$route.params.operation_category);
            }
          });
        } else {
          this.$router.push('/report/' + this.$route.params.operation_category);
        }
      },
      getBuildingInfoRequest(mode) {
        this.req('/buildings/' + localStorage.getItem('buildings_id'), 'get', null, (err, res) => {
          if (res.body) {
            this.addRequest(mode, res.body.buildingSetting.approveNotificationActive);
          }
        });
      },
      addRequest(mode, approveNotificationActive) {
        if (mode == 'main') {
          this.item.apply = true;
          if (approveNotificationActive) {
            this.alert.title = '';
            this.alert.message = this.param.title + "の登録と申請を同時におこないます。<br>ビルオーナーに申請通知メールが送信されますが、続行してよろしいですか？<br>";
            this.alert.note = "※申請をおこなわずに登録のみおこなう場合は、[キャンセル]をクリック後、<br>[仮登録]をクリックしてください。"
            this.alert.isConfirm = true;
            $('#modal_alert').modal('show')
            // if (!confirm(this.param.title + "の登録と申請を同時におこないます。\nビルオーナーに申請通知メールが送信されますが、続行してよろしいですか？\n※申請をおこなわずに登録のみおこなう場合は、[キャンセル]をクリック後、\n[仮登録]をクリックしてください。")) {
            //   return;
            // }
          } else {
            this.alert.title = '';
            this.alert.message = this.param.title + "の登録と申請を同時におこないます。<br>続行してよろしいですか？<br>";
            this.alert.note = "※申請をおこなわずに登録のみおこなう場合は、[キャンセル]をクリック後、<br>[仮登録]をクリックしてください。"
            this.alert.isConfirm = true;
            $('#modal_alert').modal('show')
           
            // if (!confirm(this.param.title + "の登録と申請を同時におこないます。\n続行してよろしいですか？\n※申請をおこなわずに登録のみおこなう場合は、[キャンセル]をクリック後、\n[仮登録]をクリックしてください。")) {
            //   return;
            // }
          }
        } else if ('temporary') {
          this.item.apply = false;
          if (this.item.approveComment != null && this.item.approveComment != '') {
            this.alert.title = '';
            this.alert.message = this.param.title + "の登録(申請しない)のみのため、「申請コメント」は登録されません。<br>このまま「申請コメント」を登録せず登録しますか？<br>"
            this.alert.note = "※申請をおこなわずに登録のみおこなう場合は、[キャンセル]をクリック後、<br>[仮登録]をクリックしてください。"
            this.alert.isConfirm = true;
            $('#modal_alert').modal('show')
            // if (!confirm(this.param.title + "の登録(申請しない)のみのため、「申請コメント」は登録されません。\nこのまま「申請コメント」を登録せず登録しますか？")) {
            //   return;
            // }
          } else {
            this.postReportRequest();
          }
        }
        // this.item.buildingId = parseInt(localStorage.getItem('buildings_id'));
        // this.req(this.param.api, 'post', this.item, (err, res) => {
        //   if (err) {
        //     const errorColm = {};
        //     for(const key in this.param.columns){
        //       errorColm[this.param.columns[key].column] = this.param.columns[key].name;
        //     }
        //     this.error = this.getErrorMsg2(res, this.param.columns);
        //     // this.regdisabled = false; //NOTE:登録ボタンの活性状況制御
        //   } else if (res.body) {
        //     this.headquartersCommentRequest(res.body.report.id);
        //   }
        // });
      },
      postReportRequest() {
        this.item.buildingId = parseInt(localStorage.getItem('buildings_id'));
        this.req(this.param.api, 'post', this.item, (err, res) => {
          if (err) {
            const errorColm = {};
            for(const key in this.param.columns){
              errorColm[this.param.columns[key].column] = this.param.columns[key].name;
            }
            this.error = this.getErrorMsg2(res, this.param.columns);
            // this.regdisabled = false; //NOTE:登録ボタンの活性状況制御
          } else if (res.body) {
            this.headquartersCommentRequest(res.body.report.id);
          }
        });
      },
      onAddButtonClick(mode) {
        this.error = '';
        if (!this.readReportFlag) {
          // alert('日次データが読み込まれていません')
          this.alert.title = '';
          this.alert.message = '日次データが読み込まれていません。';
          this.alert.isConfirm = false;
          $('#modal_alert').modal('show')
          return;
        }
        // this.regdisabled = true; //NOTE:登録ボタンの活性状況制御
        // NOTE:登録済みチェック
        var reportedAtStart = this.getReportedRangeTime(this.item.reportedAt, localStorage.getItem('business_start_time'),true);
        var reportedAtEnd = this.getReportedRangeTime(this.item.reportedAt, localStorage.getItem('business_start_time'), false);
        var count_cond = {
          and:[
            {reportedAt:{ gte:this.df_utc(reportedAtStart)}},
            {reportedAt:{ lte:this.df_utc(reportedAtEnd)}},
            {operationCategoryId: this.$route.params.operation_category},
            {reportDefinitionId: this.$route.params.id}
          ]
        };
        this.item.reportedAt = this.getReportedRangeTime(this.item.reportedAt, localStorage.getItem('business_start_time'), true);
        this.onCount('/buildings/' + parseInt(localStorage.getItem('buildings_id')) + '/reports', count_cond, (res) => {
          if (res.count > 0) {
            this.error = 'この日付の'+this.param.title + 'は既に登録されています';
            return;
          } else {
            this.getBuildingInfoRequest(mode);
          }
        })
      },
      getRows(text) {
        if (text == undefined || text == null) {
          return 1;
        }
        return text.split("\n").length;
      },
      changeDateFormat(value){
        return moment(value).format('YYYY-MM-DD');
      },
      getAttendances(val) {
        var data_list = [];
        var attendances ='';
        if (val.length == 0) {
           this.isAttendanceNull = true;
           if (localStorage.getItem('display_object_if_empty') == "true") {
              attendances = {label: '勤務スタッフ 【勤務員無し】'};
           }
        } else {
          for (var i = 0; i < val.length; i++) {
            var columns = [];
            var path = '/attendance/' + this.$route.params.id + '/details/' + val[i].id;
            columns.push({value: this.df2(val[i].attendedAt)});
            columns.push({value: this.df2(val[i].leftAt)});
            columns.push({value: this.getWorkShift(val[i].workShift)});
            columns.push({value: val[i].member.name});
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
        // return val;
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
          if (Object.keys(sort_val[i]).length){
            // NOTE: 大項目のデータがない時&&大項目表示ラベル制御が表示の時
            if (sort_val[i].reportObjectDefinition === undefined || sort_val[i].reportObjects === undefined) {
              this.countList.push({label: sort_val[i].reportObjectDefinition.name, sort: sort_val[i].reportObjectDefinition.sort});
              if (localStorage.getItem('display_object_if_empty') == "true") {
                reportData = {label: sort_val[i].reportObjectDefinition.name + ' 【報告事項無し】' , sort: sort_val[i].reportObjectDefinition.id};
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
        //     return 0;
        // });
        // this.list.sort(function(a,b){
        //   if(a.sort < b.sort) return -1;
        //   if(a.sort > b.sort) return 1;
        //     return 0;
        // });
      },
      readReportsPreview(reportTemplateId, date){
        var api = '/reports/preview?operationCategoryId=' + this.$route.params.operation_category + '&buildingId=' + localStorage.getItem('buildings_id') + '&date=' + date;
        this.req(api, 'get', null, (err, res) => {
          setTimeout(() => {
            if (res.body) {
              this.getAttendances(res.body.attendances)
              this.getReportSections(res.body.reportSections);
            }
          }, 1);
        });
      },
      onReadReportData() {
        if (this.item.reportedAt == null) {
          // alert('報告日を選択してください');
          this.alert.title = '';
          this.alert.message = '報告日を選択してください。';
          this.alert.note = '';
          this.alert.isConfirm = false;
          $('#modal_alert').modal('show')
          return;
        }
        localStorage.setItem('add_reported_at', this.item.reportedAt);
        if (this.list.length === 0) {
          this.item.operationCategoryId = parseInt(this.$route.params.operation_category);
          this.readReportsPreview(this.item.operationCategoryId, this.changeDateFormat(this.item.reportedAt));
        }
        this.readReportFlag = true;
      },
      getImageNo(id) {
        return parseInt(id.substring(0, id.indexOf("_"))) + 1;
      },
      flexTextarea(el) {
        const dummy = el.querySelector('.flex_textarea_dummy');
        el.querySelector('.flex_textarea_textarea').addEventListener('input', e => {
          dummy.textContent = e.target.value + '\u200b';
        })
      },
      getItem(init_val) {
        var val = {
          comment: init_val.comment,
          notice: init_val.notice,
          reportedAt: init_val.reportedAt,
          reportedBy: init_val.reportedBy
        }
        return val;
      },
      setMajorItemGroup(reportData){
        var groupName = null
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        reportList.forEach((job) => {
          var groups = job.majoritems;
          groups.forEach((group) => {
            if (group.reportObjectDefinitions != null) {
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
      }
    },
    created() {
      this.permissionKey = (parseInt(this.$route.params.id) == 1) ? "Security:Report:create:headquartersComment" : "Cleaning:Report:create:headquartersComment";
      if (this.param.init_val){
        this.item = this.getItem(this.param.init_val);
      } 
    },
    updated() {
      document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
    },
    watch: {
      item: {
        handler(val) {
          var reportedAt = localStorage.getItem('add_reported_at');
          if (reportedAt != null && this.readReportFlag == false) {
            this.oldReportedAt = val.reportedAt = reportedAt;
            this.onReadReportData();
          }
         
          if ((this.oldReportedAt !== val.reportedAt) && (this.oldReportedAtTime !== val.reportedAt)) {
            this.list = [];
            this.countList = [];
            this.groupNames = [];
            this.readReportFlag = false;
            this.isAttendanceNull = false;
            this.error = '';
          }
          this.oldReportedAt = val.reportedAt;
          this.oldReportedAtTime = this.getReportedRangeTime(val.reportedAt, localStorage.getItem('business_start_time'), true);
          this.param.columns.forEach( e => {
            if (this.item[e.column] === '') {
              this.item[e.column] = undefined;
            }
          })
          if(this.param.cb != null) {
            this.param.cb(val);
          }
        },
        deep: true,
      },
    },
  }
</script>
