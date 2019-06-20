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
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="value"
        :label="label"
        :rules="rules"
        prepend-icon="access_time"
        readonly
        v-on="on"
      ></v-text-field>
    </template>

    <v-time-picker
      :value="value"
      :allowed-hours="allowedHours"
      :allowed-minutes="allowedMinutes"
      format="24hr"
      full-width
      :max="max"
      :min="min"
      @input="input"
    >
      <v-spacer></v-spacer>
      <v-btn flat color="primary" @click="menu = false">
        OK
      </v-btn>
    </v-time-picker>
  </v-menu>
</template>

<script>
// import moment from 'moment'
export default {
  props: {
    label: {
      type: String,
      default: 'Date'
    },
    value: {
      type: String,
      default: null
    },
    allowedHours: {
      type: Function,
      default: undefined
    },
    allowedMinutes: {
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
