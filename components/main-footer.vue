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
