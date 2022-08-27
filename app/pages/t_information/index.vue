<template>
  <!-- Content Wrapper. Contains page content -->
  <div align="left">
    <tablet-header-view ref="header" :param="param"></tablet-header-view>
    <loading
      :active.sync="loading"
      :can-cancel=false
      :is-full-page="fullpage"></loading>
    <div class="box content ctm_subtitle margin_bottom_0" v-bind:style="{'margin-top':tabletHeight+'px'}">

    <!-- Content Header (Page header) -->
    <!-- <section class="content-header">
      <h1>
        お知らせ
        <small></small>
      </h1>
    </section> -->

    <!-- Main content -->
    <div class="box-solid">
      <form class="form-horizontal" autocomplete="off">
        <div class="box-group">
        <div class="box">
          <!-- <div class="box-header">
            <h3 class="box-title font_18">お知らせ一覧</h3>
          </div> -->

          <div class="row">
            <div class="col-md-12">
              <div class="nav-tabs-custom">
                <ul class="nav nav-tabs">
                  <li class="active"><a class="nav-link font_18" href="#all" data-toggle="tab" @click="getNotifications(0)">すべて</a></li>
                  <li><a class="nav-link font_18" href="#update" data-toggle="tab" @click="getNotifications(1)">更新情報</a></li>
                  <li><a class="nav-link font_18" href="#mententance" data-toggle="tab" @click="getNotifications(2)">メンテナンス</a></li>
                  <li><a class="nav-link font_18" href="#important" data-toggle="tab" @click="getNotifications(3)">重要</a></li>
                  <li><a class="nav-link font_18" href="#bug" data-toggle="tab" @click="getNotifications(4)">不具合情報</a></li>
                </ul>
                <div class="tab-content">
                  <div class="tab-pane active" id="all">
                    <table role="grid" class="table table-bordered table-hover">
                      <tbody>
                        <tr role="row" v-for="information in informationList" @click="$router.push('/t_information/details/'+information.id)">
                          <td class="width_200 font_18">{{df3(information.displayFrom)}}</td>
                          <td class="width_200 font_18"><span v-bind:is="'NotificationCategoryComponent'" :value="information.category"></span></td>
                          <td class="font_18">{{information.title}}</td>
                        </tr>
                        <tr class="no_information" role="row" v-if="informationList.length==0">
                          <td class="font_18">表示するお知らせは有りません</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          <!-- /.box-body -->
          <div class="box-footer">
          </div>
          <!-- /.box-footer -->
        </form>
      </div>
    </div>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
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
        informationList: [],
        fullpage: true,
        tabletHeight: 0,
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
      }
    },
    created() {
      this.getNotifications(0);
    },
    mounted() {
      this.tabletHeight = this.$refs.header.$el.clientHeight;
    }
  };
</script>

<style lang="stylus" scoped>

</style>