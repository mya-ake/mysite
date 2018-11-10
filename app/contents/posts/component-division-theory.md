# 実装面からコンポーネントの分割の仕方を考えてみた

==2018-11-10==

## 背景

筆者が個人的に仕事を受けている会社のフロントエンドのプロジェクトを立ち上げることになりました。
そこでせっかく新しく作る機会があるならコンポーネントの分割の仕方を明確に定義したいと思いました。

そもそもなんで分け方を定義したいとなったかというと、後からメンバーがプロジェクトに入ってきたときに、スムーズにプロジェクトに入ってもらうためです。

今まで作ってきたプロジェクトでのコンポーネントの分け方は、「2,3回使う場合はコンポーネントに分ける」
「長くなって見通しが悪いコンポーネントは分ける」など曖昧なところもありますがシンプルなものでした。
ただこの分け方をするとコンポーネント自体が大きくなりがちでした。  
今のところプロジェクトに関わる人数も少なく、個々のメンバーのレベルも高いため運用できていますが、人が増えた場合や他のメンバーとなった場合は「苦しいのではないか？」という気持ちがあります。

このような背景があり自分の考えをまとめるためにもこの記事を書き始めました。


## Atomic Design を導入することを考える

まずは目にすることが多くなった「Atomic Design」を導入することを考えてみました。

ただAtomic Design はデザインシステムの1つです。
あくまでもデザインにおける設計論です。
そのため実装に関しての明確な手法は存在していないのが現状となっています。

