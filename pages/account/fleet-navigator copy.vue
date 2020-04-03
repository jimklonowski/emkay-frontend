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
                <span>{{ items.length }}</span>
                {{ $tc('vehicles', items.length) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-navigation-drawer>
    </v-card>
    <v-card outlined width="100%">
      <v-card-title class="font-lato" v-text="$t('fleet_navigator')" />
      <v-subheader class="overline px-4" v-text="$t('current_filters')" />
      <v-card-actions class="px-4">
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
      <v-card-text class="d-flex">
        <v-scale-transition>
          <!-- Selected Item -->
          <v-card v-if="hasSelection" outlined min-width="300" height="400" class="ma-2">
            <v-card-title>
              {{ selectedItemTitle }}
              <v-spacer />
              <v-btn color="primary" icon @click="clearSelection">
                <v-icon v-text="'mdi-close'" />
              </v-btn>
            </v-card-title>
            <v-card-subtitle>
              <vehicle-number-button :vehicle-number="selectedItem.vehicle_number" />
            </v-card-subtitle>
            <v-divider />
            <v-card-text class="pa-0">
              <v-simple-table dense>
                <template #default>
                  <tbody>
                    <tr v-for="(field, f) in displayFields" :key="f">
                      <th class="overflow-ellipsis" v-text="$t(field)" />
                      <!-- eslint-disable-next-line vue/no-v-html -->
                      <td class="overflow-ellipsis" v-html="selectedItem[field]" />
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
            <v-card-actions />
          </v-card>
        </v-scale-transition>
        <v-slide-y-transition class="d-flex flex-wrap" group>
          <v-card
            v-for="(item, key) in items"
            :key="key"
            :color="item.vehicle_number === selectedItem.vehicle_number ? 'primary' : undefined"
            :dark="item.vehicle_number === selectedItem.vehicle_number"
            height="100"
            width="150"
            class="ma-2"
            outlined
            shaped
            tile
            @click="selectItem(item)"
          >
            <v-card-title>
              {{ item.vehicle_number }}
            </v-card-title>
            <v-card-subtitle class="overflow-ellipsis">
              {{ item[sortBy] }}
            </v-card-subtitle>
          </v-card>
        </v-slide-y-transition>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'FleetNavigator',
  components: {
    'vehicle-number-button': () => import(/* webpackChunkName: "VehicleNumberButton" */ '@/components/vehicle-dashboard/VehicleNumberButton.vue')
  },
  async fetch () {
    await this.fetchVehicles()
  },
  data: vm => ({
    // to start off, return a default object with no filters in each filterType array
    currentFilters: vm.defaultFilter(),
    displayFields: ['center_code', 'center_name', 'model_year', 'vehicle_make', 'vehicle_model', 'vehicle_color', 'in_service_date', 'vin', 'contract_description'],
    filterFields: ['center_code', 'model_year', 'vehicle_make', 'vehicle_model'],
    model: {
      center_code: '',
      vehicle_make: ''
    },
    search: '',
    selectedItem: {},
    sortFields: ['center_code', 'center_name', 'driver_last_name', 'model_year', 'vehicle_make', 'vehicle_model', 'vehicle_color', 'in_service_date', 'vin', 'contract_description'],
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
    items () {
      const order = this.sortDesc ? 'desc' : 'asc'
      const sortBy = this.sortBy || 'center_code'
      return this.filteredVehicles(this.currentFilters, sortBy, order)
    },
    filterCount: vm => [].concat(...Object.values(vm.currentFilters)).length,
    hasFilters: vm => Object.values(vm.currentFilters).map(x => x.filter(Boolean).length).reduce((a, b) => a + b, 0),
    hasSelection: vm => Object.keys(vm.selectedItem).length > 0,
    selectedItemTitle: vm => [vm.selectedItem.driver_first_name, vm.selectedItem.driver_last_name].filter(Boolean).join(' ')
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
        this.clearSelection()
      }
    },
    clearSelection () {
      this.selectedItem = {}
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
      this.selectedItem = {}
    },
    resetFilters () {
      this.currentFilters = this.defaultFilter()
    },
    selectItem (item) {
      this.selectedItem = {}
      // adding 100ms between clearing the old selection and selecting a new item lets us see the animation
      setTimeout(() => {
        this.selectedItem = { ...item }
      }, 100)
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

<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
