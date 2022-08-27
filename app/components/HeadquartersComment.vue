<template>
  <!-- <span class="label" v-bind:class="value==null?'label-info':value!=null?'label-danger':''">{{value | name}}</span> -->
  <span class="label" v-bind:class="value!=null?'label-danger':''">{{value | name}}</span>
</template>

<script>
import ListView from "./ListView";
import SearchInputView from "./SearchInputView";
import { event } from "~/plugins/events.js";

export default {
  filters: {
    name(val) {
      if (val.length != 0) {
        return 'あり';
      } else {
        return '';
      }
    }
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  // template: '<span class="label" v-bind:class="value==0?\'label-success\':value==1?\'label-danger\':value==2?\'label-info\':value==3?\'label-info\':value==4?\'label-danger\':value==5?\'label-danger\':\'\'">{{value | name}}</span>'
}
</script>
