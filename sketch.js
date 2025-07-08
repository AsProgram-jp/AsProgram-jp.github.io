// --- 難易度管理 ---
let gameState = 'select'; // 'select' or 'play'
let selectedDifficulty = null;
let DIFFICULTY_SETTINGS = {
	Easy: {interval: 50},
	Normal: {interval: 35},
	Hard: {interval: 25}
};

// --- 設定 ---
const NUM_KEYS = 8;
const KEY_LABELS = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
const KEY_COLORS = ['#fff', '#eee', '#fff', '#eee', '#fff', '#eee', '#fff', '#eee'];
const KEY_HIT_COLOR = '#ffd700';
const NOTE_W = 88; // ノーツ幅
const NOTE_H = 64; // ノーツ高さ
const NOTE_RADIUS = 24; // ノーツ角丸
let NOTE_SPEED = 4; // 全難易度で共通
let NOTE_INTERVAL = 20; // デフォルト値、難易度で変更
const JUDGE_LINE_Y = 0.77; // 判定ラインを少し上げる
const FREQS = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
const KEYBOARD_KEYS = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'];

// --- ゲーム状態 ---
let soundAreas = [];
let notes = [];
let hitEffects = [];
let lastJudge = '';
let lastJudgeFrame = 0;
let keyPressedState = Array(NUM_KEYS).fill(false);
let noteTimer = 0;

// --- 音色管理 ---
let currentWaveform = 'sine'; // 'sine', 'square', 'triangle', 'sawtooth'
let waveformOrder = ['sine', 'square', 'triangle', 'sawtooth'];

function setup() {
	console.log('Setup started');
	createCanvas(windowWidth, windowHeight);
	console.log('Canvas created');
	textAlign(CENTER, CENTER);
	rectMode(CENTER);
	
	// 音の初期化（setup完了後）
	setTimeout(() => {
		if (typeof getAudioContext !== 'undefined') {
			getAudioContext().resume();
		}
	}, 100);
	
	// 鍵盤エリア生成（画面下部）
	let keyW = width / NUM_KEYS;
	let keyH = height * 0.12;
	let y = height * 0.88 + keyH / 2; // 鍵盤は下部に
	for (let i = 0; i < NUM_KEYS; i++) {
		let x = keyW * i + keyW / 2;
		soundAreas[i] = { x, y, w: keyW, h: keyH, label: KEY_LABELS[i], color: KEY_COLORS[i] };
	}
}

function draw() {
	background(30);
	if (gameState === 'select') {
		drawDifficultySelect();
		return;
	}
	drawKeys();
	drawJudgeLine();
	drawNotes();
	drawHitEffects();
	drawJudge();
	spawnNotes();
	updateNotes();
}

function drawDifficultySelect() {
	fill(255);
	textSize(48);
	text('Click to start playing!', width / 2, height * 0.25);
	let btnW = 280, btnH = 70; // 幅を280pxに調整
	let btnY = [0.45, 0.60, 0.75];
	let labels = ['Andante Play', 'Moderato Play', 'Presto Play'];
	for (let i = 0; i < 3; i++) {
		let x = width / 2, y = height * btnY[i];
		// ボタン色
		fill(40);
		stroke(255);
		strokeWeight(3);
		rect(x, y, btnW, btnH, 18);
		fill(255);
		noStroke();
		textSize(32);
		text(labels[i], x, y);
	}
}

function drawKeys() {
	for (let i = 0; i < NUM_KEYS; i++) {
		let area = soundAreas[i];
		// 高さを80%に
		let keyH = area.h * 0.8;
		let keyY = area.y + area.h * 0.1;
		// キー押下時の色分岐（keyIsDownで現在の状態を直接チェック）
		let keyChar = KEYBOARD_KEYS[i];
		let isKeyDown = keyIsDown(keyChar.charCodeAt(0));
		if (isKeyDown) {
			fill(255);
			stroke(255);
		} else {
			fill(30);
			stroke(255);
		}
		strokeWeight(2);
		rect(area.x, keyY, area.w - 4, keyH, 10);
		// テキスト色分岐
		if (isKeyDown) {
			fill(0);
		} else {
			fill(255);
		}
		noStroke();
		textSize(24);
		text(area.label, area.x, keyY);
		textSize(14);
		text(KEYBOARD_KEYS[i], area.x, keyY + keyH / 2 - 10);
	}
	// 現在の音色を表示
	fill(255);
	textSize(16);
	textAlign(RIGHT, TOP);
	text('Change the sound profile with the spacebar', width - 20, 20);
	text('Sound: ' + currentWaveform, width - 20, 45);
	textAlign(CENTER, CENTER); // 他のテキストに影響しないよう戻す
}

function drawJudgeLine() {
	// 判定ラインを少し上げて、下部オブジェクトに重ならない位置に
	let y = height * JUDGE_LINE_Y;
	push();
	fill(30);
	// 音色に合わせて判定ラインの色を変更
	let lineColor;
	switch(currentWaveform) {
		case 'sine':
			lineColor = color(255); // 白
			break;
		case 'square':
			lineColor = color(0, 150, 255); // 青
			break;
		case 'triangle':
			lineColor = color(0, 255, 100); // 緑
			break;
		case 'sawtooth':
			lineColor = color(255, 50, 50); // 赤
			break;
		default:
			lineColor = color(255);
	}
	stroke(lineColor);
	strokeWeight(3);
	rectMode(CENTER);
	rect(width / 2, y, width, NOTE_H, NOTE_RADIUS);
	pop();
}

