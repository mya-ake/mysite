<template>
  <div>
    <h1>Hello {{content}}</h1>
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
