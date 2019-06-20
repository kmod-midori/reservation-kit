<template>
  <v-list>
    <v-list-tile router exact to="/">
      <v-list-tile-action>
        <v-icon>home</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>Home</v-list-tile-title>
    </v-list-tile>

    <v-list-tile router to="/reservations">
      <v-list-tile-action>
        <v-icon>event</v-icon>
      </v-list-tile-action>
      <v-list-tile-title>Reservations</v-list-tile-title>
    </v-list-tile>
  </v-list>
</template>
