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
    const { status, data } = await store.dispatch(CONTENTS_ACTION_TYPES.GET_CONTENT, path)
    if (status !== 200) {
      error({ statusCode: status })
      return {}
    }
    return {
      path: path,
      content: data,
    }
  },

  mounted () {
    this.initializeAd()
  },

  head () {
    const meta = [
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'og:title', property: 'og:title', content: this.buildedTitle },
        { hid: 'og:description', property: 'og:description', content: this.description },
        { hid: 'og:url', property: 'og:url', content: this.buildedUrl },
        { hid: 'twitter:title', name: 'twitter:title', content: this.buildedTitle },
        { hid: 'twitter:description', name: 'twitter:description', content: this.description },
        { hid: 'twitter:url', name: 'twitter:url', content: this.buildedUrl },
    ]

    if (this.content.thumbnail !== '') {
      meta.push({ hid: 'og:image', property: 'og:image', content: this.buildedThumbnail })
      meta.push({ hid: 'twitter:image', name: 'twitter:image', content: this.buildedThumbnail })
      meta.push({ hid: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' })
    }

    return {
      title: this.buildedTitle,
      meta,
      link: [
        { rel: 'canonical', href: this.buildedUrl },
      ],
    }
  },

  computed: {
    description () {
      return this.content.description
    },

    buildedTitle () {
      return `${this.content.title} - mya-ake.com`
    },

    buildedThumbnail () {
      return `https://mya-ake.com${this.content.thumbnail}`
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
        });
      (window.adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: 'ca-pub-9428775704052737',
        enable_page_level_ads: true,
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
