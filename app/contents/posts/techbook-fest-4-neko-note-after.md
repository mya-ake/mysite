# 技術書典4に出典するためにやったことを思い出せる限り書く！ねこの手@福岡

@@
ねこの手@福岡が技術書典に出典して得られた知見などが主な内容です。執筆に使ったツールや本の発注内容や宣伝するときに意識していたことなどについて書きました。
@@

==2018-04-24==


<style>
  .image-sm img,
  .image-md img {
    margin-left: auto;
    margin-right: auto;
  }

  @media screen and (min-width: 480px) {
    .image-sm img {
      max-width: 320px;
    }
    .image-md img {
      max-width: 640px;
    }
  }
</style>


## はじめに

技術書典にサークル、一般、そしてスタッフとして参加された方々お疲れ様でした！
Twitterでしかつながってなかった人と出会うことができるなどとても楽しいイベントでした。
この記事ではねこの手@福岡がやってきたことや意識してたことなどを書いています。

## 概要

ねこの手@福岡が技術書典に出典して得られた知見などが主な内容です。
執筆に使ったツールや本の発注内容や宣伝するときに意識していたことなどについて書きました。

## アウトライン

- 参加経緯
- メンバー
- 執筆について
- 宣伝戦略について
- 当日
- 失敗したこと


## 参加経緯

- 技術書典3で「逆引きwebpack」を出して得られたものが大きかった
  - 自分の知識が付いた
  - 自分の書いたものが人に手にとってもらえるという経験を得た
  - Twitterのフォロワーが増えた
- 溜まってるネタの大量放出がしたかった
  - 月に1回ないしは2回ぐらいLTとかしてるけど消化しきれなくなっていた
- こうやったら売れるのではないかという施策を自分のサークルで試したかった

## メンバー

