<template>
  <!-- <span>{{value | name}}</span> -->
  <span class="label" v-bind:class="value=='0'?'label-danger':value=='1'?'label-info':value==2?'label-danger':value==3?'label-primary':value==4?'label-success':value==-1?'label-warning':''" style="border-radius: 3px !important;">{{value | name}}</span>
</template>

<script>
import ListView from "./ListView";
import SearchInputView from "./SearchInputView";
import { event } from "~/plugins/events.js";

export default {
  filters: {
    name(val) {
      switch (val) {
        case "1":
          return '申請中';
        case "2":
          return '差戻し';
        case "3":
          return '再申請中';
        case "4":
          return '承認済';
        case "5":
          return '未申請';
        default:
          return '未申請';
      }
      return '';
    }
  },
  props: {
    value: {
      type: String,
      default: "-1"
    }
  },
  // template: '<span class="label" v-bind:class="value==0?\'label-success\':value==1?\'label-danger\':value==2?\'label-info\':value==3?\'label-info\':value==4?\'label-danger\':value==5?\'label-danger\':\'\'">{{value | name}}</span>'
}
</script>
