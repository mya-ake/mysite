# vue-uid というコンポーネントで使えるユニーク ID を持たせるプラグインを作った

@@
Vue.js のプラグイン vue-uid を作ったのでそのリリース告知 & 軽い使い方の記事です。vue-uid はマウントされたコンポーネントごとにユニークな ID を持たせられるので、 id 属性のユニークな値として利用できます。
@@

==2018-11-17==

## ざっくりどんなプラグイン？

Vue.js のコンポーネントの id 属性とかで使えるユニークな ID が必要なときがあるじゃないですか。
これを解決するプラグインが[vue-uid](https://www.npmjs.com/package/vue-uid)です。

## コンポーネントにユニークな ID がないとどうなるか？

たとえば次のようなフォームの要素コンポーネント（BaseInputText）があったとします。

```HTML
<template>
  <div>
    <label for="input"><slot/></label>
    <input id="input" type="text" value="">
  </div>
</template>
```

このコンポーネントを使って次のフォームを作ったとします。

```HTML
<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-input-text>項目1</base-input-text>
    <base-input-text>項目2</base-input-text>
    <button type="submit">送信</button>
  </form>
</template>
<script>
// 省略
</script>
```

そして実際に展開される HTML は次のような形になります。

```HTML
<form>
  <div>
    <label for="input">項目1</label>
    <input id="input" type="text" value="">
  </div>
  <div>
    <label for="input">項目2</label>
    <input id="input" type="text" value="">
  </div>
  <button type="submit">送信</button>
</form>
```

見事に ID 重複してしまいますね。

## vue-uid を使うと

vue-uid プラグインを使うと、コンポーネントの this に `$_uid` プロパティが生えます。
この `$_uid` には他のコンポーネントと重複しない id（数値）が入っています。
script ブロック内では `this.$_uid` でアクセスできます。
また template ブロックでは `$_uid` でアクセスできます。

※プロパティ名は[name オプション](https://www.npmjs.com/package/vue-uid#name)で変更できます。

この vue-uid を使ったときの BaseInputText は次のようになります。

```HTML
<template>
  <div>
    <label v-bind:for="`input-${$_uid}`"><slot/></label>
    <input v-bind:id="`input-${$_uid}`" type="text" value="">
  </div>
</template>
```

または次のように computed でまとめてしまいます。

```HTML
<template>
  <div>
    <label v-bind:for="inputId"><slot/></label>
    <input v-bind:id="inputId" type="text" value="">
  </div>
</template>

<script>
export default {
  computed: {
    inputId() {
      return `input-${this.$_uid}`;
    },
  },
};
</script>
```

フォームのところはとくに変わらないので省略します。

展開されるとこんな感じになります。

```HTML
<form>
  <div>
    <label for="input-1">項目1</label>
    <input id="input-1" type="text" value="">
  </div>
  <div>
    <label for="input-2">項目2</label>
    <input id="input-2" type="text" value="">
  </div>
  <button type="submit">送信</button>
</form>
```

これで各 input タグの id 属性がユニークになりました。

## 使い方

npm か yarn でインストール可能です。
ブラウザでは [vue-uid.umd.min.js](https://github.com/mya-ake/vue-uid/blob/master/dist/vue-uid.umd.min.js)をコピーすることで使えると思います（試してはないですがいけると思われる）。

```bash
$ npm i vue-uid
# or
$ yarn add vue-uid
```

あとは他の Vue.js のプラグインと同様に `Vue.use()` で指定してください。

```JavaScript
import Vue from 'vue';
import VueUid from 'vue-uid';
 
Vue.use(VueUid);
```

## Nuxt.js 版

Nuxt.js 用にラップした[nuxt-uid-module](https://www.npmjs.com/package/nuxt-uid-module)も作りました。
Nuxt.js で利用する際はこっちを使ってください。

SPA モードであれば問題ないのですが、普通に vue-uid の方を使ってしまうとクライアントとサーバーで id が異なってしまいます。

uid はシングルトンで管理されているのでサーバーではリクエストごとに uid が増えていってしまう問題があります。
そのためリクエストの度に uid をリセットしないと クライアントとサーバーでずれが発生します。

このモジュールはリクエストの度に自動で uid をリセットするようになっているので、Nuxt.js で利用される場合は nuxt-uid-module の方を使ってください。

## まとめ

自分のプロジェクトで毎回のように必要になってたので、npm で公開して自分で使いやすくした感じです。
必要な際はぜひ使ってみてください。

## 補足：今回の例には回避策がある

最初に例示したフォームの要素の id 重複のところです。
これは label タグで input タグを囲ってしまえば id 属性が不要になるので重複回避可能です。

馴染みやすい例がいいと思いフォームの例を使いました。

他の例示をするなら WAI-ARIA の [aria-controls プロパティ](https://momdo.github.io/wai-aria/states_and_properties.html#aria-controls)で id 属性を利用します。
他にも id 属性を利用する WAI-ARIA のプロパティは多いです（コンポーネントに WAI-ARIA のプロパティを付与するときは id 重複に注意しましょう）。

このように id 属性が必要な場面はそれなりにあるので、ぜひ vue-uid を使ってみてください。

## 余談：Vue CLI v3 使うと Vue.js のプラグインを作るのも簡単

vue-uid は Vue CLI v3 をベースに作っています。
Vue CLI v3 のビルドのオプションにライブラリ用のものがあるのでそれを利用しました。
次のようにビルドすることで各環境に合わせたビルドが出力されるのでとても便利です。

```bash
$ vue-cli-service build --target lib --name vue-uid src/index.js
```

ドキュメントはこちらになるのでご興味ある方は一読されるとよいかもしれません。

https://cli.vuejs.org/guide/build-targets.html#library


## 余談2：Nuxt.js の axios ラッパーモジュールも作ってる

ご存知の方もいるかもしれませんが[nuxt-resource-module](https://www.npmjs.com/package/nuxt-resource-module)というのも作ってます。

これは axios を拡張した感じのラッパーです。

特徴としては

- asyncData のリクエストを遷移確定後に遅らせることが可能
  - プリフェッチの待機時間がなくなるので遷移が早くなる
- リクエストのキャンセル処理を手軽に書ける
  - axios の CancelToken 周りの処理を内包

って感じです。

今、プロダクトで使いはじめようとしてるところで、使いつつ API の調整をしていく段階です。
今α版という位置づけですが使ってみてのご意見もお待ちしてます。

一応正式版出したら改めて記事を書くので詳細はお待ちください。
