# Nuxt.js on AWS Lambda with Serverless Framework

@@
Vue.js のユニバーサルアプリケーションを作るためのフレームワークである Nuxt.js を AWS Lambda で動かす方法について書かれている記事です。
@@

==2017-12-12,2019-04-18==

## この記事について

この記事は[Vue.js #2 Advent Calendar 2017 - Qiita](https://qiita.com/advent-calendar/2017/vue2)の 12 日目の記事です。

この記事では [Nuxt.js](https://nuxtjs.org/)（v2.6.2）を [AWS Lambda](https://aws.amazon.com/jp/lambda/) で動かす方法について書いています。
Nuxt.js に関する説明もありますが、全体的にサーバー構築寄りの内容になっています。  
しかし、Node.js で AWS にデプロイまでできる [Serverless Framework](https://serverless.com/) というツールを利用しており、[サンプルコード](https://github.com/mya-ake/nuxt-on-lambda) の npm scripts を実行するだけで AWS 上に環境を作れるようにしています。（AWS への登録と Credential の生成は必要です）
ご興味のある方はそちらも参照してみてください。

また、先に断っておくとこの記事では API Gateway をエンドポイントとします。
API Gateway をエンドポイントする理由は待ち時間が少なく手軽に動作確認ができるからです。
（一応サンプルコードはカスタムドメインにも対応しています）

今回は上に挙げた登場人物?たちについて簡単に説明し、なぜ SSR するのか、なぜ Lambda なのかという話もして、AWS の構成や動かすための実装コードの説明していくという盛りだくさんな内容になっています。

※この記事ではパッケージマネージャーに [yarn](https://yarnpkg.com/ja/) を使っていますが、
npm でも問題はないはずです。（すいません、npm は試してないです。

### 注意事項 Nuxt.js のバージョンについて

~~この記事で扱っている Nuxt.js のバージョンは **v1.0.0-rc11** です。
2018/01/09 にリリースされた v1.0.0 には対応していません。
理由は v1.0.0 は Node.js のバージョンが v8.0.0 以上を対象としており、AWS Lambda のランタイムに存在しないバージョンだからです。  
早く AWS Lambda に Node.js v8.x が追加されることを心待ちにしています。~~

###### 2018/05/12 追記

AWS Lambda に Node.js v8.10 が入ったので、更新して再び使えるようにしました！

###### 2018/11/19 追記

Nuxt.js v2.3.1 対応した記事に更新しました！

###### 2019/04/18 追記

Nuxt.js v2.6.2 対応した記事に更新しました！
また[Nuxt.js を Lambda で動かす際の理想の話](#Nuxt.js_を_Lambda_で動かす際の理想の話)の話を同人誌として出してました。BOOTH にて販売しているのでご興味ある方はそちらをご参照ください。

主な内容はデプロイに関してです。Lambda にデプロイしつつ、S3 に静的リソースをデプロイして、CloudFront で配信するというものです。
本番運用に関する tips も載ってるので、気になるものがありましたらご購入いただけると嬉しいです。

BOOTHの販売ページ：[https://neko-note-help.booth.pm/items/1317543](https://neko-note-help.booth.pm/items/1317543)

### 対象読者

- Vue.js の SSR（サーバーサイドレンダリング）に興味がある方
- Nuxt.js をどういうサーバーで稼働させようか考えている方
- AWS Lambda を検討している方

### 登場人物?たち

- Nuxt.js
- AWS Lambda
- Serverless Framework

### サンプルコード

- [GitHub](https://github.com/mya-ake/nuxt-on-lambda)

### アウトライン

- [Nuxt.js](#Nuxt.js)
- [AWS Lambda](#AWS_Lambda)
- [Serverless Framework](#Serverless_Framework)
- [なぜ SSR？ なぜ Lambda？](#なぜ_SSR？なぜ_Lambda？)
- [サーバー構成やフォルダ構成](#サーバー構成やフォルダ構成)
  - [サーバー構成](#サーバー構成)
  - [フォルダ構成](#フォルダ構成)
- [実装コードの説明](#実装コードの説明)
  - [フロントエンド側 - Nuxt.js](#フロントエンド側_-_Nuxt.js)
  - [サーバー側 - Lambda](#サーバー側_-_Lambda)
- [まとめ](#まとめ)
- [参考記事集](#参考記事集)
- [補足](#補足)
  - [Nuxt.js を Lambda で動かす際の理想の話](#Nuxt.js_を_Lambda_で動かす際の理想の話)
  - [なぜ Lambda のデプロイパッケージを小さくするのか？](#なぜ_Lambda_のデプロイパッケージを小さくするのか？)
  - [サンプルコードのデプロイコマンド](#サンプルコードのデプロイコマンド)

[ad-content-1]

## Nuxt.js

Nuxt.js は 冒頭でも書いたとおり Vue.js のユニバーサルアプリケーションを作ることができるフレームワークです。
~~2017 年 12 月 12 日現在はまだバージョン 1 がリリースされていませんが、現時点でも十分に扱える状態にあると思います。
筆者自信もプロダクション環境で稼働させる準備を進めています。~~
筆者自身もプロダクション環境で稼働させて 1 年ぐらい経ちました。

その Nuxt.js の特徴を挙げると次のような感じです。

- SSR サポート
- 整った開発環境
  - Babel
  - ローカルサーバー（ホットリロード有り）
- 静的サイトジェネレーター

とりあえずすごく便利です。
開発を始めるまでのハードルがすごく低くなっています。
~~また、公式が用意している[スターターテンプレート](https://github.com/nuxt-community/starter-template)を使うことで ESLint の設定まで含まれた状態で始めることもできます。~~
また、Nuxt.js 公式で出している [create-nuxt-app](https://github.com/nuxt/create-nuxt-app) を使うことで、さまざまな環境を自動で生成してくれます。
たとえば、UI フレームワークの [element-ui](https://element.eleme.io/) や [Vuetify](https://vuetifyjs.com/) などの環境をセットアップした状態で始めることもできます。

このサイト自体も Nuxt.js を利用して制作しています。
まだ開発途中で前に作ったサイトと同居状態なのですが、Nuxt.js の静的サイトジェネレーターの機能を使い、このページだけ独立した HTML として出力させてサーバーに置いています。

今回の主題は Nuxt.js ではないので、紹介はこの程度に留めます。
Nuxt.js についてさらに知りたい方は [potato4d](https://twitter.com/potato4d)さんの[Nuxt.js ビギナーズガイド―Vue.js ベースのフレームワークによるシングルページアプリケーション開発](https://www.amazon.co.jp/dp/4863542569)に詳しく書かれているので、そちらをご参照いただくことをオススメします。筆者もレビュワーとしてお手伝いさせていただきました。

## AWS Lambda

AWS Lambda はサーバーレスと言われる分野で使われている代表的なサービスです。
使った分だけ課金される AWS のコンピューティングサービスです。FaaS (Function as a Service) とも呼ばれたりします。
コードをアップするだけで稼働し、スケーリングも自動で行われるので、サーバーの管理を煩わしく思うような人にオススメです。

Node.js や Python、Java などさまざまな ランタイムがあり、自分のやりやすい言語を選択して利用できます。
~~最近ラスベガスで行われた AWS re:Invent 2017 では、Go 言語 と .NET Core が使えるようになると発表があり今後も使える言語は増えることが予想されます。~~ Go 言語 と .NET Core はすでに使えます。  
今回は Nuxt.js を動かしたいのでランタイムは Node.js（v8.10）を使います。

## Serverless Framework

Serverless Framework は AWS Lambda へのデプロイを手軽に行えるようにしてくれるツールです。
Node.js の環境があれば動かすことができるので、Nuxt.js を使う環境であればすぐに導入できると思います。
また、コードベース（yml ファイル）で設定を管理できるので、同じ環境を作るのも手軽にできます。
今回の設定などは [GitHub](https://github.com/mya-ake/nuxt-on-lambda)に置いているので、ほぼそのまま使うことができると思います。

## なぜ SSR？なぜ Lambda？

なぜ SSR するか、なぜ Lambda を使うかという話は、[Serverless Meetup Fukuoka #1](https://serverless.connpass.com/event/62473/)というイベントで『[AWS Lambda で SSR やってみた Vue.js 編](https://mya-ake.com/slides/vuejs-ssr-on-lambda)』という LT をしてきたので、そちらをご覧いただけると幸いです。

ざっくりなぜ SSR するかをまとめると

- Googlebot に正しくサイトを認識してもらうため
- ファーストビューの速度改善
- OGP への対応

ざっくりなぜ Lambda を使うかをまとめると

- １リクエストで１ Lambda が動くので、突発的なアクセスなどに強い
- サーバーの管理をあまりしたくない
- 安い

以上のような理由です。
筆者の場合はサーバーも自分で用意したりするので、管理を AWS に任せられるので重宝しています。

## サーバー構成やフォルダー構成

### サーバー構成

今回はこのような構成で作成します。
Lambda で Nuxt.js を動かし、API Gateway 経由で公開します。

![API Gateway 経由で Lambda にアクセスしている図](/images/nuxtjs-on-aws-lambda/api_gw_architecture.svg)

AWS の設定などは面倒なので、Serverless Framework でやってしまいます。
サンプルコードでは次のコマンドで AWS 側の設定まで含んだデプロイが完了するようになっています。

```
$ yarn deploy:api_gw
```

※`serverless.yml` というファイルが Serverless Framework の設定ファイルになっています。
そのファイルで Credential の設定も行っていますので、ご自身の環境に合わせていただく必要はあります。  
`serverless.yml` にもコメントを残しているので、そちらも合わせてご参照ください。

### フォルダ構成

大まかに次のようになっています。

```
project_root/           # プロジェクトのルートフォルダ
  ├ app/                   # フロントエンド側のソースフォルダ（Nuxt.js）
  ├ configs/             # 環境変数などを入れるフォルダ
  ├ server/               # サーバー側のソースフォルダ（Lambda）
  ├ nuxt.config.js     # Nuxt.js の設定ファイル
  ├ package.json      # npmの設定ファイル
  ├ serverless.yml    # Serverless Framework の設定ファイル
  └ yarn.lock            # npmモジュールのバージョン管理ファイル
```

メインのアプリケーションとなる Nuxt.js のフォルダーは app フォルダーにまとめています。
まとめておくことでデプロイのパッケージから除外しやすくなるので、app フォルダーや src フォルダーなどにまとめておくことをオススメします。

## 実装コードの説明

実装コードについては２つに分けて説明していこうと思います。
１つはフロントエンド側（Nuxt.js）、もう１つは SSR するためのサーバー側（Node.js）です。  
※同人誌版対応でサンプルコードのリポジトリの一部コードに変更がありますが、最低限の内容はこの記事の書かれている内容になります。

### フロントエンド側 - Nuxt.js

今回は create nuxt app の express 版をベースに利用しています。
ほぼそのまま利用しており `nuxt.config.js` のみ変更を加えています。

変更した点は３つあり、それぞれ以下のような感じです。

1. srcDir の設定
2. Base URL の設定（base タグ設定）
3. gzip の無効化

1.はアプリケーションのコードを１つのフォルダーにまとめる目的です。 2.、3.は API Gateway で公開する上で必要になってきます。
それぞれについてもう少し深掘っていきます。

#### 1. srcDir の設定

srcDir を設定することで１つのフォルダーにまとめることができ、デプロイがやりやすくなります。
また、今回はサーバー側のコードもプロジェクトのフォルダーに存在しているため、明確に分けるという目的もあります。  
app フォルダーにまとめる設定は簡単で、`nuxt.config.js`に`srcDir`プロパティを設定するだけでできます。

```JavaScript
module.exports = {
  // 略
  srcDir: 'app/',
  // 略
}
```

srcDir について: [API: srcDir プロパティ - Nuxt.js](https://ja.nuxtjs.org/api/configuration-srcdir)

※サーバーで稼働させる時はビルド後のコードを利用するため、自分たちで書いたコードをサーバーにデプロイする必要はありません。

#### 2. Base URL の設定（base タグ設定）

2.に関してですが、Base URL を設定しないと JS などのリソースが取得できなくなってしまいます。
その原因は API Gateway で生成される URL と Nuxt.js のリソースのパスの出力の仕方にあります。

API Gateway で公開すると URL は次のようになります。

```
https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev/
```

末尾についている`/dev/`のところは API Gateway のステージが入ります。
このステージのパスは省略ができません。
そのため、１階層下がる前提で考える必要があります。  
Nuxt.js では JS などのリソースのパスはルートパス（`/assets/app.js`のような書き方）で出力されます。
このままだと`https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/assets/app.js`を参照してしまいリソースを取得できません。
これを解消するには Base URL を設定してあげる必要があります。  
Base URL を設定すると head タグに

```HTML
<base href="/dev/">
```

が追加されます。
これが追加されると JS のパスがルートパスで指定されていたとしても`https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev/assets/app.js`を参照するようになります。  
この Base URL の設定は、router プロパティで行えます。

```JavaScript
module.exports = {
  // 略
  router: {
    base: '/dev/'
  },
  // 略
```

base について: [API: router プロパティ - Nuxt.js](https://ja.nuxtjs.org/api/configuration-router#base)

※サンプルコードの方では Base URL の設定が不要な環境では base を設定しないようなコードになっています。

#### 3. gzip の無効化

※ gzip に関しての対応は不要な場合もあるようです。
筆者の環境では Nuxt.js のバージョンに関わらず gzip がかかっていると表示されません。
ただ CloudFront を使っている場合などは CloudFront で gzip をかけられるため、Nuxt.js の gzip の機能を使う必要はないでしょう。

Nuxt.js はデフォルトで gzip の機能が備わっています。
ありがたい機能ではあるのですが、このままだとブラウザで表示できなくなってしまいます。（Chrome では白い画面、 Firefox では Content-Encoding に問題があると表示されます）
細かいところまで調べきれていないのですが、恐らく API Gateway にも gzip の機能が備わっているようです。
そのため、2 重に gzip がかかった状態になってしまい、ブラウザがデコードできないのだと推測されます。

というわけで、 Nuxt.js の gzip を無効化します。
Nuxt.js のドキュメント（[API: The render プロパティ - Nuxt.js](https://ja.nuxtjs.org/api/configuration-render/#compressor)）を見てみると独自のミドルウェアを定義できるようです。  
ただ具体的には書いてないので、Nuxt.js のコードを覗いてみると関数を設定させると独自のミドルウェアを定義できるみたいです。（[コードはこちら](https://github.com/nuxt/nuxt.js/blob/68523b95bc1bc663c96f30b28425f2e4cee29c7c/packages/server/src/server.js#L71)）

gzip の無効化は render プロパティで設定できます。

```JavaScript
module.exports = {
  // 略
  render: {
    // ドキュメントでは object になってるが関数を定義すると独自のミドルウェアに置き換わる
    compressor: (req, res, next) => {
      // なにもしなければ圧縮はされない
      next()
    }
  },
  // 略
```

以上がフロントエンド側のコードです。（設定を数行加えただけ）

### サーバー側 - Lambda

サーバー側は Nuxt.js を Lambda で動作させるために [Express](http://expressjs.com/ja/) を用います。
なぜ Express かというと、 AWS Labs が Express を Lambda で動かすためのライブラリ [aws-serverless-express](https://github.com/awslabs/aws-serverless-express)を提供しているからです。

コードの説明に入っていく前に、Lambda でのコードの実行に関しての説明を少しだけしておきます。
Lambda はイベントがトリガーとなり実行される仕組みになっています。
そのため、Lambda のコードはハンドラーを用意するような形になります。  
筆者が Lambda のコードを書く場合は、ハンドラーとメインの処理が書かれたコードを分けるようにしています。
分ける理由はローカルでメインの処理だけローカルで実行して動作確認をしたり、テストをやりやすくするためです。
今回も同様にハンドラーである`hander.js`とメインの処理である`app.js`に分けて記述しています。
それぞれについて書いていきます。

#### hander.js - ハンドラー

ハンドラーの方は短いです。
ハンドラー関数を定義して、aws-serverless-express の proxy 関数にハンドラー関数の引数を渡しているだけです。

```JavaScript
'use strict'

const awsServerlessExpress = require('aws-serverless-express')
const { app } = require('./app')  // Express のインスタンス

const server = awsServerlessExpress.createServer(app)

module.exports.handler = (event, context, callback) => {
  awsServerlessExpress.proxy(server, event, context)
}
```

#### app.js - メインの処理

app.js では Express のインスタンスを生成しています。
Nuxt.js を Express で動かす場合は`nuxt.render`を使います。
[API: nuxt.render(req, res) - Nuxt.js](https://nuxtjs.org/api/nuxt-render)

本来であれば Express のインスタンスに`nuxt.render`を登録するだけでよいですが、Base URL の関係で、リクエストのパスを変えてあげる必要があります。
変えなければならない理由もまた、API Gateway です。
API Gateway から Lambda に値が渡るときにステージのパスである`/dev/`が渡ってきません。
そのため`nuxt.render`関数にに渡る前に`/dev/`を付加してあげる必要があります。

※`/dev/`が入っている`BASE_URL`は環境変数として定義していて、`process.env`から取得させています。  
※環境変数は`serverless.yml`で設定しています。

###### 2018/11/19 追記

更新前の記事では app.js にすべてを書いていましたが、Nuxt.js v2.x 対応するときに細かく Express のミドルウェアに分けました。
また、ローカルでの開発時も Express のサーバーが立ち上がるようにも変更を加えました。

server フォルダーの構成は次のようになります。

```
server/
  ├ core/
  │  └ nuxt.js                   # Nuxt.js のインスタンス生成や開発と本番の動作を切り替える処理
  ├ middlewares/              # Express のミドルウェアのフォルダー
  │  ├ env-middleware.js        # Base URL の設定を行うミドルウェア
  │  ├ header-middleware.js   # デフォルトのヘッダーをカスタマイズするミドルウェア
  │  └ logger-middleware.js   # アクセスログを出力するミドルウェア
  ├ app.js            # サーバー側のメイン
  ├ handler.js      # AWS Lambda のハンドラー
  └ local.js          # ローカル起動用のコード
```

Express のミドルウェアは登録した順に処理を実行し、次のミドルウェアに渡していくような役割を持っています。
今回は 1 つのミドルウェアに 1 つの役割を持たせて処理を分割しました。
中身に関してはそれぞれ大したことはしていないので[サンプルコード](https://github.com/mya-ake/nuxt-on-lambda/tree/master/server)の方をご覧ください。

###### 2019/04/18 追記

Nuxt.js v2.5（多分）から nuxt のインスタンスの ready メソッドを呼ぶ必要があるようです。

このコードから

```js
app.use(nuxt.render);
```

このコードに更新しました。

```js
app.use(async (req, res, next) => {
  await nuxt.ready();
  nuxt.render(req, res, next);
});
```

以上がサーバー側のコードです。

## まとめ

盛りなだくさんになってしまいました。
全体を通して API Gateway が問題児に見えてしまっているかもしれません。
まあそれはそうで、API Gateway は名前の通り API を提供することが目的であり、web サーバーとして使うことに特化しているわけではありません。
色々めんどうな手間も仕方ないことだと割り切りましょう。

しかし、カスタムドメインを使うことでめんどうな手間もほぼ解消できます。
基本的にめんどうな手間となっていたのは、Base URL が必要だからでした。  
Nuxt.js を Lambda で動かす上で API Gateway を経由する必要はありますが、API Gateway でもカスタムドメインを設定できますし、CloudFront を API Gateway の前に置くことでカスタムドメインを設定することもできます。
（個人的なオススメは CloudFront です。この話は[理想の話](#Nuxt.js_を_Lambda_で動かす際の理想の話)として補足に書いています）  
一応サンプルではカスタムドメインを使用することも考慮して、次のコマンドを用意しています。

```
$ yarn deploy
```

このコマンドでデプロイした場合は Base URL が設定されなくなります。
カスタムドメインを設定する前提の場合はこちらのコマンドを利用してください。

###### 2019/04/18 追記

この`yarn deploy`のコマンドは[理想の話](#Nuxt.js_を_Lambda_で動かす際の理想の話)のデプロイができるようなコマンドに更新されました。
カスタムドメインを使う場合は理想の話の構成を参考にされてください。

今回はここでいったん終わりにします。
明日は[sunecosuri](https://qiita.com/sunecosuri)さんです。
~~公開されたら、この辺りにリンクを貼っておきます~~  
[パンくずコンポーネントと範囲選択するコンポーネントについて - Qiita](https://qiita.com/sunecosuri/items/97be9ddba332726e4fa3)  
クリック時に範囲選択するコンポーネントは便利だなと思いました。
このサイトでのコードのコピーとかに応用できたらなと思います。

下に補足として、色々書いてるのでよかったら見てください。

## 参考記事集

- [Nuxt.js - Universal Vue.js Applications](https://nuxtjs.org/)
- [AWS Lambda (サーバーレスでコードを実行・自動管理) | AWS](https://aws.amazon.com/jp/lambda/)
- [Vue.js 製フレームワーク Nuxt.js ではじめる Universal アプリケーション開発 | HTML5Experts.jp](https://html5experts.jp/potato4d/24346/)
- [AWS Lambda で SSR やってみた Vue.js 編](https://mya-ake.com/slides/vuejs-ssr-on-lambda)

[ad-content-2]

## 補足

ここからは補足的な内容になってます。

### Nuxt.js on AWS Lambda の運用の話（2018/11/19 追記）

筆者が Nuxt.js を AWS Lambda で運用し始めて 1 年近くたったので、運用のノウハウを追記しておきます。
といってもノウハウはほぼありません。笑  
稼働させてから今日まで Nuxt.js のバージョンアップ以外で AWS Lambda に関連するコードの変更は行っていません。
サーバーレスのメリットを存分に受けていると言えそうです。

ただメリットだけということもありません。
Lambda はたまにとても起動が遅いこともあります。
Lambda の実行を監視していると極稀にですがレスポンスを返すのに数十秒かかるケースがあるようです。
こればっかりはどうしようもないので素直に、CloudFront の Error Pages でタイムアウト時は静的ページを返すようにしておくのがベストだと思います。

監視についてですが、[Datadog](https://www.datadoghq.com) がオススメです。
トライアル期間しか使っていなかったのですが、実行時間や実行回数などのデータが連携するだけで可視化されるようになったのでとても便利でした。  
また AWS 内のサービスでいくと [AWS X-Ray](https://aws.amazon.com/jp/xray/) を利用することもできると思います。
まだ筆者は利用を始めていませんが、時間があるときのタスクに積んでいます。

次に Lambda のメモリについてです。
Lambda のメモリは可動するサーバーにも影響します。
高ければ高いほどスペックの良いサーバーで稼働します。
ここは色々試してみてサービスに最適なところを探すのがよいでしょう。  
基本的には本番稼働する際は API Gateway の前段に CloudFront を置いていると思います。
ほとんどのユーザーは CloudFront のキャッシュを参照することになるので、低めに設定しておいてもけっこうなんとかなります。
ちなみに筆者が携わっている[プロダクションのサービス](https://tsuriba.camera/)では 512 MB で稼働させています。

最後にキャッシュのお話です。
キャッシュは運用を間違えると情報漏えいに繋がり兼ねないので設定は慎重に行うべきです。
筆者は Express のミドルウェアに Cache Control を設定するものを追加しています。
簡単にですが次のようなものです。
これは `https://example.com/my/xxx` のように `/my` 以下を CloudFront でキャッシュさせてないような設定になります（`/my` 以下はユーザーの設定ページなど）。

```JavaScript
const isMyPage = url => {
  return /^\/my/.test(url)
}

const cacheMiddleware = (req, res, next) => {
  if (isMyPage(req.url)) {
    res.header('Cache-Control', 'no-store')
  } else {
    res.header('Cache-Control', `max-age=${60}`) // 1分間
  }
  next()
}

module.exports = {
  cacheMiddleware
}
```

他にもなにかノウハウ的なものが見つかれば追記していこうと思います。

### Nuxt.js を Lambda で動かす際の理想の話

先に全体像となる構成図から。

![CloudFrontで分岐し、リソースはS3、HTMLはAPI Gatewayから取得する構成図](/images/nuxtjs-on-aws-lambda/ideal_architecture.svg)

AWS のサービスのそれぞれの役割は次のようになってます。

- CloudFront
  - キャッシュ
  - リクエストの分岐
- S3
  - 静的リソースの配信
- API Gateway
  - Lambda のトリガー
- Lambda
  - サーバーサイドレンダリング

このように分けている理由は

- Lambda のコンピューティングリソースの最適化
  - JS のリクエストなどは Lambda がファイルを選択して返すだけなので、Lambda を使うまでもない（ムダなコストカット）
- API Gateway から画像を配信する場合はめんどう
  - バイナリデータを扱う場合は個別に設定してあげる必要がある（サンプルでは設定してません）
  - ファビコンが表示されないと思います
- API Gateway のキャッシュ機能は高い
  - なぜか時間単位で課金されてしまう

このような理由から上記のような構成図になります。  
実際に実務でのプロジェクトでは上記のような構成になっています。

###### 2019/04/18 追記

冒頭にも書きましたが、この話を同人誌として出してました。BOOTH にて販売しているのでご興味ある方はそちらをご参照ください。

主な内容はデプロイと AWS の設定に関してです。
本番運用に関する tips も載ってるので、気になるものがありましたらご購入いただけると嬉しいです。

BOOTHの販売ページ：[https://neko-note-help.booth.pm/items/1317543](https://neko-note-help.booth.pm/items/1317543)

### なぜ Lambda のデプロイパッケージを小さくするのか？

これに関しては Lambda の制限が関連してきます。
[AWS Lambda の制限 - AWS Lambda](http://docs.aws.amazon.com/ja_jp/lambda/latest/dg/limits.html)の
「AWS Lambda デプロイメントの制限」に書かれているのですが、Lambda 関数デプロイパッケージのサイズ (圧縮 .zip/.jar ファイル)は*50MB*となっています。
今回のサンプルのコードでも 20MB 以上あります。
また、リージョンあたりの、アップロードできるすべてのデプロイパッケージの合計サイズも 75GB と制限があります。
けっこう大きい数字に思えるかもしれませんが、Lambda をメインに使うようなマイクロサービスを構成していると割りとすぐに到達してしまうと考えられます。
そのため、可能な限り小さくしておいた方が後々のためになります。

### サンプルコードのデプロイコマンド

サンプルコードでは次のコマンドで API Gateway をエンドポイントとしたデプロイが行えます。

```
$ yarn deploy:api_gw
```

正常に処理が完了すれば次のように生成されたエンドポイントが表示されると思います。（そこそこ時間がかかります）

```
Service Information
service: nuxt-on-lambda
stage: dev
region: ap-northeast-1
stack: nuxt-on-lambda-dev
api keys:
  None
endpoints:
  GET - https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev/
  GET - https://xxxxxxxxxx.execute-api.ap-northeast-1.amazonaws.com/dev/{proxy+}
functions:
  handler: nuxt-on-lambda-dev-handler
```

また、カスタムドメインを使用する場合は次のコマンドでデプロイできます。

```
$ yarn deploy
```
