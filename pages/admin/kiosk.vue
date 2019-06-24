<template>
  <v-layout row wrap>
    <template v-if="!locked">
      <v-flex xs11>
        <v-select
          v-model="room"
          label="Room"
          :items="rooms"
          :loading="isFindRoomsPending"
          :disabled="isFindRoomsPending"
          item-text="name"
          return-object
        ></v-select>
      </v-flex>
      <v-flex xs1>
        <v-btn block :disabled="!room" @click="locked = true">Lock</v-btn>
      </v-flex>
    </template>

    <template v-if="room">
      <v-flex xs3>
        <template v-if="mode">
          <p class="headline">Please scan your QR code.</p>
          <qrcode-stream @decode="onDecode" />
        </template>
      </v-flex>

      <v-flex xs6>
        <seat-selector :room="room" />
      </v-flex>

      <v-flex xs3>
        <v-btn
          large
          block
          color="success"
          style="height: 100px"
          class="mb-4"
          @click="setMode('checkin')"
        >
          <v-icon v-if="mode === 'checkin'" left>star</v-icon>
          <span>Check In</span>
        </v-btn>
        <v-btn
          large
          block
          color="error"
          style="height: 100px"
          @click="setMode('leave')"
        >
          <v-icon v-if="mode === 'leave'" left>star</v-icon>
          Leave
        </v-btn>
      </v-flex>
    </template>
  </v-layout>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import { makeFindMixin } from 'feathers-vuex'
import jws from 'jws'

import SeatSelector from '../../components/SeatSelector'

const COUNTDOWN_DEFAULT = 60

export default {
  layout: 'kiosk',
  components: {
    QrcodeStream,
    SeatSelector
  },
  mixins: [
    makeFindMixin({
      service: 'rooms',
      params: () => ({
        query: {
          mode: 'seat'
        }
      })
    })
  ],
  data() {
    return {
      room: null,
      locked: false,
      countdown: 0,
      mode: null
    }
  },
  mounted() {
    setInterval(() => {
      if (this.countdown !== 0) {
        this.countdown -= 1
      } else if (this.mode !== null) {
        this.mode = null
      }
    }, 1000)
  },
  methods: {
    async onDecode(decoded) {
      try {
        const { payload: rawPayload } = jws.decode(decoded)
        const payload = JSON.parse(rawPayload)
        if (this.mode === 'checkin') {
          await this.checkIn(decoded, payload)
        } else if (this.mode === 'leave') {
          await this.leave(decoded, payload)
        }
      } catch (error) {
        this.$store.commit('snackbar/error', error.message || 'Failed.')
      }
      this.resetCountdown()
    },
    async checkIn(raw, payload) {
      const { Reservation } = this.$FeathersVuex
      const resvPages = await Reservation.find({
        query: {
          roomId: this.room._id,
          userId: payload.u,
          confirmed: false,
          expired: false
        }
      })

      if (resvPages.total > 0) {
        const resv = resvPages.data[0].clone()
        resv.confirmed = true
        await resv.save({
          query: { $client: { qrData: raw } }
        })
        this.$store.commit('snackbar/success', 'Check in succeed.')
      } else {
        throw new Error('Valid reservation not found.')
      }
    },
    async leave(raw, payload) {
      const { Reservation } = this.$FeathersVuex
      const resvPages = await Reservation.find({
        query: {
          roomId: this.room._id,
          userId: payload.u,
          confirmed: true,
          expired: false
        }
      })

      if (resvPages.total > 0) {
        const resv = resvPages.data[0].clone()
        resv.expired = true
        await resv.save({
          query: { $client: { qrData: raw } }
        })
        this.$store.commit('snackbar/success', 'Leaving succeed.')
      } else {
        throw new Error('Valid reservation not found.')
      }
    },
    resetCountdown() {
      this.countdown = COUNTDOWN_DEFAULT
    },
    setMode(mode) {
      this.countdown = COUNTDOWN_DEFAULT
      this.mode = mode
    }
  }
}
</script>
