<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <template v-if="room.mode === 'seat'">
        <v-alert :value="!instantAvailable" type="error">
          The room is currently not available for reservation. Opening hours:
          <b>{{ room.openTime }}</b> to <b>{{ room.closeTime }}</b>
        </v-alert>
        <template v-if="instantAvailable">
          <seat-selector :room="room" @seat-clicked="seatClicked" />
        </template>
      </template>

      <template v-if="room.mode === 'room'">
        <date-picker-menu
          v-model="date"
          :min="minDate"
          :max="maxDate"
          :rules="requiredRules"
          label="Date"
        />

        <template v-if="date">
          <time-picker-menu
            v-model="time.start"
            label="Start Time"
            :min="room.openTime"
            :max="maxStartTime"
            :allowed-minutes="allowedMinutes"
            @input="endTime = null"
          />

          <time-picker-menu
            v-if="time.start"
            v-model="time.end"
            label="End Time"
            :min="minEndTime"
            :max="room.closeTime"
            :allowed-minutes="allowedMinutes"
          />
        </template>
        <v-text-field
          v-model="usage"
          label="Usage"
          single-line
          required
          :rules="requiredRules"
        ></v-text-field>
        <v-btn :disabled="!valid" @click="submit">Submit</v-btn>
      </template>
    </v-form>

    <v-dialog v-model="seatDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Seat Information</v-card-title>
        <v-card-text>
          <v-layout v-if="seat" row wrap>
            <v-flex xs6>Seat Number</v-flex>
            <v-flex xs6>{{ seat.id }}</v-flex>
            <v-flex xs6>Status</v-flex>
            <v-flex xs6>
              <b>{{ seat.status | capitalize }}</b>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click="seatDialog = false">
            Close
          </v-btn>
          <v-btn
            v-if="seat && seat.status === 'free'"
            color="green"
            flat
            @click="submitInstant"
          >
            Reserve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { roomAvailable } from '../utils/time'
import DatePickerMenu from './DatePickerMenu'
import TimePickerMenu from './TimePickerMenu'
import SeatSelector from './SeatSelector'

const TIME_FORMAT = 'HH:mm'
const DATE_FORMAT = 'YYYY-MM-DD'

export default {
  components: {
    SeatSelector,
    DatePickerMenu,
    TimePickerMenu
  },
  props: {
    room: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      valid: true,
      requiredRules: [v => !!v || 'This field is required'],
      date: null,
      time: {
        start: null,
        end: null
      },
      usage: null,
      seat: null,
      seatDialog: false
    }
  },
  computed: {
    instantAvailable() {
      return roomAvailable(this.room)
    },
    maxStartTime() {
      return moment(this.room.closeTime, TIME_FORMAT)
        .subtract(this.room.minDuration, 'minutes')
        .format(TIME_FORMAT)
    },
    minEndTime() {
      return moment(this.time.start, TIME_FORMAT)
        .add(this.room.minDuration, 'minutes')
        .format(TIME_FORMAT)
    },
    minDate() {
      return moment()
        .add(this.room.minDays, 'days')
        .format(DATE_FORMAT)
    },
    maxDate() {
      return moment()
        .add(this.room.maxDays, 'days')
        .format(DATE_FORMAT)
    }
  },
  methods: {
    allowedMinutes(val) {
      return val === 0 || val === 30
    },
    seatClicked(seat) {
      this.seat = seat
      this.seatDialog = true
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$emit('submit', {
          date: this.date,
          time: {
            start: this.time.start,
            end: this.time.end
          },
          usage: this.usage
        })
      }
    },
    submitInstant() {
      this.seatDialog = false
      this.$emit('submit', {
        seat: this.seat.id
      })
    }
  }
}
</script>
