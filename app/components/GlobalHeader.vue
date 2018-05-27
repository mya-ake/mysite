<template>
  <header class="header">
    <div class="site-logo">
      <a to="/">
        <img v-on:click="handleClickToTop" class="logo" src="~/assets/images/mya-ake_logo_text.svg" alt="サイトのロゴ トップページへのリンク">
      </a>
    </div>
    <nav ref="navigation" class="navigation">
      <ul class="navigation__list">
        <li v-for="(item, index) in menuItem" v-bind:key="`menu-${index}`" class="navigation__item">
          <nuxt-link v-if="item.local" v-bind:to="item.url" class="navigation__link">{{item.name}}</nuxt-link>
          <a v-else v-bind:href="item.url" class="navigation__link">{{item.name}}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>
<script>
  export default {
    data () {
      return {
        menuItem: [
          {
            name: 'Top',
            url: '/',
          },
          {
            name: 'About',
            url: '/about',
          },
          {
            name: 'Works',
            url: '/works',
          },
          {
            name: 'Slides',
            url: '/slides',
          },
          {
            name: 'Contact',
            url: '/contact',
          },
          {
            name: 'Privacy Policy',
            url: '/privacy_policy',
            local: true,
          },
        ],
      }
    },

    methods: {
      handleClickToTop () {
        this.$refs.navigation.scrollTo(0, 0)
      },
    },
  }
</script>

<style lang="scss" scoped>
.site-logo {
  padding: 8px 0;
}

.logo {
  display: block;
  width: 200px;
  margin: 0 auto;
}

.navigation {
  overflow-x: scroll;
  pointer-events: auto;
  -webkit-overflow-scrolling: touch;
}

.navigation__list {
  display: flex;
  flex-wrap: nowrap;
  width: fit-content;
  margin: 0 auto;
  padding: 4px 0;
  list-style: none;
  text-align: center;
}

.navigation__item {
}

.navigation__link {
  position: relative;
  display: inline-block;
  padding: 8px 16px;
  color: $ct-default;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover,
  &:focus {
    background-color: $cbg-header-nav__hover;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0%;
    height: 2px;
    background-color: transparent;
    transition-property: width, left;
    transition-duration: 0.2s;
  }

  @include media(small) {
    padding: 8px 24px;
  }

  &.a-exact-active {
    &::after {
      width: 100%;
      left: 0%;
      background-color: $ct-default;
    }
  }
}
</style>
