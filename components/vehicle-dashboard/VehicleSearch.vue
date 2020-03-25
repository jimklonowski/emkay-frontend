<template>
  <v-autocomplete
    v-model="selection"
    :label="$t('search')"
    :loading="loading"
    :items="search_results"
    :menu-props="{ nudgeBottom: 10, maxHeight: 360 }"
    :search-input.sync="query"
    item-value="vehicle_number"
    item-text="description"
    autocomplete="off"
    clearable
    solo
    no-filter
    hide-details
    return-object
    full-width
    @change="selectVehicle"
    @keydown.enter.stop="selectVehicle"
  >
    <template #progress>
      <v-progress-linear
        :buffer-value="0"
        color="primary lighten-2"
        height="4"
        absolute
        indeterminate
        stream
      />
    </template>
    <template #no-data>
      <v-list-item dense>
        <v-list-item-title v-if="query && query.length > 2 && !results.length" v-text="$t('no_search_results', { query })" />
        <v-list-item-title v-else v-text="$t('search_placeholder')" />
      </v-list-item>
    </template>
    <template #selection="{ item }">
      {{ item.vehicle_number }}
    </template>
    <template #item="{ item }">
      <v-list-item-avatar size="64" :title="$t('vehicle_#')" color="grey darken-2 white--text">
        <span class="caption" v-text="item.vehicle_number" />
      </v-list-item-avatar>
      <v-list-item-content>
        <span v-if="item.client_vehicle_number">
          <v-chip :title="$t('client_vehicle_#')" dark label x-small v-text="item.client_vehicle_number" />
        </span>
        <v-list-item-title class="subtitle-2" v-text="colorYearMakeModel(item)" />
        <v-list-item-subtitle class="body-2" v-text="driverName(item)" />
        <v-list-item-subtitle v-if="item.vin" class="caption font-weight-light" v-text="item.vin" />
      </v-list-item-content>
      <v-list-item-action class="align-center justify-start">
        <v-list-item-action-text v-if="item.plate_number" class="px-2" v-text="$t('plate_#')" />
        <v-chip v-if="item.plate_number" label small dark v-text="item.plate_number" />
      </v-list-item-action>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => ({
    query: '',
    selection: null
  }),
  computed: {
    ...mapGetters({
      loading: 'search/getLoading',
      results: 'search/getResults'
    }),
    search_results () {
      if (!this.results.length) { return [] }
      // remove duplicates
      return this.results.map(result => { return { ...result } })
    }
  },
  watch: {
    async query () {
      if (!this.query) {
        this.reset()
      } else if (this.query.length > 2) {
        await this.search(this.query.toUpperCase())
      }
    }
  },
  mounted () {
    if (this.results && this.results.length !== 0) {
      this.reset()
    }
  },
  methods: {
    ...mapActions({
      reset: 'search/reset',
      search: 'search/searchVehicles'
    }),
    selectVehicle () {
      if (this.selection && this.selection.vehicle_number) {
        this.$router.push(this.localePath({ path: `/vehicle/${this.selection.vehicle_number.toUpperCase()}` }))
      }
    },
    colorYearMakeModel (item) {
      return [item.color, item.year, item.make, item.model].filter(Boolean).join(' ')
    },
    driverName (item) {
      return [item.driver_first_name, item.driver_last_name].filter(Boolean).join(' ')
    }
  }
}
</script>
