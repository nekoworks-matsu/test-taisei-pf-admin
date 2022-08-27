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
                <li class="current">{{param.title}}詳細</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}詳細</h1>
          </section>
          <div class="button_header_btn">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/business_report/' + $route.params.operation_id + '/' + $route.params.business_report_id  + '/edit/' + param.id)">編集</button>
          </div>
        </div>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1>
        {{this.param.title}}詳細
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-info width_140" @click="onTransitionButton('/majoritems/' + $route.params.operation_id + '/' + $route.params.majoritems_id  + '/edit/' + param.id)">編 集</button>
        </div>
      </h1>
    </section> -->

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- <div class="box-header with-border">
            <h3 class="box-title with-border">詳細情報</h3>
          </div> -->
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal">
              <div class="box-body">
                <div class="form-group form_box_group" :class="{vertical_layout: isVertical}">
                  <button type="button" class="input_file_button" @click="copyContents()">
                    <i class="fas fa-copy"></i>
                    <span class="margin_left_10">内容をコピー</span>
                  </button>
                </div>
                <div class="form-group form_box_group" :class="{vertical_layout: isVertical}">
                  <div class="form_box_group_title">
                    <label class="control-label">ID</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{param.id}}</div>
                  </div>
                </div>
                
                <div class="form-group form_box_group" v-if="col.type!='hiddenColmun'" v-for="(col, index) in param.columns" :class="{vertical_layout: isVertical}">
                  <div class="form_box_group_title" v-if="!col.title&&col.type!='threeTextInput'&&col.type!='hiddenColmun'&&col.type!='image'" >
                    <label class="control-label" v-bind:for="col.column">{{col.name}}</label>
                  </div>

                  <template v-if="col.type=='image'">
                    <div class="form_box_group_title">
                      <label class="control-label">{{col.name}}</label>
                    </div>
                    <!-- <input id="file_select" class="col-sm-8 control-label" style="display:none" type="file" accept="image/*" @change="onAddFile"> -->
                      <div class="form_box_group_field" v-if="col.value == null">
                        <div class="item-text">
                        {{getColumData(null)}}
                      </div>
                    </div>
                    
                    <div v-if="col.value != null">
                      <!-- <label class="col-sm-4"></label> -->
                      <!-- <label class="col-sm-8 item-text">プレビュー</label> -->
                      <div class="padding_top_10">
                        <!-- <label class="col-sm-4"></label> -->
                        <img id="img_source" v-bind:class="{ img_thumbnail: isPreview, opacity_0: !isPreview}" data-toggle="modal" v-bind:data-target="'#modal'" @click="onImgClick">
                      </div>
                    </div>
                  </template>
                  <div class="form_box_group_field" v-if="col.value == null&&col.type=='video'">
                      <div class="item-text">
                        {{getColumData(null)}}
                      </div>
                   </div>
                  <div v-show="isVideoPreview" class="form_box_group_field" v-if="col.type=='video'">
                    <div>
                      <video-player ref="video" :options="videoOptions"/>
                    </div>
                  </div>

                  <div class="form_box_group_field" v-if="col.type=='text'">
                    <div class="item-text">
                      {{getColumData(col.value)}}
                    </div>
                  </div>
                  <div class="form_box_group_field" v-if="col.type=='number'">
                    <div class="item-text">
                      {{getColumDataForNumber(col.value)}}
                    </div>
                  </div>

                  <div class="form_box_group_field" v-if="col.type=='textarea'">
                    <div class="item-text">
                      <span v-html="getColumData(col.value)"></span>
                    </div>
                  </div>
                  <div class="form_box_group_field" v-if="col.type=='date'">
                    <input type="date" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder || col.name" v-model="item[col.column]"/>
                    <span v-if="col.text">{{col.text}}</span>
                  </div>

                  <div class="form_box_group_field" v-if="col.type=='datetime'">
                    <div class="item-text" >
                      {{df2(col.value)}}
                    </div>
                  </div>
                  <div class="form_box_group_field" v-if="col.type=='select'">
                    <div class="item-text">
                      {{getColumData(getSelectName(col.options, col.value))}}
                    </div>
                  </div>
                  <div class="form_box_group_field" v-if="col.type=='member'">
                    <div class="item-text">
                      {{getColumData(getSelectName(col.options, col.value))}}
                    </div>
                  </div>
                  <div class="form_box_group_field break_word item-text" v-if="col.type=='floors'">
                    {{getColumData(param.display_floors)}}
                  </div>
                  <div class="form_box_group_field" v-if="col.type=='floor'">
                    <div class="item-text">
                      {{getColumData(getFloor(col.value[0]))}}
                    </div>
                  </div>
                  <div class="form_box_group_field" v-if="col.title">
                    <div class="item-text">{{col.text}}</div>
                  </div>
                  
                  <div class="form_box_group_field item-text" v-if="col.type=='hidden'">
                    <input type="hidden" class="form-control" v-model="item[col.column]=col.value" />
                  </div>
                </div>
                <div class="form-group form_box_group" :class="{vertical_layout: isVertical}">
                  <div class="form_box_group_title">
                    <label class="control-label" for="continuation_id">継続案件</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      <label class="control control_checkbox">
                        <input type="checkbox" name="continuation" id="continuation_id" disabled>
                        <div class="control_indicator"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group" :class="{vertical_layout: isVertical}">
                  <div class="form_box_group_title">
                    <label class="control-label">登録日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{df(this.param.createdAt)}}</div>
                  </div>
                </div>
                <div class="form-group form_box_group" :class="{vertical_layout: isVertical}">
                  <div class="form_box_group_title">
                    <label class="control-label">更新日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{df(this.param.tmpUpdatedAt)}}</div>
                  </div>
                </div>
              </div>
              <!-- /.box-body -->
              <div v-if="itemInfo" class="callout callout-success">
                <p>{{itemInfo}}</p>
              </div>
              <div v-if="error" class="callout callout-danger err-info">
                <p>{{error}}</p>
              </div>
              <div class="box-footer form_button_flex flex_center border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/business_report/' + $route.params.operation_id + '/' + $route.params.business_report_id)">戻る</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->
      </div>
      <!-- /.box-group -->
      <template>
        <modal-img-view　ref="child" :id="'modal'" :title="'拡大プレビュー'"></modal-img-view>
      </template>
      <template v-for="col in param.columns">
        <modal-view :param="param.floors" :title="'フロア'" :id="'modal'+col.column" :column="col.column" @okbuttonclick="onOKButtonClick" v-if="col.type=='floors'"></modal-view>
      </template>
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert"></modal-alert-view>
      </template>
      <template>
        <modal-alert-view　ref="alert" :id="'modal_confirm'" :param="alert" @onconfirm="onOKButton"></modal-alert-view>
      </template>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
