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

### サンプルリポジトリ

[https://github.com/mya-ake/vuepress-plugin-component-catalog/tree/master/example/material-components-web](https://github.com/mya-ake/vuepress-plugin-component-catalog/tree/master/example/material-components-web)

## アウトライン

- [Material Components](#Material_Components)
- [今回作るもの](#今回作るもの)
- [Material Components をプロジェクトに導入する](#Material_Components_をプロジェクトに導入する)
- [Button のコンポーネント](#Button_のコンポーネント)
- [Text Field のコンポーネント](#Text_Field_のコンポーネント)
- [まとめ](#まとめ)
- [補足](#補足)

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
これを設定しないと node_modules から scss の読み込みがうまくいきません。

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

- [見た目のバリエーション](#見た目のバリエーション)
- [ライフサイクルに合わせた初期化と破棄](#ライフサイクルに合わせた初期化と破棄)
- [見た目のカスタマイズ](#見た目のカスタマイズ)

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
Boolean を指定することで次のように属性に props 名と同じ属性を指定すると true になる props を作れます。

```
<BaseButton raised>浮き上がったボタン</BaseButton>
```

props には boolean の値がくるようになったので、後は class 属性をバインドさせて、クラスの出し分けをするだけでバリエーションに対応できます。
class 属性は Object をバインドさせると、値が truthy のときにそのプロパティ名のクラスが有効になります。

### ライフサイクルに合わせた初期化と破棄

SPA のプロジェクトの場合は画面がリロードされないので、イベントの管理が重要になります。
BaseButton ではリップル（クリックやタップしたときの波紋のようなエフェクト）をつけています。

リップルはイベントを直接 DOM に付与します。
そのため DOM が破棄されるときにイベントもしっかり削除する必要があります。

基本的には、Material Components のイベントを _mounted_ で 付与し、 _beforeDestroy_ で破棄します。
これを徹底しておかないとメモリリークの危険性があります。
Material Components に限らず、他のフレームワークや Swiper などのライブラリでも発生しうるので、イベントが自動で付与されるものを利用する際は注意しましょう。

また、`MDCRipple.attachTo()` の引数には Element を渡す必要があります。
`querySelector()` を使って渡してもよいのですが、Vue.js では ref を使うことで手軽に参照できるので ref を使って渡すと楽です。
確実にコンポーネントの element を渡すことができます。

※`querySelector()`などを使う場合は判別のために id を付与して確実に対象の element を取得しなければならないので少し手間となります。

### 見た目のカスタマイズ

Material Components には見た目をカスタマイズするための SASS の Mixin が用意されています。
コンポーネントの SASS をインポートしておけば使えるようになります。

提供されている Mixin はコンポーネントのドキュメントの Sass Mixins のセクションに書かれているので使う際は一度目を通しておくとスムーズに作業が進むかもしれないません。

[https://material.io/develop/web/components/buttons/#sass-mixins](https://material.io/develop/web/components/buttons/#sass-mixins)

#### クラスを分けて拡張している理由

定義しているところを明確にするためです。
mdc-button クラスで拡張しても反映されますが、dev tools などで見たときに、パッと見で自分たちが定義しているかどうかがわかるので個人的にはフレームワークで使われているクラス名と分けるようにしています。

## Text Field のコンポーネント

次に Text Field のコンポーネントである BaseTextField コンポーネントを作ります。

[Text Field - Material Components for the Web](https://material.io/develop/web/components/input-controls/text-field/)

作る流れは Button のコンポーネントと同様です。
また解説も同様に先に完成したコードを載せて、その後に次の点にフォーカスを当てて解説します。
ライフサイクルに関しての処理は Text Field でも必要です。

- [v-model（カスタム input）](#v-model（カスタム_input）)
- [input タグの属性リレー](#input_タグの属性リレー)
- [id の重複回避](#id_の重複回避)

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

### v-model（カスタム input）

カスタム input はけっこう知られてきてるかもしれませんが、一応解説を入れておきます。
ドキュメントは次のページです。

[Components Basics — Vue.js](https://vuejs.org/v2/guide/components.html#Using-v-model-on-Components)

まずは v-model 自体の解説ですが、言葉で説明するよりもコードを見せたほうが早いです。
v-model を分解すると次のようになります。

このような v-model があると

```
<input v-model="searchText">
```

これと同じ意味になります。

```
<input
  v-bind:value="searchText"
  v-on:input="searchText = $event.target.value"
>
```

値のバインドとイベントの emit を行っているだけです。

そのため、これと同じような動きを書けば自分で作ったコンポーネントでも v-model が使えるようになります。

ポイントは次の 3 点です。

- props に value を定義
- model を computed に定義（model のところは好きな名前で大丈夫です）
  - get で props の value を参照
  - set で input のイベントを emit
- input タグに `v-model="model"` を追加

これだけを抑えておくと、BaseTextField コンポーネントは次のように v-model で値をバインドできます。

```html
<BaseTextField v-model="value">ラベル</BaseTextField>
```

### input タグの属性リレー

BaseTextField コンポーネントを使うときに属性を付けたいというケースは、基本的に input タグに属性を付けたいという場合だと思います。

たとえば次のように maxlength を付けたい場合などです。

```html
<BaseTextField v-model="value" maxlength="10">ラベル</BaseTextField>
```

そのままだと BaseTextField コンポーネントの境界である div タグに maxlength 属性が付いてしまいます。
もちろん Vue.js ではこのようなケースに対応するための option として`inheritAttrs`が用意されています。

[https://vuejs.org/v2/api/#inheritAttrs](https://vuejs.org/v2/api/#inheritAttrs)

inheritAttrs オプションを使うと `$attrs` が使えるようになります。
`$attrs` には親から渡された属性が object で入っています。
これを input タグに渡してあげれば maxlength を中の input タグに付けることができます。

渡し方ですが、input タグには props の type も一緒に渡してあげたいです（type に default 値として text を入れたいため props に定義しています）。
v-bind ディレクティブに object を渡すことでまとめてバインドできます。
`$props` と `$attrs` をまとめて渡してあげれば、雑ですが適切に目的のタグに対して属性をバインドさせられます。

その該当箇所だけ抜き出すとこのようになります。

```html
<template>
  <div>
    <input v-bind="props" /> <label><slot /></label>
    <div />
  </div>
</template>

<script>
  export default {
    inheritAttrs: false,

    props: {
      type: {
        type: String,
        default: "text"
      }
    },

    computed: {
      props() {
        return {
          ...this.$props,
          ...this.$attrs
        };
      }
    }
  };
</script>
```

### id の重複回避

この問題は id を持つコンポーネントを複数箇所で使った場合に発生します。
この問題と解消手段については別途記事を書いているのでそちらをご覧ください（自分で作った vue-uid っていうプラグインの宣伝）。

[vue-uid というコンポーネントで使えるユニーク ID を持たせるプラグインを作った - mya-ake com](https://mya-ake.com/posts/release-info-vue-uid/)

## まとめ

ざっくり Button と Text Field を例に Material Components を導入する方法を記事にしました。
きれいに導入するには Vue.js に関する知識がいろいろ必要になってきます。
Vue.js の学習をする際に CSS フレームワークと組み合わせてみるというのはいい題材になるのではと個人的に思いました。

実はこの記事は技術書典 5 で書いた[Try PWA](https://neko-note-help.booth.pm/items/1029866)の 5 章の内容の一部です。
この Try PWA 自体は PWA の本なのですが、サンプルを作る上で Vue.js と Material Components を組み合わせるノウハウなどが出てきたのでおまけ的な章として一緒に入れてしまう予定でした。
予定でしたとある通り、まあ間に合いませんでしたごめんなさい 🙇‍
現在執筆中で今回例に上げた Button と Text Field 以外のコンポーネントもいくつか追加で解説予定です（Vue.js と組み合わせて面白そうなコンポーネント）。
今は年末セールと言う形で筆者のサークル neko-note の一部同人誌が 20 % OFF となっているので、ご興味ある方はぜひご購入いただいて更新をお待ちください 🙏

ストアはこちら -> [neko-note - BOOTH](https://neko-note-help.booth.pm)

補足として下部にいくつかコラム的なものを載せているのでご興味ある方はそちらもご覧ください。

## リンク集

- [material-components-web/integrating-into-frameworks.md at master · material-components/material-components-web](https://github.com/material-components/material-components-web/blob/master/docs/integrating-into-frameworks.md)
  - Material Components をフレームワークに導入するときの方法などが書かれています

## 補足

### コンポーネント化したライブラリはすでに存在する

実は Material Components を Vue.js 用にラップしたサードパーティ製のライブラリが存在しています。
Material Components を Vue.js で使う際はこちらの利用も検討されるとよいかもしれません。

[matsp/material-components-vue: Material Design styled components for Vue.js](https://github.com/matsp/material-components-vue)

### どのような CSS フレームワークならコンポーネント化することができるのか

SASS でコンポーネント単位で作られているフレームワークであれば比較的簡単に導入できます。
Bootstrap もパット見 mixin の import 周りの手間がありそうですが、導入できそうな雰囲気です（試してはないです）。

また最近、[クラク](https://twitter.com/Qrac_JP)さんが作られている CSS フレームワーク「[MUSUBii](https://musubii.qranoko.jp)」を[山根 翔](https://twitter.com/sho_yamane)さんが Vue.js のライブラリ[VueBento](https://github.com/sho-yamane/vue-bento)にするということで少しお手伝いさせていただきました。

このように使われている CSS フレームワークであればサードパーティ製のライブラリとして作られている可能性が高いです。
Material Components もそうでしたが一度探してみてはいかがでしょうか？

もしライブラリの API が合わない場合や処理を最適化したい（汎用的にであるがゆえに処理が多くなりがちなので）という場合は自身で CSS フレームワークからコンポーネントを作ってみるとよいかもしれません。

### サンプルコードに含まれる docs ブロック

これは筆者が作成中の VuePress をコンポーネントカタログとして使うための記述です。
導入に挫折しない & メンテナンスコストを限りなく低くをコンセプトに開発しています。

[mya-ake/vuepress-plugin-component-catalog: Generating a component catalog of Vue.js](https://github.com/mya-ake/vuepress-plugin-component-catalog)

1/30 に行う[Vue Night in Fukuoka #2](https://v-fukuoka.connpass.com/event/113123/)でこのプラグインの話の予定です。
まだまだ課題は多いですがそれまでに今よりいい感じにすべく頑張っていきます 💪
