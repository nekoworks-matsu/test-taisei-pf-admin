<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        {{param.title}}登録
        <small></small>
      </h1>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <div class="box-header with-border">
            <h2 class="box-title with-border">{{param.title}}情報</h2>
          </div>
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal" style="margin:0;">
              <div class="box-body">
                <div class="form-group">
                  <label class="col-sm-4 control-label">{{param.title}}ID</label>
                  <div class="col-sm-8 item-text">
                    ※自動採番
                  </div>
                </div>

                <div class="form-group" v-if="col.type!='hiddenColmun'" v-for="col in param.columns" v-bind:class='{required:col.required} '>
                  <div class="box-header with-border" v-if="col.title">
                    <h3 class="box-title with-border">{{col.name}}</h3>
                  </div>
                  <label class="col-sm-4 control-label" v-if="!col.title&&col.type!='threeTextInput'&&col.type!='hiddenColmun'&&col.type!='file'" v-bind:for="col.column">{{col.name}}</label>
                  <div class="col-sm-8" v-if="!col.title && !col.type">
                    <input type="text" v-bind:maxlength="col.maxlength" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder || col.name" v-model="item[col.column]" v-bind:disabled="col.disabled">
                    <span v-if="col.text">{{col.text}}</span>
                  </div>
                  <div class="col-sm-8" v-if="col.type=='date'">
                    <input type="date" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder || col.name" v-model="item[col.column]">
                    <span v-if="col.text">{{col.text}}</span>
                  </div>
                  
                  <div class="col-sm-8" v-if="col.type=='datePicker'">
                     <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" :value="col.text" name="datepicker" v-model="item[col.column]"  v-bind:placeholder="col.placeholder || col.name">
                    </vuejs-datepicker>
                  </div>

                  <div class="col-sm-8" v-if="col.type=='select'">
                    <select class="form-control" v-bind:id="col.column" v-model="item[col.column]" v-bind:disabled="col.disabled">
                      <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                    </select>
                  </div>

                  <div class="col-sm-8" v-if="col.type=='multi_select'">
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

                  <div class="col-sm-8" v-if="col.type=='radio'">
                    <label v-bind:for="col.column+opt.value" v-for="opt in col.options"><input type="radio" v-bind:name="col.column" v-bind:id="col.column+opt.value" v-bind:value="opt.value" v-model="item[col.column]" v-bind:disabled="opt.disabled" />
                    {{opt.name}}&nbsp;&nbsp;&nbsp;&nbsp;</label>
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
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <!-- /.box-body -->
              <div class="box-footer">
                <button type="button" class="btn btn-default" onclick="window.history.back()">キャンセル</button>
                <button type="button" class="btn btn-info pull-right" @click="onAddButtonClick">登 録</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->

      </div>

    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  export default {
    name: 'AddFileView',
    props: {
      param: Object,
    },
    data() {
      return {
        item: {},
        addItems: [],
        file: '',
        error: '',
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
    methods: {
      getDoubleDigestNumber(number) {
        if (number == null || number == "") return number;
        return ("00" + number).slice(-2)
      },
      joinDate() {
        if (this.param.api == "/BulletinBoards") {
          if ((this.item.startShowAt_hour == null || this.item.startShowAt_hour == "") && (this.item.startShowAt_date == null || this.item.startShowAt_date == "")) {
            this.item.startShowAt = "";
          } else {
            this.item.startShowAt = this.changeDateFormat(this.item.startShowAt_date) + "T" + this.getDoubleDigestNumber(this.item.startShowAt_hour) + ":00:00.000+09:00";
          }
          if ((this.item.endShowAt_hour == null || this.item.endShowAt_hour == "") && (this.item.endShowAt_date == null || this.item.endShowAt_date == "")) {
            this.item.endShowAt = "";
          } else {
            this.item.endShowAt = this.changeDateFormat(this.item.endShowAt_date) + "T" + this.getDoubleDigestNumber(this.item.endShowAt_hour) + ":00:00.000+09:00";
          }

          if ((this.item.startSpecialShowAt_hour == null || this.item.startSpecialShowAt_hour == "") && (this.item.startSpecialShowAt_date == null || this.item.startSpecialShowAt_date == "")) {
            this.item.startSpecialShowAt = "";
          } else {
            this.item.startSpecialShowAt = this.changeDateFormat(this.item.startSpecialShowAt_date) + "T" + this.getDoubleDigestNumber(this.item.startSpecialShowAt_hour) + ":00:00.000+09:00";
          }
          if ((this.item.endSpecialShowAt_hour == null || this.item.endSpecialShowAt_hour == "") && (this.item.endSpecialShowAt_date == null || this.item.endSpecialShowAt_date == "")) {
            this.item.endSpecialShowAt = "";
          } else {
            this.item.endSpecialShowAt = this.changeDateFormat(this.item.endSpecialShowAt_date) + "T" + this.getDoubleDigestNumber(this.item.endSpecialShowAt_hour) + ":00:00.000+09:00";
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
      addRequest() {
        this.req(this.param.api, 'post', this.item, (err, res) => {;
          if (err) {
            const errorColm = {};
            for(const key in this.param.columns){
              errorColm[this.param.columns[key].column] = this.param.columns[key].name;
            }
            this.error = this.getErrorMsg2(res, this.param.columns);
            //this.error = this.getErrorMsg(res && res.body && res.body.error, errorColm, this.param.errorCode);
          } else if (res.body) {
            this.$router.push(this.param.success + '/' + res.body.id);
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
          if(fileData.type != "application/pdf") alert('PDFファイルを選択してください');
          else alert("2MB以下のファイル容量のファイルを選択してください");
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
      }
    },
    created() {
      if (this.param.init_val){
        this.item = this.param.init_val;
      } 
    },
    mounted() {
      if (this.param.api == "/BulletinBoards" || this.param.api == "/ResidentialManuals") {
        document.getElementById("pdf_preview").style.visibility = "hidden";
      }
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
