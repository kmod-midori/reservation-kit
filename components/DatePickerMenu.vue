<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    max-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="value"
        :label="label"
        prepend-icon="event"
        readonly
        :rules="rules"
        v-on="on"
      ></v-text-field>
    </template>

    <v-date-picker
      :value="value"
      :allowed-dates="allowedDates"
      no-title
      scrollable
      :max="max"
      :min="min"
      @input="input"
    >
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="menu = false">
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    label: {
      type: String,
      default: 'Date'
    },
    value: {
      type: String,
      default: moment().format('YYYY-MM-DD')
    },
    allowedDates: {
      type: Function,
      default: undefined
    },
    max: {
      type: String,
      default: undefined
    },
    min: {
      type: String,
      default: undefined
    },
    rules: {
      type: Array,
      default: undefined
    }
  },
  data() {
    return {
      menu: false
    }
  },
  methods: {
    input(e) {
      this.$emit('input', e)
    }
  }
}
</script>
