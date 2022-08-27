<template>
  <section class="ts_index_buildings">
    <h2 class="ts_heading ts_homme_top">ビル情報</h2>
    <div class="ts_index_buildings_container">
      <div class="ts_index_wrap cursor_pointer"  :class="{pointer_events_none: role=='owner'}" @click="$router.push('/buildings/details/' + param.id)">
        <h3 class="ts_subheading">ビル詳細情報</h3>
        <div class="ts_index_inner">
          <dl>
            <dt>名前</dt>
            <dd>{{param.name}}</dd>
          </dl>
          <dl>
            <dt>住所</dt>
            <dd>〒{{param.zipcode}}<br>{{param.address}}</dd>
          </dl>
          <dl>
            <dt>電話番号</dt>
            <dd>{{param.tel}}</dd>
          </dl>
        </div>
      </div>
      <div class="ts_index_wrap">
        <div class="ts_index_buildings_image">
          <div class="building_img" v-bind:class="{building_image: param.filePath!=null,ts_index_buildings_noimage: param.filePath==null}">
            <img v-if="param.filePath==null" src="~/assets/ts_index-buildings_noimage.svg" alt="">
            <img v-else v-bind:src="param.filePath" alt="">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    props: {
      param: Object,
    },
    data () {
      return {
        role: localStorage.getItem('role'), 
      };
    },
    methods: {
    }
  }
</script>