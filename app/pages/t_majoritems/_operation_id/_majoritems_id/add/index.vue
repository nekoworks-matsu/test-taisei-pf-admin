<template>
  <div align="left">
    <tablet-header-view ref="header" :param="param"></tablet-header-view>
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <div class="box content ctm_subtitle margin_bottom_0 box_shadow_none" v-bind:style="{'margin-top':tabletHeight+'px'}">
      <div class="box-body no-paddin">
        <form  class="form-horizontal" autocomplete="off">        
          <div class="box-body padding_top_40 padding_bottom_60">
            <!-- <div class="padding_bottom_20" style="margin-right: auto; margin-left: auto; max-width: 540px">
              <button type="button" class="input_file_button" @click="pasteContent()" v-bind:class="{cursor_not_allowed: this.isPasteDisabled}" v-bind:disabled="this.isPasteDisabled">
                <i class="fas fa-paste"></i>
                <span class="margin_left_10">コピー内容をペースト</span>
              </button>
            </div> -->
            
            <div class="form-group t_form_parts display_flex padding_bottom_20" style="margin-right: auto; margin-left: auto">
              <div class="t_form_parts_title" style="width: 140px;">
                <label class="control-label">ID</label>
              </div>
              <!-- <label class="col-sm-4 pull-left width_max font_18">大項目レコードID</label>   -->
              <div class="t_form_parts_field">
                <div class="item-text">※自動採番</div>
              </div>
            </div>

              <div class="form-group t_form_parts padding_bottom_20" style="margin-right: auto; margin-left: auto" v-for="col in param.columns" v-bind:class='{required:col.required}'>
                <div class="t_form_parts_title">
                  <label class="control-label" v-if="!col.title&&col.type!='hiddenColmun'&&col.type!='image'&&col.type!='video'">{{col.name}}</label>
                </div>
              　<div v-if="col.type=='image'">
                  <div class="t_form_parts_field padding_top_5 width_max">
                    <div class="t_form_parts_title">
                      <label class="control-label">{{col.name}}</label>
                    </div>
                    <div class="t_form_parts_field padding_top_5">
                      <div class="input_file">
                        <label class="input_file_head">
                          <input id="file_select" class="col-sm-8 control-label" style="display:none" type="file" accept="image/*"  @change="onAddFile">
                          <button type="button" class="input_file_button accent" @click="onSelectFileClick">画像を選択</button>
                          <p class="input_file_notes">ファイル容量5MB以下 / Jpg、png形式に対応</p>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="form-group" style="margin-top: 20px;">
                    <!-- <label class="col-sm-4 width_max font_18">プレビュー</label> -->
                    <img id="img_source" style="margin-left: 15px;" v-bind:class="{ img_thumbnail: isPreview, opacity_0: !isPreview}" data-toggle="modal" v-bind:data-target="'#modal'" @click="onImgClick">
                    <button type="button" v-if="isPreview" class="btn btn-danger btn-flat square_button margin_top_minus_20" style="margin-left: 8px;" @click="onDeleteFileClick"><i class="fa fa-times"></i></button>
                  </div>
                </div>


                <div v-if="col.type=='video'">
                  <div class="t_form_parts_field padding_top_5 width_max">
                    <div class="t_form_parts_title">
                      <label class="control-label">{{col.name}}</label>
                    </div>
                    <div class="t_form_parts_field padding_top_5">
                      <div class="input_file">
                        <label class="input_file_head">
                          <input id="video_select" class="col-sm-8 control-label" style="display:none" type="file" accept="video/*"  @change="onAddVideoFile">
                          <button type="button" class="input_file_button accent" @click="onVideoSelectFileClick">動画を選択</button>
                          <p class="input_file_notes">mp4形式に対応</p>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="input_file_image margin_top_20 margin_bottom_10">
                    <div v-show="isVideoPreview" class="form_box_group_field video_parent">
                      <div>
                        <video-player ref="video" :options="videoOptions"/>
                      </div>
                    </div>
                  </div>
                  <div class="input_file_image_buttonarea">
                    <button type="button" v-if="isVideoPreview" class="btn btn-danger" style="vertical-align: top;" @click="onDeleteVideoClick"><i class="fa fa-times"></i></button>
                  </div>                  
                </div>  

                <div class="t_form_parts_field padding_top_5 width_max" v-if="col.type=='text'">
                  <input type="text" v-bind:maxlength="col.maxlength" class="form-control width_max input-lg" v-bind:id="col.column" v-bind:placeholder="col.placeholder" v-model="item[col.column]=col.value">
                </div>
                <div class="t_form_parts_field padding_top_5 width_max" v-if="col.type=='number'">
                  <input type="text" v-bind:maxlength="col.maxlength" class="form-control width_max input-lg" v-bind:id="col.column" v-bind:placeholder="col.placeholder" v-model="item[col.column]=col.value"  oninput="value = value.replace(/[^0-9]+/i,'');">
                </div>
                
                <div class="t_form_parts_field padding_top_5 flex_textarea width_max" style="margin-top: 5px" v-if="col.type=='textarea'">
                  <div class="flex_textarea_dummy t_flex_textarea_dummy_input_lg" aria-hidden="true">{{item[col.column]=col.value}}</div>
                  <textarea id="FlexTextarea" class="flex_textarea_textarea form-control input-lg" v-model="item[col.column]=col.value" v-bind:maxlength="col.maxlength" v-bind:placeholder="(col.placeholder ? col.placeholder + '\n' : '') + '※改行で複数行入力可'"></textarea>
                </div>
                
                <div class="t_form_parts_field padding_top_5" v-if="col.type=='select'">
                  <select class="form-control _t_form_parts_content max_width_390" v-bind:id="col.column" v-model="item[col.column]=col.value" >
                    <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                  </select>
                </div>

                <div class="t_form_parts_field padding_top_5" v-if="col.type=='member'">
                  <select class="form-control _t_form_parts_content max_width_390" v-bind:id="col.column" v-model="item[col.column]=col.value">
                    <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                  </select>
                </div>
                
                <div class="t_form_parts_field padding_top_5" v-if="col.type=='datetime'">
                  <div class="t_date_time t_date_time_flex">
                    <div class="t_date_time_flex_picker">
                      <vuejs-datepicker  class="form-control input_date_picker _t_form_parts_content" :clear-button="true" :format="DatePickerFormat" :language="language" :value="col.value" name="datepicker" v-model="item[col.column]=col.value" placeholder="YYYY/MM/DD"></vuejs-datepicker>
                    </div>
                    <div class="t_date_time_flex_ht">
                      <div class="t_date_time_flex_ht_item">
                        <select class="form-control t_date_time_hours _t_form_parts_content" v-model="col.hh" v-bind:id="col.column+'hh'">
                          <option v-bind:value="n-1" v-for="n in 24">{{timeConverter(n-1)}}</option>
                        </select>
                        <p>時</p>
                      </div>
                      <div class="t_date_time_flex_ht_item">
                        <select class="form-control t_date_time_hours _t_form_parts_content" v-model="col.mm" v-bind:id="col.column+'mm'">
                          <option v-bind:value="n-1" v-for="n in 60">{{timeConverter(n-1)}}</option>
                        </select>
                        <p>分</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group t_form_parts" style="margin-right: auto; margin-left: auto" v-if="col.type=='floors'">
                  <div class="t_form_parts_field padding_top_5">
                    <div class="item-text font_14">{{param.display_floors}}</div>
                    <button type="button" class="btn global_btn global_btn_sub width_90 margin_top_15" data-toggle="modal" v-bind:data-target="'#modal'+col.column" @click="openModal('modal'+col.column)">詳細</button>
                  </div>
                </div>
                <div class="t_form_parts_field padding_top_5" v-if="col.type=='floor'">
                  <select class="form-control _t_form_parts_content max_width_390" v-bind:id="col.column" v-model="item[col.column][0]=col.value[0]">
                    <option></option>
                    <option v-bind:value="opt.id" v-for="opt in param.floors"><span v-if="opt.floor_type!=3">{{opt.name}}F</span><span v-if="opt.floor_type==3">{{opt.name}}</span></option>
                  </select>
                </div>
              </div>
              <div class="form-group t_form_parts padding_bottom_20" style="margin-right: auto; margin-left: auto">
                <div class="t_form_parts_title">
                  <label class="control-label" for="continuation_id">継続案件</label>
                  <span class="color_pink font_weight_normal">（※継続案件の場合チェックを入れてください。）</span>
                </div>
                <div class="t_form_parts_field padding_top_5">
                  <label class="control control_checkbox control_checkbox_single">
                    <input type="checkbox" name="continuation" id="continuation_id">
                    <div class="control_indicator"></div>
                  </label>
                </div>
              </div>
              <input type="hidden" class="form-control" id="reportObjectDefinitionId" v-model="param.reportObjectDefinitionId"/>
            </div>
            <div class="box-footer with-border t_box_footer">
              <div v-if="error" class="callout callout-danger err-info font_18"><p>{{error}}</p></div>
              <div class="t_form_button_flex flex_center padding_top_30 padding_bottom_30">
                <button type="button" class="btn btn-default global_btn t_main_button t_form_button_flex_item" @click="onCancelButtonClick" v-bind:disabled="this.isButtonDisabled">キャンセル</button>
                <button type="button" class="btn btn-info global_btn t_main_button t_form_button_flex_item"   @click="onAddButtonClick" v-bind:disabled="this.isButtonDisabled">保存</button>
              </div>
            </div>
            <!-- <div class="box-footer">
              <div v-if="error" class="callout callout-danger btn-lg btn-block"><p>{{error}}</p></div>
              <button type="button" class="btn btn-warning btn-lg btn-block"   @click="onAddButtonClick" v-bind:disabled="this.isButtonDisabled">登 録</button>
              <button type="button" class="btn btn-default btn-lg btn-block margin_top_20"  onclick="window.history.back()" v-bind:disabled="this.isButtonDisabled">キャンセル</button>
            </div> -->
          <!-- /.box-footer -->
        </form>
      </div>
    </div>
    <template>
      <modal-img-view　ref="child" :id="'modal'" :title="'拡大プレビュー'"></modal-img-view>
    </template>
    <template v-for="col in param.columns">
      <modal-floor-view :param="param.floors" :title="'フロア'" :id="'modal'+col.column" :column="col.column" @okbuttonclick="onOKButtonClick" v-if="col.type=='floors'"></modal-floor-view>
    </template>
    <template>
      <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert" @onconfirm="onOKButtonForTransition"></modal-alert-view>
    </template>
  </div>