import ModalImgView from '~/components/ModalImgView'
import ModalView from '~/components/ModalView'
import ModalAlertView from '~/components/ModalAlertView'
import { event } from '~/plugins/events.js'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import moment from 'moment'

import VideoPlayer from "~/components/VideoPlayer.vue";
import 'video.js/dist/video-js.css';

export default {
  data() {
    return {
      api: '/business-report',
      majorItemId: this.$route.params.majoritems_id,
      operationId: this.$route.params.operation_id,
      item: {
        reportObjectDefinitionId: '',
        reportedBy: 0,
        reportAt: '',
        fields: [{}]
      },
      isImageSelected: false,
      error: '',
      fullpage: true,
      isPreview: false,
      isVideoPreview: false,
      itemInfo: '',
      imageColumn: null,
      isButtonDisabled: false,
      isVertical: true,
      alert: {
        title: 'test',
        message: '',
        note: '',
        isConfirm: false,
      },
      param: {
        title: '',
        id: '',
        createdAt: '',
        tmpUpdatedAt: '',
        columns: [],
        floors: [],
        display_floors: ""
      },
      language: {
        language: 'Japanese',
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        days: ['日', '月', '火', '水', '木', '金', '土'],
        rtl: false,
        ymd: 'yyyy-MM-dd',
        yearSuffix: '年'
      },
      DatePickerFormat: 'yyyy/MM/dd',
      videoOptions: {
        responsive: true,
        autoplay: false,
        controls: true,
        poster: '',
        sources: [
            {
                type: "video/mp4"
            }
        ]
      }
    }
  },
  components: {
    ModalImgView,
    ModalView,
    ModalAlertView,
    Loading,
    VideoPlayer
  },
  methods: {
    getMembers(){
        var api  = '/buildings/'+localStorage.getItem("buildings_id") +'/members';
        var op = []
        this.onSearch(api, null, null, (val) => {
          val.forEach(function(obj) {
            op.push({ name: obj.name, value: obj.id })
          })
        });
    },
    getRows(text) {
      if (text == undefined || text == null) {
        return 1
      }
      return text.split('\n').length
    },
    videoReload(){
      var imgUrl = "";
      var videoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
      this.$refs.video[0].reloadVideo(videoUrl,imgUrl);
    },
    updateRequest() {
      var fields = []
      this.param.columns.forEach(function(obj) {
        if (obj.column.match('textValue')) {
          fields.push({ id: obj.id, textValue: obj.value, fieldIndex: obj.fieldIndex,reportFieldDefinitionId:obj.reportFieldDefinitionId})
        } else if (obj.column.match('member')) {
          fields.push({ id: obj.id, memberId: Number(obj.value), fieldIndex: obj.fieldIndex ,reportFieldDefinitionId:obj.reportFieldDefinitionId})
        } else if (obj.column.match('select')) {
          fields.push({ id: obj.id, selectOptionDefinitionId: Number(obj.value),fieldIndex: obj.fieldIndex ,reportFieldDefinitionId:obj.reportFieldDefinitionId})
        } else if (obj.column.match('number')) {
          fields.push({ id: obj.id, numberValue:  Number(obj.value), fieldIndex: obj.fieldIndex ,reportFieldDefinitionId:obj.reportFieldDefinitionId})
        } else if (obj.column.match('date')) {
          let time = document.getElementById(obj.column +'hh').value
          if (time.length < 2) time = '0' + time
          if (document.getElementById(obj.column +'mm').value.length < 2) {
            time = time + ':0' + document.getElementById(obj.column +'mm').value + ':00.000Z'
          } else {
            time = time + ':' + document.getElementById(obj.column +'mm').value + ':00.000Z'
          }
          fields.push({
            id: obj.id,
            dateValue: obj.value == null? time:moment(obj.value).format('YYYY-MM-DDT') + time,
            type: 2,
            fieldIndex: obj.fieldIndex,
            reportFieldDefinitionId:obj.reportFieldDefinitionId
          })
        } else if (obj.column.match('textarea')) {
          fields.push({ id: obj.id, textValue: obj.value, fieldIndex: obj.fieldIndex,reportFieldDefinitionId:obj.reportFieldDefinitionId })
        } else if (obj.column.match('floor')) {
          if (obj.value[0] == "") {
            obj.value = [];
          }
          fields.push({ id: obj.id, floors: obj.value, fieldIndex: obj.fieldIndex,reportFieldDefinitionId:obj.reportFieldDefinitionId})
        }
      })
      if (this.imageColumn != null){
        var imageBase64 = "";
        if (this.isPreview) {
          if (this.isImageSelected) {
            var img = document.getElementById("img_source").src;
            fields.push({
              id: this.imageColumn.id,
              fieldIndex: this.imageColumn.fields,
              textValue: img,
              reportFieldDefinitionId: this.imageColumn.reportFieldDefinitionId
            })
          }
        } else {
          fields.push({
            id: this.imageColumn.id,
            fieldIndex: this.imageColumn.fields,
            textValue: imageBase64,
            reportFieldDefinitionId: this.imageColumn.reportFieldDefinitionId
          })
        }
      }

      //NOTE:日本時間変換
      for (var cnt = 0; cnt < fields.length; cnt++) {
        if (fields[cnt].type != undefined && fields[cnt].type == 2) {
          var ret_value = fields[cnt].dateValue== ''? '':this.df_utc(fields[cnt].dateValue)
          fields[cnt] = { id: fields[cnt].id, dateValue: ret_value, fieldIndex: fields[cnt].fieldIndex,reportFieldDefinitionId:fields[cnt].reportFieldDefinitionId }
        }
      }

      var send_data = { reportedBy: Number(localStorage.getItem('member_id')), continuation: document.getElementsByName("continuation")[0].checked, fields: fields };
      this.onUpdate(this.api, send_data, (err, res) => {
        if (res && res.ok) {
          this.error = ''
          this.itemInfo = '更新完了'
          setTimeout(() => (this.itemInfo = ''), 3000)
          this.param.tmpUpdatedAt = res.body.businessReport.updatedAt
        } else if (err) {
          this.error = this.getMajoritemsErrorMsg(res, this.param.columns)
          return
        }
      })
    },
    up_rows(e,column) {
      var lines = (e.target.value + '\n').match(/\n/g).length;
      document.getElementById(column).rows = lines;
    },
    getMajoritemsData(api) {
      this.onSearch(api, null, null, (val) => {
        // this.param.title = val.reportObjectDefinition.name //大項目名
        const columns_list = []
        var cnt = 0
        var daily_data = '';
        val.businessReportDefinition.businessReportFieldDefinitions.forEach(function(obj) {
          var report = val.businessReport.businessReportFields.find( (v) => v.businessReportFieldDefinitionId === obj.id )
          if (report==null){
            return
          }
          let ret_value
          switch (obj.type) {
            case 1: //NOTE:text
              ret_value = report.textValue
              columns_list.push({
                name: obj.name,
                column: 'textValue_' + obj.fieldIndex,
                type: 'text',
                value: ret_value,
                required: obj.required,
                maxlength: obj.fieldValidations == undefined? 512: obj.fieldValidations[0].numberValue,
                id: report.id,
                fieldIndex: obj.fieldIndex,
                path: '.fields['+obj.fieldIndex+']',
                reportFieldDefinitionId: obj.id
              })
              break
            case 2: //NOTE:datetime
              // (obj.reportExtractField)? daily_data= '【日次データ検索項目】'+obj.name:daily_data=obj.name;
              daily_data = obj.name;
              columns_list.push({
                id: report.id,
                name: daily_data,
                column: 'dateValue_' + obj.fieldIndex,
                type: 'datetime',
                required: obj.required,
                value: report.dateValue== null? '':report.dateValue,
                fieldIndex: obj.fieldIndex,
                path: '.fields['+obj.fieldIndex+']',
                reportFieldDefinitionId: obj.id                
              })
              break
            case 3: //NOTE:Number
              ret_value = report.numberValue
              columns_list.push({
                name: obj.name,
                placeholder: obj.name + "(半角数字)",
                column: 'numberValue_' + obj.fieldIndex,
                type: 'number',
                value: ret_value,
                required: obj.required,
                maxlength: obj.fieldValidations == undefined? 128: String(obj.fieldValidations[0].numberValue).length,
                id: report.id,
                fieldIndex: obj.fieldIndex,
                path: '.fields['+obj.fieldIndex+']',
                reportFieldDefinitionId: obj.id
              })
              break
            case 4: //NOTE:select
              ret_value = report.selectOptionDefinitionId
              
              var op = []
              var op_list = val.businessReportDefinition.businessReportFieldDefinitions.find( (v) => v.id === report.businessReportFieldDefinitionId )
              op_list.selectOptionDefinitions.forEach(function(select_obj) {
                op.push({ name: select_obj.label, value: select_obj.id })
              })
              columns_list.push({
                name: obj.name,
                column: 'select_' + obj.fieldIndex,
                type: 'select',
                value: ret_value,
                id: report.id,
                required: obj.required,
                options: op,
                fieldIndex: obj.fieldIndex,
                path: '.fields['+obj.fieldIndex+']',
                reportFieldDefinitionId: obj.id
              })
              break
            case 5: //NOTE:select member
                columns_list.push({
                name: obj.name,
                column: 'member_' + obj.fieldIndex,
                type: 'member',
                required: obj.required,
                id: report.id,
                value: report.memberId,
                fieldIndex: obj.fieldIndex,
                path: '.fields['+obj.fieldIndex+']',
                reportFieldDefinitionId: obj.id
                });
              break
            case 6: //NOTE:textarea
              ret_value = report.textValue
              columns_list.push({
                name: obj.name,
                column: 'textarea_' + obj.fieldIndex,
                type: 'textarea',
                value: ret_value,
                required: obj.required,
                maxlength: obj.fieldValidations == undefined? 512: obj.fieldValidations[0].numberValue,
                id: report.id,
                fieldIndex: obj.fieldIndex,
                path: '.fields['+obj.fieldIndex+']',
                reportFieldDefinitionId: obj.id
              })
              break
            case 7: //NOTE:textarea
              if (report == undefined) {
                break
              }
              ret_value = report.textValue
              columns_list.push({
                name: obj.name,
                column: 'image_' + obj.fieldIndex,
                type: 'image',
                value: ret_value,
                required: obj.required,
                maxlength: obj.fieldValidations == undefined? 512: obj.fieldValidations[0].numberValue,
                id: report.id,
                fieldIndex: obj.fieldIndex,
                path: '.fields['+obj.fieldIndex+']',
                reportFieldDefinitionId: obj.id
              })
              if (ret_value != null){
                var images = document.getElementById("img_source");

                setTimeout(() => this.setImages(ret_value), 1000);
                // setTimeout(() => this.isPreview = true, 1000);
              }
              this.imageColumn = {
                id: report.id,
                fields: obj.fieldIndex,
                name: obj.name,
                reportFieldDefinitionId: obj.id
              }
              break
             case 10: //NOTE:video
              if (report == undefined) {
                break
              }
              ret_value = report.textValue
              columns_list.push({
                name: obj.name,
                column: 'video_' + obj.fieldIndex,
                type: 'video',
                value: ret_value,
                required: obj.required,
                maxlength: obj.fieldValidations == undefined? 512: obj.fieldValidations[0].numberValue,
                id: report.id,
                fieldIndex: obj.fieldIndex,
                path: '.fields['+obj.fieldIndex+']',
                reportFieldDefinitionId: obj.id
              })
              if (ret_value != null){
                this.videoOptions.sources[0]["src"] = ret_value;
                var that = this;
                this.req('/presignedUrl/?s3FilePath=' + ret_value, 'get', null, (err, res2) => {
                  that.isVideoPreview = true;
                  that.videoOptions.sources[0]["src"] = res2.body.presignedUrl;
                  that.$refs.video[0].reloadVideo(res2.body.presignedUrl,"");
                });
              }
              break
            case 8: // NOTE:floors
            case 9:
              var value = [];
              if (report.reportFieldFloors != undefined) {
                for (var i = 0; i < report.reportFieldFloors.length; i++) {
                  value.push(report.reportFieldFloors[i].floorId);
                }
              }
              var type;
              if (obj.type == 8) {
                type = 'floors';
              } else if (obj.type == 9) {
                type = 'floor';
              }
              columns_list.push({
                name: obj.name,
                column: 'floor_' + obj.fieldIndex,
                type: type,
                value: value,
                required: obj.required,
                maxlength: obj.fieldValidations == undefined? 512: obj.fieldValidations[0].numberValue,
                id: report.id,
                fieldIndex: obj.fieldIndex,
                path: '.fields['+obj.fieldIndex+']',
                reportFieldDefinitionId: obj.id
              })
              break
            default:
              ret_value = ''
          }
          cnt++
        }.bind(this))
        this.getModalViewContent();

        columns_list.sort(function(a,b){
          if(a.fieldIndex < b.fieldIndex) return -1;
          if(a.fieldIndex > b.fieldIndex) return 1;
          return 0;
        });
        //NOTE:日本時間変換
        var op = []
        for (var cnt = 0; cnt < columns_list.length; cnt++) {
          if (columns_list[cnt].column.match('dateValue')) {
            var ret_value = this.df_jst(columns_list[cnt].value)
            columns_list[cnt] = {
              id: columns_list[cnt].id,
              name: columns_list[cnt].name,
              column: columns_list[cnt].column,
              type: columns_list[cnt].type,
              required: columns_list[cnt].required,
              value: ret_value.replace(/-/g, "/"),
              hh: Number(ret_value.substr(11, 2)),
              mm: Number(ret_value.substr(14, 2)),
              fieldIndex: columns_list[cnt].fieldIndex,
              path: '.fields['+columns_list[cnt].fieldIndex+']',
              reportFieldDefinitionId: columns_list[cnt].reportFieldDefinitionId
            }
          }else if (columns_list[cnt].column.match('member')) {
            if (op.length == 0) {
              //NOTE:メンバーリスト存在しない場合、APIから取得
              var member_api ='/buildings/' +localStorage.getItem('buildings_id') +'/members'
              // var where = {"and":[{"operationCategoryId": this.$route.params.operation_id}, {"role":{"neq":3}}]};
              var where = {"and":[{"operationTypeId": this.getOperationTypeId(this.$route.params.operation_id)}, {"role":{"neq":3}}]};
              var op = []
              this.onSearch(member_api, null, where, (val) => {
                val.forEach(function(obj) {
                  op.push({ name: obj.name, value: obj.id })
                })
              })
            }
            columns_list[cnt] = {
              name: columns_list[cnt].name,
              column: columns_list[cnt].column,
              id: columns_list[cnt].id,
              type: columns_list[cnt].type,
              required: columns_list[cnt].required,
              value: columns_list[cnt].value,
              options: op,
              fieldIndex: columns_list[cnt].fieldIndex,
              path: '.fields['+columns_list[cnt].fieldIndex+']',
              reportFieldDefinitionId: columns_list[cnt].reportFieldDefinitionId
            }
          }else if(columns_list[cnt].column.match('textarea')){
            columns_list[cnt] = {
              name: columns_list[cnt].name,
              column: columns_list[cnt].column,
              id: columns_list[cnt].id,
              type: columns_list[cnt].type,
              required: columns_list[cnt].required,
              value: columns_list[cnt].value,
              maxlength: columns_list[cnt].maxlength,
              fieldIndex: columns_list[cnt].fieldIndex,
              path: '.fields['+columns_list[cnt].fieldIndex+']',
              rows: this.getRows(columns_list[cnt].value),
              reportFieldDefinitionId: columns_list[cnt].reportFieldDefinitionId
            }
          }
        }
        this.setContinuation(val);
        this.param.id = val.businessReport.id;
        this.majorItemId = this.$route.params.majoritems_id;
        this.operationId = this.$route.params.operation_id;
        this.param.columns = columns_list;
        this.param.createdAt = val.businessReport.createdAt;
        this.param.tmpUpdatedAt = val.businessReport.updatedAt;
      })
    },
    setContinuation(val) {
      if (val.businessReport.continuation) {
        document.getElementsByName("continuation")[0].checked = true;
      } else {
        document.getElementsByName("continuation")[0].checked = false;
      }
    },
    setImages(src){
     var images = document.getElementById("img_source")
     images.src = this.imageHeaderUrl + src;
     this.isPreview = true
    },
    getMajorItemsTitle(report_list) {
      for (var i = 0; i < report_list.length; i++) {
        for (var j = 0; j < report_list[i].majoritems.length; j++) {
          for (var k = 0; k < report_list[i].majoritems[j].reportObjectDefinitions.length; k++) {
            if (report_list[i].majoritems[j].reportObjectDefinitions[k].id == this.$route.params.majoritems_id) {
              return report_list[i].majoritems[j].reportObjectDefinitions[k].name;
            }
          }
        }
      }
    },
    getOperationName(report_list) {
      var find = report_list.find(val => val.id == this.$route.params.operation_id);
      return find.operation_name;
    },
    setMajoritemsTitle() {
      var report_list = JSON.parse(localStorage.getItem('report_list'));
      this.param.title = this.getMajorItemsTitle(report_list);
      this.param.operation = this.getOperationName(report_list);
    },
    onAddFile(event){
      var reader = new FileReader();
      var files = event.target.files;
      if (files[0]){
        if (files[0].size > 5000000) {
          var inputs = document.getElementById("file_select");
          inputs.value = "";
          this.alert.title = '';
          this.alert.message = '5MB以下のファイル容量のファイルを選択してください。';
          this.alert.note = '';
          this.alert.isConfirm = false;
          $('#modal_alert').modal('show')
          //alert("5MB以下のファイル容量のファイルを選択してください");
          return
        }
      }
      var image = document.getElementById("img_source");
      var imm = new Image()
      
      this.isPreview = true;
      this.isImageSelected = true;
      reader.onload = function (event) {   
        
        imm.onload = function (){
          this.ImgB64Resize(reader.result, imm.width, imm.height, 0,
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
        imm.src = reader.result;
        image.src = reader.result;
      };
      
      reader.onerror = function (){  
        // alert('このファイルは読み込めません。');  
      }
      
      if (files[0]){
        reader.readAsDataURL(files[0]);
      }
    },
    flexTextarea(el) {
      const dummy = el.querySelector('.flex_textarea_dummy');
      el.querySelector('.flex_textarea_textarea').addEventListener('input', e => {
        dummy.textContent = e.target.value + '\u200b';
      })
    },
    onSelectFileClick(){
      document.getElementById("file_select").click();
    },
    onImgClick(){
      var images = document.getElementById("img_source");
      var imgSrc = images.src
      this.$refs.child.showImage(imgSrc)
    },
    onDeleteFileClick(){
      this.isPreview = false;
      var image = document.getElementById("img_source");
      image.src = null;
      var inputs = document.getElementById("file_select");
      inputs.value = "";
    },
    /**
      * モーダルウィンドウのbodyに表示する内容の取得
      */
    getModalViewContent() {
      this.onSearch('/buildings/' + localStorage.getItem('buildings_id'), null, null, (val) => {
        var checkFloors  = [];
        for (var i = 0; i < this.param.columns.length; i++) {
          if (this.param.columns[i].column.match('floor')) {
            checkFloors = this.param.columns[i].value;
          }
        }
        this.param.display_floors = this.displayFloorFormat(val.floors, checkFloors, true);
        this.param.floors = this.displayFloorFormat(val.floors, checkFloors, false);
      })
    },
    onOKButtonClick(id, column){
      var modalContent = document.getElementsByName(id);
      for (var j = 0; j < this.param.columns.length; j++) {
        if (this.param.columns[j].column.match('floor')) {
          this.param.columns[j].value = this.modalCheckFloorsFormat(modalContent, this.param.floors, 3);
        }
      }
      this.param.display_floors = this.modalCheckFloorsFormat(modalContent, this.param.floors, 1);
      this.param.floors = this.modalCheckFloorsFormat(modalContent, this.param.floors, 2);
      $('#modal' + column).modal('hide');
    },
    openModal(id) {
      var modal_content = document.getElementsByName(id);
      for (var i = 0; i < modal_content.length; i++) {
        modal_content[i].checked = this.param.floors[i].checked;
      }
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
    },
    getFloor(id) {
      var find = this.param.floors.find(val => val.id == id);
      if (find != null) {
        if (find.floor_type != 3) {
          return find.name + 'F';
        } else {
          return find.name;
        }
      }
      return null;
    },
    getSelectName(select, id) {
      var find = select.find(val => val.value == id);
      if (find != null) {
        return find.name;
      }
      return null;
    },
    onOKButton() {
      this.$router.push('/building_report/' + this.$route.params.operation_id + '/' + this.$route.params.business_report_id + '/add/' )
    },
    copyContents() {
      localStorage.setItem('copy_majoritem', JSON.stringify({operation_id: this.$route.params.operation_id, majoritem_id: this.$route.params.business_report_id, id: this.param.id}));
      this.alert.title = '';
      this.alert.message = 'コピーしました。登録画面に遷移します。';
      this.alert.note = '';
      this.alert.isConfirm = true;
      $('#modal_confirm').modal('show')
    }
  },
  created() {
    const key = (this.$route.params.operation_id == 1) ? "Security:ReportObject:view" : "Cleaning:ReportObject:view";
    this.checkDisplayPermission(key,() => {
      let api_for_list = '/business-report/' + this.$route.params.id
      this.getMajoritemsData(api_for_list);
      this.setMajoritemsTitle();
    });
  },
  updated() {
    //document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
  },
  watch: {
    item: {
      handler(val) {
        this.param.columns.forEach((e) => {
          if (this.item[e.column] === '') {
            this.item[e.column] = undefined
          }
        })
        if (this.param.cb != null) {
          this.param.cb(val)
        }
      },
      deep: true
    }
  }
}
</script>
