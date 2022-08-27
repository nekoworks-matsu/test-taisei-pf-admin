<template>
  <div class="content-wrapper ts_content_wrapper sidebar_scroll">
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
              <!-- <div class="pull-right">
                <button v-if="!isRemoveAdd" type="button" class="btn btn-info width_140" @click="$router.push(param.list.add)"><i class="fa fa-plus"></i>&nbsp;&nbsp;登 録</button>
              </div> -->
          </section>
        </div>
      </div>
    </section>
    <!-- <section class="content-header display_flex">
      <h1>{{param.title}}一覧</h1>
    </section> -->
    <div class="scheduler_base">
      <button type="button" class="btn btn-default scheduler_button_left" @click="tappedMonthBack"><i class="fa fa-angle-left"></i><span>　前月</span></button>
      <button type="button" class="btn btn-default scheduler_button_right" @click="tappedMonthNext"><span>翌月　</span><i class="fa fa-angle-right"></i></button>
    </div>
    <FullCalendar :options='calendarOptions' @datesRender="handleMonthChange" ref="fullCalendar" class="padding_20">
      <!-- <template v-slot:eventContent='arg'>
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template> -->
     </FullCalendar>
     <ul class="ts_schedule_description">
      <li class="ts_schedule_status01">最終更新から1週間以内</li>
      <li class="ts_schedule_status02">最終更新から1週間以上経過（閲覧時より終了日時が前）</li>
      <li class="ts_schedule_status03">最終更新から1週間以上経過（閲覧時より終了日時が後）</li>
    </ul>
  </div>
