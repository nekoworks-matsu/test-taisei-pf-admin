<template>
  <section class="ts_index_information ts_information">
    <h2 class="ts_heading">お知らせ</h2>
    <div class="ts_index_wrap">
      <h2 class="ts_subheading">ニュース</h2>
      <div class="ts_information_wrap">
        <div class="tabs">
          <input id="tab_all" type="radio" name="tab_item" checked>
          <label class="tab_item" for="tab_all" @click="getInformationInfo(0)"><span>すべて</span></label>
          <input id="tab_update" type="radio" name="tab_item">
          <label class="tab_item" for="tab_update" @click="getInformationInfo(1)"><span>更新情報</span></label>
          <input id="tab_maintenance" type="radio" name="tab_item">
          <label class="tab_item" for="tab_maintenance" @click="getInformationInfo(2)"><span>メンテナンス</span></label>
          <input id="tab_important" type="radio" name="tab_item">
          <label class="tab_item" for="tab_important" @click="getInformationInfo(3)"><span>重要</span></label>
          <input id="tab_bug" type="radio" name="tab_item">
          <label class="tab_item" for="tab_bug" @click="getInformationInfo(4)"><span>不具合情報</span></label>

          <!-- すべて -->
          <div class="tab_content" id="tab_all_content">
            <ul class="ts_information_list" v-for="info in informationInfo">
              <li class="cursor_pointer" @click="$router.push('/information/details/'+info.id)">
                <p class="ts_information_date">{{df4(info.displayFrom)}}</p>
                <span class="ts_information_label info_label" v-bind:class="info.category==1?'ts_information_label_01':info.category==2?'ts_information_label_03':info.category==3?'ts_information_label_02':info.category==4?'ts_information_label_04':''">{{getInfoCategory(info.category)}}</span>
                <p class="ts_information_description">{{info.title}}</p>
              </li>
            </ul>
            <ul class="ts_information_list" role="row" v-if="informationInfo.length==0">
              <li>
                <span>表示するお知らせは有りません</span>
              </li>
            </ul>
          </div>
          <div class="tab_content" id="tab_update_content">
            <ul class="ts_information_list" v-for="info in informationInfo">
              <li class="cursor_pointer" @click="$router.push('/information/details/'+info.id)">
                <p class="ts_information_date">{{df4(info.displayFrom)}}</p>
                <span class="ts_information_label info_label ts_information_label_01">{{getInfoCategory(info.category)}}</span>
                <p class="ts_information_description">{{info.title}}</p>
              </li>
            </ul>
            <ul class="ts_information_list" role="row" v-if="informationInfo.length==0">
              <li>
                <span>表示するお知らせは有りません</span>
              </li>
            </ul>
          </div>
          <div class="tab_content" id="tab_maintenance_content">
            <ul class="ts_information_list" v-for="info in informationInfo">
              <li class="cursor_pointer" @click="$router.push('/information/details/'+info.id)">
                <p class="ts_information_date">{{df4(info.displayFrom)}}</p>
                <span class="ts_information_label info_label ts_information_label_03">{{getInfoCategory(info.category)}}</span>
                <p class="ts_information_description">{{info.title}}</p>
              </li>
            </ul>
            <ul class="ts_information_list" role="row" v-if="informationInfo.length==0">
              <li>
                <span>表示するお知らせは有りません</span>
              </li>
            </ul>
          </div>
          <div class="tab_content" id="tab_important_content">
            <ul class="ts_information_list" v-for="info in informationInfo">
              <li class="cursor_pointer" @click="$router.push('/information/details/'+info.id)">
                <p class="ts_information_date">{{df4(info.displayFrom)}}</p>
                <span class="ts_information_label info_label ts_information_label_02">{{getInfoCategory(info.category)}}</span>
                <p class="ts_information_description">{{info.title}}</p>
              </li>
            </ul>
            <ul class="ts_information_list" role="row" v-if="informationInfo.length==0">
              <li>
                <span>表示するお知らせは有りません</span>
              </li>
            </ul>
          </div>
          <div class="tab_content" id="tab_bug_content">
            <ul class="ts_information_list" v-for="info in informationInfo">
              <li class="cursor_pointer" @click="$router.push('/information/details/'+info.id)">
                <p class="ts_information_date">{{df4(info.displayFrom)}}</p>
                <span class="ts_information_label info_label ts_information_label_04">{{getInfoCategory(info.category)}}</span>
                <p class="ts_information_description">{{info.title}}</p>
              </li>
            </ul>
            <ul class="ts_information_list" role="row" v-if="informationInfo.length==0">
              <li>
                <span>表示するお知らせは有りません</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    data() {
      return {
        roles: [],
        informationInfo: {}
      }
    },
    props: {
      param: Object,
    },
    methods: {
      getInformationInfo(category) {
        var searchWhere = {"and":[{"displayTo":{"gte":this.df(new Date())}},{"displayFrom":{"lte":this.df(new Date())}},{"display":true}]};
        if (category != 0) {
          searchWhere.and.push({"category": category});
        }
        const list = [];
        this.onSearch('/notifications', null, searchWhere, val => {
          val.forEach(function(val) {
            list.push(val);
          })
          this.informationInfo = list;
        });
      },
      getInfoCategory(id) {
        switch(id) {
          case 1:
            return '更新情報';
          case 2:
            return 'メンテナンス';
          case 3:
            return '重要';
          case 4:
            return '不具合情報';

        }
      }
    },
    created() {
      this.getInformationInfo(0);
    }
  }
</script>