<template>
  <div class="seat-editor-container" :style="containerStyle">
    <div class="seat-editor-seat">1</div>
  </div>
</template>

<script>
export default {
  props: {
    gridSize: {
      type: Number,
      default: 40
    },
    gridX: {
      type: Number,
      default: 10
    },
    gridY: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      seats: []
    }
  },
  computed: {
    containerStyle() {
      return {
        width: this.gridSize * this.gridX + 1 + 'px',
        height: this.gridSize * this.gridY + 1 + 'px',
        backgroundSize: `${this.gridSize}px ${this.gridSize}px`
      }
    }
  }
}
</script>

<style lang="scss">
.seat-editor-container {
  background-repeat: repeat;
  background-image: linear-gradient(to right, white 1px, transparent 1px),
    linear-gradient(to bottom, white 1px, transparent 1px);
}

.seat-editor-seat {
}
</style>
