<template>
  <article class="content">

    <header class="content__header">
      <h1 class="content__title">プライバシーポリシー</h1>
    </header>

    <section class="content__body">
      <h2>このWebサイトで取り扱っているCookieについて</h2>

      <div ref="cookieDeclaration"></div>
    </section>

  </article>
</template>

<script>
export default {
  mounted () {
    const cookieDeclarationScript = document.createElement('script')
    cookieDeclarationScript.type = 'text/javascript'
    cookieDeclarationScript.id = 'CookieDeclaration'
    cookieDeclarationScript.src = 'https://consent.cookiebot.com/655da7d5-ff70-43ea-ac0b-9b9e9cb08544/cd.js'
    this.$refs.cookieDeclaration.appendChild(cookieDeclarationScript)
  },
}
</script>

<style lang="scss" scoped>

</style>
