<template>
  <v-snackbar
    v-model="show"
    :color="$store.state.snackbar.color"
    :timeout="6000"
  >
    {{ $store.state.snackbar.message }}
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },
  created() {
    this.$store.watch(
      state => state.snackbar.ts,
      () => {
        const msg = this.$store.state.snackbar.message
        if (msg !== '') {
          this.show = true
        }
      }
    )
  }
}
</script>
