<template>
<!-- modal -->
  <div class="modal fade">
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <div class="ts_content_wrapper ts_index">
      <section class="ts_index_information ts_information">
        <div class="ts_index_wrap">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
            <h4 class="modal-title">ニュース</h4>
          </div>
          <div class="ts_information_wrap" v-if="!isDetail">
            <div class="tabs">
              <input id="tab_all" type="radio" name="tab_item" checked>
              <label class="tab_item" for="tab_all" @click="getInformationInfo(0)"><span>すべて</span></label>
              <input id="tab_update" type="radio" name="tab_item">
              <label class="tab_item" for="tab_update" @click="getInformationInfo(1)"><span>更新情報</span></label>
              <input id="tab_maintenance" type="radio" name="tab_item">
              <label class="tab_item" for="tab_maintenance" @click="getInformationInfo(2)"><span>メンテナンス</span></label>
              <input id="tab_important" type="radio" name="tab_item">
              <label class="tab_item" for="tab_important" @click="getInformationInfo(3)"><span>重要</span></label>
              <input id="tab_bug" type="radio" name="tab_item">
              <label class="tab_item" for="tab_bug" @click="getInformationInfo(4)"><span>不具合情報</span></label>

              <!-- すべて -->
              <div class="tab_content" id="tab_all_content">
                <ul class="ts_information_list" v-for="info in informationInfo">
                  <li class="cursor_pointer" @click="onDetail(info.id)">
                    <p class="ts_information_date">{{df4(info.displayFrom)}}</p>
                    <span class="ts_information_label info_label" v-bind:class="info.category==1?'ts_information_label_01':info.category==2?'ts_information_label_03':info.category==3?'ts_information_label_02':info.category==4?'ts_information_label_04':''">{{getInfoCategory(info.category)}}</span>
                    <p class="ts_information_description">{{info.title}}</p>
                  </li>
                </ul>
                <ul class="ts_information_list" role="row" v-if="informationInfo.length==0">
                  <li>
                    <span>表示するお知らせは有りません</span>
                  </li>
                </ul>
              </div>
              <div class="tab_content" id="tab_update_content">
                <ul class="ts_information_list" v-for="info in informationInfo">
                  <li class="cursor_pointer" @click="onDetail(info.id)">
                    <p class="ts_information_date">{{df4(info.displayFrom)}}</p>
                    <span class="ts_information_label info_label ts_information_label_01">{{getInfoCategory(info.category)}}</span>
                    <p class="ts_information_description">{{info.title}}</p>
                  </li>
                </ul>
                <ul class="ts_information_list" role="row" v-if="informationInfo.length==0">
                  <li>
                    <span>表示するお知らせは有りません</span>
                  </li>
                </ul>
              </div>
              <div class="tab_content" id="tab_maintenance_content">
                <ul class="ts_information_list" v-for="info in informationInfo">
                  <li class="cursor_pointer" @click="onDetail(info.id)">
                    <p class="ts_information_date">{{df4(info.displayFrom)}}</p>
                    <span class="ts_information_label info_label ts_information_label_03">{{getInfoCategory(info.category)}}</span>
                    <p class="ts_information_description">{{info.title}}</p>
                  </li>
                </ul>
                <ul class="ts_information_list" role="row" v-if="informationInfo.length==0">
                  <li>
                    <span>表示するお知らせは有りません</span>
                  </li>
                </ul>
              </div>
              <div class="tab_content" id="tab_important_content">
                <ul class="ts_information_list" v-for="info in informationInfo">
                  <li class="cursor_pointer" @click="onDetail(info.id)">
                    <p class="ts_information_date">{{df4(info.displayFrom)}}</p>
                    <span class="ts_information_label info_label ts_information_label_02">{{getInfoCategory(info.category)}}</span>
                    <p class="ts_information_description">{{info.title}}</p>
                  </li>
                </ul>
                <ul class="ts_information_list" role="row" v-if="informationInfo.length==0">
                  <li>
                    <span>表示するお知らせは有りません</span>
                  </li>
                </ul>
              </div>
              <div class="tab_content" id="tab_bug_content">
                <ul class="ts_information_list" v-for="info in informationInfo">
                  <li class="cursor_pointer" @click="onDetail(info.id)">
                    <p class="ts_information_date">{{df4(info.displayFrom)}}</p>
                    <span class="ts_information_label info_label ts_information_label_04">{{getInfoCategory(info.category)}}</span>
                    <p class="ts_information_description">{{info.title}}</p>
                  </li>
                </ul>
                <ul class="ts_information_list" role="row" v-if="informationInfo.length==0">
                  <li>
                    <span>表示するお知らせは有りません</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer" style="text-align: center" v-if="!isDetail">
            <button type="button" class="btn btn-info global_btn" data-dismiss="modal">OK</button>
          </div>
        </div>

        <div style="background: white;" v-if="isDetail">
          <div class="box-header with-border information_bar">
            <p class="information_id font_18">ID:{{item.id}}</p>
            <p class="information_category font_18">{{getCategoryName(item.category)}}</p>
            <p class="information_date font_18">{{df3(item.updatedAtForDisplay)}}</p>
          </div>
          <!-- /.box-header -->
          <div class="box-body no-paddin">
            <form class="form-horizontal" autocomplete="off">
              <div class="box-body">
                <label class="font_20">{{item.title}}</label>
                <div>
                  <span class="font_18" v-html="getColumData(item.body)"></span>
                </div>
              </div>
              <!-- /.box-body -->
              <div class="modal-footer" style="text-align: center">
                <button type="button" class="btn btn-default global_btn" @click="onBack()" v-if="isDetail">戻る</button>
              </div>
              <!-- /.box-footer -->
            </form>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>



