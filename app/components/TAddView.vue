<template>
  <div class="sidebar_scroll header_background" align="left">
    <tablet-header-view ref="header" :param="param"></tablet-header-view>
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <div class="box content ctm_subtitle margin_bottom_0 box_shadow_none" v-bind:style="{'margin-top':tabletHeight+'px'}">
    <!-- Main content -->
      <div class="box-body no-padding">
        <form class="form-horizontal" autocomplete="off" style="margin:0;">
          <div class="box-body padding_top_40 padding_bottom_60">
            <div class="form-group t_form_parts display_flex padding_bottom_20" style="margin-right: auto; margin-left: auto">
              <div class="t_form_parts_title" style="width: 130px;">
                <!-- <label class="control-label">{{param.idLabel||title}}ID</label> -->
                <label class="control-label">ID</label>
              </div>
              <div class="t_form_parts_field">
                <div class="item-text">※自動採番</div>
              </div>
            </div>

            <div class="form-group t_form_parts padding_bottom_20" style="margin-right: auto; margin-left: auto" v-if="col.type!='hiddenColmun'" v-for="col in param.columns" v-bind:class='{required:col.required} '>
              <div class="box-header with-border" v-if="col.title">
                <h3 class="box-title with-border">{{col.name}}</h3>
              </div>
              <div class="t_form_parts_title" v-if="!col.title&&col.type!='threeTextInput'&&col.type!='hiddenColmun'&&col.type!='file'">
                <label class="control-label" v-bind:for="col.column">{{col.name}}</label>
              </div>
             

            <div class="t_form_parts_field padding_top_5 width_max" v-if="!col.title && !col.type">
              <input type="text" v-bind:maxlength="col.maxlength" class="form-control width_max input-lg" v-bind:id="col.column" v-bind:placeholder="col.placeholder" v-model="item[col.column]" v-bind:disabled="col.disabled">
              <span v-if="col.text">{{col.text}}</span>
            </div>
            <div class="col-sm-8" v-if="col.type=='date'">
              <input type="date" class="form-control input-lg" v-bind:id="col.column" v-bind:placeholder="col.placeholder" v-model="item[col.column]">
              <span v-if="col.text">{{col.text}}</span>
            </div>
                  
            <div class="col-sm-8" v-if="col.type=='datePicker'">
              <vuejs-datepicker class="form-control date_picker input-lg" :clear-button="true" :format="DatePickerFormat" :language="language" :value="col.text" name="datepicker" v-model="item[col.column]"  v-bind:placeholder="col.placeholder"></vuejs-datepicker>
            </div>

            <div class="t_form_parts_field padding_top_5" v-if="col.type == 'datetime'">
              <div class="t_date_time t_date_time_flex">
                <div class="t_date_time_flex_picker">
                  <vuejs-datepicker class="form-control input_date_picker _t_form_parts_content" :clear-button="true" :format="DatePickerFormat" :language="language" :value="col.date" name="datepicker" v-model="item[col.column]"  v-bind:placeholder="col.placeholder"></vuejs-datepicker>
                </div>
                <div class="t_date_time_flex_ht">
                  <div class="t_date_time_flex_ht_item">
                    <select class="form-control t_date_time_hours _t_form_parts_content" v-model="col.hh">
                      <option v-bind:value="n" v-for="n in 24">{{timeConverter(n-1)}}</option>
                    </select>
                    <p>時</p>
                  </div>
                  <div class="t_date_time_flex_ht_item">
                    <select class="form-control t_date_time_hours _t_form_parts_content" v-model="col.mm">
                      <option v-bind:value="n" v-for="n in 60">{{timeConverter(n-1)}}</option>
                    </select>
                    <p>分</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="t_date_time" v-if="col.type == 'datetimeUp'">
              <div class="col-sm-2 width_225">
                <vuejs-datepicker :calendarClass="{ 'calendar_up' : true }" class="form-control date_picker_small input-lg" :clear-button="true" :format="DatePickerFormat" :language="language" :value="col.date" name="datepicker" v-model="item[col.column]"  v-bind:placeholder="col.placeholder"></vuejs-datepicker>
              </div>
              <div class="col-sm-4 min_width_400">
                <select class="form-control input-lg t_date_time_hours" v-model="col.hh">
                  <option v-bind:value="n" v-for="n in 24">{{timeConverter(n-1)}}</option>
                </select>
                <select class="form-control input-lg t_date_time_hours" v-model="col.mm">
                  <option v-bind:value="n" v-for="n in 60">{{timeConverter(n-1)}}</option>
                </select>
              </div>
            </div>

            <div class="t_form_parts_field padding_top_5" v-if="col.type=='select'">
              <select class="form-control _t_form_parts_content max_width_390" v-bind:id="col.column" v-model="item[col.column]" v-bind:disabled="col.disabled">
                <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
              </select>
            </div>

            <div class="col-sm-8" v-if="col.type=='multiSelect'">
              {{createMultiForm(item, col.column)}}
              <div v-for="(item, index) in getIndexNum(item[col.column])" :class="[{ 'input-group': index!==0 }, { 'margin_top_8': index!==0 }]">
                <select class="form-control" :value="displayValue(index, col.column)" @input="inputForm($event, index, col.column)" v-bind:disabled="col.disabled">
                  <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                </select>
                <span class="input-group-btn">
                  <button type="button" class="btn btn-danger btn-flat" @click="onRemoveForm(index, col.column)" v-if="index!==0"><i class="fa fa-minus"></i></button>
                </span>
              </div>
              <button type="button" class="btn btn-success pull-right margin_top_8" @click="onAddForm(col.column)"><i class="fa fa-plus"></i></button>
            </div>

            <div class="t_form_parts_field padding_top_5 flex_textarea width_max" style="margin-top: 5px" v-if="col.type=='textarea'">
              <div class="flex_textarea_dummy t_flex_textarea_dummy_input_lg" aria-hidden="true"></div>
              <textarea id="FlexTextarea" class="flex_textarea_textarea form-control width_max input-lg" v-model="item[col.column]=col.value" v-bind:maxlength="col.maxlength" v-bind:placeholder="(col.placeholder ? col.placeholder + '\n' : '') + '※改行で複数行入力可'"></textarea>
            </div>

            <div class="col-sm-8" v-if="col.type=='radio'">
              <label v-bind:for="col.column+opt.value" v-for="opt in col.options"><input type="radio" v-bind:name="col.column" v-bind:id="col.column+opt.value" v-bind:value="opt.value" v-model="item[col.column]" v-bind:disabled="opt.disabled" />{{opt.name}}&nbsp;&nbsp;&nbsp;&nbsp;</label>
            </div>
            <div class="col-sm-8 item-text" v-if="col.title">
              {{col.text}}
            </div>
            <div class="col-sm-8 item-text" v-if="col.type=='hidden'">
              <input type="hidden" class="form-control" v-model="item[col.column]=col.value">
            </div>
            <div class="col-sm-8 item-text" v-if="col.type=='fixedText'">
              {{col.text}}
            </div>
            <label class="col-sm-4 control-label" v-if="col.type=='threeTextInput'">{{col.name}}</label>
              <div class="col-sm-4" v-if="col.type=='threeTextInput'" v-for="obj in col.columns">
                <input type="text" v-bind:maxlength="obj.maxlength" class="form-control" v-bind:id="obj.column" v-bind:placeholder="obj.placeholder" v-model="item[obj.column]">
              </div>
              <div v-if="col.type=='file'">
                <div id="pdf_header">
                  <label class="font_normal control-label">{{col.name}}</label>
                  <input id="file_select" type="file" style="display:none" @change="onSelectFile">
                  <button type="button" class="btn btn-primary pull-right" @click="onSelectFileClick">ファイル選択</button>
                </div>
                <div id="preview_div" class="preview_frame">
                  <!-- <span id="preview" class="preview">プレビュー</span> -->
                  <embed id="pdf_preview" type="application/pdf">
                </div>
              </div>
            </div>
          </div>
          
          <div class="box-footer with-border t_box_footer">
            <div v-if="error" class="callout callout-danger err-info font_18"><p>{{error}}</p></div>
						<div class="t_form_button_flex flex_center padding_top_30 padding_bottom_30">
							<button type="button" class="btn btn-default global_btn t_main_button t_form_button_flex_item" onclick="window.history.back()">キャンセル</button>
							<button type="button" class="btn btn-info global_btn t_main_button t_form_button_flex_item" @click="onAddButtonClick">保存</button>
						</div>
          </div>
          <!-- /.box-body -->
          <!-- <div class="box-footer">
            <div v-if="error" class="callout callout-danger err-info font_18"><p>{{error}}</p></div>
            <button type="button" class="btn btn-warning btn-lg btn-block" @click="onAddButtonClick">登 録</button>
            <button type="button" class="btn btn-default btn-lg btn-block margin_top_20" onclick="window.history.back()">キャンセル</button>
          </div> -->
              <!-- /.box-footer -->
        </form>
      </div>
          <!-- /.box-body -->
        <!-- /.box -->
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert"></modal-alert-view>
      </template>
    </div>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import TabletHeaderView from '~/components/TabletHeaderView'
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  
  export default {
    name: 'AddFileView',
    props: {
      param: Object,
    },
    data() {
      return {
        item: {},
        addItems: [],
        tabletHeight: 0,
        error: '',
        title: '',
        fullpage: true,
        alert: {
          title: 'test',
          message: '',
          note: '',
          isConfirm: false,
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
      };
    },
    components: {
      TabletHeaderView,
      ModalAlertView,
      Loading
    },
    methods: {
      getDoubleDigestNumber(number) {
        if ((number == null || number == "") && number != 0){
          return number;
        } 
        return ("00" + number).slice(-2)
      },
      joinDate() {
        if (this.param.api == "/attendances"){
          if((this.param.columns[0].hh == null || this.param.columns[0].hh == "") || (this.param.columns[0].mm == null || this.param.columns[0].mm == "")){
            this.item.attendedAt = "";
          }else{
            this.item.attendedAt =  this.changeDateFormat(this.item.attendedAt) + "T" + this.getDoubleDigestNumber(this.param.columns[0].hh-1) + ":" + this.getDoubleDigestNumber(this.param.columns[0].mm-1) + ":00.000+09:00";
          }
          if((this.param.columns[1].hh == null || this.param.columns[1].hh == "") || (this.param.columns[1].mm == null || this.param.columns[1].mm == "")){
            this.item.leftAt = "";
          }else{
            this.item.leftAt =  this.changeDateFormat(this.item.leftAt) + "T" + this.getDoubleDigestNumber(this.param.columns[1].hh-1) + ":" + this.getDoubleDigestNumber(this.param.columns[1].mm-1) + ":00.000+09:00";
          }
        }else if (this.param.api.match("/schedules")){
          if((this.param.columns[0].hh == null || this.param.columns[0].hh == "") || (this.param.columns[0].mm == null || this.param.columns[0].mm == "")){
            this.item.startDateTime = "";
          }else{
            this.item.startDateTime = this.changeDateFormat(this.item.startDateTime) + "T" + this.getDoubleDigestNumber(this.param.columns[0].hh-1) + ":" + this.getDoubleDigestNumber(this.param.columns[0].mm-1) + ":00.000+09:00";
          }

          if((this.param.columns[1].hh == null || this.param.columns[1].hh == "") || (this.param.columns[1].mm == null || this.param.columns[1].mm == "")){
            this.item.endDateTime = "";
          }else{
            this.item.endDateTime = this.changeDateFormat(this.item.endDateTime) + "T" + this.getDoubleDigestNumber(this.param.columns[1].hh-1) + ":" + this.getDoubleDigestNumber(this.param.columns[1].mm-1) + ":00.000+09:00";
          }
        }
      },
      postDatas() {
        var items = [];
        if (this.item.title != null && this.item.title != "") items.title = this.item.title;
        if (this.item.order != null && this.item.order != "") items.order = this.item.order;
        if (this.item.startShowAt != null && this.item.startShowAt != "") items.startShowAt = this.item.startShowAt;
        if (this.item.endShowAt != null && this.item.endShowAt != "")  items.endShowAt = this.item.endShowAt;
        if (this.item.startSpecialShowAt != null && this.item.startSpecialShowAt != "") items.startSpecialShowAt = this.item.startSpecialShowAt;
        if (this.item.endSpecialShowAt != null && this.item.endSpecialShowAt != "") items.endSpecialShowAt = this.item.endSpecialShowAt;
        return items;
      },
      castInt(data) {
        for (var i = 0; i < data.length; i++) {
          data[i] = parseInt(data[i]);
        }
        return data;
      },
      generateRequestBuildingIds() {
        var buildings = [];
        for (var i = 0; i < this.item.buildingIds.length; i++) {
          if ((!isNaN(this.item.buildingIds[i])) && (this.item.buildingIds[i] != "")) {
            buildings.push(this.item.buildingIds[i]);
          }
        }
        if (buildings.length == 0) {
          delete this.item.buildingIds;
        } else {
          this.item.buildingIds = this.castInt(buildings);
        }
      },
      addRequest() {  
        if (this.item.buildingIds != null) {
          this.generateRequestBuildingIds(this.item.buildingIds);
        }
        this.joinDate();
        var dateError = "";
        if (this.param.api.match("/schedules")){
          if (this.item.startDateTime != "" && this.item.endDateTime != null){
            var startDate = new Date(this.item.startDateTime);
            var endDate = new Date(this.item.endDateTime);
            if (!(isNaN(startDate))&&!(isNaN(endDate))){
              if (endDate<startDate){
                dateError = "終了日時 : 終了日時を開始日時より後の日時に設定してください。";
                this.error = dateError;
                return
              }
            }
          }
        }
        if (this.param.api.match("/attendances")){
          if (this.item.attendedAt != "" && this.item.leftAt != "") {
            var attenedDate = new Date(this.item.attendedAt);
            var leftDate = new Date(this.item.leftAt);
            if (leftDate < attenedDate) {
              dateError = "退勤時間 : 退勤時間を出勤時間より後の時間に設定してください。"
              this.error = dateError;
              return
            }
          }
        }

        this.req(this.param.api, 'post', this.item, (err, res) => {;
          if (err) {
            const errorColm = {};
            for(const key in this.param.columns){
              errorColm[this.param.columns[key].column] = this.param.columns[key].name;
            }
            this.error = this.getErrorMsg2(res, this.param.columns);
            //this.error = this.getErrorMsg(res && res.body && res.body.error, errorColm, this.param.errorCode);
          } else if (res.body) {
            this.$router.push(this.param.success);
          }
        });
      },
      addFileRequest() {
        this.joinDate();
        this.multipartReq(
          this.param.api, 
          'post', 
          this.postDatas(),
          this.file, 
          (err, res) => {
          if (err) {
            const errorColm = {};
            for(const key in this.param.columns){
              errorColm[this.param.columns[key].column] = this.param.columns[key].name;
            }
            this.error = this.getErrorMsg2(res, this.param.columns);
          } else if (res.body) {
            this.$router.push(this.param.success + '/' + res.body.id);
          }
        });
      },
      onAddButtonClick() {
        this.error = '';
        if (this.param.api == "/BulletinBoards" || this.param.api == "/ResidentialManuals") {
          this.addFileRequest();
        } else {
          this.addRequest();
        }
      },
      onSelectFileClick(){
        document.getElementById("file_select").click();
      },
      fileValidation(fileData) {
        if (fileData.type != "application/pdf" || fileData.size > 2000000) {
          document.getElementById("preview_div").style.border = "";
          document.getElementById("preview").style.display = "";
          document.getElementById("pdf_preview").style.visibility = "hidden";
          this.file = null;
          if(fileData.type != "application/pdf") {
            this.alert.title = '';
            this.alert.message = 'PDFファイルを選択してください。';
            this.alert.note = '';
            this.alert.isConfirm = false;
            $('#modal_alert').modal('show')
            // alert('PDFファイルを選択してください');
          } else {
            this.alert.title = '';
            this.alert.message = '2MB以下のファイル容量のファイルを選択してください。';
            this.alert.note = '';
            this.alert.isConfirm = false;
            $('#modal_alert').modal('show')
            //alert("2MB以下のファイル容量のファイルを選択してください");
          }
          return false;
        }
        return true;
      },
      onSelectFile(ele){
        // ファイル情報を取得
        var fileData = ele.target.files[0];
        if(!this.fileValidation(fileData)) return;
        this.file = fileData;
        //サムネイル表示エリアのエレメント取得
        var embed =  document.getElementById("pdf_preview");

        // FileReaderオブジェクトを使ってファイル読み込み
        var reader = new FileReader();
        // ファイル読取り成功時処理
        reader.onload = function() {
          document.getElementById("pdf_preview").style.visibility = "";
          document.getElementById("preview_div").style.border = "none";
          document.getElementById("preview").style.display = "none";
          //ノードの複製
          var cln = embed.cloneNode(true);
          //複製したノードのdata要素をにFileAPIの読み込み結果をセット
          cln.setAttribute("src",URL.createObjectURL(fileData));
          this.file = reader.result;
          embed.parentNode.replaceChild(cln, embed);
        };
        reader.readAsDataURL(fileData);
      },
      createMultiForm(column, key) {
        if ( column[key] === undefined) {
          this.$set(column, key,[""]);
        }
      },
      onAddForm(key) {
        this.item[key].push("");
      },
      onRemoveForm(index, key) {
        this.item[key].splice(index, 1);
      },
      inputForm(ele, index, key) {
        this.item[key].splice(index, 1, ele.target.value);
      },
      getIndexNum(columns) {
        if (columns.length !== 0) {
          return columns.length;
        }
        return 0;
      },
      displayValue(index, key) {
        return this.item[key][index];
      },
      flexTextarea(el) {
        const dummy = el.querySelector('.flex_textarea_dummy');
        el.querySelector('.flex_textarea_textarea').addEventListener('input', e => {
          dummy.textContent = e.target.value + '\u200b';
        })
      },
    },
    created() {
      this.title = this.param.title.slice( 0, -2 );
      if (this.param.init_val){
        this.item = this.param.init_val;
      } 
      $("body").css('background-color', '#FFF');
    },
    mounted() {
      this.tabletHeight = this.$refs.header.$el.clientHeight;
    },
    updated() {
      document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
    },
    watch: {
      item: {
        handler(val) {
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
