# mya-ake.com Project

## About
自分のサイト（ https://mya-ake.com/ ）のアーキテクチャ変更プロジェクト。

とりあえずNuxt.jsでSSRできるようにする。


## Contents

全ページの内容は全てMarkdownで記述する。（多分）

MarkdownからHTMLにしてJSONにする。コンバート方法は下記の[Contentsコンバーター](https://github.com/mya-ake/mysite#contentsコンバーター)を参照。

また、HTMLからJSONにするときに、title・description・bodyに分割する。

下記の記述方法通りに書くと適切に分割される。

#### 記述方法

```
# Ttile

@@
description
@@

body...
...
```
※今のところdescriptionの`@@...@@`のみ独自記法が入っている。

サンプルは [/contents/pages/about.md](https://github.com/mya-ake/mysite/blob/master/contents/pages/about.md)を見るとよい。


## Contentsコンバーター

サイトのコンテンツは全てMarkdownで管理されており、サイトではJSONの形式で取扱う。

そのためのコンバーターの使い方を忘れないうちに書いておく。

今はcontentsフォルダでのみ実行可能で、コンバートされるとstaticのcontentsフォルダに吐き出される。

### コマンド

#### 全ファイルのコンバート
```
$ node converter.js
```

#### フォルダ指定コンバート
```
$ node converter.js -t pages
```

#### フォルダかつファイル指定コンバート
```
$ node converter.js -t pages -f about.md
```

#### ファイル指定コンバート（フォルダが違う同名ファイルも対象になるはず）（未検証
```
$ node converter.js -f about.md
```


## ビルド

Nuxt.jsのgenerateコマンドによる静的サイトジェネレーターの機能を用いる。

ただし、ページのコンテンツをstaticフォルダのjsonをHTTP通信で取得する仕様になっているため、通常の`yarn genrerate`コマンドでは生成できない。

そのため、ビルド用にローカルサーバーを立てる必用あったので、`yarn generate`とは別コマンドの下記コマンドを用意している。

```
$ yarn generate:local
```
