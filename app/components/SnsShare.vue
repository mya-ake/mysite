<template>
  <div class="shares">
    <a v-bind:href="twitter" class="share share--twitter" target="_blank">Twitter</a>
    <a v-bind:href="facebook" class="share share--facebook" target="_blank">Facebook</a>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },

  computed: {
    url () {
      return `https://mya-ake.com/${this.path}/`
    },

    twitter () {
      return `https://twitter.com/share?url=${this.url}&text=${encodeURIComponent(this.title)}`
    },

    facebook () {
      return `https://www.facebook.com/sharer/sharer.php?u=${this.url}`
    },
  },
}
</script>

<style lang="scss" scoped>

.shares {
  display: flex;
  justify-content: center;
  padding: 32px 16px 48px;
}

.share {
  display: inline-block;
  width: 100%;
  max-width: 240px;
  border: solid 2px $ct-default;
  padding: 12px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  background-color: transparent;
  transition-property: color, background-color;
  transition-duration: .2s;
  transition-timing-function: ease-in-out;
  &:not(:last-child) {
    margin-right: 8px;
  }
  @include media(small) {
    padding: 16px;
    &:not(:last-child) {
      margin-right: 16px;
    }
  }

  &--twitter {
    color: $c-twitter;
    border-color: $c-twitter;
    &:hover {
      color: $ct-white;
      background-color: $c-twitter;
    }
  }
  &--facebook {
    color: $c-facebook;
    border-color: $c-facebook;
    &:hover {
      color: $ct-white;
      background-color: $c-facebook;
    }
  }
}

</style>
