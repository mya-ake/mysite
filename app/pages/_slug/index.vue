<template>
  <article class="content">
    <header class="content__header">
      <h1 class="content__title">{{content.title}}</h1>
    </header>
    <section v-html="content.body" class="content__body"></section>

    <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-9428775704052737"
        data-ad-slot="4833732002"
        data-ad-format="auto"></ins>
  </article>
</template>

<script>
import { CONTENTS_ACTION_TYPES } from '~/store/contents'

export default {
  async asyncData ({ params, store, error }) {
    const path = `pages/${params.slug}`
    const status = await store.dispatch(CONTENTS_ACTION_TYPES.GET_CONTENT, path)
    if (status !== 200) {
      error({ statusCode: status })
    }
    return {
      path: path,
    }
  },

  mounted () {
    this.initializeAd()
  },

  head () {
    return {
      title: this.buildedTitle,
      meta: [
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'og:title', property: 'og:title', content: this.buildedTitle },
        { hid: 'og:description', property: 'og:description', content: this.description },
        { hid: 'og:url', property: 'og:url', content: this.buildedUrl },
        { hid: 'twitter:title', name: 'twitter:title', content: this.buildedTitle },
        { hid: 'twitter:description', name: 'twitter:description', content: this.description },
        { hid: 'twitter:url', name: 'twitter:url', content: this.buildedUrl },
      ],
      link: [
        { rel: 'canonical', href: this.buildedUrl },
      ],
    }
  },

  computed: {
    description () {
      return this.$store.state.contents.content.description
    },

    content () {
      return this.$store.state.contents.content
    },

    buildedTitle () {
      return `${this.$store.state.contents.content.title} - mya-ake.com`
    },

    buildedUrl () {
      return `https://mya-ake.com/${this.path}/`
    },
  },

  methods: {
    initializeAd () {
      if (window.location.host !== 'mya-ake.com') {
        return
      }
      Array.from(document.querySelectorAll('ins'))
        .filter((el) => {
          return el.getAttribute('data-adsbygoogle-status') === null
        })
        .forEach(() => {
          (window.adsbygoogle = window.adsbygoogle || []).push({})
        })
    },
  },
}
</script>
