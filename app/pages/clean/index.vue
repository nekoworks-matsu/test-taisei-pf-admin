<template>
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
            <form class="form-horizontal margin_0">
              <div class="box-body">
                <div class="form-group">
                  <label class="col-sm-4 control-label">ID</label>
                  <div class="col-sm-8 item-text">※自動採番</div>
                </div>
                <div class="form-group required">
                  <label class="col-sm-4 control-label">日時</label>
                  <div class="display_flex">
                    <div class="col-sm-2 min_width_180">
                      <vuejs-datepicker  class="form-control input_date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" placeholder="YYYY/MM/DD"></vuejs-datepicker>
                    </div>
                    <div class="col-sm-4 date_time min_width_400">
                      <select class="form-control input_hours_mm">
                        <option v-bind:value="n-1" v-for="n in 24">{{timeConverter(n-1)}}</option>
                      </select>
                      <select class="form-control input_hours_mm">
                        <option v-bind:value="n-1" v-for="n in 60">{{timeConverter(n-1)}}</option>
                      </select>
                    </div>
                   </div>
                </div>
                <div class="form-group required">
                  <label class="col-sm-4 control-label">フロア</label>
                  <div class="col-sm-8 item-text">
                    <template v-for="(floor, index) in param.floors">
                      <span v-if="index!=(param.floors.length-1)">{{floor.name}}, </span>
                      <span v-if="index==(param.floors.length-1)">{{floor.name}}</span>
                    </template>
                    
                    <button type="button" class="btn btn-sm margin_left_15" data-toggle="modal" v-bind:data-target="'#modal1'">詳細</button>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-4 control-label">備考</label>
                  <div class="col-sm-8 flex_textarea">
                    <div class="flex_textarea_dummy" aria-hidden="true"></div>
                    <textarea id="FlexTextarea" class="flex_textarea_textarea width_calc_30 form-control" v-bind:maxlength="512" v-bind:placeholder="'備考'"></textarea>
                  </div>
                </div>

                <div  class="form-group" v-if="col.type!='hiddenColmun'" v-for="col in param.columns" v-bind:class="{required:col.required}">
                  <div class="box-header with-border" v-if="col.title">
                    <h3 class="box-title with-border">{{col.name}}</h3>
                  </div>
                  <label class="col-sm-4 control-label" v-if="!col.title&&col.type!='threeTextInput'&&col.type!='hiddenColmun'&&col.type!='image'" v-bind:for="col.column">{{col.name}}</label>

                  <div v-if="col.type=='image'">
                    <label class="col-sm-4 control-label">{{col.name}}</label>
                    <input id="file_select" class="col-sm-8 control-label" style="display:none" type="file" accept="image/*" @change="onAddFile">
                    <button type="button" class="btn btn-primary margin_left_15" @click="onSelectFileClick">ファイル選択</button><span>&nbsp;&nbsp;&nbsp;※ファイル容量5MB以下</span>
                    <div>
                      <label class="col-sm-4"></label>
                      <!-- <label class="col-sm-8 item-text">プレビュー</label> -->
                      <div>
                        <label class="col-sm-4"></label>
                        <img id="img_source" v-bind:class="{ img_thumbnail: isPreview, opacity_0: !isPreview}" data-toggle="modal" v-bind:data-target="'#modal'" @click="onImgClick">
                        <button type="button" v-if="isPreview" class="btn btn-danger margin_top_minus_20" @click="onDeleteFileClick"><i class="fa fa-times"></i></button>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-8" v-if="col.type=='text'">
                    <input type="text" v-bind:maxlength="col.maxlength" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder || col.name" v-model="item[col.column]=col.value" v-bind:disabled="col.disabled"/>
                    <span v-if="col.text">{{col.text}}</span>
                  </div>
                   <div class="col-sm-8" v-if="col.type=='number'">
                    <input type="text" v-bind:maxlength="col.maxlength" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder || col.name" v-model="item[col.column]=col.value" oninput="value = value.replace(/[^0-9]+/i,'');" />
                    <span v-if="col.text">{{col.text}}</span>
                  </div>
                  <div class="col-sm-8 flex_textarea" v-if="col.type=='textarea'">
                    <div class="flex_textarea_dummy" aria-hidden="true"></div>
                    <textarea id="FlexTextarea" class="flex_textarea_textarea width_calc_30 form-control" v-model="item[col.column]=col.value" v-bind:maxlength="col.maxlength" v-bind:placeholder="col.placeholder || col.name"></textarea>
                  </div>
                  <div class="col-sm-8" v-if="col.type=='date'">
                    <input type="date" class="form-control" v-bind:id="col.column" v-bind:placeholder="col.placeholder || col.name" v-model="item[col.column]"/>
                    <span v-if="col.text">{{col.text}}</span>
                  </div>
                  <div class="display_flex" v-if="col.type == 'datetime'">
                    <div class="col-sm-2 min_width_180">
                      <vuejs-datepicker class="form-control date_picker_small" :clear-button="true" :format="DatePickerFormat" :language="language" :value="col.value" name="datepicker" v-model="item[col.column]=col.value"  placeholder="YYYY/MM/DD">
                      </vuejs-datepicker>
                    </div>
                    <div class="col-sm-4 date_time min_width_400">
                      <select class="form-control input_hours_mm" v-bind:id="col.column+'hh'" v-model="col.hh">
                        <option v-bind:value="n-1" v-for="n in 24">{{timeConverter(n-1)}}</option>
                      </select>
                      <select class="form-control input_hours_mm"  v-bind:id="col.column+'mm'" v-model="col.mm">
                        <option v-bind:value="n-1" v-for="n in 60">{{timeConverter(n-1)}}</option>
                      </select>
                    </div>
                  </div>
                 
                  <div class="col-sm-8" v-if="col.type=='select'">
                    <select class="form-control" v-bind:id="col.column" v-model="item[col.column]=col.value" v-bind:disabled="col.disabled">
                      <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                    </select>
                  </div>
                   <div class="col-sm-8" v-if="col.type=='member'">
                    <select class="form-control" v-bind:id="col.column" v-model="item[col.column]=col.value">
                      <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                    </select>
                  </div>
                  <div class="col-sm-8 item-text" v-if="col.title">{{col.text}}</div>
                  <div class="col-sm-8 item-text" v-if="col.type=='hidden'">
                    <input type="hidden" class="form-control" v-model="item[col.column]=col.value" />
                  </div>
                  <div class="col-sm-8 item-text" v-if="col.type=='fixedText'">{{col.text}}</div>
                </div>
                <input type="hidden" class="form-control" id="reportObjectDefinitionId" v-model="param.reportObjectDefinitionId"/>
              </div>
              <div v-if="error" class="callout callout-danger err-info">
                <p>{{error}}</p>
              </div>
              <!-- /.box-body -->
              <div class="box-footer">
                <button type="button" class="btn btn-default" onclick="window.history.back()">キャンセル</button>
                <button type="button" class="btn btn-warning pull-right" @click="onAddButtonClick">登 録</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->
      </div>
      <template>
        <modal-img-view　ref="child" :id="'modal'" :title="'拡大プレビュー'"></modal-img-view>
      </template>
      <template>
        <modal-view :param="param.floors" :title="'フロア'" :id="'modal1'" @okbuttonclick="onOKButtonClick"></modal-view>
      </template>
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert"></modal-alert-view>
      </template>
    </section>
    <!-- /.content -->
  </div>
