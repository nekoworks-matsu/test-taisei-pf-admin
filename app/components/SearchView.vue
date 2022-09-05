<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper ts_content_wrapper sidebar_scroll">
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
                <li class="current">{{param.title}}一覧</li>
              </ol>
            </div>
            <h1 class="ts_content_heading">{{param.title}}一覧</h1>
            <!-- <div class="pull-right">
              <button v-if="!isRemoveAdd" type="button" class="btn btn-info width_140" @click="$router.push(param.list.add)"><i class="fa fa-plus"></i>&nbsp;&nbsp;登 録</button>
            </div> -->
          </section>
          <div class="button_header_btn">
            <button v-if="!isRemoveAdd" type="button" class="btn btn-info global_btn" @click="$router.push(param.list.add)"><i class="fa fa-plus"></i>&nbsp;&nbsp;登 録</button>
            <!-- <button type="button" class="btn btn-info global_btn">登 録</button> -->
          </div>
        </div>
      </div>
    </section>
    <!-- <section class="content-header">
      <h1>
        {{param.title}}一覧
        <small></small>
        <div class="pull-right">
          <button v-if="!isRemoveAdd" type="button" class="btn btn-info width_140" @click="$router.push(param.list.add)"><i class="fa fa-plus"></i>&nbsp;&nbsp;登 録</button>
        </div>
      </h1>
    </section> -->

    <!-- Main content -->
    <section class="content">
      <div class="box-group flex_boxgroup">
        <template v-if="param.search">
          <search-input-view :param="param" :sitems="param.search" :onSearch2="search"></search-input-view>
        </template>
        <list-view
          :list="items"
          :param="param.list"
          :count="count"
          :limit="limit"
          :offset="offset"
          :onSearch2="search2"
          :isRemoveAdd="isRemoveAdd"
          :operationType="operationType"
        ></list-view>
      </div>
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
import ListView from './ListView'
import SearchInputView from './SearchInputView'
import { event } from '~/plugins/events.js'
import moment from 'moment'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  data() {
    return {
      count: 0,
      limit: 20,
      where: '',
      offset: 0,
      order: [],
      fullpage: true,
      operationType: {},
    }
  },
  props: {
    param: Object,
    itemsWatch: Function,
    isRemoveAdd: Boolean,
  },
  components: {
    ListView,
    SearchInputView,
    Loading
  },
  methods: {
    getFilterParam(offset, where, order) {
      var parameter = { limit: this.limit, offset: offset, include: this.param.include, order: order };
      
      if (this.param.addFilter) {
        if (where != null) parameter.where = where;
        parameter = { filter: parameter }
        for (var i = 0; i < Object.keys(this.param.addFilter).length; i++) {
          parameter[Object.keys(this.param.addFilter)[i]] = this.param.addFilter[Object.keys(this.param.addFilter)[i]];
        }
      }
      return parameter;
    },
    getSearchItem() {
      var searchItem = localStorage.getItem('search_item')
      return JSON.parse(searchItem)
    },
    // 仮処理: 承認フラグ
    convertReportStatus(val) {
      for (var i = 0; i < val.length; i++) {
        if (val[i].buildingId === 1) {
          val[i]["approveReport"] = {'reportStatus': '0'};
        }
      }
      return val;
    },
    search(where, queryItem) {
      if (where == undefined) {
        if (this.param.searchWhere) {
          where = {and: this.param.searchWhere};
        } else {
          where = {};
        }
      } else {
        if (this.param.searchWhere) {
          for (var i = 0; i < this.param.searchWhere.length; i++) {
            where.and.push(this.param.searchWhere[i]);
          }
        }
      }
      var searchItem = this.getSearchItem();
      this.where = where
      this.count = 0
      this.offset = searchItem.offset != undefined ? searchItem.offset : 0;
      this.order = searchItem.order != undefined ? searchItem.order : ['updatedAt DESC'];
      //report以外
      if (this.param.urlQuery != null){
        var query = this.getQueryFromWhere(where);
        var lmOff = "&limit=20&offset=" + this.offset;
        this.onSearch(this.param.api+this.param.urlQuery+query+lmOff, null, null, (val) => {
          this.items = val
          this.$nextTick(function() {
            this.itemsWatch && setTimeout(() => this.itemsWatch(val), 1)
          })
        })
      }else{
        if (Object.keys(queryItem).length != 0) {
          this.operationType = queryItem;
          this.onSearchForQuery(this.param.api, this.getFilterParam(this.offset, where, this.order), where, queryItem, (val) => {
            this.items = val
            this.$nextTick(function() {
              this.itemsWatch && setTimeout(() => this.itemsWatch(val), 1)
            })
          })
        } else {
          this.onSearch(this.param.api, this.getFilterParam(this.offset, where, this.order), where, (val) => {
            // 仮処理: 承認フラグ
            this.items = this.convertReportStatus(val);
            this.$nextTick(function() {
              this.itemsWatch && setTimeout(() => this.itemsWatch(val), 1)
            })
          })
        }
      }
      if (!this.param.list.disablePaging) {
        if (this.param.addFilter) {
          var filter = {};
          for (var i = 0; i < Object.keys(this.param.addFilter).length; i++) {
            filter[Object.keys(this.param.addFilter)[i]] = this.param.addFilter[Object.keys(this.param.addFilter)[i]];
          }
          this.onCountForQuery(this.param.api, filter, where, (count) => {
            this.count = count.count
          })
        } else {
          if (this.param.urlQuery != null){
            var query = this.getQueryFromWhere(where);
            this.onCountUrlQuery(this.param.api+"/count"+this.param.urlQuery+query+lmOff, (count) => {
              this.count = count.count
            });
          } else if(Object.keys(queryItem).length != 0) {
            if (this.param.api.includes("/disabled-group-contents") || this.param.api.includes("/report-object-definitions")) {
              this.onCountForQuery3(this.param.api, where, queryItem,(count) => {
                this.count = count.count
              })
            }else{
              this.onCountForQuery2(this.param.api, where, queryItem,(count) => {
                this.count = count.count
              })
            }
          } else {
            this.onCount(this.param.api, where, (count) => {
              this.count = count.count
            })
          }
        }
      }
    },
    search2(offset, order, queryItem) {
      this.offset = offset;
      this.updateSearchItem(offset, order);
      if (this.param.urlQuery != null){
        var query = this.getQueryFromWhere(this.where);
        var lmOff = "&limit=20&offset=" + this.offset;
        this.onSearch(this.param.api+this.param.urlQuery+query+lmOff, null, null, (val) => {
          this.items = val
          this.$nextTick(function() {
            this.itemsWatch && setTimeout(() => this.itemsWatch(val), 1)
          })
        })
      }else{
        if (queryItem != undefined && Object.keys(queryItem).length != 0 ) {
          this.onSearchForQuery(this.param.api, this.getFilterParam(offset, this.where, order), this.where, queryItem, (val) => {
            this.items = val
            this.$nextTick(function() {
              this.itemsWatch && setTimeout(() => this.itemsWatch(val), 1)
            })
          })
        } else {
          this.onSearch(this.param.api, this.getFilterParam(offset, this.where, order), this.where, (val) => {
            this.items = val
            this.$nextTick(function() {
              this.itemsWatch && setTimeout(() => this.itemsWatch(val), 1)
            })
          })
        }
      }
    },
    updateSearchItem(offset, order) {
      var searchItem = JSON.parse(localStorage.getItem('search_item'));
      searchItem['offset'] = offset;
      searchItem['order'] = order;
      localStorage.setItem('search_item', JSON.stringify(searchItem));
    }
  },
  mounted() {
    event.on('search', this.search);
    // if (!this.param.stop) {
    //   this.search()
    // }
  },
  beforeDestroy() {
    event.off('search')
  }
}
</script>
