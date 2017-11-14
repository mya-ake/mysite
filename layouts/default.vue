<template>
  <div id="app">
    <main-header></main-header>
    <main>
      <nuxt/>
    </main>
    <main-footer></main-footer>
  </div>
</template>

<script>
  import mainHeader from '~/components/main-header.vue'
  import mainFooter from '~/components/main-footer.vue'

  export default {
    components: {
      mainHeader,
      mainFooter,
    },
  }
</script>
