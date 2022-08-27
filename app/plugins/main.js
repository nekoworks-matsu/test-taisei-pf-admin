// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './css'
// import './script'

import Vue from 'vue'
import App from '@/layouts/default'

// import Vue from "vue/dist/vue.esm.js";

import Mixin from './mixin'
import vuejsDatepicker from 'vuejs-datepicker';

Vue.config.productionTip = false

Vue.mixin(Mixin)
Vue.component('vuejsDatepicker', vuejsDatepicker);

// Vue.component('nw-connect-component', {
//   filters: {
//     name(val) {
//       switch (val) {
//         case 0:
//           return '未';
//         case 1:
//           return '済';
//       }
//       return '';
//     }
//   },
//   props: {
//     value: {
//       type: Number,
//       required: true
//     }
//   },
//   template: '<span class="label" v-bind:class="value?\'label-success\':\'label-danger\'">{{value | name}}</span>'
// });

Vue.component('roles-status-component', {
  filters: {
    name(val) {
      switch (val) {
        case 'read':
          return '閲覧のみ';
        case 'admin':
          return '管理者';
      }
      return '';
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  template: '<span class="label" v-bind:class="\'label-default\'">{{value | name}}</span>'
});



Vue.component('connect-type-component', {
  filters: {
    name(val) {
      switch (val) {
        case 0:
          return 'LoRaWAN';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span class="label" v-bind:class="\'label-default\'">{{value | name}}</span>'
});

Vue.component('is-register-component', {
  filters: {
    name(val) {
      switch (val) {
        case false:
          return '未完了';
        case true:
          return '完了';
        case null:
          return '未完了';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Boolean,
      //default: -1
    }
  },
  template: '<span class="label" v-bind:class="value?\'label-success\':\'label-danger\'">{{value | name}}</span>'
});

Vue.component('status-component', {
  filters: {
    name(val) {
      switch (val) {
        case 1:
          return '未対応';
        case 2:
          return '管理人対応予定';
        case 3:
          return '管理会社対応予定';
        case 4:
          return '専門業者対応予定';
        case 5:
          return '完了'
      }
      return '';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span>{{value | name}}</span>'
});

Vue.component('contact-type-component', {
  filters: {
    name(val) {
      switch (val) {
        case 1:
          return '電話';
        case 2:
          return 'メール(SMS)';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span>{{value | name}}</span>'
});

Vue.component('rental-status-component', {
  filters: {
    name(val) {
      switch (val) {
        case 0:
          return 'レンタル中';
        case 1:
          return '返却済';
        case 2:
          return '強制返却';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span class="label" v-bind:class="value==0?\'label-info\':value==1?\'label-success\':value==2?\'label-danger\':\'\'">{{value | name}}</span>'
});

Vue.component('charge-complete-status-component', {
  filters: {
    name(val) {
      switch (val) {
        case 0:
          return '決済完了';
        case 1:
          return '決済失敗';
        case 2:
          return '再決済完了';
        case 3:
          return '返金完了';
        case 4:
          return '返金失敗';
        case 5:
          return '決済失敗(システムエラー)';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span class="label" v-bind:class="value==0?\'label-success\':value==1?\'label-danger\':value==2?\'label-info\':value==3?\'label-info\':value==4?\'label-danger\':value==5?\'label-danger\':\'\'">{{value | name}}</span>'
});

Vue.component('connect-status-component', {
  filters: {
    name(val) {
      switch (val) {
        case 0:
          return 'ONLINE';
        case 1:
          return 'OFFLINE';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span class="label" v-bind:class="value?\'label-danger\':\'label-success\'">{{value | name}}</span>'
});

Vue.component('direction-component', {
  filters: {
    name(val) {
      switch (val) {
        case 'up':
          return '上り';
        case 'down':
          return '下り';
      }
      return '';
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  template: '<span class="label" v-bind:class="value==\'up\'?\'label-warning\':value==\'down\'?\'label-info\':\'\'"><i class="fa" v-bind:class="value==\'up\'?\'fa-arrow-up\':value==\'down\'?\'fa-arrow-down\':\'\'"></i> {{value | name}}</span>'
});

Vue.component('available-status-component', {
  filters: {
    name(val) {
      switch (val) {
        case 0:
          return '利用中';
        case 1:
          return '利用停止';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span class="label" v-bind:class="value?\'label-danger\':\'label-success\'">{{value | name}}</span>'
});

Vue.component('invalid-status-component', {
  filters: {
    name(val) {
      switch (val) {
        case 0:
          return '有効';
        case 1:
          return '無効';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span class="label" v-bind:class="value?\'label-danger\':\'label-success\'">{{value | name}}</span>'
});

Vue.component('price-type-component', {
  filters: {
    name(val) {
      switch (val) {
        case 0:
          return '有料一般自転車';
        case 1:
          return '有料電動自転車';
        case 2:
          return '無料一般自転車';
        case 3:
          return '無料電動自転車';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span>{{value | name}}</span>'
});

Vue.component('area-type-component', {
  filters: {
    name(val) {
      switch (val) {
        case 1:
          return '北海道';
        case 2:
          return '青森県';
        case 3:
          return '岩手県';
        case 4:
          return '宮城県';
        case 5:
          return '秋田県';
        case 6:
          return '山形県';
        case 7:
          return '福島県';
        case 8:
          return '茨城県';
        case 9:
          return '栃木県';
        case 10:
          return '群馬県';
        case 11:
          return '埼玉県';
        case 12:
          return '千葉県';
        case 13:
          return '東京都';
        case 14:
          return '神奈川県';
        case 15:
          return '新潟県';
        case 16:
          return '富山県';
        case 17:
          return '石川県';
        case 18:
          return '福井県';
        case 19:
          return '山梨県';
        case 20:
          return '長野県';
        case 21:
          return '岐阜県';
        case 22:
          return '静岡県';
        case 23:
          return '愛知県';
        case 24:
          return '三重県';
        case 25:
          return '滋賀県';
        case 26:
          return '京都府';
        case 27:
          return '大阪府';
        case 28:
          return '兵庫県';
        case 29:
          return '奈良県';
        case 30:
          return '和歌山県';
        case 31:
          return '鳥取県';
        case 32:
          return '島根県';
        case 33:
          return '岡山県';
        case 34:
          return '広島県';
        case 35:
          return '山口県';
        case 36:
          return '徳島県';
        case 37:
          return '香川県';
        case 38:
          return '愛媛県';
        case 39:
          return '高知県';
        case 40:
          return '福岡県';
        case 41:
          return '佐賀県';
        case 42:
          return '長崎県';
        case 43:
          return '熊本県';
        case 44:
          return '大分県';
        case 45:
          return '宮崎県';
        case 46:
          return '鹿児島県';
        case 47:
          return '沖縄県';
      }
      return '';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span>{{value | name}}</span>'
});

Vue.component('order-component', {
  filters: {
    name(val) {
      if (val > 0 && val != null) {
        return val;
      }
      return '---';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span>{{value | name}}</span>'
});

Vue.component('battery-component', {
  filters: {
    name(val) {
      if (val > 0 && val != null) {
        return val + '%';
      }
      return '---';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span>{{value | name}}</span>'
});

Vue.component('bicycle-number-component', {
  filters: {
    name(val) {
      if (val >= 0 && val != null) {
        return val;
      }
      return '---';
    }
  },
  props: {
    value: {
      type: Number,
      default: -1
    }
  },
  template: '<span>{{value | name}}</span>'
});

Vue.component('roles-component', {
  filters: {
    name(val) {
      switch (val) {
        case 'captain':
          return '閲覧のみ';
        case 'admin':
          return '管理者';
      }
      return 'ほげ';
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  template: '<span>{{value | name}}</span>'
});

/* eslint-disable no-new */
new Vue({
  // el: '#app',
 // router,
  components: { App },
  template: '<App/>',
})
