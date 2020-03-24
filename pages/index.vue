<template>
  <h1>{{ $t('test') }}</h1>
</template>

<script>
export default {
  middleware: 'auth'
}
</script>
