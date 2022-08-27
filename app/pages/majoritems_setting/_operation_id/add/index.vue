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
                <li class="current">{{param.title}}登録</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}登録</h1>
          </section>
        </div>
      </div>
    </section>
    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <div class="box-header with-border box_head">
            <h2 class="box-title with-border">{{param.title}}情報</h2>
          </div>
          <!-- /.box-header -->
          <div class="box-body">
            <form class="form-horizontal" style="margin:0;">
              <div class="box-body">
                <div class="form-group form_box_group required">
                  <div class="form_box_group_title">
                    <label class="control-label">ビル</label>
                  </div>
                  
                  <div class="form_box_group_field">
                    <select class="form-control" v-model="targetBuilding" @change="updateSelect">
                      <option v-bind:value="buil.value" v-for="buil of this.buildingList">{{buil.name}}</option>
                    </select>
                  </div>
                </div>
                <div class="text_center margin_top_20">
                  <button type="button" class="btn btn-primary global_btn" @click="onReadMajorItems">読込</button>
                </div>
                <!-- <div class="no-margin pull-right">
                  <button type="button" class="btn btn-primary" @click="onReadMajorItems">大項目読み込み</button>
                </div> -->
              </div>
              <div class="box-body" v-for="(target, targetCnt) of targetMajorItems">
                <div class="border_bottom padding_bottom_20 margin_bottom_30">
                  <h3 class="box-title font_18">{{target.name}}</h3>
                </div>


                <div class="form-group form_box_group margin_top_0 margin_bottom_10" v-for="(majorItem, reportObjectCnt) of target.reportObjectDefinitions">
                  <div class="form_box_group_title display_flex display_flex_aligncenter height_30">
                    <label class="control-label">{{majorItem.name}}</label>
                  </div>
                  <div class="form_box_group_field">
                    <button type="button" class="btn btn_border btn_white btn_shadow select_button width_80 font_12" @click="onOpenAutoSetting(targetCnt, reportObjectCnt)">詳細<span class="fa pull-right" v-bind:class="isDown[targetCnt][reportObjectCnt]?'fa-chevron-up':'fa-chevron-down'" style="margin-top: 2px;"></span></button>
                    <span class="item-text margin_left_5 font_12 color_red" v-if="!isSetting[targetCnt][reportObjectCnt]">未設定</span>
                    <span class="item-text margin_left_5 font_12 color_green" v-if="isSetting[targetCnt][reportObjectCnt]">設定中</span>
                    
                    <!-- <div v-bind:class="{auto_config_hide: !isDown[targetCnt][reportObjectCnt]}"> -->
                    <div v-if="isDown[targetCnt][reportObjectCnt]">
                      <div class="margin_top_10">
                        <table class="table check_table max_width_560">
                          <tr>
                            <td></td>
                            <td class="auto_config_week" v-for="(week, weekCnt) in weekdays">
                              <div class="input-group-btn">
                                <button type="button" class="btn btn_white dropdown-toggle" data-toggle="dropdown" aria-expanded="false">{{week}}</button>
                                <ul class="dropdown-menu">
                                  <li>
                                    <a @click="onAutoWeekSetting(targetCnt, reportObjectCnt, weekCnt, true)">すべてチェック</a>
                                  </li>
                                  <li>
                                    <a @click="onAutoWeekSetting(targetCnt, reportObjectCnt, weekCnt, false)">すべてクリア</a>
                                  </li>
                                </ul>
                              </div>
                            </td>
                            <!-- <td class="width_15"></td> -->
                          </tr>
                          <tr v-for="(floor, floorCnt) of floors">
                            <td class="auto_config_floor font_weight_normal" v-if="floor.floor_type!=3">{{floor.name}}F</td>
                            <td class="auto_config_floor font_weight_normal" v-if="floor.floor_type==3">{{floor.name}}</td>
                            <td v-for="(n, weekCnt) of 8" class="text_align_center">
                              <label class="control control_checkbox auto_config_checkbox">
                                <!-- <input type="checkbox" v-bind:id="'floors_checkbox_'+majorItem.id+'_'+floor.id+'_'+n" :name="'checkbox_'+majorItem.id" @change="getDisplayState(targetCnt, reportObjectCnt)" v-model="item[targetCnt].data[reportObjectCnt].floor[floorCnt].status[weekCnt].isCheck"> -->
                                <input type="checkbox" v-bind:id="'floors_checkbox_'+majorItem.id+'_'+floor.id+'_'+n" :name="'checkbox_'+majorItem.id" @change="getDisplayState(targetCnt, reportObjectCnt)" v-model="item[targetCnt].data[reportObjectCnt].day[weekCnt].status[floorCnt].isCheck">
                                <div class="control_indicator margin_0"></div>
                              </label>
                            </td>
                          </tr>
                          <tfoot>
                            <tr>
                              <td colspan="9">
                                <div class="display_flex display_flex_spacebetween padding_left_30 padding_right_30 padding_top_5 padding_bottom_5">
                                  <button type="button" class="btn btn_white btn_border btn_shadow font_12 margin_right_5 max_width_230 width_max" @click="onAutoSettingAllSetting(targetCnt, reportObjectCnt, true)">すべてチェック</button>
                                  <button type="button" class="btn btn_white btn_border btn_shadow font_12 margin_right_5 max_width_230 width_max" @click="onAutoSettingAllSetting(targetCnt, reportObjectCnt, false)">すべてクリア</button>
                                </div>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                        <!-- <div class="auto_config_btn">
                          <button type="button" class="btn btn-default" @click="onAutoSettingAllSetting(targetCnt, reportObjectCnt, true)">すべてチェック</button>
                          <button type="button" class="btn btn-default" @click="onAutoSettingAllSetting(targetCnt, reportObjectCnt, false)">すべてクリア</button>
                        </div>  -->
                      </div>
                    <!-- <div class="auto_config"> -->
                    </div>
                  </div>  
                </div>
              </div>
              <!-- /.box-body -->
              <div v-if="itemInfo" class="callout callout-success">
                <p>{{itemInfo}}</p>
              </div>
              <div v-if="error" class="callout callout-danger err-info">
                <p>{{error}}</p>
              </div>
              <div class="box-footer form_button_flex flex_right border_top">
                <button type="button" class="btn btn-default global_btn form_button_flex_item" onclick="window.history.back()">キャンセル</button>
                <button type="button" class="btn btn-warning global_btn form_button_flex_item" @click="onAddButtonClick">登録</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
      <!-- /.box -->
      </div>
      <template>
        <modal-alert-view　ref="alert" :id="'modal_alert'" :param="alert"></modal-alert-view>
      </template>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import MonthlyReportView from '~/components/MonthlyReportView'
  import ModalAlertView from '~/components/ModalAlertView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  
  export default {
    data() {
      return {
        buildingList: [],
        targetMajorItems:[],
        isDown: [],
        isSetting: [],
        targetBuilding: '',
        onReadMajorItemsFlag: false,
        item: [],
        buildingOperationReports: [],
        floors: [],
        itemInfo: '',
        fullpage: true,
        currentCategoryId: null,
        targetCagetoryIds: [5, 6],
        weekdays: ['日', '月', '火', '水', '木', '金', '土', '祝'],
        alert: {
          title: 'test',
          message: '',
          note: '',
          isConfirm: false,
        },
        error: '',
        param: {
          title: '',
          success: '/majoritems_setting/' + parseInt(this.$route.params.operation_id),
        }
      }
    },
    components: {
      MonthlyReportView,
      ModalAlertView,
      Loading
    },
    methods: {
      updateSelect() {
        this.error = '';
        this.onReadMajorItemsFlag = false;
      },
      onOpenAutoSetting(majorItemsCnt, reportObjectCnt) {
        this.$set(this.isDown[majorItemsCnt], reportObjectCnt, !this.isDown[majorItemsCnt][reportObjectCnt]);
      },
      onAutoSettingAllSetting(majorItemsCnt, reportObjectCnt, state) {
        // for (var i = 0; i < document.getElementsByName("checkbox_"+majorItemId).length; i++) {
        //   document.getElementsByName("checkbox_"+majorItemId)[i].checked = state;
        // }
        // this.onChangeCheck(majorItemId, index);
        for (var i = 0; i < this.item[majorItemsCnt].data[reportObjectCnt].day.length; i++) {
          for (var j = 0; j < this.item[majorItemsCnt].data[reportObjectCnt].day[i].status.length; j++) {
            this.item[majorItemsCnt].data[reportObjectCnt].day[i].status[j].isCheck = state;
          }
        }
        this.getDisplayState(majorItemsCnt, reportObjectCnt);
      },
      setItemStatus(majorItemId, floorId) {
        //console.log(this.item[index].status);
       //  this.$set(this.item[count].status, l, {"floorId": this.floors[k].id, "weekId": l, "isCheck": false});
       for (var i = 0; i < this.item.length; i++) {
         if (this.item[i].majorItemId == majorItemId) {
           for (var j = 0; j < this.item[i].status.length; j++) {
             this.$set(this.item[i].status[j], "isCheck", checked);
           }
         }
       }
      },
      getDisplayState(majorItemsCnt, reportObjectCnt) {
        for (var i = 0; i < this.item[majorItemsCnt].data[reportObjectCnt].day.length; i++) {
          for (var j = 0; j < this.item[majorItemsCnt].data[reportObjectCnt].day[i].status.length; j++) {
            if (this.item[majorItemsCnt].data[reportObjectCnt].day[i].status[j].isCheck) {
              this.$set(this.isSetting[majorItemsCnt], reportObjectCnt, true);
              return;
            }
          }
        }
        this.$set(this.isSetting[majorItemsCnt], reportObjectCnt, false);
      },
      setCheckStatus() {
        for (var i = 0; i < this.targetMajorItems.length; i++) {
          this.$set(this.item, i, { "categoryId": this.targetMajorItems[i].id, "data": []});
          this.$set(this.isSetting, i, []);
          this.$set(this.isDown, i, []);
          //this.isSetting.push([])
          for (var j = 0; j < this.targetMajorItems[i].reportObjectDefinitions.length; j++) {
            this.item[i].data.push({"majorItemsId": this.targetMajorItems[i].reportObjectDefinitions[j].id, "day":[] });
            this.$set(this.isSetting[i], j, false);
            this.$set(this.isDown[i], i, false);
            for (var k = 0; k < 8; k++) {
              this.item[i].data[j].day.push({"dayType": k, "status":[]});
              for (var l = 0; l < this.floors.length; l++) {
                this.item[i].data[j].day[k].status.push({"floorId": this.floors[l].id, "dayType": k, "isCheck": false});
              }
            }
          }
        }
      },
      getFloorsInfo() {
        this.onSearch('/buildings/' + this.targetBuilding, null, null, (val) => {
          this.floors = this.displayFloorFormat(val.floors, null, false);

          const operationCategories = JSON.parse(localStorage.getItem('operation_categories'));
          const currentCategory = operationCategories.find(val => val.id == parseInt(this.$route.params.operation_id));
          const find = val.operationCategory.find((category) => {
            return (category.operationTypeId == currentCategory.operationTypeId);
          });

          if (find){
            this.currentCategoryId = find.id;
            this.getBuildingsMajorItemsRequest('/companies/'+localStorage.getItem("company_id")+'/operation-categories');
          }else{
            this.error = "対象のビルには登録可能な業務が設定されていません。";
          }
          // this.getMajorItems();
          // this.checkStateInit();
        })
      },
      onAutoWeekSetting(majorItemsCnt, reportObjectCnt, week, state) {
        this.item[majorItemsCnt].data[reportObjectCnt].day[week].status.forEach(function(data){
          data.isCheck = state;
        });
        this.getDisplayState(majorItemsCnt, reportObjectCnt);
      },
      getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      },
      setTitle() {
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        var target = reportList.find((report) => {
          return (report.id == this.$route.params.operation_id);
        });
        this.param.title = "業務 自動設定";
        this.param.operation = target.operation_name;
      },
      getBuildingsList(api){
        var buildings = JSON.parse(localStorage.getItem('building_list'));
        var where = {"operationCategoryId": parseInt(this.$route.params.operation_id)};
        var that = this;
        this.onSearch(api, null, where, val => {
          const list = [{name: '', value: ''}];
          val.forEach(function(obj){
            var value = buildings.find(val => val.id == obj.id);
            if (value != undefined) {
              list.push({ name: obj.name, value: obj.id});
            }
          });
          that.buildingList = list;
        })
      },
      setMajorItems(majorItems, report) {
        var that = this;
        majorItems.operationCategoryContents.forEach(function(categoryContent) {
          if (categoryContent.reportObjectGroupDefinition.autoCreate) {
            that.targetMajorItems.push({id: categoryContent.reportObjectGroupDefinitionId, name: categoryContent.reportObjectGroupDefinition.name, reportObjectDefinitions: categoryContent.reportObjectGroupDefinition.reportObjectDefinitions});
          }
        });
          this.setCheckStatus();
      },
      /**
       * 共通UI表示項目の作成
       */
      getBuildingsMajorItemsRequest(api) {
        var parameter = { where: {buildingId: this.targetBuilding} ,include: [{relation: 'operationCategoryContents',scope:{include:[{relation: 'reportObjectGroupDefinition',scope:{include:[{relation: 'reportObjectDefinitions'}]}}]}}] };
        this.onSearch(api, parameter, null, (val) => {
          var that = this;
          var majorItems = [];
          const operationCategories = JSON.parse(localStorage.getItem('operation_categories'));
          const currentCategory = operationCategories.find(val => val.id == parseInt(this.$route.params.operation_id));
          val.forEach(function(ob) {
            if (ob.operationTypeId == currentCategory.operationTypeId) {
              majorItems = ob;
            }
          }.bind(this));


          // majorItems.operationCategoryContents.forEach(function(categoryContent) {
          //   if (categoryContent.reportObjectGroupDefinition.autoCreate) {
          //     that.targetMajorItems.push({id: categoryContent.reportObjectGroupDefinitionId, name: categoryContent.reportObjectGroupDefinition.name, reportObjectDefinitions: categoryContent.reportObjectGroupDefinition.reportObjectDefinitions});
          //   }
          // });

          var reportList = JSON.parse(localStorage.getItem('report_list'));
          var report = reportList.find(function(report) {
            return (report.id == that.$route.params.operation_id) 
          });
          this.setMajorItems(majorItems, report);
        });
      },
      onReadMajorItems() {
        if (this.targetBuilding == "") {
          this.alert.title = '';
          this.alert.message = 'ビルを選択してから再度実行してください。';
          this.alert.note = '';
          this.alert.isConfirm = false;
          $('#modal_alert').modal('show')
          // alert("ビルを選択してから再度実行してください")
          return;
        }
        this.getFloorsInfo();
        this.onReadMajorItemsFlag = true;  
      },
      getRequestData() {

        var request = {"buildingId": this.targetBuilding, "operationCategoryId": this.currentCategoryId, "autoCreationScheduleReportObject": []};
        this.item.forEach(function(category){
          category.data.forEach(function(data){
            var days = [];
            data.day.forEach(function(day) {
              var floorIds = [];
              day.status.forEach(function(status){
                if (status.isCheck) {
                  floorIds.push(status.floorId);
                }
              });
              if (floorIds.length != 0) {
                days.push({"dayType": day.dayType, "floorIds": floorIds});
              }
            });
            // if (days.length != 0) {
            //   request.autoCreationScheduleReportObject.push({"reportObjectDefinitionId": data.majorItemsId, "schedule": {"days": days}});
            // }
            request.autoCreationScheduleReportObject.push({"reportObjectDefinitionId": data.majorItemsId, "schedule": {"days": days}});
          });
        });
        return request;
      },
      onAddButtonClick() {
        this.error = '';
        if (!this.onReadMajorItemsFlag) {
          this.alert.title = '';
          this.alert.message = '業務 自動設定が設定されていません。';
          this.alert.note = '';
          this.alert.isConfirm = false;
          $('#modal_alert').modal('show')
          // alert("業務 自動設定が設定されていません")
          return;
        }
        var request = this.getRequestData();

        this.req("/autocreation-schedule-operation-category", 'post', request, (err, res) => {;
          if (err) {
            const errorColm = {};
            for(const key in this.param.columns){
              errorColm[this.param.columns[key].column] = this.param.columns[key].name;
            }
            this.error = this.getErrorMsg2(res, this.param.columns);
            //this.error = this.getErrorMsg(res && res.body && res.body.error, errorColm, this.param.errorCode);
          } else if (res.body) {
            this.$router.push(this.param.success);
          }
        });
      }
    },
    created() {
      const key = (this.$route.params.operation_id == 1) ? "Security:AutocreationScheduleOperationCategory:create" : "Cleaning:AutocreationScheduleOperationCategory:create";
      this.checkDisplayPermission(key,() => {
        this.setTitle();
        this.getBuildingsList('/buildings');
      });
      // this.getFloorsInfo();
    },
    watch: {
      targetBuilding: {
        handler(val) {
          this.targetMajorItems = [];
        },
        deep: true,
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>