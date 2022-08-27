<template>
  <section class="ts_index-schedule ts_schedule">
    <h2 class="ts_heading" v-if="count==0">イベント</h2>
    <div class="ts_index_wrap">
      <h2 class="ts_subheading">{{param.operation_name}} 一覧</h2>
      <div class="scheduler_base">
        <button type="button" class="btn btn-default scheduler_button_left" @click="tappedMonthBack"><i class="fa fa-angle-left"></i><span>　先月</span></button> 
        <button type="button" class="btn btn-default scheduler_button_right" @click="tappedMonthNext"><span>翌月　</span><i class="fa fa-angle-right"></i></button>
      </div>
      <FullCalendar :options='calendarOptions' @datesRender="handleMonthChange" :ref="'fullCalendar'" class="padding_20 home_event">
        <template v-slot:eventContent='arg'>
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
    <ul class="ts_schedule_description" v-if="count==num-1">
      <li class="ts_schedule_status01">最終更新から1週間以内</li>
      <li class="ts_schedule_status02">最終更新から1週間以上経過（閲覧時より終了日時が前）</li>
      <li class="ts_schedule_status03">最終更新から1週間以上経過（閲覧時より終了日時が後）</li>
    </ul>
  </section>
</template>

<script>
import { Calendar } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from '@fullcalendar/list';
import jaLocale from "@fullcalendar/core/locales/ja";
import HomeViewForBuilding from '~/components/HomeViewForBuilding'
import HomeViewForMember from '~/components/HomeViewForMember'

const INITIAL_EVENTS = [
]
export default {
  data() {
    return {
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
  props: {
    param: Object,
    count: Number,
    num: Number,
  },
  components: {
    FullCalendar,
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
      //this.$router.push('/calendars/' + this.$route.params.id + '/add');
    },
    handleEvents(events) {
    },
    handleWeekendsToggle() {},
    handleDateSelect(selectInfo) {},
    handleEventClick(clickInfo) {
      this.$router.push('/calendars/' + this.param.id + '/details/'+clickInfo.event.id);
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
      var endDate = new Date(startDates)
      startDates.setDate(startDates.getDate()-2);
      startDateStr = startDates.getFullYear() + "-" + ( '00' + (startDates.getMonth()+1) ).slice( -2 ) + "-" + ( '00' + (startDates.getDate()) ).slice( -2 ) + "T15:00:00.000Z"

      endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
      // endDate.setMonth(endDate.getMonth()+1);
      // endDate.setDate(endDate.getDate()+1);

      var endDateStr = endDate.getFullYear() + "-" + ( '00' + (endDate.getMonth()+1) ).slice( -2 ) + "-" + ( '00' + (endDate.getDate()) ).slice( -2 )  + "T15:00:00.000Z"

      var where = {
        "and":[{"startDateTime":{"lte":endDateStr}},{"endDateTime":{"gte":startDateStr}},{"operationCategoryId":this.param.id}]
        // "and":[{"endDateTime":{"gte":startDateStr}},{"endDateTime":{"lte":endDateStr}}]
      };
      this.onSearch('/buildings/' + localStorage.getItem('buildings_id') + '/schedules', null, where, (val) =>
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
  },
  mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi();
    this.search();
    this.calendarOptions.height = window.innerHeight*0.9 + "px";
  },
}
</script>
