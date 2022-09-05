<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper ts_content_wrapper">
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
                <li>{{param.title}}一覧</li>
                <li>{{param.title}}詳細</li>
                <li class="current">{{param.title}}編集</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}編集</h1>
          </section>
          <!-- <div class="button_header_btn">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/attendance/' + $route.params.operation_id + '/edit/' + item.id)">編集</button>
          </div> -->
        </div>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1>
        {{param.title}}編集
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-default width_140" @click="onTransitionButton('/attendance/' + $route.params.operation_id + '/details/' + item.id)">キャンセル</button>
        </div>
      </h1>
    </section> -->

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <!-- <div class="box-header with-border">
            <h3 class="box-title with-border">{{param.title}}詳細情報</h3>
          </div> -->
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal" autocomplete="off">
              <div class="box-body">
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">ID</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{item.id}}
                    </div>
                  </div>     
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">出勤時間</label>
                  </div>
                  <div class="display_flex">
                    <div class="col-sm-2 max_width_200 width_50_per" style="padding-left: 0px;">
                      <vuejs-datepicker class="form-control date_picker_small" :clear-button="true" :format="DatePickerFormat" :language="language" :value="item.date" name="datepicker" v-model="item.date"  placeholder="YYYY/MM/DD">
                      </vuejs-datepicker>
                    </div>
                    <div class="col-sm-4 date_time" style="width:220px;">
                      <select class="form-control" v-model="item.hh" style="width:65px;display:inline;">
                        <option v-bind:value="n" v-for="n in 24">{{timeConverter(n-1)}}</option>
                      </select> 
                      <span class="margin_2">時</span>
                      <select class="form-control" v-model="item.mm" style="width:65px;display:inline;">
                        <option v-bind:value="n" v-for="n in 60">{{timeConverter(n-1)}}</option>
                      </select>
                      <span class="margin_2">分</span>
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">退勤時間</label>
                  </div>
                  <div class="display_flex">
                    <div class="col-sm-2 max_width_200 width_50_per" style="padding-left: 0px;">
                      <vuejs-datepicker class="form-control date_picker_small" :clear-button="true" :format="DatePickerFormat" :language="language" :value="item.leftDate" name="datepicker" v-model="item.leftDate"  placeholder="YYYY/MM/DD">
                      </vuejs-datepicker>
                    </div>
                    <div class="col-sm-4 date_time" style="width:220px;">
                      <select class="form-control" v-model="item.lefthh" style="width:65px;display:inline;">
                        <option v-bind:value="n" v-for="n in 24">{{timeConverter(n-1)}}</option>
                      </select>
                      <span class="margin_2">時</span>
                      <select class="form-control" v-model="item.leftmm" style="width:65px;display:inline;">
                        <option v-bind:value="n" v-for="n in 60">{{timeConverter(n-1)}}</option>
                      </select>
                      <span class="margin_2">分</span>
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">メンバー</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control" v-model="item.memberId">
                      <option v-bind:value="opt.value" v-for="opt in member_id_options">{{opt.name}}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">シフト</label>
                  </div>
                  <div class="form_box_group_field">
                    <select class="form-control" v-model="item.workShift">
                      <option v-bind:value="opt.value" v-for="opt in shift_id_options">{{opt.name}}</option>
                    </select>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">登録日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{df(item.createdAt)}}
                    </div>
                  </div>
                </div>

                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">更新日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">
                      {{df(this.updatedAt)}}
                    </div>
                  </div>
                </div>
              </div>
              <!-- /.box-body -->
              <div v-if="itemInfo" class="callout callout-success"><p>{{itemInfo}}</p></div>
              <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" v-if="deletePermission()" class="btn btn-danger global_btn form_button_flex_item margin_right_auto" @click="onDeleteFunc()">削除</button>
                <button type="button" class="btn btn-default global_btn form_button_flex_item" @click="onTransitionButton('/attendance/' + $route.params.operation_id + '/details/' + item.id)">キャンセル</button>
                <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onUpdateButton">保存</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
        <!-- /.box -->
      </div>
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert" @onconfirm="deleteFunc"></modal-alert-view>
      </template>
      <!-- /.box-group -->
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import ListView from '~/components/ListView'
  import Loading from 'vue-loading-overlay';
  import ModalAlertView from '~/components/ModalAlertView'
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        api: '/attendances',
        error: '',
        fullpage: true,
        member_id_options: [
        ],
        shift_id_options: this.getWorkShiftList(false),
        param: {
          columns: [
            { name: '出勤時間', column: 'attendedAt'},
            { name: '退勤時間', column: 'leftAt'},
            { name: 'メンバー', column: 'memberId' },
            { name: 'シフト', column: 'workShift' },
          ]
        },
        alert: {
          title: 'test',
        },
        updatedAt: '',
        item: {
          id: '',
          workShift:'',
          memberId:'',
          date: '',
          hh:'',
          mm:'',
          leftDate:'',
          lefthh:'',
          leftmm:'',
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
      ListView,
      ModalAlertView,
      Loading
    },
    methods: {
      deletePermission(){
        const key = (this.$route.params.operation_id == 1) ? "Security:Attendance:delete" : "Cleaning:Attendance:delete";
        return this.checkMenuPermission(key);
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
        let api_for_list = '/buildings/'+buildingId+'/members';
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
      getAttendanceInfoRequest() {
        this.onRead(this.api, '', data => {
          this.item = data;
          this.updatedAt = this.item.updatedAt;
          var attendedAt = new Date(this.item.attendedAt);
          this.item.date = attendedAt;
          // NOTE:timeConverter関数n-1の影響で+1してから渡す
          this.item.hh = attendedAt.getHours() + 1;
          this.item.mm = attendedAt.getMinutes() + 1;
          if (this.item.leftAt != null){
            var leftAt = new Date(this.item.leftAt);
            this.item.leftDate = leftAt;
            this.item.lefthh = leftAt.getHours() + 1;
            this.item.leftmm = leftAt.getMinutes() + 1;
          }
        });
      },
      setTitle() {
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        this.param.title = "勤務スタッフ";
        this.param.operation = target.operation_name;
      },
      deleteFunc() {
        this.onDelete(this.api, '/attendance/' + this.$route.params.operation_id);
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
      const key = (this.$route.params.operation_id == 1) ? "Security:Attendance:update" : "Cleaning:Attendance:update";
      this.checkDisplayPermission(key,() => {
        this.getMembersRequest();
        this.setTitle();
      });
    }
  }

</script>
