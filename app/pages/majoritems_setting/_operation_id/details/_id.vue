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
                <li class="current" v-if="isHeadquartersMode">{{param.title}}詳細</li>
                <li class="current" v-else>{{param.title}}情報</li>
              </ol>
            </div>
            <h1 class="ts_content_heading" v-if="isHeadquartersMode">{{param.title}}詳細</h1>
            <h1 class="ts_content_heading" v-else>{{param.title}}情報</h1>
          </section>
          <div class="button_header_btn">
            <button type="button" class="btn btn-info global_btn" @click="onTransitionButton('/majoritems_setting/' + $route.params.operation_id + '/edit/' + displayItem.id)">編集</button>
          </div>
        </div>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1 v-if="isHeadquartersMode">
        {{param.title}}詳細
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-info width_140" @click="onTransitionButton('/majoritems_setting/' + $route.params.operation_id + '/edit/' + displayItem.id)">編 集</button>
        </div>
      </h1>
      <h1 v-if="!isHeadquartersMode">
        {{param.title}}情報
        <small></small>
        <div class="pull-right">
          <button type="button" class="btn btn-info width_140" @click="onTransitionButton('/majoritems_setting/' + $route.params.operation_id + '/edit/' + displayItem.id)">編 集</button>
        </div>
      </h1>
    </section> -->

    <!-- Main content -->
    <section class="content">
      <div class="box-group">
        <div class="box">
          <div class="box-header with-border box_head">
            <h2 class="box-title with-border">詳細情報</h2>
          </div>
          <!-- /.box-header -->
          <div class="box-body">
            <form class="form-horizontal" style="margin:0;">
              <div class="box-body">
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">ID</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{displayItem.id}}</div>
                  </div>
                </div>
                <div class="form-group form_box_group" v-if="isHeadquartersMode">
                  <div class="form_box_group_title">
                    <label class="control-label">ビル</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{this.buildingName}}</div>
                  </div>
                </div>
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">登録日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{df(displayItem.createdAt)}}</div>
                  </div>
                  <!-- <div class="col-sm-8 item-text">{{df("2021/02/12")}}</div> -->
                </div>
                <div class="form-group form_box_group">
                  <div class="form_box_group_title">
                    <label class="control-label">更新日時</label>
                  </div>
                  <div class="form_box_group_field">
                    <div class="item-text">{{df(this.tmpUpdatedAt)}}</div>
                  </div>
                  <!-- <div class="col-sm-8 item-text">{{df("2021/02/12")}}</div> -->
                </div>
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
                              {{week}}
                            </td>
                            <!-- <td class="width_15"></td> -->
                          </tr>
                          <tr v-for="(floor, floorCnt) of floors">
                            <td class="auto_config_floor font_weight_normal" v-if="floor.floor_type!=3">{{floor.name}}F</td>
                            <td class="auto_config_floor font_weight_normal" v-if="floor.floor_type==3">{{floor.name}}</td>
                            <td v-for="(n, weekCnt) of 8" class="text_align_center">
                              <label class="control control_checkbox auto_config_checkbox">
                                <!-- <input type="checkbox" v-bind:id="'floors_checkbox_'+majorItem.id+'_'+floor.id+'_'+n" :name="'checkbox_'+majorItem.id" @change="getDisplayState(targetCnt, reportObjectCnt)" v-model="item[targetCnt].data[reportObjectCnt].floor[floorCnt].status[weekCnt].isCheck"> -->
                                <input type="checkbox" v-bind:id="'floors_checkbox_'+majorItem.id+'_'+floor.id+'_'+n" :name="'checkbox_'+majorItem.id" @change="getDisplayState(targetCnt, reportObjectCnt)" v-model="item[targetCnt].data[reportObjectCnt].day[weekCnt].status[floorCnt].isCheck" disabled>
                                <div class="control_indicator margin_0"></div>
                              </label>
                            </td>
                          </tr>
                        </table>
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
              <!-- <div class="box-footer">
                <button type="button" class="btn btn-default pull-right" onclick="window.history.back()">戻る</button>
              </div> -->
              <div class="box-footer form_button_flex flex_center border_top" v-if="isHeadquartersMode">
                <button type="button" class="btn btn-default global_btn form_button_flex_item"  @click="onTransitionButton('/majoritems_setting/' + $route.params.operation_id)">戻る</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
          <!-- /.box-body -->
        </div>
      <!-- /.box -->
      </div>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
  import MonthlyReportView from '~/components/MonthlyReportView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    data() {
      return {
        tmpUpdatedAt: "",
        buildingName: "",
        targetMajorItems:[],
        isDown: [],
        isSetting: [],
        item: [],
        displayItem: [],
        floors: [],
        itemInfo: '',
        fullpage: true,
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
        targetCagetoryIds: [5, 6],
        weekdays: ['日', '月', '火', '水', '木', '金', '土', '祝'],
        error: '',
        param: {
          title: '',
          include: [{relation: 'autoCreationScheduleReportObjects'}],
        }
      }
    },
    components: {
      MonthlyReportView,
      Loading
    },
    methods: {
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
      getMajorItems() {
        var reportList = JSON.parse(localStorage.getItem('report_list'));
        for (var i = 0; i < reportList.length; i++) {
          if (reportList[i].id == this.$route.params.id) {
            this.targetMajorItems.push(reportList[i].majoritems[0]);
            this.targetMajorItems.push(reportList[i].majoritems[1]);
          }
        }
        this.setCheckStatus();
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
      getFloorsInfo(data) {
        this.onSearch('/buildings/' + parseInt(this.displayItem.buildingId), null, null, (val) => {
          this.floors = this.displayFloorFormat(val.floors, null, false);
          this.setBuildingName('/buildings', data);
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
        const operationCategories = JSON.parse(localStorage.getItem('operation_categories'));
        const currentCategory = operationCategories.find(val => val.id == parseInt(this.$route.params.operation_id));

        var target = reportList.find((report) => {
          return (report.operation_type_id == currentCategory.operationTypeId);
        });
        this.param.title = "業務 自動設定";
        this.param.operation = target.operation_name;
      },
      setMajorItems(majorItems, report) {
        var target = [];
        var that = this;

        majorItems.operationCategoryContents.forEach(function(categoryContent) {
          if (categoryContent.reportObjectGroupDefinition.autoCreate) {
            that.targetMajorItems.push({id: categoryContent.reportObjectGroupDefinitionId, name: categoryContent.reportObjectGroupDefinition.name, reportObjectDefinitions: categoryContent.reportObjectGroupDefinition.reportObjectDefinitions});
          }
        });
        // report.majoritems.forEach(function(category) {
        //   var item = majorItems.operations.filter(function(value) {
        //     if (value.reportObjectDefinition != undefined && value.useAsReport == true) {
        //       return value.reportObjectDefinition.reportObjectGroupDefinitionId == category.id
        //     }
        //   });
        //   if (item.length != 0) {
        //     if (that.targetCagetoryIds.includes(category.id)) {
        //       item.sort(function(a,b){
        //         if(a.reportObjectDefinition.sort < b.reportObjectDefinition.sort) return -1;
        //         if(a.reportObjectDefinition.sort > b.reportObjectDefinition.sort) return 1;
        //         return 0;
        //       });
        //       that.targetMajorItems.push({id: category.id, name: category.name, reportObjectDefinitions: item})
        //     }
        //   }
        // });
        this.setCheckStatus();
      },
      getReportObjectCnt(reportObjectDefinitionId) {
        for (var i = 0; i < this.targetMajorItems.length; i++) {
          for (var j = 0; j < this.targetMajorItems[i].reportObjectDefinitions.length; j++) {
            if (this.targetMajorItems[i].reportObjectDefinitions[j].id == reportObjectDefinitionId) {
              return j;
            }
          }
        }
      },
      getTargetCnt(reportObjectDefinitionId) {
        for (var i = 0; i < this.targetMajorItems.length; i++) {
          var category = this.targetMajorItems[i].reportObjectDefinitions.find(function(obj) {
            return (obj.id == reportObjectDefinitionId);
          });
          if (category != undefined) {
            return i;
          }
        }
      },
      getReportObjectDefinition(item) {
        return {
          id: item.id,
          name: item.name,
          operationCategoryId: item.operationCategoryId,
          sort: item.sort,
          path: '/majoritems/' + item.id
        }
      },
      getMajorItemsGroup(items) {
        var operationCategories = [];
        var that = this;
        items.reportObjectDefinitions.forEach(function(item) {
          var find = operationCategories.find(operation => operation.id == item.reportObjectGroupDefinitionId);
          if (find == undefined){
            operationCategories.push({id: item.reportObjectGroupDefinitionId, name: item.reportObjectGroupDefinition.name, reportObjectDefinitions: [that.getReportObjectDefinition(item)]});
          } else {
            find.reportObjectDefinitions.push(that.getReportObjectDefinition(item));
          }
        });
        return operationCategories;
      },
      setReportList(majorItems, operationId, read, report) {
        //console.log(majorItems)
        var that = this;
        var parameter = { where: {buildingId: this.displayItem.buildingId} ,include: [{relation: 'operationCategoryContents',scope:{include:[{relation: 'reportObjectGroupDefinition',scope:{include:[{relation: 'reportObjectDefinitions'}]}}]}}] };
        this.onSearch('/companies/'+localStorage.getItem("company_id")+'/operation-categories', parameter, null, function(val) {
          var find = val.find(operation => operation.id == majorItems.operationCategoryId);
          report.majoritems = that.getMajorItemsGroup(find);
          that.setMajorItems(majorItems, report);
          that.setReadSettingData(read.autoCreationScheduleReportObjects);
        });
      },
      /**
       * 共通UI表示項目の作成
       */
      getBuildingsMajorItemsRequest(api, read) {
        var parameter = { where: {buildingId: this.displayItem.buildingId} ,include: [{relation: 'operationCategoryContents',scope:{include:[{relation: 'reportObjectGroupDefinition',scope:{include:[{relation: 'reportObjectDefinitions'}]}}]}}] };
        this.onSearch(api, parameter, null, (val) => {
          var that = this;
          var majorItems = [];
          val.forEach(function(ob) {
            if (ob.id == this.displayItem.operationCategoryId) {
              majorItems = ob;
            }
          }.bind(this));

          var reportList = JSON.parse(localStorage.getItem('report_list'));
          var report = reportList.find(function(report) {
            return (report.id == that.$route.params.operation_id)
          });

          if (this.isHeadquartersMode) {
            this.setMajorItems(majorItems, report);
            this.setReadSettingData(read.autoCreationScheduleReportObjects);
          } else {
            this.setMajorItems(majorItems, report);
            this.setReadSettingData(read.autoCreationScheduleReportObjects);
          }
        });
      },
      setReadSettingData(settingData) {
        if (settingData==null){
          return;
        }
        var that = this;
        settingData.forEach(function(setting) {
          var targetCnt = that.getTargetCnt(setting.reportObjectDefinitionId);
          var reportObjectCnt = that.getReportObjectCnt(setting.reportObjectDefinitionId);
          // for (var i = 0; i < setting.schedule.days)
          setting.schedule.days.forEach(function(day){
            for (var i = 0; i < day.floorIds.length; i++) {
              var check = that.item[targetCnt].data[reportObjectCnt].day[day.dayType].status.find(function(val){
                return (val.floorId == day.floorIds[i])
              });
              if (check != undefined) {
                check.isCheck = true;
              }
            }
          });
          that.getDisplayState(targetCnt, reportObjectCnt);
        });
      },
      setBuildingName(api, read){
        this.onSearch(api, null, null, val => {
          var building = val.find(function(data){
            return (data.id == read.buildingId)
          });
          this.buildingName = 'ID ' + building.id + ' : ' + building.name;;
          this.getBuildingsMajorItemsRequest('/companies/'+localStorage.getItem("company_id")+'/operation-categories', read);
        })
      },
      getMajorItemsSettingDataRequest(api) {
        var parameter = { include: this.param.include };
        this.onRead(api, parameter, data => {
          this.displayItem = data;
          this.tmpUpdatedAt = data.updatedAt;
          // this.setBuildingName('/buildings', data);
          this.getFloorsInfo(data);
        });
      },
      getRequestData() {
        var request = {"buildingId": this.displayItem.buildingId, "operationCategoryId": parseInt(this.$route.params.operation_id), "autoCreationScheduleReportObject": []};
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
            request.autoCreationScheduleReportObject.push({"reportObjectDefinitionId": data.majorItemsId, "schedule": {"days": days}});
          });
        });
        return request;
      },
      onUpdateButtonClick() {
        var request = this.getRequestData();
        this.req("/autocreation-schedule-operation-category/" + parseInt(this.$route.params.id), 'patch', request, (err, res) => {;
          if (err) {
            const errorColm = {};
            for(const key in this.param.columns){
              errorColm[this.param.columns[key].column] = this.param.columns[key].name;
            }
            this.error = this.getErrorMsg2(res, this.param.columns);
            //this.error = this.getErrorMsg(res && res.body && res.body.error, errorColm, this.param.errorCode);
          } else if (res.body) {
            this.error = "";
            this.itemInfo = "更新完了";
            setTimeout(() => this.itemInfo = '', 3000);
            this.tmpUpdatedAt = res.body.updatedAt;
          }
        });
      }
    },
    created() {
      const key = (this.$route.params.operation_id == 1) ? "Security:AutocreationScheduleOperationCategory:view" : "Cleaning:AutocreationScheduleOperationCategory:view";
      this.checkDisplayPermission(key,() => {
        this.setTitle();
        this.getMajorItemsSettingDataRequest("/autocreation-schedule-operation-category");
      });

    },
    watch: {
      $route: function(route) {
        const key = (this.$route.params.operation_id == 1) ? "Security:AutocreationScheduleOperationCategory:view" : "Cleaning:AutocreationScheduleOperationCategory:view";
        this.checkDisplayPermission(key,() => {
          this.targetMajorItems = [];
          this.itemInfo = "";
          this.setTitle();
          this.getMajorItemsSettingDataRequest("/autocreation-schedule-operation-category");
        });
      }
    }
  };
</script>

<style lang="stylus" scoped>

</style>
