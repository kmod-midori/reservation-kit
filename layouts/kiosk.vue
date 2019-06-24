<template>
  <v-app>
    <v-toolbar fixed app>
      <v-toolbar-title v-text="title" />
    </v-toolbar>

    <v-content>
      <v-container fluid grid-list-xl>
        <nuxt />
      </v-container>
    </v-content>
    <global-snackbar />
  </v-app>
</template>

<script>
import GlobalSnackbar from '../components/GlobalSnackbar'
export default {
  components: {
    GlobalSnackbar
  },
  data() {
    return {
      title: 'Reservation Kit [Kiosk Mode]'
    }
  }
}
</script>
