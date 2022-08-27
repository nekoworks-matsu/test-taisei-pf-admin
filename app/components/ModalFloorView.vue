<template>
<!-- modal -->
  <div class="modal fade" v-bind:id="id">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <h4 class="modal-title modal_floor_title">{{title}}</h4>
        </div>
        <div class="modal-body clearfix display_flex align_item_normal">
          <table border="1" class="no_border width_150" style="height: 1px;">
            <tbody>
              <tr class="selectradio selectradio_inline" v-for="index in 5" v-if="getFloorsInfo(index)!=null">
                <td class="selectradio_item no_border" style="border-bottom: medium solid #ddd !important;">
                  <input type="radio" name="floors" :id="'floors' + index" style="display:none" @change="onFloorChange(index)"></input>
                  <label class="cursor_pointer" :for="'floors' + index">{{getFloorsLabel(index)}}</label>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="floor_width">
            <label class="control control_checkbox" style="margin-left: 40px" :hidden="isFloor(i)" v-for="i in param">
              <input type="checkbox" v-model="item.operations[i.id]" v-bind:name="id" v-bind:id="i.id" checked v-if="i.checked">
              <input type="checkbox" v-model="item.operations[i.id]" v-bind:name="id" v-bind:id="i.id" v-if="!i.checked">
              <div class="control_indicator" style="margin-top: 20px"></div>
              <div class="item-text font_normal padding_top_40 margin_left_0" :for="'floor_' + i.name" :hidden="isFloor(i)" style="min-width: 30px;">{{i.name}}<span v-if="type!=4">F</span></div>
            </label>
          </div>
        </div>
        <div class="modal-footer" style="text-align: center">
          <button type="button" class="btn btn-info global_btn" @click="$emit('okbuttonclick', id, column)" v-if="!isNoEdit">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ModalView',
    props: {
      param: Array,
      title: String,
      id: String,
      column: String,
      isNoEdit: Boolean
    },
    data() {
      return {
        floors: [],
        type: '',
        isUpdated: false,
        item: { 
          operations: [],
          reports: []
        },
      };
    },
    methods: {
      onAllSetting(check) {
        var ele = document.getElementsByName(this.id);
        for (var i = 0; i < ele.length; i++) {
          ele[i].checked = check;
        }
      },
      getFloorsLabel(index) {
        return this.getFloorsInfo(index);
      },
      getFloorsInfo(index) {
        var start, end, filter;
        switch (index) {
          case 2:
            start = 1;
            end = 20;
            break;
          case 3:
            start = 21;
            end = 40;
            break;
          case 4:
            start = 41;
            end = 60;
            break;
        }

        if (index == 2 || index == 3　|| index == 4) {
          filter = this.param.filter(val => val.floor_type == 1 && (val.name >= start && val.name <= end));
          if (filter.length != 0) {
            if (index == 2) {
              return '1~20階';
            } else if (index == 3) {
              return '21~40階';
            } else if (index == 4) {
              return '41~60階';
            }
          } else {
            return null;
          }
        } else {
          if (index == 1) {
            filter = this.param.filter(val => val.floor_type == 2);
          } else {
            filter = this.param.filter(val => val.floor_type == 3);
          }
          if (filter.length != 0) {
            if (index == 1) {
              return '地下階';
            } else if (index == 5) {
              return '特殊階';
            }
          } else {
            return null;
          }
        }
      },
      onFloorChange(index) {
        var start, end, type, filter;
        this.type = index;
        if (index == 1) {
          type = 2;
        } else if (index == 2) {
          type = 1;
          start = 1;
          end = 20;
        } else if (index == 3) {
          type = 1
          start = 21;
          end = 40;
        } else if (index == 4) {
          type = 1
          start = 41;
          end = 60;
        }else {
          type = 3
        }

        if (index == 1 || index == 5) {
          filter = this.param.filter(val => val.floor_type == type);
        } else {
          filter = this.param.filter(val => val.floor_type == type && (val.name >= start && val.name <= end));
        }
        this.floors = filter;
      },
      isFloor(floor) {
        var find = this.floors.find(val => val.id == floor.id);
        if (find != undefined) {
          return false;
        } else {
          return true;
        }
      },
      onFloorCheckbox(type, name) {
        var find = this.item.floors.findIndex(val => val.type == type && val.name == name);
        if (find == -1) {
          this.item.floors.push({activated: true, type: type, name: String(name), sort: this.item.floors.length});
          return;
        }
        this.item.floors[find].activated = !this.item.floors[find].activated;
      },
      getFloorsDisplay() {
        if (this.param.find(val => val.floor_type == 2) != undefined ) {
          return 1;
        } else if (this.param.find(val => val.floor_type == 1 && (val.name >= 1 && val.name <= 20)) != undefined ) {
          return 2;
        } else if (this.param.find(val => val.floor_type == 1 && (val.name >= 21 && val.name <= 40)) != undefined ){
          return 3;
        } else if (this.param.find(val => val.floor_type == 1 && (val.name >= 41 && val.name <= 60)) != undefined ){
          return 4;
        } else {
          return 5;
        }
      },
      init() {
        var index = this.getFloorsDisplay();
        this.onFloorChange(index);
        var ele = document.getElementById("floors" + index);
        if (ele != null) {
          ele.checked = true;
        }
      }
    },
    mounted() {
      this.init();
    },
    updated() {
      if (!this.isUpdated) {
        this.init();
        this.isUpdated = true;
      }
    }
  }
</script>