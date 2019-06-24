<template>
  <div>
    <room-form :room-id="roomId" />
  </div>
</template>

<script>
import RoomForm from '~/components/RoomForm.vue'

export default {
  components: {
    RoomForm
  },
  computed: {
    roomId() {
      return this.$route.params.id === 'new' ? null : this.$route.params.id
    }
  },
  meta: {
    back: true
  }
}
</script>
