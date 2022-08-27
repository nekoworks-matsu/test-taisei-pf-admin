<template>
  <div align="left">
    <tablet-header-view ref="header" :param="param"></tablet-header-view>
    <div class="box content ctm_subtitle margin_bottom_0" v-bind:style="{'margin-top':tabletHeight+'px'}">
      <div class="box-header box_head t_box_head">
				<button type="button" class="btn global_btn global_btn_border t_main_button" style="display: block !important;" @click="tappedAddDate">登録</button>
			</div>
      <div class="tablet_schedule">
        <section class="content-header display_flex">
        </section>
        <div class="scheduler_base tablet_scheduler_base">
          <button type="button" class="btn btn-lg btn-default t_scheduler_button_left" @click="tappedMonthBack"><i class="fa fa-angle-left"></i><span>　前月</span></button>
          <button type="button" class="btn btn-lg  btn-default t_scheduler_button_right" @click="tappedMonthNext"><span>翌月　</span><i class="fa fa-angle-right"></i></button>
        </div>
        <!-- <div class="scheduler_add_base">
          <button type="button" class="btn btn-info t_scheduler_button_add" @click="tappedAddDate"><i class="fa fa-plus"></i>&nbsp;&nbsp;登録</button>
        </div> -->
        <FullCalendar :options='calendarOptions' @datesRender="handleMonthChange" ref="fullCalendar" class="padding_20 padding_top_5 tablet_schedule_body">
          <template v-slot:eventContent='arg'>
            <b>{{ arg.timeText }}</b>
            <i>{{ arg.event.title }}</i>
          </template>
        </FullCalendar>
      </div>
      <ul class="ts_schedule_description tablet_schedule_description">
				<li class="ts_schedule_status01">最終更新から1週間以内</li>
				<li class="ts_schedule_status02">最終更新から1週間以上経過（閲覧時より終了日時が前）</li>
				<li class="ts_schedule_status03">最終更新から1週間以上経過（閲覧時より終了日時が後）</li>
			</ul>
			<div class="box-footer with-border t_box_footer">
        <button type="button" class="btn global_btn global_btn_border t_main_button" style="display: block !important;" @click="tappedAddDate">登録</button>
			</div>
    </div>
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
import TabletHeaderView from '~/components/TabletHeaderView'

const INITIAL_EVENTS = [
]
export default {
  layout: 'everyone',
  components: {
    TabletHeaderView,
    FullCalendar
  },
  data() {
    return {
      tabletHeight: 0,
      param: {
        title: 'イベント',
        api: '',
        nowYear: '',
        nowMonth: '',
        isBackButtons: true,
        isHomeButtons: true,
        backPath: '/t_home',
      },
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin,listPlugin],
        headerToolbar: {
          left: '',
          center:'title',
          right: ''
        },
        initialView: 'listMonth',
        initialEvents: INITIAL_EVENTS,
        locale:jaLocale,
        height:'800px',
        allDaySlot: true,
        editable: true,
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
      this.$router.push('/t_calendars/' + this.$route.params.id + '/add');
    },
    handleEvents(events) {
    },
    handleWeekendsToggle() {},
    handleDateSelect(selectInfo) {},
    handleEventClick(clickInfo) {
      this.$router.push('/t_calendars/' + this.$route.params.id + '/details/'+clickInfo.event.id);
    },
    handleDateClick(clickInfo) {
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
      startDates.setDate(startDates.getDate()-2);
      startDateStr = startDates.getFullYear() + "-" + ( '00' + (startDates.getMonth()+1) ).slice( -2 ) + "-" + ( '00' + (startDates.getDate()) ).slice( -2 ) + "T15:00:00.000Z"

      var endDate = new Date(startDates);
      endDate.setMonth(endDate.getMonth()+1);
      endDate.setDate(endDate.getDate()+1);

      var endDateStr = endDate.getFullYear() + "-" + ( '00' + (endDate.getMonth()+1) ).slice( -2 ) + "-" + ( '00' + (endDate.getDate()) ).slice( -2 )  + "T15:00:00.000Z"
      
      var where = {
        "and":[{"startDateTime":{"lte":endDateStr}},{"endDateTime":{"gte":startDateStr}},{"operationCategoryId":this.$route.params.id}]
        // "and":[{"endDateTime":{"gte":startDateStr}},{"endDateTime":{"lte":endDateStr}}]
      };
      this.onSearch(this.param.api,null,where,(val) =>
          {
            //MEMO:1日以上のものの終日表示対応
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

          }
      )
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
      this.calendarApi.addEvent({id: val.id,title:  val.title,start: startDate, end: endDate,backgroundColor:backgroundColor});          
    },
    changeDateStr(startDate){
      var y = startDate.getFullYear();
      var m = ("00" + (startDate.getMonth()+1)).slice(-2);
      var d = ("00" + startDate.getDate()).slice(-2);
      return y + "-" + m + "-" + d;
    },
    setTitle() { 
      var reportList = JSON.parse(localStorage.getItem('report_list'));
      var target = reportList.find((report) => {
        return (report.id == this.$route.params.id);
      });
      this.param.title = target.operation_name + " イベント一覧";
    },
  },
  created() {
    const key = (parseInt(this.$route.params.id ) == 1) ? "Security:Schedule:search" : "Cleaning:Schedule:search";
    this.checkDisplayPermission(key, () => {
      let buildingId = localStorage.getItem('buildings_id');
      this.param.api = '/buildings/'+ buildingId +'/schedules';
      $("body").css('background-color', '#FFF');
      this.setTitle();
    });
  },
  mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi()
    this.search();
    this.calendarOptions.height = window.innerHeight*0.84 + "px";
    this.tabletHeight = this.$refs.header.$el.clientHeight;
  }

}
</script>