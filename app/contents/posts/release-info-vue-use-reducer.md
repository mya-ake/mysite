# Vue.observable() を使って Vue.js 用の React Hooks（一部）を作った

@@
@@

==2019-05-06==

## なにを作ったか

React Hooks の`useReducer`を Vue.js 向けに作りました。

[https://www.npmjs.com/package/vue-use-reducer](https://www.npmjs.com/package/vue-use-reducer)

## なんで作ったか？

最近、Vue.js × TypeScript を始めて、Vuex 周りが予想はしてたのですがツラいなーという気持ちになってました。
すでに出ているヘルパーライブラリも見ましたが、State や Action など、それぞれデコレーターなどを書いたり個別に型定義を書く必要があるなど手間が多そうに見えました（型定義頑張りたくない）。

そこで Vue.js v2.6 から使えるようになった`Vue.observable()`を使って独自の状態管理ストアを作る方針を考え始めました。

※ この記事の前提

個人的に Vue.js と TypeScript を使う上で次のような方針を持って開発したいと思っています。

- JavaScript のときの Vue.js とあまり書き心地が変わらない
  - class-style component syntax は使わない
- 型定義はあまり頑張りたくない
  - なるべく型推論で

という前提の上での話を書いています。


## Vue.observable()

`Vue.observable()`は Vue.js が変更検知可能な object を生成できる関数です。  
ドキュメントはこちらです。

[https://jp.vuejs.org/v2/api/index.html#Vue-observable](https://jp.vuejs.org/v2/api/index.html#Vue-observable)

使い方はシンプルで次のとおりです。

```js
import Vue from 'vue';

const state = Vue.observable({ count: 0 }); // 引数に object を入れる

console.log(state);   // { count: 0 }

const vm = new Vue({
  template: `<div>{{ count }}</div>`,
  computed: {
    count() {
      return state.count;
    },
  },
  methods: {
    increment() {
      state.count++;  // こんな感じで値を変更すると表示されている template の count も変わる
    },
  },
})

state.count++;  // もちろん Vue のインスタンス外で変更してもコンポーネントの count は変わる
```

ざっくり data を外に定義できるようになったと思ってもらってもいいかもしれません。
これができるということは自前で Vuex のようなグローバルな状態管理のストアを作れるということになります。

雑にストアを作るとこんな感じで作れます（ここから TypeScript で書きます）。

```ts
import Vue from 'vue';

type State = { 
  count: number;
};

class CounterStore {
  private state: State;
  constructor(initialState: State) {
    this.state = Vue.observable(initialState);
  }

  get count() {
    return this.state.count;
  }

  increment() {
    this.state.count++;
  }
}

export const counterStore = new CounterStore({ count: 0 });
```

これをコンポーネントで読み込むことにより次のように使えます。

```ts
import Vue from 'vue';
import { counterStore } from './counterStore';

export default Vue.extend({
  computed: {
    count(): number {
      return counterStore.count;
    },
  },

  methods: {
    increment() {
      counterStore.increment();
    },
  },
});
```

counterStore は他のコンポーネントなどでも利用でき、値は共有されることになります。
シンプルですがグローバルな状態管理のストアを作れました。
Vuex の action のように非同期処理なども書くことができます。

これでいいじゃんとも思ったのですが、やはり制約がないとなんでも書けてしまってとても Fat なストアができてしまう可能性がはらんでいます。

そこで目をつけたのが React Hooks です。

## React Hooks の useReducer

React Hooks についてはこの記事では深く言及はしませんが、React Hooks にはいくつかの関数が存在します。
その中に`useReducer`という関数があります。
reducer とあるように Redux に似ています。

この`useReducer`は引数に reducer 関数と初期 state を受け取ります。
実行すると state と state を更新するための dispatch 関数が得られます。
dispatch 関数は Redux 同様に Action と呼ばれる object を渡して、state を更新します。

見た方が早いので前述した CounterStore を useReducer を使って書きます。

```ts
type State = { 
  count: number;
};

type ActionTypes = 'increment';

type Action = {
  type: ActionTypes;
};

const reducer = (state: State, action: Action) => {
  switch(action.type) {
    case 'increment':
      return {
        ...state,
        count: state.counter + 1,
      };
  }
}

const initialState: State = {
  count: 0,
};

const [state, dispatch] = useReducer(reducer, initialState);
dispath({ type: 'increment' }); // これで count が更新される
```

なにが嬉しいかと言うとこの仕組みだと state を更新することしかできないからです。
（reducer で変なことやろうと思えばできるけどやるメリットがない）

また型定義に関しては先ほどの class で書いたときよりも書く必要は出てきます。
Action 1 つにつき type での定義が一つ