<script>
  import TabletHeaderView from '~/components/TabletHeaderView'
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  import MonthlyReportView from '~/components/MonthlyReportView'
  import NotificationCategoryComponent from '~/components/NotificationCategoryComponent'
  
  export default {
    layout: 'everyone',
    data() {
      return {
        informationInfo: {},
        informationList: [],
        fullpage: true,
        tabletHeight: 0,
        isDetail: false,
        category_id_options: [
          { name: "更新情報", value: 1 },
          { name: "メンテナンス情報", value: 2 },
          { name: "重要情報", value: 3 },
          { name: "不具合情報", value: 4 },
        ],
        param: {
          title: 'お知らせ',
          isBackButtons: true,
          isHomeButtons: true,
          backPath: '/t_home'
        },
      }
    },
    components: {
      TabletHeaderView,
      MonthlyReportView,
      NotificationCategoryComponent,
      Loading
    },
    methods: {
      getInformationInfo(category) {
        var searchWhere = {"and":[{"displayTo":{"gte":this.df(new Date())}},{"displayFrom":{"lte":this.df(new Date())}},{"display":true}]};
        if (category != 0) {
          searchWhere.and.push({"category": category});
        }
        const list = [];
        this.onSearch('/notifications', null, searchWhere, val => {
          val.forEach(function(val) {
            list.push(val);
          })
          this.informationInfo = list;
        });
      },
      getInfoCategory(id) {
        switch(id) {
          case 1:
            return '更新情報';
          case 2:
            return 'メンテナンス';
          case 3:
            return '重要';
          case 4:
            return '不具合情報';
        }
      },
      getNotifications(category) {
        var searchWhere = {"and":[{"displayTo":{"gte":this.df(new Date())}},{"displayFrom":{"lte":this.df(new Date())}},{"display":true}]};
        if (category != 0) {
          searchWhere.and.push({"category": category});
        }
        const list = [];
        this.onSearch('/notifications', null, searchWhere, val => {
          val.forEach(function(val) {
            list.push(val);
          })
          this.informationList = list;
        });
      },
      getNotificationRequest(api) {
        console.log(api)
        this.onSearch(api, null, null, data => {
          this.item = data;
          this.isDetail = true;
        });
      },
      getCategoryName(id) {
        var find = this.category_id_options.find(val => val.value == id);
        if (find != undefined) {
          return find.name;
        }
      },
      onDetail(id) {
        this.getNotificationRequest('/notifications/' + id)
      },
      onBack() {
        this.isDetail = false;
      }
    },
    created() {
      this.getNotifications(0);
      this.getInformationInfo(0);
    },
    // mounted() {
    //   this.tabletHeight = this.$refs.header.$el.clientHeight;
    // }
  };
</script>

<style lang="stylus" scoped>

</style>