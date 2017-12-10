<template>
  <article class="content">
    <header class="content__header">
      <h1 class="content__title">{{content.title}}</h1>
      <div class="content__meta">
        <span v-if="content.updatedAt" class="content__date">
          <time v-bind:datetime="content.updatedAt">{{content.updatedAt | hyphenToDot}}</time>
          <span> 更新</span>
        </span>
        <span class="content__date">
          <span v-if="content.updatedAt">（</span>
          <time v-bind:datetime="content.createdAt">{{content.createdAt | hyphenToDot}}</time>
          <span v-if="content.updatedAt"> 公開）</span>
        </span>
      </div>
    </header>
    <section v-html="content.body" class="content__body"></section>

    <section>
      <h2 class="visually-hidden">SNS シェア</h2>
      <SnsShare
        v-bind:title="buildedTitle"
        v-bind:path="path"
      />
    </section>

    <ins class="adsbygoogle"
        style="display:block"
        data-ad-client="ca-pub-9428775704052737"
        data-ad-slot="4833732002"
        data-ad-format="auto"></ins>
  </article>
</template>

<script>
import SnsShare from '~/components/SnsShare'

import { CONTENTS_ACTION_TYPES } from '~/store/contents'

export default {
  async asyncData ({ params, store, error }) {
    const path = `posts/${params.slug}`
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
        { hid: 'description', name: 'description', content: this.$store.state.contents.content.description },
      ],
    }
  },

  computed: {
    content () {
      return this.$store.state.contents.content
    },

    buildedTitle () {
      return `${this.$store.state.contents.content.title} - mya-ake.com`
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

  filters: {
    hyphenToDot (value) {
      return value.replace(/-/g, '.')
    },
  },

  components: {
    SnsShare,
  },
}
</script>
