<template>
  <!-- Content Wrapper. Contains page content -->
  <div align="left">
    <!-- Content Header (Page header) -->
    <tablet-header-view ref="header" :param="param"></tablet-header-view>
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <div class="box content ctm_subtitle margin_bottom_0 box_shadow_none" v-bind:style="{'margin-top':tabletHeight+'px'}">

      <!-- Main content -->
      <div class="box-body no-paddin">
        <form class="form-horizontal" autocomplete="off">
          <div class="box-header with-border box_head t_box_head" v-if="editPermission()">
            <button type="button" class="btn global_btn global_btn_border t_main_button" style="display: block !important; font-size: 16px;" @click="onTransitionButton('/t_attendance/' + $route.params.operation_id + '/edit/' + item.id)">編集</button>
          </div>
          <div class="box-body text_align_center">
            <div class="t_form_box_groupwrap">
              <!-- <div class="margin_bottom_20">
                <button type="button" v-if="editPermission()" class="btn btn-info btn-lg btn-block" @click="onTransitionButton('/t_attendance/' + $route.params.operation_id + '/edit/' + item.id)">編 集</button>
              </div> -->
              <div class="form-group t_form_box_group">
                <div class="t_form_box_group_title">
                  <label>ID</label>
                </div>
                <div class="form_box_group_field">
                  <div class="item-text">{{item.id}}</div>
                </div>
              </div>

              <div class="form-group t_form_box_group">
                <div class="t_form_box_group_title">
                  <label>出勤時間</label>
                </div>
                <div class="form_box_group_field">
                  {{df2(item.date)}}
                </div>
              </div>

              <!-- <div class="form-group t_form_parts padding_bottom_20"> -->
              <div class="form-group t_form_box_group">
                <div class="t_form_box_group_title">
                  <label>退勤時間</label>
                </div>
                <div class="form_box_group_field">
                  {{df2(item.leftDate)}}
                </div>
              </div>

              <div class="form-group t_form_box_group">
                <div class="t_form_box_group_title">
                  <label>メンバー</label>
                </div>
                <div class="form_box_group_field">
                  {{getMembersName(item.memberId)}}
                </div>
              </div>

              <div class="form-group t_form_box_group">
                <div class="t_form_box_group_title">
                  <label>シフト</label>
                </div>
                <div class="form_box_group_field">
                  {{getShiftName(item.workShift)}}
                </div>
              </div>
              <div class="form-group t_form_box_group">
                <div class="t_form_box_group_title">
                  <label>登録日時</label>
                </div>
                <div class="form_box_group_field">
                  {{df(item.createdAt)}}
                </div>
              </div>
              <div class="form-group t_form_box_group">
                <div class="t_form_box_group_title">
                  <label>更新日時</label>
                </div>
                <div class="form_box_group_field">
                  {{df(this.updatedAt)}}
                </div>
              </div>
            </div>
          </div>
          <!-- /.box-body -->
          <div v-if="itemInfo" class="callout callout-success font_18"><p>{{itemInfo}}</p></div>
          <div v-if="error" class="callout callout-danger err-info font_18"><p>{{error}}</p></div>
          <div class="box-footer with-border t_box_footer" v-if="editPermission()">
            <button type="button" class="btn global_btn global_btn_border t_main_button" style="display: block !important; font-size: 16px;" @click="onTransitionButton('/t_attendance/' + $route.params.operation_id + '/edit/' + item.id)">編集</button>
          </div>
          <!-- <div class="box-footer">
            <button type="button" class="btn btn-default btn-lg btn-block" onclick="window.history.back()">戻る</button>
          </div> -->
          <!-- /.box-footer -->
        </form>
      </div>
      <!-- /.box-body -->
    </div>
        <!-- /.box -->
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import TabletHeaderView from '~/components/TabletHeaderView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  
  export default {
    layout: 'everyone',
    data() {
      return {
        param: {
          title: '勤務スタッフ詳細',
          isBackButtons: true,
          isHomeButtons: true,
          backPath: '/t_attendance/' + this.$route.params.operation_id,
          columns: [
            { name: '出勤時間', column: 'attendedAt', type: 'datetime',date:"",hh:"",mi:"",required: true},
            { name: '退勤時間', column: 'leftAt', type: 'datetime',date:"",hh:"",mi:"",required: false},
            { name: 'メンバー', column: 'memberId', type: 'select', options: [], required: true},
            { name: 'シフト', column: 'workShift', type: 'select', required: true, options: this.getWorkShiftList(false)},
          ],
        },
        api: '/attendances',
        tabletHeight: 0,
        error: '',
        fullpage: true,
        member_id_options: [
        ],
        shift_id_options: this.getWorkShiftList(false),
        updatedAt: '',
        item: {
          id: '',
          workShift:'',
          memberId:'',
          date: '',
          hh:'',
          mi:'',
          leftDate: '',
          lefthh:'',
          leftmi:'',
          createdAt: '',
        },
        language: {
          language: 'Japanese', 
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          days: ['日', '月', '火', '水', '木', '金', '土'], 
          rtl: false,
          ymd: "yyyy-MM-dd",
          yearSuffix: "年"
        },
        DatePickerFormat: "yyyy/MM/dd",
      }
    },
    components: {
      TabletHeaderView,
      Loading
    },
    methods: {
      editPermission(){
        const key = (this.$route.params.operation_id == 1) ? "Security:Attendance:update" : "Cleaning:Attendance:update";
        return this.checkMenuPermission(key);
      },
      getAttendanceInfoRequest() {
        this.onRead(this.api, '', data => {
          this.item = data;
          this.updatedAt = this.item.updatedAt;
          var attendedAt = new Date(this.item.attendedAt);
          this.item.date = attendedAt;
          this.item.hh = attendedAt.getHours()+1;
          this.item.mm = attendedAt.getMinutes()+1;

          if (this.item.leftAt!=null){
            var leftAt = new Date(this.item.leftAt);
            this.item.leftDate = leftAt;
            this.item.lefthh = leftAt.getHours()+1;
            this.item.leftmm = leftAt.getMinutes()+1;            
          }
        });
      },
      getRows(text) {
        if (text == undefined || text == null) {
          return 1;
        }
        return text.split("\n").length;
      },
      getMembersRequest(){
        let buildingId = localStorage.getItem('buildings_id');
        let ownId = this.$route.params.id;
        let api_for_list = '/buildings/' + buildingId + '/members';
        var where = {"and":[{"operationTypeId": this.getOperationTypeId(this.$route.params.operation_id)}, {"role":{"neq":3}}]};
        this.onSearch(api_for_list, null, where, val => {
          const list = [];
          val.forEach(function(obj){
            list.push({name: obj.name, value: obj.id});
          });
          this.item.id = parseInt(ownId);
          this.member_id_options = list;

          this.getAttendanceInfoRequest();
        });
      },
      getMembersName(id) {
        var find = this.member_id_options.find(val => val.value == id);
        if (find != undefined) {
          return find.name;
        }
      },
      getShiftName(id) {
        var find = this.shift_id_options.find(val => val.value == id);
        if (find != undefined) {
          return find.name;
        }
      },
      onUpdateButton() {
        var leftAt = "";
        if((this.item.leftDate == null) || (this.item.lefthh == null || this.item.lefthh == "") || (this.item.leftmm == null || this.item.leftmm == "")){
          if ((this.item.leftDate == null) && (this.item.lefthh == null) && (this.item.leftmm == null)){
            
          }else{
            leftAt = this.changeDateFormat(this.item.leftDate) + "T" + this.getDoubleDigestNumber(this.item.lefthh-1) + ":" + this.getDoubleDigestNumber(this.item.leftmm-1) + ":00.000+09:00";
          }
        }else{
          leftAt = this.changeDateFormat(this.item.leftDate) + "T" + this.getDoubleDigestNumber(this.item.lefthh-1) + ":" + this.getDoubleDigestNumber(this.item.leftmm-1) + ":00.000+09:00";
        }
        const request = {
          attendedAt: this.changeDateFormat(this.item.date) + "T" + this.getDoubleDigestNumber(this.item.hh-1) + ":" + this.getDoubleDigestNumber(this.item.mm-1) + ":00.000+09:00",
          leftAt: leftAt,
          memberId: this.item.memberId,
          workShift: this.item.workShift,
          buildingId: parseInt(localStorage.getItem('buildings_id')),
          operationCategoryId: parseInt(this.$route.params.operation_id)
        };
        if (request.attendedAt != "" && request.leftAt != null){
          var startDate = new Date(request.attendedAt);
          var endDate = new Date(request.leftAt);
          if (!(isNaN(startDate))&&!(isNaN(endDate))){
            if (endDate<startDate){
              this.error = "退勤時間 : 退勤時間を出勤時間より後の時間に設定してください。";
              return
            }
          }
        }

        this.onUpdate(
          this.api,
          request,
          (err, res) => {
            if (res && res.ok) {
              this.error = '';
              this.itemInfo = '更新完了';
              setTimeout(() => this.itemInfo = '', 3000);
              this.updatedAt = res.body.updatedAt;
            } else if(err){
              this.error = this.getErrorMsg2(res, this.param.columns);
              return;
            }
          }
        );
      },
      getDoubleDigestNumber(number) {
        return ('00' + number).slice(-2)
      },
      setTitle() {
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        this.param.title = target.operation_name + " 勤務スタッフ詳細";
      }
    },
    created() {
      $("body").css('background-color', '#FFF');
      const key = (this.$route.params.operation_id == 1) ? "Security:Attendance:view" : "Cleaning:Attendance:view";
      this.checkDisplayPermission(key,() => {
        this.getMembersRequest();
        this.setTitle();
      });
    },
    beforeDestroy() {
      // $("body").css('background-color', '#ECF0F5');
    },
    mounted() {
      this.tabletHeight = this.$refs.header.$el.clientHeight;
    }
  }

</script>
