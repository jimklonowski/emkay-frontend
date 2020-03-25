<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Vehicle Data -->
    <template #main>
      <v-container>
        <v-row no-gutters>
          <v-col v-for="(column, c) in columns" :key="`col-${c}`" cols="6">
            <v-list class="widget-list" subheader dense>
              <v-subheader class="overline" v-text="column.label" />
              <v-list-item v-for="(item, i) in column.items" :key="`item-${c}-${i}`">
                <v-list-item-icon>
                  <v-icon v-text="item.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.value" />
                  <v-list-item-subtitle v-text="item.label" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
      <!-- Expansion Panel and button -->
      <v-card-actions class="pt-0">
        <v-btn
          depressed
          block
          small
          @click="expanded = !expanded"
        >
          <v-icon class="mr-4" v-text="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
          {{ expanded ? $t('less') : $t('more') }}
        </v-btn>
      </v-card-actions>
      <v-slide-y-transition>
        <v-card-text v-show="expanded" class="pa-0">
          <v-container class="py-0">
            <v-row>
              <v-col v-for="(column, c) in extra_columns" :key="`ecol-${c}`" cols="6">
                <v-list class="widget-list" subheader dense>
                  <v-subheader class="overline" v-text="column.label" />
                  <v-list-item v-for="(item, i) in column.items" :key="`eitem-${i}`">
                    <v-list-item-icon>
                      <v-icon v-text="item.icon" />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.value" />
                      <v-list-item-subtitle v-text="item.label" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-slide-y-transition>
    </template>
  </base-widget>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    'base-widget': () => import(/* webpackChunkName: "BaseWidget" */ '@/components/vehicle-dashboard/widgets/BaseWidget.vue')
  },
  data: () => ({
    expanded: false,
    icon: 'mdi-car'
  }),
  computed: {
    ...mapGetters({
      custom_labels: 'account/getCustomLabels',
      vehicle_details: 'vehicle-dashboard/getVehicleDetails',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber',
      yearMakeModel: 'vehicle-dashboard/getYearMakeModel'
    }),
    title: vm => vm.$options.filters.uppercase(vm.yearMakeModel),
    actions () {
      return [
        {
          text: this.$i18n.t('edit_vehicle'),
          icon: 'mdi-car-info',
          to: this.editVehicleRoute
        },
        {
          text: this.$i18n.t('assign_new_driver'),
          icon: 'mdi-smart-card',
          to: this.reassignDriverRoute
        }
      ]
    },
    columns () {
      return [
        {
          label: this.$i18n.t('vehicle_details'),
          items: [
            {
              icon: 'mdi-car-key',
              label: this.$i18n.t('vehicle_number'),
              value: this.vehicle_details.vehicle_number || '--'
            },
            {
              icon: 'mdi-car-key',
              label: this.$i18n.t('client_vehicle_number'),
              value: this.vehicle_details.client_vehicle_number || '--'
            },
            {
              icon: 'mdi-bus-multiple',
              label: this.$i18n.t('vehicle_category'),
              value: this.vehicle_details.category || '--'
            },
            {
              icon: 'mdi-palette',
              label: this.$i18n.t('vehicle_color'),
              value: this.vehicle_details.exterior_color || '--'
            },
            {
              icon: 'mdi-shape',
              label: this.$i18n.t('status'),
              value: this.vehicle_details.status || '--'
            },
            {
              icon: 'mdi-subtitles',
              label: this.$i18n.t('lease_type'),
              value: this.vehicle_details.lease_type || '--'
            }
          ]
        },
        {
          label: this.$i18n.t('additional_information'),
          items: [
            {
              icon: 'mdi-calendar-arrow-left',
              label: this.$i18n.t('in_service_date'),
              value: this.$options.filters.date(this.vehicle_details.in_service_date) || '--'
            },
            {
              icon: 'mdi-calendar-arrow-right',
              label: this.$i18n.t('out_of_service_date'),
              value: this.$options.filters.date(this.vehicle_details.out_of_service_date) || '--'
            },
            {
              icon: 'mdi-calendar-month-outline',
              label: this.$i18n.t('months_in_service'),
              value: this.vehicle_details.months_in_service || '--'
            },
            {
              icon: 'mdi-counter',
              label: this.$i18n.t('reported_odometer'),
              value: this.vehicle_details.reported_odometer || '--'
            },
            {
              icon: 'mdi-label-variant',
              label: this.$i18n.t('license_plate_number'),
              value: this.licensePlate || '--'
            },
            {
              icon: 'mdi-remote',
              label: this.$i18n.t('transponder'),
              value: this.tollTransponder || '--'
            }
          ]
        }
      ]
    },
    extra_columns () {
      return [
        {
          label: this.$i18n.t('custom_labels'),
          items: [
            {
              icon: 'mdi-label',
              label: this.custom_labels.client_use_label_1 || this.$i18n.t('client_use_label_1'),
              value: this.vehicle_details.client_use_1 || '--'
            },
            {
              icon: 'mdi-label',
              label: this.custom_labels.client_use_label_2 || this.$i18n.t('client_use_label_2'),
              value: this.vehicle_details.client_use_2 || '--'
            },
            {
              icon: 'mdi-label',
              label: this.custom_labels.client_use_label_3 || this.$i18n.t('client_use_label_3'),
              value: this.vehicle_details.client_use_3 || '--'
            },
            {
              icon: 'mdi-label',
              label: this.custom_labels.client_use_label_4 || this.$i18n.t('client_use_label_4'),
              value: this.vehicle_details.client_use_4 || '--'
            },
            {
              icon: 'mdi-label',
              label: this.custom_labels.client_use_label_5 || this.$i18n.t('client_use_label_5'),
              value: this.vehicle_details.client_use_5 || '--'
            }
          ]
        },
        {
          label: this.$i18n.t('cost_center_information'),
          items: [
            {
              icon: 'mdi-label-outline',
              label: this.$i18n.t('level_01'),
              value: this.vehicle_details.level_01 || '--'
            },
            {
              icon: 'mdi-label-outline',
              label: this.$i18n.t('level_02'),
              value: this.vehicle_details.level_02 || '--'
            },
            {
              icon: 'mdi-label-outline',
              label: this.$i18n.t('level_03'),
              value: this.vehicle_details.level_03 || '--'
            },
            {
              icon: 'mdi-label-outline',
              label: this.$i18n.t('level_04'),
              value: this.vehicle_details.level_04 || '--'
            },
            {
              icon: 'mdi-label-outline',
              label: this.$i18n.t('level_05'),
              value: this.vehicle_details.level_05 || '--'
            }
          ]
        }
      ]
    }
  }
}
</script>
