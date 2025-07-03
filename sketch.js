let soundArea0;
let soundArea1;
let soundArea2;
let soundArea3;
let soundArea4;
let soundArea5;
let soundArea6;
let soundArea7;
let soundArea8;

let osc1;
let osc2;
let osc3;
let osc4;
let osc5;
let osc6;
let osc7;
let osc8;

let isPlaying1 = false;
let isPlaying2 = false;
let isPlaying3 = false;
let isPlaying4 = false;
let isPlaying5 = false;
let isPlaying6 = false;
let isPlaying7 = false;
let isPlaying8 = false;

let noSound;
let sound01;
let sound02;
let sound03;
let sound04;
let sound05;
let sound06;
let sound07;
let sound08;

let player;

//画像を読み込み


function setup() {
	new Canvas(windowWidth, windowHeight);

	soundAreas = new Group();//サウンドエリアをグループ化
	
	//各サウンドエリアの配置、デザイン、当たり判定を設定
	soundArea0 = new Sprite(width / 2, height / 2, width, height, "static");
	soundArea0.color = color(0, 0, 0, 0);
	soundArea0.stroke = 0;
	soundArea0.strokeWeight = 1;

	soundArea1 = new Sprite(width / 9 * 1, height / 2, width * 0.1, height * 0.8, "static");
	soundArea1.color = color(0, 0, 0, 0);
	soundArea1.stroke = "yellow";
	soundArea1.strokeWeight = 0.2;

	soundArea2 = new Sprite(width / 9 * 2, height / 2, width * 0.1, height * 0.8, "static");
	soundArea2.color = color(0, 0, 0, 0);
	soundArea2.stroke = "yellow";
	soundArea2.strokeWeight = 0.2;

	soundArea3 = new Sprite(width / 9 * 3, height / 2, width * 0.1, height * 0.8, "static");
	soundArea3.color = color(0, 0, 0, 0);
	soundArea3.stroke = "yellow";
	soundArea3.strokeWeight = 0.2;

	soundArea4 = new Sprite(width / 9 * 4, height / 2, width * 0.1, height * 0.8, "static");
	soundArea4.color = color(0, 0, 0, 0);
	soundArea4.stroke = "yellow";
	soundArea4.strokeWeight = 0.2;

	soundArea5 = new Sprite(width / 9 * 5, height / 2, width * 0.1, height * 0.8, "static");
	soundArea5.color = color(0, 0, 0, 0);
	soundArea5.stroke = "yellow";
	soundArea5.strokeWeight = 0.2;

	soundArea6 = new Sprite(width / 9 * 6, height / 2, width * 0.1, height * 0.8, "static");
	soundArea6.color = color(0, 0, 0, 0);
	soundArea6.stroke = "yellow";
	soundArea6.strokeWeight = 0.2;

	soundArea7 = new Sprite(width / 9 * 7, height / 2, width * 0.1, height * 0.8, "static");
	soundArea7.color = color(0, 0, 0, 0);
	soundArea7.stroke = "yellow";
	soundArea7.strokeWeight = 0.2;

	soundArea8 = new Sprite(width / 9 * 8, height / 2, width * 0.1, height * 0.8, "static");
	soundArea8.color = color(0, 0, 0, 0);
	soundArea8.stroke = "yellow";
	soundArea8.strokeWeight = 0.2;

	//サウンドエリア（１～８）をグループに追加
	soundAreas.add(soundArea1);
	soundAreas.add(soundArea2);
	soundAreas.add(soundArea3);
	soundAreas.add(soundArea4);
	soundAreas.add(soundArea5);
	soundAreas.add(soundArea6);
	soundAreas.add(soundArea7);
	soundAreas.add(soundArea8);

	
	//音を設定
	osc1 = new p5.Oscillator('sine');
	osc1.freq(261.63);

	osc2 = new p5.Oscillator('sine');
	osc2.freq(293.66);

	osc3 = new p5.Oscillator('sine');
	osc3.freq(329.63);

	osc4 = new p5.Oscillator('sine');
	osc4.freq(349.23);

	osc5 = new p5.Oscillator('sine');
	osc5.freq(392.00);

	osc6 = new p5.Oscillator('sine');
	osc6.freq(440.00);

	osc7 = new p5.Oscillator('sine');
	osc7.freq(493.88);

	osc8 = new p5.Oscillator('sine');
	osc8.freq(523.25);



	//プレイヤースプライトを設定
	player = new Sprite(mouseX, mouseY, 20);
	player.color = color(0, 0, 0, 0);
	player.stroke = 255;

}

