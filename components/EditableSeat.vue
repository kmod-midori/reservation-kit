<template>
  <div class="editable-seat" :style="style">{{ id }}</div>
</template>

<script>
import interact from 'interactjs'

export default {
  props: {
    grid: Function,
    gridSize: Number,

    id: Number,
    x: Number,
    y: Number,
    width: Number,
    height: Number
  },
  computed: {
    style() {
      return {
        width: this.width + 'px',
        height: this.height + 'px',
        lineHeight: this.height + 'px',
        transform: `translate3d(${this.x}px, ${this.y}px, 0px)`
      }
    }
  },
  watch: {
    grid(val) {
      this.resetInteract()
    }
  },
  mounted() {
    this.resetInteract()
  },
  methods: {
    resetInteract() {
      interact(this.$el).unset()
      interact(this.$el)
        .draggable({
          origin: 'parent',
          modifiers: [
            interact.modifiers.restrict({
              restriction: 'parent',
              elementRect: {
                top: 0,
                left: 0,
                bottom: 1,
                right: 1
              },
              endOnly: true
            }),
            interact.modifiers.snap({
              targets: [this.grid],
              range: Infinity,
              relativePoints: [{ x: 0, y: 0 }]
            })
          ]
        })
        .resizable({
          // resize from edges that do not require relocation
          edges: {
            right: true,
            bottom: true
          },
          modifiers: [
            interact.modifiers.restrictEdges({
              outer: 'parent',
              endOnly: true
            }),
            interact.modifiers.restrictSize({
              min: {
                width: this.gridSize,
                height: this.gridSize
              }
            }),
            interact.modifiers.snapSize({
              targets: [this.grid]
            })
          ]
        })
        .on('dragmove', event => {
          this.$emit('update:x', this.x + event.dx)
          this.$emit('update:y', this.y + event.dy)
        })
        .on('resizemove', event => {
          this.$emit('update:width', event.rect.width)
          this.$emit('update:height', event.rect.height)
        })
        .on('doubletap', event => {
          this.$emit('doubleclick', event)
        })
    }
  }
}
</script>

<style lang="scss">
.editable-seat {
  position: absolute;
  background-color: #29e;
  color: white;
  text-align: center;
  left: 0;
  top: 0;
}
</style>
