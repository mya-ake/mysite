# mya-ake.com Project

## About
自分のサイト（ https://mya-ake.com/ ）のアーキテクチャ変更プロジェクト。

とりあえずNuxt.jsでSSRできるようにする。


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
