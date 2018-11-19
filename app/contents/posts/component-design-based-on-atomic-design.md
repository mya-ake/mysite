# Atomic Design ベースのコンポーネント設計を考えてみた

@@
コンポーネント設計に悩み Atomic Design を検討した結果 Atomic Design に落ち着いたという話です。Atomic Design の原典を読んだりなどして、自分なりに制約を作りコンポーネント設計として落とし込んだ内容になっています。
@@

==2018-11-11==

## 背景

筆者が個人的に仕事を受けはじめた会社のフロントエンドのプロジェクトを立ち上げることになりました。
そこでせっかく新しく作る機会があるならコンポーネントの分割の仕方（コンポーネント設計）を明確に定義したいと思いました。

そもそもなんで分け方を定義したいとなったかというと、後からメンバーがプロジェクトに入ってきたときに、スムーズにプロジェクトに入ってもらうためです。

今まで作ってきたプロジェクトでのコンポーネントの分け方は、「2,3回使う場合はコンポーネントに分ける」
「長くなって見通しが悪いコンポーネントは分ける」など曖昧なところもありますがシンプルなものでした。
ただこの分け方をするとコンポーネント自体が大きくなりがちでした。  
今のところプロジェクトに関わる人数も少なく、個々のメンバーのレベルも高いため運用できていますが、人が増えた場合や他のメンバーとなった場合は「苦しいのではないか？」という気持ちがあります。

このような背景があり自分の考えをまとめるためにもこの記事を書き始めました。

そして最終的に Atomic Design ベースの設計になりました（合わせてタイトルも Atomic Design になりました）。

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

それぞれを筆者なりに要約しました。
図示が見たい場合はリンク先に飛んでください。

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
この段階で web サイト 1 ページのワイヤーフレームのようになります。
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
| Molecules | Atoms | 2 以上 | - |
| Organisms | Atoms, Molecules, Organisims | いくつでも | - |
| Pages | Organisms | いくつでも | Organisms を組み合わせるだけ |

ただし、これだけの制約では実装するときに困ります。
実装する際にはデータを必ず扱います。
またストアというグローバルなステートを保管している領域も存在します。
これらの扱いが定まっていないと予期せぬ依存が発生してしまい上記制約を満たすこともできなくなる可能性があります。
そのためデータの流れやストアに関する制約も定めておく方が無難そうです。

### データなどソースコードを書く上での制約

#### データフローの制約

基本的にデータは Pages → Organisms → Molecures → Atoms という順になるでしょう。
また逆に子から親へはイベントの伝播によってデータを渡すことになります。
この点に関しては最近の View 層のライブラリやフレームワークですでに制約があると思うのであまり気にする必要はなさそうです。

#### 処理の制約

フローに関してはライブラリ、フレームワークレベルで担保されるので大丈夫ですが、それぞれのカテゴリでどこまで処理を行ってよいかの定義が必要だと考えます。
たとえばどのカテゴリから API サーバーにリクエストを送ってよいか、具体的な処理（たとえばバリデーションなど）を行ってよいかなどです。

Atoms や Molecules はシンプルに保つ必要があるので、ここに具体的な処理を書くのは違うように思えます。
Atoms や Molecules では複数箇所で使われる前提なのでデータの受け付けとイベントの伝播だけに徹するのが無難そうです。
もし Atoms や Molecules で処理したい場合は親から関数をもらうようにしましょう。

そうすると Organisms と Pages で具体的な処理を書くことになります。
ただそれぞれはスコープが異なるのでなんでもしていいかというとそういうわけではないと考えます。
Organisms は特定のセクションになるので、自身が扱わないデータまで扱ってしまうと依存が別の方向にまで広がってしまいます。
そのため Organisms では自身の扱うデータを超えない程度の API サーバーへのリクエスト（たとえば検索のコンポーネントならサジェストなど）のみを許可すべきでしょう。  
Pages はそのページにおける最大のコンポーネントなので、Organims が扱えない範囲の API サーバーへのリクエストを行い、取得したデータを必要とする Organisms に振り分ける役割を持たせます。

#### ストアへのアクセス権限の制約

ストアは基本的にはどこからでもアクセスできるようになっていると思います。
前述しましたがどこからでもアクセス可能だと予期せぬ依存が発生し得ます。

ストアへのアクセスも処理の制約同様に Organisms か Pages で行うべきでしょう。
認証状態などもすべて Organisms から Molecules へ渡します。

Molecules で参照だけは可能にしてもよいかとも考えたのですが最終的には禁止としました。
Molecules は複数箇所で使われる可能性が高いため、グローバルな値に依存していると予期せぬ同期などが発生しそうだと考えたからです。

