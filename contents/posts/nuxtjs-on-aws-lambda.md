# Nuxt.js on AWS Lambda

@@
Vue.jsのユニバーサルアプリケーションを作るためのフレームワークであるNuxt.jsをAWS Lambdaで動かす方法について書かれている記事です。
@@

==2017-12-12==

## この記事について

この記事は[Vue.js #2 Advent Calendar 2017 - Qiita](https://qiita.com/advent-calendar/2017/vue2)の12日目の記事です。

この記事では [Nuxt.js](https://nuxtjs.org/) を [AWS Lambda](https://aws.amazon.com/jp/lambda/) で動かす方法について書いています。
Nuxt.js は Vue.js のユニバーサルアプリケーションを作ることができるフレームワークです。
AWS Lambda は使った分だけ課金される FaaS (Function as a Service) と言われる AWS のコンピューティングサービスです。

今回この2つについて簡単に説明し、なぜSSRするかという話もして、動かすための実装コードの説明していくという盛り沢山な内容になっています。

### アウトライン

* [Nuxt.js](#Nuxt.js)
* [AWS Lambda](#AWS_Lambda)
* [なぜSSR？なぜLambda？](#なぜSSR？なぜLambda？)
* [実装コードの説明](#実装コードの説明)
* [まとめ](#まとめ)
* [参考記事集](#参考記事集)

### 対象読者

* Vue.js のSSR（サーバーサイドレンダリング）に興味がある方
* Nuxt.js をどういうサーバーで稼働させようか考えている方
* AWS Lambdaでやろうとして上手くいかなかった方

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
冒頭にも書きましたが、使った分だけ課金される料金体系になっています。


## なぜSSR？なぜLambda？

## 実装コードの説明

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
