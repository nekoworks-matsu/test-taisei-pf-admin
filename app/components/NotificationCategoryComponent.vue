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
          return '更新情報';
        case 2:
          return 'メンテナンス';
        case 3:
          return '重要';
        case 4:
          return '不具合情報';
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