#### ソースコードの制約まとめ

| カテゴリ | 処理 | ストアへのアクセス | 備考 |
|:---:|:---:|:---:|:---:|
| Atoms | イベントの伝播・親からもらった関数の実行 | ❌ | - |
| Molecules | イベントの伝播・親からもらった関数の実行 | ❌ | - |
| Organisms | ⭕ | ⭕ | スコープを越えない範囲で |
| Pages | ⭕ | ⭕ | - |

これでなんとなく実装できそうな制約ができました。

## 本当にこの分け方 & 制約で大丈夫？

ここでいったん今までのプロジェクトで作ったコンポーネントを思い返して適用できるか考えてみます。
そうするとこの分け方に該当しづらいコンポーネントがありました。
たとえばモーダルやアコーディオンなどの動きだけを提供するコンポーネントです。
一見 Organisms に該当しそうですが、純粋に実装しようとするとそれぞれの動きを持ったコードをそれぞれ実装することになってしまいます。
そうなってはコンポーネント指向であるメリットが薄れます。
そこで Atomic Design の分類の外のカテゴリである「Presenters」を追加すべきという考えに至りました。

### Presenters カテゴリ

Presenters は筆者が新しく定義したカテゴリです。  
Presenters カテゴリは特定の機能を有したコンポーネントのカテゴリです。
アニメーションなどのインタラクションを表現するコンポーネントなどが該当します。

たとえばアコーディオンのコンポーネントは開閉のアニメーションを行う機能を持っています。
このアコーディオンのコンポーネントはコンテンツを子に持つ次のようなラッパーコンポーネントとして使うことを想定します。

```HTML
<my-accordion>
  <p>なんか長めのテキスト</p>
</my-accordion>
```

このような形で特定の機能をコンポーネントとして実装し、他のコンポーネントでも使えるようにするのが Presenters の役割です。

アニメーションなどのインタラクションを Organisms などに実装しようとするとただでさえ複雑になりがちな Organisms がさらに複雑化してしまいます。
そこでそのインタラクション部分を Presenters として切り出すことで、 Organisms は本来の役割だけに集中できるようになります。

*追記*

公開してから Presenters は実装の都合によりコンポーネントとなるコンポーネントが該当するカテゴリという言い方がしっくりきました。
Sketch などのデザインツールで現れないコンポーネントを書くイメージです。

## 制約をどのように担保する？

制約の定義や Presenters カテゴリの追加により形があるものになってきたと思います。
ただし、実装が始まると期日というものもあるため、この制約がないがしろになる可能性もゼロではありません。
レビューをしていたとしても漏れる可能性はあります。
そこで、機械的にチェックするユニットテストをあらかじめ用意してくことで制約を満たしているかの担保ができるのではと考えました。

### ユニットテストによる制約の担保

たとえば、Atoms であればストアへのアクセスがないかのチェックや、コンポーネントが単独でマウントできるか（依存しているコンポーネントがないか）をチェックすることができそうです。
このようなテスト（具体的な実装はまだできていない）を用意することで制約を満たしていこうというアプローチです。

テスト自体は自動で行えればよいのですが、各コンポーネントの Props の定義は必ずどこかでする必要があります。
静的解析をして自動で割り当てるということも可能かもしれません。
ただそこまで用意するモチベーションはないので、まずは各コンポーネントのテストコードをテンプレートから自動生成させようと考えています。

### テンプレートの自動生成

