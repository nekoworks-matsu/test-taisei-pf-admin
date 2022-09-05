<template>

  <div :class="{box: isTablet==null, margin_bottom_0: isTablet==null, t_box: isTablet!=null, margin_top_40: isTablet!=null}">
    <div class="box-header with-border" :class="{display_flex: isTablet==null, box_head: isTablet==null, t_box_head: isTablet!=null}">
      <h3 class="box-title width_max" v-if="isTablet==null"><!--<i class="fa" v-bind:class="param.icon"></i>--> {{param.title}} <small>{{param.title_s}}</small></h3>
      <h3 class="t_heading" v-if="isTablet!=null">検索結果</h3>

      <div class="box-tools list_button" v-if="onSearch2 && !param.disablePaging && isTablet==null">
        <span class="margin_right_10 vertical_align_sub"><span v-if="count > 0" >{{offset+1}}-</span>{{Math.min(offset+limit,offset+list.length)}}/{{count}}件</span>
        <ul class="pagination pagination-sm no-margin pull-right">
          <li class="paginate_button previous" id="example1_previous" v-bind:class="{ disabled: offset==0 }">
            <a aria-controls="example1" data-dt-idx="0" tabindex="0" @click="pageClick(offset-limit)" v-if="!isMajorItem">前へ</a>
            <a aria-controls="example1" data-dt-idx="0" tabindex="0" @click="pageClickMajorItem(offset-limit)" v-else>前へ</a>
          </li>
          <li class="paginate_button next" id="example1_next" v-bind:class="{ disabled: offset==0 }" v-if="count >= limit*6">
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClick(0)" v-if="!isMajorItem">最初</a>
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClickMajorItem(0)" v-else>最初</a>
          </li>
          <template  v-for="nn in 11">
            <li class="paginate_button" v-bind:class="{ active: (nn-6) == 0 }" v-if="offset + (nn-6)*limit >= 0 && offset + (nn-6)*limit < count">
              <a aria-controls="example1" data-dt-idx="1" tabindex="0" @click="pageClick(offset + (nn-6)*limit)" v-if="!isMajorItem">{{offset/limit + (nn-5)}}</a>
              <a aria-controls="example1" data-dt-idx="1" tabindex="0" @click="pageClickMajorItem(offset + (nn-6)*limit)" v-else>{{offset/limit + (nn-5)}}</a>
            </li>
          </template>
          <li class="paginate_button next" id="example1_next" v-bind:class="{ disabled: offset+limit>=count }" v-if="count >= limit*6">
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClick(count-(count%limit))" v-if="!isMajorItem">最後</a>
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClickMajorItem(count-(count%limit))" v-else>最後</a>
          </li>
          <li class="paginate_button next" id="example1_next" v-bind:class="{ disabled: offset+limit>=count }">
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClick(offset+limit)" v-if="!isMajorItem">次へ</a>
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClickMajorItem(offset+limit)" v-else>次へ</a>
          </li>
        </ul>
      </div>

      <div class="box-tools list_button" v-if="isTablet!=null">
        <div class="btn-group" v-if="param.isIncludeImage">
          <button v-if="isTablet==null && !isRemoveAdd" type="button" class="btn btn-sm" v-bind:class="{ 'btn-primary': isListMode, 'btn-default': !isListMode }" @click="changeListMode(true)" ><i class="fa fa-list-ul"></i>&nbsp;&nbsp;リスト表示</button>
          <button v-if="isTablet==null && !isRemoveAdd" type="button" class="btn btn-sm margin_right_20" v-bind:class="{ 'btn-primary': !isListMode,'btn-default': isListMode }" @click="changeListMode(false)" ><i class="fa fa-photo"></i>&nbsp;&nbsp;サムネイル表示</button>
        </div>
        <div class="btn-group">
          <button type="button" class="btn btn-sm btn-warning" @click="$router.push(param.list)" v-if="param.list"><i class="fa fa-search"></i>&nbsp;&nbsp;検 索</button>
          <!-- <button v-if="isTablet!=null && !isRemoveAdd" type="button" class="btn btn-lg menu_mode_right btn-info" @click="$router.push(param.add)" ><i class="fa fa-plus"></i>&nbsp;&nbsp;登 録</button> -->
        </div>
      </div>
      <!-- /.box-tools -->
    </div>

    <h3 class="box-title data_count" v-if="isTablet==null"> 該当件数:<span>{{count}}</span>件</h3>
    <p class="box-title for_tablet font_20 data_count margin_top_20 margin_bottom_20 text_align_center" v-if="isTablet!=null">該当件数: {{count}}件</p>
    <div class="text_align_center margin_top_20 padding_bottom_15" v-if="isTablet==null">
      <div v-if="param.isIncludeImage" class="btn-group btn_groups">
        <button v-if="isTablet==null && !isRemoveAdd" type="button" class="btn btn-lg btn_width50 margin_left_20" v-bind:class="{ 'btn-primary': isListMode, 'btn-default': !isListMode }" @click="changeListMode(true)" ><i class="fa fa-list-ul"></i>&nbsp;&nbsp;リスト表示</button>
        <button v-if="isTablet==null && !isRemoveAdd" type="button" class="btn btn-lg btn_width50 margin_right_20" v-bind:class="{ 'btn-primary': !isListMode,'btn-default': isListMode }" @click="changeListMode(false)" ><i class="fa fa-image"></i>&nbsp;&nbsp;サムネイル表示</button>
      </div>
    </div>

    <div class="text_align_center margin_top_20 padding_bottom_15" v-if="isTablet!=null">
      <div v-if="param.isIncludeImage" class="btn-group btn_groups">
        <button v-if="isTablet!=null && !isRemoveAdd" type="button" class="btn btn-lg btn_width50 margin_left_20" v-bind:class="{ 'btn-primary': isListMode, 'btn-default': !isListMode }" @click="changeListMode(true)" ><i class="fa fa-list-ul"></i>&nbsp;&nbsp;リスト表示</button>
        <button v-if="isTablet!=null && !isRemoveAdd" type="button" class="btn btn-lg btn_width50 margin_right_20" v-bind:class="{ 'btn-primary': !isListMode,'btn-default': isListMode }" @click="changeListMode(false)" ><i class="fa fa-photo"></i>&nbsp;&nbsp;サムネイル表示</button>
      </div>
    </div>
    <!-- /.box-header -->

    <div class="box-body" v-bind:class="{ 'background_gray': !isListMode&&param.isIncludeImage, 'no-padding': isTablet==null}">
      <div v-if="!isListMode&&param.isIncludeImage" v-bind:class="{'margin_top_15':list.length!=0}">
        <div v-for="item in list">
          <div v-for="col in param.columns" v-if="col.types==7">
            <div v-if='(getValue(item, col.column)!="")&&(getValue(item, col.column)!=null)' v-bind:class="{ 'image_list': (isTablet==null), 'image_list_tablet': (isTablet!=null) }"  @click="onImgClick(item.id)" data-toggle="modal" v-bind:data-target="'#modal'">
              <img v-bind:id="'img_source_'+item.id" v-bind:src="imageHeaderUrl+getValue(item, col.column)" v-bind:class="{ 'img_thumbnail_list': (isTablet==null), 'img_thumbnail_list_tablet': (isTablet!=null) }">
              <div v-for="coll in param.columns" v-if="coll.fn">
                <span class="clear_left float_none">{{coll.fn(getValue(item, coll.column))}}</span>
              </div>
            </div>
            <div v-if='(getValue(item, col.column)=="")||(getValue(item, col.column)==null)' v-bind:class="{ 'image_list': (isTablet==null), 'image_list_tablet': (isTablet!=null) }" @click="reads(param,item)">
              <div v-for="coll in param.columns" v-if="coll.fn">
                <div v-bind:class="{ 'img_thumbnail_blank': (isTablet==null), 'img_thumbnail_list_tablet_blank': (isTablet!=null)}">
                  <span class="blank_message">{{col.name}}が登録されていません</span>
                </div>
                <span class="clear_left float_none">{{coll.fn(getValue(item, coll.column))}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="table-responsive" v-if="isListMode||!param.isIncludeImage">
        <table class="table table-bordered table-hover" role="grid" v-if="isTablet==null">
          <thead>
            <tr role="row">
              <th v-for="col in param.columns" class="dropdown" v-bind:style="{'width': col.width + 'px'}" v-bind:class="{'width_200':(col.types==2)}" v-if="col.types!=7">{{col.name}}
                <a href="#" class="cursor_pointer dropdown-toggle color_black" data-toggle="dropdown" v-if="col.sort">
                  <span class="fa fa-sort pull-right margin_top_3"></span>
                </a>
                <ul class="dropdown-menu min_width_100">
                  <li class="user-footer">
                    <div class="list_sort">
                      <a class="color_black cursor_pointer" @click="isSort(col.column + ' ASC')" v-if="!isMajorItem"><i class="fa fa-sort-up margin_right_10" ></i>昇順</a>
                      <a class="color_black cursor_pointer" @click="isSortMajoritem(col.id, col.types, 'ASC')" v-else><i class="fa fa-sort-up margin_right_10"></i>昇順</a>
                    </div>
                    <div class="list_sort">
                      <a class="color_black cursor_pointer" @click="isSort(col.column + ' DESC')" v-if="!isMajorItem"><i class="fa fa-sort-down margin_right_10"></i>降順</a>
                      <a class="color_black cursor_pointer" @click="isSortMajoritem(col.id, col.types, 'DESC')" v-else><i class="fa fa-sort-down margin_right_10"></i>降順</a>
                    </div>
                  </li>
                </ul>
              </th>
              
              
            </tr>
          </thead>
          <tbody>
            <tr role="row" v-for="item in list" @click="reads(param,item)">
              <td v-for="col in param.columns" v-if="col.types!=7" :class="{'text_center': col.component}">
                <span v-if="col.component" v-bind:is="col.component" :value="getValue(item, col.column)"></span>
                <template v-else>
                  <template v-if="col.fn">{{col.fn(getValue(item, col.column))}}</template>
                  <template v-else>{{getValue(item, col.column)}}</template>
                </template>
              </td>
            </tr>
          </tbody>
        </table>

        <table class="table table-bordered table-hover font_18" role="grid" v-if="isTablet!=null">
          <thead>
            <tr role="row">
              <th v-for="col in param.columns" v-bind:class="{'width_200':(col.types==2)}" v-if="col.types!=7">{{col.name}}</th>
            </tr>
          </thead>
          <tbody>
            <tr role="row" v-for="item in list" @click="reads(param,item)">
              <td v-for="col in param.columns" v-if="col.types!=7" :class="{'text_center': col.component}">
                <span v-if="col.component" v-bind:is="col.component" :value="getValue(item, col.column)"></span>
                <template v-else>
                  <template v-if="col.fn">{{col.fn(getValue(item, col.column))}}</template>
                  <template v-else>{{getValue(item, col.column)}}</template>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="box-footer clearfix clear_left to_right_btn" v-if="onSearch2 && !param.disablePaging && isTablet==null">
        <span class="margin_right_10 vertical_align_sub"><span v-if="count > 0">{{offset+1}}-</span>{{Math.min(offset+limit,offset+list.length)}}/{{count}}件</span>
        <ul class="pagination pagination-sm no-margin pull-right">
          <li class="paginate_button previous" id="example1_previous" v-bind:class="{ disabled: offset==0 }">
            <a aria-controls="example1" data-dt-idx="0" tabindex="0" @click="pageClick(offset-limit)" v-if="!isMajorItem">前へ</a>
            <a aria-controls="example1" data-dt-idx="0" tabindex="0" @click="pageClickMajorItem(offset-limit)" v-else>前へ</a>
          </li>
          <li class="paginate_button next" id="example1_next" v-bind:class="{ disabled: offset==0 }" v-if="count >= limit*6">
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClick(0)" v-if="!isMajorItem">最初</a>
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClickMajorItem(0)" v-else>最初</a>
          </li>
          <template  v-for="nn in 11">
            <li class="paginate_button" v-bind:class="{ active: (nn-6) == 0 }" v-if="offset + (nn-6)*limit >= 0 && offset + (nn-6)*limit < count">
              <a aria-controls="example1" data-dt-idx="1" tabindex="0" @click="pageClick(offset + (nn-6)*limit)" v-if="!isMajorItem">{{offset/limit + (nn-5)}}</a>
              <a aria-controls="example1" data-dt-idx="1" tabindex="0" @click="pageClickMajorItem(offset + (nn-6)*limit)" v-else>{{offset/limit + (nn-5)}}</a>
            </li>
          </template>
          <li class="paginate_button next" id="example1_next" v-bind:class="{ disabled: offset+limit>=count }" v-if="count >= limit*6">
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClick(count-(count%limit))" v-if="!isMajorItem">最後</a>
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClickMajorItem(count-(count%limit))" v-else>最後</a>
          </li>
          <li class="paginate_button next" id="example1_next" v-bind:class="{ disabled: offset+limit>=count }">
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClick(offset+limit)" v-if="!isMajorItem">次へ</a>
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClickMajorItem(offset+limit)" v-else>次へ</a>
          </li>
        </ul>
      </div>

      <div class="box-footer clearfix clear_left" v-if="onSearch2 && !param.disablePaging && isTablet!=null">
        <div class="span_center">
        <ul class="pagination no-margin pagination-lg">
          <li class="paginate_button previous" id="example1_previous" v-bind:class="{ disabled: offset==0 }">
            <a aria-controls="example1" data-dt-idx="0" tabindex="0" @click="pageClick(offset-limit)" v-if="!isMajorItem">前へ</a>
            <a aria-controls="example1" data-dt-idx="0" tabindex="0" @click="pageClickMajorItem(offset-limit)" v-else>前へ</a>
          </li>

          <template  v-for="nn in 11">
            <li class="paginate_button" v-bind:class="{ active: (nn-6) == 0 }" v-if="offset + (nn-6)*limit >= 0 && offset + (nn-6)*limit < count">
              <a aria-controls="example1" data-dt-idx="1" tabindex="0" @click="pageClick(offset + (nn-6)*limit)" v-if="!isMajorItem">{{offset/limit + (nn-5)}}</a>
              <a aria-controls="example1" data-dt-idx="1" tabindex="0" @click="pageClickMajorItem(offset + (nn-6)*limit)" v-else>{{offset/limit + (nn-5)}}</a>
            </li>
          </template>
          <li class="paginate_button next" id="example1_next" v-bind:class="{ disabled: offset+limit>=count }" v-if="count >= limit*6">
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClick(count-(count%limit))" v-if="!isMajorItem">最後</a>
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClickMajorItem(count-(count%limit))" v-else>最後</a>
          </li>
          <li　class="paginate_button next" id="example1_next" v-bind:class="{ disabled: offset+limit>=count }">
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClick(offset+limit)" v-if="!isMajorItem">次へ</a>
            <a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClickMajorItem(offset+limit)" v-else>次へ</a>
          </li>
        </ul>
        </div>
        <div class="span_center font_18">
          <span v-if="count > 0">{{offset+1}}-</span>{{Math.min(offset+limit,offset+list.length)}}/{{count}}件
        </div>
      </div>
    </div>
    <!-- /.box-body -->
  </div>
  <!-- /.box -->

</template>

<script>
  export default {
    name: 'ListView',
    props: {
      param: Object,
      list: Array,
      onSearch2: Function,
      count: Number,
      limit: Number,
      operationType: Object,
      isTablet: Object,
      isRemoveAdd: Boolean,
      offset: 0,
    },
    data() {
      return {
        isListMode: true,
        order: '',
        id: undefined,
        type: undefined,
        order_type: undefined,
        isMajorItem: false,
        isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
      }
    },
    created() {
      if (localStorage.getItem('isListMode') == null){
        this.isListMode = true;
      }else{
        this.isListMode = localStorage.getItem('isListMode') == "true" ? true : false;        
      }

      if (this.$route.path.indexOf('/majoritems') != -1 || this.$route.path.indexOf('/business_report') != -1) {
        // 変数が適していないが、business_reportも条件に含める
        // URIが増えるたびに条件増えると手間なのでコメントで補足
        this.isMajorItem = true;
      } else {
        this.isMajorItem = false;
      }
      
    },
    components: {
    },
    methods: {
      reads(param,item){
        if (param.read || param.readFn) {
          if (this.isHeadquartersMode && item.operationCategoryId != null){
            var readUrl = param.read;
            // readUrl = readUrl.replace(/\/(\d+)\//,"/"+item.operationCategoryId+"/");
            this.$router.push(readUrl+ item.id);
          }else{
            this.$router.push(param.readFn ? param.readFn(item) : (param.readFn2 ? param.readFn2(item) : (param.readFn3 ? param.readFn3(item) : (param.readFn4 ? param.readFn4(item) : (param.read + item.id)))));
          }
        }
      },
      changeListMode(mode){
        localStorage.setItem('isListMode',mode);
        this.isListMode = mode;
      },
      onImgClick(tag){
        this.$emit('onImgClick', tag);
      },
      pageClick(offset) {
        if (offset < 0 || offset > this.count) return;
        if (offset == this.count) offset-=this.limit;
        var order = this.order == '' ? 'updatedAt DESC' : this.order;
        this.onSearch2(offset, [order], this.operationType);
      },
      pageClickMajorItem(offset) {
        if (offset < 0 || offset > this.count) return;
        if (offset == this.count) offset-=this.limit;
        this.onSearch2(offset, this.id, this.type, this.order_type);
      },
      getValue(obj, key) {
        const keys = key.split('.');
        switch(keys.length) {
          case 1:
            return obj[keys[0]];
          case 2:
            return obj[keys[0]] && obj[keys[0]][keys[1]];
          case 3:
            return obj[keys[0]] && obj[keys[0]][keys[1]] && obj[keys[0]][keys[1]][keys[2]];
          case 4:
            return obj[keys[0]] && obj[keys[0]][keys[1]][keys[2]] && obj[keys[0]][keys[1]][keys[2]][keys[3]];
        }
      },
      isSort(order) {
        this.order = order;
        this.onSearch2(0, [order]);
      },
      isSortMajoritem(id, type, order_type) {
        this.id = id;
        this.type = type;
        this.order_type = order_type;
        this.onSearch2(0, id, type, order_type);
      }
    },
  }

</script>
