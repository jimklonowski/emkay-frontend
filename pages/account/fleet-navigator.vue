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
          <v-toolbar-title>{{ $t('fleet_navigator') }}</v-toolbar-title>
          <v-spacer />
          <v-text-field
            v-model="search"
            :label="$t('search')"
            prepend-inner-icon="mdi-magnify"
            background-color="transparent"
            clearable
            dense
            flat
            hide-details
            outlined
            rounded
            single-line
            solo
          />
          <template #extension>
            <v-dialog
              v-model="show_filter_dialog"
              max-width="600"
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
                <v-subheader class="overline px-4" v-text="$t('current_filters')" />
                <v-card-text>
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
                  <span v-else>{{ $t('no_selection') }}</span>
                </v-card-text>
                <v-subheader class="overline px-4" v-text="$t('add_filters')" />
                <v-card-text>
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
                </v-card-text>
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
                  <v-icon v-text="isExpanded(item) ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
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
      <template #footer>
        <v-toolbar color="primary darken-2" dark flat>
          <span style="white-space:nowrap;" class="mr-2">{{ $vuetify.lang.locales[$vuetify.lang.current].dataFooter.itemsPerPageText }}</span>
          <v-menu offset-y>
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
  async fetch () {
    await this.reset()
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
      itemsLength: 0,
      itemsPerPage: 50,
      itemsPerPageOptions: [50, 100, 500, 1000, -1],
      page: 1,
      pageCount: 0,
      pageStart: 1,
      totalVisible: 5
    },
    search: '',
    show_filter_dialog: false,
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
      const stop = (start + this.pagination.itemsPerPage - 1)
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
