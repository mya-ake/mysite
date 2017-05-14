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
  import mainHeader from '~components/main-header.vue'
  import mainFooter from '~components/main-footer.vue'

  export default {
    components: {
      mainHeader,
      mainFooter,
    },
  }
</script>

<style lang="postcss?sourceMap">
@import './../node_modules/normalize.css/normalize.css';
@import './../assets/css/_variables.css';

* {
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
  background-color: var(--c-bg);
}

body {
  font-family: -apple-system, 'BlinkMacSystemFont', '.SFNSDisplay-Regular', 'helvetica', "游ゴシック", "Yu Gothic", "游ゴシック体", "YuGothic", YuGothic, "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN", "メイリオ", Meiryo, sans-serif;
  font-size: 1.6rem;
  line-height: 1.6em;
  color: var(--c-text);
  backface-visibility: hidden;
  position: relative;
  font-feature-settings: "pkna" 1;
  letter-spacing: 0.04em;
  -webkit-font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
}

main {
  margin-top: var(--h-main-header);
}

a {
  color: var(--c-a);
}

input,
textarea,
a,
button,
select
{
  pointer-events: auto;
}
button {
  user-select: none;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

@media screen and (max-width: 480px) {
	body {
    font-size: 1.4rem;
		pointer-events: none;
	}
}
</style>