function drawNotes() {
	for (let note of notes) {
		noFill();
		stroke(note.color);
		strokeWeight(4);
		rect(note.x, note.y, NOTE_W, NOTE_H, NOTE_RADIUS);
	}
}

function drawHitEffects() {
	for (let i = hitEffects.length - 1; i >= 0; i--) {
		let eff = hitEffects[i];
		eff.frame++;
		let alpha = map(eff.frame, 0, eff.maxFrame, 1, 0);
		push();
		noFill();
		stroke(eff.color.levels[0], eff.color.levels[1], eff.color.levels[2], 255 * alpha);
		strokeWeight(4 + eff.frame * 2);
		rect(eff.x, eff.y, NOTE_W + eff.frame * 8, NOTE_H + eff.frame * 8, NOTE_RADIUS + eff.frame * 2);
		pop();
		if (eff.frame > eff.maxFrame) hitEffects.splice(i, 1);
	}
}

function drawJudge() {
	if (frameCount - lastJudgeFrame < 30 && lastJudge) {
		let c = lastJudge === 'Perfect' ? '#0ff' : lastJudge === 'Good' ? '#ff0' : '#f44';
		fill(c);
		textSize(40);
		text(lastJudge, width / 2, height * JUDGE_LINE_Y - 60);
	}
}

function spawnNotes() {
	noteTimer++;
	if (noteTimer >= NOTE_INTERVAL) {
		let keyIdx = floor(random(NUM_KEYS));
		let x = soundAreas[keyIdx].x;
		colorMode(HSL, 360, 100, 100, 1);
		let noteColor = color(random(360), 80, 60, 1);
		colorMode(RGB, 255);
		notes.push({ x, y: -NOTE_H, keyIdx, hit: false, color: noteColor });
		noteTimer = 0;
	}
}

function updateNotes() {
	let judgeLineY = height * JUDGE_LINE_Y;
	for (let i = notes.length - 1; i >= 0; i--) {
		let note = notes[i];
		note.y += NOTE_SPEED;
		// 判定ラインを過ぎたら消す
		if (note.y - NOTE_H / 2 > judgeLineY + NOTE_H / 2) {
			notes.splice(i, 1);
			continue;
		}
		// ヒット済みノーツは消す
		if (note.hit) {
			// ヒットエフェクト追加
			hitEffects.push({
				x: note.x,
				y: note.y,
				color: note.color,
				frame: 0,
				maxFrame: 18
			});
			notes.splice(i, 1);
		}
	}
}

function mousePressed() {
	if (gameState === 'select') {
		// 難易度ボタン判定
		let btnW = 280, btnH = 70; // 幅を280pxに調整
		let btnY = [0.45, 0.60, 0.75];
		let labels = ['Andante Play', 'Moderato Play', 'Presto Play'];
		let difficulties = ['Easy', 'Normal', 'Hard'];
		for (let i = 0; i < 3; i++) {
			let x = width / 2, y = height * btnY[i];
			if (
				mouseX > x - btnW / 2 && mouseX < x + btnW / 2 &&
				mouseY > y - btnH / 2 && mouseY < y + btnH / 2
			) {
				selectedDifficulty = difficulties[i];
				NOTE_INTERVAL = DIFFICULTY_SETTINGS[selectedDifficulty].interval;
				gameState = 'play';
				break;
			}
		}
		return;
	}
	for (let i = 0; i < NUM_KEYS; i++) {
		if (isMouseInKey(i)) {
			handleKeyHit(i);
		}
	}
}

function keyPressed() {
	// スペースキーで音色切り替え（循環）
	if (keyCode === 32) { // スペースキー
		let currentIndex = waveformOrder.indexOf(currentWaveform);
		let nextIndex = (currentIndex + 1) % waveformOrder.length;
		currentWaveform = waveformOrder[nextIndex];
		return;
	}
	let idx = KEYBOARD_KEYS.findIndex(k => k === key.toUpperCase());
	if (idx >= 0 && idx < NUM_KEYS) {
		handleKeyHit(idx);
	}
}

function isMouseInKey(i) {
	let area = soundAreas[i];
	return (
		mouseX > area.x - area.w / 2 &&
		mouseX < area.x + area.w / 2 &&
		mouseY > area.y - area.h / 2 &&
		mouseY < area.y + area.h / 2
	);
}

function handleKeyHit(idx) {
	// 最も近い未ヒットノーツを探す
	for (let note of notes) {
		if (note.keyIdx === idx && !note.hit) {
			let judgeLineY = height * JUDGE_LINE_Y;
			let dy = abs(note.y - judgeLineY);
			if (dy < NOTE_H) {
				note.hit = true;
				playKeySound(idx);
				break;
			}
		}
	}
}

function playKeySound(idx) {
	let osc = new p5.Oscillator(currentWaveform);
	osc.freq(FREQS[idx]);
	osc.amp(0);
	osc.start();
	// 余韻を長めに
	osc.amp(0.5, 0.05);
	osc.amp(0, 1.0, 0.2); // 1秒かけて減衰
	osc.stop(1.2);
}

function judge(result) {
	lastJudge = result;
	lastJudgeFrame = frameCount;
}