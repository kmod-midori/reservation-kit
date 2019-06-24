<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <navigation-drawer />
    </v-navigation-drawer>

    <v-toolbar fixed app>
      <v-btn icon @click="sideIconClicked">
        <v-icon>{{
          $store.state.meta.meta.back ? 'arrow_back' : 'menu'
        }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-toolbar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <global-snackbar />
  </v-app>
</template>

<script>
import NavigationDrawer from '../components/NavigationDrawer.vue'
import GlobalSnackbar from '../components/GlobalSnackbar'

export default {
  components: {
    NavigationDrawer,
    GlobalSnackbar
  },
  data() {
    return {
      drawer: null,
      title: 'Reservation Kit'
    }
  },
  methods: {
    sideIconClicked() {
      if (this.$store.state.meta.meta.back) {
        this.$router.go(-1)
      } else {
        this.drawer = !this.drawer
      }
    }
  }
}
</script>
