# Vue Composition APIのコラムっぽいもの集

## この記事について

この記事は[bosyu Advent Calendar 2019](https://qiita.com/advent-calendar/2019/bosyu)の5日目の記事です。

この記事では[Vue Composition API](https://vue-composition-api-rfc.netlify.com)についてのコラムっぽいものをいくつか書いてみた記事です。

### ⚠️注意

Vue Composition API自体はまだ正式なリリースがされていない実験的なAPIです。
[Vue Composition APIのサイト](https://vue-composition-api-rfc.netlify.com/#adoption-strategy)にも記載されていますが、まだ破壊的な変更がされる可能性もあり、プロダクションでの利用は推奨されていません。

## bosyuでなにやってるの？

あんまり表立って言ったりしてなかったんですが、夏頃から業務委託で[bosyu](https://bosyu.me)の開発をしています。
具体的にはbosyuのフロントエンドのテストコードの追加やTypeScript化をやったり、機能追加や改善などよくあるサービス開発をしています。

※ちなみにbosyuでVue Composition APIの導入もしました（冒頭でプロダクションでの利用を注意喚起しておいて入れてます）。
いざってときはPR出そうっていう話をメンバーでしてます。

## Vue Composition APIとは

ここから本題です。
Vue Composition APIはVue 3で導入される予定のVueの新しいAPIです。
React Hooksと機能的には似ており、機能を関数単位でまとめることができます。
Vue 2のオプションベースではdataやmethodsなどカテゴリごとに関連するデータや処理が分散してしまっていましたが、Composition APIを使うことにより関数単位でまとめて管理できるようになります。
大きなコンポーネントになったとしても可読性が担保されます（そもそも大きすぎるコンポーネントは問題ではありますが）。

文章だけだとわかりづらいので、シンプルなカウンターを例にVue 2のコードをComposition APIに書き換えて見ます。
（このサイトのメンテナンスしてないせいでハイライトがひどくてごめんなさい）

**Vue 2**

```ts
import Vue from 'vue';
export default Vue.extend({
  data: () => ({
    count: 0,
  }),
  methods: {
    increment() {
      this.count++;
    },
  },
});
```

**Composition API**

```ts
import { createComponent, ref } from '@vue/composition-api';

// カウンターに関わるものを関数でまとめる
const useCounter = () => {
  const count = ref(0);
  const increment = () => {
    count.value++;
  };
  return { count, increment };
}

export default createComponent({
  setup() {
    const { count, increment } = useCounter();
    return { count, increment };
  },
});
```

行数は増えていますが、コードにおいて大事なのはコード量（だけ）ではないのでそこは気にしないでください。
大事なのはdataとmethodsに散らばっていたコードがuseCounterという関数の中で閉じられています。
このuseCounterは*Composition Function*と言います（日本語にすると合成関数ですが翻訳による認識の齟齬を生まないためにもComposition Functionと呼称します）。

これだけのコードでは正直ありがたみがないですが、Vueを書いている人は、ある機能に関連するコードが随所に散らばって読みづらくなるという経験をしていると思います。
そのようなコードがComposition Functionとしてまとめることができるようになるというのはメリットではないでしょうか？

ここで細かい仕様とかを書き出すときりがないので仕様などは[公式サイト](https://vue-composition-api-rfc.netlify.com)や他の方の記事をご覧ください。
なんでComposition APIができたの？って方はサイトの始めにある動画がイラスト付きでわかりやすいのでオススメです。

また公式サイトにはRFCの仕様だけではなく[API Reference](https://vue-composition-api-rfc.netlify.com/api.html)も存在するので、ref関数などのComposition APIで使えるものはそちらをご覧ください。（右上のメニューにあるんだけど見落としがちだよね）

## Vue Composition APIのアレなところを掘り下げる

公式サイトの方にDrawbacksというセクションがあります。
これはComposition APIに対する微妙な感じのところを公式で解説しているところです。
その箇所を個人的に掘り下げてみようと思います。

### Overhead of Introducing Refs

これは変数をリアクティブな変数とするために、Refでラップしないといけない点について書かれています。

具体的にはどういうことかというと、さきほど書いたuseCounterの内部で、ただの数値である`count`を`ref関数`で生成しています。
そしてincrement関数の内部で`count.value++`としています。
つまりRefでラップすることにより値を参照・更新したいときは`.value`でアクセスする必要があり面倒だという話です。

`count++`とできないのはVueのリアクティブシステムに原因があります。
これはVueが[Object.defineProperty()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)によりリアクティブシステムを構成しているためです（Vue 3になると[Proxy](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Proxy)にはなるがユーザーから見ると同じに見える）。
Object.defineProperty()を使うことにより、Objectの参照/更新時に任意の処理を追加できます。
Vueはこれを利用して値の変更を検知してコンポーネントを再描画したりしています。

Object.defineProperty()もProxyもどちらもObjectである必要があるため、シンプルに`count++`とできません。
Vue 2の頃はできていたように感じるかもしれませんが、Vue 2は`this`というObjectを経由していたため`this.count++`とすることができました。
この点においてはやってることとしては同じなのですが、冗長でめんどうに思えてしまうかもしれません。
また、Refでラップされているにもかかわらず`count++`と書いて動かないというケースが出てしまうかもしれません（`count.value++`とするのが正しい）。
これはJavaScriptで書いている場合頻発しそうなので、TypeScriptを使い、書いている時点で気づくための仕組みがあれば安全に開発できるのではないかと思います。

### Ref vs. Reactive

Composition APIには`ref`と`reactive`という2つのリアクティブな変数を作る関数が存在します。
これはどちらがいいのかという話が書かれています。

ref関数とreactive関数ですが、簡単にコードを書くと次のようになります。

```ts
// ref
const coustRef = ref(0);
coustRef.value++;
console.log(coustRef.value); // 1

// reactive
const countState = reactive({ count: 0 });
countState.count++;
console.log(countState.count); // 1
```

どちらもcountをインクリメントするだけの処理をしています。
これだけを見るとプリミティブなときはref関数で、オブジェクトのときはreactive関数かな？となりますが、シンプルにそれだけの話ではありません。
reactive関数を使っている場合は少し罠があります。
次のコードでその罠が露見します。

```ts
const countState = reactive({ count: 0 });
let { count } = countState;
count++;
console.log(count); // 1
console.log(countState.count); // 0
```

2行目で分割代入をしていますが、ここでプリミティブな値となってしまい、元のcountStateのcountプロパティとの参照が切れてしまいます。
参照が切れるとリアクティブな値ではなくなってしまいます（countを更新しても再描画されない）。

Composition Functionの中でこのように分割代入することはないですが、Composition Functionを使う方では起こりがちです。
次のようにしてしまう場合です。

```ts
const useCount = () => {
  const countState = reactive({ count: 0 });
  return {
    ...countState,
  };
};

let { count } = useCount();
count++; // このcountを更新しても再描画されない
```

もちろんこの解決策は用意されていて、`toRefs`という関数が存在します。
toRefs関数はreactive関数で作られたオブジェクトのプロパティをRef化してくれます。
そのtoRefs関数を使うとこうなります。

```ts
const useCount = () => {
  const countState = reactive({ count: 0 });
  return {
    ...toRefs(countState),
  };
};

const { count } = useCount();
count.value++; // Refになっているので更新すると再描画される
```

このように基本Composition Functionの中で作ったリアクティブなオブジェクトを外部で使う場合は、toRefs関数を使って返してあげる必要があります。

これがreactive関数の罠です。
この罠だけを見るとref関数だけを使ってる方がいいんじゃないかという風にはなりますが、ref関数はref関数で`.value`プロパティ経由で値を操作する必要があり面倒さがあります。

結局どのようにすればいいのかというのはこのセクションでは、「基本的にはreactive関数を使い、toRefs関数を使うことを忘れないようにしましょう。また現時点ではこのベストプラクティスをだすのは時期尚早であるため、改めてガイダンスを出す。」という風に書かれています（意訳入ってるので英文もお読みください）。

ただ筆者としては今のところの結論は出ていて、「基本reactive関数を使い、ref関数は基本使わない」です。
その理由としては

- ①変数操作が直感的である
- ②スコープ付けしやすい
- ③書く人による差を出しづらくする

というのがあります。
①はvalueプロパティを使わなくていいという点で直感的ですし、②についてはreactiveを使うことで名前空間を利用できるようになります。
それを利用して、Composition Funcitonの中に閉じられた変数なのかどうかというのを明示できます。
③は両方を許可していると各所で差が出てきて、書いた人による偏りが出てしまうためです。

②については具体的なコードではないのですが、次のような雰囲気になります。

```ts
const useHoge = () => {
  const state = reactive({}); // return で外部に公開する
  const localState = reactive({});  // return せずにこの関数内でのみ利用する
  return { ...toRefs(state) };
}
```

こうするとこのComposition Functionではなにを公開しているのかが明示され、見返したときの可読性があがります。

ここで言いたかったことをまとめておくと次のとおりです。

- refとreactiveがあるけど、基本reactiveを使う
- Composition Functionとコンポーネントのリアクティブな値の受け渡しはRefにする
  - リアクティブな変数をComposition Functionの引数でもらうときもRefでもらう

### Verbosity of the Return Statement

これはsetupでreturnした値でないとtemplateで使えない点について書かれています。
setupの中で宣言された変数を自動的にtemplate内で使えるようにしたらどうかという提案もあったそうですが、JavaScriptとして直感に反するため採用されなかったそうです。
その代わりIDEの拡張機能やBabelプラグインでそういったものを作るのがよいのではないかと書かれています。

個人的には本文中にも書かれている通りreturnした方が明示されていてわかりやすいですし、保守性も高いように思えます。
これについてはあまり深堀りすることもないので軽く意訳しただけですがこれで終わりたいと思います。

### More Flexibility Requires More Discipline

Composition APIにより、柔軟性が高くなったが、その分規律が必要になったというお話です。
これは本当にその通りで今まで以上にスパゲッティなコードができあがる可能性は高くなります。
それは自由度が上がったためによるもので、決してComposition APIの仕様によるものではありません。
しかしながらこの自由度によりコードの表現の幅が広がりました。
今まではどうしてもobjectベースだっため、コンポーネントの機能を外に切り出すのは難しったかったです。mixinという形で切り出せはしましたが、書き心地がいいものではなかったと思います。
それを関数という形で切り出せるようになったので、.vueファイルに書かずに、.jsや.tsなど別のファイルに書くということがやりやすくなります。
そうするとテストもやりやすくなりますし、.vueファイルはシンプルにviewに関することと必要なComposition Functionを呼び出すことだけになり、よりviewに集中しやすくなります。
いっそのことSFCのscriptブロックを別ファイルにして、scriptブロックのsrc属性で読み込むということをしてもいいかもしれません。

またComposition APIはVueと独立して使うことができます。
そのためJestなどでComposition Functionをテストする際は、Vueのコンポーネントのようにtest utilsなどのサポートライブラリを必要とせずテストすることが可能になります。  
あと完全に思いつきでしかないのですが、Composition APIを他のviewライブラリと組み合わせことも不可能ではないと思います。watchで再描画を行うようにすることで可能になると思います。
まあVueをやめても使い回せるというメリットがあるかもしれませんが、再描画する処理を自身で書いていくのは現実的でないのでやめておいたほうがいいように思います。

スパゲッティコードが生成される件については、書く人自身のスキルを上げていくしかないように思います。
もし不安であればVue 3でも今まで通りobjectベースの書き方もできるので、無理にComposition APIを使う必要はないです（objectベースで書いたからと言ってスパゲッティにならないわけではない）。
本文中にも書かれているのですが、適切にJavaScriptを書く力があれば適切にComposition APIを書くことができるでしょう。
結局のところコードを上手く書くには書く人自身のスキルが必要になってきます。
フレームワークやライブラリはあくまで道具だということを忘れてはいけないように思います。

ただComposition APIについてはまだリリースもされていないものなので、知見がまだ出てきていません。
知見が出てきてから使うというのでも遅くはないように思います。
今時点で言えることはComposition Functionを小さく保ち、コンポーネントのsetup内はComposition Functionを呼び出す程度に作っていけば、激しいスパゲッティコードになることはないと考えています。

## Propsがリアクティブがじゃなくなる？

これは筆者がComposition APIを使っていてハマった落とし穴についてです。
Composition APIではPropsはsetupの第一引数に入ってきます。
わかりやすくするために次のようなscriptを持ったコンポーネントがあったとします。
よくあるinputタグをコンポーネント化したものです。

```ts
export default createComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const model = computed({
      get: () => props.value,
      set: value => emit('input', value),
    });
    return { model };
  },
});
```

このコンポーネントは問題なく動くのですが、次のようにpropsを分割代入することである問題が発生します。

```ts
export default createComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup({ value }, { emit }) {
    const model = computed({
      get: () => value,
      set: value => emit('input', value),
    });
    return { model };
  },
});
```

動かしてみると一見動いているように見えますが、親のコンポーネントでpropsに渡しているvalueを更新すると、それが子となるこのコンポーネントに反映されません。
これはプリミティブな値となってしまったため、参照が外れ同じ値ではなくなってしまったため起こってしまいます。
そのためsetupのpropsはオブジェクトのまま受け取るようにしておかないと思わぬバグにつながるかもしれません。

#### 余談：modelの生成をComposition Functionとして切り出す

こうなります。これでTextareaのコンポーネントでも再利用できます。

```ts
// Composition Function
const useModel = (props: { value: string }, emit: SetupContext['emit']) => {
  const model = computed({
    get: () => props.value,
    set: v => emit('input', v),
  });
  return { model };
};

// component
export default createComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { model } = useModel(props, emit);
    return { model };
  },
});
```

ちなみにComposition Functionとして切り出した場合もpropsはobjectとして受け取らないといけません。
こうしなければいけない理由は参照が切れるからです。
ちょっといけてないですが仕方ないですね。

## Vuexはいらなくなる？

## 次回Vue Composition APIの設計戦略

