const start = document.getElementById('start');
const webcamBox = document.getElementById('webcam-box');
const label = document.getElementById('label');
const percent = document.getElementById('percent');
const Explan = document.getElementById('Explanation');
const URL = "https://teachablemachine.withgoogle.com/models/Z_lyzoEOM/";
const Text = document.getElementById('Text');
const Textname = document.getElementById('textname');
const syutuGen = document.getElementById('syutugen');
const percen = document.getElementById('percen');
let Hpoint = 100;
const Time = document.getElementById('time');
let score = 0;
let message = '';


//テキトーな配列
const text = [
  {'class':'パンチ','name':'ひょっこりはん'},
  {'class':'ファック','name':'勘違い野郎'},
  {'class':'パンチ','name':'強引な豚野郎'},
  {'class':'ブーイング','name':'よっぱらい野郎'},
  {'class':'ブーイング','name':'肩に手を添える野郎'},
]

// ランダムな配列を生成してtextに出力する関数
const randamEvent = ()=>{
  get = text[Math.floor(Math.random()* text.length)];//ランダムな配列取得
  const getclass = (get['class']);
  const getname = (get['name']);
//img にgetnameと同様の画像をsrcで指定
  document.getElementById('img').src = 'img/' + getname + '.jpeg';

//img demo にgetclassと一致した画像を指定
  document.getElementById('demo').src = 'img/' + getclass + '.jpeg';
  document.getElementById('demo').classList.add('demo2');

  syutuGen.textContent = `${getname} が現れた!`;
  Textname.textContent = `${getclass}`; 
  Explan.textContent = 'で倒すんだ！';
  Hpoint = 100;//HPリセット
  HP.textContent = `おやじのHP:${Hpoint}`;//HP入れ替え
  Meter = "100";//meterのリセット
  let met = document.getElementById('meter').value = Meter//meter.valueで初期化
};

//classが一致しているか確認
const classCheck =()=>{
  const Textclass = document.getElementById('textname').textContent;//textcontentで再取得
  const str = document.getElementById('label').textContent;//
  const perCent = document.getElementById('percent').textContent

  if(str.indexOf(Textclass)!== -1 && perCent>0.95){//もしstrとTextclassの文字が部分一致しててかつ95%以上だったら
    const HP =document.getElementById('HP');//HPの取得
    HP.textContent = `おやじのHP:${Hpoint--}`;//HPを1ずつ減らす
    let nowMeter = Meter--; //meterを１ずつ減らす
    let met = document.getElementById('meter').value = nowMeter ;//meter.valueで更新
    
    new Audio('img/m2.mp3').play();//音
    if(Hpoint<=0){//HPが0になったらランダムな配列関数呼び出し
      new Audio('img/m1.mp3').play();//音
      randamEvent()
      score = score + 10;//scoreに10足す
    };
  };
};


//スタートの初期化
const startEvent = async ()=>{
  //モデルのロード
  model = await tmImage.load(URL+'model.json' , URL+'metadata.json');
  //カメラの初期化
  webcam = new tmImage.Webcam(200,200,true);

  //webcam起動
  await webcam.setup();
  webcam.play();
 
  //webcam-boxへappend
  webcamBox.appendChild(webcam.canvas);

  Text.style.display = "none";
  start.style.display = "none"
  percen.style.display = "block"
  
  randamEvent();
  loop();
  timer();
}

//モデルの実行関数
const predict = async ()=>{
  //webcam.canvasから計測値の取得 predictでmodelの実行
  const prediction = await model.predict(webcam.canvas);
  // console.log(prediction)//

  //model.getTotalClassesでモデルの分類クラスを取得
  for(let i =0; i < model.getTotalClasses(); i++){
    const name = prediction[i].className;//iのclassName
    const value = prediction[i].probability.toFixed(2);//iの(probability)

    //もし0.85以上ならlabelへ出力
    if(value > 0.90) label.textContent = `${name}`;
    if(value > 0.90) percent.textContent = `${value}`;
  }

  classCheck();

}
//繰り返しの関数
const loop = async ()=>{
  webcam.update();//webcam
  await predict();//predict
  window.requestAnimationFrame(loop);
}

//startの発火
start.addEventListener('click' ,startEvent);


// カウントダウンタイマーの関数
const timer = ()=>{
  let time = 60;//初期化
  
  const id = setInterval(()=>{
    //カウントが0になったらタイマー停止
    if(time <= 0){
      gameOver(id);
    }
    //カウントダウンする処理
    Time.textContent = time--; //TimeにtextContentを差し込み
  }, 1000);//1000ミリ秒
};

//スコアによる条件分岐
const Score = (score)=>{
  if(score >= 80){
    message = 'おっさんスレイヤー';
  }else if(score >= 60){
    message = 'おっさんキラー';
  }else if(score >= 40){
    message = 'おっさんハンター';
  }else if(score >= 20){
    message = 'おっさん狙い目タイプ';
  }else{
    message = 'もはやおっさん';
}
return `称号：${message}です!`
}



//ゲーム終了
const gameOver = (id) =>{
  clearInterval(id);
  const messaging = (Score(score));
  document.getElementById('img').src = 'img/ひょっこりはん.jpeg';//画像差し替え
  Explan.innerText = '終わり';
  Textname.innerText = '';
  syutuGen.innerText = '';

  document.getElementById('HP').innerText = (messaging)//スコアによって文章の差し替え
  webcamBox.remove();//webcamboxの削除
  label.remove();//labelの削除
  document.getElementById('end').classList.remove('End');//endから.End classをはずす
  document.getElementById('end').addEventListener('click' , function(){
    window.location.reload();//画面リロード
  });
};