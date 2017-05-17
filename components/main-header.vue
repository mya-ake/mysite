<template>
  <header class="header">
    <nav>
      <ul class="list">
        <li>
          <router-link id="logo-wrapper" to="/">
            <svg id="logo" viewBox="0 0 1000 200" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">
              <title>サイトのロゴ</title>
              <g>
                <path d="M53.099,86.574c5.134,-3.118 13.307,1.368 18.238,10.012c4.932,8.643 4.767,18.192 -0.367,21.31c-5.134,3.118 -13.306,-1.369 -18.238,-10.012c-4.931,-8.644 -4.767,-18.193 0.367,-21.31Z"
                  style="fill:#393939;" />
                <path d="M78.29,46.077c5.73,-1.927 13.06,4.883 16.358,15.197c3.298,10.313 1.324,20.251 -4.406,22.177c-5.73,1.927 -13.059,-4.883 -16.357,-15.197c-3.299,-10.314 -1.325,-20.251 4.405,-22.177Z"
                  style="fill:#393939;" />
                <path d="M115.61,30.36c5.778,-0.528 11.383,8.208 12.51,19.498c1.127,11.289 -2.649,20.884 -8.427,21.412c-5.777,0.528 -11.383,-8.209 -12.51,-19.499c-1.126,-11.289 2.65,-20.883 8.427,-21.411Z"
                  style="fill:#393939;" />
                <path d="M150.51,46.562c5.24,0.243 9.296,9.642 9.052,20.977c-0.244,11.334 -4.697,20.338 -9.937,20.095c-5.24,-0.243 -9.296,-9.642 -9.052,-20.976c0.244,-11.334 4.697,-20.338 9.937,-20.096Z"
                  style="fill:#393939;" />
                <path d="M144.729,97.069c18.631,12.853 27.011,33.496 18.703,46.069c-8.308,12.573 -30.178,12.345 -48.809,-0.508c-18.63,-12.853 -27.01,-33.496 -18.702,-46.068c8.308,-12.573 30.178,-12.346 48.808,0.507Z"
                  style="fill:#393939;" />
                <path d="M80.712,118.627c6.521,-20.842 23.339,-33.936 37.533,-29.221c14.193,4.714 20.421,25.463 13.9,46.305c-6.522,20.842 -23.34,33.936 -37.533,29.222c-14.194,-4.715 -20.422,-25.463 -13.9,-46.306Z"
                  style="fill:#393939;" />
              </g>
            </svg>
          </router-link>
        </li>
        <li v-for="item in menuItem" class="nav-item">
          <router-link v-bind:to="item.url">{{item.name}}</router-link>
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
        ],
      }
    },
  }
</script>

<style lang="postcss?sourceMap">
@import './../assets/css/_variables.css';

#logo {
  width: 26rem;
  height: 5rem;
  background-image: url('~assets/images/mya-ake-logo-text.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 6px center;
}

.header {
  width: 100vw;
  height: var(--h-main-header);
  background-color: var(--c-bg-main-header);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 199;
}

.list {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 0;
  padding: 0;
  list-style: none;

  li:first-child {
    margin-right: auto;
  }
}

.nav-item {
  visibility: visible;
  a {
    display: inline-block;
    padding: 1.8rem 2.7rem;
    text-decoration: none;
    font-size: 1.8rem;
    color: var(--c-text);
    position: relative;
  	transition: background-color 0.2s;
    &:hover {
      background-color: var(--c-hover);
    }
    &::after {
      content: "";
      width: 0;
      height: 0.2rem;
      background-color: var(--c-text);
      position: absolute;
      left: 50%;
      bottom: 1.3rem;
      will-change: width,left;
    	transition: all 0.2s;
    }
    &.router-link-exact-active {
      &::after {
        width: 70%;
        left: 15%;
      }
    }
  }
}
</style>