</template>
<script>
import { Calendar } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from '@fullcalendar/list';
import jaLocale from "@fullcalendar/core/locales/ja";
import moment from 'moment'
export default {
  components: {
    FullCalendar
  },
  data() {
    return {
      permissionKey:'',
      param: {
        api: '',
        nowYear: '',
        nowMonth: '',
        title: '承認カレンダー',
        searchWhere: [{ operationCategoryId: parseInt(this.$route.params.id) }],
      },
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        headerToolbar: {
          left: '',
          center:'title',
          right: ''
        },
        initialView: 'dayGridMonth',
        locale: jaLocale,
      //d height: '800',
        contentHeight: 700,
        allDaySlot: true,
        editable: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventsSet: this.handleEvents,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        dateClick: this.handleDateClick,
        fixedWeekCount: false,
        eventTimeFormat: { hour: 'numeric', minute: '2-digit' },
        customButtons: {
          backButton: {
            text: "前月",
            click: () => this.tappedMonthBack() 
          },
          nextButton: {
            text: "翌月",
            click: () => this.tappedMonthNext()
          },
          addDateButton: {
              text: "追加",
              click: () => this.tappedAddDate() // assuming you use Vue Router
          }
        }
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      },
      calendarApi: null,
    }
  },
  methods: {
    tappedChangeDate(){
      var dateInt = prompt("年月を入力してください","202010");
      if (dateInt != null){
       if (dateInt > 200000 && dateInt < 210012){
        this.calendarApi.gotoDate(dateInt);
        this.search();
       }
      }
    },
    tappedMonthBack(){
       var date = this.calendarApi.getDate();
       date.setDate(1);
       date.setMonth(date.getMonth()-1);
       this.calendarApi.gotoDate(date);
       this.search();
    },
    tappedMonthNext(){
       var date = this.calendarApi.getDate();
       date.setMonth(date.getMonth()+1);
       this.calendarApi.gotoDate(date);
       this.search();
    },
    handleMonthChange(){
    },
    tappedAddDate() {
      this.$router.push('/calendars/' + this.$route.params.id + '/add');
    },
    handleEvents(events) {
    },
    handleWeekendsToggle() {},
    handleDateSelect(selectInfo) {},
    handleEventClick(clickInfo) {
      if (clickInfo.event.groupId != '') {
        if (clickInfo.event.groupId == 1) {
          if (!this.checkItemPermission(this.permissionKey)) {
            this.$router.push('/report/' + this.$route.params.id + '/details/' + clickInfo.event.id);
          } else {
            if (clickInfo.event.title != 5)
            this.$router.push('/report_approval/details/' + this.$route.params.id + '/'+ clickInfo.event.id);
          } 
        }
      } else {
        this.$router.push('/calendars/' + this.$route.params.id + '/details/'+ clickInfo.event.id);
      }
    },
    handleDateClick(clickInfo) {
    },
    setTitle() { 
      var reportList = JSON.parse(localStorage.getItem('report_list'));
      var target = reportList.find((report) => {
        return (report.id == this.$route.params.id);
      });
      this.param.title = "承認カレンダー";
      this.param.operation = target.operation_name;
    },
    getLastDay(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      return new Date(year, month, 0).getDate();
    },
    getReportStatus(status) {
      var ret;
      switch(status) {
        case '1':
          ret = "申請中";
          break;
        case '2':
          ret = "差戻し";
          break;
        case '3':
          ret = "再申請中";
          break;
        case '4':
          ret = "承認済";
          break;
        case '5':
          ret = "未申請";
          break;
        case '6':
          ret = "未登録";
          break;
      }
      return '    ' + ret;
    },
    getReportStatusColor(status) {
      var ret;
      switch(status) {
        case '1':
          ret = "#5bc0de";
          break;
        case '2':
          ret = "#dd4b39";
          break;
        case '3':
          ret = "#3c8dbc";
          break;
        case '4':
          ret = "#00a65a";
          break;
        case '5':
          ret = "#f0ad4e";
          break;
        case '6':
          ret = "#777";
          break;
      }
      return ret;
    },
    setReportStatus(report, date) {
      const dateTime = new Date(date);
      dateTime.setTime(dateTime.getTime() + 1000 * 60 * 60 * 9);
      var monthDays = this.getLastDay(dateTime);
      var nowDay = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");
      for (var i = 0; i <= monthDays; i++) {
        var find = report.find(val => moment(val.reportedAt).utc().format() ==  moment(nowDay).utc().format());
        if (find != undefined && i != 0) {
          if (find.approveReport != undefined) {
            this.calendarApi.addEvent({id: find.id, groupId: 1, title: this.getReportStatus(find.approveReport.reportStatus), start: moment(nowDay).format('YYYY-MM-DD'), classNames: "calendars_report", backgroundColor: this.getReportStatusColor(find.approveReport.reportStatus)});
          } else {
            this.calendarApi.addEvent({id: find.id, groupId: 1, title: this.getReportStatus('5'), start: moment(nowDay).format('YYYY-MM-DD'), classNames: "calendars_report", backgroundColor: this.getReportStatusColor('5')});
          }
        } else if (i != 0) {
          // this.calendarApi.addEvent({title: this.getReportStatus('6'), groupId: 2, start: moment(nowDay).format('YYYY-MM-DD'), classNames: "calendars_report", backgroundColor: this.getReportStatusColor('6')});
        }
        nowDay = moment(nowDay).add("days", 1).utc().format();
      }
    },
    setReportApproveStatus(report, date) {
      const dateTime = new Date(date);
      dateTime.setTime(dateTime.getTime() + 1000 * 60 * 60 * 9);
      var monthDays = this.getLastDay(dateTime);
      var nowDay = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");;
      for (var i = 0; i <= monthDays; i++) {
        var find = report.find(val => moment(val.reportedAt).utc().format() ==  moment(nowDay).utc().format());
        if (find != undefined && i != 0) {
          this.calendarApi.addEvent({id: find.id, groupId: 1, title: this.getReportStatus(find.reportStatus), start: moment(nowDay).format('YYYY-MM-DD'), classNames: "calendars_report", backgroundColor: this.getReportStatusColor(find.reportStatus)});
        } else if (i != 0) {
          // this.calendarApi.addEvent({title: this.getReportStatus('5'), groupId: 2, start: moment(nowDay).format('YYYY-MM-DD'), classNames: "calendars_report", backgroundColor: this.getReportStatusColor('5')});
        }
        nowDay = moment(nowDay).add("days", 1).utc().format();
      }
    },
    search(){
      const oldEvents = this.calendarApi.getEvents()
      if (oldEvents != null){
        oldEvents.forEach((oldEvent) => {
          oldEvent.remove();
        })
      }

      var date = this.calendarApi.getDate();

      var startDateStr = date.getFullYear() + "-" + ( '00' + (date.getMonth()+1) ).slice( -2 ) + "-01T15:00:00.000Z"
      var startDates = new Date(startDateStr);
      var endDate = new Date(startDates) 
      startDates.setDate(startDates.getDate()-2);
      startDateStr = startDates.getFullYear() + "-" + ( '00' + (startDates.getMonth()+1) ).slice( -2 ) + "-" + ( '00' + (startDates.getDate()) ).slice( -2 ) + "T15:00:00.000Z"

      endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
      // endDate.setMonth(endDate.getMonth()+1);
      // endDate.setDate(endDate.getDate()+1);

      var endDateStr = endDate.getFullYear() + "-" + ( '00' + (endDate.getMonth()+1) ).slice( -2 ) + "-" + ( '00' + (endDate.getDate()) ).slice( -2 )  + "T15:00:00.000Z"
      
      var api, filter;
      if (!this.checkItemPermission(this.permissionKey)) {
        api = "/buildings/" + localStorage.getItem("buildings_id") + "/reports";
        filter = {
          "order":["updatedAt DESC"],
          // "and":[{"reportStatus":{"inq":["1","2","3","4","0"]}},{"reportedAt":{"gte": startDateStr}},{"reportedAt":{"lte": endDateStr}},{"operationReportTemplateId":{"inq": this.getOperationTemplateId(this.$route.params.id)}}]
          "and":[{"reportStatus":{"inq":["1","2","3","4","0"]}},{"reportedAt":{"gte": startDateStr}},{"reportedAt":{"lte": endDateStr}}]
        }
      } else {
        api = "/approve-reports";
        filter = {
          operationReportTemplateId: {"inq":this.getOperationTemplateId(this.$route.params.id)}, 
          buildingId: parseInt(localStorage.getItem('buildings_id')), 
          reportDefinitionId: this.$route.params.id
        }
      }
      this.onSearch(api, null, filter, (val) => {
        if (api == "/buildings/" + localStorage.getItem("buildings_id") + "/reports") {
          this.setReportStatus(val, startDateStr);
        } else {
          this.setReportApproveStatus(val, startDateStr);
        }
        var where = {
          "and":[{"startDateTime":{"lte":endDateStr}},{"endDateTime":{"gte":startDateStr}},{"operationCategoryId":this.$route.params.id}]
        }; 
        this.onSearch(this.param.api, null, where, (val) => {
          for (var i = 0; i < val.length; i++) {
            this.addEvent(val[i], val[i].startDateTime, val[i].endDateTime, startDateStr);
          }
        });
      });
      
    },
    displayReportInfo() {
      var ele = document.getElementsByClassName('calendars_report');
      for (var i = 0; i < ele.length; i++) {
        var html;
        if (!this.checkItemPermission(permissionKey)) {
          ele[i].childNodes[1].childNodes[0].className = "fa fa-clipboard";
          switch (ele[i].childNodes[2].innerText) {
            case '1':
              html = '<span class="label label-info" style="vertical-align: 2px">申請中</span>';
              break;
            case '2':
              html = '<span class="label label-danger" style="vertical-align: 2px">差戻し</span>';
              break;
            case '3':
              html = '<span class="label label-primary" style="vertical-align: 2px">再申請中</span>';
              break;
            case '4':
              html = '<span class="label label-success" style="vertical-align: 2px">承認済</span>';
              break;
            case '5':
              html = '<span class="label label-warning" style="vertical-align: 2px">未申請</span>';
              break;
            case '6':
              html = '<span class="label label-default" style="vertical-align: 2px">未登録</span>';
              break;
            default:
              break;
          }
        } else {
          ele[i].childNodes[1].childNodes[0].className = "fa fa-check-square-o";
          switch (ele[i].childNodes[2].innerText) {
            case '1':
              html = '<span class="label label-info" style="vertical-align: 2px">申請中</span>';
              break;
            case '2':
              html = '<span class="label label-danger" style="vertical-align: 2px">差戻し</span>';
              break;
            case '3':
              html = '<span class="label label-primary" style="vertical-align: 2px">再申請中</span>';
              break;
            case '4':
              html = '<span class="label label-success" style="vertical-align: 2px">承認済</span>';
              break;
            case '5':
            case '6':
              html = '<span class="label label-warning" style="vertical-align: 2px">未申請</span>';
              break;
            default:
              break;
          }
        }
        ele[i].childNodes[2].innerHTML = html;
      }
    },
    addCustomEvent(val, date) {
      
    },
    addEvent(val, startDate, endDate, searchStartDate){
      var bodyStr = "";
      var backgroundColor = "";
      if (val.body != null) {
        bodyStr = " : " + val.body;
      }
      var updatedAt = new Date(val.updatedAt)
      let now = new Date()
      var ended = false
      var endDates = new Date()
      if (endDate == null){
        endDates = new Date(startDate)
        endDates.setHours(endDates.getHours()+24);
      }else{
        endDates = new Date(endDate)
      }
      if (now > endDates){
        ended = true;
      }

      if ((now-updatedAt) < (86400000 * 7)) {
        if (ended){
          backgroundColor = "#FF1111"
        }else{
          backgroundColor = "#FF0000"
        }
      }else{
        if (ended){
          backgroundColor = "#CCCCCC"
        }else{
          backgroundColor = ""
        }
      }
      var searchDate = moment(startDate).format("YYYY-MM-DD") + ' ' + '00:00:00';
      if ((moment(searchDate).utc().format() == moment(startDate).utc().format()) && (moment(searchDate).add("days", 1).utc().format() == moment(endDate).utc().format())) {
        this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: moment(startDate).format(), color: backgroundColor, display: 'block'});
      } else {
        var start = new Date(startDate);
        var end = new Date(endDate);
        // NOTE: 週跨ぎイベント
        if ((start.getDay() > end.getDay()) || ((end - start) / 86400000) >= 7) {
          var nextWeekStart = moment(searchDate).add(7 - start.getDay(), 'days').format();

          if (moment(start).isBefore(moment(nextWeekStart))) {
            if (moment(start).isSame(moment(searchStartDate), 'month')) {
              if (moment(start).isSame(moment(nextWeekStart), 'month')) {
                this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: moment(start).add(1, 's').format(), end: nextWeekStart, color: backgroundColor, display: 'block'});
              } else {
                this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: moment(start).add(1, 's').format(), end: moment(start).endOf('month').format(), color: backgroundColor, display: 'block'});
              }
            } else {
              this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: moment(nextWeekStart).startOf('month').add(1, 's').format(), end: nextWeekStart, color: backgroundColor, display: 'block'});
            }
          } else {
            this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: moment(start).add(1, 's').format(), end: nextWeekStart, color: backgroundColor, display: 'block'});
          }
          for (var i = 0; i < ((end - start) / 86400000) / 7; i++) {
            if (nextWeekStart != moment(endDate).format()) {
              if (((end - new Date(nextWeekStart)) / 86400000) >= 7) {
                // NOTE: 月跨ぎイベント
                var nextNextWeekStart = moment(nextWeekStart).add(7, 'days').format();
                var weekEnd = moment(nextWeekStart).endOf('weeks').format();
                var endMonthStart = moment(endDate).startOf('month').format();
                var monthStart = moment(nextWeekStart).startOf('month').format();
                var monthEnd = moment(nextWeekStart).endOf('month').format();
                if (moment(nextNextWeekStart).isAfter(moment(monthEnd))) {
                  if (moment(nextWeekStart).isBefore(moment(monthEnd))) {
                    var date = this.calendarApi.getDate();
                    if (moment(date).format('YYYY-MM') == moment(nextWeekStart).format('YYYY-MM')) {
                      this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: moment(nextWeekStart).add(1, 's').format(), end: monthEnd, color: backgroundColor, display: 'block'});
                    } else {
                      //if (moment(nextWeekStart).isBefore(moment(date).format())) {
                      if (moment(nextWeekStart).diff(moment(date), 'months') == 0) {
                        var inputMonthStart = moment(date).startOf('month').format();
                        this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: moment(inputMonthStart).add(1, 's').format(), end: moment(weekEnd).add(1, 's').format(), color: backgroundColor, display: 'block'});
                      }
                    }
                  } else {
                    this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: moment(nextWeekStart).add(1, 's').format(), end: monthEnd, color: backgroundColor, display: 'block'});
                  }
                } else {
                  this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: moment(nextWeekStart).add(1, 's').format(), end: moment(nextWeekStart).add(7, 'days').format(), color: backgroundColor, display: 'block'});
                }
              } else if (moment(nextWeekStart).isBefore(endDate)){
                this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: moment(nextWeekStart).add(1, 's').format(), end: endDate, color: backgroundColor, display: 'block'});
              }
            }
            nextWeekStart = moment(nextWeekStart).add(7, 'days').format();
          }
        } else {
          this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: moment(startDate).add(1, 's').format(), end: endDate, color: backgroundColor});
        }
      }
    },
    changeDateStr(startDate){
      var y = startDate.getFullYear();
      var m = ("00" + (startDate.getMonth()+1)).slice(-2);
      var d = ("00" + startDate.getDate()).slice(-2);
      return y + "-" + m + "-" + d;
    },
    reload(){
     this.$nextTick(function() {
      this.permissionKey = (parseInt(this.$route.params.id) == 1) ? "Security:ReportSchedule:search:forOwner" : "Cleaning:ReportSchedule:search:forOwner";
      const key = (parseInt(this.$route.params.id) == 1) ? "Security:ReportSchedule:search" : "Cleaning:ReportSchedule:search";
      this.checkDisplayPermission(key, () => {
        let buildingId = localStorage.getItem('buildings_id');
        this.param.api = '/buildings/'+ buildingId +'/schedules';
        this.setTitle();

        this.calendarApi = this.$refs.fullCalendar.getApi()
        this.search();
      });
     }) 
    }
  },
  created() {
    this.permissionKey = (parseInt(this.$route.params.id) == 1) ? "Security:ReportSchedule:search:forOwner" : "Cleaning:ReportSchedule:search:forOwner";
    const key = (parseInt(this.$route.params.id) == 1) ? "Security:ReportSchedule:search" : "Cleaning:ReportSchedule:search";
    this.checkDisplayPermission(key, () => {
      let buildingId = localStorage.getItem('buildings_id');
      this.param.api = '/buildings/'+ buildingId +'/schedules';
      this.setTitle();
    });
  },
  mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi()
    this.search();
    this.calendarOptions.height = window.innerHeight*0.9 + "px";
  },
  watch: {
    $route: function(route) {
      this.reload();
    }
  }

}
</script>