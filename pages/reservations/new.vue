<template>
  <div>
    <v-select
      v-model="room"
      label="Room"
      :items="rooms"
      :loading="isFindRoomsPending"
      :disabled="isFindRoomsPending"
      item-text="name"
      return-object
    ></v-select>

    <template v-if="room">
      <v-card v-if="room.message" class="mb-4">
        <v-card-title primary-title>
          <div v-html="parsedMessage"></div>
        </v-card-title>
      </v-card>

      <reservation-form :room="room" @submit="verify" />

      <v-dialog v-model="captchaDialog" :persistent="processing" width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">Verification</span>
          </v-card-title>
          <v-card-text>
            <vue-recaptcha
              v-show="!processing"
              ref="recaptcha"
              recaptcha-host="www.recaptcha.net"
              :load-recaptcha-script="true"
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              @verify="submit"
            />

            <div v-show="processing">
              Processing...
              <v-progress-linear indeterminate />
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha'
import { makeFindMixin } from 'feathers-vuex'
import moment from 'moment'
import ReservationForm from '../../components/ReservationForm'

export default {
  components: {
    ReservationForm,
    VueRecaptcha
  },
  mixins: [
    makeFindMixin({
      service: 'rooms',
      params: () => ({ query: {} })
    })
  ],
  data() {
    return {
      room: null,
      reservation: null,
      captchaDialog: false,
      processing: false
    }
  },
  computed: {
    parsedMessage() {
      return this.$options.filters.safeMarkdown(this.room.message)
    }
  },
  methods: {
    verify(form) {
      const { Reservation } = this.$FeathersVuex
      this.reservation = new Reservation({
        roomId: this.room._id
      })
      if (form.seat) {
        this.reservation.seatId = form.seat
      }
      if (form.date && form.time) {
        const format = 'YYYY-MM-DD HH:mm'
        this.reservation.startTime = moment(
          `${form.date} ${form.time.start}`,
          format
        ).toDate()
        this.reservation.endTime = moment(
          `${form.date} ${form.time.end}`,
          format
        ).toDate()
        this.reservation.usage = form.usage
      }

      this.$refs.recaptcha.reset()
      this.processing = false
      this.captchaDialog = true
    },
    async submit(recaptchaResponse) {
      this.processing = true
      let failed = false
      try {
        await this.reservation.save({
          query: { $client: { recaptchaResponse } }
        })
      } catch (error) {
        this.$store.commit(
          'snackbar/error',
          error.message || 'Reservation failed'
        )
        failed = true
      }

      if (!failed) {
        this.$store.commit('snackbar/success', 'Success')
        setTimeout(() => this.$router.go(-1), 3000)
      } else {
        this.captchaDialog = false
      }
    }
  },
  meta: {
    back: true
  }
}
</script>
