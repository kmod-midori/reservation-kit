<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="reservations"
      class="elevation-1"
      :loading="isFindReservationsPending"
      :pagination.sync="pagination"
      :rows-per-page-items="[5, 10, 25]"
      :total-items="
        reservationsPaginationData && reservationsPaginationData.total
      "
    >
      <template v-slot:items="props">
        <td>{{ props.item.room.name }}</td>
        <td>{{ props.item.createdAt | moment }}</td>
        <template v-if="props.item.seatId !== null">
          <td>
            Seat <b>{{ props.item.seatId }}</b>
          </td>
          <td>
            <v-chip v-if="props.item.confirmed" color="success" small>
              Confirmed
            </v-chip>
            <v-chip v-if="props.item.expired" small>
              Expired
            </v-chip>
          </td>
        </template>
        <template v-else>
          <td>
            From <b>{{ props.item.startTime | moment }}</b> to
            <b>{{ props.item.endTime | moment }}</b>
          </td>
          <td>
            <v-chip
              v-if="props.item.adminStatus === 'waiting'"
              color="warning"
              small
            >
              Waiting for admin
            </v-chip>
            <v-chip
              v-if="props.item.adminStatus === 'accepted'"
              color="success"
              small
            >
              Admin confirmed
            </v-chip>
            <v-chip
              v-if="props.item.adminStatus === 'rejected'"
              color="error"
              small
            >
              Admin rejected
            </v-chip>
          </td>
        </template>
        <td>
          <v-icon
            :disabled="!canDelete(props.item)"
            small
            @click="cancel(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
    </v-data-table>
    <v-btn fab fixed bottom right color="accent" to="/reservations/new">
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { makeFindMixin } from 'feathers-vuex'
import moment from 'moment'
export default {
  components: {},
  mixins: [
    makeFindMixin({
      service: 'reservations',
      params() {
        const query = {
          $limit: this.pagination.rowsPerPage,
          $skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          userId: this.$store.state.auth.user._id
        }
        if (this.pagination.sortBy) {
          query.$sort = {
            [this.pagination.sortBy]: this.pagination.descending ? -1 : 1
          }
        }
        return { query }
      }
    })
  ],
  data() {
    return {
      headers: [
        { text: 'Room', value: 'room', sortable: false },
        { text: 'Created At', value: 'createdAt', sortable: true },
        { text: 'Info', value: 'info', sortable: false },
        { text: 'Status', value: 'status', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 25,
        sortBy: 'createdAt',
        descending: true
      }
    }
  },
  methods: {
    async cancel(resv) {
      let failed = false
      try {
        await resv.remove()
      } catch (error) {
        failed = true
        this.$store.commit(
          'snackbar/error',
          error.message || 'Cancellation failed.'
        )
      }
      failed || this.$store.commit('snackbar/success', 'Cancelled')
    },
    isRoomMode(resv) {
      return resv.startTime && resv.endTime
    },
    canDelete(resv) {
      const roomMode = this.isRoomMode(resv)
      const timeExceeded = moment(resv.createdAt).isSameOrBefore(
        moment().subtract(5, 'minutes')
      )
      return roomMode || (!timeExceeded && !resv.expired && !resv.confirmed)
    }
  }
}
</script>
