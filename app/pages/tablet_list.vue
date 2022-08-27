<template>
  <div>
    <div class="common_title t_title">
     <div><button type="button" class="btn btn-default" @click="onBackButtonClick" v-if=""><i class="fa fa-arrow-left"></i></button></div>
      <h2>{{param.title}}</h2>
      <div><button type="button" class="btn btn-default" @click="onHomeButtonClick" v-if=""><i class="fa fa-home"></i><br></button></div>
    </div>
    <!-- Main Header -->
  <!-- 検索条件 -->
    <div class="box">
      <div class="box-header">
        <h3 class="box-title"><i class="fa fa-search"></i> 検索条件<small></small></h3>
      </div>
      <!-- /.box-header -->
      <div v-if="error" class="callout callout-danger err-info"><p>{{error}}</p></div>
      <div class="box-body no-paddin">
        <form class="form-horizontal" style="margin:0;" autocomplete="off">
          <div class="box-body">
            <div class="form-group" v-for="item in param.search">
              <label v-bind:for="item.column" class="control-label input-lg tablet_search_input" v-if="item.type!='twoDateInput'">{{item.name}}</label>
              <div class="col-sm-10 tablet_search_input" v-if="!item.type">
                <input type="text" class="form-control input-lg" v-bind:maxlength="item.maxlength" v-bind:id="item.column" v-bind:placeholder="item.name" v-model="input[item.column]">
              </div>
              <div class="col-sm-10 tablet_search_input" v-if="item.type=='select'">
                <select class="form-control input-lg" v-bind:id="item.column" v-model="input[item.column]">
                  <option v-bind:value="opt.value" v-for="opt in item.options">{{opt.name}}</option>
                </select>
              </div>

              <label class="col-sm-2 control-label input-lg" v-if="item.type=='twoDateInput'">{{item.name}}</label>
              <div class="col-sm-5 input-lg" v-if="item.type=='twoDateInput'" v-for="obj in item.columns">
                <input type="date" class="form-control" v-bind:id="obj.column" v-bind:placeholder="obj.placeholder" v-model="input[obj.column]">
                <button type="button" class="btn btn-xs btn-info pull-right edgeonly" @click="input[obj.column]=''"><i class="fa fa-times-circle"></i></button>
              </div>

              <div class="col-sm-10 input-lg" v-if="item.type=='oneDateInputPicker'" v-for="obj in item.columns">
                <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="input[obj.column]"  v-bind:placeholder="obj.placeholder"></vuejs-datepicker>
                <button type="button" class="btn btn-xs btn-info pull-right edgeonly" @click="input[obj.column]=''"><i class="fa fa-times-circle"></i></button>
              </div>

              <div class="col-sm-5 input-lg" v-if="item.type=='twoDateInputPicker'" v-for="obj in item.columns">
                <vuejs-datepicker class="form-control date_picker" :clear-button="true" :format="DatePickerFormat" :language="language" name="datepicker" v-model="input[obj.column]"  v-bind:placeholder="obj.placeholder"></vuejs-datepicker>
                <button type="button" class="btn btn-xs btn-info pull-right edgeonly" @click="input[obj.column]=''"><i class="fa fa-times-circle"></i></button>
              </div>

            </div>
          </div>
          <!-- /.box-body -->
          <div class="box-footer clearfix">
            <div class="no-margin pull-right">
              <button type="submit" class="btn btn-info">検 索</button>
            </div>
          </div>
          <!-- /.box-footer -->
        </form>
      </div>
      <!-- /.box-body -->

    </div>
    <!-- /.box -->
    <!-- 検索条件 -->

    <!-- 検索結果 -->
    <div class="box">
      <div class="box-header">
        <h3 class="box-title"><i class="fa" v-bind:class="param.icon"></i> {{param.list.title}}<small>{{param.title_s}}</small></h3>
        <div class="box-tools">
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-default" @click="$router.push(param.list)" v-if="param.list"><i class="fa fa-search"></i>&nbsp;&nbsp;検 索</button>
            <button type="button" class="btn btn-sm btn-default" @click="$router.push(param.add)" ><i class="fa fa-plus"></i>&nbsp;&nbsp;登 録</button>
          </div>
        </div>
        <!-- /.box-tools -->
      </div>
    <!-- /.box-header -->

      <div class="box-body table-responsive no-padding">
        <table class="table table-bordered table-hover" role="grid">
          <thead>
            <tr class="input-lg" role="row">
              <th v-for="col in param.list.columns">{{col.name}}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="input-lg" role="row" v-for="item in param.list_items" @click="(param.read || param.readFn) && $router.push(param.readFn ? param.readFn(item) : (param.readFn2 ? param.readFn2(item) : (param.readFn3 ? param.readFn3(item) : (param.readFn4 ? param.readFn4(item) : (param.read + item.id)))))">
              <td v-for="col in param.list.columns">
                <span v-if="col.component" v-bind:is="col.component" :value="getValue(item, col.column)"></span>
                <template v-else>
                  <template v-if="col.fn">{{col.fn(getValue(item, col.column))}}</template>
                  <template v-else>{{getValue(item, col.column)}}</template>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="box-footer clearfix">
          <span v-if="param.list_items.length > 0">{{param.list_items.length}}-</span>{{param.list_items.length}}/{{param.list_items.length}}件
          <ul class="pagination pagination-sm no-margin pull-right">
            <li class="paginate_button previous" id="example1_previous" v-bind:class="{ disabled: offset==0 }"><a aria-controls="example1" data-dt-idx="0" tabindex="0" @click="pageClick(offset-limit)">前へ</a></li>

            <template  v-for="nn in 1">
              <li class="paginate_button li-lg" v-bind:class="{ active: 1 }">
                <a aria-controls="example1" data-dt-idx="1" tabindex="0" @click="pageClick(offset + (nn-6)*limit)">1</a>
              </li>
            </template>

            <!-- <li class="paginate_button next" id="example1_next" v-bind:class="{ disabled: offset+limit>=count }" v-if="count >= limit*6"><a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClick(count-(count%limit))">最後</a></li> -->

            <li class="paginate_button next" id="example1_next" v-bind:class="{ disabled: offset+limit>=count }"><a aria-controls="example1" data-dt-idx="7" tabindex="0" @click="pageClick(offset+limit)">次へ</a></li>
          </ul>
        </div>
      </div>
    </div>
  <!-- 検索結果 -->
  </div>
