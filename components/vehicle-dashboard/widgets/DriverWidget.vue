<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Driver Data -->
    <template #main>
      <v-container>
        <v-row no-gutters>
          <v-col v-for="(column, c) in columns" :key="`col-${c}`" cols="6">
            <v-list class="widget-list" subheader dense>
              <v-subheader class="overline" v-text="column.label" />
              <v-list-item v-for="(item, i) in column.items" :key="`item-${c}-${i}`">
                <v-list-item-icon class="action-icon">
                  <v-btn v-if="item.action" icon @click="item.action">
                    <v-icon v-text="item.icon" />
                  </v-btn>
                  <v-icon v-else v-text="item.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.value" />
                  <v-list-item-subtitle v-text="item.label" />
                  <v-list-item-subtitle v-show="item.label2" v-text="item.label2" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </base-widget>
</template>

<script>
import { mapGetters } from 'vuex'
import { dialTo, emailTo } from '@/utility/helpers'
export default {
  components: {
    'base-widget': () => import(/* webpackChunkName: "BaseWidget" */ '@/components/vehicle-dashboard/widgets/BaseWidget.vue')
  },
  data: () => ({
    icon: 'mdi-account'
  }),
  computed: {
    ...mapGetters({
      custom_labels: 'account/getCustomLabels',
      driver_city_state_zip: 'vehicle-dashboard/getDriverCityStateZip',
      driver_details: 'vehicle-dashboard/getDriverDetails',
      driver_name: 'vehicle-dashboard/getDriverName',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    actions () {
      return [
        {
          text: this.$i18n.t('edit_driver'),
          icon: 'mdi-account-edit',
          to: this.editDriverRoute
        }
      ]
    },
    columns () {
      return [
        {
          label: this.$i18n.t('driver_details'),
          items: [
            {
              icon: 'mdi-map-marker',
              value: this.driver_details.address_1,
              label: this.driver_details.address_2,
              label2: this.driver_city_state_zip
            },
            {
              icon: 'mdi-phone-outgoing',
              value: this.$options.filters.phone(this.driver_details.phone) || '--',
              label: this.$i18n.t('phone'),
              action: () => dialTo(this.driver_details.phone)
            },
            {
              icon: 'mdi-cellphone-iphone',
              value: this.$options.filters.phone(this.driver_details.mobile) || '--',
              label: this.$i18n.t('mobile'),
              action: () => dialTo(this.driver_details.mobile)
            },
            {
              icon: 'mdi-email-send',
              value: this.driver_details.email || '--',
              label: this.$i18n.t('email'),
              action: () => emailTo(this.driver_details.email)
            },
            {
              icon: 'mdi-smart-card',
              value: this.driver_details.selector || '--',
              label: this.$i18n.t('selector_level')
            },
            {
              icon: 'mdi-account-key',
              value: this.driver_details.reference_number || '--',
              label: this.$i18n.t('driver_reference_number')
            }
          ]
        },
        {
          label: this.$i18n.t('additional_information'),
          items: [
            {
              icon: 'mdi-card-account-details',
              value: this.driver_details.employee_id || '--',
              label: this.$i18n.t('employee_id')
            },
            {
              icon: 'mdi-label',
              value: this.driver_details.misc_1 || '--',
              label: this.custom_labels.driver_use_label_1 || this.$i18n.t('driver_use_label_1')
            },
            {
              icon: 'mdi-label',
              value: this.driver_details.misc_2 || '--',
              label: this.custom_labels.driver_use_label_2 || this.$i18n.t('driver_use_label_2')
            },
            {
              icon: 'mdi-label',
              value: this.driver_details.misc_3 || '--',
              label: this.custom_labels.driver_use_label_3 || this.$i18n.t('driver_use_label_3')
            },
            {
              icon: 'mdi-label',
              value: this.driver_details.misc_4 || '--',
              label: this.custom_labels.driver_use_label_4 || this.$i18n.t('driver_use_label_4')
            }
          ]
        }
      ]
    },
    editDriverRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/edit-driver` }),
    title: vm => vm.driver_name
  }
}
</script>
