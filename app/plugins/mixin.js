import request from 'superagent'
import dateFormat from 'dateformat'
import { store } from '@/store/store.js'
import moment from 'moment'
import { permission } from '~/store'

const lora_packet = require('lora-packet')

export default {
  data() {
    return {
      items: [],
      item: {},
      itemInfo: '',
      store: store,
      reqs: [],
      loading: false,
      imageHeaderUrl: process.env.RESOURCE_SERVER,
      isDev: process.env.NODE_ENV == 'development',
      now: ~~(Date.now() / 10000)
    }
  },
  beforeDestroy() {
    this.requestAbort()
  },
  middleware: ['permissions'],
  methods: {
    checkDisplayPermission(key, cb) {
      if (this.checkMenuPermission(key)) {
        cb()
      } else {
        alert('利用できる権限を持っていません')
        if (localStorage.getItem('is_tablet') == 'true') {
          this.$router.push('/t_login')
        } else {
          this.$router.push('/login')
        }
      }
    },
    checkMenuPermission(key) {
      return permission.hasMenu(key)
    },
    checkItemPermission(key) {
      return permission.hasItem(key)
    },
    getUserId() {
      return localStorage.getItem('userid')
    },

    requestAbort() {
      this.reqs.forEach((req) => req.abort())
    },

    decodeLoraPacket(data, nwkskey, appskey) {
      try {
        const phyPayload = new Buffer(data.phyPayload, 'hex')
        const packet = lora_packet.fromWire(phyPayload)
        const NwkSKey = new Buffer(nwkskey, 'hex')
        const AppSKey = new Buffer(appskey, 'hex')
        return Buffer.from(
          lora_packet.decrypt(packet, AppSKey, NwkSKey)
        ).toString('hex')
      } catch (e) {
        return ''
      }
    },
    // formatter系
    df(date, format) {
      try {
        if (date < 10000000000) date *= 1000
        return date ? dateFormat(date, format || 'yyyy/mm/dd HH:MM:ss') : '---'
      } catch (e) {
        return '---'
      }
    },
    df2(date, format) {
      try {
        if (date < 10000000000) date *= 1000
        return date ? dateFormat(date, format || 'yyyy/mm/dd HH:MM') : '---'
      } catch (e) {
        return '---'
      }
    },
    df3(date, format) {
      try {
        if (date < 10000000000) date *= 1000
        return date ? dateFormat(date, format || 'yyyy/mm/dd') : '---'
      } catch (e) {
        return '---'
      }
    },
    df4(date, format) {
      try {
        if (date < 10000000000) date *= 1000
        return date ? dateFormat(date, format || 'yyyy.mm.dd') : '---'
      } catch (e) {
        return '---'
      }
    },
    dfMonth(date, format) {
      try {
        if (date < 10000000000) date *= 1000
        return date ? dateFormat(date, format || 'yyyy/mm') : '---'
      } catch (e) {
        return '---'
      }
    },
    df_jst(date, format) {
      try {
        if (date < 10000000000) date *= 1000
        return date ? dateFormat(date, format || 'yyyy-mm-dd HH:MM:ss') : '---'
      } catch (e) {
        return '---'
      }
    },
    df_utc(date, format) {
      try {
        var normalizedDateStr = date.replace(/Z$/, '+09:00')
        return new Date(normalizedDateStr).toISOString()
      } catch (e) {
        return '---'
      }
    },
    get_now_date(type) {
      var dt = new Date()
      if (type == 'YYYYY/MM/DD') {
        var y = dt.getFullYear()
        var m = ('00' + (dt.getMonth() + 1)).slice(-2)
        var d = ('00' + dt.getDate()).slice(-2)
        var result = y + '/' + m + '/' + d
      } else if (type == 'HH') {
        result = dt.getHours()
      } else if (type == 'MI') {
        result = dt.getMinutes()
      }
      return result
    },
    getDateRemoveMinutes(date) {
      var dt = new Date(date)
      dt.setMinutes(dt.getMinutes() - 1)
      return dt
    },
    getDateAddMinutes(date) {
      var dt = new Date(date)
      dt.setMinutes(dt.getMinutes() + 1)
      return dt
    },
    /**
     * フロア表示
     * floors: そのビルのフロアすべて
     * checkFloors: モーダルウィンドウでチェック済みのフロア
     * isText: テキスト表示用フラグ
     */
    displayFloorFormat(floors, checkFloors, isText) {
      var res
      if (isText) {
        res = this.floorFormat(
          this.convertFloors(
            this.sortFloors(floors, isText),
            checkFloors,
            isText
          )
        )
      } else {
        res = this.convertFloors(
          this.sortFloors(floors, isText),
          checkFloors,
          isText
        )
      }
      return res
    },
    /**
     * モーダルウィンドウでチェック済みのフロアデータの整形
     */
    modalCheckFloorsFormat(content, floors, type) {
      var res
      var checked = [],
        allFloors = [],
        displayFloor = []
      for (var i = 0; i < content.length; i++) {
        if (content[i].checked) {
          checked.push(parseInt(content[i].id.replace('floor_', '')))
          displayFloor.push({
            name: floors[i].value,
            input_type: floors[i].type,
            id: floors[i].id,
            activated: content[i].checked,
            type: floors[i].floor_type
          })
        }
        allFloors.push({
          name: floors[i].name,
          value: floors[i].value,
          type: floors[i].type,
          id: floors[i].id,
          checked: content[i].checked,
          floor_type: floors[i].floor_type
        })
      }
      if (type == 1) {
        res = this.floorFormat(
          this.convertFloors(this.sortFloors(displayFloor, true), null, true)
        )
      } else if (type == 2) {
        res = allFloors
      } else {
        res = checked
      }
      return res
    },
    /**
     * 一覧/報告書に必要なフロア情報のみ抽出
     */
    getExtractFloorsData(floors) {
      var res = []
      if (floors == undefined) {
        return res
      }
      for (var i = 0; i < floors.length; i++) {
        if (floors[i]) {
          if (floors[i].floor) {
            res.push(floors[i].floor)
          }
        }
      }
      return res
    },
    /**
     * フロアタイプごとのデータの並び替え
     */
    sortFloorType(floors, type, isAsc) {
      var resData = floors.filter(function(a) {
        if (a != undefined) {
          return a.type == type
        }
      })
      resData.sort(function(a, b) {
        if (isAsc) {
          if (parseInt(a.name) < parseInt(b.name)) {
            return -1
          } else {
            return 1
          }
        } else {
          if (parseInt(a.name) > parseInt(b.name)) {
            return -1
          } else {
            return 1
          }
        }
      })
      return resData
    },
    /**
     * フロアデータの再生成
     */
    composeFloors(res, type_data) {
      for (var i = 0; i < type_data.length; i++) {
        res.push(type_data[i])
      }
      return res
    },
    /**
     * apiから取得したフロアデータの並び替え
     */
    sortFloors(floors, isText) {
      var res = []
      if (isText) {
        res = this.composeFloors(res, this.sortFloorType(floors, 1, true))
        res = this.composeFloors(res, this.sortFloorType(floors, 2, true))
        res = this.composeFloors(
          res,
          floors.filter(function(a) {
            if (a != undefined) {
              return a.type == 3
            }
          })
        )
      } else {
        res = this.composeFloors(
          res,
          floors.filter(function(a) {
            if (a != undefined) {
              return a.type == 3
            }
          })
        )
        res = this.composeFloors(res, this.sortFloorType(floors, 1, false))
        res = this.composeFloors(res, this.sortFloorType(floors, 2, true))
      }
      return res
    },
    /**
     * フロアデータを表示用に整形
     */
    convertFloors(floors, checkFloors, isCheck) {
      var allFloors = [],
        displayFloors = []
      var name

      for (var i = 0; i < floors.length; i++) {
        if (floors[i].activated) {
          if (floors[i].type == '2') {
            name = 'B' + floors[i].name
          } else {
            name = floors[i].name
          }
          if (checkFloors != null) {
            if (checkFloors.indexOf(floors[i].id) != -1) {
              allFloors.push({
                name: name,
                value: floors[i].name,
                type: 'checkbox',
                id: floors[i].id,
                checked: true,
                floor_type: floors[i].type
              })
              displayFloors.push({
                name: name,
                value: floors[i].name,
                type: 'checkbox',
                id: floors[i].id,
                checked: true,
                floor_type: floors[i].type
              })
            } else {
              allFloors.push({
                name: name,
                value: floors[i].name,
                type: 'checkbox',
                id: floors[i].id,
                checked: false,
                floor_type: floors[i].type
              })
            }
          } else {
            displayFloors.push({
              name: name,
              value: floors[i].name,
              type: 'checkbox',
              id: floors[i].id,
              checked: true,
              floor_type: floors[i].type
            })
            allFloors.push({
              name: name,
              value: floors[i].name,
              type: 'checkbox',
              id: floors[i].id,
              checked: true,
              floor_type: floors[i].type
            })
          }
        }
      }
      var res = isCheck ? displayFloors : allFloors
      return res
    },
    /**
     * フロアデータの表示フォーマット
     */
    floorFormat(floors) {
      var displayFloor = ''
      for (var i = 0; i < floors.length; i++) {
        if (i == 0) {
          switch (floors[i].floor_type) {
            case 1:
              displayFloor += floors[i].value + 'F'
              break
            case 2:
              displayFloor += 'B' + floors[i].value + 'F'
              break
            case 3:
              displayFloor += floors[i].value
              break
          }
        } else if (i == floors.length - 1) {
          if (floors[i].floor_type == floors[i - 1].floor_type) {
            if (
              parseInt(floors[i].value) !=
              parseInt(floors[i - 1].value) + 1
            ) {
              displayFloor += ', '
            } else {
              displayFloor += '~'
            }
          } else {
            displayFloor += ', '
          }
          switch (floors[i].floor_type) {
            case 1:
              displayFloor += floors[i].value + 'F'
              break
            case 2:
              displayFloor += 'B' + floors[i].value + 'F'
              break
            case 3:
              displayFloor += floors[i].value
              break
          }
          // if (floors[i].floor_type == 1) {
          //   if (floors[i].floor_type == floors[i - 1].floor_type) {
          //     if (parseInt(floors[i].value) != parseInt(floors[i - 1].value) - 1) {
          //       displayFloor += ", ";
          //     } else {
          //       displayFloor += "~";
          //     }
          //   } else {
          //     displayFloor += ", ";
          //   }
          //   displayFloor += floors[i].value + "F";
          // } else {
          //   if (floors[i].floor_type == floors[i - 1].floor_type) {
          //     if (parseInt(floors[i].value) != parseInt(floors[i - 1].value) + 1) {
          //       displayFloor += ", ";
          //     } else {
          //       displayFloor += "~";
          //     }
          //   } else {
          //     displayFloor += ", ";
          //   }
          //   switch(floors[i].floor_type) {
          //     case 1:
          //       displayFloor += floors[i].value + "F";
          //       break;
          //     case 2:
          //       displayFloor += "B" + floors[i].value + "F";
          //       break;
          //     case 3:
          //       displayFloor += floors[i].value;
          //       break;
          //   }
          // }
        } else {
          if (floors[i].floor_type == floors[i - 1].floor_type) {
            if (
              parseInt(floors[i].value) !=
              parseInt(floors[i - 1].value) + 1
            ) {
              switch (floors[i].floor_type) {
                case 1:
                  displayFloor += ', ' + floors[i].value + 'F'
                  break
                case 2:
                  displayFloor += ', ' + 'B' + floors[i].value + 'F'
                  break
                case 3:
                  displayFloor += ', ' + floors[i].value
                  break
              }
            } else if (
              parseInt(floors[i].value) !=
              parseInt(floors[i + 1].value) - 1
            ) {
              switch (floors[i].floor_type) {
                case 1:
                  displayFloor += '~' + floors[i].value + 'F'
                  break
                case 2:
                  displayFloor += '~' + 'B' + floors[i].value + 'F'
                  break
                case 3:
                  displayFloor += floors[i].value
                  break
              }
            }
          } else {
            switch (floors[i].floor_type) {
              case 1:
                displayFloor += ', ' + floors[i].value + 'F'
                break
              case 2:
                displayFloor += ', ' + 'B' + floors[i].value + 'F'
                break
              case 3:
                displayFloor += ', ' + floors[i].value
                break
            }
          }

          // if (floors[i].floor_type == 1) {
          //   if (floors[i].floor_type == floors[i - 1].floor_type) {
          //     if (parseInt(floors[i].value) != parseInt(floors[i - 1].value) - 1) {
          //       displayFloor += ", " + floors[i].value + "F";
          //     } else if (((parseInt(floors[i].value) != parseInt(floors[i + 1].value) + 1)) || (floors[i].floor_type != floors[i + 1].floor_type))  {
          //       displayFloor += "~" + floors[i].value + "F";
          //     }
          //   } else {
          //     displayFloor += ", " + floors[i].value + "F";
          //   }
          // } else {
          //   if (floors[i].floor_type == floors[i - 1].floor_type) {
          //     if (parseInt(floors[i].value) != parseInt(floors[i - 1].value) + 1) {
          //       switch(floors[i].floor_type) {
          //         case 2:
          //           displayFloor += ", " + "B" + floors[i].value + "F";
          //           break;
          //         case 3:
          //           displayFloor += ", " + floors[i].value;
          //           break;
          //       }
          //     } else if (parseInt(floors[i].value) != parseInt(floors[i + 1].value) - 1) {
          //       switch(floors[i].floor_type) {
          //         case 2:
          //           displayFloor += "~" + "B" + floors[i].value + "F";
          //           break;
          //         case 3:
          //           displayFloor += floors[i].value;
          //           break;
          //       }
          //     }
          //   } else {
          //     switch(floors[i].floor_type) {
          //       case 2:
          //         displayFloor += ", " + "B" + floors[i].value + "F";
          //         break;
          //       case 3:
          //         displayFloor += ", " + floors[i].value;
          //         break;
          //     }
          //   }
          // }
        }
      }
      return displayFloor
    },

    multipartReq(path, method, param, file, cb) {
      if (cb === undefined && typeof param === 'function') {
        cb = param
        param = null
      }
      const url =
        path.substr(0, 4) == 'http' ? path : process.env.API_SERVER + path
      let req = null
      if (method == 'post') req = request.post(url)
      else if (method == 'patch') req = request.patch(url)
      req.timeout({
        response: 150000,
        deadline: 300000
      })
      if (param == 'monthly') {
        param = { s3RootPath: 'monthly-report-images' }
      } else if (param == 'business') {
        param = { s3RootPath: 'business-report-images' }
      } else if (param == null) {
        param = { s3RootPath: 'images' }
      } else {
        if (param.order == null) param.order = '' // requestが空の場合、application/jsonとなるため
      }
      if (file != null) {
        req.attach('file', file, file.name).field(param)
      } else {
        req.field(param)
      }
      this.loading = true
      req
        .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
        .end((err, res) => {
          this.loading = false
          if (err && (err.status == 401 || err.status == 403)) {
            this.store.clear()
            this.$router.redirect = this.$route.fullPath
            this.$router.push('/login')
            event.emit('login-update')
          } else if (err && err.timeout) {
            alert('サーバー接続がタイムアウトしました')
          } else if (res === undefined) {
            alert('APIサーバーに接続できません') // APIサーバのみ接続不能になった場合の処理
          } else if (cb) {
            cb && cb(err, res)
          }
        })
      this.reqs.push(req)
    },
    req(path, method, param, cb) {
      if (cb === undefined && typeof param === 'function') {
        cb = param
        param = null
      }
      const url =
        path.substr(0, 4) == 'http' ? path : process.env.API_SERVER + path
      let req = null

      if (method == 'post') req = request.post(url)
      else if (method == 'patch') req = request.patch(url)
      else if (method == 'delete') req = request.delete(url)
      else {
        req = request.get(url)
        param && req.query(param)
      }
      // let response_time = 15000;
      // let deadline_time = 30000;

      let response_time = 3600000
      let deadline_time = 3600000
      req.timeout({
        response: response_time,
        deadline: deadline_time
      })

      param && req.send(param)
      this.loading = true
      req
        .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
        .end((err, res) => {
          this.loading = false
          if (err && (err.status == 401 || err.status == 403)) {
            if (localStorage.getItem('is_tablet') == 'true') {
              this.store.clearTablet()
              this.$router.push('/t_login')
            } else {
              if (
                this.$route.fullPath.includes('/report_approval/details') ||
                this.$route.fullPath.includes('/report/details')
              ) {
                this.$router.redirect = this.$route.fullPath
              }
              this.store.clear()
              this.$router.push('/login')
            }
            event.emit('login-update')
          } else if (err && err.status == 404) {
            if (localStorage.getItem('is_tablet') == 'true') {
              this.store.clearTablet()
              this.$router.push('/t_login')
            } else {
              this.store.clear()
              this.$router.push('/login')
            }
          } else if (err && err.timeout) {
            alert('サーバー接続がタイムアウトしました')
          } else if (res === undefined) {
            alert('APIサーバーに接続できません') // APIサーバのみ接続不能になった場合の処理
          } else if (cb) {
            cb && cb(err, res)
          }
        })
      this.reqs.push(req)
    },
    getErrorMsg(error, optColm, optErrorCode) {
      const colm = {
        email: 'メールアドレス',
        newPassword: 'パスワード',
        name: 'クライアント名称',
        postal_code: '郵便番号',
        address: '住所',
        tel: '電話番号',
        password: 'パスワード',
        username: 'Adminユーザー名称',
        role: '権限'
      }
      Object.assign(colm, optColm || {})
      const errCode = {
        minLength: 'パスワードが短すぎます',
        presence: '必須項目です',
        format: '不正な値です',
        inclusion: '不正な値です',
        'length.max': '文字数オーバーです',
        'custom.email': 'メールアドレスの形式が不正です',
        uniqueness: 'すでに登録されています',
        pattern: 'パスワードの形式が違います',
        maxLength: 'パスワードが長すぎます'
      }
      Object.assign(errCode, optErrorCode || {})

      if (error.code != 'VALIDATION_FAILED') {
        return error.message
      }

      error = error.details
      const errorList = []
      const duplicationList = []
      error.forEach(function(obj) {
        if (duplicationList.indexOf(colm[obj.field]) == -1) {
          duplicationList.push(colm[obj.field])
          errorList.push([colm[obj.field], errCode[obj.code]])
        }
        // errorList[colm[obj.field]] = errCode[obj.code];
      })

      try {
        let msg = []
        if (error) {
          errorList.forEach(function(obj) {
            msg.push(obj[0] + ' : ' + obj[1])
          })
        } else {
          msg.push(error.message)
        }
        return msg.join('\n')
      } catch (e) {
        return ''
      }
    },
    getErrorMsg2(error, columns) {
      error = error && error.body && error.body.error ? error.body.error : error
      const errCode = {
        required: '必須項目です',
        'custom.presence': '必須項目です',
        format: '不正なフォーマットです',
        inclusion: '不正な値です',
        enum: '不正な値です',
        'numericality.number': '不正な値です',
        'length.max': '文字数オーバーです',
        'custom.email': 'メールアドレスの形式が不正です',
        pattern: '不正な値です',
        minItems: '必須項目です',
        floor_required: '未入力の項目があります',
        floor_pattern: '不正な値の項目があります',
        uniqueness: 'すでに登録されています',
        uniquenessMail: 'メールアドレス : すでに登録されています',
        uniquenessLoginId: 'アカウントID : すでに登録されています',
        floorMustBeUnique: 'フロア : 重複したフロアが入力されています',
        autoConfigMustBeUnique: '選択中のビルではすでに登録されています',
        VALIDATION_FAILED: 'バリデーションエラー',
        minimum: '不正な値です',
        maximum: '不正な値です',
        UNSUPPORTED_MEDIA_TYPE: 'ファイルが不正です',
        correlation: '不正な範囲指定です',
        type: '不正な値です',
        maxLength: '文字数オーバーです',
        patternPass: 'パスワードの形式が違います',
        passwordMin: 'パスワードが短すぎます',
        passwordMax: 'パスワードが長すぎます',
        actionType: '必須項目です',
        objectGroup_duplicated: '業務グループ: 重複しています',
        objectGroup_type: '未入力の項目があります',
        duplicated_buildingid_type:
          '選択中のビルIDと業務種別の組み合わせは既に登録されています',
        add_required: '必須の業務項目は後から追加できません'
      }
      try {
        if (
          error.code == 'ER_DUP_ENTRY' &&
          error.message.indexOf('email') != -1
        ) {
          return errCode['uniquenessMail']
        }
        if (
          error.code == 'ER_DUP_ENTRY' &&
          error.message.indexOf('loginId') != -1
        ) {
          return errCode['uniquenessLoginId']
        }

        if (error.code == 'MUST_BE_UNIQUE') {
          if (error.message == 'Floor must be unique') {
            return errCode['floorMustBeUnique']
          } else if (
            error.message ==
            'The same data is already registered with the combination of buildingId and operationCategoryId'
          ) {
            return errCode['autoConfigMustBeUnique']
          }
        }

        if (
          error.message ==
          'combination of buildingId and operationTypeId is duplicated'
        ) {
          return errCode['duplicated_buildingid_type']
        }

        if (error.message == 'ObjectGroup is duplicated') {
          return errCode['objectGroup_duplicated']
        }

        if (error.message == 'Adding new required field is not allowed') {
          return errCode['add_required']
        }

        if (error.code != 'VALIDATION_FAILED') {
          return errCode[error.code] || error.message
        }
        if (!error.details.length) {
          return error.message
        }

        error = error.details
        const errorList = {}
        error.forEach(function(obj) {
          if (obj.field == 'password' && obj.code == 'minLength') {
            errorList[obj.field] = errCode['passwordMin']
          } else if (obj.field == 'password' && obj.code == 'maxLength') {
            errorList[obj.field] = errCode['passwordMax']
          } else if (obj.field == 'password' && obj.code == 'pattern') {
            errorList[obj.field] = errCode['patternPass']
          } else if (obj.field == 'email' && obj.code == 'format') {
            errorList['email'] = errCode['custom.email']
          } else if (obj.path.indexOf('floor') == 1) {
            errorList['floors'] = errCode['floor_' + obj.code]
          } else if (obj.field == 'actionType' && obj.code == 'required') {
            errorList[obj.field] = errCode['actionType']
          } else if (
            obj.field == 'name' &&
            obj.code == 'required' &&
            obj.path.indexOf('.reportFields') > -1
          ) {
            errorList['reportFields'] = errCode['required']
          } else if (
            obj.code == 'type' &&
            obj.path.indexOf('.reportObjectGroupList') > -1
          ) {
            errorList['reportObjectGroupList'] = errCode['objectGroup_type']
          } else {
            if (errorList[obj.field] == null) {
              errorList[obj.field] = errCode[obj.code]
            }
          }
        })

        const codes = Object.keys(errorList)
        const errColumns = columns.filter((e) => codes.indexOf(e.column) != -1)
        const unErrCodes = codes.filter(
          (code) => !columns.find((col) => col.column == code)
        )

        return [
          ...errColumns.map(
            (column) =>
              column.name +
              ' : ' +
              (errorList[column.column] || error[column.column][0])
          ),
          ...unErrCodes.map(
            (code) => code + ':' + (errCode[error[code][0]] || error[code][0])
          )
        ].join('\n')
      } catch (e) {
        return errCode['VALIDATION_FAILED']
      }
    },
    getMajoritemsErrorMsg(error, columns) {
      error = error && error.body && error.body.error ? error.body.error : error
      const errCode = {
        required: '必須項目です',
        format: '不正なフォーマットです',
        inclusion: '不正な値です',
        'numericality.number': '不正な値です',
        'length.max': '文字数オーバーです',
        pattern: '不正な値です',
        minimum: '不正な値です',
        maximum: '不正な値です',
        UNSUPPORTED_MEDIA_TYPE: 'ファイルが不正です',
        correlation: '不正な範囲指定です',
        type: '不正な値です',
        maxLength: '文字数オーバーです'
      }
      try {
        const errorList = []

        if (error.details) {
          error.details.forEach(function(obj) {
            var col = columns.find(
              (v) => v.path === obj.path.replace('.dateValue', '')
            )
            var errmsg = col.name + ' : ' + errCode[obj.code]
            errorList.unshift(errmsg)
          })
          return errorList.join('\n')
        }
      } catch (e) {
        return ''
      }
    },
    getMonthlyReportErrorMsg(error, columns) {
      error = error && error.body && error.body.error ? error.body.error : error
      const errCode = {
        required: '必須項目です',
        format: '不正なフォーマットです',
        inclusion: '不正な値です',
        'numericality.number': '不正な値です',
        'length.max': '文字数オーバーです',
        pattern: '不正な値です',
        minimum: '不正な値です',
        maximum: '不正な値です',
        UNSUPPORTED_MEDIA_TYPE: 'ファイルが不正です',
        correlation: '不正な範囲指定です',
        type: '不正な値です',
        maxLength: '文字数オーバーです'
      }
      try {
        const errorList = []

        if (error.details) {
          error.details.forEach(function(obj) {
            columns.forEach(function(columnObj) {
              if (obj.path.includes(columnObj.nameLabel)) {
                if (columnObj.column == obj.field) {
                  var errmsg = columnObj.name + ' : ' + errCode[obj.code]
                  errorList.unshift(errmsg)
                }
              }
            })
          })
          return errorList.join('\n')
        }
      } catch (e) {
        return ''
      }
    },
    getBusinessReportErrorMsg(error, columns) {
      error = error && error.body && error.body.error ? error.body.error : error;
      const errCode = {
        required: '必須項目です',
        format: '不正なフォーマットです',
        inclusion: '不正な値です',
        'numericality.number': '不正な値です',
        'length.max': '文字数オーバーです',
        pattern: '不正な値です',
        minimum: '不正な値です',
        maximum: '不正な値です',
        UNSUPPORTED_MEDIA_TYPE: 'ファイルが不正です',
        correlation: '不正な範囲指定です',
        type: '不正な値です',
        maxLength: '文字数オーバーです'
      };
      try {
        const errorList = [];

        if (error.details) {
          error.details.forEach(function(obj) {
            var col = columns.find((v) => obj.path.includes(v.path));
            var errmsg = col.name + ' : ' + errCode[obj.code];
            errorList.unshift(errmsg);
          })
          return errorList.join('\n');
        }
      } catch (e) {
        return '';
      }
    },
    onSearch(api, lo, where, cb) {
      if (api == null) {
        return
      }
      lo = lo || {}
      where && (lo.where = where)
      var url = api
      let buildingId = localStorage.getItem('buildings_id')

      if (buildingId != null) {
        let queryApi = '/buildings/' + buildingId + '/report-objects'
        let queryApi2 = '/report-objects/search-by-business-date'
        let queryApi3 =
          '/buildings/' + buildingId + '/report-objects/monthly-aggregation'
        let queryApi4 = '/buildings/' + buildingId + '/monthly-attendances'
        let queryApi5 = '/business-report'
        let queryApi6 = '/business-report/search-by-business-date'
        let queryApi7 = '/report-objects'
        var url = ''
        if (
          api == queryApi ||
          api == queryApi2 ||
          api == queryApi5 ||
          api == queryApi6 ||
          api == queryApi7
        ) {
          url =
            api +
            '?searchQuery=' +
            encodeURIComponent(JSON.stringify(lo)) +
            '&' +
            this.now
        } else if (api.split('?')[0] == queryApi3) {
          url =
            api +
            '?monthlyAggregationQuery=' +
            encodeURIComponent(JSON.stringify(lo)) +
            '&' +
            this.now
        } else if (api.split('?')[0] == queryApi4) {
          url =
            api +
            '?query=' +
            encodeURIComponent(JSON.stringify(lo)) +
            '&' +
            this.now
        } else {
          if (api.match('access-logs')) {
            url = api
          } else if (lo != null && where != null) {
            url =
              api +
              '?filter=' +
              encodeURIComponent(JSON.stringify(lo)) +
              '&' +
              this.now
          } else if (lo != null && (Object.keys(lo).length != 0)) {
            url =
              api +
              '?filter=' +
              encodeURIComponent(JSON.stringify(lo)) +
              '&' +
              this.now
          } else {
            url = api
          }
        }
      } else {
        if (api.match('access-logs')) {
          url = api
        } else if (api == '/report-objects'){
          url =
            api +
            '?searchQuery=' +
            encodeURIComponent(JSON.stringify(lo)) +
            '&' +
            this.now
        }else{
          url =
            api +
            '?filter=' +
            encodeURIComponent(JSON.stringify(lo)) +
            '&' +
            this.now
        }
      }

      this.req(url, 'get', null, (err, res) => {
        if (res && res.ok) {
          if (cb) {
            cb(res.body)
          } else {
            this.items = res.body
          }
        } else {
          cb(['error'])
        }
      })
    },
    onSearchForQuery(api, lo, where, query, cb) {
      if (api == '/reports') {
        if (where == undefined) {
          where = { and: [{ reportDefinitionId: this.$route.params.id }] }
        } else {
          where.and.push({ reportDefinitionId: this.$route.params.id })
        }
      }
      lo = lo || {}
      where && (lo.where = where)

      var url = ''
      if (Object.keys(query).length != 0) {
        url =
          api +
          '?filter=' +
          encodeURIComponent(JSON.stringify(lo)) +
          '&' +
          'operationTypeId=' +
          query.columnName
      } else {
        url =
          api +
          '?filter=' +
          encodeURIComponent(JSON.stringify(lo)) +
          '&' +
          this.now
      }
      this.req(url, 'get', null, (err, res) => {
        if (res && res.ok) {
          if (cb) {
            cb(res.body)
          } else {
            this.items = res.body
          }
        } else {
          cb(['error'])
        }
      })
    },
    onCount(api, where, cb) {
      if (api == null) {
        return
      }
      var url = ''
      let buildingId = localStorage.getItem('buildings_id')
      let queryApi = '/buildings/' + buildingId + '/report-objects'
      let queryApi2 = '/report-objects/search-by-business-date'
      let queryApi3 =
        '/buildings/' + buildingId + '/report-objects/monthly-aggregation'
      let queryApi4 = '/business-report'
      let queryApi5 = '/business-report/search-by-business-date'
      let queryApi6 = '/report-objects'
      if (
        api == queryApi ||
        api == queryApi2 ||
        api == queryApi4 ||
        api == queryApi5 ||
        api == queryApi6
      ) {
        url =
          api +
          '/count?searchQuery=' +
          encodeURIComponent(JSON.stringify(where)) +
          '&' +
          this.now
      } else if (api.split('?')[0] == queryApi3) {
        url =
          api +
          '/count?monthlyAggregationQuery=' +
          encodeURIComponent(JSON.stringify(where)) +
          '&' +
          this.now
      } else {
        url =
          api +
          '/count?where=' +
          (where ? encodeURIComponent(JSON.stringify(where)) : '') +
          '&' +
          this.now
      }
      this.req(url, 'get', null, (err, res) => {
        cb(res.body)
      })
    },
    onCountForQuery(api, lo, where, cb) {
      lo = lo || {}
      where && (lo.where = where)
      var url =
        api +
        '/count?query=' +
        encodeURIComponent(JSON.stringify(lo)) +
        '&' +
        this.now
      this.req(url, 'get', null, (err, res) => {
        cb(res.body)
      })
    },
    onCountForQuery2(api, where, query, cb) {
      var url =
        api +
        '/count?query=' +
        encodeURIComponent(JSON.stringify(where)) +
        '&' +
        'operationTypeId=' +
        query.columnName
      this.req(url, 'get', null, (err, res) => {
        cb(res.body)
      })
    },
    onCountForQuery3(api, where, query, cb) {
      var url =
        api +
        '/count?where=' +
        encodeURIComponent(JSON.stringify(where)) +
        '&' +
        'operationTypeId=' +
        query.columnName
      this.req(url, 'get', null, (err, res) => {
        cb(res.body)
      })
    },
    onCountUrlQuery(api, cb) {
      var url = api + '&' + this.now
      this.req(url, 'get', null, (err, res) => {
        cb(res.body)
      })
    },
    onRead(api, filter, cb) {
      filter = filter || {}
      const url =
        api +
        '/' +
        this.$route.params.id +
        '?filter=' +
        JSON.stringify(filter) +
        '&' +
        this.now
      this.req(url, 'get', null, (err, res) => {
        setTimeout(() => {
          if (cb) {
            cb(res.body)
          } else {
            this.item = res.body
          }
        }, 1)
      })
    },
    onUpdate(api, send, cb) {
      const url = api + '/' + this.$route.params.id
      this.req(url, 'patch', send, (err, res) => {
        if (cb) {
          cb(err, res)
        } else {
          if (res && res.ok) {
            this.error = ''
            this.itemInfo = '更新完了'
            setTimeout(() => (this.itemInfo = ''), 2000)
          } else {
            const errorColm = {}
            for (const key in this.param.columns) {
              errorColm[this.param.columns[key].column] = this.param.columns[
                key
              ].name
            }
            this.error = this.getErrorMsg2(res, this.param.columns)
          }
        }
      })
    },
    onDelete(api, nextUrl) {
      const url = api + '/' + this.$route.params.id
      this.req(url, 'delete', null, (err, res) => {
        if (res && res.ok) {
          this.$router.push(nextUrl)
        } else {
          this.itemInfo = res.body.error.message
        }
      })
      // if (confirm('削除します。本当によろしいですか？')) {
      //   const url = api + '/' + this.$route.params.id;
      //   this.req(url, 'delete', null, (err, res) => {
      //     if (res && res.ok) {
      //       this.$router.push(nextUrl);
      //     } else {
      //       this.itemInfo = res.body.error.message;
      //     }
      //   });
      // }
    },
    onPasswordUpdate(api, send, cb) {
      const url = api + '/' + this.$route.params.id + '/change-password'
      let check_api = api.split('/')
      let req = 'post'
      this.req(url, req, send, (err, res) => {
        if (cb) {
          cb(err, res)
        } else {
          if (res && res.ok) {
            this.error = ''
            this.itemInfo = '更新完了'
            setTimeout(() => (this.itemInfo = ''), 2000)
          } else {
            const errorColm = {}
            for (const key in this.param.columns) {
              errorColm[this.param.columns[key].column] = this.param.columns[
                key
              ].name
            }
            this.error = this.getErrorMsg2(res, this.param.columns)
          }
        }
      })
    },
    closeWebView() {
      if (this.isIPad() == true) {
        window.location.href = 'scheme://close'
      }
    },
    isIPad() {
      const isIPad =
        /iPad|Macintosh/i.test(navigator.userAgent) && 'ontouchend' in document
      return isIPad
    },
    getTrimedName(str, len) {
      if (str == null) {
        return ''
      }
      if (str.length >= len) {
        return str.substring(0, len) + '…'
      }
      return str
    },
    changeDateFormat(value) {
      if (value == null) return ''
      return moment(value).format('YYYY-MM-DD')
    },
    changeDateFormat2(value) {
      if (value == null) return ''
      return moment(value).format('YYYY/MM')
    },
    checkRevision() {
      let hash = new Date().getTime()
      request
        .get('/version.json?' + hash)
        .send()
        .end((err, res) => {
          if (res.ok) {
            // 初回アクセス時
            if (window.g_revision == null) {
              window.g_revision = res.body.git_revision
              return
            }

            if (window.g_revision !== res.body.git_revision) {
              let revisionChangingFl = this.getLocalStorageRevision(
                'revision_changing_fl'
              )
              if (!revisionChangingFl) {
                // 無限リロードを防ぐための排他制御
                this.setLocalStorageRevision({ revision_changing_fl: true })
                window.g_revision = res.body.git_revision
                // リビジョン更新開始
                if (this.isIPad() == true) {
                  window.location.href = 'scheme://reload'
                } else {
                  console.log('更新')
                  location.reload(true)
                }
                this.setLocalStorageRevision({ revision_changing_fl: false })
              }
            }
          }
        })
    },
    setLocalStorageRevision(obj) {
      localStorage.setItem(
        'REVISION',
        JSON.stringify(
          Object.assign({}, JSON.parse(localStorage.getItem('REVISION')), obj)
        )
      )
    },
    getLocalStorageRevision(key) {
      if (
        !JSON.parse(localStorage.getItem('REVISION')) ||
        !JSON.parse(localStorage.getItem('REVISION'))[key]
      ) {
        return false
      }
      return JSON.parse(localStorage.getItem('REVISION'))[key]
    },
    timeConverter(value) {
      if (value < 10) {
        return '0' + value
      } else {
        return value
      }
    },
    getReportedRangeTime(reportTime, businessStartTime, isStart) {
      var startTime =
        moment(reportTime).format('YYYY-MM-DD') +
        'T' +
        businessStartTime +
        '+09:00'
      if (isStart) {
        return moment(startTime).format()
      } else {
        return moment(startTime)
          .add(1, 'days')
          .add(-1, 'seconds')
          .format()
      }
    },
    reverseArray(array) {
      var reverse = []
      for (var i = array.length - 1; i >= 0; i--) {
        reverse.push(array[i])
      }
      return reverse
    },
    /*権限取得*/
    getAuthority(role) {
      if (role == '1') {
        return 'responsible'
      } else if (role == '2') {
        return 'staff'
      } else if (role == '3') {
        return 'owner'
      } else if (role == '4') {
        return 'headquarters'
      } else if (role == '5') {
        return 'systemApproval'
      } else {
        return ''
      }
    },
    /**
     * 報告書承認ステータス取得
     */
    getReportStatus(status) {
      if (status == 0) {
        return '未申請'
      } else if (status == 1) {
        return '申請中'
      } else if (status == 2) {
        return '差戻し'
      } else if (status == 3) {
        return '再申請'
      } else if (status == 4) {
        return '承認済'
      } else if (status == 5) {
        return '削除済'
      } else {
        return ''
      }
    },
    getActionStatus(val) {
      var status
      switch (val) {
        case 0:
          status = '申請'
          break
        case 1:
          status = '承認'
          break
        case 2:
          status = '差戻し'
          break
        case 3:
          status = '再申請'
          break
        case 4:
          status = '削除'
          break
      }
      return status
    },
    getWorkShift(val) {
      switch (val) {
        case 1:
          return '日勤'
        case 2:
          return '宿直'
        case 3:
          return '夜勤'
        case 4:
          return '午前'
        case 5:
          return '午後'
      }
      return ''
    },
    getWorkShiftList(blank) {
      var list = [
        { name: '', value: '' },
        { name: '日勤', value: 1 },
        { name: '宿直', value: 2 },
        { name: '夜勤', value: 3 },
        { name: '午前', value: 4 },
        { name: '午後', value: 5 }
      ]
      if (blank) {
        return list
      } else {
        list.shift()
        return list
      }
    },
    getHeadOperationId() {
      var buildingOperation = JSON.parse(
        localStorage.getItem('template_list')
      ).map((operation) => operation.operationCategoryId)
      buildingOperation.sort(function(a, b) {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      })

      var memberOperation = JSON.parse(
        localStorage.getItem('member_operation')
      ).map((operation) => operation.operationCategoryId)
      memberOperation.sort(function(a, b) {
        if (a < b) return -1
        if (a > b) return 1
        return 0
      })
      var operations = [...buildingOperation, ...memberOperation]
      var duplicatedArr = operations.filter(
        (item) =>
          buildingOperation.includes(item) && memberOperation.includes(item)
      )
      duplicatedArr = [...new Set(duplicatedArr)]
      if (duplicatedArr.length == 0) return 0
      var minId = duplicatedArr.reduce(function(a, b) {
        return Math.min(a, b)
      })
      return minId
    },
    setOperationTemplateIds(operationCategoryId) {
      this.param.searchWhere[0].operationReportTemplateId.inq = []
      if (this.isHeadquartersMode) {
        var templateList = JSON.parse(localStorage.getItem('template_list'))
        for (var i = 0; i < templateList.length; i++) {
          if (templateList[i].operationCategoryId == operationCategoryId) {
            this.param.searchWhere[0].operationReportTemplateId.inq.push(
              templateList[i].templateId
            )
          }
        }
      } else {
        // var historicalTemplates = JSON.parse(localStorage.getItem('history_templates'));
        // var setInq = historicalTemplates.filter(val => val.operationId == operationCategoryId);
        // for (var j = 0; j < setInq.length; j++) {
        //   if (!this.param.searchWhere[0].operationReportTemplateId.inq.some(ele => ele == setInq[j].id)) {
        //     this.param.searchWhere[0].operationReportTemplateId.inq.push(setInq[j].id);
        //   }
        // }
      }
    },
    getOperationTemplateId(operationCategoryId) {
      // var templateList = JSON.parse(localStorage.getItem('template_list'));
      // var res = templateList.find(val => val.operationCategoryId == operationCategoryId);
      // return res.templateId;

      var res = []
      if (this.isHeadquartersMode) {
        var templateList = JSON.parse(localStorage.getItem('template_list'))
        for (var i = 0; i < templateList.length; i++) {
          if (templateList[i].operationCategoryId == operationCategoryId) {
            res.push(templateList[i].templateId)
          }
        }
      } else {
        // var historicalTemplates = JSON.parse(localStorage.getItem('history_templates'));
        // var setInq = historicalTemplates.filter(val => val.operationId == operationCategoryId);
        // for (var j = 0; j < setInq.length; j++) {
        //   if (!res.some(ele => ele == setInq[j].id)) {
        //     res.push(setInq[j].id);
        //   }
        // }
      }
      return res
    },
    getColumData(val) {
      if (val == null || val == '') {
        return '---'
      }
      if (val.label != null) {
        return val.label
      }
      if (val.name != null) {
        return val.name
      }
      return val.replace(/\r?\n/g, '<br>')
    },
    getColumDataForNumber(num) {
      if (num == null || num == '') {
        return '---'
      }
      return num
    },
    getPrefectureName(prefectureId) {
      var name = ''
      switch (prefectureId) {
        case 1:
          name = '北海道'
          break
        case 2:
          name = '青森県'
          break
        case 3:
          name = '岩手県'
          break
        case 4:
          name = '宮城県'
          break
        case 5:
          name = '秋田県'
          break
        case 6:
          name = '山形県'
          break
        case 7:
          name = '福島県'
          break
        case 8:
          name = '茨城県'
          break
        case 9:
          name = '栃木県'
          break
        case 10:
          name = '群馬県'
          break
        case 11:
          name = '埼玉県'
          break
        case 12:
          name = '千葉県'
          break
        case 13:
          name = '東京都'
          break
        case 14:
          name = '神奈川県'
          break
        case 15:
          name = '新潟県'
          break
        case 16:
          name = '富山県'
          break
        case 17:
          name = '石川県'
          break
        case 18:
          name = '福井県'
          break
        case 19:
          name = '山梨県'
          break
        case 20:
          name = '長野県'
          break
        case 21:
          name = '岐阜県'
          break
        case 22:
          name = '静岡県'
          break
        case 23:
          name = '愛知県'
          break
        case 24:
          name = '三重県'
          break
        case 25:
          name = '滋賀県'
          break
        case 26:
          name = '京都府'
          break
        case 27:
          name = '大阪府'
          break
        case 28:
          name = '兵庫県'
          break
        case 29:
          name = '奈良県'
          break
        case 30:
          name = '和歌山県'
          break
        case 31:
          name = '鳥取県'
          break
        case 32:
          name = '島根県'
          break
        case 33:
          name = '岡山県'
          break
        case 34:
          name = '広島県'
          break
        case 35:
          name = '山口県'
          break
        case 36:
          name = '徳島県'
          break
        case 37:
          name = '香川県'
          break
        case 38:
          name = '愛媛県'
          break
        case 39:
          name = '高知県'
          break
        case 40:
          name = '福岡県'
          break
        case 41:
          name = '佐賀県'
          break
        case 42:
          name = '長崎県'
          break
        case 43:
          name = '熊本県'
          break
        case 44:
          name = '大分県'
          break
        case 45:
          name = '宮崎県'
          break
        case 46:
          name = '鹿児島県'
          break
        case 47:
          name = '沖縄県'
          break
        default:
          break
      }
      return name
    },
    onTransitionButton(path) {
      this.$router.push(this.$router.redirect ? this.$router.redirect : path)
    },
    toBoolean(data) {
      return data === 'true'
    },
    windowBack(event, searchItem) {
      if (event != undefined) {
        if (event.type == 'popstate') {
          localStorage.setItem('search_item', JSON.stringify(searchItem))
        }
      }
    },
    getWeekDayStr(date) {
      return ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
    },
    getQueryFromWhere(where) {
      var query = ''
      if (where != null && where.and != undefined) {
        where.and.forEach(function(whe) {
          if (whe.buildingId != null) {
            query += '&buildingId=' + whe.buildingId
          }
          if (whe.accessedAt != null) {
            if (whe.accessedAt.gte != null) {
              query +=
                '&from=' +
                JSON.stringify(whe.accessedAt.gte).replaceAll('"', '')
            } else {
              query +=
                '&to=' + JSON.stringify(whe.accessedAt.lte).replaceAll('"', '')
            }
          }
        })
      }
      return query
    },
    getOperationTypeId(operationCategoryId) {
      var operations = JSON.parse(localStorage.getItem('operation_categories'))
      var find = operations.find(
        (operation) => operation.id == operationCategoryId
      )
      if (find != undefined) {
        return find.operationTypeId
      }
      return null
    },
    /**
     * 業務報告書のステータス(Enum).
     */
    getBusinessReportStatus() {
      return {
        Making: {
          value: 0,
          text : '作成中'
        },
        Request: {
          value: 1,
          text : '依頼・クレーム・定期'
        },
        Check: {
          value: 2,
          text : '状況確認および対応'
        },
        WorkRequest: {
          value: 3,
          text : '作業依頼' // 想定作業内容の作業依頼
        },
        WorkReport: {
          value: 4,
          text : '作業報告' // 作業が終わった後
        },
        Complete: {
          value: 5,
          text : '確認完了'
        }
      }
    },
    /**
     * 業務報告書のステータス(プルダウン用).
     */
    getBusinessReportStatusList() {
      const list = [];
      const statusList = this.getBusinessReportStatus();
      for (const key in statusList) {
        list.push({ label: statusList[key].text, id: statusList[key].value });
      }
      return list;
    },
    /**
     * 業務報告書のステータスチェック処理.
     */
    checkBusinessReportStatus(statusObj) {
      var result = { 'check': true, 'status': this.getBusinessReportStatus().Making };

      const keys = Object.keys(statusObj).reverse();
      // ステータスがどこまで進んでいるか確認する
      // 後ろから確認してチェックが入っている最初のステータスを一時的に保持する
      var lastStatus = {};
      for (var i = 0; i < keys.length; i++) {
        if (statusObj[keys[i]]) {
          lastStatus[keys[i]] = statusObj[keys[i]];
          break;
        }
      }

      // どこにもチェックが入っていない場合は問題なし(チェックOK)として返却
      if (Object.keys(lastStatus).length == 0) {
        return result;
      }

      // チェックが入ってるステータスから前のステータスの状態を確認する
      // チェックが入っていないステータスがある場合、問題あり(チェックNG)として返却する
      const lastKey = Object.keys(lastStatus)[0];
      switch(Number(lastKey)) {
        case this.getBusinessReportStatus().Request.value:
          result.status = this.getBusinessReportStatus().Request;
          break;
        case this.getBusinessReportStatus().Check.value:
          result.status = this.getBusinessReportStatus().Check;
          break;
        case this.getBusinessReportStatus().WorkRequest.value:
          result.status = this.getBusinessReportStatus().WorkRequest;
          break;
        case this.getBusinessReportStatus().WorkReport.value:
          result.status = this.getBusinessReportStatus().WorkReport;
          break;
        case this.getBusinessReportStatus().Complete.value:
          result.status = this.getBusinessReportStatus().Complete;
          break;
      }
      for (var i = lastKey - 1; i > 0; i--) {
        if (statusObj[i] !== undefined && !statusObj[i]) {
          result.check = false;
          break;
        }
      }

      return result;
    }
  }
}
