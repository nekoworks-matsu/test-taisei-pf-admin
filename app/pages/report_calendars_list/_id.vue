<template>
  <div class="content-wrapper">
    <section class="content-header display_flex">
      <h1>{{param.title}}一覧</h1>
    </section>
    <div class="scheduler_base">
      <button type="button" class="btn btn-default scheduler_button_left" @click="tappedMonthBack"><i class="fa fa-angle-left"></i><span>　前月</span></button>
      <button type="button" class="btn btn-default scheduler_button_right" @click="tappedMonthNext"><span>翌月　</span><i class="fa fa-angle-right"></i></button>
    </div>
    <FullCalendar :options='calendarOptions' @datesRender="handleMonthChange" ref="fullCalendar" class="padding_20">
      <template v-slot:eventContent='arg'>
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
     </FullCalendar>
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
        initialView: 'listMonth',
        locale: jaLocale,
        height:'800px',
        permissionKey: '',
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
          if (!this.checkItemPermission(permissionKey)) {
            this.$router.push('/report/details/' + this.$route.params.id + '/'+ clickInfo.event.id);
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
      this.param.title = "承認カレンダー(" +  target.operation_name + ")";
    },
    getLastDay(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      return new Date(year, month, 0).getDate();
    },
    setReportStatus(report, date) {
      const dateTime = new Date(date);
      dateTime.setTime(dateTime.getTime() + 1000 * 60 * 60 * 9);
      var monthDays = this.getLastDay(dateTime);
      var nowDay = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");
      for (var i = 0; i <= monthDays; i++) {
        var find = report.find(val => moment(val.reportedAt).utc().format() ==  moment(nowDay).utc().format());
        if (find != undefined) {
          if (find.approveReport != undefined) {
            this.calendarApi.addEvent({id: find.id, groupId: 1, title: ' ' + find.approveReport.reportStatus, start: moment(nowDay).format('YYYY-MM-DD'), classNames: "calendars_report"});
          } else {
            this.calendarApi.addEvent({id: find.id, groupId: 1, title: ' ' + 5, start: moment(nowDay).format('YYYY-MM-DD'), classNames: "calendars_report"});
          }
        } else {
          this.calendarApi.addEvent({title: ' ' + 6, groupId: 2, start: moment(nowDay).format('YYYY-MM-DD'), classNames: "calendars_report"});
        }
        nowDay = moment(nowDay).add("days", 1).utc().format();
      }
    },
    setReportApproveStatus(report, date) {
      const dateTime = new Date(date);
      dateTime.setTime(dateTime.getTime() + 1000 * 60 * 60 * 9);
      var monthDays = this.getLastDay(dateTime);
      var nowDay = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD") + ' ' + localStorage.getItem("business_start_time");
      for (var i = 0; i <= monthDays; i++) {
        var find = report.find(val => moment(val.reportedAt).utc().format() ==  moment(nowDay).utc().format());
        if (find != undefined) {
          this.calendarApi.addEvent({id: find.id, groupId: 1, title: ' ' + find.reportStatus, start: moment(nowDay).format('YYYY-MM-DD'), classNames: "calendars_report"});
        } else {
          this.calendarApi.addEvent({title: ' ' + 6, groupId: 2, start: moment(nowDay).format('YYYY-MM-DD'), classNames: "calendars_report"});
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
      if (!this.checkItemPermission(permissionKey)) {
        api = "/buildings/" + localStorage.getItem("buildings_id") + "/reports";
        filter = {
          "order":["updatedAt DESC"],
          "and":[{"reportStatus":{"inq":["1","2","3","4","0"]}},{"reportedAt":{"gte": startDateStr}},{"reportedAt":{"lte": endDateStr}},{"operationReportTemplateId":{"inq": this.getOperationTemplateId(this.$route.params.id)}}]
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
            var startDate = new Date(val[i].startDateTime);
            var endDate = new Date(val[i].endDateTime);
            var deltaDate = (endDate - startDate);
            var nextDate = new Date(startDate)
            nextDate.setDate(nextDate.getDate()+1)
            nextDate.setHours(nextDate.getHours()-nextDate.getHours())
            nextDate.setMinutes(nextDate.getMinutes()-nextDate.getMinutes())
            var bodyStr = "";
            if (val[i].body != null){
              bodyStr = " : " + val[i].body;
            }
            if (deltaDate >= 86400000){
              if (startDate.getHours() == 0 && startDate.getMinutes() == 0) {
                var strDate = this.changeDateStr(startDate);
                this.addEvent(val[i],strDate,null)
              } else {
                var strDate = this.changeDateStr(startDate);
                this.addEvent(val[i],val[i].startDateTime,nextDate)
              }

              while (true){
                deltaDate = endDate - nextDate
                if (deltaDate == 0) {
                  //MEMO:追加無し
                  break;
                } else if (deltaDate >= 86400000) {
                  var strDate = this.changeDateStr(nextDate);
                  this.addEvent(val[i],strDate,null)
                  nextDate.setDate(nextDate.getDate()+1)
                } else {
                  this.addEvent(val[i],nextDate,val[i].endDateTime)
                  break;
                }
              }
            }else{
              this.addEvent(val[i],val[i].startDateTime,val[i].endDateTime)
            }
          }
          var elements = document.getElementsByClassName('fc-list-event');
          // 要素を指定
          for(var i=0;i<elements.length;i++){
            var child = elements[i].getElementsByClassName('fc-list-event-graphic')
            var childSpan = child[0].getElementsByClassName('fc-list-event-dot')
            if (childSpan[0].style.borderColor == "rgb(204, 204, 204)"){
              var childTime = elements[i].getElementsByClassName('fc-list-event-time')
              elements[i].style.color = "#999999";
            }else if (childSpan[0].style.borderColor == "rgb(255, 17, 17)"){
              var childTime = elements[i].getElementsByClassName('fc-list-event-time')
              elements[i].style.color = "#999999";
            }
          }

          this.displayReportInfo();
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
    addEvent(val,startDate,endDate){
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
      // if (val.id == 3) {
      //   this.calendarApi.addEvent({
      //     title: 'All Day Event', start: '2021-04-01'
      //   });
      // }
      this.calendarApi.addEvent({id: val.id, title: val.title.trim(), start: startDate, end: endDate, color: backgroundColor});          
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