<template>
  <div>
    <v-list>
      <v-list-tile
        v-for="room in rooms"
        :key="room._id"
        avatar
        @click="roomClicked(room)"
      >
        <v-list-tile-avatar>
          <v-icon class="grey lighten-1 white--text">meeting_room</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-text="room.name"></v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn icon ripple @click="roomActionClicked(room)">
            <v-icon color="grey lighten-1">event</v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-btn fab fixed bottom right color="accent" to="/admin/rooms/new">
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { makeFindMixin } from 'feathers-vuex'
export default {
  mixins: [makeFindMixin({ service: 'rooms' })],
  computed: {
    roomsParams() {
      return { query: {} }
    }
  },
  methods: {
    roomClicked(room) {
      this.$router.push({ path: `/admin/rooms/${room._id}` })
    },
    roomActionClicked(room) {}
  }
}
</script>