</template>

<script>
  import request from 'superagent'

  export default {
    layout: 'everyone',
    data() {
      return {
        param: {
          title: 'xxx一覧画面',
          search: [ 
            { "name": "名前", "column": "name", "placeholder": "メンバー名", "maxlength": 32 },
            { "name": "利用設定", "column": "activated", "type": "select", "options": [ { "name": "", "value": "" }, { "name": "利用可能", "value": true }, { "name": "利用不可", "value": false } ] } 
          ],
          list: {
            title: '検索結果',
            columns: [
              { name: 'サンプルID', column: 'id' },
              { name: 'サンプル名', column: 'name' },
              { name: '登録日時', column: 'createdAt', fn: this.df },
              { name: '更新日時', column: 'updatedAt', fn: this.df },
            ],
          },
          list_items: [ 
            { "createdAt": "2020-07-13T05:53:29.000Z", "updatedAt": "2020-07-13T05:53:29.000Z", "id": 1, "name": "サンプル1" },
            { "createdAt": "2020-07-13T05:53:29.000Z", "updatedAt": "2020-07-13T05:53:29.000Z", "id": 2, "name": "サンプル2" }
          ],
          icon: 'fa-dot-circle-o',
        },
        count: '',
        list: '',
        offset: '',
        limit: '',
        length: '',
        path: '',
        error: '',
        id: '',
        pass: '',
        input: {},
      }
    },
    methods: {
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
      }
    },
    created() {
      $("body").removeClass("skin-black");
      $("body").addClass("skin-black-light");
      // this.getColumns();
    },
    watch: {
    }
  }
</script>

<style lang="stylus" scoped>

</style>


