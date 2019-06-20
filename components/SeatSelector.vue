<template>
  <div>
    <div class="seat-container">
      <div
        v-for="seat in seats"
        :key="seat.id"
        :class="['seat', seat.status]"
        :style="seatStyles(seat)"
        @click="$emit('seat-clicked', seat)"
      >
        {{ seat.id }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    room: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      seats: [
        {
          id: 1,
          position: [0, 30],
          width: 40,
          height: 40,
          status: 'free'
        },
        {
          id: 2,
          position: [50, 0],
          width: 40,
          height: 40,
          status: 'using'
        },
        {
          id: 3,
          position: [200, 0],
          width: 60,
          height: 40,
          status: 'reserved'
        }
      ]
    }
  },
  computed: {},
  methods: {
    seatStyles(seat) {
      const pos = seat.position
      return {
        width: seat.width + 'px',
        height: seat.height + 'px',
        lineHeight: seat.height + 'px',
        left: pos[0] + 'px',
        top: pos[1] + 'px'
      }
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
    // border: 2px solid black;
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
