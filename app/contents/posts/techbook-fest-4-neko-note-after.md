# 技術書典4での宣伝戦略などのノウハウを書いた後日譚 ねこの手@福岡

@@
ねこの手@福岡が技術書典に出典して得られた知見などが主な内容です。執筆に使ったツールや本の発注内容や宣伝するときに意識していたことなどについて書きました。
@@

==2018-04-26,2018-05-08==

++/images/neko-note/nekonote_sc.png,summary++


<style>
  .logo-wrapper {
    max-width: 360px;
    margin: 0 auto;
    padding: 64px 24px;
  }
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

<div class="logo-wrapper">
![neko-noteのロゴ](/images/neko-note/logo_nekonote.svg)
</div>

## はじめに

技術書典にサークル、一般、そしてスタッフとして参加された方々お疲れ様でした！
Twitterでしかつながってなかった人と出会うことができるなどとても楽しいイベントでした。

## 記事の概要

ねこの手@福岡が技術書典に出典して得られた知見などが主な内容です。
執筆に使ったツールや本の発注内容や宣伝するときに意識していたことなどについて書きました。

## アウトライン

- [参加経緯](#参加経緯)
- [メンバー](#メンバー)
- [執筆・製本について](#執筆・製本について)
- [宣伝戦略について](#宣伝戦略について)
- [技術書典当日のこと](#技術書典当日のこと)
- [失敗したこと](#失敗したこと)

[ad-content-1]

## 参加経緯

- 技術書典3で「逆引きwebpack」を出して得られたものが大きかった
  - 自分の知識が付いた
  - 自分の書いたものが人に手にとってもらえるという経験を得た
  - Twitterのフォロワーが増えた
- 溜まってるネタの大量放出がしたかった
  - 月に1回ないしは2回ぐらいLTとかしてるけど消化しきれなくなっていた
- こうやったら売れるのではないかという施策を自分のサークルで試したかった

## メンバー

- [mya-ake](https://twitter.com/mya_ake)（僕）
  - web系のエンジニア（ここ1年はフロントエンド寄り）
  - [現場で使えるVue.js tips集](https://neko-note-help.booth.pm/items/828444)を書いた
- [mi](https://twitter.com/mi_upto)
  - フロントエンドエンジニアのヒヨコ
  - [知らないと損するCSS](https://neko-note-help.booth.pm/items/828468)を書いた
- [うぇい](https://twitter.com/weyhok)
  - デザイナー
  - [デザインのうすい本](https://neko-note-help.booth.pm/items/828472)を書いた

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
スタイルはCSSで行ったのでいわゆるCSS組版というやつです。

VS Codeのプラグインは[Markdown PDF](https://github.com/yzane/vscode-markdown-pdf)を使わせてもらいました。
これ単体でPDFにはできるのですが、B5サイズで作ることができなかったため自分でNode.jsも書きました。
ちなみに技術書典前ぐらいにバージョンアップがあったようで、今はB5サイズも作れそうな雰囲気があります。
試してないですが、width / hightの指定ができるようになってるので、おそらくできるでしょう。  
自前のNode.jsのscriptは[node-html-pdf](https://github.com/marcbachmann/node-html-pdf)を使いました。
これはプラグインのMarkdown PDFでも使われているものです。

というわけでけっこうめんどうな手順踏んでます。
ただ今となればMarkdown PDFだけでできそうですね。
修正入るときに試してみようと思います。  
Re:VIEWを使っていない理由は、環境作るのがめんどくさかったのとCSSでスタイルを決めたかったからです（結果自分でNode.js書いたのでめんどがったツケがきた）。


### 本の印刷

書籍版の印刷は[ねこのしっぽ](https://www.shippo.co.jp/neko/)さんにお願いしました。
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
初参加ながらここまでチェック数を伸ばせたのは事前の宣伝が上手くいっていたのだと思います。
そこでどういうことを意識して宣伝していたのかなどをまとめました。


### サークルチェック数の計測と推移

チェック数の計測は[えるきち](https://twitter.com/erukiti)さんの[技術書典4向けの被サークルチェック数をSlackに垂れ流すbot](https://github.com/erukiti/techbookfest-circle-bot)を改変してAWS Lambdaで動かしてチェックしていました（Node v8以上が必要だったのでrollupでバベってたんですが数日後にLambdaにNode v8来て少し悲しかった）。
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

どちらも*ひと目見てそれがなにかわかる*というところを意識していました。
例えばサークルカットはメンバーのうぇいさんに作ってもらったのですが、次のような要件でお願いしました。
これであのサークルカットが出来上がるのだからすごいです。

![サークルカットの制作依頼出したとき](/images/neko-note/sc_requirement.png)

また表紙に関してですが、メンバーの2人はデザインができるので僕から特に言う必要もなく素晴らしいものができていました。流石です。

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

この4点を抑えておくと多くの人に情報が広まっていきます。

次のツイートはCSSが約33,000インプレッション、Vue.jsが約20,000インプレッションいっています。
CSSは最初は伸びていなかったのですが、インフルエンサーのリツートが入ったりすると一気に伸びることもあります。
CSSは[湊川さん](https://twitter.com/llminatoll)のリツートが開催2,3日前にあり、そこから著しく伸び、当日までいいねやリツートが盛んでした。
ほんとにフォロワーの多い人のリツートというのは嬉しいです。

Vue.jsがわかりやすくキーワードを存分に組みこみました。
出てくるライブラリの名前を羅列することで、１つでも気になるものを増やそう作戦です。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">[頒布情報] 知らないと損するCSS<br><br>え？こんなのあったの！？みたいなCSSをブラウザの対応具合と共に紹介してます<br>これを使うとこんな風になるみたいな画像付きで紹介しているものもあるのでとてもわかりやすいです！<br>よろしくお願いします！<br>著:<a href="https://twitter.com/mi_upto?ref_src=twsrc%5Etfw">@mi_upto</a><a href="https://twitter.com/hashtag/%E6%8A%80%E8%A1%93%E6%9B%B8%E5%85%B8?src=hash&amp;ref_src=twsrc%5Etfw">#技術書典</a> <a href="https://twitter.com/hashtag/%E6%8A%80%E8%A1%93%E6%9B%B8%E5%85%B84?src=hash&amp;ref_src=twsrc%5Etfw">#技術書典4</a><a href="https://t.co/4H7OdH9aDl">https://t.co/4H7OdH9aDl</a> <a href="https://t.co/CYbDpfaNrx">pic.twitter.com/CYbDpfaNrx</a></p>&mdash; mya-ake@Vue.js tips本書いた (@mya_ake) <a href="https://twitter.com/mya_ake/status/986798909094739968?ref_src=twsrc%5Etfw">2018年4月19日</a></blockquote>


<blockquote class="twitter-tweet" data-lang="ja"><p lang="ja" dir="ltr">Vue.js tips集の内容はこんな感じです！<br>・computedとfilterはどう使う？<br>・使いまわせるフォームを作る<br>・Vuexはどう使う？<br>・vue-test-utilsでなにをテストする？<br>・vue-i18nのLazy loadingとvue-routerのナビゲーションガード<br>よろしくお願いします！<a href="https://twitter.com/hashtag/%E6%8A%80%E8%A1%93%E6%9B%B8%E5%85%B8?src=hash&amp;ref_src=twsrc%5Etfw">#技術書典</a> <a href="https://twitter.com/hashtag/%E6%8A%80%E8%A1%93%E6%9B%B8%E5%85%B84?src=hash&amp;ref_src=twsrc%5Etfw">#技術書典4</a><a href="https://t.co/4H7OdH9aDl">https://t.co/4H7OdH9aDl</a> <a href="https://t.co/i4Kk1BcL8d">pic.twitter.com/i4Kk1BcL8d</a></p>&mdash; mya-ake@Vue.js tips本書いた (@mya_ake) <a href="https://twitter.com/mya_ake/status/986513473810018304?ref_src=twsrc%5Etfw">2018年4月18日</a></blockquote>


### ツイートの内容

ツイートは必ず*コンバージョンへの導線を用意*します。
宣伝ツイートのコンバージョン（ゴール）はチェックしてもらうことです。
これはシンプルで技術書典のサイトのサークル詳細へのリンクを必ず貼るだけです。
せっかく情報が届いたとしてもその後どうすればいいのか？というのがわからなければ元も子もありません。
リンクを張っておくだけで次のステップが示されるので興味を持った人が迷うことは少なくなります。


## 技術書典当日のこと

まあやばかったです。
なにがやばかったって人が途切れないことですね。
どうやら公式発表によると6300人ほどが来場されていたらしいです。
11:00開場で、17:00までだったのですが、ブースに人がいなかったのは合計10分ぐらいだったような気がします。

### 会計方法

- 現金
- 技術書典かんたん後払い
- pixiv PAY

### 販売数とか

- 現場で使えるVue.js tips集
  - 物理本：151（完売）
  - 電子版：92
- 知らないと損するCSS
  - 物理本：117（完売）
  - 電子版：102  
- デザインのうすい本
  - 物理本：102（完売）
  - 電子版：44ぐらい？
  - セット：4ぐらい？

~~合計すると408です。
チェック数は386だったので、おおよそ同じぐらいの方が来られたようです。
しかし、3冊まとめて買われる人もいたのでもしかするとチェック数よりも少ない人数となったのかもしれません。~~
合計すると**608**でした！なにをどう間違ったら200減って書いてしまったのでしょうか😇typoでしょうか😇

よくよく考えるとチェック数はあくまでチェック数で、購入が確約しているわけではないなと思いました。
ブースには来るけども見本を見て買わないというのもあり得るわけです。

そして気になるサークルとしての売上ですが50万円弱ぐらいとなりました（ここから福岡からの飛行機代、宿泊費、印刷費もろもろ入ってきます）。  
購入方法は  
現金 >>>> かんたん後払い >> pixiv PAY  
という順になりました。

## 失敗したこと

### 技術書典かんたん後払いのQRコードのリストの印刷ができなかった

当日朝にリストを作りPDFを作っていました。
しかし、文字のアウトライン化をしておらずPDFが破損しており朝コンビニで印刷できませんでした。。
完全にミスりました。
とりあえず販売時はスマホに入っている壊れたPDFを読み込んでもらうという形式をとりました。
印刷できなかったということもあり販売時のオペレーションが長引くこともあったので印刷できなかったのは痛手でした。


### 入場が遅くなった

日比谷線で秋葉原に向かったのですが、改札からUDXが予想以上に遠くて移動に10分以上かかってしまいました。
そんなに遠くなかったよねーっていう勝手な思い込みによるミスです。
お前はもう福岡の人なんだからちゃんと調べろって話ですね。
そのせいもあり設営などもバタバタでした。
準備が完了したのはほんとに開場の時間ぐらいでした。

ほんとは会場着いてQRコードのPDFを修正して印刷しに行く！などをやろうとしてたんですが、まあそんな時間はなかったです。

事前に会場設営の練習などをしておくとスムーズに行けたのかなと思いました。
準備に手間取りかんたん後払い用のPDFの共有もしている暇がなく後々に響きました。。


### 頒布物の種類が多いと見本を見ている人が多くなる

今回3種類の本を頒布しました。
他のサークルに比べ前で見本を見ている人が多いようでした。
そうなると回転率も悪く、すぐ買いたいのに前に行けなそうにしてる方などが見受けられました。
解消するにはブースの前で人員整理をする役割の人も必要だと実感しました。


### 物理本の印刷数

圧倒的に不足でした。
紙の本なら買いたかったのにという声は何度も耳にしました。
手元に残っている数もほぼないので、200~300部ぐらいは刷るべきだったと思いました。

ただ新刊3冊ということもあり150,100,100でも在庫をブースに置いておくのは狭かったです。
MAX500部ぐらいが限界かなというところでした。


### ご飯を食べる暇がない

常に人がいた＆かんたん後払いは僕のスマホでしかできない属人化された状況であり、僕は常に接客していました（属人化したのは印刷失敗＆入場遅れたのが原因）。
開催中は立ちっぱなし飯なしで6時間を過ごしました。
そう言えばトイレにも行かなかった気がします。。

ということもあり人が来ることが予想されるならウィダーインゼリーのようにさっと飲めて蓋も閉めれて後からでも飲めるようなものを用意しておくのが無難だと思いました。
まあただ無理にでも休憩という時間を作ることもできたなと終わってから思ったので、結局はオペレーション上の問題でもあったのかなとも考えてます。


### お釣り用の小銭はそんなにいらない

お釣り用に100円3本（150枚）、500円1本（50枚）、1000円10枚を用意しました。
100円に関しては多すぎてただ重くしただけでした。
100円1本、500円30枚、1000円10枚ぐらいあれば足りそうな雰囲気でした。


### 売上と販売数が合わない？

原因は色々考えられるのですが、「お釣りミス」「物理本と一緒にDLカードつけ忘れ」「セット販売の数を記録できなかった」あたりでしょう。

*もし物理本（Vue.js tips集と知らないと損するCSS）を買ったけどDLカードがなかったという方がおられましたらTwitterなどからご連絡ください。書籍の写真を送っていただければ交換します。*
ほんとに買ったかの判定はGoogle画像検索、本の背景から判断しますので、背景は出来る限り写真に入れるようにお願いいたします。

販売時の合計金額、お釣りの計算、売れた数などが記録に残るように電子化させたい気持ちがありますが、そのオペレーションは余計に時間がかかることもありうるので難しいところだなと考えてます。
次回までになにかいい方法がないか考えたいです。


### 執筆時間が足りなかった

これはもう僕のスケジュールミスなのですが、3月中の忙しさが鬼のようでした。

- 3/16 [Angular触ろうの会 in Fukuoka #5](https://ng-fukuoka.connpass.com/event/81042/)主催の１人
- 3/20 [俺の話を聞け！！LT大会 #8](https://cdg.connpass.com/event/81429/)主催＆LT
- 3/29 [福岡PWA勉強会 #01](https://fukuoka-pwa.connpass.com/event/81842/)主催＆セッション

これに加えて本業も忙しくあんまり執筆に使えませんでした。
そんなこんなもあり執筆は4月に入ってからとなり内容も削ることになりました。
ほんとはVue.jsのアクセシビリティやwindowリサイズイベントのりアクティブ化に関しても書きたかったのですが削ってしまいました。
アクセシビリティに関しては一度LTしているのでご興味のある方は下のスライドをご覧ください。  
[Vue.jsとアクセシビリティ アクセシブルなコンポーネントの作り方](https://mya-ake.com/slides/how-make-accessible-component-with-vue)

[ad-content-2]

## まとめ

僕が技術書典で体験したことや失敗したことなどを思い出せる限り書いてみました。
ざっと書いて抜け漏れありそうなので更新してくかもです。
初めての参加ということもあり色々反省点もあります。
ただまあ色々あったけどもすごく楽しいイベントでした！
技術書典のスタッフの方々ありがとうございました！
そしてブースにきてくた方もありがとうございました！

次回は「ねこの手@福岡」改め「neko-note」として参加したいと考えます。
今後とよろしくお願いします！

### ねこの手@福岡の電子版は引き続きBOOTHで販売しています！

もし買えなかったという方はBOOTHよりご購入いただけます！

[https://neko-note-help.booth.pm](https://neko-note-help.booth.pm)

こちらも未だに売れ続けていて、3冊の合計は200を超えました。
買っていただいた方ありがとうございます。
これを励みにこれからも制作活動頑張ります！


### Vue.js tips集の感想見ない、、

ちょっと厚めで内容も重いのでまだ読んでないだけだよねって思いたい。

### Vue.js tips集のサンプルコードについて

まだREADMEなど書けてないので少々お待ちください。
ブログも書き終わったので着手できるようになりました。
更新した場合は[#現場で使えるvuejstips](https://twitter.com/search?q=%23%E7%8F%BE%E5%A0%B4%E3%81%A7%E4%BD%BF%E3%81%88%E3%82%8Bvuejstips&src=typd)にてつぶやきますので適宜ご確認ください。

