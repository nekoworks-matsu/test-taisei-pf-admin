<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper ts_content_wrapper">
    <loading
    :active.sync="loading"
    :can-cancel=false
    :on-cancel="onCancel"
    :is-full-page="fullpage"></loading>
    <!-- Content Header (Page header) -->
    <section class="content_head">
      <div class="ts_content_head">
        <div class="ts_breadcrumb">
          <ol>
            <li>データ分析</li>
            <li class="current">{{param.title}}</li>
          </ol>
        </div>
        <h1 class="ts_content_heading">{{param.title}}</h1>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1>
        {{param.title}}
        <small></small>
      </h1>
    </section> -->

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <div class="box-header with-border box_head">
            <h2 class="box-title"><i class="fa fa-search"></i> 検索条件<small></small></h2>
          </div>
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <!-- <form class="form-horizontal" style="margin:0;"> -->
            <div class="box-body form-horizontal">
              <div class="form-group form_box_group" v-for="item in param.search" v-bind:class='{required:item.required}'>
                <div class="form_box_group_title">
                  <label v-bind:for="item.column" class="control-label" v-if="item.type!='twoDateInput'">{{item.name}}</label>
                </div>
                
                <div class="form_box_group_field" v-if="!item.type">
                  <input type="text" class="form-control" v-bind:maxlength="item.maxlength" v-bind:id="item.column" v-bind:placeholder="item.name" v-model="input[item.column]">
                </div>
                <div class="form_box_group_field" v-if="item.type=='select'">
                  <select class="form-control max_width_390" v-bind:id="item.column" v-model="input[item.column]" @change="onChangeSelect(item.column, $event.target.value)" v-bind:disabled="disabled[item.column]">
                    <option v-bind:value="opt.value" v-for="opt in item.options">{{opt.name}}</option>
                  </select>
                </div>
                <div class="form_box_group_field" v-if="item.type=='isTextSelect'">
                  <select class="form-control max_width_390" v-bind:id="item.column" @change="isTextSelect(item.column, $event.target.value)">
                    <option v-bind:value="opt.value" v-for="opt in item.options">{{opt.name}}</option>
                  </select>
                </div>

                <!-- <div class="form_box_group_title">
                  <label class="control-label" v-if="item.type=='twoDateInput'">{{item.name}}</label>
                </div> -->
                <div class="form_box_group_field" v-if="item.type=='twoDateInput'" v-for="obj in item.columns">
                  <input type="date" class="form-control" v-bind:id="obj.column" v-bind:placeholder="obj.placeholder" v-model="input[obj.column]">
                  <button type="button" class="btn btn-xs btn-info pull-right edgeonly" @click="input[obj.column]=''"><i class="fa fa-times-circle"></i></button>
                </div>

                <div class="form_box_group_field" v-if="item.type=='oneDateInputPicker'" v-for="obj in item.columns">
                  <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="input[obj.column]"  v-bind:placeholder="obj.placeholder"></vuejs-datepicker>
                  <button type="button" class="btn btn-xs btn-info pull-right edgeonly" @click="input[obj.column]=''"><i class="fa fa-times-circle"></i></button>
                </div>

                <div class="form_box_group_field" v-if="item.type=='twoDateInputPicker'" v-for="obj in item.columns">
                  <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="input[obj.column]"  v-bind:placeholder="obj.placeholder"></vuejs-datepicker>
                </div>
                <div class="form_box_group_field" v-if="item.type=='checkbox'">
                  <label v-bind:for="item.column" class="control control_checkbox">
                    <input type="checkbox">
                    <div class="control_indicator" style="margin-top: 0px"></div>
                    <label style="font-weight: 700; margin-left: 30px; margin-right: 30px">{{item.name}}</label>
                  </label>
                </div>
                <div class="form_box_group_field padding_top_7" v-if="item.type=='multiCheckbox'">
                  <template v-for="(column, index) in item.columns">
                    <label v-bind:for="column.columnName" class="control control_checkbox">
                      <input type="checkbox" name="multiCheckbox" v-bind:id="column.column+'_'+index" :value="column.value">
                      <div class="control_indicator margin_top_0"></div>
                      <label class="search_input_checkbox" v-bind:for="column.column+'_'+index">{{column.label}}</label>
                    </label>
                  </template>
                </div>  
                <div class="form_box_group_field" v-if="item.type=='twoDateInputPickerMonth'" v-for="obj in item.columns">
                  <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormatMonth" :language="language" name="datepicker" v-model="input[obj.column]" minimum-view='month' v-bind:placeholder="obj.placeholder"></vuejs-datepicker>
                </div>

                <div class="form_box_group_field" v-if="item.type=='twoDateInputPickerTime'">
                  <div class="majoritem_search_ui">
                    <div class="display_flex">
                      <vuejs-datepicker class="form-control two_date_picker width_200" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" id="startShowAt" v-model="input.startShowAt" v-bind:placeholder="'From YYYY/MM/DD'"></vuejs-datepicker>
                      <select class="form-control search_datetime" id="start_hh" v-model="input.start_hh" >
                        <option v-bind:value="opt.value" v-for="opt in param.hh_op">{{opt.name}}</option>
                      </select>
                      <select class="form-control search_datetime" id="start_mm" v-model="input.start_mm" >
                        <option v-bind:value="opt.value" v-for="opt in param.mm_op">{{opt.name}}</option>
                      </select>
                    </div>
                    <div class="margin_right_10 margin_top_7px">〜</div>
                    <div class="display_flex two_date_picker_end">
                      <vuejs-datepicker class="form-control two_date_picker width_200" :clear-button="true" :format="DatePickerFormat" :language="language" id="endShowAt" name="datepicker" v-model="input.endShowAt" v-bind:placeholder="'To YYYY/MM/DD'"></vuejs-datepicker>
                      <select class="form-control search_datetime" id="end_hh" v-model="input.end_hh">
                        <option v-bind:value="opt.value" v-for="opt in param.hh_op">{{opt.name}}</option>
                      </select>
                      <select class="form-control search_datetime" id="end_mm" v-model="input.end_mm">
                        <option v-bind:value="opt.value" v-for="opt in param.mm_op">{{opt.name}}</option>
                      </select>
                    </div> 
                  </div>
                </div>

              </div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
            </div>
            <!-- /.box-body -->
            <div class="box-footer clearfix">
              <div class="no-margin text_align_center">
                <button class="btn btn-warning global_btn form_button_flex_item" @click="aggregate">集 計</button>
              </div>
              <template v-if="isAggregate">
                <div class="text_align_center font_18 margin_top_15">
                集計件数: {{aggregateCnt}}件
                </div>
                <div class="text_align_center">
                  <button class="btn btn-primary global_btn form_button_flex_item search_button_width" @click="downloadCSV">CSVダウンロード</button>
                </div>
              </template>
            </div>
            <!-- /.box-footer -->
          <!-- </form> -->
          </div>
        </div>
        <!-- /.box -->
      </div>
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert"></modal-alert-view>
      </template>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import Loading from 'vue-loading-overlay';
  import ModalAlertView from '~/components/ModalAlertView'
  // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';
  export default {
    data() {
      return {
        end_hh:'-1',
        end_mm:'-1',
        start_hh:'-1',
        start_mm:'-1',
        startShowAt:'',
        endShowAt:'',
        input: {},
        disabled: {},
        buildings: [],
        isRouterShow: true,
        isAggregate: false,
        error: '',
        DatePickerFormat: 'yyyy/MM/dd',
        DatePickerFormatMonth: 'yyyy/MM',
        startShowAt:'',
        endShowAt:'',
        aggregateCnt: 0,
        aggregateData: [],
        fullpage: true,
        members: [],
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
        param: {
          title: 'CSVデータ出力',
          api: '/autocreation-schedule-operation-category',
          end_hh:'-1',
          end_mm:'-1',
          start_hh:'-1',
          start_mm:'-1',
          hh_op: [],
          mm_op: [],
          search_item:{},
          //searchWhere: [{operationCategoryId: parseInt(this.$route.params.operation_id)}, {buildingId:{"inq":[]}}],
          search: [
            { name: "業務カテゴリ", column: "operationCategoryId", type: "select", notlike: true, required: true, options: [] },
            { name: "業務", column: "majoritemId", type: "select", notlike: true, required: true, options: [] },
            { name: '集計範囲', type: 'twoDateInputPickerTime', columns: [
                { column: 'reportYearMonthStart', columnName: 'reportYearMonth', placeholder: 'From YYYY/MM', type: 'date', where: 'gte' },
                { column: 'reportYearMonthEnd', columnName: 'reportYearMonth', placeholder: 'To YYYY/MM', type: 'date', where: 'lte' }
              ]
            },
          ]
        },
      }
    },
    components: {
      Loading,
      ModalAlertView
    },
    methods: {
      /**
       * param設定
       */
      setParams() {
        this.param.start_hh = -1;
        this.param.start_mm = -1;
        this.param.end_hh = -1;
        this.param.end_mm = -1;
        this.param.hh_op = this.setSelectTime("hour");
        this.param.mm_op = this.setSelectTime("minute");
        
        this.$set(this.input, 'start_hh', -1);
        this.$set(this.input, 'start_mm', -1);
        this.$set(this.input, 'end_hh', -1);
        this.$set(this.input, 'end_mm', -1);
      },
      /**
       * 時分のセレクトボックス設定
       */
      setSelectTime(type) {
        var conf = [];
        conf.push({ name: '--', value: -1 });
        var label = '';
        var cnt_num;
        if (type == 'hour') {
          cnt_num = 24;
        } else {
          cnt_num = 60;
        }
        for (var cnt = 0; cnt < cnt_num; cnt++) {
          cnt < 10 ? label = '0' + String(cnt) : label = String(cnt)
          conf.push({ name: label, value: cnt })
        }
        return conf;
      },
      /**
       * 日付変換(YYYY/MM/DD)
       */
      convertShowAtDate(showAt) {
        if(showAt){
          return showAt.getFullYear() + "/" +  parseInt(showAt.getMonth() + 1) + "/"+ showAt.getDate();
        } 
        return "";
      },
      /** 
       * 日付変換(YYYY/MM/DD HH:MM)
       */
      getShowAtDateTime(showAt, hh, mm, to) {
        var retShowAt;
        if (showAt) {
          retShowAt = this.convertShowAtDate(showAt) +' '+ this.convertTime(hh) + ':' + this.convertTime(mm);
        } else if (to == "start") {
          retShowAt = '1899-12-31T23:59:00.000Z';
        } else if (to = "end") {
          retShowAt = '2999-12-31T23:59:59.999Z';
        }
        return retShowAt;
      },
      /**
       * 時間変換
       */
      convertTime(time) {
        if (time == "-1") return "00"
        if (String(time).length == 1) return "0" + time; 
        return time;
      },
      getRequestData(input, start, end, searchField) {
        var requestData = {
          reportObjectDefinitionId: input.majoritemId,
          limit: 100000,
          order: [{
            reportFieldDefinitionId: searchField,
            direction: "DESC",
            inputType: 2
          }],
          inputType: "2",
          conditions: [
            {
              reportFieldDefinitionId: searchField,
              inputType: 2,
              innerConditions: [{
                searchType: 4,
                dateValue: this.df_utc(start)
              }]
            },
            {
              reportFieldDefinitionId: searchField,
              inputType: 2,
              innerConditions: [{
                searchType: 3,
                dateValue: this.df_utc(end)
              }]
            }
          ]
        }
        return requestData;
      },
      isShowAlert(start, end) {
        if (this.input.operationCategoryId == 0 || this.input.operationCategoryId == undefined) {
          this.alert.title = '';
          this.alert.message = '業務と大項目を入力してください。';
          this.alert.note = '';
          this.alert.isConfirm = false;
          $('#modal_alert').modal('show')
          // alert("業務と大項目を入力してください");
          return true;
        } else if (this.input.majoritemId == null) {
          this.alert.title = '';
          this.alert.message = '大項目を入力してください';
          this.alert.note = '';
          this.alert.isConfirm = false;
          $('#modal_alert').modal('show')
          // alert("大項目を入力してください");
          return true;
        } 
        let errorMessageList = [];
        if(new Date(start) > new Date(end)) {
          errorMessageList.push('範囲の入力を確認してください');
          this.error = errorMessageList.join('\n');
          return true;
        }
        if (this.input.startShowAt == null && (this.input.start_hh != -1 || this.input.start_mm != -1)) {
          errorMessageList.push('範囲(From)を入力してください');
        }
        if (this.input.endShowAt == null && (this.input.end_hh != -1 || this.input.end_mm != -1)) {
          errorMessageList.push('範囲(To)を入力してください');
        }
        if (errorMessageList.length != 0) {
          this.error = errorMessageList.join('\n');
          return true;
        }
        return false;
      },
      aggregate() {
        this.error = '';
        var start = this.getShowAtDateTime(this.input.startShowAt, this.input.start_hh, this.input.start_mm, "start");
        var end = this.getShowAtDateTime(this.input.endShowAt, this.input.end_hh, this.input.end_mm, "end");
        if (this.isShowAlert(start, end)) {
          return;
        }
        this.aggregateRequest(start, end)
      },
      onCancel() {

      },
      getReportFieldDefinitionType(reportFieldDefinitions, reportFieldDefinitionId) {
        var find = reportFieldDefinitions.find(val => val.id == reportFieldDefinitionId);
        return find.type;
      },
      getSelectValue(reportFieldDefinitions, val) {
        var find = reportFieldDefinitions.find(fieldDefinition => fieldDefinition.id == val.reportFieldDefinitionId);
        if (find == undefined) {
          return null;
        }
        var res = find.selectOptionDefinitions.find(selectOptionDefinition => selectOptionDefinition.id == val.selectOptionDefinitionId);
        if (res == undefined) {
          return null;
        }
        return res.label;
      },
      getMembersName(memberId) {
        var find = this.members.find(members => members.id == memberId);
        if (find == undefined) {
          return null;
        }
        return find.name;
      },
      getColumData(val) {
        if (val == null || val == "") {
          return ''
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
        var retVal = val.replace(/,/g,'、');
        retVal = retVal.replace(/\n/g, '');
        return retVal;
      },
      downloadFloorData(floors) {
        var res = '';
        for (var i = 0; i < floors.length; i++) {
          if (i == 0) {
            if (floors[i].floor_type != 3) {
              if (i + 1 == floors.length) {
                res = floors[i].name + "F";
              } else {
                res = floors[i].name + "F" + " ";
              }
            } else {
              if (i + 1 == floors.length) {
                res = floors[i].name;
              } else {
                res = floors[i].name + " ";
              }
            }
          } else if (i + 1 == floors.length) {
            if (floors[i].floor_type != 3) {
              res += floors[i].name + "F";
            } else {
              res += floors[i].name;
            }
          } else {
            if (floors[i].floor_type != 3) {
              res += floors[i].name + "F" + " ";
            } else {
              res += floors[i].name + " ";
            }
          }
        }
        return res;
      },
      makeCSVContent(reportObjectDefinition, reportObjects) {
        var contents = '';
        var type = '';
        reportObjectDefinition.reportFieldDefinitions.sort(function(a,b){
          if(a.fieldIndex < b.fieldIndex) return -1;
          if(a.fieldIndex > b.fieldIndex) return 1;
          return 0;
        });
        for (var i = 0; i < reportObjects.length; i++) {
          contents += reportObjects[i].id + ',';
          for (var j = 0; j < reportObjectDefinition.reportFieldDefinitions.length; j++) {
            var find = reportObjects[i].reportFields.find(val => val.reportFieldDefinitionId == reportObjectDefinition.reportFieldDefinitions[j].id);
            if (find != undefined) {
              switch(reportObjectDefinition.reportFieldDefinitions[j].type) {
                case 1:
                case 6:
                case 7:
                  contents += this.getColumData(find.textValue);
                  break;
                case 2:
                  contents += this.getColumData(this.df2(find.dateValue));
                  break;
                case 3:
                  contents += this.getColumData(reportObjectDefinition, find.numberValue);
                  break;
                case 4:
                  contents += this.getColumData(this.getSelectValue(reportObjectDefinition.reportFieldDefinitions, find));
                  break;
                case 5:
                  contents += this.getColumData(this.getMembersName(find.memberId));
                  break;
                case 8:
                case 9:
                  contents += this.getColumData(this.downloadFloorData(this.displayFloorFormat(this.getExtractFloorsData(find.reportFieldFloors), null, false)));
                  break;
                default:
                //   break;
              }
            } else {
              contents += this.getColumData('');
            }

            if (j == reportObjectDefinition.reportFieldDefinitions.length - 1) {
              contents += '\n'
            } else {
              contents += ','
            }
          }
        }
        return contents;
      },
      makeCSVHeader(reportObjectDefinition) {
        var header = 'ID,';
        reportObjectDefinition.reportFieldDefinitions.sort(function(a,b){
          if(a.fieldIndex < b.fieldIndex) return -1;
          if(a.fieldIndex > b.fieldIndex) return 1;
          return 0;
        });
        for (var i = 0; i < reportObjectDefinition.reportFieldDefinitions.length; i++) {
          header += reportObjectDefinition.reportFieldDefinitions[i].name;
          if (i == reportObjectDefinition.reportFieldDefinitions.length - 1) {
            header += '\n';
          } else {
            header += ','
          }
        }
        return header;
      },
      getFileName() {
        var find = this.param.search[1].options.find(val => val.value == this.input.majoritemId);
        if (find == undefined) {
          return '';
        }
        var majoritemName = find.name.replace(/ > / ,'_');
        const date = new Date()
        const Y = date.getFullYear()
        const M = ("00" + (date.getMonth()+1)).slice(-2)
        const D = ("00" + date.getDate()).slice(-2)
        const h = ("00" + date.getHours()).slice(-2)
        const m = ("00" + date.getMinutes()).slice(-2)
        const s = ("00" + date.getSeconds()).slice(-2)
        return majoritemName + '_' + Y + M + D + '_' + h + m + s + '.csv';
      },
      downloadCSV() {
        var formatCSV = '';
        formatCSV += this.makeCSVHeader(this.aggregateData.reportObjectDefinition);
        formatCSV += this.makeCSVContent(this.aggregateData.reportObjectDefinition, this.aggregateData.reportObjects);
        var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        let blob = new Blob([bom, formatCSV], { type: 'text/csv' })
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        // link.download = buildingName + "_" + reportName + "_" + date + '月次報告.csv'
        this.getFileName();
        link.download = this.getFileName();
        link.click()
      },
      setMajorItems(id) {
        this.param.search[1].options = [];
        if (id == 0) {
          return;
        }
        var reportList = JSON.parse(localStorage.getItem("report_list"));
        var targetList = reportList.find(val => val.id == id);
        this.param.search[1].options.push({name: null, value: null});
        for (var i = 0; i < targetList.majoritems.length; i++) {
          for (var j = 0; j < targetList.majoritems[i].reportObjectDefinitions.length; j++) {
            this.param.search[1].options.push({value: targetList.majoritems[i].reportObjectDefinitions[j].id, name: targetList.majoritems[i].name + ' > ' + targetList.majoritems[i].reportObjectDefinitions[j].name});
          }
        }
      },
      aggregateRequest(start, end) {
        var searchField = 0;
        this.onSearch('/buildings/' + localStorage.getItem('buildings_id') + '/members', null, null, (ret) => {
          this.members = ret;
          this.onSearch('/report-object-definitions/' + this.input.majoritemId +'/report-field-definitions', null, null, (val1) => {
            val1.reportFieldDefinitions.forEach(function(obj) {
              if (obj.reportExtractField) searchField = obj.id //検索条件フィールド
            })
            var requestData = this.getRequestData(this.input, start, end, searchField);
            this.onSearch('/buildings/' + localStorage.getItem('buildings_id') + '/report-objects', requestData, null, (val2) => {
              this.aggregateCnt = val2.reportObjects.length;
              this.aggregateData = val2;
              this.isAggregate = true;
            });
          });   
        });
      },
      onChangeSelect(column, id) {
        this.isAggregate = false;
        if (column == "operationCategoryId") {
          id = (id == '') ? 0 : id;
          this.input.majoritemId = null;
          if (id != 0) {
            this.disabled["majoritemId"] = false;
          } else {
            this.disabled["majoritemId"] = true;
          }
          this.setMajorItems(id);
        }
      },
      setTitle() { 
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        this.param.title = "CSVデータ出力(" +  target.operation_name + ")";
      },
      reload() {
        this.isRouterShow = false;
        this.$nextTick(function() {
          this.isAggregate = false;
          this.setOperations();
          this.setParams();
          this.isRouterShow = true
        })
      },
      setOperations() {
        var reports = JSON.parse(localStorage.getItem('report_list'));
        reports.sort(function(a,b){
          if(a.id < b.id) return -1;
          if(a.id > b.id) return 1;
          return 0;
        });
        if (reports.length == 1) {
          this.param.search[0].options.push({ value:reports[0].id, name: reports[0].operation_name });
          this.setMajorItems(reports[0].id);
          this.disabled["operationCategoryId"] = true;
          this.input["operationCategoryId"] = reports[0].id;
        } else {
          this.disabled["majoritemId"] = true;
          this.param.search[0].options.push({ value:'', name: '' })
          for (var i = 0; i < reports.length; i++) {
            this.param.search[0].options.push({ value:reports[i].id, name: reports[i].operation_name });
          }
        }
      }
    },
    created() {
      const key = "Report:ReportObject:view";
      this.checkDisplayPermission(key, () => {
        this.setOperations();
        this.setParams();
      });
    },
    watch: {
      $route: function(route) {
        this.reload();
      },
      input: {
        handler(val) {
          this.isAggregate = false;
        },
        deep: true,
      }
    }
  };
</script>

<style lang="stylus" scoped>

</style>