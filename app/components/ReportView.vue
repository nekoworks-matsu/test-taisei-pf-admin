<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <section class="content-header">
      <h1>
        {{param.title}}詳細
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
                  <label class="col-sm-4 control-label">ID</label>
                  <div class="col-sm-8 item-text">
                    {{param.id}}
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
                  <div class="col-sm-8" v-if="col.type=='datePicker'">
                    <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" :value="col.text" name="datepicker" v-model="item[col.column]"  v-bind:placeholder="col.placeholder || col.name">
                    </vuejs-datepicker>
                  </div>
                  <div class="col-sm-8" v-if="col.type=='select'">
                    <select class="form-control" v-bind:id="col.column" v-model="item[col.column]" v-bind:disabled="col.disabled">
                      <option v-bind:value="opt.value" v-for="opt in col.options">{{opt.name}}</option>
                    </select>
                  </div>
                  <div class="col-sm-8" v-if="col.type=='textarea'">
                    <textarea class="form-control" v-model="item[col.column]" v-bind:placeholder="col.placeholder" :rows="getRows(item[col.column])"></textarea>
                  </div>
                </div>
                <div class="no-margin pull-right">
                  <button type="button" class="btn btn-primary" @click="onReadDateTimeData">日時データ読み込み</button>
                </div>
              </div>
              <div role="grid" v-for="cols in this.list" v-if="readTimeDate">
                <h3 class="box-title with-border">{{cols.label}}<span v-if="cols.data_list==null">  【報告事項無し】</span></h3>
                <table class="table table-bordered table-hover" role="grid">
                <thead>
                  <tr role="row">
                    <th v-for="col in cols.columns">{{col.name}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr role="row" v-for="col_data in cols.data_list">
                    <td v-for="col_test in col_data.columns">
                      <template>
                        <div v-if="col_test.type=='text_input'">
                          <span>{{col_test.value}}</span>
                        </div>
                        <div v-if="col_test.type=='label'">
                          <span>{{col_test.value}}</span>
                        </div>
                        <div v-if="col_test.type=='select'">
                          <select class="form-control" v-if="col_test.type=='select'" v-bind:disabled="true">
                            <option v-bind:value="opt.value" v-for="opt in col_test.options">{{opt.name}}</option>
                          </select>
                        </div>
                        <div v-if="col_test.type=='time'">
                          <select class="form-control" style="width:40%;display:inline;" v-bind:disabled="true">
                            <option v-bind:value="n" v-for="n in 24">{{timeConverter(n-1)}}</option>
                          </select>
                          :
                          <select class="form-control" style="width:40%;display:inline;" v-bind:disabled="true">
                            <option v-bind:value="n" v-for="n in 60">{{timeConverter(n-1)}}</option>
                          </select>
                        </div>
                        <div v-if="col_test.type=='textarea'">
                          <textarea readonly class="form-control" maxlength="512" v-model="col_test.value">{{col_test.value}}</textarea>
                        </div>
                      </template>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>              
              <!-- /.box-body -->
              <div class="box-footer">
                <button type="button" class="btn btn-default" onclick="window.history.back()">キャンセル</button>
                <button type="button" class="btn btn-info pull-right" @click="onAddButtonClick">更 新</button>
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
    name: 'AddReportView',
    props: {
      param: Object,
    },
    data() {
      return {
        item: {},
        list: [],
        error: '',
        DatePickerFormat: 'yyyy/MM/dd',
        readTimeDate: true,
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
      addRequest() {
        this.req(this.param.api, 'post', this.item, (err, res) => {
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
      onAddButtonClick() {
        this.error = '';
        this.addRequest();
      },
      getRows(text) {
        if (text == undefined || text == null) {
          return 1;
        }
        return text.split("\n").length;
      },
      onReadDateTimeData() {
        this.list = [
          {
            label: "勤務スタッフ",
            fieldLength: 4,
            columns: [
              { name: "出勤時間" },
              { name: "シフト" },
              { name: "メンバー名" }, 
            ],
            data_list: [
              {
                columns: [
                  { value: "2020/07/02 16:05", type: "label"},
                  { value: "シフト1", type: "text_input"},
                  { value: "メンバー名1",  type: "text_input" },
                ]
              },
              {
                columns: [
                  { value: "2020/07/02 20:00", type: "label"},
                  { value: "シフト2", type: "text_input"},
                  { value: "メンバー名2",  type: "text_input" },
                ]
              },
              {
                columns: [
                  { value: "2020/07/02 21:00", type: "label"},
                  { value: "シフト3", type: "text_input"},
                  { value: "メンバー名3",  type: "text_input" },
                ]
              }
            ]
          },
          {
            label: "防犯警報",
            fieldLength: 4,
            columns: [
              { name: "発報時間" },
              { name: "発報場所" },
              { name: "発報原因" },
              { name: "特記事項" }
            ],
            data_list: [
              {
                columns: [
                  { value: "2020/07/02 14:30", type: "label"},
                  { value: "発報場所1", type: "text_input" },
                  { value: "発報原因1",  type: "text_input" },
                  { value: "なし",  type: "text_input" }
                ],    
              },
              {
                columns: [
                  { value: "2020/07/02 22:30", type: "label"},
                  { value: "発報場所2", type: "text_input" },
                  { value: "発報原因2",  type: "text_input" },
                  { value: "なし",  type: "text_input" }
                ],    
              }
            ]
          },
          {
            label: "防災警報",
          },
        ]
        this.item.list = this.list;
        this.readTimeDate = true;
      }
    },
    created() {
      this.list = this.param.list;
      if (this.param.init_val){
        this.item = this.param.init_val;
      }
    },
    mounted() {
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
