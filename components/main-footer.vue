<template>
  <footer class="footer">
    <span class="copyright">&copy; 2016-{{copyrightEnd}} mya-ake</span>
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

<style lang="postcss?sourceMap">
.footer {
  width: 100vw;
  height: 30px;
  margin-top: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.copyright {
  display: inline-block;
}
</style>