テンプレートの自動生成には [Hygen](https://www.hygen.io) の利用を考えています。
Hygen はスキャフォールディングをテンプレートを基に行うことができるツールです。
npm に公開されているので、npm scripts に生成コマンドを用意して、コンポーネント作成時はこのコマンドから作ります。
そうするとコンポーネントの下地と各カテゴリーに合わせたテストを作成時から用意できるはずです。
また、Storybook 用のファイル生成も同時に行うこともできるでしょう。

具体的なテンプレートはいずれ僕の GitHub に上がると思います。

## Atomic Design ベースの実装方法のまとめ

長くなってきたのでいったん整理します。
実装時のカテゴリは Atomic Design のカテゴリを元に Template を除く 4 つ + Presenters に分ける。
制約は次のとおりです。Presenters の制約もここで追記しておきます。

*Atomic Design の制約*

| カテゴリ | 依存してもいいもの | 依存の数 | 備考 |
|:---:|:---:|:---:|:---:|
| Atoms | なし | 0 | 分割できてはいけない |
| Molecules | Atoms | 2 以上 | - |
| Organisms | Atoms, Molecules, Organisims | いくつでも | - |
| Pages | Organisms | いくつでも | Organisms を組み合わせるだけ |
| Presenters | なし | 0 | 特定の機能の提供のみ |

<br>

*ソースコードの制約*

| カテゴリ | 処理 | ストアへのアクセス | 備考 |
|:---:|:---:|:---:|:---:|
| Atoms | イベントの伝播・親からもらった関数の実行 | ❌ | - |
| Molecules | イベントの伝播・親からもらった関数の実行 | ❌ | - |
| Organisms | ⭕ | ⭕ | スコープを越えない範囲で |
| Pages | ⭕ | ⭕ | - |
| Presenters | ⭕ | ⭕ | スコープを越えない範囲で |


## なんかいけそうな気配がする🙌

なんかいけそうな気配がしてきたので今のところ気になっていることを記述しておきます。

### コンポーネントのローカルステート

ネット上の情報を見ていると Atoms や Molecules はステートレスにするという情報がちらほらありました。
ただ個人的には Atoms も Molecules もローカルステートは持っていいと考えます。
その理由は、 Atoms は HTML タグ同等の役割まで持ちうるからです。
チェックボックスなど HTML タグの中にもローカルステートを持つものもあります。
そう考えると Atoms も Molecules もローカルステートを持っていてもいいでしょう。

また、そもそもコンポーネントの中に閉じているデータなので他に影響を与えることもないというのもあります。
もし他に影響与えるなら何かが間違ってる気がします。

もちろんステートレスにできるならステートレスなコンポーネントとすべきです。
その方がパフォーマンス的にもよくなります。

### コンポーネントの数

Atomic Design をやると大量のコンポーネントが生まれます。
コンポーネントが多くなるとそれだけ生成コストが発生します。
画面に表示されるときだけでなくビルドの時間にも影響するでしょう。
これは許容できるのか？というところです。

これに関してはやってみないとわからないなと考えてます。
ただコンポーネントの数が増えてパフォーマンスが著しく劣化したという例も今のところみかけないので数百程度なら大丈夫なのではとも思います。

### すべてをコンポーネントとすべきか？

これは悩ましいです。
とくにテキスト系のコンポーネントをわざわざ作る必要はあるのかという点です。
テキスト系は CSS のクラス 1 つで表現しようと思えばできるでしょう。

ただ例外を作るとそれだけ管理が煩雑になりうるので、管理面というところで CSS だけで完結しそうでもコンポーネントにすべきな気がします。

### Atomic Design で作られていないデザインを Atomic Desing ベースで実装して大丈夫か？

結論としては、まあ大丈夫では？というところです。
というのもデザインの差は Molecules や Organisims で吸収できるので、どんなデザインでも適応は可能であると思います。
ただコンポーネント数が大爆発する可能性は大いにあります。
それが許容できるならという感じでしょうか。

できるならデザインを作る段階から Atomic Design を意識しておく必要があると思います。

## まとめ

なんか Atomic Design ベースで実装できそうな気がします。
というかここから先は実際に手を動かしてみないとよくわからないです。
仕事先にはこの記事見せてご意見伺って許可がもらえたら実際にこの方法で構築してみようと思います。

やってみての感想とかは随時 Twitter でつぶやくと思います。
最終的な感想はまた改めて記事書くかもしれません（書きたい気持ちはある）。

## おまけ

### Nuxt.js にこのコンポーネント設計を導入する

筆者はよく Nuxt.js をベースに作ります。
Nuxt.js は最初から Layouts と Pages というコンポーネントの分割に制約があります。
Layouts はページのコンテンツ以外の部分、たとえばグローバルなヘッダーやフッターなどが置かれます。
Pages は Layouts の中に入るコンテンツのコンポーネントです。

Pages が Atomic Design の Pages と Nuxt.js の Pages で名前が被っているのでとてもややこしいですね。
なので Nuxt.js で導入する場合は（Atomic Design の）Pages の上に Layouts という概念を新たに置いておくべきだと思います。
（Nuxt.js の）Pages を Atomic Design の Organisms 相当に置いてもいいのですが、まあ名前がややこしいです。
あとディレクトリ構成的にも他と同じ Organisms として扱えないのでなんとも言えない気持ちになってしまいます。
そういう理由から Layouts を増やします。

Layouts は子に（Atomic Designの）Pages や Organisms を持ちます。
それ以外の制約は（Atomic Designの）Pages と同じで問題ないでしょう。

| Atomic Designベースのカテゴリ | Nuxt.js のディレクトリ |
|:---|:---|
| Atoms | /components/atoms/* |
| Molecules | /components/molecules/* |
| Organisms | /components/organisms/* |
| Presenters | /components/presenters/* |
| Pages | /pages/* |
| Layouts | /layouts/* |