</template>
<script>
import ModalImgView from '~/components/ModalImgView'
import ModalView from '~/components/ModalView'
import ModalAlertView from '~/components/ModalAlertView'

export default {
  data() {
    return {
      param: {
        title: '清掃業務大項目',
        reportObjectDefinitionId: '',
        init_val: {},
        floors: [],
        cb: this.updateView,
        api: '/report-objects',
        icon: 'fa-user',
        success: '/majoritems/'+this.$route.params.id,
        columns: [],
        reportFieldDefinitionIds: []
      },
      item: {
        reportObjectDefinitionId: '',
        reportedBy: 0,
        reportAt: '',
        fields: [{}]
      },
      image: null,
      imageColumn: null,
      alert: {
        title: 'test',
        message: '',
        note: '',
        isConfirm: false,
      },
      error: '',
      isPreview: false,
      DatePickerFormat: 'yyyy/MM/dd',
      language: {
        language: 'Japanese',
        months: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        monthsAbbr: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        days: ['日', '月', '火', '水', '木', '金', '土'],
        rtl: false,
        ymd: 'yyyy-MM-dd',
        yearSuffix: '年'
      }
    }
  },
  components: {
    ModalImgView,
    ModalView,
    ModalAlertView,
  },
  methods: {
    getMajoritemsHeader(api) {
      this.onSearch(api, null, null, (val) => {
        const majoritem_title = val.name //大項目名
        const columns_list = []
        const reportFieldDefinitionIds = []
        const now_day = this.get_now_date('YYYYY/MM/DD')
        const now_hh = this.get_now_date('HH')
        const now_mm = this.get_now_date('MI')
        var daily_data = '';
         val.reportFieldDefinitions.forEach(function(obj) {

          switch (obj.type) {
            case 1: //NOTE:text
              columns_list.push({
                name: obj.name,
                column: 'textValue_' + obj.fieldIndex,
                type: 'text',
                required: obj.required,
                maxlength: obj.fieldValidations == undefined? 256: obj.fieldValidations[0].numberValue,
                reportFieldDefinitionId: obj.id,
                path: '.fields['+obj.fieldIndex+']'
              }),
              reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
              break
            case 2:
              // (obj.reportExtractField)? daily_data= '【日次データ検索項目】'+obj.name:daily_data=obj.name;
              daily_data = obj.name;
              columns_list.push({
                name: daily_data,
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
                reportFieldDefinitionId: obj.id,
                path: '.fields['+obj.fieldIndex+']'
              })
              reportFieldDefinitionIds.push({reportFieldDefinitionId:obj.id});
              break
            case 6://NOTE:textarea
              columns_list.push({
                name: obj.name,
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
              var member_api = '/buildings/' + localStorage.getItem('buildings_id') +'/members'
              this.onSearch(member_api, null, null, (val) => {
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

        this.param.columns = columns_list
        this.param.reportFieldDefinitionIds = reportFieldDefinitionIds
        this.param.reportObjectDefinitionId = val.id
      })
    },

    updateView(val) {},
    getRows(text) {
      if (text == undefined || text == null) {
        return 1
      }
      return text.split('\n').length
    },
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
            reportFieldDefinitionId:  this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId
          })
         }else if (data[i].match('numberValue')) {
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
          }else{
              time = time + ':'+document.getElementById(data[i] +'mm').value+':00.000Z'
          }
          fields.push({
            fieldIndex: Number(data[i].slice(10)),
            dateValue: this.item[data[i]] == null? time:this.df_utc(this.changeDateFormat(this.item[data[i]]) +'T'+ time),
            reportFieldDefinitionId: this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId
          })
        }else if (data[i].match('select')) {
          fields.push({
            fieldIndex: Number(data[i].slice(7)),
            selectOptionDefinitionId: this.item[data[i]],
            reportFieldDefinitionId: this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId
          })
        }else if (data[i].match('member')) {
          fields.push({
            fieldIndex: Number(data[i].slice(7)),
            memberId: Number(this.item[data[i]]),
            reportFieldDefinitionId: this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId
          })
        
        }else if (data[i].match('textarea')) {
          fields.push({
            fieldIndex: Number(data[i].slice(9)),
            textValue: this.item[data[i]],
            reportFieldDefinitionId: this.param.reportFieldDefinitionIds[index].reportFieldDefinitionId
          })
        }
      }
      if (this.imageColumn != null){
        if (this.isPreview){
          var images = document.getElementById("img_source").src;
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

      fields.sort(function(a,b){
            if(a.fieldIndex < b.fieldIndex) return -1;
            if(a.fieldIndex > b.fieldIndex) return 1;
            return 0;
      });

      let buildingId = localStorage.getItem('buildings_id');
      var send_data = {
        buildingId: buildingId,
        reportObjectDefinitionId: this.param.reportObjectDefinitionId,
        reportedBy: Number(localStorage.getItem('member_id')),
        fields: fields
      }
      this.req(this.param.api, 'post', send_data, (err, res) => {
        if (err) {
          this.error = this.getMajoritemsErrorMsg(res, this.param.columns)
          return;
        } else if (res.body) {
          this.$router.push(this.param.success);
        }
      })
    },
    onAddButtonClick() {
      this.error = ''
      this.addRequest()
    },
    getMajorItemsTitle(report_list) {
      for (var i = 0; i < report_list.length; i++) {
        for (var j = 0; j < report_list[i].majoritems.length; j++) {
          for (var k = 0; k < report_list[i].majoritems[j].reportObjectDefinitions.length; k++) {
            if (report_list[i].majoritems[j].reportObjectDefinitions[k].id == this.$route.params.id) {
              return report_list[i].majoritems[j].reportObjectDefinitions[k].name;
            }
          }
        }
      }
    },
    setMajoritemsTitle() {
      var report_list = JSON.parse(localStorage.getItem('report_list'));
      this.param.title = this.getMajorItemsTitle(report_list);
    },
    flexTextarea(el) {
      const dummy = el.querySelector('.flex_textarea_dummy');
      el.querySelector('.flex_textarea_textarea').addEventListener('input', e => {
        dummy.textContent = e.target.value + '\u200b';
      })
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

      this.isPreview = true;
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
      }.bind(this);
      
      reader.onerror = function (){  
        // alert('このファイルは読み込めません。');  
      }
      
      if (files[0]){
        reader.readAsDataURL(files[0]);
      }
    },
    onOKButtonClick(id){
      var modal_content = document.getElementsByName(id);
      var checked = [];
      for (var i = 0; i < modal_content.length; i++) {
        if (modal_content[i].checked) {
          checked.push(modal_content[i].id);
        }
      }
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
    setModalViewContent(index) {
      var name = "";
      var floors = [];
      this.onSearch('/buildings/' + localStorage.getItem('buildings_id'), null, null, (val) => {
        var sortFloors = this.sortFloors(val.floors);
        name = "";
        for (var i = 0; i < sortFloors.length; i++) {
          if (sortFloors[i].type == "2") {
            name = "B" + sortFloors[i].name;
          } else {
            name = sortFloors[i].name;
          }
          floors.push({name: name, type: "checkbox", id: sortFloors[i].id});
        }
        this.param.floors = floors;
      })
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
    this.item = {};
    this.setModalViewContent();
    // let api_for_list = '/report-object-definitions/' +this.$route.params.id + '/report-field-definitions'
    // this.getMajoritemsHeader(api_for_list);
    // this.setMajoritemsTitle();
  },
  updated() {
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
