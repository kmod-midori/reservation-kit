<template>
  <div>
    <v-select
      v-model="room"
      label="Room"
      :items="rooms"
      item-text="name"
      return-object
    ></v-select>

    <template v-if="room">
      <room-rules :room="room" />
      <reservation-form :room="room" @submit="verify" />
      <vue-recaptcha
        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
      ></vue-recaptcha>
    </template>
  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha'
import ReservationForm from '../../components/ReservationForm'
import RoomRules from '../../components/RoomRules'

export default {
  components: {
    ReservationForm,
    RoomRules,
    VueRecaptcha
  },
  data() {
    return {
      room: null,
      rooms: [
        {
          id: '1',
          name: 'X9410 (Study Zone)',
          seats: true,
          instant: true,
          openingHours: ['00:00', '22:00'],
          minDuration: 30
        },
        {
          id: '2',
          name: 'X9506',
          seats: false,
          instant: false,
          openingHours: ['08:00', '22:00'],
          minDuration: 30,
          allowedDays: [3, 30]
        }
      ],
      form: null
    }
  },
  methods: {
    verify(form) {
      this.form = form
    }
  },
  meta: {
    back: true
  }
}
</script>
