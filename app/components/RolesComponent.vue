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
          return '責任者';
        case 2:
          return 'スタッフ';
        case 3:
          return 'ビルオーナー';
        case 4:
          return '契約会社管理者';
        case 5:
          return 'T-Spider管理者';
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
