<template>
  <h1>{{ $t('test') }}</h1>
</template>

<script>
export default {
  name: 'Home',
  middleware: 'auth'
}
</script>
