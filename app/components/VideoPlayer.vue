<template>
    <video id="videoplayer" ref="VideoPlayer" class="video-js"></video>
</template>

<script>
import videojs from 'video.js';

export default {
    name: "VideoPlayer",
    props: {
        options: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            player: null
        }
    },
    mounted() {
      const that = this;
      this.loadVideo();
    },
    methods: {
      loadVideo(){
        if (this.player) {
            this.player.dispose()
            this.player = null;
        }

        this.player = videojs(this.$refs.VideoPlayer, this.options, function onPlayerReady() {})
      },
      reloadVideo(src,img){
        this.player.poster(img);
        this.player.src({type:"video/mp4", src:src});
      },
    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose()
        }
    }
}
</script>