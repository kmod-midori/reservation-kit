<template>
  <v-card>
    <v-card-title>
      <div class="headline">Login</div>
    </v-card-title>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-text-field v-model="uid" label="ID" class="mr-1" />
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field v-model="pass" label="Password" type="password" />
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn flat :disabled="!uid || !pass" @click="login">Login</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      uid: null,
      pass: null
    }
  },
  meta: {
    public: true
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('auth/authenticate', {
          strategy: 'local',
          uid: this.uid,
          password: this.pass
        })
        this.$store.commit('snackbar/success', 'Logged in.')
        this.$router.push('/')
      } catch (error) {
        this.$store.commit('snackbar/error', error.message || 'Login failed.')
      }
    }
  }
}
</script>
