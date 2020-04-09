<template>
  <client-only>
    <v-data-iterator
      hide-default-footer
      :items="filteredItems"
      :items-per-page.sync="pagination.itemsPerPage"
      :loading="$fetchState.pending"
      :page.sync="pagination.page"
      :search="search"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      item-key="vehicle_number"
      @page-count="pagination.pageCount = $event"
    >
      <template #loading>
        <v-skeleton-loader type="table" :loading="$fetchState.pending" transition="fade-transition" style="width:100%;" />
      </template>
      <template #header>
        <v-toolbar
          dark
          color="primary darken-2"
          extension-height="64"
        >
          <v-toolbar-title class="font-lato">
            {{ $t('fleet_navigator') }}
          </v-toolbar-title>
          <v-spacer />
          <search-bar v-model="search" :label="$t('search')" />
          <template #extension>
            <v-dialog
              v-model="show_filter_dialog"
              max-width="600"
              scrollable
            >
              <template #activator="{ on }">
                <v-btn color="primary" depressed v-on="on">
                  {{ hasFilters ? `${filterCount} ${$tc('filters_applied', filterCount)}` : $t('filters') }}
                </v-btn>
              </template>
              <v-card>
                <v-toolbar v-if="!hasFilters" color="primary" dark>
                  <v-toolbar-title class="font-lato" v-text="$t('filters')" />
                  <v-spacer />
                  <v-btn icon @click="show_filter_dialog = false">
                    <v-icon v-text="'mdi-close'" />
                  </v-btn>
                </v-toolbar>
                <v-toolbar v-else color="error" dark>
                  <v-avatar size="20" color="white error--text" class="mr-2" v-text="filterCount" />
                  <v-toolbar-title>{{ $tc('filters_applied', filterCount) }}</v-toolbar-title>
                  <v-spacer />
                  <v-btn tabindex="-1" class="mr-2" small text @click="resetFilters">
                    {{ $t('clear_filters') }}
                  </v-btn>
                  <v-btn icon @click="show_filter_dialog = false">
                    <v-icon v-text="'mdi-close'" />
                  </v-btn>
                </v-toolbar>
                <v-card-title>
                  <v-subheader class="overline px-4" v-text="$t('current_filters')" />
                  <v-flex v-if="hasFilters">
                    <!-- iterate each category -->
                    <template v-for="(value, name, index) in currentFilters">
                      <!-- iterate each filter in that category -->
                      <v-chip
                        v-for="(filter, f) in currentFilters[name]"
                        :key="`${index}-${f}`"
                        :active-class="null"
                        close-icon="mdi-filter-variant-remove"
                        class="caption ma-2"
                        close
                        @click:close="removeFilter(name, filter)"
                      >
                        <strong>{{ $t(name) }}</strong>
                        <span>({{ filter }})</span>
                      </v-chip>
                    </template>
                  </v-flex>
                  <span v-else class="caption">
                    {{ $t('no_selection') }}
                  </span>
                </v-card-title>
                <v-card-text max-height="300">
                  <v-list dense rounded>
                    <v-subheader>{{ $t('center_filters') }}</v-subheader>
                    <v-list-item>
                      <v-list-item-content>
                        <center-picker v-model="currentFilters.center_code" :return-value.sync="currentFilters.center_code" :return-object="false" />
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-select
                          v-model="currentFilters.model_year"
                          prepend-inner-icon="mdi-filter-variant"
                          autocomplete="off"
                          :items="model_years"
                          :label="$t('model_year')"
                          dense
                          multiple
                          outlined
                          :menu-props="{ bottom: true, offsetY: true }"
                        />
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-select
                          v-model="currentFilters.vehicle_make"
                          prepend-inner-icon="mdi-filter-variant"
                          autocomplete="off"
                          :items="vehicle_makes"
                          :label="$t('vehicle_make')"
                          dense
                          multiple
                          outlined
                          :menu-props="{ bottom: true, offsetY: true }"
                        />
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>
                        <v-select
                          v-model="currentFilters.vehicle_model"
                          prepend-inner-icon="mdi-filter-variant"
                          autocomplete="off"
                          :items="vehicle_models"
                          :label="$t('vehicle_model')"
                          dense
                          multiple
                          outlined
                          :menu-props="{ bottom: true, offsetY: true }"
                        />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <v-card-actions>
                  <v-btn block color="primary" depressed @click="show_filter_dialog = false">
                    {{ $t('ok') }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-spacer />
            <v-select
              v-model="sortBy"
              flat
              hide-details
              :label="$t('sort')"
              prepend-inner-icon="mdi-sort"
              :items="sortFields.map(x => { return { text: $t(x), value: x }})"
              :menu-props="{ bottom: true, offsetY: true }"
              style="max-width:300px;"
              class="mr-2"
              dense
              outlined
            />
            <v-btn-toggle
              v-model="sortDesc"
              mandatory
              dense
            >
              <v-btn depressed color="primary" :value="true">
                <v-icon v-text="'mdi-sort-ascending'" />
              </v-btn>
              <v-btn depressed color="primary" :value="false">
                <v-icon v-text="'mdi-sort-descending'" />
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>
      <template #default="{ items, isExpanded, expand }">
        <v-slide-x-transition group class="d-flex flex-wrap" hide-on-leave>
          <v-col
            v-for="item in items"
            :key="item.vehicle_number"
            cols="12"
            :sm="isExpanded(item) ? 12 : 6"
            :md="isExpanded(item) ? 8 : 4"
            :lg="isExpanded(item) ? 6 : 3"
          >
            <v-card outlined shaped>
              <v-toolbar color="transparent" dense flat>
                <v-toolbar-title>
                  {{ item.vehicle_number }}
                </v-toolbar-title>
                <v-spacer />
                <vehicle-number-button :vehicle-number="item.vehicle_number" icon="mdi-car-info" :color="null" />
                <v-btn icon @click="expand(item, !isExpanded(item))">
                  <v-icon v-text="isExpanded(item) ? 'mdi-chevron-left' : 'mdi-chevron-right'" />
                </v-btn>
              </v-toolbar>
              <!-- <v-card-subtitle v-show="item[sortBy]" v-text="item[sortBy]" /> -->
              <v-card-text class="d-flex flex-row">
                <v-list :width="isExpanded(item) ? '50%' : '100%'" dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ $t('year_make_model') }}</v-list-item-title>
                      <v-list-item-subtitle>{{ yearMakeModel(item) || '--' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ $t('driver') }}</v-list-item-title>
                      <v-list-item-subtitle>{{ driverName(item) || '--' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ $t('center') }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.center_name || '--' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ $t('in_service_date') }}</v-list-item-title>
                      <v-list-item-subtitle>{{ $options.filters.date(item.in_service_date) || '--' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-list v-if="isExpanded(item)" :width="isExpanded(item) ? '50%' : '100%'" dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ $t('odometer') }}</v-list-item-title>
                      <v-list-item-subtitle>{{ $options.filters.number(item.odometer) || '--' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ $t('odometer_date') }}</v-list-item-title>
                      <v-list-item-subtitle>{{ $options.filters.date(item.odometer_date) || '--' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ $t('vin') }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.vin || '--' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ $t('contract_description') }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.contract_description || '--' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-slide-x-transition>
      </template>
      <template #footer>
        <v-toolbar color="primary darken-2" dark flat>
          <span style="white-space:nowrap;" class="mr-2">{{ $vuetify.lang.locales[$vuetify.lang.current].dataFooter.itemsPerPageText }}</span>
          <v-menu top offset-y>
            <template #activator="{ on }">
              <v-btn depressed color="primary" v-on="on">
                {{ pagination.itemsPerPage === -1 ? $vuetify.lang.locales[$vuetify.lang.current].dataFooter.itemsPerPageAll : pagination.itemsPerPage }}
                <v-icon v-text="'mdi-chevron-down'" />
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(number, index) in pagination.itemsPerPageOptions" :key="index" @click="pagination.itemsPerPage = number">
                <v-list-item-title v-if="number === -1" v-text="$vuetify.lang.locales[$vuetify.lang.current].dataFooter.itemsPerPageAll" />
                <v-list-item-title v-else v-text="number" />
              </v-list-item>
            </v-list>
          </v-menu>
          <v-spacer />
          <v-btn text class="mr-2">
            {{ paginationText }}
          </v-btn>
          <v-toolbar-items>
            <v-pagination
              v-model="pagination.page"
              :length="pagination.pageCount"
              :total-visible="pagination.totalVisible"
              circle
            />
          </v-toolbar-items>
        </v-toolbar>
      </template>
    </v-data-iterator>
  </client-only>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'FleetNavigator',
  components: {
    'center-picker': () => import(/* webpackChunkName: "CenterPicker" */ '@/components/core/CenterPicker.vue'),
    'search-bar': () => import(/* webpackChunkName: "SearchBar" */ '@/components/core/SearchBar.vue'),
    'vehicle-number-button': () => import(/* webpackChunkName: "VehicleNumberButton" */ '@/components/vehicle-dashboard/VehicleNumberButton.vue')
  },
  async fetch () {
    await this.reset()
    await this.fetchVehicles()
  },
  data: vm => ({
    // to start off, return a default object with no filters in each filterType array
    currentFilters: vm.defaultFilter(),
    pagination: {
      itemsLength: 0,
      itemsPerPage: 50,
      itemsPerPageOptions: [15, 50, 100, 500, 1000, -1],
      page: 1,
      pageCount: 0,
      pageStart: 1,
      totalVisible: 5
    },
    search: '',
    show_filter_dialog: false,
    sortFields: ['center_name', 'driver_last_name', 'in_service_date', 'model_year', 'vehicle_color', 'vehicle_make', 'vehicle_model', 'vehicle_number', 'vin'],
    sortBy: 'center_name',
    sortDesc: false
  }),
  computed: {
    /**
     * Vuex Getters
     */
    ...mapGetters({
      filteredVehicles: 'fleet/filteredVehicles',
      model_years: 'fleet/getModelYears',
      vehicle_makes: 'fleet/getVehicleMakes',
      vehicle_models: 'fleet/getVehicleModels'
    }),
    filteredItems () {
      return this.filteredVehicles(this.currentFilters)
    },
    // filteredItems () {
    //   const order = this.sortDesc ? 'desc' : 'asc'
    //   const sortBy = this.sortBy || 'center_code'
    //   return this.filteredVehicles(this.currentFilters, sortBy, order)
    // },
    filterCount: vm => [].concat(...Object.values(vm.currentFilters)).length,
    hasFilters: vm => Object.values(vm.currentFilters).map(x => x.filter(Boolean).length).reduce((a, b) => a + b, 0),
    paginationText () {
      const length = this.filteredItems.length
      const start = ((this.pagination.page - 1) * this.pagination.itemsPerPage) + 1
      const end = (start + this.pagination.itemsPerPage - 1)
      const stop = length < end ? length : end
      return this.$vuetify.lang.t('$vuetify.dataFooter.pageText', start, stop, length)
    }
  },
  methods: {
    /**
     * Vuex Actions
     */
    ...mapActions({
      fetchVehicles: 'fleet/fetchVehicles',
      reset: 'fleet/reset'
    }),
    addFilter (name, value) {
      if (!value) { return }
      if (!this.currentFilters[name].includes(value)) {
        this.currentFilters[name].push(value.toUpperCase())
      }
    },
    defaultFilter () {
      return {
        center_code: [],
        vehicle_make: [],
        vehicle_model: [],
        vehicle_category: [],
        driver_state_province: [],
        model_year: [],
        vehicle_number: [],
        driver_last_name: []
      }
    },
    removeFilter (name, value) {
      this.currentFilters[name].splice(this.currentFilters[name].findIndex(item => item === value), 1)
    },
    resetFilters () {
      this.currentFilters = this.defaultFilter()
    },
    driverName (item) {
      return [item.driver_first_name, item.driver_last_name].filter(Boolean).join(' ')
    },
    yearMakeModel (item) {
      return [item.model_year, item.vehicle_make, item.vehicle_model].filter(Boolean).join(' ')
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
