<template>
  <article class="content">
    <header class="content__header">
      <h1 class="content__title">{{content.title}}</h1>
    </header>
    <section v-html="content.body" class="content__body"></section>
  </article>
</template>

<script>
import { CONTENTS_ACTION_TYPES } from '~/store/contents'

export default {
  async fetch ({ params, store, error }) {
    const path = `posts/${params.slug}`
    const status = await store.dispatch(CONTENTS_ACTION_TYPES.GET_CONTENT, path)
    if (status !== 200) {
      error({ statusCode: status })
    }
  },

  head () {
    return {
      title: this.buildTitle(),
      meta: [
        { hid: 'description', name: 'description', content: this.$store.state.contents.content.description },
      ],
    }
  },

  computed: {
    content () {
      return this.$store.state.contents.content
    },
  },

  methods: {
    buildTitle () {
      return `${this.$store.state.contents.content.title} - mya-ake.com`
    },
  },
}
</script>
