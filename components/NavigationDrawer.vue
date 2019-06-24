<template>
  <v-list>
    <v-list-tile router exact to="/">
      <v-list-tile-action>
        <v-icon>home</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>Home</v-list-tile-title>
    </v-list-tile>

    <v-list-tile router to="/qrcode">
      <v-list-tile-action>
        <v-icon>mdi-qrcode</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>QR Code</v-list-tile-title>
    </v-list-tile>

    <v-list-tile router to="/reservations">
      <v-list-tile-action>
        <v-icon>event</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>My Reservations</v-list-tile-title>
    </v-list-tile>

    <v-list-group v-if="isAdmin" prepend-icon="settings">
      <template v-slot:activator>
        <v-list-tile>
          <v-list-tile-title>Admin</v-list-tile-title>
        </v-list-tile>
      </template>

      <v-list-tile router to="/admin/rooms">
        <v-list-tile-title>Rooms</v-list-tile-title>
        <v-list-tile-action>
          <v-icon>meeting_room</v-icon>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile router to="/admin/users">
        <v-list-tile-title>Users</v-list-tile-title>
        <v-list-tile-action>
          <v-icon>people</v-icon>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile router to="/admin/kiosk">
        <v-list-tile-title>Kiosk</v-list-tile-title>
        <v-list-tile-action>
          <v-icon>tv</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list-group>
  </v-list>
</template>

<script>
export default {
  computed: {
    isAdmin() {
      return this.$store.state.auth.user && this.$store.state.auth.user.admin
    }
  }
}
</script>
