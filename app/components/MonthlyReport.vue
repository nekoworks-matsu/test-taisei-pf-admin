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
                <th>{{param.columnName[1]}}</th>
                <th>{{param.columnName[2]}}</th>
                <th v-if="isEdit"></th>
	            </tr>
	           </thead>
	          <tbody>
	            <tr role="row" v-for="(item, index) in list" @click="" v-bind:id="index" v-bind:class="{changed_background: (index == changedIndex)}">
                <td　width="83" v-if="isEdit">
                  <button type="button" class="btn btn-default" @click.stop="onTappedUp(index)"><i class="fa fa-caret-up fa-lg"></i></button>&nbsp;&nbsp;&nbsp;
                  <button type="button" class="btn btn-default" @click.stop="onTappedDown(index)"><i class="fa fa-caret-down fa-lg"></i></button>
                </td>
                <td width="60" v-if="isEdit"><vuejs-datepicker :open-date="openDate" :disabled-dates="disabledDates" class="form-control date_picker_day" :clear-button="false" :format="DatePickerFormat" :language="language" name="datepicker" v-model="item.day" placeholder="" minimum-view='day' v-on:click.stop="" ></vuejs-datepicker></td>
                <td width="80" class="vertical_align_middle pointer_events_none" v-if="!isEdit"><span type="text" class="form-control no_border text_center">{{getDay(item.day)}}</span></td>
	            	<td width="60" class="pointer_events_none"><span type="text" class="form-control no_border text_center" v-on:click.stop="">{{onChangeDay(item.day,index)}}</span></td>
	            	
                <td v-if="param.columnName[2]=='特記事項'" class="vertical_align_middle" v-bind:class="{pointer_events_none: !isEdit}">
                  <div class="flex_textarea" v-if="isEdit">
                    <div class="flex_textarea_dummy_one" aria-hidden="true">{{item.text}}</div>
                    <textarea id="FlexTextarea" v-model="item.text" class="flex_textarea_textarea_topic form-control" placeholder="※改行で複数行入力可"></textarea>
                  </div>
                  <div v-if="!isEdit">
                    <span v-html="getColumData(item.text)"></span>
                  </div>
                </td>
                <td v-if="param.columnName[2]=='イベント'" class="vertical_align_middle" v-bind:class="{pointer_events_none: !isEdit}">
                  <div v-if="isEdit">
                    <input type="text" maxlength="64" class="form-control" v-model="item.text">
                  </div>
                  <div v-if="!isEdit">
                    <span v-html="getColumData(item.text)"></span>
                  </div>
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
    name: 'MonthlyReport',
    props: {
      param: Object,
      list: Array,
      onSearch2: Function,
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
        disabledDates: {
          to: new Date("2021-01-01"),
          from: new Date("2021-01-28")
        },
        openDate: new Date("2021-05-01"),
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
      pageClick(offset) {
        if (offset < 0 || offset > this.count) return;
        if (offset == this.count) offset-=this.limit;
        this.onSearch2(offset);
      },
      onTappedUp(index){
      	if (index != 0){
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
      onTappedDown(index){
      	if (index != (this.list.length-1)){
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
      onTappedDelete(index){
          this.list.splice(index,1);
      },
      onTappedAddNew(){
        this.list.push({"day":"","weekday":"","text":"","path":""});
      },
      onChangeDay(day,index){
        this.list[index].weekday = this.getWeekDayStr(new Date(day));
        return this.getWeekDayStr(new Date(day));
      },
      changeRange(from,to){
        this.disabledDates.to = this.param.disabledDates.to;
        this.disabledDates.from = this.param.disabledDates.from;
        this.openDate = this.param.disabledDates.to;
      },
      flexTextarea(el) {
        const dummy = el.querySelector('.flex_textarea_dummy_one');
        if (el.querySelector('.flex_textarea_textarea_topic') != null){
          el.querySelector('.flex_textarea_textarea_topic').addEventListener('input', e => {
            dummy.textContent = e.target.value + '\u200b';
          })
        }
      },
      getDay(date) {
        return date.getDate();
      }
    },
    updated() {
      document.querySelectorAll('.flex_textarea').forEach(this.flexTextarea);
    },
    mounted(){
     setTimeout(() => this.changeRange("",""), 1000);
    }
  }

</script>
