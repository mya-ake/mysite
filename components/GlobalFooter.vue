<template>
  <footer class="footer">
    <small class="copyright">&copy; 2016-{{copyrightEnd}} mya-ake</small>
  </footer>
</template>

<script>
  export default {
    data () {
      return {
        copyrightEnd: new Date().getFullYear(),
      }
    },
  }
</script>

<style lang="scss" scoped>
.footer {
  padding: 12px;
  text-align: center;
}

.copyright {
  font-size: 100%;
}
</style>
