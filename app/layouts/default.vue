<template>
  <div>
    <body class="fixed default_background">
      <div class="wrapper" id="bodywrapper" v-on:click.capture="watchEventHandler" v-on:mouseover.capture="watchEventHandler">
        <template v-if="logined">
          <!-- Main Header -->
          <header class="main-header ts_header">
            <!-- Logo -->
            <li class="logo cursor_pointer header_background" v-bind:class="{ dev_bg_color: env=='dev_server', stg_bg_color: env=='staging'}" @click="onHome()" v-if="!checkItemPermission('Common:Header:view:transitionMember')">
              <!-- mini logo for sidebar mini 50x50 pixels -->
              <!-- <span class="logo-mini">
                <b>T</b>
              </span> -->
              <!-- logo for regular state and mobile devices -->
              <span class="logo-lg">
                <img class="menu_logo" src="~/assets/t_logo.svg" />
              </span>
            </li>
            <li class="logo cursor_pointer header_background" v-bind:class="{ dev_bg_color: env=='dev_server', stg_bg_color: env=='staging'}" @click="onHome()" v-if="checkItemPermission('Common:Header:view:transitionMember')">
              <!-- mini logo for sidebar mini 50x50 pixels -->
              <!-- <span class="logo-mini">
                <b>T</b>
              </span> -->
              <!-- logo for regular state and mobile devices -->
              <span class="logo-lg">
                <img class="menu_logo" src="~/assets/t_logo.svg" />
              </span>
            </li>
            <!-- Header Navbar -->
            <nav class="navbar navbar_logo navbar-static-top" role="navigation">
              <!-- Sidebar toggle button-->
              <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                <div class="sidebar-toggle_wrap">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </a>
              <!-- Navbar Right Menu -->
              <div class="navbar-custom-menu">
                <nuxt-link to="/information/" class="ts_header-notice" v-if="!isSystemApprovalMode">
                  <i class="fas fa-bell"></i>
                  <!-- <span class="label-warning margin-bottom margin_bottom_15 information_num" v-if="notificationList.length!=0">{{notificationList.length}}</span> -->
                </nuxt-link>
                <ul class="nav navbar-nav">
                  <!-- User Account Menu -->
                  <li class="dropdown user user-menu">
                    <!-- Menu Toggle Button -->
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                      <!-- hidden-xs hides the username on small devices so only the image appears. -->
                      <!-- <span class="hidden-xs" style="margin-right : 20px;" v-if="!isHeadquartersMode"> -->
                      <span v-if="!isSystemApprovalMode">
                        <i class="fas fa-copyright"></i>
                        {{getTrimedName(companyName, 15)}}
                      </span>
                      <span v-if="!isHeadquartersMode&&!isSystemApprovalMode">
                        <i class="fas fa-building"></i>
                        {{getTrimedName(buildingname, 15)}}
                      </span>
                      <!-- <span class="hidden-xs" style="margin-right : 20px;" v-if="isHeadquartersMode"> -->
                      <span v-if="isHeadquartersMode">
                        <i class="fas fa-asterisk"></i>
                        契約会社 管理者
                      </span>

                      <span v-if="isSystemApprovalMode">
                        <i class="fas fa-asterisk"></i>
                        T-Spider 管理者
                      </span>

                      <!-- <span class="hidden-xs" style="margin-right : 20px;"> -->
                      <span>
                        <i class="fas fa-user-circle"></i>
                        {{getTrimedName(username, 15)}}
                      </span>
                    </a>

                    <!--Responsible権限以外のはログアウトボタンを無効-->
                    <ul class="dropdown-menu">
                      <li class="user-header height_120">
                        <p v-if="!isSystemApprovalMode">
                          <i class="fas fa-copyright"></i>
                          {{getTrimedName(companyName, 15)}}
                        </p>
                        <p v-if="!isHeadquartersMode&&!isSystemApprovalMode">
                          <i class="fas fa-building"></i>
                          {{getTrimedName(buildingname, 30)}}
                        </p>
                        <p v-if="isHeadquartersMode">
                          <i class="fas fa-asterisk"></i>
                          契約会社 管理者
                        </p>
                        <p v-if="isSystemApprovalMode">
                          <i class="fas fa-asterisk"></i>
                          T-Spider 管理者
                        </p>

                        <p>
                          <i class="fas fa-user-circle"></i>
                          {{getTrimedName(username, 30)}}
                        </p>
                      </li>
                      <li class="user-footer">
                        <div v-if="checkItemPermission('Common:forSystemApproval')">
                          <a @click.stop="select_company"><i class="fas fa-exchange-alt"></i>契約会社選択/T-Spider管理者切替</a>
                        </div>
                        <div v-bind:class="{ margin_top_8: checkItemPermission('Common:forSystemApproval')}" v-if="!checkItemPermission('Common:Header:view:forHeadquarters') && !isSystemApprovalMode">
                          <a @click.stop="select_building"><i class="fas fa-exchange-alt"></i>ビル選択</a>
                        </div>
                        <div v-bind:class="{ margin_top_8: checkItemPermission('Common:forSystemApproval')}" v-if="checkItemPermission('Common:Header:view:forHeadquarters') && !isSystemApprovalMode">
                          <a @click.stop="select_building"><i class="fas fa-exchange-alt"></i>ビル選択/契約会社管理者切替</a>
                        </div>
                        <div class="margin_top_8">
                          <a @click.stop="send_help"><i class="fas fa-question-circle"></i>ヘルプ</a>
                        </div>
                        <div class="margin_top_8" v-if="checkItemPermission('Common:Header:view:feedback')">
                          <a @click.stop="send_feedback"><i class="fas fa-asterisk"></i>フィードバック</a>
                        </div>
                        <div class="margin_top_8">
                          <a @click.stop="logout"><i class="fas fa-sign-out-alt"></i>ログアウト</a>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
          <!-- Left side column. contains the logo and sidebar -->
          <aside class="main-sidebar ts_sidebar ts_ex_sidebar" v-bind:class="{sidebar_scroll: !isHeadquartersMode,sidebar_scroll_hidden: isHeadquartersMode,}">
            <!-- sidebar: style can be found in sidebar.less -->
            <section class="sidebar ts_ex_sidebar_main">
              <div class="ts_ex_sidebar_category">
              <!-- Sidebar Menu -->
                <!-- <ul class="sidebar-menu" data-widget="tree"> -->
                <ul class="ts_ex_sidebar_category_menu">
                  <li id="home" class="active" @click="onHome()">
										<a class="cursor_pointer">
											<figure><img src="../assets/icon_sidebar_01.svg" alt=""></figure>
											<p>ホーム</p>
										</a>
									</li>
                  <li id="master" @click="mouseoverAct('master')" v-if="isSystemApprovalMode||isHeadquartersMode">
										<a class="cursor_pointer">
											<figure><img src="../assets/icon_sidebar_02.svg" alt=""></figure>
											<p>マスタ</p>
										</a>
									</li>
                  <template v-for="(report_menu, index) in menuList.report" v-if="!isSystemApprovalMode">
                    <li :id="report_menu.id" @click="mouseoverAct(report_menu.id)">
                      <a class="cursor_pointer">

                        <figure v-if="report_menu.operation_type_id==1"><img src="../assets/icon_sidebar_03.svg" alt=""></figure>
                        <figure v-else-if="report_menu.operation_type_id==2"><img src="../assets/icon_sidebar_05.svg" alt=""></figure>
                        <figure v-else-if="report_menu.operation_type_id==3"><img src="../assets/icon_sidebar_06.svg" alt=""></figure>
                        <figure v-else><img src="../assets/icon_sidebar_07.svg" alt=""></figure>

                        <p>{{report_menu.operation_name}}</p>
                      </a>
                    </li>
                  </template>
                  <li id="aggregate" @click="mouseoverAct('aggregate')" v-if="checkMenuPermission('Report:Monthly:view') && (!isHeadquartersMode&&!isSystemApprovalMode)">
										<a class="cursor_pointer">
											<figure><img src="../assets/icon_sidebar_04.svg" alt=""></figure>
											<p>データ分析</p>
										</a>
									</li>
                  <li id="master" @click="mouseoverAct('master')" v-if="!(isSystemApprovalMode||isHeadquartersMode)">
                  <!-- <li id="master" v-on:mouseover="mouseoverAct('master')" v-if="!(isSystemApprovalMode||isHeadquartersMode)"> -->
										<a class="cursor_pointer">
											<figure><img src="../assets/icon_sidebar_02.svg" alt=""></figure>
											<p>マスタ</p>
										</a>
									</li>
                </ul>
              </div>

              <div class="ts_ex_sidebar_menu">
                <p class="ts_ex_sidebar_menu_heading">セクション</p>
                <div class="ts_ex_sidebar_menu_content" :class="{active: dataCategory=='master'}" v-if="dataCategory=='master'">
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/buildings')" v-if="checkMenuPermission('Master:Building:search') && (isHeadquartersMode||isSystemApprovalMode)">
                    <li v-bind:class="{ active: path=='buildings', current: path=='buildings' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active" src="../assets/icon_building_green.svg" alt="">
                          <img class="normal" src="../assets/icon_building_white.svg" alt="">
                        </figure>
                        <p>ビル管理</p>
                      </a>
                      <!-- <span><i class="fas fa-building"></i> <span>ビル管理</span></a> -->
                    </li>
                  </ul>
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/buildings/details/'+buildingId)" v-if="checkMenuPermission('Master:Building:view')&&(!isHeadquartersMode&&!isSystemApprovalMode)">
                    <li v-bind:class="{ active: path=='buildings', current: path=='buildings' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active" src="../assets/icon_building_green.svg" alt="">
                          <img class="normal" src="../assets/icon_building_white.svg" alt="">
                        </figure>
                        <p>ビル情報</p>
                      </a>
                      <!-- <span><i class="fas fa-building"></i> <span>ビル管理</span></a> -->
                    </li>
                  </ul>
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/company_operation_categories')" v-if="checkMenuPermission('Master:OperationCategory:search') && isHeadquartersMode">
                    <li v-bind:class="{ active: path=='company_operation_categories', current: path=='company_operation_categories' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active fas fa-building">
                        </figure>
                        <p>ビル別業務グループ設定</p>
                      </a>
                    </li>
                  </ul>
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/company_disabled_group_contents')" v-if="checkMenuPermission('Master:DisabledGroupContent:search') && isHeadquartersMode">
                    <li v-bind:class="{ active: path=='company_disabled_group_contents', current: path=='company_disabled_group_contents' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active fas fa-building">
                        </figure>
                        <p>ビル別業務非表示設定</p>
                      </a>
                    </li>
                  </ul>
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/members')" v-if="checkMenuPermission('Master:Member:search') && (isHeadquartersMode||isSystemApprovalMode)">
                    <li v-bind:class="{ active: path=='members', current: path=='members' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active" src="../assets/icon_member_green.svg" alt="">
                          <img class="normal" src="../assets/icon_member_white.svg" alt="">
                        </figure>
                        <p>メンバー管理</p>
                      </a>
                    </li>
                  </ul>
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/members')" v-if="checkMenuPermission('Master:Member:search')&&(!isHeadquartersMode&&!isSystemApprovalMode)&&(checkMenuPermission('Master:Member:create'))">
                    <li v-bind:class="{ active: path=='members', current: path=='members' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active" src="../assets/icon_member_green.svg" alt="">
                          <img class="normal" src="../assets/icon_member_white.svg" alt="">
                        </figure>
                        <p>メンバー管理</p>
                      </a>
                    </li>
                  </ul>
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/members/details/'+memberId)" v-if="checkMenuPermission('Master:Member:view') && (!checkMenuPermission('Master:Member:create'))">
                    <li v-bind:class="{ active: path=='members', current: path=='members' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active" src="../assets/icon_member_green.svg" alt="">
                          <img class="normal" src="../assets/icon_member_white.svg" alt="">
                        </figure>
                        <p>メンバー情報</p>
                      </a>
                    </li>
                  </ul>
                  <!-- <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/operation_templates')" v-if="isHeadquartersMode">
                    <li v-bind:class="{ active: path=='operation_templates', current: path=='operation_templates' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active" src="../assets/icon_note_green.svg" alt="">
                          <img class="normal" src="../assets/icon_note_white.svg" alt="">
                        </figure>
                        <p>業務テンプレート</p>
                      </a>
                    </li>
                  </ul> -->
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/companies')" v-if="isSystemApprovalMode">
                    <li v-bind:class="{ active: path=='companies', current: path=='companies' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active" src="../assets/icon_building_green.svg" alt="">
                          <img class="normal" src="../assets/icon_building_white.svg" alt="">
                        </figure>
                        <p>契約会社管理</p>
                      </a>
                      <!-- <span><i class="fas fa-building"></i> <span>契約会社管理</span></a> -->
                    </li>
                  </ul>
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/access_log')" v-if="isHeadquartersMode||(checkMenuPermission('Master:AccessLog:search')&&(!isHeadquartersMode&&!isSystemApprovalMode))">
                    <li v-bind:class="{ active: path=='access_log', current: path=='access_log' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active" src="../assets/icon_check_green.svg" alt="">
                          <img class="normal" src="../assets/icon_check_white.svg" alt="">
                        </figure>
                        <p>アクセスログ</p>
                      </a>
                    </li>
                  </ul>
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/notifications')" v-if="checkMenuPermission('Master:Notification:search') && isSystemApprovalMode">
                    <li v-bind:class="{ active: path=='notifications', current: path=='notifications' }" v-if="isSystemApprovalMode">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active fas fa-bell">
                        </figure>
                        <p>お知らせ管理</p>
                      </a>
                    </li>
                  </ul>

                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/company_operation_types')" v-if="checkMenuPermission('Master:OperationType:search') && isHeadquartersMode">
                    <li v-bind:class="{ active: path=='company_operation_types', current: path=='company_operation_types' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active fas fa-database">
                          <!-- <img class="active" src="../assets/icon_check_green.svg" alt="">
                          <img class="normal" src="../assets/icon_check_white.svg" alt=""> -->
                        </figure>
                        <p>業務種別マスタ</p>
                      </a>
                    </li>
                  </ul>

                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/company_report_object_group_definitions')" v-if="checkMenuPermission('Master:ReportObjectGroupDefinition:search') && isHeadquartersMode">
                    <li v-bind:class="{ active: path=='company_report_object_group_definitions', current: path=='company_report_object_group_definitions' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active fas fa-database">
                        </figure>
                        <p>業務グループマスタ</p>
                      </a>
                    </li>
                  </ul>

                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/company_report_object_definitions')" v-if="checkMenuPermission('Master:ReportObjectDefinition:search') && isHeadquartersMode">
                    <li v-bind:class="{ active: path=='company_report_object_definitions', current: path=='company_report_object_definitions' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active fas fa-database">
                        </figure>
                        <p>業務・業務項目マスタ</p>
                      </a>
                    </li>
                  </ul>

                  <!-- <li class="treeview cursor_pointer" v-bind:class="{ active: path=='notifications', current: path=='notifications' }" @click="removeSearchItem('/notifications')" v-if="isSystemApprovalMode">
                    <a><i class="fas fa-bell"></i> <span>お知らせ管理</span></a>
                  </li> -->
                </div>

                <template v-for="(report_menu, index) in menuList.report" v-if="!isSystemApprovalMode">
                  <div class="ts_ex_sidebar_menu_content" :class="{active: dataCategory==report_menu.id}" v-if="dataCategory==report_menu.id">
                    <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/majoritems_setting/'+report_menu.id)" v-if="checkMenuPermission('Cleaning:AutocreationScheduleOperationCategory:search') && isHeadquartersMode && isAutoCreate(report_menu.operation_type_id)">
                      <li :class="{ active: path=='/majoritems_setting/'+report_menu.id, current: path=='/majoritems_setting/'+report_menu.id }">
                        <a>
                          <figure class="ts_ex_sidebar_menu_icon">
                            <img class="active" src="../assets/icon_gear_green.svg" alt="">
                            <img class="normal" src="../assets/icon_gear_white.svg" alt="">
                          </figure>
                          <p>業務 自動設定</p>
                        </a>
                      </li>
                    </ul>
                    <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/majoritems_setting/'+report_menu.id+'/details/'+autoConfigId[index])" v-if="checkMenuPermission('Cleaning:AutocreationScheduleOperationCategory:view') && !isHeadquartersMode && (autoConfigId[index]!=0)">
                      <li :class="{ active: path=='/majoritems_setting/'+report_menu.id, current: path=='/majoritems_setting/'+report_menu.id }">
                        <a>
                          <figure class="ts_ex_sidebar_menu_icon">
                            <img class="active" src="../assets/icon_gear_green.svg" alt="">
                            <img class="normal" src="../assets/icon_gear_white.svg" alt="">
                          </figure>
                          <p>業務 自動設定情報</p>
                        </a>
                      </li>
                    </ul>
                    <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/calendars/'+report_menu.id)" v-if="(checkMenuPermission('Security:Schedule:search') || checkMenuPermission('Cleaning:Schedule:search')) && !isHeadquartersMode">
                      <li :class="{ active: path=='/calendars/'+report_menu.id, current: path=='/calendars/'+report_menu.id }">
                        <a>
                          <figure class="ts_ex_sidebar_menu_icon">
                            <img class="active" src="../assets/icon_calendar_green.svg" alt="">
                            <img class="normal" src="../assets/icon_calendar_white.svg" alt="">
                          </figure>
                          <p>イベント</p>
                        </a>
                      </li>
                    </ul>
                    <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/report_calendars/'+report_menu.id)" v-if="(checkMenuPermission('Security:ReportSchedule:search') || checkMenuPermission('Cleaning:ReportSchedule:search')) && !isHeadquartersMode">
                      <li :class="{ active: path=='/report_calendars/'+report_menu.id , current: path=='/report_calendars/'+report_menu.id }">
                        <a>
                          <figure class="ts_ex_sidebar_menu_icon">
                            <img class="active" src="../assets/icon_calendar_green.svg" alt="">
                            <img class="normal" src="../assets/icon_calendar_white.svg" alt="">
                          </figure>
                          <p>承認カレンダー</p>
                        </a>
                      </li>
                    </ul>
                    <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/monthly_reports/'+report_menu.id)" v-if="(checkMenuPermission('Security:MonthlyReport:search') || checkMenuPermission('Cleaning:MonthlyReport:search'))">
                      <li :class="{ active: path=='/monthly_reports/'+report_menu.id, current: path=='/monthly_reports/'+report_menu.id }">
                        <a>
                          <figure class="ts_ex_sidebar_menu_icon">
                            <img class="active" src="../assets/icon_note_green.svg" alt="">
                            <img class="normal" src="../assets/icon_note_white.svg" alt="">
                          </figure>
                          <p>月次報告書</p>
                        </a>
                      </li>
                    </ul>
                    <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/report/'+ report_menu.id)" v-if="(checkMenuPermission('Security:Report:search') || checkMenuPermission('Cleaning:Report:search'))">
                      <li :class="{ active: path=='/report/'+ report_menu.id, current: path=='/report/'+ report_menu.id }">
                        <a>
                          <figure class="ts_ex_sidebar_menu_icon">
                            <img class="active" src="../assets/icon_note_green.svg" alt="">
                            <img class="normal" src="../assets/icon_note_white.svg" alt="">
                          </figure>
                          <p>日報</p>
                        </a>
                      </li>
                    </ul>
                    <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/report_approval/'+report_menu.id)" v-if="(checkMenuPermission('Security:ApproveReport:search') || checkMenuPermission('Cleaning:ApproveReport:search')) && !isHeadquartersMode">
                      <li :class="{ active: path=='/report_approval/'+report_menu.id, current: path=='/report_approval/'+report_menu.id }">
                        <a>
                          <figure class="ts_ex_sidebar_menu_icon">
                            <img class="active" src="../assets/icon_note_green.svg" alt="">
                            <img class="normal" src="../assets/icon_note_white.svg" alt="">
                          </figure>
                          <p>日報承認</p>
                        </a>
                      </li>
                    </ul>
                    <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/attendance/'+report_menu.id)" v-if="(checkMenuPermission('Security:Attendance:search') || checkMenuPermission('Cleaning:Attendance:search')) && !isHeadquartersMode">
                      <li :class="{ active: path=='/attendance/'+report_menu.id, current: path=='/attendance/'+report_menu.id }">
                        <a>
                          <figure class="ts_ex_sidebar_menu_icon">
                            <img class="active" src="../assets/icon_note_green.svg" alt="">
                            <img class="normal" src="../assets/icon_note_white.svg" alt="">
                          </figure>
                          <p>勤務スタッフ</p>
                        </a>
                      </li>
                    </ul>
                    <ul class="ts_ex_sidebar_menu_list cursor_pointer" :id="'majoritems'+index+'_'+index2" :name="'majoritems'" v-for="(majoritems_group, index2) in report_menu.majoritems" v-if="(checkMenuPermission('Security:ReportObject:search') || checkMenuPermission('Cleaning:ReportObject:search'))" :key="majoritems_group.name && !isSystemApprovalMode">
                      {{setActiveIndex(majoritems_group.reportObjectDefinitions, report_menu.id, index, index2, path)}}
                      <li :class="{ active: (index===activeIndex) && (index2===activeIndex2) && activeFlag, current: (index===activeIndex) && (index2===activeIndex2) && activeFlag}" v-if="(majoritems_group.name!='センサーログ')">
                        <a>
                          <figure class="ts_ex_sidebar_menu_icon">
                            <img class="active" src="../assets/icon_memo_green.svg" alt="">
                            <img class="normal" src="../assets/icon_memo_white.svg" alt="">
                          </figure>
                          <p @click="setActive(index, index2, majoritems_group.name)">{{majoritems_group.name}}</p>
                        </a>
                        <ul class="ts_ex_sidebar_menu_child" :class="{ts_ex_sidebar_menu_child_open: (((index===activeIndex) && (index2===activeIndex2) && activeFlag && !isClose) || index2 == activeIndex3)}">
                          <li class="cursor_pointer" v-for="majoritem in majoritems_group.reportObjectDefinitions" v-bind:to="'/majoritems/'+ report_menu.id +'/'+majoritem.id" :class="{ active: path==='/majoritems/'+ report_menu.id +'/'+majoritem.id }" :key="majoritem.name" @click="removeSearchItem('/majoritems/'+ report_menu.id+'/'+majoritem.id)">
                            <a :class="{select_menu_child: path==='/majoritems/'+ report_menu.id+'/'+majoritem.id }">○ {{majoritem.name}} </a>
                          </li>
                        </ul>
                      </li>
                      <li :class="{ active: (isSensorLog && majoritems_group.name=='センサーログ'), current: (isSensorLog && majoritems_group.name=='センサーログ')}" v-else>
                        <a>
                          <figure class="ts_ex_sidebar_menu_icon">
                            <img class="active" src="../assets/icon_memo_green.svg" alt="">
                            <img class="normal" src="../assets/icon_memo_white.svg" alt="">
                          </figure>
                          <p @click="setActive(index, index2, majoritems_group.name)">{{majoritems_group.name}}</p>
                        </a>
                        <ul class="ts_ex_sidebar_menu_child" :class="{ts_ex_sidebar_menu_child_open: (isSensorLog && majoritems_group.name=='センサーログ')}">
                          <li class="cursor_pointer" v-for="sensor_log in sensor_log_menus" v-bind:to="'/sensor_log/'+ sensor_log.id" :class="{ active: path==='/sensor_log/'+ sensor_log.id }" :key="sensor_log.name" @click="removeSearchItem('/sensor_log/'+ sensor_log.id)">
                            <a :class="{select_menu_child: path==='/sensor_log/'+ sensor_log.id }">○ {{sensor_log.name}} </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                    <ul class="ts_ex_sidebar_menu_list cursor_pointer" :id="'business_report'+index+'_'+index3" v-for="(businessReportGroup, index3) in menuList.businessReportGroupDefinitions" v-if="checkMenuPermission('Equipment:BusinessReport:search') && report_menu.operation_type_id == businessReportGroup.operationTypeId">
                      <li :class="{ active: path=='/business_report/'+report_menu.id+'/'+businessReportGroup.id, current: path=='/business_report/'+report_menu.id+'/'+businessReportGroup.id }" @click="removeSearchItem('/business_report/'+report_menu.id+'/'+businessReportGroup.id)">
                        <a>
                          <figure class="ts_ex_sidebar_menu_icon">
                            <img class="active" src="../assets/icon_note_green.svg" alt="">
                            <img class="normal" src="../assets/icon_note_white.svg" alt="">
                          </figure>
                          <p>{{businessReportGroup.name}}</p>
                        </a>
                      </li>
                    </ul>
                  </div>
                </template>

                <div class="ts_ex_sidebar_menu_content" :class="{active: dataCategory=='aggregate'}" v-if="dataCategory=='aggregate'">
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/monthly_report')" v-if="checkMenuPermission('Report:Monthly:view') && (!isHeadquartersMode&&!isSystemApprovalMode)">
                    <li v-bind:class="{ active: path=='monthly_report', current: path=='monthly_report' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active" src="../assets/icon_note_green.svg" alt="">
                          <img class="normal" src="../assets/icon_note_white.svg" alt="">
                        </figure>
                        <p>月次件数</p>
                      </a>
                    </li>
                  </ul>
                  <ul class="ts_ex_sidebar_menu_list cursor_pointer" @click="removeSearchItem('/majoritems_aggregate')" v-if="checkMenuPermission('Report:ReportObject:view') && (!isHeadquartersMode&&!isSystemApprovalMode)">
                    <li v-bind:class="{ active: path=='/majoritems_aggregate', current: path=='/majoritems_aggregate' }">
                      <a>
                        <figure class="ts_ex_sidebar_menu_icon">
                          <img class="active" src="../assets/icon_note_green.svg" alt="">
                          <img class="normal" src="../assets/icon_note_white.svg" alt="">
                        </figure>
                        <p>CSVデータ出力</p>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </aside>
          <router-view></router-view>
          <!-- /.content-wrapper -->
        </template>
        <template v-else>
          <router-view></router-view>
        </template>
      </div>
    </body>
  </div>
