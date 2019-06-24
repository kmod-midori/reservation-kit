<template>
  <v-layout row wrap>
    <v-flex xs12 md3>
      <v-btn block @click="addSeat">
        <span>Add Seat</span><v-icon right>add</v-icon>
      </v-btn>
      <p>Double click on a seat to edit.</p>
    </v-flex>

    <v-flex xs12 md9>
      <div class="seat-editor-container">
        <div class="seat-editor-grid" :style="gridStyle">
          <editable-seat
            v-for="seat in seats"
            :key="seat.id"
            v-bind.sync="seat"
            :grid="snapGrid"
            :grid-size="gridSize"
            @doubleclick="edit(seat)"
          />
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import interact from 'interactjs'
import _ from 'lodash'
import EditableSeat from './EditableSeat'

export default {
  components: {
    EditableSeat
  },
  props: {
    seats: Array
  },
  data() {
    return {
      gridSize: 50,
      gridX: 50,
      gridY: 50
    }
  },
  computed: {
    gridStyle() {
      return {
        width: this.gridSize * this.gridX + 'px',
        height: this.gridSize * this.gridY + 'px',
        backgroundSize: `${this.gridSize}px ${this.gridSize}px`
      }
    },
    snapGrid() {
      return interact.createSnapGrid({
        x: this.gridSize,
        y: this.gridSize
      })
    }
  },
  methods: {
    addSeat() {
      const id =
        this.seats.length === 0
          ? 1
          : _.maxBy(this.seats, seat => seat.id).id + 1
      const seat = {
        id,
        x: 0,
        y: 0,
        width: this.gridSize,
        height: this.gridSize
      }
      this.seats.push(seat)
    }
  }
}
</script>

<style lang="scss">
.seat-editor-container {
  max-width: 100%;
  max-height: 500px;

  overflow: auto;
  -webkit-user-select: none;
}

.seat-editor-grid {
  position: relative;
  background-repeat: repeat;
  background-image: linear-gradient(to right, black 1px, transparent 1px),
    linear-gradient(to bottom, black 1px, transparent 1px);
}
</style>
