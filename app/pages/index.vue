<template>
  <div class="content-wrapper ts_content_wrapper ts_index">
    <section class="content_head" style="padding-bottom: 15px!important;">
      <div class="ts_content_head">
        <div class="ts_breadcrumb">
          <!-- <ol>
            <li>ホーム</li>
          </ol> -->
        </div>
        <h1 class="ts_content_heading">ホーム</h1>
      </div>
    </section>
    
    <home-view-for-building :param="buildingInfo" v-if="!isHeadquartersMode&&!isSystemApprovalMode"></home-view-for-building>
    <home-view-for-member :param="memberInfo"></home-view-for-member>
    <home-view-for-event :param="operation" :count="index" :num="eventInfo.operations.length" v-if="!isHeadquartersMode&&!isSystemApprovalMode" v-for="(operation, index) in eventInfo.operations"></home-view-for-event>
    <home-view-for-information></home-view-for-information>
  </div>
</template>

<script>
import HomeViewForBuilding from '~/components/HomeViewForBuilding'
import HomeViewForMember from '~/components/HomeViewForMember'
import HomeViewForEvent from '~/components/HomeViewForEvent'
import HomeViewForInformation from '~/components/HomeViewForInformation'

const INITIAL_EVENTS = [
]
export default {
  data() {
    return {
      isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
      isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
      role: localStorage.getItem('role'),
      buildingInfo: {
        id: '',
        name: '',
        zipcode: '',
        address: '',
        tel: '',
        filePath: '',
      },
      memberInfo: {
        id: '',
        name: '',
        role: '',
        operations: '',
      },
      eventInfo: {
        operations: '',
      },
      menuList: {
        report:[]
      },
      param: {
        api: '',
        nowYear: '',
        nowMonth: '',
        title: 'スケジュール',
        searchWhere: [{ operationCategoryId: parseInt(this.$route.params.id) }],
      },
    }
  },
  components: {
    HomeViewForBuilding,
    HomeViewForMember,
    HomeViewForEvent,
    HomeViewForInformation
  },
  methods: {
    setTitle() {
      var reportList = JSON.parse(localStorage.getItem('report_list'));
      var target = reportList.find((report) => {
        return (report.id == this.$route.params.id);
      });
      this.param.title = "スケジュール(" +  target.operation_name + ")";
    },
    reload(){
     this.$nextTick(function() {
      let buildingId = localStorage.getItem('buildings_id');
      this.param.api = '/buildings/'+ buildingId +'/schedules';
      this.setTitle();

      this.calendarApi = this.$refs.fullCalendar.getApi();
      //this.search();
     })
    },
    getBuildingInfo() {
      if (this.isHeadquartersMode || this.isSystemApprovalMode) {
        return;
      }
      this.onSearch('/buildings/'+ localStorage.getItem('buildings_id') , null, null, val => {
        this.buildingInfo.id = val.id;
        this.buildingInfo.name = val.name;
        this.buildingInfo.zipcode = val.zipcode;
        this.buildingInfo.address = this.getPrefectureName(val.prefectureId) + val.city + val.address;
        this.buildingInfo.tel = val.tel;
        this.buildingInfo.filePath = (val.filePath == null) ?  val.filePath : this.imageHeaderUrl + val.filePath;
      });
    },
    getMemberInfo() {
      this.onSearch('/members/'+ localStorage.getItem('member_id') , null, null, val => {
        this.memberInfo.id = val.member.id;
        this.memberInfo.name = val.member.name;
        this.memberInfo.role = val.member.role;
        this.memberInfo.operations = val.memberOperationCategories;
        this.getEventInfo();
      });
    },
    getEventInfo() {
      this.menuList.report = JSON.parse(localStorage.getItem('report_list'));
      this.menuList.report.sort(function(a,b){
        if(a.id < b.id) return -1;
        if(a.id > b.id) return 1;
        return 0;
      });
      this.eventInfo.operations = this.menuList.report;
      // if (this.isHeadquartersMode || this.isSystemApprovalMode) {
      //   return;
      // }
      // this.eventInfo.operations = this.memberInfo.operations;
    },
    init() {
      this.getBuildingInfo();
      this.getMemberInfo();
    }
  },
  created() {
    let buildingId = localStorage.getItem('buildings_id');
    this.param.api = '/buildings/'+ buildingId +'/schedules';
    this.init();
  },
  mounted() {
  },
  watch: {
    $route: function(route) {
      this.reload();
    }
  }

}
</script>

