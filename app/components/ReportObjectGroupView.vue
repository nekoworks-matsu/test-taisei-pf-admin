<template>
    <div class="monthly_report_tb_margin">
      <h3 class="box-title with-border">{{param.contentTitle}}</h3>
      <div class="box-body no-padding">
        <div class="monthly_report_date">
          <table class="table table-bordered table-hover multi_table" role="grid" v-if="isTablet==null">
            <thead>
              <tr role="row">
                <th v-if="isEdit"></th>
                <th>{{param.columnName[0]}}</th>
                <th v-if="isEdit"></th>
              </tr>
             </thead>
            <tbody>
              <tr role="row" v-for="(item, index) in list" @click="" v-bind:id="index" v-bind:class="{changed_background: (index == changedIndex)}">
              <!-- 表示順 -->
                <td width="10%" v-if="isEdit">
                  <button type="button" class="btn btn-default" @click.stop="onTappedUp(index)"><i class="fa fa-caret-up fa-lg"></i></button>&nbsp;
                  <button type="button" class="btn btn-default" @click.stop="onTappedDown(index)"><i class="fa fa-caret-down fa-lg"></i></button>
                </td>

                <!-- 項目名 -->
                <td width="100" class="" v-if="isEdit">
                  <select class="form-control  max_width_390" v-bind:id="'name'+item.id" v-model="item.id">
                    <option v-bind:value="opt.value" v-for="opt in param.options">{{opt.name}}</option>
                  </select>
                </td>
                <td width="100" class="pointer_events_none" v-if="!isEdit">
                  <span v-html="getColumData(item.name)"></span>
                </td>

                <td width="55" v-if="isEdit"><button type="button" class="btn btn-danger" @click.stop="onTappedDelete(index)"><i class="fa fa-minus"></i></button></td>
              </tr>
            </tbody>
          </table>
          <div class="box-body pull-right" v-if="isEdit">
            <button type="button" class="btn btn-success" @click.stop="onTappedAddNew"><i class="fa fa-plus"></i></button>
          </div>
        </div>
    </div>
      <div class="box-header with-border">
      </div>
  </div>
</template>

<script>
  export default {
    name: 'ReportObjectGroupView',
    props: {
      param: Object,
      list: Array,
      count: Number,
      limit: Number,
      isTablet: Object,
      isRemoveAdd: Boolean,
      isEdit: Boolean,
      offset: 0,
    },
    data() {
      return {
        changedIndex: null,
        fullpage: true,
        DatePickerFormat: 'd',
        language:{
          language: 'Japanese', 
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          monthsAbbr: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
          days: ['日', '月', '火', '水', '木', '金', '土'], 
          rtl: false, 
          ymd: 'yyyy-MM-dd', 
          yearSuffix: '年'
        }
      }
    },
    methods: {
      onTappedUp(index) {
        if (index != 0) {
          this.changedIndex = index - 1;
        const orizin = this.list[index];
        this.list[index] = this.list[index-1];
        this.list[index-1] = orizin;
        this.list.splice();
          setTimeout(() => {
            this.changedIndex = null}
          ,700)
        }
      },
      onTappedDown(index) {
        if (index != (this.list.length-1)) {
          this.changedIndex = index + 1; 
        const orizin = this.list[index];
        this.list[index] = this.list[index+1];
        this.list[index+1] = orizin;
        this.list.splice();
          setTimeout(() => {
            this.changedIndex = null}
          ,700)
        }
      },
      onTappedDelete(index) {
          this.list.splice(index, 1);
      },
      onTappedAddNew() {
        this.list.push({ 'id': '', 'name': '' });
      },
    },
    updated() {

    },
    mounted() {
      this.$emit('child-data', this.list)
    }
  }

</script>