- [mya-ake](https://twitter.com/mya_ake)（筆者）
  - web系のエンジニア（ここ1年はフロントエンド寄り）
- [mi](https://twitter.com/mi_upto)
  - フロントエンドエンジニアのヒヨコ
- [うぇい](https://twitter.com/weyhok)
  - デザイナー

## 執筆・製本について

これはサークル全体としてではなく、個人についての話です。

### 執筆スケジュール

スケジュールはもう完全に失敗しました。
実質4月に入ってからしか書けませんでした。
これに関しては失敗したことで書きたいと思います。

### 執筆環境

自前のMarkdownエディタを正月休みで作っていたのでそれを使いました。
どんなエディタかというと、入力するとtextlintが走って変なところがあれば指摘してくれるものです。
しかし1000行ぐらいになる（もっと行数少なかったかもしれない）と重くて使いものにならないので、途中からVS Codeに移りました。
一応[GitHub](https://github.com/mya-ake/my-authoring)に置いてますが、使い方が全然書いてないので他の人は使えないかもしれないです。
次回までに負荷対策などの改良をしたい（気持ちだけある）。


### PDF化

PDF化はVS Codeのプラグインと自前のNode.jsのscriptで生成しました。
Markdownで書き、プラグインでHTMLに変換し、そしてPDFへという流れです。

VS Codeのプラグインは[Markdown PDF](https://github.com/yzane/vscode-markdown-pdf)を使わせてもらいました。
これ単体でPDFにはできるのですが、B5サイズで作ることができなかったため自分でNode.jsも書きました。
ちなみに技術書典前ぐらいにバージョンアップがあったようで、今はB5サイズも作れそうな雰囲気があります。
試してないですが、width / hightの指定ができるようになってるので、おそらくできるでしょう。  
自前のNode.jsのscriptは[node-html-pdf](https://github.com/marcbachmann/node-html-pdf)を使いました。
これはプラグインのMarkdown PDFでも使われているものです。

というわけでけっこうめんどうな手順踏んでます。
ただ今となればMarkdown PDFだけでできそうですね。
修正入るときに試してみようと思います。  
Re:VIEWを使っていない理由は、環境作るのがめんどくさかったのとCSSでスタイルを決めたかったからです（結果自分でJS書いたのでめんどがったツケがきた）。


### 製本

書籍版の印刷は[ねこのしっぽ](https://www.shippo.co.jp/neko/)にお願いしました。
ねこのしっぽになった理由は締め切りが4/18とけっこう遅かったからです。
他のメンバーは早々に書き上げていたので[プリントパック](http://www.printpac.co.jp)にお願いしたようです。

#### 申し込み内容

自分への備忘録を兼ねて。
正直よくわからないので選択肢の上の方にあるものを選択した感じです。

- ぱっく名
  - オンデマンドのぱっく
  - 本のサイズ：B5
  - 申込部数：150部
  - 綴じ口：左綴じ
  - 製本方法：無線綴じ
  - ページ数：82ページ
- 表紙仕様
  - ホワイトポスト 180kg (PP無し)
  - オンデマンド フルカラー
- 本文仕様
  - 上質紙 90kg
  - オンデマンド 黒1色
  - 遊び紙：なし

本文仕様に関しては最初「上質紙 70kg」を選択していましたが、確認の電話にて「軽さにこだわらないなら上質紙 90kgの方がいいですよ」（意訳）という風に教えてもらったので、70から90に上げました。


## 宣伝戦略について

ねこの手@福岡の最終的なチェック数は*386*でした。

<div class="image-sm">
![サークルチェック数のスクリーンショット](/images/neko-note/check_number.png)
</div>

完全に想定を上回るチェック数がついてて、当日まじでどうなるんだ？ってなってました。
初参加ながらここまでチェック数を伸ばせたのは事前の宣伝が上手くハマっていたのだと思います。
そこでどういうことを意識して宣伝していたのかなどをまとめました。


### サークルチェック数の計測と推移

チェック数の計測は[えるきち](https://twitter.com/erukiti)さんの[技術書典4向けの被サークルチェック数をSlackに垂れ流すbot](https://github.com/erukiti/techbookfest-circle-bot)をAWS Lambdaで動かしてチェックしていました（Node v8以上が必要だったのでrollupでバベってたんですが数日後にLambdaにNode v8来て少し悲しかった）。
4/2から稼働させて8時間ごとにSlackに通知させました。

<div class="image-sm">
![サークルチェック数を知らせるbotのスクリーンショット](/images/neko-note/nekonote-bot-notificate.jpg)
</div>

ということでデータとして残ってるのでグラフ化させました。

<div class="image-md">
![サークルチェック数の推移](/images/neko-note/chart_check_number.png)
</div>

やはり後半になるにつれ伸びがよくなっています。
開催が近くになるにつれて注目度が高まっているということでしょうか。
また当日の伸びが一番大きいです。
おそらく入場前の待ち時間でチェックをする人が多いのでしょう。


### サークルカットや表紙のデザイン

どちらもは*ひと目見てそれがなにかわかる*というところを意識していました。
例えばサークルカットはメンバーのうぇいさんに作ってもらったのですが、次のような要件でお願いしました。
これであのサークルカットが出来上がるのだからすごいです。

![サークルカットの制作依頼出したとき](/images/neko-note/sc_requirement.png)

また表紙に関してですが、メンバーの2人はデザインができるので筆者から特に言う必要もなく素晴らしいものができていました。流石です。

どうして*ひと目見てそれがなにかわかる*ことが重要なのかというと、人間の意識に入り込むためです。
サークルリストでは数多く並んでいるサークルの中から自分好みのサークルを探します。
また今回ねこの手の主な宣伝の場となったTwitterでは常に新規ツイートがあるような人もいると思います。
どちらもたくさんの情報が一度に目に入ります。
人間はその中から自然と取捨選択という行為をしています。
どのようなものが選ばれやすいかというと*自分の興味があるもの*です。
（ソースは忘れたがどこかで見たというやつ）
TwitterのTLを流し読みしてても自分の興味がある単語や画像は目につかないでしょうか？
その目につかせるという行為を意図的に行うことでTwitterでのリツートやいいね、インプレッションの増加が見込まれます。

なんか難しいこと書いてるな？って思うかもしれませんが難しいことはそんなにありません。

- 本にわかりやすいタイトルを付ける
- ターゲットが気になるであろうキーワードを入れる
- 画像つきでツイートする
- `#技術書典` ハッシュタグは必ず付ける

この4点を抑えておくと多くの人に情報を届けることができます。

次のツイートはCSSが約33,000インプレッション、Vue.jsが約20,000インプレッションいっています。
3つ目の3コマ漫画は僕のツイートではありませんが、20,000万インプレッションは超えていたはずです（僕が3コマ漫画を先にツイートしたときは伸びなかったのでテキストなどが悪かったのでしょう）。

Vue.jsがわかりやすく、キーワードを存分に組みこんでいました。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">[頒布情報] 知らないと損するCSS<br><br>え？こんなのあったの！？みたいなCSSをブラウザの対応具合と共に紹介してます<br>これを使うとこんな風になるみたいな画像付きで紹介しているものもあるのでとてもわかりやすいです！<br>よろしくお願いします！<br>著:<a href="https://twitter.com/mi_upto?ref_src=twsrc%5Etfw">@mi_upto</a><a href="https://twitter.com/hashtag/%E6%8A%80%E8%A1%93%E6%9B%B8%E5%85%B8?src=hash&amp;ref_src=twsrc%5Etfw">#技術書典</a> <a href="https://twitter.com/hashtag/%E6%8A%80%E8%A1%93%E6%9B%B8%E5%85%B84?src=hash&amp;ref_src=twsrc%5Etfw">#技術書典4</a><a href="https://t.co/4H7OdH9aDl">https://t.co/4H7OdH9aDl</a> <a href="https://t.co/CYbDpfaNrx">pic.twitter.com/CYbDpfaNrx</a></p>&mdash; mya-ake@Vue.js tips本書いた (@mya_ake) <a href="https://twitter.com/mya_ake/status/986798909094739968?ref_src=twsrc%5Etfw">2018年4月19日</a></blockquote>


<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">Vue.js tips集の内容はこんな感じです！<br>・computedとfilterはどう使う？<br>・使いまわせるフォームを作る<br>・Vuexはどう使う？<br>・vue-test-utilsでなにをテストする？<br>・vue-i18nのLazy loadingとvue-routerのナビゲーションガード<br>よろしくお願いします！<a href="https://twitter.com/hashtag/%E6%8A%80%E8%A1%93%E6%9B%B8%E5%85%B8?src=hash&amp;ref_src=twsrc%5Etfw">#技術書典</a> <a href="https://twitter.com/hashtag/%E6%8A%80%E8%A1%93%E6%9B%B8%E5%85%B84?src=hash&amp;ref_src=twsrc%5Etfw">#技術書典4</a><a href="https://t.co/4H7OdH9aDl">https://t.co/4H7OdH9aDl</a> <a href="https://t.co/i4Kk1BcL8d">pic.twitter.com/i4Kk1BcL8d</a></p>&mdash; mya-ake@Vue.js tips本書いた (@mya_ake) <a href="https://twitter.com/mya_ake/status/986513473810018304?ref_src=twsrc%5Etfw">2018年4月18日</a></blockquote>


<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">優秀なエンジニアさん達〜！デザインできますか？<br>エンジニアがデザインできたら鬼に金棒ですよ。<a href="https://twitter.com/hashtag/%E6%8A%80%E8%A1%93%E6%9B%B8%E5%85%B8?src=hash&amp;ref_src=twsrc%5Etfw">#技術書典</a> <a href="https://twitter.com/hashtag/%E6%8A%80%E8%A1%93%E6%9B%B8%E5%85%B84?src=hash&amp;ref_src=twsrc%5Etfw">#技術書典4</a> <a href="https://t.co/CE1Q3FVsYb">pic.twitter.com/CE1Q3FVsYb</a></p>&mdash; mi 🌸 @技術書典4(か-23) (@mi_upto) <a href="https://twitter.com/mi_upto/status/987712029325602817?ref_src=twsrc%5Etfw">2018年4月21日</a></blockquote>


## 技術書典当日

まあやばかったです。
なにがやばかったって人が途切れないことですね。
どうやら公式発表によると6300人ほどが来場されていたらしいです。


## 失敗したこと
