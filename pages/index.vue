<template>
  <article class="content">
    <header class="content__header">
      <h1 class="content__title">{{content.title}}</h1>
    </header>
    <section v-html="content.body" class="content__body"></section>
  </article>
</template>

<script>
  export default {
    head () {
      return {
        title: this.$store.state.content.content.title,
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
  }
</script>
