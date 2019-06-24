<template>
  <div>
    <img v-if="qrcodes[0]" class="qrcode" :src="qrcodes[0].src" alt="QR Code" />
  </div>
</template>

<script>
import { makeFindMixin } from 'feathers-vuex'

export default {
  mixins: [
    makeFindMixin({
      service: 'qrcodes',
      params: () => ({
        query: {}
      })
    })
  ]
}
</script>

<style>
.qrcode {
  width: 100%;
}
</style>