</template>
<script src="https://kit.fontawesome.com/cbf6c84a1b.js" crossorigin="anonymous"></script>
<script>
import "@/node_modules/bootstrap/dist/js/bootstrap.min.js"
import "@/node_modules/bootstrap/dist/css/bootstrap.min.css";
import "@/node_modules/font-awesome/css/font-awesome.min.css";
import "@/node_modules/admin-lte/bower_components/Ionicons/css/ionicons.min.css";
import "@/node_modules/bootstrap/dist/css/bootstrap.min.css";
import "@/node_modules/admin-lte/dist/css/AdminLTE.min.css";
import "@/node_modules/admin-lte/dist/css/skins/_all-skins.min.css";

import request from 'superagent'
import { event } from '~/plugins/events.js'
import { permission } from '~/store'

event.init()
export default {
  name: 'app',
  data() {
    return {
      logined: false,
      isTablet: false,
      isHeadquartersMode: this.toBoolean(localStorage.getItem('is_headquarters_mode')),
      isSystemApprovalMode: this.toBoolean(localStorage.getItem('is_system_approval_mode')),
      path: '',
      username: '',
      buildingname: '',
      companyName: '',
      buildingId: localStorage.getItem('buildings_id'),
      memberId: localStorage.getItem('member_id'),
      autoConfigId: [],
      role: localStorage.getItem('role'),
      operationId: '',
      waitSeconds: 900,
      refreshTimeSeconds: 3000,
      dataCategory: 'home',
      menuList: {
        report:[],
        businessReportGroupDefinitions: []
      },
      sensor_log_menus: [
        {id: 'layout/1', name: 'タグ比較 時間'},
        // {id: 2, name: 'タグ比較 期間'},
        {id: 'layout/2', name: 'タグ比較 日付'}
      ],
      notificationList: [],
      autoCreateList: [],
      activePath: '',
      activeIndex: -1,
      activeIndex2: -1,
      activeIndex3: -1,
      isSensorLog: false,
      isClose:false,
      activeFlag: false,
      env: process.env.ENV
    }
  },
  methods: {
    updateLogin() {
      this.logined = true
      this.username = localStorage.getItem('username')
      this.buildingname = localStorage.getItem('buildings_name')
      this.companyName = localStorage.getItem('company_name')
      this.menuList.report = JSON.parse(localStorage.getItem('report_list'));
      this.refreshToken(true)
      $('body').removeClass('login-page')
      // $('body').addClass('skin-black')
    },
    logout() {
      this.requestAbort()
      this.store.clear()
      permission.clear()
      // $('body').removeClass('skin-black')
      this.$router.push('/login')
      delete this.$router.redirect
      event.emit('login-update')
    },
    select_building() {
      this.requestAbort();
      localStorage.removeItem('search_item');
      this.$router.push('/select_building');
    },
    select_company() {
      this.requestAbort();
      this.$router.push('/select_company');
    },
    send_feedback() {
      this.requestAbort()
      window.open('https://docs.google.com/spreadsheets/d/1oBKhQYh8qYEGwEDGXYkPVqfbhLazrMyxYdNCa6Hzong/edit?usp=sharing');
    },
    send_help() {
      this.requestAbort()
      if (this.role != 'owner') {
        window.open('https://teachme.jp/10137/folders/106697/manuals/?random=1623289084405&page=1&sortKey=title&sortOrder=asc&displayType=published&keywordKind=full_text');
      } else {
        window.open('https://docs.google.com/presentation/d/1sIvLNiZKA6NwMlS70gUlU2oYxLkOptboKMD5uUkv8J8/edit?usp=sharing');
      }
      // window.open('https://teachme.jp/10137/folders/106678/sub_folders/98567/manuals?random=1620875558705&page=1&sortKey=date&sortOrder=desc&displayType=visible');
    },
    setpath(route) {
      const paths = route.path.split('/')
      this.path = paths.length >= 2 ? paths[1] : ''
      if (this.path == 'report') {
        if (route.fullPath.indexOf('add') >= 0 || route.fullPath.indexOf('details') >= 0 || route.fullPath.indexOf('edit') >= 0) { //NOTE:新規登録画面
          this.path = '/'+this.path +'/' + this.$route.params.operation_category;
        } else {//NOTE:一覧画面
          this.path = route.fullPath;
        }
      } else if (this.path == 'attendance' || this.path == 'monthly_reports' || this.path == 'calendars' || this.path == 'majoritems_setting'){
        if (route.fullPath.indexOf('add') >= 0 || route.fullPath.indexOf('details') >= 0 || route.fullPath.indexOf('edit') >= 0) {
          this.path = '/' + this.path + '/' + this.$route.params.operation_id;
        } else {
          this.path = route.fullPath;
        }
      } else if (this.path == 'majoritems') {
        if (route.fullPath.indexOf('add') >= 0 || route.fullPath.indexOf('details') >= 0 || route.fullPath.indexOf('edit') >= 0) {
          this.path = '/' + this.path + '/' + this.$route.params.operation_id + '/' + this.$route.params.majoritems_id
        }else{
          this.path =route.fullPath;
        }
      } else if (this.path == 'report_approval') {
        if (route.fullPath.indexOf('add') >= 0 || route.fullPath.indexOf('details') >= 0 || route.fullPath.indexOf('edit') >= 0) {
          // this.path = '/' + this.path + '/' + this.$route.params.report_id;
        } else {
          this.path = route.fullPath;
        }
      } else if (this.path == 'business_report') {
        if (route.fullPath.indexOf('add') >= 0 || route.fullPath.indexOf('details') >= 0 || route.fullPath.indexOf('edit') >= 0) {
          this.path = '/' + this.path + '/' + this.$route.params.operation_id + '/' + this.$route.params.report_group_id;
        } else {
          this.path = route.fullPath;
        }
      } else if (this.path == 'majoritems_aggregate') {
        this.path = route.fullPath;
      } else if (this.path == 'report_calendars') {
        this.path = '/' + this.path + '/' + this.$route.params.id;
      } else if (this.path == 'sensor_log') {
        this.path = '/' + this.path + '/layout/' + this.$route.params.id;
      }
    },
    watchEventHandler(event) {
      if (localStorage.getItem('role') == 'responsible') {
        this.timeout = +new Date() + this.waitSeconds * 1000
        if (this.$route.path == '/no_operation') {
          this.closeWebView()
          this.$router.push('/home')
        }
      }
    },
    refreshToken(isResponsible) {
      if (isResponsible == false) {
        var refreshTime = localStorage.getItem('refreshTime')
        if (refreshTime != null) {
          if (refreshTime - new Date() < 0) {
            const url = process.env.API_SERVER + '/members/refresh-token'
            request
              .post(url)
              .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
              .send()
              .end((err, res) => {
                if (res.ok) {

                  localStorage.setItem('token', res.body.token)
                  if (this.checkItemPermission("Common:forSystemApproval")){
                    var where = {"and":[{"companyId": localStorage.getItem('company_id')}]};
                    this.onSearch('/buildings', null, where, (val) => {
                      localStorage.setItem('building_list',JSON.stringify(val));
                    });
                  }else{
                    localStorage.setItem('building_list',JSON.stringify(res.body.buildings));
                  }
                  refreshTime = +new Date() + this.refreshTimeSeconds * 1000
                  localStorage.setItem('refreshTime', refreshTime)
                  this.checkRevision();
                } else {
                  window.location.href = '/#/error'
                }
              })
          }
        }
      } else if (isResponsible == true) {
        const url = process.env.API_SERVER + '/members/refresh-token'
        request
          .post(url)
          .set('Authorization', 'Bearer ' + localStorage.getItem('token'))
          .send()
          .end((err, res) => {
            if (res.ok) {
              var where = {"and":[{"companyId": localStorage.getItem('company_id')}]};
              if (this.checkItemPermission("Common:forSystemApproval")){
                this.onSearch('/buildings', null, where, (val) => {
                  localStorage.setItem('building_list',JSON.stringify(val));
                });
              }else{
                localStorage.setItem('building_list',JSON.stringify(res.body.buildings));
              }
              localStorage.setItem('token', res.body.token)
              this.checkRevision();
            }
          })
      }
    },
    setActiveIndex(categories, operation_type, index, index2, path) {
      if (categories) {
        for (var i = 0; i < categories.length; i++) {
          if ('/majoritems/'+ this.$route.params.operation_id + '/' + categories[i].id === path) {
            this.activeIndex = index;
            this.activeIndex2 = index2;
            this.activeFlag = true;

            var ele = document.getElementById('majoritems' + index + '_' + index2);
            if (ele != null) {
              ele.lastElementChild.style.display = 'block';
            }
          }
        }
      }
    },
    setActive(index, index2, name){
      if (index == this.activeIndex && (index2 == this.activeIndex2)) {
        this.activeIndex3 = -1;
        if (this.isClose){
          this.isClose = false;
        }else{
          this.isClose = true;
        }
      } else if (this.activeIndex3 == index2) {
        this.activeIndex3 = -1;
      } else {
        this.activeIndex3 = index2;
      }
      if (name==="センサーログ"){
        this.isSensorLog = true;
        // this.removeSearchItem("/sensor_log");
      } else {
        this.isSensorLog = false;
      }
    },
    activeTree() {
      //$('ul.sidebar-menu').tree()
      $(document).ready(() => {
        const trees = $('[data-widget="tree"]');
        trees.tree();
      });
    },
    /**
     * APIから取得した業務及び大項目のデータを変換
     */
    convertReportObjectDefinitions(reportObjectDefinitions, buildingOperations) {
      var reportObjectGroupDefinitions = [];
      var reportObjects;
      for (var i = 0; i < reportObjectDefinitions.length; i++) {
        if (reportObjectGroupDefinitions.length == 0) {
          reportObjects = this.getReportObjectDefinitionOfGroup(reportObjectDefinitions, reportObjectDefinitions[i].reportObjectGroupDefinition.id, buildingOperations);
          if (reportObjects.length != 0) {
            reportObjectGroupDefinitions.push({ name: reportObjectDefinitions[i].reportObjectGroupDefinition.name, id: reportObjectDefinitions[i].reportObjectGroupDefinition.id, reportObjectDefinitions: reportObjects});
          }
        }
        if(!this.isReportObjectGroupDefinitionsExists(reportObjectDefinitions[i], reportObjectGroupDefinitions)) {
          reportObjects = this.getReportObjectDefinitionOfGroup(reportObjectDefinitions, reportObjectDefinitions[i].reportObjectGroupDefinition.id, buildingOperations);
          if (reportObjects.length != 0) {
            reportObjectGroupDefinitions.push({ name: reportObjectDefinitions[i].reportObjectGroupDefinition.name, id: reportObjectDefinitions[i].reportObjectGroupDefinition.id, reportObjectDefinitions: reportObjects});
          }
        }
      }
      return reportObjectGroupDefinitions;
    },
    /**
     * 大項目定義グループの重複チェック
     */
    isReportObjectGroupDefinitionsExists(reportObjectDefinitions, reportObjectGroupDefinitions) {
      for (var i = 0; i < reportObjectGroupDefinitions.length; i++) {
        if (reportObjectGroupDefinitions[i].id == reportObjectDefinitions.reportObjectGroupDefinition.id) {
          return true;
        }
      }
      return false;
    },
    /**
     * 大項目の表示チェック
     */
    isReportObjectDefinition(reportObjectDefinitionsId, buildingOperations) {
      for (var i = 0; i < buildingOperations.length; i++) {
        if (reportObjectDefinitionsId == buildingOperations[i].reportObjectDefinitionId) return true;
      }
      return false;
    },
    /**
     * 特定(id)の大項目定義グループの大項目取得
     */
    getReportObjectDefinitionOfGroup(reportObjectDefinitions, id, buildingOperations) {
      var res = [];
      for (var i = 0; i < reportObjectDefinitions.length; i++) {
        if (reportObjectDefinitions[i].reportObjectGroupDefinitionId == id  && this.isReportObjectDefinition(reportObjectDefinitions[i].id, buildingOperations ) ) {
          res.push({name: reportObjectDefinitions[i].name, sort: reportObjectDefinitions[i].sort, id: reportObjectDefinitions[i].id, path: '/majoritems/' + reportObjectDefinitions[i].id, operationCategoryId: reportObjectDefinitions[i].operationCategoryId});
        }
      }
     res.sort(function(a,b){
      if(a.sort < b.sort) return -1;
      if(a.sort > b.sort) return 1;
        return 0;
      });
      return res;
    },
    /**
     * 共通UI表示項目の作成
     */
    createMenulist() {
      this.menuList.report = JSON.parse(localStorage.getItem('report_list'));
      this.menuList.report.sort(function(a,b){
        if(a.id < b.id) return -1;
        if(a.id > b.id) return 1;
        return 0;
      });
    },
    /**
     * localStorageに保存している検索条件の削除
     */
    removeSearchItem(path) {
      this.activeIndex3 = -1;
      this.isClose = false;
      localStorage.removeItem("search_item");

      this.$router.push(path);
    },
    closeSideMenu() {
      var tree = document.getElementsByName("majoritems");
      for (var i = 0; i < tree.length; i++) {
        tree[i].className = "treeview";
        tree[i].lastElementChild.style.display = 'none';
      }
    },
    getAutoSettingUiIdRequest(buildingId) {
      var operationIds = this.menuList.report.map(function(value){
        return value["id"];
      });

      var searchWhere = {and: [{buildingId:parseInt(localStorage.getItem('buildings_id'))}]};
      var that = this;
      this.onSearch('/autocreation-schedule-operation-category', null, searchWhere, val => {
        operationIds.forEach(function(id) {
          var res = val.find(function(value) {
            return (value.operationCategoryId == id);
          })
          if (res != undefined) {
            that.autoConfigId.push(res.id);
          } else {
            that.autoConfigId.push(0);
          }
        });
      });
    },
    getNotificationsRequest() {
      var searchWhere = {"and":[{"displayTo":{"gte":this.df(new Date())}},{"displayFrom":{"lte":this.df(new Date())}},{"display":true}]};
      this.onSearch('/notifications', null, searchWhere, val => {
        this.notificationList = val;
      });
    },
    displayNotification() {
      this.$router.push('/information');
      // var searchWhere = {"and":[{"displayTo":{"gte":this.df(new Date())}},{"displayFrom":{"lte":this.df(new Date())}},{"display":true}]};
      // this.onSearch('/notifications', null, searchWhere, val => {

      // });
    },
    mouseoverAct(id) {
      this.activeIndex3 = -1;
      var ele = document.getElementById(id);
      if (ele != undefined) {
        var before = document.getElementById(this.dataCategory);
        before.classList.remove("active");
        this.dataCategory = id;
        ele.classList.add("active");
      }
    },
    setDataCategory() {
      var home = [''];
      var master = ['buildings', 'members', 'operation_templates', 'companies', 'access_log', 'company_operation_types', 'company_operation_categories', 'company_report_object_group_definitions', 'company_disabled_group_contents', 'company_report_object_definitions'];
      var aggregate = ['monthly_report', '/majoritems_aggregate'];
      var majoritems = ['/majoritems_setting/', /calendars/, '/report_calendars/', '/monthly_reports/', '/report/', '/report_approval/', '/attendance/', '/majoritems/'];
      var before = document.getElementById(this.dataCategory);
      before.classList.remove("active");
      var find;

      find = master.find(val => val == this.path);
      if (find != undefined) {
        this.dataCategory = 'master';
        var ele = document.getElementById(this.dataCategory);
        ele.classList.add("active");
        return;
      }

      find = aggregate.find(val => val == this.path);
      if (find != undefined) {
        this.dataCategory = 'aggregate';
        var ele = document.getElementById(this.dataCategory);
        ele.classList.add("active");
        return;
      }

      for (var i = 0; i < this.menuList.report.length; i++) {
        for (var j = 0; j < majoritems.length; j++) {
          if (!this.path.indexOf(majoritems[j] + this.menuList.report[i].id)) {
            this.dataCategory = this.menuList.report[i].id;
            var ele = document.getElementById(this.dataCategory);
            if (ele != undefined) {
              ele.classList.add("active");
              return;
            }
          }
        }
      }

      this.dataCategory = 'home';
      var ele = document.getElementById(this.dataCategory);
      ele.classList.add("active");
    },
    onHome() {
      this.mouseoverAct('home');
      this.removeSearchItem('/');
    },
    setAutoCreate(list) {
      var searchWhere;
      var that = this;
      if (list != null){
        list.forEach(function(ope){
          var searchWhere = {"and":[{"operationTypeId": ope.operation_type_id},{"autoCreate":{"eq":"true"}}]};
          that.onSearch('/companies/' + localStorage.getItem('company_id') + '/report-object-group-definitions/', null, searchWhere, val => {
            that.autoCreateList.push({"operationTypeId": ope.operation_type_id, "isAutoCreate": val.length > 0 ? true : false});
          });
        });
      }
    },
    isAutoCreate(id) {
      const find = this.autoCreateList.find(ele => ele.operationTypeId == id);
      return find.isAutoCreate
    }
  },
  created() {
    if (this.$route.path == '/home') {
      this.isTablet = true;
    }
    if (this.isHeadquartersMode || this.isSystemApprovalMode) {
      this.menuList.report = JSON.parse(localStorage.getItem('report_list'));
      this.menuList.businessReportGroupDefinitions = JSON.parse(localStorage.getItem('business_report_group_definitions'))
    } else {
      if(localStorage.getItem('buildings_id')==null){
        location.href = '/login'
        delete this.$router.redirect
        event.emit('login-update')
      }
      this.createMenulist();
      this.operationId = this.getHeadOperationId();
      this.menuList.report = JSON.parse(localStorage.getItem('report_list'));
      this.menuList.businessReportGroupDefinitions = JSON.parse(localStorage.getItem('business_report_group_definitions'))
      // this.menuList.report.sort(function(a,b){
      //   if(a.id < b.id) return -1;
      //   if(a.id > b.id) return 1;
      //   return 0;
      // });
      this.getAutoSettingUiIdRequest(localStorage.getItem('buildings_id'));
    }
    console.log("レポート:"+localStorage.getItem('report_list'));
    this.setAutoCreate(this.menuList.report);
    event.on('login-update', this.updateLogin)
    this.updateLogin();
    this.getNotificationsRequest();
    this.setpath(this.$route)
    this.timeout = +new Date() + this.waitSeconds * 1000
    setInterval(
      function() {
        this.refreshToken(false)
      }.bind(this),
      1000
    )
    $(function() {
      // $("html,body,.wrapper").css("height", "100%");
    })
  },
  mounted() {
    this.setDataCategory();
  },
  watch: {
    $route: function(route) {
      this.activeFlag = false;
      this.activeIndex = -1;
      this.activeIndex2 = -1;
     // this.closeSideMenu();
      this.getNotificationsRequest();
      this.setpath(route);
      this.updateLogin();
      window.bodywrapper.scrollTop = 0;
    }
  }
}
</script>
<style>
header {
  background: #e6e6fa;
}
</style>

