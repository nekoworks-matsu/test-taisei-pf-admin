<template>
  <div align="left">
    <tablet-header-view ref="header" :param="param"></tablet-header-view>
    <div class="content ctm_subtitle" v-bind:style="{'margin-top':tabletHeight+'px'}">
      <div class="box-header box_head t_box_head">
        <button type="button" class="btn global_btn global_btn_border t_main_button" style="display: block !important; font-size: 16px;" @click="$router.push(param.list.add)">登録</button>
      </div>
      <template v-if="param.search">
        <search-input-view :sitems="param.search" :tablet="param" :onSearch2="search"></search-input-view>
      </template>
      <list-view :list="items" :param="param.list" :count="count" :isTablet="param" :limit="limit" :offset="offset" :onSearch2="search2"></list-view>
    </div>  
  </div>
</template>

<script>
  import ListView from '~/components/ListView'
  import { event } from "~/plugins/events.js"
  import TabletHeaderView from '~/components/TabletHeaderView'
  import SearchInputView from '~/components/SearchInputView'

  export default {
    data() {
      return {
        count: 0,
        limit: 20,
        where: '',
        offset: 0,
        tabletHeight: 0,
      }
    },
    props: {
      param: Object,
      itemsWatch: Function,
    },
    components: {
      ListView,
      TabletHeaderView,
      SearchInputView
    },
    methods: {
      getFilterParam(offset, where) {
        var parameter = { limit: this.limit, offset: offset, include: this.param.include, order: ['createdAt DESC'] };
        if (this.param.addFilter) {
          if (where != null) parameter.where = where;
          parameter = { filter: parameter }
          for (var i = 0; i < Object.keys(this.param.addFilter).length; i++) {
            parameter[Object.keys(this.param.addFilter)[i]] = this.param.addFilter[Object.keys(this.param.addFilter)[i]];
          }
        }
        return parameter;
      },
      search(where) {
        if (where == undefined) {
          if (this.param.searchWhere) {
            where = {and: this.param.searchWhere};
          }
        } else {
          if (this.param.searchWhere) {
            for (var i = 0; i < this.param.searchWhere.length; i++) {
              where.and.push(this.param.searchWhere[i]);
            }
          }
        }

        this.where = where
        this.count = 0
        this.offset = 0
          //report以外
        this.onSearch(
            this.param.api,
            {
              limit: this.limit,
              offset: 0,
              include: this.param.include,
              order: ['createdAt DESC']
            },
            where,
            (val) => {
              this.items = val
              this.$nextTick(function() {
                this.itemsWatch && setTimeout(() => this.itemsWatch(val), 1)
              })
            }
          )
          if (!this.param.list.disablePaging) {
            this.onCount(this.param.api, where, (count) => {
              this.count = count.count
            })
          }
      },
      
      search2(offset) {
        this.offset = offset;
        this.onSearch(this.param.api, { limit: this.limit, offset: offset, include: this.param.include, order: ['createdAt DESC'] }, this.where, val => {
          this.items = val;
          this.$nextTick(function () {
            this.itemsWatch && setTimeout(() => this.itemsWatch(val), 1);
          })
        });
      }
    },
    mounted() {
      this.tabletHeight = this.$refs.header.$el.clientHeight;
      event.on('search', this.search);
      // if (!this.param.stop) {
      //   this.search();
      // }
    },
    beforeDestroy() {
      event.off('search');
    },
  }

</script>
