<template>
  <div id="app">
    <GlobalHeader></GlobalHeader>
    <main>
      <nuxt/>
    </main>
    <GlobalFooter class="footer"></GlobalFooter>
  </div>
</template>

<script>
  import GlobalHeader from '~/components/GlobalHeader'
  import GlobalFooter from '~/components/GlobalFooter'

  export default {
    components: {
      GlobalHeader,
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
