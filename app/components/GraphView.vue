<template>
  <div class="box margin_bottom_0">
    <div class="overflow_auto graph_background" v-for="(chartData, index) in chartDatas">
      <div class="box-header with-border">
        <bar-chart :data="chartData" :options="options" :width="800" class="margin_left_15" v-if="chartData.type=='bar'"></bar-chart>
        <pie-chart :data="chartData" :options="options" :width="800" class="margin_left_15" v-if="chartData.type=='pie'"></pie-chart>
        <line-chart :data="chartData" :options="options" :width="800" class="margin_left_15" v-if="chartData.type=='line'"></line-chart>
        <polar-area-chart :data="chartData" :options="options" :width="800" class="margin_left_15" v-if="chartData.vatypel=='polarArea'"></polar-area-chart>
        <bubble-chart :data="chartData" :options="options" :width="800" class="margin_left_15" v-if="chartData.type=='bubble'"></bubble-chart>
        <div class="box-body pull-right">
          <button type="button" class="btn btn-danger" @click.stop="onRemoveGraph(chartData.id)"><i class="fa fa-minus"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BarChart from '~/components/BarChart';
  import PieChart from '~/components/PieChart';
  import LineChart from '~/components/LineChart';
  import PolarAreaChart from '~/components/PolarAreaChart';
  import BubbleChart from '~/components/BubbleChart';
  import Chart from '~/components/Chart';
  import CircleChart from '~/components/CircleChart';
  import ModalImgView from '~/components/ModalImgView';
  import ModalAlertView from '~/components/ModalAlertView';
  import Loading from 'vue-loading-overlay';
  import Sjcl from 'sjcl';

    // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';
  
  export default {
    props: {
      chartDatas: Array,
      onRemoveGraph: Function
    },
    data() {
      return {
        api: "https://sensor.t-spider.cloud",
        auth: "cli_Sy2KQxy2hFktaJ:CSkK2uKO4UcgqAkykQ6CwUSMAWAWY0M1XdE2VgNR",
        operationId: this.$route.params.operation_id,
        monthlyReportsId: this.$route.params._id,
        error: '',
        isOwner: false,
        fullpage: true,
        maxMajorItemsSize: 0,
        loadedMajorItemSize: 0,
        loading: true,
        graphMemo: [],
        readingFlag: true,
        readReportFlag: false,
        graphIndex: 0,
        otherList:[],
        graphIds: [],
        headers: [],
        isPreview: false,
        imageIndex: null,
        uploading: false,
        buildingId: localStorage.getItem('buildings_id'),
        floors: [{}],
        areas: [{}],
        tags: [{}],
        graphs: [],
        data1: {label:"???????????? ????????? 159???",type:1,note:" ",chartData:{labels:['1??? ???','2??? ???','3??? ???','4??? ???','5??? ???','6??? ???','7??? ???','8??? ???','9??? ???','10??? ???','11??? ???','12??? ???','13??? ???','14??? ???','15??? ???','16??? ???','17??? ???','18??? ???','19??? ???','20??? ???','21??? ???','22??? ???','23??? ???','24??? ???','25??? ???','26??? ???','27??? ???','28??? ???','29??? ???','30??? ???','31??? ???'],data:[10, 5, 10, 2, 22, 8,4,4,5,0,2,12,5,20,2,4,5,6,0,0,0,2,4,5,1,5,12,0,1,3,2,0,20,10,11,2,4]}},
        beforeSearchItem: [],
        graphTypes: [
          {val: 'bar', name: '????????????'},
          {val: 'pie', name: '????????????'},
          {val: 'line', name: '??????????????????'},
          {val: 'polarArea', name: '?????????'},
          {val: 'bubble', name: '?????????????????????'}
        ],
        stepUnits: [
          {val: '', name: ''},
          {val: 'hour', name: '???'},
          {val: 'day', name: '???'},
          {val: 'week', name: '???'},
          {val: 'month', name: '???'},
          {val: 'year', name: '???'},
          {val: 'hour_of_day', name: '????????????'},
          {val: 'day_of_week', name: '?????????'},
          {val: 'day_of_month', name: '?????????'},
          {val: 'month_of_year', name: '?????????'},
        ],
        names: [
          {val: 'count', name: '????????????'},
          {val: 'battery', name: '???????????????'}
        ],
        methods: [
          {val: 'count', name: '??????'},
          {val: 'sum', name: '??????'},
          {val: 'avg', name: '??????'},
          {val: 'min', name: '??????'},
          {val: 'max', name: '??????'},
        ],
        include: [
          'ids',
          'tagIds',
          'areaIds'
        ],
        input: {},
        item: {
          comment: "",
          memberId: 1,
        },
        alert: {
          title: 'test',
          message: '',
          note: '',
          isConfirm: false,
        },
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
        chartItem:{labels:['??????','????????????','?????????','???','????????????'],data: [10, 10, 10, 5, 2]},
        param: {
          columns: [
            // { name: '?????????', column: 'step', type: 'number' },
            // { name: '????????????', column: 'stepUnit', type: 'selectObject', options: this.stepUnits },
            { name: '?????????', column: 'step', type: 'unUsed' },
            { name: '????????????', column: 'stepUnit', type: 'unUsed', options: this.stepUnits },
            { name: '????????????', column: 'since', type: 'datetime', date:"", hour:"", minute:"" },
            { name: '????????????', column: 'until', type: 'datetime' , date:"", hour:"", minute:"" },
            // { name: '????????????', column: 'name', type: 'selectObject', options: this.names, required: true },
            // { name: '????????????', column: 'method', type: 'selectObject', options: this.methods, required: true },
            { name: '????????????', column: 'name', type: 'unUsed', options: this.names, required: true },
            { name: '????????????', column: 'method', type: 'unUsed', options: this.methods, required: true },
            { name: '?????????', column: 'floorId', type: 'selectObject', options: this.floors },
            { name: '?????????', column: 'area', type: 'selectObject', options: this.areas },
            { name: '??????', column: 'tag', type: 'cmpSelectObjects', options: this.tags }
          ],
          maxlength:512,
          reportYearMonth: this.$route.params.year ? this.$route.params.year + '-' + this.$route.params.month : undefined,
          title: '??????????????????',
          contentTitle: '????????????',
          cb: this.updateView,
          api: '/monthly-reports',
          icon: 'fa-user',
          success: '/monthly-reports/' + this.$route.params.operation_id,
          columnName: ['???','??????','????????????']
        },
        scheduleParam: {
          contentTitle: '?????????????????????',
          columnName: ['???','??????','????????????'],
          maxlength:64
        },
        DatePickerFormat: 'yyyy/MM/dd',
        language:{
          language: 'Japanese', 
          months: ['1???', '2???', '3???', '4???', '5???', '6???', '7???', '8???', '9???', '10???', '11???', '12???'], 
          monthsAbbr: ['1???', '2???', '3???', '4???', '5???', '6???', '7???', '8???', '9???', '10???', '11???', '12???'], 
          days: ['???', '???', '???', '???', '???', '???', '???'], 
          rtl: false, 
          ymd: 'yyyy-MM-dd', 
          yearSuffix: '???'
        },
        list: [],
        scheduleList:[],
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0
                }
              }
            ]
          }
        },
        chartTestData: {}
      }
    },
    components: {
      BarChart,
      PieChart,
      LineChart,
      PolarAreaChart,
      BubbleChart,
      Chart,
      CircleChart,
      ModalImgView,
      ModalAlertView,
      Loading,
      Sjcl
    },
    methods: {
      setChartData() {
        this.chartDatas.push({label:"???????????? ????????? 159???",type:1,note:" ",chartData:{labels:['1??? ???','2??? ???','3??? ???','4??? ???','5??? ???','6??? ???','7??? ???','8??? ???','9??? ???','10??? ???','11??? ???','12??? ???','13??? ???','14??? ???','15??? ???','16??? ???','17??? ???','18??? ???','19??? ???','20??? ???','21??? ???','22??? ???','23??? ???','24??? ???','25??? ???','26??? ???','27??? ???','28??? ???','29??? ???','30??? ???','31??? ???'],data:[10, 5, 10, 2, 22, 8,4,4,5,0,2,12,5,20,2,4,5,6,0,0,0,2,4,5,1,5,12,0,1,3,2,0,20,10,11,2,4]}});
        this.chartDatas.push({label:"sample2 ????????? 159???",type:1,note:" ",chartData:{labels:['1??? ???','2??? ???','3??? ???','4??? ???','5??? ???','6??? ???','7??? ???','8??? ???','9??? ???','10??? ???','11??? ???','12??? ???','13??? ???','14??? ???','15??? ???','16??? ???','17??? ???','18??? ???','19??? ???','20??? ???','21??? ???','22??? ???','23??? ???','24??? ???','25??? ???','26??? ???','27??? ???','28??? ???','29??? ???','30??? ???','31??? ???'],data:[10, 5, 10, 2, 22, 8,4,4,5,0,2,12,5,20,2,4,5,6,0,0,0,2,4,5,1,5,12,0,1,3,2,0,20,10,11,2,4]}});
        this.chartDatas.push({label:"sample ????????? 159???",type:2,note:" ",chartData:{labels:['a', 'b', 'c', 'd', 'e', 'f', 'g'] ,data:[25, 30, 50, 14, 29, 5, 6]}});
      },
      setTestData() {
        // ??????????????????
        this.chartTestData = {
          labels: ['2021???4???', '2021???5???', '2021???6???', '2021???4???', '2021???5???', '2021???6???'],
          datasets: [
            {
              label: '??????',
              data: [10, 20, 15],
              //type: 'bar',
              backgroundColor: '#4DBBAA',
              //borderColor: '#4DBBAA',
            },
            {
              label: '??????',
              data: [8, 22, 12, 8, 100, 12],
              //type: 'bar',
            },
            {
              label: '??????2',
              data: [8, 22, 12],
              //type: 'bar',
            }
          ]
        }
        this.options = {
          scales: {
            yAxes: [
              {
                ticks: {
                  min: 0
                }
              }
            ]
          }
        }
      },
      pushCmpSelectObjects(val, index, num, i, column) {
        this.graphs[index].searchItem[column][num].items[i] = val;
      },
      pushSelectObjects(val, index, i, column) {
        this.graphs[index].searchItem[column][i - 1] = val;
      },
      setSearchItemLength(index, column) {
        if (this.graphs[index].searchItem[column] == undefined) {
          this.$set(this.graphs[index].searchItem, column, [null])
        }
      },
      setSearchItemsLength(index, column) {
        if (this.graphs[index].searchItem[column] == undefined) {
          this.$set(this.graphs[index].searchItem, column, [{items: ['']}])
        }
      },
      onAddCmpSelectObject(searchItem) {
        searchItem.items.push('');
      },
      onRemoveCmpSelectObject(item, i) {
        item.items.splice(i, 1)
      },
      onAddCmpSelectObjects(index, column) {
        this.graphs[index].searchItem[column].push({items: ['']});
      },
      onRemoveCmpSelectObjects(index, i, column) {
        this.graphs[index].searchItem[column].splice(i, 1);
      },
      onAddSelectObject(index, column) {
        this.graphs[index].searchItem[column].push(null);
      },
      onRemoveSelectObject(index, i, column) {
        this.graphs[index].searchItem[column].splice(i - 1, 1);
      },
      onAddGraph() {
        this.graphs.push({id: this.graphs[this.graphs.length - 1].id + 1, searchItem: {name: "count", method: "sum"}, val: 'bar'})
      },
      getDoubleDigestNumber(number) {
        if ((number == null || number == "") && number != 0){
          return number;
        } 
        return ("00" + number).slice(-2)
      },
      timeEncode(time) {
        time = time.replace(/:/g, '%3A');
        time = time.replace(/\+/g, '%2B');
        return time;
      },
      getSensorRequest(searchItem) {
        var query = '?buildingId=' + this.buildingId;
        if (searchItem.step) {
          query == '' ? query += '?step=' + searchItem.step : query += '&step=' + searchItem.step;
        }
        if (searchItem.stepUnit) {
          query == '' ? query += '?stepUnit=' + searchItem.stepUnit : query += '&stepUnit=' + searchItem.stepUnit;
        }
        if (searchItem.since_date) {
          var hour = (searchItem.since_hour == null || searchItem.since_hour == "") ? 0 : searchItem.since_hour - 1;
          var minute = (searchItem.since_minute == null || searchItem.since_minute == "") ? 0 : searchItem.since_minute - 1;
          var time = this.changeDateFormat(searchItem.since_date) + "T" + this.getDoubleDigestNumber(hour) + ":" + this.getDoubleDigestNumber(minute) + ":00.000+09:00";
          query == '' ? query += '?time.since=' + this.timeEncode(time) : query += '&time.since=' + this.timeEncode(time);
        }
        if (searchItem.until_date) {
          var hour = (searchItem.until_hour == null || searchItem.until_hour == "") ? 0 : searchItem.until_hour - 1;
          var minute = (searchItem.until_minute == null || searchItem.until_minute == "") ? 0 : searchItem.until_minute - 1;
          var time = this.changeDateFormat(searchItem.until_date) + "T" + this.getDoubleDigestNumber(hour) + ":" + this.getDoubleDigestNumber(minute) + ":00.000+09:00";
          query == '' ? query += '?time.until=' + this.timeEncode(time) : query += '&time.until=' + this.timeEncode(time);
        }
        if (searchItem.name) {
          query == '' ? query += '?name=' + searchItem.name : query += '&name=' + searchItem.name;
        }
        if (searchItem.method) {
          query == '' ? query += '?method=' + searchItem.method : query += '&method=' + searchItem.method;
        }
        if (searchItem.floorId) {
          query == '' ? query += '?floorId=[' + searchItem.floorId : query += '&floorId=' + searchItem.floorId;
        }
        if (searchItem.area) {
          query == '' ? query += '?area=' + searchItem.area : query += '&area=' + searchItem.area;
        }
        if (searchItem.tag) {
          var tag = '';
          searchItem.tag.forEach(val => {
            if (val !== null) {
              tag == '' ? tag += val : tag += '%20' + val;
            }
          })
          if (tag != '') {
            query == '' ? query += '?tag=' + tag : query += '&tag=' + tag;
          }
        }
        return '/sensorLogs/aggregate' + query;
      },
      getFloorRequest() {
        this.onSearch('/buildings/' + this.buildingId, null, null, val => {
          var sortfloors = this.sortFloors(val.floors);
          for (var floor of sortfloors) {
            if (!floor.activated) continue;
            var name = (floor.type == 2) ? 'B' + floor.name : floor.name;
            if (floor.type != 3) {
              this.floors.push({val: floor.id, name: name + 'F'})
            } else {
              this.floors.push({val: floor.id, name: name})
            }
          }
          this.param.columns[6].options = this.floors;
          this.getAreaRequest();
        });
      },
      getAreaRequest() {
        var that = this;
        let building = '?perPage=0&used.buildingId=' + this.buildingId;
        this.getSensorHub('/areas' + building, null, function(res) {
          res.data.forEach(val => {
            that.areas.push({val: val.name, name: val.name})
          });
          that.param.columns[7].options = that.areas;
          that.getTagRequest();
        });
      },
      getTagRequest() {
        var that = this;
        let building = '?perPage=0&used.buildingId=' + this.buildingId;
        this.getSensorHub('/tags'  + building, null, function(res) {
          res.data.forEach(val => {
            that.tags.push({val: val.name, name: val.name})
          });
          that.tags.sort(function(a, b){
            if (a.val > b.val) {
              return 1;
            } else {
              return -1;
            }
          });
          that.tags.unshift({});
          that.tags.splice(-1, 1);

          that.param.columns[8].options = that.tags;
          that.graphs.push({id: 1, searchItem: {name: "count", method: "sum"}, val: 'bar'})
        });
      },
      removeDisplayGraph(id) {
        var find = this.chartDatas.findIndex(val => val.id == id);
        if (find != -1) {
          this.chartDatas.splice(find, 1);
        }
      },
      getLabels(res) {
        var labels = [];
        res.forEach(data => {
          labels.push(data.x)
        })
        return labels;
      },
      makeGraphLabel(graph, cnt) {
        return graph.searchItem.tag[cnt].items.length == 1 ? graph.searchItem.tag[cnt].items[0] : graph.searchItem.tag[cnt].items[0] + ', etc.';
      },
      makeData(res, graph) {
        var datas = [];
        res.forEach(data => {
          datas.push(data[graph.searchItem.method]);
        })
        return datas;
      },
      getDataSet(res, graph, cnt) {
        return {
          label: this.makeGraphLabel(graph, cnt),
          data: this.makeData(res, graph)
        }
      },
      /**
        ??????????????????????????????????????????????????????
       */
      getRequestData(item, tag) {
        var data = {};
        Object.assign(data, item)
        data.tag = tag;
        return data;
      },
      /**
        ??????????????????????????????????????????????????????
       */
      getSensorRequestsData(searchItem) {
        var item = {};
        Object.assign(item, searchItem)
        delete item.tag;
        var requests = [];
        for (var i = 0; i < searchItem.tag.length; i++) {
          requests.push(this.getRequestData(item, searchItem.tag[i].items))
        }
        return requests;
      },
      /**
        ?????????????????????????????????????????????????????????????????????
       */
      requestsSensorHub(requests, graph, datasets, cnt, response) {
        if (requests.length == cnt) {
          this.chartDatas.push({
            id: graph.id,
            labels: this.getLabels(response),
            datasets: datasets
          })
        } else {
          var requestUrl = this.getSensorRequest(requests[cnt]);
          var that = this;
          this.getSensorHub(requestUrl, graph, function(res) {
            datasets.push(that.getDataSet(res, graph, cnt));
            that.requestsSensorHub(requests, graph, datasets, cnt + 1, res);
          });
        }
      },
      /**
        ????????????????????????
       */
      generateSensorData(graph) {
        this.removeDisplayGraph(graph.id);
        var requests = this.getSensorRequestsData(graph.searchItem);
        this.requestsSensorHub(requests, graph, [], 0);
      },
      convertErrorMessage(message) {
        if (message.indexOf('required') != -1) {
          return '??????????????????'
        }
      },
      setParam() {
        this.param.columns[1].options = this.stepUnits;
        this.param.columns[4].options = this.names;
        this.param.columns[5].options = this.methods;
      },
      getErrorMessage(columns, errors) {
        var err = '';
        errors.forEach(error => {
          var column = columns.input.find(input => input.column == error.field)
          if (err != '') {
            err += '\n';
          }
          err += column.name + ' : ' + this.convertErrorMessage(error.message);
        })
        return err;
      },
      getSensorHub(path, columns, callback) {
        var request =  {url: this.api + path, method: 'GET', headers: {'accept': 'application/json'}, }
        const [clientId, secretKey] = this.auth.split(':')
        request.headers['X-TSH-Client-Id'] = clientId
        request.headers['X-TSH-Date'] = (new Date).toISOString(),
        request.headers['X-TSH-Signature'] = this.generate(request, secretKey)
        fetch(request.url, {
          headers: request.headers
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (data.errors == undefined) {
            this.error = '';
            callback(data);  
          } else {
            this.error = this.getErrorMessage(columns, data.errors)
          }
        })
        .catch(error => {
        });
      },
      generate(request, secretKey) {
        return this.sign(this.stringToSign(request), secretKey)
      },
      stringToSign(request) {
        const url = new URL(request.url)
        return [
          request.method,
          url.hostname,
          url.pathname,
          this.canonicalString(request, (url.search||'').replace(/^\?/, '')),
        ].join('\n')
      },
      canonicalString(request, querystring) {
        return [
          'X-TSH-Client-Id=' + (request.headers['X-TSH-Client-Id'] || ''),
          'X-TSH-Date=' + (request.headers['X-TSH-Date'] || ''),
          'SignatureMethod=HmacSHA256',
          'SignatureVersion=1',
          ...querystring.split('&').filter(s => s.length),
        ].sort().join('&')
      },
      sign(stringToSign, secretKey) {
        const hmac = new Sjcl.misc.hmac(Sjcl.codec.utf8String.toBits(secretKey), Sjcl.hash.sha256);
        return Sjcl.codec.hex.fromBits(hmac.encrypt(stringToSign))
      }
    },
    mounted() {
      this.setParam();
      this.getFloorRequest();
      // this.setChartData();
      //this.renderChart(chartData, options)
    },
    created() {
    },
    updated() {
    },
    watch: {
    },
  }

</script>

<style lang="stylus" scoped>

</style>
