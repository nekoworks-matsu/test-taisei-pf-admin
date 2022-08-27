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
        case true:
          return '利用可能';
        case false:
          return '利用不可';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Boolean,
      default: ''
    }
  },
  // template: '<span>{{value | name}}</span>'
}
</script>
