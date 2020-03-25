<template>
  <base-widget
    :title="title"
    :icon="icon"
    :actions="actions"
  >
    <!-- Order Status -->
    <template #main>
      <template v-if="hasOrderStatus">
        <v-card-text>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-simple-table dense>
                  <template #default>
                    <tbody>
                      <tr v-for="(item, i) in order_details" :key="`tr-${i}`">
                        <th class="text-right caption font-weight-bold" style="border:none;width:50%;" v-text="item.text" />
                        <td class="text-left caption font-weight-light" style="border:none;width:50%;" v-text="item.value" />
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col cols="12" md="6">
                <v-simple-table>
                  <template #default>
                    <tbody>
                      <tr>
                        <th :style="{ width: $vuetify.breakpoint.smAndDown ? '50%' : 'auto', 'text-align': $vuetify.breakpoint.smAndDown ? 'right' : 'left' }" v-text="$t('comments')" />
                        <td :style="{ width: $vuetify.breakpoint.smAndDown ? '50%' : 'auto', 'text-align': $vuetify.breakpoint.smAndDown ? 'left' : 'left' }" v-text="order_comments" />
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-text v-show="!expanded">
          <v-timeline>
            <v-timeline-item
              v-for="(item, i) in order_timeline_preview"
              :key="`tip-${i}`"
              :icon="$moment(item.value).isBefore($moment(), 'day') ? 'mdi-check-circle' : ''"
              class="pb-0"
              small
              left
            >
              <div class="text-right" v-text="item.text" />
              <template #opposite>
                <div class="text-left">
                  {{ item.value | date }}
                </div>
              </template>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
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
        <v-card-text class="pa-0">
          <v-slide-y-transition mode="out-in">
            <v-timeline v-show="expanded">
              <v-timeline-item
                v-for="(item, i) in order_timeline"
                :key="`ti-${i}`"
                :fill-dot="!!item.value"
                :color="!!item.value ? 'primary' : 'grey'"
                :icon="$moment(item.value).isBefore($moment(), 'day') ? 'mdi-check-circle' : ''"
                small
                left
              >
                <div class="text-right" v-text="item.text" />
                <template #opposite>
                  <div class="text-left">
                    {{ item.value | date }}
                  </div>
                </template>
              </v-timeline-item>
            </v-timeline>
          </v-slide-y-transition>
        </v-card-text>
      </template>
      <v-card-text v-else>
        No order status found.
      </v-card-text>
    </template>
  </base-widget>
</template>
<script>
import { mapGetters } from 'vuex'
import BaseWidget from '@/components/vehicle-dashboard/widgets/BaseWidget'
export default {
  components: {
    BaseWidget
  },
  data: () => ({
    expanded: false,
    icon: 'mdi-timeline-clock'
  }),
  computed: {
    ...mapGetters({
      order_status: 'vehicle-dashboard/getOrderStatus',
      hasOrderStatus: 'vehicle-dashboard/hasOrderStatus',
      vehicle_number: 'vehicle-dashboard/getVehicleNumber'
    }),
    actions () {
      return [
        {
          text: this.$i18n.t('order_status'),
          icon: this.icon,
          to: this.orderStatusRoute
        }
      ]
    },
    order_comments: vm => vm.order_status.comments,
    order_details () {
      return [
        {
          text: this.$i18n.t('vehicle_number'),
          value: this.order_status.vehicle_number || '--'
        },
        {
          text: this.$i18n.t('year_make_model'),
          value: this.yearMakeModel
        },
        {
          text: this.$i18n.t('factory_order_number'),
          value: this.order_status.factory_order_number || '--'
        },
        {
          text: this.$i18n.t('ordering_dealer_code'),
          value: this.order_status.ordering_dealer_code || '--'
        },
        {
          text: this.$i18n.t('shipped_to_dealer_code'),
          value: this.order_status.shipped_to_dealer_code || '--'
        },
        {
          text: this.$i18n.t('dealer_contact'),
          value: this.order_status.dealer_contact || '--'
        },
        {
          text: this.$i18n.t('priority_code'),
          value: this.order_status.priority_code || '--'
        }
      ]
    },
    order_timeline () {
      return [
        {
          text: this.$i18n.t('order_received_date'),
          value: this.order_status.order_received_date
        },
        {
          text: this.$i18n.t('order_placed_date'),
          value: this.order_status.order_placed_date
        },
        {
          text: this.$i18n.t('zone_receive_date'),
          value: this.order_status.zone_receive_date
        },
        {
          text: this.$i18n.t('sent_to_plant_date'),
          value: this.order_status.sent_to_plant_date
        },
        {
          text: this.$i18n.t('production_scheduled_date'),
          value: this.order_status.production_scheduled_date
        },
        {
          text: this.$i18n.t('built_date'),
          value: this.order_status.built_date
        },
        {
          text: this.$i18n.t('shipped_to_body_company_date'),
          value: this.order_status.shipped_to_body_company_date
        },
        {
          text: this.$i18n.t('at_body_company_date'),
          value: this.order_status.at_body_company_date
        },
        {
          text: this.$i18n.t('shipped_from_body_company_date'),
          value: this.order_status.shipped_from_body_company_date
        },
        {
          text: this.$i18n.t('back_at_manufacturer_date'),
          value: this.order_status.back_at_manufacturer_date
        },
        {
          text: this.$i18n.t('shipped_to_dealer_date'),
          value: this.order_status.shipped_to_dealer_date
        },
        {
          text: this.$i18n.t('release_to_convoy_date'),
          value: this.order_status.release_to_convoy_date
        },
        {
          text: this.$i18n.t('delivered_to_dealer_date'),
          value: this.order_status.delivered_to_dealer_date
        },
        {
          text: this.$i18n.t('in_service_date'),
          value: this.order_status.in_service_date
        },
        {
          text: this.$i18n.t('status_date'),
          value: this.order_status.status_date
        }
      ]
    },
    order_timeline_preview: vm => vm.order_timeline.slice(0, 2),
    orderStatusRoute: vm => vm.localePath({ path: `/vehicle/${vm.vehicle_number}/order-status` }),
    title: vm => vm.$i18n.t('order_status'),
    yearMakeModel: vm => vm.order_status && [vm.order_status.model_year, vm.order_status.vehicle_make, vm.order_status.vehicle_model].filter(Boolean).join(' ')
  }
}
</script>
