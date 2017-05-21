<template>
  <div>
    <h1>Hello {{content.title}}</h1>
    <div v-html="content.body"></div>
  </div>
</template>

<script>
  export default {
    computed: {
      content () {
        return this.$store.state.content.content
      },
    },
  }
</script>