Atomic Design を知るために原典となる「[Atomic Design by Brad Frost](http://atomicdesign.bradfrost.com)」を読んで見ることにしました（長いので Chapter 2
Atomic Design Methodology だけ読みました）。

### ざっくり Atomic Design

Atomic Design は化学分野の原子や分子など物質の組成に関する機能を基に考えられたデザインシステムです。
ページにおけるパーツを次の5カテゴリに分類します。

- Atoms
- Molecules
- Organisms
- Templates
- Pages

Atoms がもっとも小さく、Pages がもっとも大きいです。
下のカテゴリが上のカテゴリをラップする感じになるので、下のカテゴリは上のカテゴリに依存します。その逆はありません。

それぞれの筆者なりに要約しました。

#### Atoms

Atoms は UI を構築するための最小単位です。
これ以上分割することができません。
基本的には単体の HTML タグと同等な役割となります。

http://atomicdesign.bradfrost.com/chapter-2/#atoms

#### Molecules

Molecules は Atoms のグループです。
比較的シンプルな UI 要素のグループとなります。
たとえば検索フォームを例にすると、次の3つの Atoms から構成されます。
便宜上基礎的な HTML タグで記述しています。

```HTML
<form>
  <label for="search">サイト内検索</label>
  <input id="search" type="search" value="">
  <button type="submit">検索する</button>
</form>
```

http://atomicdesign.bradfrost.com/chapter-2/#molecules

#### Organisms

Organisms は、Atoms / Molecules / 他の Organism からなるグループです。
UI における個別のセクションを表す複雑なコンポーネントとなります。

http://atomicdesign.bradfrost.com/chapter-2/#organisms

#### Templates

Templates は Organisms / Molecules の集合です。
この段階で web サイトの 1 ページのワイヤーフレームのようになります。
ページのコンテンツは流し込まず、スケルトンでコンテンツを代替します。

ちなみに Templates からは化学用語ではなくなります。
その理由は徹底的にやるとステークホルダー（クライアントや上司など）を混乱させかねないからだそうです。

http://atomicdesign.bradfrost.com/chapter-2/#templates

#### Pages

Pages は Templates にコンテンツを流し込んだ状態です。
この段階ですべてが具体的になります。
また Pages はバリエーションを表現するための役割もあります。
検索結果がない場合やページングなどのそのページにおけるバリエーションの変化がここで現れます。

http://atomicdesign.bradfrost.com/chapter-2/#pages

### 原典からわかったこと

- デザインを構築するための設計論
- 当たり前だが実装方法については書いてない
- UI における分類に名前が付いてプロジェクトごとに定義しなくてよくなる
- コンポーネントベースなので使い回すことが前提でデザインが組み上がる
- コンポーネントを分割するときの1つの指標にできそう

## Atomic Design で実装することを考える

原典を読んでなんとなく実装する際のコンポーネント分割の指標にできそうでした。
ただ 5 つのカテゴリの中でワイヤーフレームとなる Templates は不要そうです。
そうすると「Atoms」「Molecules」「Organisms」「Pages」の4つになります。

### Atomic Design の制約

Atomic Design をベースにするなら基本的には Atomic Design の制約に則り実装すべきであると筆者は考えます。
現状の制約を表にすると次のようになります。

| カテゴリ | 依存してもいいもの | 依存の数 | 備考 |
|:---:|:---:|:---:|:---:|
| Atoms | なし | 0 | 分割できてはいけない |
| Molecules | Atoms | 2 以上 | シンプル |
| Organisms | Atoms, Molecules, Organisims | いくつでも | 複雑になりがち |
| Pages | Organisms | いくつでも | Organisms を組み合わせるだけ |

ただし、これだけの制約では実装するときに困ります。
実装する際にはデータを必ず扱います。
またストアというグローバルなステートを保管している領域も存在します。
これらの扱いが定まっていないと予期せぬ依存が発生してしまい上記制約を満たすこともできなくなる可能性があります。
そのためデータの流れやストアに関する制約も定めておく方が無難そうです。

### データなどソースコードを書く上での制約

#### データフローの制約

基本的にデータは Pages →　Organisms → Molecures → Atoms という順になるでしょう。
また逆に子から親へはイベントの伝播によってデータを渡すことになります。
この点に関しては最近の View 層のライブラリやフレームワークですでに制約があると思うのであまり気にする必要はなさそうです。

#### 処理の制約

フローに関してはライブラリ、フレームワークレベルで担保されるので大丈夫ですが、それぞれのカテゴリでどこまで処理を行ってよいかの定義が必要だと考えます。
たとえばどのカテゴリから API サーバーにリクエストを送ってよいか、具体的な処理（たとえばバリデーションなど）を行ってよいかなどです。

Atoms や Molecules はシンプルに保つ必要があるので、ここに具体的な処理を書くのは違うように思えます。
Atoms や Molecules では複数箇所で使われる前提なのでデータの受け付けとイベントの伝播だけに徹するのが無難そうです。

そうすると Organisms と Pages で具体的な処理を書くことになります。
ただそれぞれはスコープが異なるのでなんでもしていいかというとそういうわけではないと考えます。
Organisms は特定のセクションになるので、自身が扱わないデータまで扱ってしまうと依存が別の方向にまで広がってしまいます。
そのため Organisms では自身の扱うデータを超えない程度の API サーバーへのリクエスト（たとえば検索のコンポーネントならサジェストなど）のみを許可すべきでしょう。  
Pages はそのページにおける最大のコンポーネントなので、Organims が扱えない範囲の API サーバーへのリクエストを行い、取得したデータが必要な Organisms に振り分ける役割を持たせます。

#### ストアへのアクセス権限の制約

ストアは基本的にはどこからでもアクセスできるようになっていると思います。
前述しましたがどこからでもアクセス可能だと予期せぬ依存が発生し得ます。

ストアへのアクセスも処理の制約同様に Organisms か Pages で行うべきでしょう。
認証状態などもすべて Organisms から Molecules へ渡します。

Molecules で参照だけは可能にしてもよいかとも考えたのですが最終的には禁止としました。
Molecules は複数箇所で使われる可能性が高いため、グローバルに依存していると予期せぬ同期などが発生しそうだと考えたからです。

#### ソースコードの制約まとめ

| カテゴリ | 処理 | ストアへのアクセス | 備考 |
|:---:|:---:|:---:|:---:|
| Atoms | イベントの伝播のみ | ❌ |  |
| Molecules | イベントの伝播のみ | ❌ |  |
| Organisms | ⭕ | ⭕ | スコープを越えない範囲で |
| Pages | ⭕ | ⭕ | 　 |

これでなんとなく実装できそうな制約ができました。

## 本当にこの分け方 & 制約で大丈夫？

ここでいったん今までのプロジェクトで作ったコンポーネントを思い返して適用できるか考えてみます。
そうするとこの分け方に該当しづらいコンポーネントがありました。
たとえばモーダルやアコーディオンなどの動きだけを提供するコンポーネントです。
一見 Organisms に該当しそうですが、純粋に実装しようとするとそれぞれの動きを持ったコードをコピペすることになってきます。
そうなってはコンポーネント指向であるメリットが薄れます。
そこで Atomic Design の分類の外のカテゴリである「Presenters」を追加すべきという考えに至りました。

### Presenters カテゴリ




Atoms are UI elements that can’t be broken down any further and serve as the elemental building blocks of an interface.
Molecules are collections of atoms that form relatively simple UI components.
Organisms are relatively complex components that form discrete sections of an interface.
Templates place components within a layout and demonstrate the design’s underlying content structure.
Pages apply real content to templates and articulate variations to demonstrate the final UI and test the resilience of the design system.


原子は、それ以上分解することができず、インターフェースの要素ビルディングブロックとして機能するUI要素です。
分子は、比較的単純なUIコンポーネントを形成する原子の集合です。
生物は、インタフェースの個別のセクションを形成する比較的複雑なコンポーネントです。
テンプレートは、レイアウト内にコンポーネントを配置し、デザインの基礎となるコンテンツ構造を実演します。
ページは実際のコンテンツをテンプレートに適用し、バリエーションを明確にして最終的なUIを実演し、デザインシステムの復元力をテストします。


10 reason

You can mix and match components
Creating a style guide is simple
Easy to understand layout
Code is more consistent
No focus on pixel-perfect designs
Quicker prototyping
Easier to update and remove parts of the site
More modular file structure
Fewer components overall
Explore Pattern Lab


