<template>
  <article class="content">
    <header class="content-header">
      <h1>{{content.title}}</h1>
    </header>
    <section v-html="content.body" class="content-body"></section>
  </article>
</template>

<script>
  export default {
    head () {
      return {
        title: this.buildTitle(),
        meta: [
          { hid: 'description', name: 'description', content: this.$store.state.content.content.description },
        ],
      }
    },
    computed: {
      content () {
        return this.$store.state.content.content
      },
    },
    methods: {
      buildTitle () {
        return `${this.$store.state.content.content.title} - mya-ake.com`
      },
    },
  }
</script>