</template>
<script>
import TabletHeaderView from '~/components/TabletHeaderView'
import ModalImgView from '~/components/ModalImgView'
import ModalFloorView from '~/components/ModalFloorView'
import ModalAlertView from '~/components/ModalAlertView'
import TModalView from '~/components/TModalView'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VideoPlayer from "~/components/VideoPlayer.vue";
import 'video.js/dist/video-js.css';

export default {
  layout: 'everyone',
  beforeRouteLeave(to, from, next) {
    if (!this.isTransition && (to.path != '/t_login')) {
      this.alert.title = '';
      this.alert.message = '編集中の内容を破棄します。<br>よろしいでしょうか？<br>';
      this.alert.note = '';
      this.alert.isConfirm = true;
      this.next = next;
      $('#modal_alert').modal('show')
      next(false);
    } else {
      next();
    }
  },
  data() {
    return {
      tabletHeight: 0,
      isPreview: false,
      isVideoPreview: false,
      videoUrl: '',
      videoColumn: null,
      imageColumn: null,
      isButtonDisabled: false,
      isPasteDisabled: true,
      isTransition: false,
      copyMajoritem: '',
      nowDate: '',
      alert: {
        title: 'test',
        message: '',
        note: '',
        isConfirm: false,
      },
      param: {
        title: '',
        reportObjectDefinitionId: '',
        init_val: {},
        cb: this.updateView,
        api: '/report-objects',
        icon: 'fa-user',
        success: '/t_majoritems/'+this.$route.params.majoritems_id,
        columns: [],
        reportFieldDefinitionIds: [],
        floors: [],
        display_floors: "",
        isBackButtons: true,
        isHomeButtons: true,
      },
      item: {
        reportObjectDefinitionId: '',
        reportedBy: 0,
        reportAt: '',
        fields: [{}]
      },
      error: '',
      fullpage: true,
      DatePickerFormat: 'yyyy/MM/dd',
      language: {
        language: 'Japanese',
        months: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        monthsAbbr: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        days: ['日', '月', '火', '水', '木', '金', '土'],
        rtl: false,
        ymd: 'yyyy-MM-dd',
        yearSuffix: '年'
      },
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
    TabletHeaderView,
    ModalImgView,
    ModalFloorView,
    ModalAlertView,
    TModalView,
    Loading,
    VideoPlayer
  },
  methods: {
    addRequest() {
      var fields = []
      for (var i = 0; i < Object.keys(this.item).length; i++) {
        var data = Object.keys(this.item)
        var indexes = data[i].split('_');
        var index = Number(indexes[1]);
        if (data[i].match('textValue')) {
          fields.push({
            fieldIndex: Number(data[i].slice(10)),
            textValue: this.item[data[i]] == undefined? '':this.item[data[i]],
            reportFieldDefinitionId: this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId            
          })
         } else if (data[i].match('numberValue')) {
          fields.push({
            fieldIndex: Number(data[i].slice(12)),
            numberValue: Number(this.item[data[i]]),
            reportFieldDefinitionId: this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId
          })
        } else if (data[i].match('dateValue')) {
          let time = document.getElementById(data[i] +'hh').value 
          if(time.length<2)  time = '0'+time;
          if(document.getElementById(data[i] +'mm').value.length<2){
              time = time + ':0'+document.getElementById(data[i] +'mm').value+':00.000Z'
          } else {
              time = time + ':'+document.getElementById(data[i] +'mm').value+':00.000Z'
          }
          fields.push({
            fieldIndex: Number(data[i].slice(10)),
            dateValue: this.item[data[i]] == null? time:this.df_utc(this.changeDateFormat(this.item[data[i]]) +'T'+ time),
            reportFieldDefinitionId: this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId
          })
        } else if (data[i].match('select')) {
          fields.push({
            fieldIndex: Number(data[i].slice(7)),
            selectOptionDefinitionId: this.item[data[i]],
            reportFieldDefinitionId: this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId
          })
        } else if (data[i].match('member')) {
          fields.push({
            fieldIndex: Number(data[i].slice(7)),
            memberId: Number(this.item[data[i]]),
            reportFieldDefinitionId: this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId
          })
        
        } else if (data[i].match('textarea')) {
          fields.push({
            fieldIndex: Number(data[i].slice(9)),
            textValue: this.item[data[i]],
            reportFieldDefinitionId: this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId
          })
        } else if (data[i].match('floor')) {
          fields.push({
            fieldIndex: Number(data[i].slice(6)),
            floors: this.item[data[i]][0] == null ? [] : this.item[data[i]],
            reportFieldDefinitionId: this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId
          })
        }
      }
       if (this.imageColumn != null) {
        if (this.isPreview) {
          var images = document.getElementById("img_source").src;
          var imagesSplit = images.split(this.imageHeaderUrl);
          images = imagesSplit[1];

          fields.push({
            fieldIndex: this.imageColumn.fields,
            textValue: images,
            reportFieldDefinitionId: this.imageColumn.reportFieldDefinitionId
          })
        }else{
          fields.push({
            fieldIndex: this.imageColumn.fields,
            reportFieldDefinitionId: this.imageColumn.reportFieldDefinitionId
          })
        }
      }

       if (this.videoColumn != null){
        if (this.isVideoPreview) {
          fields.push({
            fieldIndex: this.videoColumn.fields,
            textValue: this.videoUrl,
            reportFieldDefinitionId: this.videoColumn.reportFieldDefinitionId
          });
        }else{
          fields.push({
            fieldIndex: this.videoColumn.fields,
            reportFieldDefinitionId: this.videoColumn.reportFieldDefinitionId
          });
        }
      }


      fields.sort(function(a,b){
        if (a.fieldIndex < b.fieldIndex) return -1;
        if (a.fieldIndex > b.fieldIndex) return 1;
        return 0;
      });

      let buildingId = localStorage.getItem('buildings_id');
      var send_data = {
        buildingId: buildingId,
        reportObjectDefinitionId: this.param.reportObjectDefinitionId,
        reportedBy: Number(localStorage.getItem('member_id')),
        continuation: document.getElementsByName("continuation")[0].checked,
        fields: fields
      }
      
      var that = this;
      this.req(this.param.api, 'post', send_data, (err, res) => {
        if (err) {
          this.error = this.getMajoritemsErrorMsg(res, this.param.columns)
          return;
        } else if (res.body) {
          that.$router.push("/t_majoritems/" + this.$route.params.operation_id + '/' + res.body.reportObjectDefinition.id);
        }
      })
    },
    onAddButtonClick() {
      this.error = ''
      this.isTransition = true;
      this.addRequest()
    },
    onCancelButtonClick() {
      this.error = ''
      this.isTransition = true;
      this.$router.go(-1)
    },
    onImgClick(){
      var images = document.getElementById("img_source");
      var imgSrc = images.src
      this.$refs.child.showImage(imgSrc)
    },
    setMajorItemsHeader(val) {
      const majoritem_title = val.name //大項目名
      const columns_list = []
      const reportFieldDefinitionIds = []
      const now_day = this.get_now_date('YYYYY/MM/DD')
      const now_hh = this.get_now_date('HH')
      const now_mm = this.get_now_date('MI')
      this.nowDate = now_day.replace(/\//g, '-') + 'T' + now_hh + ':' + now_mm + ':00+09:00';
      val.reportFieldDefinitions.forEach(function(obj) {
        switch (obj.type) {
          case 1:
            columns_list.push({
              name: obj.name,
              placeholder: obj.placeholder,
              column: 'textValue_' + obj.fieldIndex,
              type: 'text',
              required: obj.required,
              maxlength: obj.fieldValidations == undefined? 512: obj.fieldValidations[0].numberValue,
              path: '.fields['+obj.fieldIndex+']'
            }),
            reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
            break
          case 2:
            columns_list.push({
              name: obj.name,
              column: 'dateValue_' + obj.fieldIndex,
              type: 'datetime',
              required: obj.required,
              value: now_day,
              hh: now_hh,
              mm: now_mm,
              reportFieldDefinitionId: obj.id,
              path: '.fields['+obj.fieldIndex+']'
            })
            reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
            break
          case 3: //NOTE:number
            columns_list.push({
              name: obj.name,
              placeholder: obj.name + "(半角数字)",
              column: 'numberValue_' + obj.fieldIndex,
              type: 'number',
              required: obj.required,
              maxlength: obj.fieldValidations == undefined? 128: String(obj.fieldValidations[0].numberValue).length,
              reportFieldDefinitionId: obj.id,
              path: '.fields['+obj.fieldIndex+']'
            })
            reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
            break
          case 4: //NOTE:select
            var select_value = []
            obj.selectOptionDefinitions.forEach(function(sel) {
              select_value.push({ name: sel.label, value: sel.id })
            })
            columns_list.push({
              name: obj.name,
              column: 'select_' + obj.fieldIndex,
              type: 'select',
              required: obj.required,
              options: select_value,
              reportFieldDefinitionId: obj.id,
              path: '.fields['+obj.fieldIndex+']'
            })
            reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
            break
          case 5://NOTE:select member
            columns_list.push({
              name: obj.name,
              column: 'member_' + obj.fieldIndex,
              type: 'member',
              required: obj.required,
              value: obj.memnerId,
              reportFieldDefinitionId:obj.id,
              path: '.fields['+obj.fieldIndex+']'
            })
            reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
            break
          case 6://NOTE:textarea
            columns_list.push({
              name: obj.name,
              placeholder: obj.placeholder,
              column: 'textarea_' + obj.fieldIndex,
              type: 'textarea',
              required: obj.required,
              maxlength: obj.fieldValidations == undefined? 512: obj.fieldValidations[0].numberValue,
              reportFieldDefinitionId: obj.id,
              path: '.fields['+obj.fieldIndex+']'
            })
            reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
            break
          case 7://NOTE:image
            columns_list.push({
              name: obj.name,
              column: 'image_' + obj.fieldIndex,
              type: 'image',
              required: obj.required,
              maxlength: obj.fieldValidations == undefined? 10000000: obj.fieldValidations[0].numberValue,
              reportFieldDefinitionId: obj.id,
              path: '.fields['+obj.fieldIndex+']'
            })
            this.imageColumn = {
              fields: obj.fieldIndex,
              name: obj.name,
              reportFieldDefinitionId: obj.id
            }
            reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
            break
          case 8: //NOTE: floors
            var type;
            type = 'floors';
            columns_list.push({
              name: obj.name,
              column: 'floor_' + obj.fieldIndex,
              type: type,
              required: obj.required,
              maxlength: obj.fieldValidations == undefined? 256: obj.fieldValidations[0].numberValue,
              reportFieldDefinitionId: obj.id,
              path: '.fields['+obj.fieldIndex+']'
            })
            var floors = [];
            for (var i = 0; i < this.param.floors.length; i++) {
              floors.push(this.param.floors[i].id);
            }
            this.item['floor_'+obj.fieldIndex] = floors;
            reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
            break
          case 9: //NOTE: floor
            var type;
            type = 'floor';
            columns_list.push({
              name: obj.name,
              column: 'floor_' + obj.fieldIndex,
              type: type,
              required: obj.required,
              maxlength: obj.fieldValidations == undefined? 256: obj.fieldValidations[0].numberValue,
              reportFieldDefinitionId: obj.id,
              value: [],
              path: '.fields['+obj.fieldIndex+']'
            })
            var floors = [];
            this.item['floor_'+obj.fieldIndex] = floors;
            reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
            break
          case 10:
            columns_list.push({
              name: obj.name,
              column: 'video_' + obj.fieldIndex,
              type: 'video',
              required: obj.required,
              maxlength: obj.fieldValidations == undefined? 10000000: obj.fieldValidations[0].numberValue,
              reportFieldDefinitionId: obj.id,
              path: '.fields['+obj.fieldIndex+']'
            })

            this.videoColumn = {
              fields: obj.fieldIndex,
              name: obj.name,
              reportFieldDefinitionId: obj.id
            }
            reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
            break

          default:
            break
        }
      }.bind(this))
      //NOTE:メンバー一覧取得
      var op = []
      for (var cnt = 0; cnt < columns_list.length; cnt++) {
        if (columns_list[cnt].column.match('member')) {
          if (op.length == 0) {
            //NOTE:メンバーリスト存在しない場合、APIから取得
            var member_api = '/buildings/' + localStorage.getItem('buildings_id') + '/members'
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
            type: columns_list[cnt].type,
            required: columns_list[cnt].required,
            value: localStorage.getItem('member_id'),
            options: op
          }
        }
      }  
      this.param.columns = columns_list;
      this.param.reportFieldDefinitionIds = reportFieldDefinitionIds;
      this.param.title = majoritem_title + '登録';
      this.param.reportObjectDefinitionId = val.id;
      this.tabletHeight = this.$refs.header.$el.clientHeight;
      this.setPasteInfo();
    },
    getMajoritemsHeader(api) {
      this.onSearch(api, null, null, (val) => {
        this.getModalViewContent(val);  
      })
    },
    flexTextarea(el) {
      const dummy = el.querySelector('.flex_textarea_dummy');
      el.querySelector('.flex_textarea_textarea').addEventListener('input', e => {
        dummy.textContent = e.target.value + '\u200b';
      })
    },
    updateView(val) {},
    onAddVideoFile(event){
      var reader = new FileReader();
      var files = event.target.files;
      var that = this;
      this.multipartReq(
          "/files", 
          'post', 
          null,
          files[0], 
          (err, res) => {
          if (err) {
            this.error = "imageError";
          } else if (res.body) {
            this.req('/presignedUrl/?s3FilePath=' + res.body.fileId, 'get', null, (err, res2) => {
              that.isVideoPreview = true;
              this.videoOptions.sources[0]["src"] = res2.body.presignedUrl;
              this.$refs.video[0].reloadVideo(res2.body.presignedUrl,"");
            });
            that.videoUrl = res.body.fileId;
          }
       });
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
          // alert("5MB以下のファイル容量のファイルを選択してください");
          return
        }
      }
      var image = document.getElementById("img_source");
      var imm = new Image()

      this.multipartReq(
          "/files", 
          'post', 
          null,
          files[0], 
          (err, res) => {
          if (err) {
            this.error = "imageError";
          } else if (res.body) {
            setTimeout(() => image.src = this.imageHeaderUrl + res.body.fileId, 1000);
          }
       });


      this.isPreview = true;
      
      reader.onload = function (event) {   
         
        imm.onload = function (){
          // this.ImgB64Resize(reader.result, imm.width, imm.height, 0,
          //   function(img_b64) {
          //     // Destination Image
          //     image.src = img_b64;
          //   }
          // );
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
    onVideoSelectFileClick(){
      document.getElementById("video_select").click();
    },
    onSelectFileClick(){
      document.getElementById("file_select").click();
    },
    onOKButtonForTransition() {
      this.next();
    },
    onDeleteVideoClick(){
      this.isVideoPreview = false;
    },
    onDeleteFileClick(){
      this.isPreview = false;
      var image = document.getElementById("img_source");
      image.src = null;
      var inputs = document.getElementById("file_select");
      inputs.value = "";
    },
    onOKButtonClick(id, column){
      var modalContent = document.getElementsByName(id);
      this.param.display_floors = this.modalCheckFloorsFormat(modalContent, this.param.floors, 1);
      this.param.floors = this.modalCheckFloorsFormat(modalContent, this.param.floors, 2);
      this.item[column] = this.modalCheckFloorsFormat(modalContent, this.param.floors, 3);
      $('#modal' + column).modal('hide');
    },
    /**
      * モーダルウィンドウのbodyに表示する内容の取得
      */
    getModalViewContent(resdata) {
      var name = "";
      var floors = [];
      this.onSearch('/buildings/' + localStorage.getItem('buildings_id'), null, null, (val) => {
        this.param.display_floors = this.displayFloorFormat(val.floors, null, true);
        this.param.floors = this.displayFloorFormat(val.floors, null, false);
        this.setMajorItemsHeader(resdata);
      })
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
    inputFloor(val, id) {
      if (val == "") {
        this.item[id] = [];
      } else {
        this.item[id] = [parseInt(val)];
      }
    },
    getRows(text) {
      if (text == undefined || text == null) {
        return 1
      }
      return text.split('\n').length
    },
    setImages(src){
      var images = document.getElementById("img_source")
      images.src = this.imageHeaderUrl + src;
      this.isPreview = true
    },
    getMajoritemsData(api) {
      this.onSearch(api, null, null, (val) => {
        // this.param.title = val.reportObjectDefinition.name //大項目名
        const columns_list = []
        var cnt = 0
        var daily_data = '';
        val.reportObjectDefinition.reportFieldDefinitions.forEach(function(obj) {
          var report = val.reportObject.reportFields.find( (v) => v.reportFieldDefinitionId === obj.id )
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
              daily_data = obj.name;
              columns_list.push({
                id: report.id,
                name: daily_data,
                column: 'dateValue_' + obj.fieldIndex,
                type: 'datetime',
                required: obj.required,
                value: this.nowDate,
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
              var op_list = val.reportObjectDefinition.reportFieldDefinitions.find( (v) => v.id === report.reportFieldDefinitionId )
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
              }
              this.imageColumn = {
                id: report.id,
                fields: obj.fieldIndex,
                name: obj.name,
                reportFieldDefinitionId: obj.id
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
        this.getFloorsContents();

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
        this.param.columns = columns_list;
      })
    },
    /**
      * モーダルウィンドウのbodyに表示する内容の取得
      */
    getFloorsContents() {
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
    setContinuation(val) {
      if (val.reportObject.continuation) {
        document.getElementsByName("continuation")[0].checked = true;
      } else {
        document.getElementsByName("continuation")[0].checked = false;
      }
    },
    getSendData(search_field) {
      const now = new Date();
      return {
        reportObjectDefinitionId: this.$route.params.majoritems_id,
        order: [
        ],
        inputType: 2,
        conditions: [
          {
            reportFieldDefinitionId: search_field,
            inputType: 2,
            innerConditions: [
              {
                searchType: 3,
                dateValue: now.toISOString()
              }
            ]
          }
        ]
      }
    },
    reportObjectsRequest(api) {
      this.onSearch('/report-object-definitions/' +this.$route.params.majoritems_id +'/report-field-definitions', null, null, (val) => {
        var search_field = 0
        
        val.reportFieldDefinitions.forEach(function(obj) {
          if (obj.reportExtractField) search_field = obj.id //検索条件フィールド
        })
        this.onSearch(api, this.getSendData(search_field), null, (val2) => {
          if (val2.reportObjects.length != 0) {
            this.getMajoritemsData('/report-objects/' + val2.reportObjects[val2.reportObjects.length - 1].id);
          } else {
            this.alert.title = '';
            this.alert.message = '登録されているデータがありません。';
            this.alert.note = '';
            this.alert.isConfirm = false;
            $('#modal_alert').modal('show')
          }
        });
      });
    },
    pasteContent() {
      // this.reportObjectsRequest('/buildings/' + localStorage.getItem('buildings_id') + '/report-objects');
      if (this.$route.params.operation_id == this.copyMajoritem.operation_id && this.$route.params.majoritems_id == this.copyMajoritem.majoritem_id) {
        this.getMajoritemsData('/report-objects/' + this.copyMajoritem.id);
      } else {
        this.alert.title = '';
        this.alert.message = '業務が異なるためペーストできません。';
        this.alert.note = '';
        this.alert.isConfirm = false;
        $('#modal_alert').modal('show')
      }
    },
    setPasteInfo() {
      this.copyMajoritem = JSON.parse(localStorage.getItem('copy_majoritem'));
      if (this.copyMajoritem != null) {
        setTimeout(() => this.pasteContent(), 500);
      }
      // if (this.copyMajoritem != null) {
      //   this.isPasteDisabled = false;
      // } else {
      //   this.isPasteDisabled = true;
      // }
    }
  },
  created() {
    const key = (this.$route.params.operation_id == 1) ? "Security:ReportObject:create" : "Cleaning:ReportObject:create";
    this.checkDisplayPermission(key,() => {
      this.item = {};
      let api_for_list ='/report-object-definitions/' + this.$route.params.majoritems_id +'/report-field-definitions';
      this.getMajoritemsHeader(api_for_list);
      $("body").css('background-color', '#FFF');
    });
  },
  updated() {
    this.tabletHeight = this.$refs.header.$el.clientHeight;
    document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
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
<style lang="stylus" scoped></style>
