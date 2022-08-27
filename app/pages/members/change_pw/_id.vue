<template>
  <change-pw-view api="/members" :ok="'/members/details/'+$route.params.id"></change-pw-view>
</template>

<script>
  import ChangePwView from '~/components/ChangePwView'
  export default {
    components: {
      ChangePwView
    },
  }

</script>