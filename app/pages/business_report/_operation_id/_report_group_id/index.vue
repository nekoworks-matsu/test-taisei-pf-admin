<template>
  <div class="content-wrapper ts_content_wrapper sidebar_scroll">

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
                <li class="current">{{param.title}}一覧</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}一覧</h1>
          </section>
          <div class="button_header_btn">
            <button v-if="!isRemoveAdd" type="button" class="btn btn-info global_btn" @click="$router.push(param.list.add)"><i class="fa fa-plus"></i>&nbsp;&nbsp;登 録</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="box-group flex_boxgroup">
        <template>
          <div class="box margin_bottom_0 box_search_utility">

            <div class="box-header with-border box_head">
              <h3 class="box-title">{{param.title}}を検索する<small></small></h3>
            </div>

            <div v-if="error" class="callout callout-danger err-info"><p>{{ error }}</p></div>

            <div class="box-body no-paddin">
              <form name="searchForm" class="form-horizontal" style="margin:0;" v-on:submit.prevent="search1" autocomplete="off">
                <div class="box-body">
                  <div class="form-group" v-for="form in search.forms" v-if="form.availableForSearch">

                    <template v-if="form.type == 2">
                      <label class="col-sm-2 control-label">{{ form.name }}</label>

                      <div class="col-sm-10">
                        <div class="two_date_picker_search_start margin_top_40">
                          <vuejs-datepicker class="form-control two_date_picker width_200" :value="search.item.startShowAt.value" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" id="startShowAt" @input="inputDate($event, form.fieldIndex, form.type, true ,form.id)" v-bind:placeholder="'カレンダーから選ぶ'"></vuejs-datepicker>
                          <div class="display_flex margin_top_5">
                            <select class="form-control search_datetime" id="start_hh" v-model="search.item.start_hh" >
                              <option v-bind:value="opt.value" v-for="opt in search.option.hh_op">{{ opt.name }}</option>
                            </select>
                            <select class="form-control search_datetime" id="start_mm" v-model="search.item.start_mm" >
                              <option v-bind:value="opt.value" v-for="opt in search.option.mm_op">{{ opt.name }}</option>
                            </select>
                            <span>から</span>
                          </div>
                        </div>

                        <div class="two_date_picker_search_end margin_top_10">
                          <vuejs-datepicker class="form-control two_date_picker width_200" :value="search.item.endShowAt.value" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" id="endShowAt" @input="inputDate($event, form.fieldIndex, form.type, false ,form.id)" v-bind:placeholder="'カレンダーから選ぶ'"></vuejs-datepicker>
                          <div class="display_flex margin_top_5">
                            <select class="form-control search_datetime" id="end_hh" v-model="search.item.end_hh">
                              <option v-bind:value="opt.value" v-for="opt in search.option.hh_op">{{ opt.name }}</option>
                            </select>
                            <select class="form-control search_datetime" id="end_mm" v-model="search.item.end_mm">
                              <option v-bind:value="opt.value" v-for="opt in search.option.mm_op">{{ opt.name }}</option>
                            </select>
                            <span>まで</span>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- わかりやすいように業務報告書種別だけ分けて記載(tyep=0は業務報告書種別、ステータス) -->
                    <template v-if="(form.type == 0)">
                      <label class="col-sm-2 control-label">{{ form.name }}</label>
                      <div class="col-sm-10">
                        <select class="form-control" :value="getValue(form.fieldIndex)" @input="inputSearch($event.target.value, form.fieldIndex, form.type, form.id)">
                          <option></option>
                          <option v-bind:value="opt.id" v-for="opt in form.selectOptionDefinitions">{{ opt.label }}</option>
                        </select>
                      </div>
                    </template>

                    <template v-if="(form.type == 1) || (form.type == 3) || (form.type == 6)">
                      <label class="col-sm-2 control-label">{{ form.name }}</label>
                      <div class="col-sm-10">
                        <input type="text" class="form-control" :value="getValue(form.fieldIndex)" @input="inputSearch($event.target.value, form.fieldIndex, form.type ,form.id)">
                      </div>
                    </template>

                    <template v-if="(form.type == 4) || (form.type == 5) || (form.type == 9)">
                      <label class="col-sm-2 control-label">{{ form.name }}</label>
                      <div class="col-sm-10">
                        <select class="form-control" :value="getValue(form.fieldIndex)" @input="inputSearch($event.target.value, form.fieldIndex, form.type, form.id)">
                          <option></option>
                          <option v-bind:value="opt.id" v-for="opt in form.selectOptionDefinitions">{{ opt.label }}</option>
                        </select>
                      </div>
                    </template>
                  </div>
                </div>
                <!-- /.box-body -->
                <div class="box-footer clearfix">
                  <div class="no-margin text_align_center">
                    <button type="submit" class="btn btn-warning search_button_width">検 索</button>
                  </div>
                </div>
                <!-- /.box-footer -->
              </form>
            </div>
            <!-- /.box-body -->

          </div>
        </template>

        <list-view @onImgClick="onImgClick"
            :list="items"
            :param="param.list"
            :count="param.count"
            :limit="param.limit"
            :offset="param.offset"
            :onSearch2="search2"></list-view>

      </div>
    </section>

  </div>
