<template>
  <div class="container">
    <Basic></Basic>
    <Style></Style>
    <Drop></Drop>
    <Paste></Paste>
    <Chunk></Chunk>
    <BreakPoint></BreakPoint>
  </div>
</template>

<script>
import Basic from '~/components/Basic.vue'
import Drop from '~/components/Drop.vue'
import Paste from '~/components/Paste.vue'
import Chunk from '~/components/Chunk.vue'
import BreakPoint from '~/components/BreakPoint.vue'
import Style from '~/components/Style.vue'
export default {
  components: {
    Basic,
    Drop,
    Paste,
    Chunk,
    BreakPoint,
    Style
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style>
.container {
  /* margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center; */
}
</style>
