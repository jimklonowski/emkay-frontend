<template>
  <v-flex class="d-flex">
    <v-card outlined width="300" class="mr-4">
      <v-navigation-drawer
        left
        permanent
        floating
        width="300"
      >
        <template #prepend>
          <v-list-item v-show="filterCount > 0" class="error" link dark>
            <v-list-item-avatar class="ma-0">
              <v-avatar size="20" color="white error--text" v-text="filterCount" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ $tc('filters_applied', filterCount) }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action @click="resetFilters">
              <v-icon :title="$t('clear_filters')" v-text="'mdi-filter-variant-remove'" />
            </v-list-item-action>
          </v-list-item>
        </template>
        <v-subheader class="overline" v-text="$t('filters')" />
        <v-list dense rounded>
          <v-list-item v-for="(field, f) in filterFields" :key="f">
            <v-list-item-content>
              <v-text-field
                v-model.trim="model[field]"
                :label="$t(field)"
                autocomplete="off"
                prepend-inner-icon="mdi-filter-variant"
                clearable
                dense
                outlined
                @keydown.enter="addFilter(field, model[field])"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <template #append>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="caption text-right grey--text">
                <span>{{ filteredItems.length }}</span>
                {{ $tc('vehicles', filteredItems.length) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-navigation-drawer>
    </v-card>
    <v-card outlined width="100%">
      <v-card-title class="font-lato" v-text="$t('fleet_navigator')" />
      <v-subheader v-show="hasFilters" class="overline px-4" v-text="$t('current_filters')" />
      <v-card-actions v-show="hasFilters" class="px-4">
        <!-- Applied Filters -->
        <v-flex>
          <!-- iterate each category -->
          <template v-for="(value, name, index) in currentFilters">
            <!-- iterate each filter in that category -->
            <v-chip
              v-for="(filter, f) in currentFilters[name]"
              :key="`${index}-${f}`"
              close-icon="mdi-filter-variant-remove"
              class="caption mx-2"
              close
              @click:close="removeFilter(name, filter)"
            >
              <strong>{{ $t(name) }}</strong>
              <span>({{ filter }})</span>
            </v-chip>
          </template>
        </v-flex>
      </v-card-actions>
      <v-card-actions>
        <v-col cols="auto">
          <v-select
            v-model="sortBy"
            :label="$t('sort')"
            :items="sortFields.map(x => { return { text: $t(x), value: x }})"
            outlined
            dense
            @change="sortBy = $event"
          />
          <v-btn
            :outlined="sortDesc"
            :text="!sortDesc"
            :color="sortDesc ? 'primary' : undefined"
            icon
            @click="sortDesc = true"
          >
            <v-icon v-text="'mdi-sort-descending'" />
          </v-btn>
          <v-btn
            :outlined="!sortDesc"
            :text="sortDesc"
            :color="!sortDesc ? 'primary' : undefined"
            icon
            @click="sortDesc = false"
          >
            <v-icon v-text="'mdi-sort-ascending'" />
          </v-btn>
        </v-col>
      </v-card-actions>
      <v-card-text>
        <v-data-iterator
          :footer-props="{ itemsPerPageOptions: [10, 25, 50, 100, 500, 1000, -1] }"
          :items="filteredItems"
          :items-per-page.sync="pagination.itemsPerPage"
          item-key="vehicle_number"
        >
          <template #default="{ items, isExpanded, expand }">
            <v-slide-x-transition group class="d-flex flex-wrap" hide-on-leave>
              <v-col
                v-for="item in items"
                :key="item.vehicle_number"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card outlined shaped>
                  <v-toolbar color="transparent" dense flat>
                    <v-toolbar-title>
                      {{ item.vehicle_number }}
                    </v-toolbar-title>
                    <v-spacer />
                    <v-btn icon @click="expand(item, !isExpanded(item))">
                      <v-icon v-text="isExpanded(item) ? 'mdi-card-bulleted' : 'mdi-card-bulleted-outline'" />
                    </v-btn>
                  </v-toolbar>
                  <v-card-subtitle v-show="item[sortBy]" v-text="item[sortBy]" />
                  <v-list v-if="isExpanded(item)" dense>
                    <v-divider />
                    <v-list-item v-for="(field, f) in displayFields" :key="`field-${f}`">
                      <v-list-item-title>{{ $t(field) }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item[field] }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-slide-x-transition>
          </template>
        </v-data-iterator>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'FleetNavigator',
  async fetch () {
    await this.fetchVehicles()
  },
  data: vm => ({
    // to start off, return a default object with no filters in each filterType array
    currentFilters: vm.defaultFilter(),
    displayFields: ['center_code', 'center_name', 'model_year', 'vehicle_make', 'vehicle_model', 'vehicle_color', 'in_service_date', 'vin', 'contract_description'],
    filterFields: ['center_code', 'model_year', 'vehicle_make', 'vehicle_model', 'vehicle_number', 'driver_last_name'],
    model: {
      center_code: '',
      vehicle_make: ''
    },
    pagination: {
      itemsPerPage: 50
    },
    search: '',
    sortFields: ['center_code', 'center_name', 'vehicle_number', 'driver_last_name', 'model_year', 'vehicle_make', 'vehicle_model', 'vehicle_color', 'in_service_date', 'vin', 'contract_description'],
    sortBy: 'center_code',
    sortDesc: false
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      filteredVehicles: 'fleet/filteredVehicles'
    }),
    filteredItems () {
      const order = this.sortDesc ? 'desc' : 'asc'
      const sortBy = this.sortBy || 'center_code'
      return this.filteredVehicles(this.currentFilters, sortBy, order)
    },
    filterCount: vm => [].concat(...Object.values(vm.currentFilters)).length,
    hasFilters: vm => Object.values(vm.currentFilters).map(x => x.filter(Boolean).length).reduce((a, b) => a + b, 0)
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchVehicles: 'fleet/fetchVehicles'
    }),
    addFilter (name, value) {
      if (!value) { return }
      if (!this.currentFilters[name].includes(value)) {
        this.currentFilters[name].push(value.toUpperCase())
        this.model[name] = null // clear the textfield since we successfully added a filter
      }
    },
    defaultFilter () {
      return {
        center_code: [],
        vehicle_make: [],
        vehicle_model: [],
        vehicle_category: [],
        driver_state_province: [],
        model_year: []
      }
    },
    removeFilter (name, value) {
      this.currentFilters[name].splice(this.currentFilters[name].findIndex(item => item === value), 1)
    },
    resetFilters () {
      this.currentFilters = this.defaultFilter()
    }
  },
  /**
   * Page Meta
   */
  head () {
    const title = this.$t('fleet_navigator')
    return {
      title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: title }
      ]
    }
  }
}
</script>
