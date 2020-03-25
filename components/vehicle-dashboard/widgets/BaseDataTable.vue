<template>
  <section>
    <v-data-table
      :dense="items && items.length > 0"
      :headers="headers"
      :hide-default-footer="true"
      :items="items"
      :items-per-page="pagination.itemsPerPage"
      :loading="loading"
      :mobile-breakpoint="0"
      :page.sync="pagination.page"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      class="striped"
      @page-count="pagination.pageCount = $event"
    >
      <template #item.bill_date="{ item }">
        {{ item.bill_date | date('YYYY-MM', 'MM/YYYY') }}
      </template>
      <template #item.bill_for_date="{ item }">
        {{ item.bill_for_date | date('YYYY-MM', 'MM/YYYY') }}
      </template>
      <template #item.service_date="{ item }">
        {{ item.service_date | date }}
      </template>
      <template #item.product_type="{ item }">
        <v-chip :outlined="!$vuetify.theme.dark" x-small v-text="item.product_type" />
      </template>
      <template #item.unit_price="{ item }">
        {{ item.unit_price | currency(3, 3) }}
      </template>
      <template #item.odometer="{ item }">
        {{ item.odometer | number }}
      </template>
      <template #item.amount="{ item }">
        {{ item.amount | currency }}
      </template>
    </v-data-table>
    <v-divider />
    <v-card-actions v-show="initialized" class="pager">
      <v-btn-toggle
        :value="days"
        background-color="transparent"
        color="primary"
        mandatory
        rounded
        dense
        @change="$emit('days-changed', $event)"
      >
        <v-btn
          v-for="period in periods"
          :key="period"
          :value="period"
          small
          text
          v-text="period"
        />
      </v-btn-toggle>
      <span class="caption mx-2" v-text="$t('days')" />
      <v-spacer />
      <v-pagination
        v-show="items && items.length > 0"
        v-model="pagination.page"
        :length="pagination.pageCount"
        :total-visible="pagination.totalVisible"
        circle
        style="width:auto;"
      />
    </v-card-actions>
  </section>
</template>

<script>
export default {
  props: {
    days: {
      type: Number,
      default: 60
    },
    initialized: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true
    },
    headers: {
      type: Array,
      required: true
    },
    sortBy: {
      type: [Array, String],
      required: true
    },
    sortDesc: {
      type: [Array, String],
      default: () => [true]
    },
    pagination: {
      type: Object,
      default: () => ({
        itemsPerPage: 5,
        page: 1,
        pageCount: 0,
        totalVisible: 5
      })
      // required: true
    },
    periods: {
      type: Array,
      default: () => [30, 60, 90]
    }
  }
}
</script>
