<template>
  <div id="app">
    <main-header></main-header>
    <main>
      <nuxt/>
    </main>
    <GlobalFooter class="footer"></GlobalFooter>
  </div>
</template>

<script>
  import mainHeader from '~/components/main-header.vue'
  import GlobalFooter from '~/components/GlobalFooter'

  export default {
    components: {
      mainHeader,
      GlobalFooter,
    },
  }
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.footer {
  margin-top: auto;
}
</style>
