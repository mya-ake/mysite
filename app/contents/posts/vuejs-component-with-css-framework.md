# CSS フレームワークを Vue.js のコンポーネントにする方法

==2018-12-20==

## この記事について

この記事は[Vue.js #2 Advent Calendar 2018 - Qiita](https://qiita.com/advent-calendar/2018/vuejs-2)の 20 日目の記事です。

この記事では Google が提供しているマテリアルデザインの CSS フレームワークである[Material Components](https://material.io/develop/web/)を Vue.js のコンポーネントにしていく話を書いています。

その過程で Vue.js におけるコンポーネントを作るときの要点なども一緒に書いてます。

### バージョンなど

- Vue.js: 2.5.21
- Vue CLI: 3.2.1
- Material Components: 0.42.x

## アウトライン

- Material Components
- 今回作るもの
- Material Components をプロジェクトに導入する
- Button のコンポーネント
- Text Field のコンポーネント
- まとめ
- 補足
  - どのような CSS フレームワークならコンポーネント化することができるのか
  - コンポーネント化したライブラリはすでに存在する

## Material Components

冒頭にも書きましたが Material Components は Google が提供しているフレームワークです。
web だけでなく Android / iOS / Flutter 向けにも提供されています。
マテリアルデザインの提唱者である Google 自身が作っているので、ガイドラインに準拠した見た目のコンポーネントを作っていくことができます。

[Develop - Material Design](https://material.io/develop/)

具体的にどのようなコンポーネントが提供されているのかはサイト上にカタログページがるのでそちらを見るとよいでしょう。

[Material Components Web | Catalog](https://material-components.github.io/material-components-web-catalog/)

## 今回作るもの

今回は Button と Text Field を取り上げます。
次の画像のような検索のコンポーネントっぽいものを作ります。

フォーカスするとプレースホルダーになっていたテキストが左上に移動するかっこいいアニメーション付きのやつです。

<img src="/images/vuejs-component-with-css-framework/no-input.png" alt="text fieldとbuttonの組み合わせ（入力なし）" style="max-width: 320px; margin: 0 auto;">

<img src="/images/vuejs-component-with-css-framework/input.png" alt="text fieldとbuttonの組み合わせ（入力あり）" style="max-width: 320px; margin: 0 auto;">

## Material Components をプロジェクトに導入する

導入に関してはサイトの[Getting Started](https://material.io/develop/web/docs/getting-started/)のページに書かれています。

今回は Vue CLI v3 で作成したプロジェクトに Material Components を導入するための最低限の方法を紹介します。

### インストール

Material Components はコンポーネント単位でインストールできます。

今回使うのは Button と Text Field だけなので 2 つだけインストールします。

```bash
$ yarn add @material/button @material/textfield
```

### SASS

Material Components は SASS で書かれています。
そのため SASS のファイルを直接 style ブロックで読み込むことで Vue.js のコンポーネントにスタイルを当てることができます。

style ブロックで読み込むために`vue.config.js`で SASS の includePaths の設定をします。

Vue CLI で作成たプロジェクトは[css.loaderOptions](https://cli.vuejs.org/config/#css-loaderoptions)を使い各 loader の設定を拡張できます。
今回は includePaths の設定のついでに SASS の変数ファイルを style ブロックで自動的に読み込んでくれるようにもしています。

```JavaScript
const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');
const SCSS_DIR = path.join(SRC_DIR, 'assets', 'scss');

const SASS_AUTO_IMPORTS = `
@import "${path.join(SCSS_DIR, '_variables.scss')}";
`;

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: SASS_AUTO_IMPORTS,
        includePaths: ['./node_modules'],
      },
    },
  },
};
```

以上がプロジェクトで Material Components を使う準備です。

## Button のコンポーネント

早速 Button のコンポーネントとなる BaseButton コンポーネントを作ります。
コンポーネント単位の使い方はドキュメントにまとめられています。

[Buttons - Material Components for the Web](https://material.io/develop/web/components/buttons/)

簡単な流れとしては次のような感じです。

1. HTML マークアップ（template ブロック）
2. SASS 読み込み（style ブロック）
3. 必要であれば JavaScript 読み込み（script ブロック）

先に完成したコードを載せて、その後に次の点にフォーカスを当てて解説します。

- 見た目のバリエーション
- ライフサイクルに合わせた初期化と破棄
- 見た目のカスタマイズ

```HTML
<template>
  <button
    ref="button"
    :type="type"
    :class="{
      'mdc-button--raised': raised,
      'base-button--raised': raised,
      'mdc-button--unelevated': unelevated,
      'base-button--unelevated': unelevated,
      'mdc-button--outlined': outlined,
      'base-button--outlined': outlined,
    }"
    class="mdc-button base-button"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script>
import { MDCRipple } from '@material/ripple';

export default {
  name: 'BaseButton',

  props: {
    type: {
      type: String,
      default: 'button',
    },

    raised: {
      type: Boolean,
      default: false,
    },

    unelevated: {
      type: Boolean,
      default: false,
    },

    outlined: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      mdc: null,
    };
  },

  mounted() {
    this.initializeMDC();
  },

  beforeDestroy() {
    this.destroyMDC();
  },

  methods: {
    initializeMDC() {
      this.mdc = MDCRipple.attachTo(this.$refs.button);
    },

    destroyMDC() {
      if (this.mdc !== null) {
        this.mdc.destroy();
      }
    },

    handleClick(evt) {
      this.$emit('click', evt);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@material/button/mdc-button';

.base-button {
  @include mdc-button-ink-color($color-vue);
  @include mdc-states($color-vue);
  line-height: 1;
}

.base-button--raised,
.base-button--unelevated {
  @include mdc-button-container-fill-color($color-vue);
  @include mdc-button-ink-color(white);
  @include mdc-states(white);
}

.base-button--outlined {
  @include mdc-button-outline-color($color-vue);
}
</style>
```

### 見た目のバリエーション

Button コンポーネントにはいくつかの[バリエーション](https://material.io/develop/web/components/buttons/#style-customization)が存在します。

今回は次の 3 つのバリエーションに対応させています。

- raised
- unelevated
- outlined

Material Components は BEM で書かれており、バリエーションは `mdc-button--raised` のようなクラスで提供されています。
このバリエーションのクラスを props の値によって切り替わるようにします。

props は `type: Boolean` でバリエーションと同じ名前のものを記述します。
Boolean を指定することで次のように属性に props 名と同じ属性を指定すると true に props を作れます。

```
<BaseButton raised>浮き上がったボタン</BaseButton>
```

props には boolean の値がくるようになったので、後は class 属性をバインドさせて、クラスの出し分けをするだけでバリエーションに対応できます。
class 属性は Object をバインドさせると、値が truthy のときにそのプロパティ名のクラスが有効になります。

### ライフサイクルに合わせた初期化と破棄

SPA のプロジェクトの場合は画面がリロードされないので、イベントの管理が重要になります。
BaseButton ではリップル（クリックやタップしたときの波紋のようなエフェクト）をつけています。

リップルは


### 見た目のカスタマイズ

## Text Field のコンポーネント

```HTML
<template>
  <div ref="textField" class="mdc-text-field base-text-field">
    <input
      :id="id"
      v-model="model"
      v-bind="props"
      class="mdc-text-field__input"
    />
    <label :for="id" class="mdc-floating-label"><slot /></label>
    <div class="mdc-line-ripple" />
  </div>
</template>

<script>
import { MDCTextField } from '@material/textfield';
import { vueUidMixin } from 'vue-uid';

export default {
  mixins: [vueUidMixin],

  inheritAttrs: false,

  props: {
    value: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: 'text',
    },
  },

  data() {
    return {
      mdc: null,
    };
  },

  computed: {
    id() {
      return `base-text-field-${this.$_uid}`;
    },

    props() {
      return {
        ...this.$props,
        ...this.$attrs,
      };
    },

    model: {
      set(value) {
        this.$emit('input', value);
      },
      get() {
        return this.value;
      },
    },
  },

  mounted() {
    this.initializeMDC();
  },

  beforeDestroy() {
    this.destroyMDC();
  },

  methods: {
    initializeMDC() {
      this.mdc = MDCTextField.attachTo(this.$refs.textField);
    },

    destroyMDC() {
      if (this.mdc !== null) {
        this.mdc.destroy();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@material/textfield/mdc-text-field';

.base-text-field {
  @include mdc-text-field-label-color($color-vue);
  @include mdc-text-field-caret-color($color-vue);
  @include mdc-text-field-fill-color(transparent);
  @include mdc-text-field-hover-bottom-line-color($color-vue);
  @include mdc-text-field-line-ripple-color($color-vue);
}
</style>
```

## まとめ

## 補足

### コンポーネント化したライブラリはすでに存在する

### どのような CSS フレームワークならコンポーネント化することができるのか