</template>

<script>
  import ListView from '~/components/ListView'
  import ModalImgView from '~/components/ModalImgView'
  import { event } from "~/plugins/events.js";
  import Loading from 'vue-loading-overlay';
  import moment from 'moment'
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        fullpage: true,
        isRemoveAdd: false,
        error:'',
        //watch: {
        //  item: {
        //    radioButtonState: 'option1',
        //    searchDate: new Date(),
        //  },
        //},
        search: { // 検索条件(日付)で扱う項目
          forms: [],
          item: {
            //startShowAt: { value: new Date() },
            //start_hh: Number(localStorage.getItem('business_start_time').slice(0, 2)),
            //start_mm: Number(localStorage.getItem('business_start_time').slice(3, 5)),
            startShowAt: {},
            start_hh: '-1',
            start_mm: '-1',
            endShowAt: {},
            end_hh: '-1',
            end_mm: '-1',
            search_field: 0,
          },
          option: {
            mm_op: [],
            hh_op: [],
          }
        },
        input: {}, // 検索条件として扱う入力内容
        items: [], // 検索結果
        param: {
          api: '',
          title: '',
          operation: '',
          count: 0,
          limit: 20,
          offset: 0,
          order: [],
          imgId: 0,
          list: {
            title: '検索結果',
            isIncludeImage: false,
            columns: [],
            init_val: {},
            items: [],
            icon: 'fa-dot-circle-o',
            add: '/business_report/' + this.$route.params.operation_id + '/' + this.$route.params.report_group_id + '/add/',
            readFn: this.readFn
          }
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
      }
    },

    components: {
      ListView,
      ModalImgView,
      Loading
    },

    methods: {

      // 検索条件項目に関する処理

      /**
       * 日付指定の場合の値を保持
       */
      //setDay(day) {
      //  const res = this.watch.item.searchDate.getDate() + day;
      //  const tmp = new Date(this.watch.item.searchDate);
      //  tmp.setDate(res);
      //  this.$set(this.watch.item, "searchDate", tmp);
      //},
      /**
       * 日付範囲指定の場合の値を保持
       */
      inputDate(value, fieldIndex, type, isFrom, id) {
        console.log('inputDate');
        console.dir(value);
        if (isFrom) {
          this.search.item.startShowAt = { fieldIndex: fieldIndex, inputType: type, value: value ,id: id};
          this.search.item.start_hh = this.search.item.start_hh == -1 ? 0 : this.search.item.start_hh;
          this.search.item.start_mm = this.search.item.start_mm == -1 ? 0 : this.search.item.start_mm;
        } else {
          this.search.item.endShowAt = { fieldIndex: fieldIndex, inputType: type, value: value ,id: id};
          this.search.item.end_hh = this.search.item.end_hh == -1 ? 0 : this.search.item.end_hh;
          this.search.item.end_mm = this.search.item.end_mm == -1 ? 0 : this.search.item.end_mm;
        }
      },
      /**
       * 日付以外の検索条件の値を取得
       */
      getValue(fieldIndex) {
        var keys = Object.keys(this.input);
        for (var i = 0; i < keys.length; i++) {
          if (fieldIndex == this.input[keys[i]].fieldIndex) {
            return this.input[keys[i]].value;
          }
        }
      },
      /**
       * 日付以外の検索条件の値を保持
       */
      inputSearch(value, fieldIndex, type, id) {
        this.input['input' + fieldIndex] = { fieldIndex: fieldIndex, inputType: type, value: value , id: id};
      },

      /**
       * 日付(範囲選択)のプルダウン項目
       */
      setSearchSelectOptions() {
        this.$set(this.search.option, 'hh_op', this.setSelectTime("hour"));
        this.$set(this.search.option, 'mm_op', this.setSelectTime("minute"));
      },
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
          conf.push({ name: label, value: cnt });
        }
        return conf;
      },


      // 検索結果一覧に関する処理

      onImgClick(tag) {
        this.param.imgId = tag;
        var images = document.getElementById("img_source_" + tag);
        var imgSrc = images.src;
        this.$refs.child.showImage(imgSrc);
      },
      readFn(item) {
        return '/business_report/' + this.$route.params.operation_id + '/' + this.$route.params.report_group_id + '/details/' + item.id;
      },


      /**
       * 初期処理
       */
      init() {

        //console.log('init');

        const key = 'Equipment:BusinessReport:search';
        this.checkDisplayPermission(key, () => {
          const addKey = 'Equipment:BusinessReport:create';
          this.isRemoveAdd = !this.checkMenuPermission(addKey);

          const promise1 = this.getBusinessReportFieldDefinition();
          promise1.then(() => {

            //console.log('end getBusinessReportFieldDefinition');

            this.setSearchSelectOptions();

            this.error = '';
            this.$nextTick(() => {
              // DOM更新後の処理

              //if (document.forms.searchForm.searchRadios1 != undefined) {
              //  this.watch.item.radioButtonState = 'option1'
              //  document.forms.searchForm.searchRadios1.checked = true;
              //}

              // 検索条件設定
              this.initSearchItem();
              // 検索処理
              this.search1();

            });
          });
        });
      },


      // 画面表示時に関する処理

      /**
       * 以下データを取得し表示用に整形.
       *   BusinessReportDefinition
       *   BusinessReportFieldDefinition
       **/
      getBusinessReportFieldDefinition() {

        return new Promise((resolve) => {

          //console.log('start getBusinessReportFieldDefinition');

          var api_url = '/business-report-group-definitions/business-report-field-definitions';
          var query = `?companyId=${parseInt(localStorage.getItem('company_id'))}&buildingId=${parseInt(localStorage.getItem('buildings_id'))}&businessReportGroupDefinitionId=${this.$route.params.report_group_id}`

          this.onSearch(api_url + query, null, null, res => {

            // タイトル
            this.setTitle(res.name);
            // パンくずリスト
            this.setBreadCrumbList(res.operationTypeId);

            // プルダウンに必要なリストを取得(業務報告書種別／メンバー／フロア)
            // 業務報告書種別はBusinessReportFieldDefinitionには存在しないので注意
            const promise1 = this.setBusinessReportDefinitions(res.buildingHasBusinessReports);
            const promise2 = this.getMembers(res.operationTypeId);
            const promise3 = this.getFloors();

            Promise.all([promise1, promise2, promise3]).then((lists) => {

              const businessReportDefinitions = lists[0];
              const members = lists[1];
              const floors = lists[2];

              const fieldDefinitions = res.businessReportFieldDefinitions;
              //console.dir(fieldDefinitions);

              if (0 < fieldDefinitions.length) {

                // 検索条件項目
                const searchForms = fieldDefinitions.filter((fieldDefinition) => (fieldDefinition.availableForSearch));
                this.setSearchForms(searchForms, businessReportDefinitions, members, floors);

                // 検索結果一覧の表示項目
                const listColumns = fieldDefinitions.filter((fieldDefinition) => (fieldDefinition.displayIndex != null));
                this.setListColumns(listColumns, businessReportDefinitions, members, floors);
              }

              resolve();
            });
          });
        });
      },

      /**
       * タイトル.
       */
      setTitle(name) {
        this.$set(this.param, 'title', name);
      },

      /**
       * パンくずリスト.
       */
      setBreadCrumbList(operationTypeId) {
        var report_list = JSON.parse(localStorage.getItem('report_list'));
        var find = report_list.find(val => val.operation_type_id == operationTypeId);
        this.$set(this.param, 'operation', find.operation_name);
      },

      /**
       * 業務報告書種別.
       */
      setBusinessReportDefinitions(buildingHasBusinessReports) {
        //console.log('start setBusinessReportDefinitions');
        return new Promise((resolve) => {
          const list = [];
          buildingHasBusinessReports.forEach((buildingHasBusinessReport) => {
            const obj = buildingHasBusinessReport.businessReportDefinition;
            list.push({ label: obj.name, id: obj.id});
          });
          resolve(list);
        });
      },

      /**
       * メンバー情報.
       */
      getMembers(operationId) {
        //console.log('start getMembers');
        return new Promise((resolve) => {
          const list = [];
          var member_api = '/buildings/' + localStorage.getItem('buildings_id') + '/members';
          var where = { 'and': [{ 'operationTypeId': operationId }] };
          this.onSearch(member_api, null, where, (res) => {
            res.forEach((obj) => {
              list.push({ label: obj.name, id: obj.id });
            });
            resolve(list);
          });
        });
      },

      /**
       * フロア情報.
       */
      getFloors() {
        //console.log('start getFloors');
        return new Promise((resolve) => {
          const list = [];
          var floor_api = '/buildings/' + localStorage.getItem('buildings_id');
          this.onSearch(floor_api, null, null, (res) => {
            const floors = this.displayFloorFormat(res.floors, null, false);
            floors.forEach((obj) => {
              list.push({ label: obj.name + 'F', id: obj.id });
            });
            resolve(list);
          });
        });
      },

      /**
       * 定義情報から検索条件項目を設定.
       */
      setSearchForms(searchForms, businessReportDefinitions, members, floors) {
        //console.log('setSearchForms');
        //console.dir(searchForms);
        this.search.forms = [];

        // type=2:日付(年月日時分)の検索条件フィールド
        // reportExtractField=true のフィールドは1つしか定義されていないことが前提
        //   だが、複数存在することも想定して先頭のフィールドを保持する
        var idx = 0;
        searchForms
          .filter((form) => (form.reportExtractField))
          .forEach((searchForm) => {
            if (idx == 0) {
              var tempSearch = {
                'id': String(searchForm.id),
                'type': searchForm.type,
                'reportExtractField': searchForm.reportExtractField,
                'availableForSearch': searchForm.availableForSearch,
                'name': searchForm.name,
                'fieldIndex': searchForm.fieldIndex,
              }
              this.search.forms.push(tempSearch);
              this.search.item.search_field = searchForm.id
            }
            idx++;
          });

        // 業務報告書種別は定義情報から取得できないため、プルダウン項目以外は固定値で設定
        this.search.forms.push({
          'id': 'business_report_type',
          'type': 0,
          'reportExtractField': false,
          'availableForSearch': true,
          'name': '業務報告書種別',
          'fieldIndex': 100,
          'selectOptionDefinitions': businessReportDefinitions,
        });

        // ステータス(状態)は定義情報から取得できないため、プルダウン項目以外は固定値で設定
        //   プルダウン項目はmixin.js内で定義
        this.search.forms.push({
          'id': 'status',
          'type': 0,
          'reportExtractField': false,
          'availableForSearch': true,
          'name': 'ステータス',
          'fieldIndex': 101,
          'selectOptionDefinitions': this.getBusinessReportStatusList(),
        });

        // 日付、業務報告書種別以外の検索条件フィールド
        searchForms
          .filter((form) => (!form.reportExtractField))
          .forEach((searchForm) => {
            var tempSearch = {
              'id': String(searchForm.id),
              'type': searchForm.type,
              'reportExtractField': searchForm.reportExtractField,
              'availableForSearch': searchForm.availableForSearch,
              'name': searchForm.name,
              'fieldIndex': searchForm.fieldIndex,
            }
            if (searchForm.selectOptionDefinitions) {
              tempSearch['selectOptionDefinitions'] = searchForm.selectOptionDefinitions;
            }
            switch(searchForm.type) {
              case 5: // セレクトボックス(メンバー)
                tempSearch['selectOptionDefinitions'] = members;
                break;
              case 9: // セレクトボックス(フロア) ※フロアが検索条件に設定されることはないが念のため
                tempSearch['selectOptionDefinitions'] = floors;
                break;
              default:
                break;
            }
            this.search.forms.push(tempSearch);
          });
        //console.dir(this.search.forms);
      },

      /**
       * 定義情報から検索結果一覧の表示項目を設定.
       */
      setListColumns(listColumns, businessReportDefinitions, members, floors) {
        //console.log('setListColumns');
        //console.dir(listColumns);

        // 業務報告書種別はここで設定
        this.param.list.columns.push({
          'id'                     : String('business_report_type'),
          'types'                  : 0,
          'column'                 : String('business_report_type'),
          'type'                   : 0,
          'name'                   : '業務報告書種別',
          'selectOptionDefinitions': businessReportDefinitions
        });
        // ステータスはここで設定
        this.param.list.columns.push({
          'id'                     : String('status'),
          'types'                  : 0,
          'column'                 : String('status'),
          'type'                   : 0,
          'name'                   : 'ステータス',
          'selectOptionDefinitions': this.getBusinessReportStatusList()
        });

        listColumns.forEach((listColumn) => {
          var tempColumn = {
            'id'    : String(listColumn.id),
            'types' : listColumn.type,
            'column': String(listColumn.id),
            'type'  : listColumn.type,
            'name'  : listColumn.name,
          }
          if (listColumn.selectOptionDefinitions) {
            tempColumn['selectOptionDefinitions'] = listColumn.selectOptionDefinitions;
          }
          switch(listColumn.type) {
            case 2:
              tempColumn['sort'] = true;
              tempColumn['fn'] = this.df;
              break;
            case 5:
              tempColumn['selectOptionDefinitions'] = members;
              break;
            case 7:
              this.param.list.isIncludeImage = true;
              break;
            case 9:
              tempColumn['selectOptionDefinitions'] = floors;
              break;
            default:
              break;
          }
          this.param.list.columns.push(tempColumn);
        });
        //console.dir(this.param.list.columns);
      },


      // 検索に関する処理

      /**
       * 検索条件の初期設定.
       */
      initSearchItem() {

        //console.log('setSearchItem');

        //this.search.item.startShowAt.value = new Date();
        //this.search.item.start_hh = Number(localStorage.getItem("business_start_time").slice(0, 2));
        //this.search.item.start_mm = Number(localStorage.getItem("business_start_time").slice(3, 5));

        //var endDate = moment(this.watch.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");
        //endDate = moment(endDate).add({ hours : 23, minutes : 59 });
        //this.search.item.endShowAt.value = endDate.toDate();
        //this.search.item.end_hh = endDate.get('hour');
        //this.search.item.end_mm = endDate.get('minute');

        //this.param.api = '/business-report/search-by-business-date';
        this.param.api = '/business-report';
        this.param.order = [{
          'direction': 'DESC',
          'inputType': 2,
          'businessReportFieldDefinitionId': this.search.item.search_field
        }];

        this.getSearchItem4LocalStorage();
      },


      /**
       * localStorage から検索条件を取得.
       */
      getSearchItem4LocalStorage() {

        //console.log('getSearchItem4LocalStorage');

        var searchItem = localStorage.getItem('search_item');
        if (searchItem !=  null) {
          searchItem = JSON.parse(searchItem);

          this.param.offset = (searchItem.offset != null) ? searchItem.offset : 0;
          this.param.order = (searchItem.order != undefined) ? searchItem.order : null;

          //this.search.item.startShowAt = (searchItem.start != null) ? searchItem.start.date : { value: new Date() };
          //this.search.item.start_hh = (searchItem.start != null) ? searchItem.start.hour : Number(localStorage.getItem("business_start_time").slice(0, 2));
          //this.search.item.start_mm = (searchItem.start != null) ? searchItem.start.minute : Number(localStorage.getItem("business_start_time").slice(3, 5));

          //var endDate = moment(this.watch.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");
          //endDate = moment(endDate).add({ hours : 23, minutes : 59 });
          //this.search.item.endShowAt = (searchItem.end != null) ? searchItem.end.date : { value: endDate.toDate() };
          //this.search.item.end_hh = (searchItem.end != null) ? searchItem.end.hour : endDate.get('hour');
          //this.search.item.end_mm = (searchItem.end != null) ? searchItem.end.minute : endDate.get('minute');

          this.search.item.startShowAt = (searchItem.start != null) ? searchItem.start.date : {};
          this.search.item.start_hh = (searchItem.start != null) ? searchItem.start.hour : '-1';
          this.search.item.start_mm = (searchItem.start != null) ? searchItem.start.minute : '-1';
          this.search.item.endShowAt = (searchItem.end != null) ? searchItem.end.date : {};
          this.search.item.end_hh = (searchItem.end != null) ? searchItem.end.hour : '-1';
          this.search.item.end_mm = (searchItem.end != null) ? searchItem.end.minute : '-1';

          //this.watch.item.searchDate = (searchItem.date != null) ? new Date(searchItem.date) : new Date();
          this.input = (searchItem.data != null) ? searchItem.data : {};
        }
      },

      /**
       * localStorage に検索条件を格納.
       */
      setSearchItem4LocalStorage() {

        //console.log('setSearchItem4LocalStorage');

        var start = {
          date  : this.search.item.startShowAt,
          hour  : this.search.item.start_hh,
          minute: this.search.item.start_mm
        };
        var end = {
          date  : this.search.item.endShowAt,
          hour  : this.search.item.end_hh,
          minute: this.search.item.end_mm
        };
        localStorage.setItem('search_item', JSON.stringify({
          offset: this.param.offset,
          order : this.param.order,
          //date  : this.watch.item.searchDate,
          start : start,
          end   : end,
          data  : this.input
        }));
      },


      // 検索処理

      /**
       * 検索1.
       */
      search1(where) {

        //console.log('search1');

        //console.log('search_field: ' + this.search.item.search_field);

        var searchConditions = this.setOnSearchConditions();
        var countConditions  = this.setOnCountConditions();

        this.setSearchItem4LocalStorage();

        this.onSearch(this.param.api, searchConditions, null, (searchRes) => {
          //console.log('search1 - onSearch - api: ' + this.param.api);
          //console.dir(searchRes);
          this.setItems(searchRes.businessReports);
          //console.dir(this.items);
          this.onCount(this.param.api, countConditions, (countRes) => {
            //console.log('search1 - onCount - api: ' + this.param.api);
            this.param.count = countRes.count;
          });
        });

      },

      /**
       * 検索2.
       */
      search2(offset, id, type, order_type) {

        this.param.offset = offset;
        this.param.order = [{
          'direction': (order_type) ? order_type : 'DESC',
          'inputType': (type) ? type : 2,
          'businessReportFieldDefinitionId': id ? id : this.search.item.search_field
        }];

        this.setSearchItem4LocalStorage();

        //console.log('search_field: ' + this.search.item.search_field);
        var searchConditions = this.setOnSearchConditions();

        this.onSearch(this.param.api, searchConditions, null, (searchRes) => {
          //console.log('search1 - onSearch - api: ' + this.param.api);
          //console.dir(searchRes);
          this.setItems(searchRes.businessReports);
          //console.dir(this.items);
        });
      },

      /**
       * onSearch の検索条件.
       */
      setOnSearchConditions() {
        var results = this.setCommonConditions();
        results['order']  = this.param.order;
        results['limit']  = this.param.limit;
        results['offset'] = this.param.offset;
        return results;
      },

      /**
       * onCount の検索条件.
       */
      setOnCountConditions() {
        return this.setCommonConditions();
      },

      /**
       * onSearch/onCount 共通の検索条件.
       */
      setCommonConditions() {

        var conditions = this.setInnerConditions();
        var results = {
          'buildingId' : localStorage.getItem('buildings_id'),
          'businessReportGroupDefinitionId': this.$route.params.report_group_id,
          'conditions' : conditions,
        };

        if (Object.keys(this.input).indexOf('input100') !== -1 && this.input['input100'].value != '') {
          // 業務報告書種別はfieldIndex=100で設定している
          results['businessReportDefinitionId'] = Number(this.input['input100'].value);
        }

        if (Object.keys(this.input).indexOf('input101') !== -1 && this.input['input101'].value != '') {
          // ステータスはfieldIndex=101で設定している
          results['status'] = Number(this.input['input101'].value);
        }

        //if (!this.isRange4SearchDate()) {
        //  // 日付指定の場合の追加条件
        //  results['businessDate'] = moment(this.watch.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD");
        //}

        return results;
      },

      /**
       * InnerConditions含めたconditionsを設定
       *   {
       *     'conditions': [{ 'businessReportFieldDefinitionId': 0, 'inputType':2, 'innerConditions': [{}] }]
       *   }
       */
      setInnerConditions() {

        var conditions = this.getConditionTime();

        var keys = Object.keys(this.input);
        var innerCondition = [];
        var inputType;
        for (var i = 0; i < keys.length; i++) {
          if (this.input[keys[i]].value != '') {
            switch(this.input[keys[i]].inputType) {
              case 1: // 1テキスト
              case 6: // 6テキスト(複数行)
                innerCondition = [{ 'searchType': 2, 'textValue': '%' + this.input[keys[i]].value + '%' }];
                inputType = 1;
                break;
              case 3: // 3テキスト(数字)
                innerCondition = [{ 'searchType': 1, 'numberValue': parseInt(this.input[keys[i]].value) }];
                inputType = 3;
                break;
              case 4: // 4セレクトボックス
              case 5: // 5セレクトボックス(メンバー)
                innerCondition = [{ 'searchType': 1, 'selectOptionDefinitionId': parseInt(this.input[keys[i]].value) }];
                inputType = 4;
                break;
              case 0: // type=0の業務報告書種別はskip
                continue;
                break;
              default:
                break;
            }
            conditions.push({
              'businessReportFieldDefinitionId': this.input[keys[i]].id,
              'inputType': inputType,
              'innerConditions': innerCondition
            });
          }
        }
        return conditions;
      },

      /**
       * ラジオボタンで選択する日付の検索条件.
       */
      getConditionTime() {
        var conditions = [];

        //if (!this.isRange4SearchDate()) {

          //var startTime = moment(this.watch.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");
          //startTime = moment(startTime);
          //var endTime = moment(this.watch.item.searchDate, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");
          //endTime = moment(endTime).add(23, 'hours').add(59, 'minutes').add(59, 'seconds');

          //conditions.push(
          //  {
          //    'businessReportFieldDefinitionId': this.search.item.search_field,
          //    'inputType': 2,
          //    'innerConditions':[{
          //      'searchType': 4, // GT(<)
          //      'dateValue': this.getDateRemoveMinutes(startTime)
          //    }]
          //  },
          //  {
          //    'businessReportFieldDefinitionId': this.search.item.search_field,
          //    'inputType': 2,
          //    'innerConditions':[{
          //      'searchType': 3, // LT(>)
          //      'dateValue': this.getDateRemoveMinutes(endTime)
          //    }]
          //  }
          //);

        //} else {

          var start = this.getShowAtDateTime(this.search.item.startShowAt.value, this.search.item.start_hh, this.search.item.start_mm, 'start');
          var end   = this.getShowAtDateTime(this.search.item.endShowAt.value, this.search.item.end_hh, this.search.item.end_mm, 'end');

          //console.dir(this.search.item);
          //console.log('start: ' + start);
          //console.log('end: ' + end);

          conditions.push(
            {
              'businessReportFieldDefinitionId': this.search.item.search_field,
              'inputType': 2,
              'innerConditions':[{
                'searchType': 4,
                'dateValue': this.getDateRemoveMinutes(this.df_utc(start))
              }]
            },
            {
              'businessReportFieldDefinitionId': this.search.item.search_field,
              'inputType': 2,
              'innerConditions':[{
                'searchType': 3,
                'dateValue': this.df_utc(end)
              }]
            }
          );
        //}
        return conditions;
      },

      /**
       * 検索結果の格納.
       */
      setItems(businessReports) {
        this.items = [];
        const businessReportType = this.param.list.columns.filter((column) => column.column == 'business_report_type')[0];
        businessReports?.forEach((businessReport) => {
          var item = {
            'id': businessReport.id,
            'business_report_type': businessReportType?.selectOptionDefinitions?.find((v) => v.id == businessReport.businessReportDefinitionId)?.label,
            'status': this.getBusinessReportStatusList().find((v) => v.id == businessReport.status)?.label,
          };
          businessReport.businessReportFields?.forEach((businessReportField) => {
            const filters = this.param.list.columns.filter((column) => column.column == String(businessReportField.businessReportFieldDefinitionId));
            filters.forEach((filter) => { // 1件しか該当しないが0件の分岐処理が煩わしいためforEachで記載
              switch(filter.type) {
                case 1: // テキスト
                case 6: // テキスト(複数行)
                  item[filter.column] = businessReportField.textValue;
                  break;
                case 2: // 日付(年月日時分)
                  item[filter.column] = businessReportField.dateValue;
                  break;
                case 3: // テキスト(数字)
                  item[filter.column] = businessReportField.numberValue;
                  break;
                case 4: // セレクトボックス
                  item[filter.column] = filter.selectOptionDefinitions?.find((v) => v.id == businessReportField.selectOptionDefinitionId)?.label;
                  break;
                case 5: // セレクトボックス(メンバー)
                  item[filter.column] = filter.selectOptionDefinitions?.find((v) => v.id == businessReportField.memberId)?.label;
                  break;
                case 7: // 画像
                  item[filter.column] = businessReportField.textValue;
                  break;
                case 9: // セレクトボックス(フロア)
                  var floors = filter.businessReportFieldFloors;
                  item[filter.column] = filter.selectOptionDefinitions?.find((v) => v.id == floors[0].floorId)?.label;
                  break;
                default:
                  break;
              }
            });
          });
          this.items.push(item);
        });
      },

      /**
       * 範囲検索（指定した日付の範囲）かどうか
       *   option1 の場合、false
       *   option2 の場合、true
       */
      //isRange4SearchDate() {
      //  return this.watch.item.radioButtonState == "option2"
      //},

      /** 
       * 日付変換(YYYY/MM/DD HH:MM)
       */
      getShowAtDateTime(showAt, hh, mm, to) {
        var retShowAt;
        if (showAt) {
          retShowAt = this.convertShowAtDate(showAt) +' '+ this.convertTime(hh) + ':' + this.convertTime(mm) + ':59';
        } else if (to == "start") {
          retShowAt = '1900-01-01T09:00:00.000Z';
        } else if (to = "end") {
          retShowAt = '2999-12-31T23:59:59.999Z';
        }
        return retShowAt;
      },
      /**
       * 日付変換(YYYY/MM/DD)
       */
      convertShowAtDate(showAt) {
        if(showAt){
          showAt = (showAt instanceof Date) ? showAt : new Date(showAt);
          return showAt.getFullYear() + "/" +  parseInt(showAt.getMonth() + 1) + "/"+ showAt.getDate();
        } 
        return "";
      },
      /**
       * 時間変換
       */
      convertTime(time) {
        if (time == "-1") return "00"
        if (String(time).length == 1) return "0" + time; 
        return time;
      },

    },

    beforeDestroy() {
      event.off('search');
    },

    created() {
      //console.log('IndexView - created');
      this.init();
    },
 
    mounted() {
      //console.log('IndexView - mounted');
    },

    watch: {
      $route: function(route) {
        //console.log('IndexView - $route');
        this.init();
      },
      //watch: {
      //  handler: function() {
      //    //console.log('IndexView - watchItem - handler');
      //    if (!this.isRange4SearchDate()) {
      //      // 日付指定
      //      //this.param.api = '/business-report/search-by-business-date';
      //      //this.search1();
      //    } else {
      //      // 日付範囲指定
      //      this.param.api = '/business-report';
      //    }
      //  },
      //  deep: true
      //}
    }

  }


</script>

<style lang="stylus" scoped>

</style>
