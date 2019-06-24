<template>
  <div>
    <div v-if="isGetSeatStatusPending">Loading...</div>
    <div v-else class="seat-container">
      <div
        v-for="seat in room.seats"
        :key="seat.id"
        :class="['seat', seatAvail(seat)]"
        :style="seatStyles(seat)"
        @click="seatClicked(seat)"
      >
        {{ seat.id }}
      </div>
    </div>
  </div>
</template>

<script>
import { makeGetMixin } from 'feathers-vuex'

export default {
  mixins: [
    makeGetMixin({
      service: 'seatStatus',
      items: '_seatStatus',
      id: function() {
        return this.room._id
      }
    })
  ],
  props: {
    room: Object
  },
  mounted() {},
  destroyed() {},
  methods: {
    seatStyles(seat) {
      return {
        width: seat.width + 'px',
        height: seat.height + 'px',
        lineHeight: seat.height + 'px',
        left: seat.x + 'px',
        top: seat.y + 'px'
      }
    },
    seatAvail(seat) {
      return this.seatStatus.status[seat.id] || 'free'
    },
    seatClicked(seat) {
      seat.status = this.seatAvail(seat)
      this.$emit('seat-clicked', seat)
    }
  }
}
</script>

<style lang="scss">
.seat-container {
  position: relative;
  max-width: 100%;
  min-height: 500px;

  overflow: auto;
  .seat {
    position: absolute;
    color: white;
    text-align: center;
    &.free {
      background-color: green;
    }
    &.using {
      background-color: red;
    }
    &.reserved {
      background-color: orange;
    }
  }
}
</style>
