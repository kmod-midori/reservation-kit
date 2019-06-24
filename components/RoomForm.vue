<template>
  <div>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 md4>
            <v-text-field
              v-model="room.name"
              label="Name"
              required
              :rules="requiredRules"
            />
          </v-flex>
          <v-flex xs12 md4>
            <time-picker-menu
              v-model="room.openTime"
              label="Open Time"
              :allowed-minutes="allowedMinutes"
              :rules="requiredRules"
              @input="room.closeTime = null"
            />
          </v-flex>
          <v-flex xs12 md4>
            <time-picker-menu
              v-model="room.closeTime"
              label="Close Time"
              :min="room.openTime"
              :allowed-minutes="allowedMinutes"
              :rules="requiredRules"
            />
          </v-flex>
          <v-flex xs12>
            <v-textarea
              v-model="room.message"
              label="Message (will be shown to users, Markdown is supported)"
              auto-grow
            ></v-textarea>
          </v-flex>
          <v-flex xs12 md6>
            <p>
              <a href="https://www.markdownguide.org/basic-syntax/">
                Markdown Reference
              </a>
            </p>
            <p>If you need assistance, please ask the maintainer.</p>
          </v-flex>
          <v-flex xs12 md3>
            <h4>Reservation Mode (choose one)</h4>
            <v-btn-toggle v-model="room.mode" mandatory>
              <v-btn flat value="room">
                <span>Room</span>
                <v-icon>meeting_room</v-icon>
              </v-btn>
              <v-btn flat value="seat">
                <span>Seat</span>
                <v-icon>event_seat</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex xs12 md3>
            <v-text-field
              v-model.number="room.minDuration"
              type="number"
              :label="minDurationLabel"
              :rules="requiredRules"
            >
              <template slot="append">
                <p>min</p>
              </template>
            </v-text-field>
          </v-flex>
          <template v-if="room.mode == 'room'">
            <v-flex md6 xs12>
              <v-subheader>
                Days available (after the day of reservation)
              </v-subheader>
              <v-range-slider
                v-model="availableRange"
                :max="30"
                :min="0"
                :step="1"
                thumb-label="always"
              />
            </v-flex>
          </template>
          <template v-if="room.mode == 'seat'">
            <seat-map-editor :seats="room.seats" />
          </template>
          <v-flex xs12>
            <v-btn block :disabled="!valid" @click="save">
              <span>Save</span>
              <v-icon right>save</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import TimePickerMenu from './TimePickerMenu'
import SeatMapEditor from './SeatMapEditor'
export default {
  components: {
    TimePickerMenu,
    SeatMapEditor
  },
  props: {
    roomId: String
  },
  data() {
    return {
      valid: true,
      requiredRules: [v => !!v || 'This field is required'],
      room: {
        seats: []
      }
    }
  },
  computed: {
    availableRange: {
      get() {
        return [this.room.minDays, this.room.maxDays]
      },
      set(val) {
        this.room.minDays = val[0]
        this.room.maxDays = val[1]
      }
    },
    minDurationLabel() {
      return {
        room: 'Minimum reservation time',
        seat: 'Reservation expiration time'
      }[this.room.mode || 'room']
    }
  },
  watch: {
    roomId: {
      immediate: true,
      async handler(val) {
        const { Room } = this.$FeathersVuex
        if (val === null) {
          this.room = new Room()
        } else {
          try {
            this.room = (await Room.get(val)).clone()
          } catch (error) {
            this.$nuxt.error({ statusCode: 404, message: '' })
          }
        }
      }
    }
  },
  methods: {
    allowedMinutes(val) {
      return val === 0 || val === 30
    },
    async save() {
      if (this.$refs.form.validate()) {
        try {
          await this.room.save()
        } catch (error) {
          alert('Save Failed')
          return
        }
        this.$router.go(-1)
      }
    }
  }
}
</script>
