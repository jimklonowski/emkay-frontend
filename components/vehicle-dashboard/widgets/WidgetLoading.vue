<template>
  <v-card outlined>
    <v-skeleton-loader type="card-heading" />
    <v-divider />
    <v-card-text>
      <v-skeleton-loader :types="{ 'table-tbody': 'table-row-divider@3' }" type="table-thead, table-tbody, table-tfoot" />
    </v-card-text>
  </v-card>
</template>
