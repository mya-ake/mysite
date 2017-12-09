# Nuxt.js on AWS Lambda

@@
Vue.jsのユニバーサルアプリケーションを作るためのフレームワークであるNuxt.jsをAWS Lambdaで動かす方法について書かれている記事です。
@@

==2017-12-12==

## この記事について

この記事は[Vue.js #2 Advent Calendar 2017 - Qiita](https://qiita.com/advent-calendar/2017/vue2)の12日目の記事です。

この記事では [Nuxt.js](https://nuxtjs.org/) を [AWS Lambda](https://aws.amazon.com/jp/lambda/) で動かす方法について書いています。
Nuxt.js に関する説明もありますが、全体的にサーバー構築寄りの内容になっています。  
しかし、Node.js で AWS にデプロイまでできる [Serverless Framework](https://serverless.com/) というツールを利用していますので、AWS を使ったことがない方でも、[サンプルコード](https://github.com/mya-ake/nuxt-on-lambda)をそのまま利用することで AWS 上に環境を作れるようにしています。（AWS への登録と Credential の生成は必要ですが......）
ご興味のある方はそちらも参照してみてください。


今回は上に挙げた登場人物?たちについて簡単に説明し、なぜ SSR するのか、なぜ Lambda なのかという話もして、構成や動かすための実装コードの説明していくという盛り沢山な内容になっています。

※この記事ではパッケージマネージャーに [yarn](https://yarnpkg.com/ja/)を使っていますが、
npmでも問題はないはずです。（すいません、npmは試してないです。

### 対象読者

* Vue.js のSSR（サーバーサイドレンダリング）に興味がある方
* Nuxt.js をどういうサーバーで稼働させようか考えている方
* AWS Lambdaでやろうとして上手くいかなかった方

### 登場人物?たち

* Nuxt.js
* AWS Lambda
* Serverless Framework

### アウトライン

* [Nuxt.js](#Nuxt.js)
* [AWS Lambda](#AWS_Lambda)
* [Serverless Framework](#Serverless_Framework)
* [なぜSSR？なぜLambda？](#なぜSSR？なぜLambda？)
* [サーバー構成](#サーバー構成)
* [実装コードの説明](#実装コードの説明)
* [まとめ](#まとめ)
* [参考記事集](#参考記事集)


## Nuxt.js

Nuxt.js は 冒頭でも書いたとおり Vue.js のユニバーサルアプリケーションを作ることができるフレームワークです。
2017年12月12日現在はまだバージョン1がリリースされていませんが、現時点でも十分に扱える状態にあると思います。
筆者自信もプロダクション環境で稼働させる準備を進めています。

その Nuxt.js の特徴を挙げると下記のような感じです。

* SSRサポート
* 整った開発環境
  * Babel
  * ローカルサーバー（ホットリロード有り）
* 静的サイトジェネレーター

とりあえずすごく便利です。
開発を始めるまでのハードルがすごく低くなっています。
また、公式が用意している[スターターテンプレート](https://github.com/nuxt-community/starter-template)を使うことで ESLint の設定まで含まれた状態で始めることもできます。

このサイト自体も Nuxt.js を利用して制作しています。
まだ開発途中で前に作ったサイトと同居状態なのですが、Nuxt.js の静的サイトジェネレーターの機能を使い、このページだけ独立したHTMLとして出力させてサーバーに置いています。

今回は主題は Nuxt.js ではないので紹介はこの程度に留めます。
Nuxt.js についてさらに知りたい方は [potato4d](https://twitter.com/potato4d)さんの[Vue.js製フレームワークNuxt.jsではじめるUniversalアプリケーション開発 | HTML5Experts.jp](https://html5experts.jp/potato4d/24346/)に詳しく書かれているので、そちらをご参照いただくことをオススメします。

## AWS Lambda

AWS Lambda はサーバーレスと言われる分野で使われている代表的なサービスです。
使った分だけ課金される AWS のコンピューティングサービスです。FaaS (Function as a Service) とも呼ばれたりします。
コードをアップするだけで稼働し、スケーリングも自動で行われるので、サーバーの管理を煩わしく思うような人におすすめです。

Node.js や Python、Java など様々な ランタイムがあり、自分のやりやすい言語を選択して利用できます。最近ラスベガスで行われた AWS re:Invent 2017 では、Go言語 と .NET Core が使えるようになると発表があり、今後も使える言語は増えることが予想されます。  
今回は Nuxt.js を動かしたいのでランタイムは Node.js を使います。


## Serverless Framework

Serverless Framework は AWS Lambda へのデプロイを手軽に行えるようにしてくれるツールです。
Node.js の環境があれば動くので、Nuxt.js を使う環境であればすぐに導入できると思います。
また、コードベースで設定を管理できるので、同じ環境を作るのも手軽にできます。
今回の設定などは [GitHub](https://github.com/mya-ake/nuxt-on-lambda)に置いているので、ほぼそのまま使うことができると思います。

## なぜSSR？なぜLambda？

なぜSSRするか、なぜLambdaを使うかという話は、[Serverless Meetup Fukuoka #1](https://serverless.connpass.com/event/62473/)というイベントで[AWS LambdaでSSRやってみた Vue.js編](https://mya-ake.com/slides/vuejs-ssr-on-lambda)というLTをしてきたので、そちらをご覧いただけると幸いです。

ざっくりなぜSSRするかをまとめると

* Googlebotに正しくサイトを認識してもらうため
* ファーストビューの速度改善
* OGPへの対応

ざっくりなぜLambdaを使うかをまとめると

* 1リクエストで1Lambdaが動くので、突発的なアクセスなどに強い
* サーバーの管理をあまりしたくない
* 安い

以上のような理由です。
著者の場合はサーバーも自分で用意したりするので、管理を AWS に任せられるので重宝しています。

## サーバー構成やフォルダ構成

### サーバー構成

今回はこのような構成で作成します。
Lambda で Nuxt.js を動かし、API Gateway 経由で公開します。

![API Gateway 経由で Lambda にアクセスしている図](/images/nuxtjs-on-aws-lambda/api_gw_architecture.svg)

AWS の設定などは面倒なので、Serverless Framework でやってしまいます。
サンプルコードでは下記コマンドでデプロイまで完了するようになっています。

```
$ yarn deploy:api_gw
```

※`serverless.yml` というファイルが Serverless Framework の設定ファイルになっています。
そのファイルで Credential の設定も行っていますので、ご自身の環境に合わせていただく必要はあります。  
`serverless.yml` にもコメントを残しているので、そちらも合わせてご参照ください。

### フォルダ構成

大まかに下記のようになっています。

```
project_root/           # プロジェクトのルートフォルダ
  ├ app/                   # Nuxt.js のソースフォルダ
  ├ configs/             # 環境変数などを入れるフォルダ
  ├ server/               # Lambda で実行させるコードを入れるフォルダ
  ├ nuxt.config.js     # Nuxt.js の設定ファイル
  ├ package.json      # npmの設定ファイル
  ├ serverless.yml    # Serverless Framework の設定ファイル
  └ yarn.lock              # npmモジュールのバージョン管理ファイル
```

メインのアプリケーションとなる Nuxt.js のフォルダはデプロイの対象を設定しやすいように、srcDir を app に指定しています。

## 実装コードの説明

実装コードについては２つに分けて説明していこうと思います。
１つはフロントエンド側（Nuxt.js）、もう１つは SSR するためのバックエンド側（Node.js）です。

### フロントエンド側 - Nuxt.js

今回は Nuxt.js のスターターテンプレートをベースに利用しています。
ほぼそのまま利用しており、`nuxt.config.js`のみ変更を加えています。

### バックエンド側 - Node.js

```JavaScript
'use strict'

const { Nuxt } = require('nuxt')
const express = require('express')
const config = require('./../nuxt.config.js')

const app = express()

const setHeaders = (req, res, next) => {
  res.removeHeader('x-powered-by')
  res.header('no-cache', 'Set-Cookie')
  res.header('x-xss-protection', '1; mode=block')
  res.header('x-frame-options', 'DENY')
  res.header('x-content-type-options', 'nosniff')
  res.header('Cache-Control', 'max-age=120')
  next()
}

app.use(setHeaders)

const BASE_PATH = process.env.BASE_URL
const REGEXP_BASE_PATH = new RegExp(`^${BASE_PATH}`)

const buildPath = (originalPath) => {
  if (REGEXP_BASE_PATH.test(originalPath) === true) {
    return originalPath
  }
  const basePath = BASE_PATH.replace(/\/$/, '')
  return `${basePath}${originalPath}`
}

config.dev = false
const nuxt = new Nuxt(config)

app.use((req, res, next) => {
  req.url = buildPath(req.url)
  console.log('Request URL: ', req.url)

  nuxt.render(req, res, next)
})

module.exports.app = app
```

## まとめ

## 参考記事集

* [Nuxt.js - Universal Vue.js Applications](https://nuxtjs.org/)
* [AWS Lambda (サーバーレスでコードを実行・自動管理) | AWS](https://aws.amazon.com/jp/lambda/)
* [Vue.js製フレームワークNuxt.jsではじめるUniversalアプリケーション開発 | HTML5Experts.jp](https://html5experts.jp/potato4d/24346/)
* [AWS LambdaでSSRやってみた Vue.js編](https://mya-ake.com/slides/vuejs-ssr-on-lambda)
