<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="users"
      class="elevation-1"
      :loading="isFindUsersPending"
      :pagination.sync="pagination"
      :rows-per-page-items="[5, 10, 25]"
      :total-items="usersPaginationData && usersPaginationData.total"
    >
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.uid }}</td>
        <td>{{ props.item.email }}</td>
        <td>{{ props.item.admin ? 'Y' : 'N' }}</td>
        <td>
          <v-icon small class="mr-2" @click="editUser(props.item)">edit</v-icon>
          <v-icon small>delete</v-icon>
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="editDialog" max-width="1000">
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <user-form :user="editingUser" @submit="editDialog = false" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-btn fab fixed bottom right color="accent" @click="addUser">
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { makeFindMixin } from 'feathers-vuex'
import UserForm from '../../components/UserForm'

export default {
  components: { UserForm },
  mixins: [
    makeFindMixin({
      service: 'users',
      params() {
        const query = {
          $limit: this.pagination.rowsPerPage,
          $skip: (this.pagination.page - 1) * this.pagination.rowsPerPage
        }
        if (this.pagination.sortBy) {
          query.$sort = {
            [this.pagination.sortBy]: this.pagination.descending ? -1 : 1
          }
        }
        return { query }
      }
    })
  ],
  data() {
    return {
      editDialog: false,
      editingUser: null,
      headers: [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'ID', value: 'uid', sortable: true },
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Admin', value: 'admin', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 25
      }
    }
  },
  methods: {
    editUser(user) {
      this.editingUser = user
      this.editDialog = true
    },
    addUser() {
      this.editingUser = null
      this.editDialog = true
    }
  }
}
</script>
