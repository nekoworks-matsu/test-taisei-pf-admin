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
          <div class="box-header with-border box_head t_box_head">
						<button type="button" class="btn btn-default global_btn t_main_button" style="display: block; font-size: 16px;" @click="onTransitionButton('/t_attendance/' + $route.params.operation_id + '/details/' + item.id)">編集をキャンセル</button>
					</div>
          <div class="box-body padding_top_40 padding_bottom_30">
            <!-- <div class="margin_bottom_20">
              <button type="button" class="btn btn-default btn-lg btn-block" @click="onTransitionButton('/t_attendance/' + $route.params.operation_id + '/details/' + item.id)">キャンセル</button>
            </div> -->
            <div class="form-group t_form_parts display_flex padding_bottom_20" style="margin-right: auto; margin-left: auto">
              <div class="t_form_parts_title" style="width: 130px;">
                <label class="control-label">ID</label>
              </div>
              <div class="t_form_parts_field">
                <div class="item-text">{{item.id}}</div>
              </div>
            </div>

            <div class="form-group required t_form_parts padding_bottom_20" style="margin-right: auto; margin-left: auto">
              <div class="t_form_parts_title">
                <label class="control-label">出勤時間</label>
              </div>
              
              <div class="t_form_parts_field padding_top_5">
                <div class="t_date_time t_date_time_flex">
                  <div class="t_date_time_flex_picker">
                    <vuejs-datepicker class="form-control input_date_picker _t_form_parts_content" :clear-button="true" :format="DatePickerFormat" :language="language" :value="item.date" name="datepicker" v-model="item.date"  placeholder="YYYY/MM/DD"></vuejs-datepicker>
                  </div>
                  <div class="t_date_time_flex_ht">
                    <div class="t_date_time_flex_ht_item">
                      <select class="form-control t_date_time_hours _t_form_parts_content" v-model="item.hh">
                        <option v-bind:value="n" v-for="n in 24">{{timeConverter(n-1)}}</option>
                      </select>
                      <p>時</p>
                    </div>
                    <div class="t_date_time_flex_ht_item">
                      <select class="form-control t_date_time_hours _t_form_parts_content"  v-model="item.mm">
                        <option v-bind:value="n" v-for="n in 60">{{timeConverter(n-1)}}</option>
                      </select>
                      <p>分</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group required t_form_parts padding_bottom_20" style="margin-right: auto; margin-left: auto">
              <div class="t_form_parts_title">
                <label class="control-label">退勤時間</label>
              </div>
              <div class="t_form_parts_field padding_top_5">
                <div class="t_date_time t_date_time_flex">
                
                  <div class="t_date_time_flex_picker">
                    <vuejs-datepicker class="form-control input_date_picker _t_form_parts_content" :clear-button="true" :format="DatePickerFormat" :language="language" :value="item.leftDate" name="datepicker" v-model="item.leftDate"  placeholder="YYYY/MM/DD"></vuejs-datepicker>
                  </div>
                  <div class="t_date_time_flex_ht">
                    <div class="t_date_time_flex_ht_item">
                      <select class="form-control t_date_time_hours _t_form_parts_content" v-model="item.lefthh">
                        <option v-bind:value="n" v-for="n in 24">{{timeConverter(n-1)}}</option>
                      </select>
                      <p>時</p>
                    </div>
                    <div class="t_date_time_flex_ht_item">
                      <select class="form-control t_date_time_hours _t_form_parts_content"  v-model="item.leftmm">
                        <option v-bind:value="n" v-for="n in 60">{{timeConverter(n-1)}}</option>
                      </select>
                      <p>分</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group required t_form_parts padding_bottom_20" style="margin-right: auto; margin-left: auto">
              <div class="t_form_parts_title">
                <label class="control-label">メンバー</label>
              </div>
              <div class="t_form_parts_field padding_top_5">
                <select class="form-control _t_form_parts_content max_width_390" v-model="item.memberId">
                  <option v-bind:value="opt.value" v-for="opt in member_id_options">{{opt.name}}</option>
                </select>
              </div>
            </div>
            <div class="form-group required t_form_parts padding_bottom_20" style="margin-right: auto; margin-left: auto">
              <div class="t_form_parts_title">
                <label class="control-label">シフト</label>
              </div>
              <div class="t_form_parts_field padding_top_5">
                <select class="form-control _t_form_parts_content max_width_390" v-model="item.workShift">
                  <option v-bind:value="opt.value" v-for="opt in shift_id_options">{{opt.name}}</option>
                </select>
              </div>
            </div>
            <div class="form-group t_form_parts padding_bottom_20" style="margin-right: auto; margin-left: auto">
              <div class="t_form_parts_title">
                <label class="control-label">登録日時</label>
              </div>
              <div class="t_form_parts_field padding_top_5">
                {{df(item.createdAt)}}
              </div>
            </div>
            <div class="form-group t_form_parts padding_bottom_20" style="margin-right: auto; margin-left: auto">
              <div class="t_form_parts_title">
                <label class="control-label">更新日時</label>
              </div>
              <div class="t_form_parts_field padding_top_5">
                {{df(this.updatedAt)}}
              </div>
            </div>
          </div>

          <div class="box-footer with-border t_box_footer">
            <div v-if="itemInfo" class="callout callout-success font_18"><p>{{itemInfo}}</p></div>
            <div v-if="error" class="callout callout-danger err-info font_18"><p>{{error}}</p></div>
						<div class="t_form_button_flex flex_center padding_top_20">
							<button type="button" class="btn btn-danger global_btn t_main_button t_form_button_flex_item" @click="onDeleteFunc()" v-if="deletePermission()">削除</button>
							<button type="button" class="btn btn-info global_btn t_main_button t_form_button_flex_item" @click="onUpdateButton">保存</button>
						</div>
						<div class="padding_bottom_30">
							<button type="button" class="btn btn-default global_btn t_main_button margin_top_40" style="display: block; font-size: 16px;" onclick="window.history.back()">編集をキャンセル</button>
						</div>
          </div>
          <!-- /.box-body -->
          <!-- <div class="box-footer">
            <div v-if="itemInfo" class="callout callout-success font_18"><p>{{itemInfo}}</p></div>
            <div v-if="error" class="callout callout-danger err-info font_18"><p>{{error}}</p></div>
            <button type="button" class="btn btn-warning btn-lg btn-block" @click="onUpdateButton">更 新</button>
            <button type="button" v-if="deletePermission()" class="btn btn-danger btn-lg btn-block margin_top_20" @click="onDelete(api, '/t_attendance/'+$route.params.operation_id)">削 除</button>
          </div> -->
          <!-- /.box-footer -->
        </form>
      </div>
      <!-- /.box-body -->
    </div>
     <!-- /.box -->
    <template>
      <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert" @onconfirm="deleteFunc"></modal-alert-view>
    </template>
    <!-- /.content -->
  </div>
  
  <!-- /.content-wrapper -->
</template>

<script>
  import TabletHeaderView from '~/components/TabletHeaderView'
  import ModalAlertView from '~/components/ModalAlertView'
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
        alert: {
          title: 'test',
          message: '',
          note: '',
          isConfirm: false,
        },
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
      ModalAlertView,
      Loading
    },
    methods: {
      deletePermission(){
        const key = (this.$route.params.operation_id == 1) ? "Security:Attendance:delete" : "Cleaning:Attendance:delete";
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
        this.param.title = target.operation_name  + " 勤務スタッフ編集";
      },
      deleteFunc() {
        this.onDelete(this.api, '/t_attendance/' + this.$route.params.operation_id);
      },
      onDeleteFunc() {
        this.alert.title = '';
        this.alert.message = 'こちらのデータを削除いたします。<br>よろしいでしょうか？<br>';
        this.alert.note = '※この操作は取り消すことはできません。'
        this.alert.isConfirm = true;
        $('#modal_alert').modal('show')
      }
    },
    created() {
      $("body").css('background-color', '#FFF');
      const key = (this.$route.params.operation_id == 1) ? "Security:Attendance:update" : "Cleaning:Attendance:update";
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
