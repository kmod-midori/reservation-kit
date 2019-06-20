<template>
  <v-card class="mb-4">
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Rules</h3>
        <div>
          <ul>
            <li>
              No food or drink allowed, please keep the room clean and quiet.
            </li>
            <li>Please arrive in 30 minutes after the reservation.</li>
          </ul>
        </div>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
export default {
  props: {
    room: {
      type: Object,
      default: undefined
    }
  }
}
</script>
