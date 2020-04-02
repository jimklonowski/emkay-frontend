/**
 * Updates the query parameters and URL, triggering watchQuery handlers.
 * Requires that there is a computed property named 'query' that returns the query object
 */
export const updateQuery = {
  methods: {
    updateQuery () {
      if (!this.query) { throw new Error('[Error]: query method not found in computed.') }
      const query = this.query
      this.$router.push({ query })
    }
  }
}

/**
 * Using Nuxt 2.12 Component Fetch, watches route.query and calls $fetch on change
 */
export const fetchOnQueryChange = {
  watch: {
    '$route.query': '$fetch'
  }
}

/**
 * Page title Meta
 */
export const pageTitleMeta = {
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:description', property: 'og:description', content: this.title }
      ]
    }
  }
}
