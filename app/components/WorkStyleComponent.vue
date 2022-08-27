<template>
  <span>{{value | name}}</span>
</template>

<script>
import ListView from "./ListView";
import SearchInputView from "./SearchInputView";
import { event } from "~/plugins/events.js";

export default {
  filters: {
    name(val) {
      switch (val) {
        case 1:
          return '日勤';
        case 2:
          return '宿直';
        case 3:
          return '夜勤';
        case 4:
          return '午前';
        case 5:
          return '午後';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Number,
      default: ''
    }
  },
  // template: '<span>{{value | name}}</span>'
}
</script>
