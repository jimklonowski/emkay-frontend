<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <address-input class="mx-12" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AddressInput from '@/components/core/AddressInput'
export default {
  name: 'Test',
  components: { AddressInput }
}
</script>
