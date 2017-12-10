<template>
  <footer class="global-footer">
    <div class="site-information">
      <h1 class="visually-hidden">サイト運営者情報</h1>
      <section class="section">
        <h2 class="title">Profile</h2>
        <div class="avatar">
          <em class="name">mya-ake （みゃけ）</em>
          <img class="icon" src="/images/my/icon.png" alt="プロフィールアイコン画像（猫）" draggable="false">
        </div>
        <div class="bio">
          <p>猫好きのwebエンジニア。</p>
          <p>最近はwebのフロントエンドを中心にやってます。PWAとかサーバーレスアーキテクチャとかが好きです。</p>
          <p>福岡で <a href="https://twitter.com/hashtag/chibi_developer?src=hash" target="_blank">#chibi_developer</a> や <a href="https://twitter.com/hashtag/v_fukuoka?src=hash" target="_blank">#v_fukuoka</a> や <a href="https://twitter.com/hashtag/ng_fukuoka?src=hash" target="_blank">#ng_fukuoka</a> 辺りのイベントをやったりしてます。</p>
          <p>ウミーベ株式会社 所属 （<a href="https://umee.be/" target="_blank">https://umee.be/</a>）</p>
        </div>
      </section>

      <section class="section">
        <h2 class="title">Social</h2>
        <dl class="socials">
          <dt>Twitter</dt>
          <dd><a href="https://twitter.com/mya_ake" target="_blank">@mya_ake</a></dd>
          <dt>GitHub</dt>
          <dd><a href="https://github.com/mya-ake" target="_blank">mya-ake</a></dd>
          <dt>Qiita</dt>
          <dd><a href="http://qiita.com/mya-ake" target="_blank">@mya-ake</a></dd>
        </dl>
      </section>
    </div>
    <div class="copyright-wrapper">
      <small class="copyright">&copy; 2016-{{copyrightEnd}} mya-ake</small>
    </div>
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

<style lang="scss" scoped>

.global-footer {
  width: 100%;
  max-width: $w-content;
  margin: auto;
  padding: 40px 16px 0;
}

.section {
  padding: 16px 0;
}

.title {
  margin: 0 0 16px;
}

.avatar {
  display: flex;
  align-items: center;
}

.name {
  order: 2;
  display: inline-block;
  padding-left: 8px;
  font-size: 1.8rem;
  font-weight: bold;
}

.icon {
  order: 1;
  width: 60px;
  height: 60px;
}

.bio {
  padding: 16px 0;
  p {
    margin: 0;
    line-height: 1.6;
  }
}

$w-dt: 96px;
.socials {
  margin: 0;
  line-height: 1.6;
  dt,
  dd {
    display: inline-block;
  }

  dt {
    width: $w-dt;
  }

  dd {
    width: calc(100% - #{$w-dt});
    margin: 0;
  }
}

.copyright-wrapper {
  padding: 12px;
  text-align: center;
}

.copyright {
  font-size: 100%;
}
</style>
