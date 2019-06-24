<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">{{ resv.room.name }}</div>
        <span class="grey--text">
          Created {{ resv.createdAt | momentRelative }}
        </span>
        <br />
        <span v-if="resv.seatId !== null" class="grey--text">
          Seat <b>{{ resv.seatId }}</b>
          <v-chip v-if="resv.confirmed" color="success" small>
            Confirmed
          </v-chip>
          <v-chip v-if="resv.expired" small>
            Expired
          </v-chip>
        </span>
        <span v-if="isRoomMode" class="grey--text">
          From <b>{{ resv.startTime | moment }}</b> to
          <b>{{ resv.endTime | moment }}</b>
          <v-chip v-if="resv.adminStatus === 'waiting'" color="warning" small>
            Waiting for admin
          </v-chip>
          <v-chip v-if="resv.adminStatus === 'accepted'" color="success" small>
            Admin confirmed
          </v-chip>
          <v-chip v-if="resv.adminStatus === 'rejected'" color="error" small>
            Admin rejected
          </v-chip>
        </span>
        <br />
      </div>
    </v-card-title>

    <v-card-actions>
      <v-btn v-if="canDelete" flat icon @click="$emit('cancel')">
        <v-icon>delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    resv: Object
  },
  computed: {

  }
}
</script>