function draw() {
	background(100);
	stroke(0);
	strokeWeight(1);
	fill(255, 255, 255, 180);

	line(width * 0.1, 0, width * 0.1, height * 0.75);
	line(width * 0.9, 0, width * 0.9, height * 0.75);
	line(width * 0.1, height * 0.75, 0, height);
	line(width * 0.9, height * 0.75, width, height);
	line(width * 0.1, height * 0.75, width * 0.9, height * 0.75);

	noStroke();
	beginShape();
	vertex(width * 0.45, 0);
	vertex(width * 0.4, height * 0.75);
	vertex(width * 0.6, height * 0.75);
	vertex(width * 0.55, 0);
	endShape(CLOSE);

	let amp = map(player.position.y, height * 0.9, height * 0.1, 0.1, 1);//マウスカーソルのY座標に応じて音の大きさを変更



	//各サウンドエリアとプレイヤースプライトが重なっているとき、指定のスプライトを描画し、設定した音を再生
	if (player.overlapping(soundArea1)) {
		osc1.amp(amp);
		if (!isPlaying1) {
			osc1.start();
			isPlaying1 = true;
		}
	} else {
		if (isPlaying1) {
			osc1.stop();
			isPlaying1 = false;
		}
	}

	if (player.overlapping(soundArea2)) {
		osc2.amp(amp);
		if (!isPlaying2) {
			osc2.start();
			isPlaying2 = true;
		}
	} else {
		if (isPlaying2) {
			osc2.stop();
			isPlaying2 = false;
		}
	}

	if (player.overlapping(soundArea3)) {
		osc3.amp(amp);
		if (!isPlaying3) {
			osc3.start();
			isPlaying3 = true;
		}
	} else {
		if (isPlaying3) {
			osc3.stop();
			isPlaying3 = false;
		}
	}

	if (player.overlapping(soundArea4)) {
		osc4.amp(amp);
		if (!isPlaying4) {
			osc4.start();
			isPlaying4 = true;
		}
	} else {
		if (isPlaying4) {
			osc4.stop();
			isPlaying4 = false;
		}
	}

	if (player.overlapping(soundArea5)) {
		osc5.amp(amp);
		if (!isPlaying5) {
			osc5.start();
			isPlaying5 = true;
		}
	} else {
		if (isPlaying5) {
			osc5.stop();
			isPlaying5 = false;
		}
	}

	if (player.overlapping(soundArea6)) {
		osc6.amp(amp);
		if (!isPlaying6) {
			osc6.start();
			isPlaying6 = true;
		}
	} else {
		if (isPlaying6) {
			osc6.stop();
			isPlaying6 = false;
		}
	}

	if (player.overlapping(soundArea7)) {
		osc7.amp(amp);
		if (!isPlaying7) {
			osc7.start();
			isPlaying7 = true;
		}
	} else {
		if (isPlaying7) {
			osc7.stop();
			isPlaying7 = false;
		}
	}

	if (player.overlapping(soundArea8)) {
		osc8.amp(amp);
		if (!isPlaying8) {
			osc8.start();
			isPlaying8 = true;
		}
	} else {
		if (isPlaying8) {
			osc8.stop();
			isPlaying8 = false;
		}
	}

	//プレイヤースプライトをマウスカーソルに追従させる
	player.position.x = mouseX;
	player.position.y = mouseY;

}