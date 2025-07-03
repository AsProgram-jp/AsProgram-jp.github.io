function setup() {
  createCanvas(400, 400); // 400x400ピクセルのキャンバスを作成
  background(220); // 背景を薄いグレーにする
}

function draw() {
  // ランダムな色を生成
  fill(random(255), random(255), random(255));
  // キャンバスの中心に円を描画
  circle(width / 2, height / 2, 100);
}