<template>
  <div>
    <h1>Hello {{content.title}}</h1>
    <div v-html="content.body"></div>
  </div>
</template>

<script>
  export default {
    head () {
      return {
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
