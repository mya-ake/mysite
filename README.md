# mya-ake.com prject

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

#### ファイル指定コンバート（フォルダが違う同名ファイルも対象になる）
```
$ node converter.js -f about.md
```
