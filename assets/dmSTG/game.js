/*プレイページの処理*/
/*class*/
class ballStatus {
    /*玉の状態クラス*/
    constructor(x, y, angle, radius, speed, color) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.radius = radius;
        this.speed = speed;
        this.color = color;
        this.time = 0;
    }

    process(id) {
        this.x += Math.cos(this.angle) * this.speed(this.time);
        this.y += Math.sin(this.angle) * this.speed(this.time);
        drawCircle(this.x, this.y, this.radius, 2, "#ffffff", this.color(this.time));
        if (this.x < 0 - this.radius || this.x > mainCanvas.width + this.radius || this.y < 0 - this.radius || this.y > mainCanvas.height + this.radius) {
            ball.splice(id, 1);
        }
        let distance = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2))
        if (distance < this.radius) {
            if (!key[7] & player.life > 0) player.life--;
            ball.splice(id, 1);
        } else if (distance < 20 + this.radius) {
            score += 1;
            can2d.globalAlpha = 0.2;
            drawCircle(player.x, player.y, 16, 2, "None", "#fff");
            can2d.globalAlpha = 1;
        }
        this.time++;
    }
}
class patternTemp {
    /*パターン用*/
    constructor(angle, branch, interval, speed, color, size) {
        this.angle = angle;
        this.branch = branch;
        this.interval = interval;
        this.speed = speed;
        this.color = color;
        this.size = size;
    }
}
class enemyTemp {
    /*敵用*/
    constructor(hp, ballPattern, moveFunctionX, moveFunctionY, ballColor, name) {
        this.x = 0;
        this.y = 0;
        this.size = player.size;
        this.hp = hp;
        this.fullHp = hp;
        this.gage = "#ff0000";
        this.time = 0;
        this.ballPattern = ballPattern;
        this.moveFunctionX = moveFunctionX;
        this.moveFunctionY = moveFunctionY;
        this.ballColor = ballColor;
    }

    draw() {
        drawRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size, 4, "#ffff00", "#ff0000");
        can2d.beginPath();
        can2d.arc(this.x, this.y, 30, (2 * Math.PI / this.fullHp) * this.hp * -1 + Math.PI * 1.5, Math.PI * 1.5, false);
        can2d.lineWidth = 6;
        can2d.strokeStyle = this.gage;
        can2d.stroke();
        can2d.lineWidth = 2;
        can2d.strokeStyle = "#ffffff";
        can2d.stroke();
    }

    process(enemyId) {
        let nowId = this.ballPattern;
        this.x = this.moveFunctionX(this.time);
        this.y = this.moveFunctionY(this.time);
        for (let i = 0; i < nowId.length; i++) {
            if (this.time % pattern[nowId[i](this.time)].interval == 1) {
                let b_angle = pattern[nowId[i](this.time)].angle(this.time, enemyId);
                for (let j = 0; j < pattern[nowId[i](this.time)].branch; j++) {
                    ball.push(new ballStatus(this.x, this.y, 2 * Math.PI * j / pattern[nowId[i](this.time)].branch + b_angle, pattern[nowId[i](this.time)].size, pattern[nowId[i](this.time)].speed, this.ballColor[i]));
                }
            }
        }
        this.time++;
    }
}
class Remain {
    /*マウス残像*/
    constructor(rt, rx, ry) {
        this.rt = rt;
        this.rx = rx;
        this.ry = ry;
    }
    increment(num) {
        if (this.rt > 0 & key[5] == false) this.rt += num;
        if (this.rt >= 100) this.rt = 0;
    }
}

/*変数定義部*/
let time = 0;
let mode = 0;
let score = 0;
let selector = 0;
let sel_wait = 0;
let nowEnemysId = 0;
let key = [false, false, false, false, false, false, false];
let mouse = {
    x: 0,
    y: 0,
    rem: []
}
let enemy = [];
let ball = [];
let pattern = [];
/*player定義*/
let player = {
    x: 400,
    y: 500,
    speed: 2,
    size: 16,
    life: 0,
    ball: []
}

/*タイトル文字*/
let title = "空中楼閣";

/*出る敵*/
let spawnEnemy = [
    [13],
    [1, 2],
    [6, 1, 7],
    [3, 4],
    [5],
    [8],
    [9, 10, 11, 12],
    [14], [15], [16], [17], [18], [19], [20], [21], [22]
];
let nowEnemy = spawnEnemy[nowEnemysId];   //初めの敵
/*弾幕パターン定義*/
/*00*/pattern.push(new patternTemp((time, id) => 0, 0, 0, () => 0, "#000000", 0));
/*01*/pattern.push(new patternTemp((time, id) => Math.PI / 180 * (time * 2), 1, 5, () => 2, "#ff0000", 10));
/*02*/pattern.push(new patternTemp((time, id) => Math.PI / 180 * ((time - 90) * -2), 1, 5, () => 2, "#0000ff", 10));
/*03*/pattern.push(new patternTemp((time, id) => Math.PI / 180 * ((time - 90) * -2), 1, 5, () => 2, "#00ff00", 10));
/*04*/pattern.push(new patternTemp((time, id) => Math.PI / 180 * ((time - 90) * -2), 1, 5, () => 2, "#ff00ff", 10));
/*05*/pattern.push(new patternTemp((time, id) => Math.PI / 180 * ((time - 90) * -2), 1, 5, () => 2, "#00ffff", 10));
/*06*/pattern.push(new patternTemp((time, id) => Math.PI / 180 * ((time - 90) * -2), 1, 5, () => 2, "#a000ff", 10));
/*07*/pattern.push(new patternTemp((time, id) => Math.PI / 180 * (time * 2) + Math.PI / 2, 1, 8, () => 4, "#ff007f", 10));
/*08*/pattern.push(new patternTemp((time, id) => Math.PI / 180 * (time * 2) + Math.PI, 1, 8, () => 4, "#00ffff", 10));
/*09*/pattern.push(new patternTemp((time, id) => Math.PI / 180 * (time * 2) - Math.PI / 2, 1, 8, () => 4, "#ff00ff", 10));
/*10*/pattern.push(new patternTemp((time, id) => Math.PI / 180 * (time * 2), 1, 8, () => 4, "#7f00ff", 10));
/*11*/pattern.push(new patternTemp((time, id) => time * time, 3, 20, () => 0.3, "#000000", 10));
/*12*/pattern.push(new patternTemp((time, id) => Math.atan2((player.y - enemy[id].y), (player.x - enemy[id].x)), 6, 40, () => 0.8, "#000000", 10));
/*13*/pattern.push(new patternTemp((time, id) => Math.floor(Math.random() * 3142) * 0.001, 70, 100, () => 0.5, "#000000", 10));
/*14*/pattern.push(new patternTemp((time, id) => Math.atan2((player.y - enemy[id].y), (player.x - enemy[id].x)) + Math.floor(Math.random() * 3) - 1, 8, 10, () => 0.6, "#000000", 10));
/*15*/pattern.push(new patternTemp((time, id) => time / 15, 6, 10, () => 0.8, "#000000", 10));
/*16*/pattern.push(new patternTemp((time, id) => time * 60, 30, 60, () => 0.8, "#000000", 10));
/*17*/pattern.push(new patternTemp((time, id) => Math.atan2((player.y - enemy[id].y), (player.x - enemy[id].x)), 1, 45, () => 0.8, "#000000", 20));
/*18*/pattern.push(new patternTemp((time, id) => time * time * 4, 6, 15, () => 0.5, "#000000", 10));
/*19*/pattern.push(new patternTemp((time, id) => time * time * 2, 6, 15, () => 0.5, "#000000", 10));
/*patTemp定義 => 軌道,又数,間隔,速度,色彩,大きさ*/

/*敵定義*/
/*00*/enemy.push(new enemyTemp(0, [() => 0], () => 0, () => 0, [() => "#000"], "null"));
/*01*/enemy.push(new enemyTemp(2, [() => 1], time => Math.sin(time / 100) * 400 + 400, time => 100, [() => "#f00"], "01"));
/*02*/enemy.push(new enemyTemp(2, [() => 2], time => Math.sin((time + 16) / 100) * 400 + 400, time => 100, [() => "#00f"], "02"));
/*03*/enemy.push(new enemyTemp(10, [() => 2], time => Math.abs(800 - time % 1600), time => {
    let temp = (xtime) => Math.abs(xtime, 10) + Math.abs(2 * xtime);
    return temp((Math.abs(800 - time % 1600) / 340.5) - (400 / 340.5)) * -34 + 250;
}, [() => "#00f"], "03"));
/*04*/enemy.push(new enemyTemp(2, [() => 3], time => Math.abs(800 - (time + 800) % 1600), time => Math.sin(Math.abs(800 - (time + 800) % 1600) / 10) * -20 + 100, [() => "#0f0"], "04"));
/*05*/enemy.push(new enemyTemp(20, [() => 4], time => Math.abs(800 - (time + 800) % 1600), time => Math.sin(Math.abs(800 - (time + 800) % 1600) / 10) * -20 + 100, [() => "#f0f"], "05"));
/*06*/enemy.push(new enemyTemp(10, [() => 5], time => Math.abs(800 - (time + 800) % 1600), time => {
    let temp = (xtime) => Math.abs(xtime, 10) + Math.abs(2 * xtime);
    return temp((Math.abs(800 - (time + 800) % 1600) / 340.5) - (400 / 340.5)) * -34 + 250;
}, [() => "#0ff"], "06"));
/*07*/enemy.push(new enemyTemp(2, [() => 6], time => Math.sin(time / 100) * 100 + 400, time => Math.cos(time / 100) * 100 + 100, [() => "#a0f"], "07"));
/*08*/enemy.push(new enemyTemp(60, [() => 6], time => Math.abs(800 - (time + 800) % 1600), time => {
    let temp = (xtime) => Math.abs(xtime, 10) + Math.abs(2 * xtime);
    return temp((Math.abs(800 - (time + 800) % 1600) / 340.5) - (400 / 340.5)) * -34 + 250;
}, [() => "#a0f"], "08"));
/*09*/enemy.push(new enemyTemp(4, [time => 7 * (time > 350)], time => 400, time => Math.sin(time / 50) * 200 + 240, [() => "#f07"], "4a"));
/*10*/enemy.push(new enemyTemp(4, [time => 8 * (time > 350)], time => Math.sin((time + 40) / 50) * 200 / Math.sqrt(2) + 400, time => Math.sin((time + 40) / 50) * 200 / Math.sqrt(2) + 240, [() => "#0ff"], "4b"));
/*11*/enemy.push(new enemyTemp(4, [time => 9 * (time > 350)], time => Math.sin((time - 40) / 50) * -200 / Math.sqrt(2) + 400, time => Math.sin((time - 40) / 50) * 200 / Math.sqrt(2) + 240, [() => "#f0f"], "4c"));
/*12*/enemy.push(new enemyTemp(4, [time => 10 * (time > 350)], time => Math.sin((time + 80) / 50) * 200 + 400, time => 240, [() => "#70f"], "4d"));
/*13*/enemy.push(new enemyTemp(10, [() => 0], () => 400, time => Math.tanh(time / 100) * 240 + Math.sin(time / 50) * (Math.tanh(time / 100)) * 10, [() => "#000"], "00"));
/*14*/enemy.push(new enemyTemp(100, [time => 11 * (time > 200)], time => Math.tanh(time / 100) * 400, time => Math.tanh(time / 100) * 300, [() => "#f0f"], "guest1"));
/*15*/enemy.push(new enemyTemp(100, [time => 12 * (time > 200)], time => 800 - Math.tanh(time / 100) * 400, time => Math.tanh(time / 100) * 300, [() => "#f70"], "guest2"));
/*16*/enemy.push(new enemyTemp(100, [time => 13 * (time > 200)], time => Math.tanh(time / 100) * 400, () => 0, [() => "#00f"], "guest3"));
/*17*/enemy.push(new enemyTemp(100, [time => 14 * (time > 200)], time => Math.tanh(time / 100) * 400, time => Math.tanh(time / 100) * 150, [() => "#0ff"], "guest4"));
/*18*/enemy.push(new enemyTemp(100, [time => 15 * (time > 200)], time => Math.tanh(time / 100) * 400, () => 300, [() => "#f00"], "guest5"));
/*19*/enemy.push(new enemyTemp(100, [time => 16 * (time > 200)], time => Math.tanh(time / 100) * 100, time => Math.tanh(time / 100) * 75, [() => "#ff0"], "guest6"));
/*20*/enemy.push(new enemyTemp(100, [time => 17 * (time > 200)], time => 800 - Math.tanh(time / 100) * 800, time => 600 - Math.tanh(time / 100) * 600, [() => "#0f0"], "guest7"));
/*21*/enemy.push(new enemyTemp(100, [time => 18 * (time > 200)], time => Math.tanh(time / 100) * 400, time => Math.tanh(time / 100) * 300, [() => "#7f0"], "guest8"));
/*22*/enemy.push(new enemyTemp(100, [time => 19 * (time > 200)], time => 800 - Math.tanh(time / 100) * 400, time => 600 - Math.tanh(time / 100) * 300, [() => "#70f"], "guest9"));
/*eneTemp => HP,弾パターン,x座標関数,y座標関数,色,名前(?)*/

function start() {
    /*変数定義部*/
    time = 0;
    mode = 0;
    selector = 0;
    score = 0;
    sel_wait = 0;
    nowEnemysId = 0;
    nowEnemy = spawnEnemy[nowEnemysId];
    ball = [];
    player = {
        x: 400,
        y: 500,
        speed: 2,
        size: 16,
        life: 5,
        ball: []
    }
    for (let i = 0; i < enemy.length; i++) {
        enemy[i].hp = enemy[i].fullHp;
        enemy[i].time = 0;
    }
}

/*canvas処理*/
//document.getElementById('main').width = document.documentElement.clientWidth;
//document.getElementById('main').height = document.documentElement.clientHeight;
let mainCanvas = document.getElementById('main');
let can2d = mainCanvas.getContext('2d');
if (document.getElementById('main').getContext) {
    player.life = 5;
    setInterval('drawLoop()', 10);
}
/*===============================================================================================================================*/
/*ループ*/
function drawLoop() {
    keyPush();
    can2d.lineWidth = 0;
    if (mode == 0) {
        drawBack(0, "#000");
        can2d.globalCompositeOperation = "lighter";
        can2d.shadowColor = "#8080f0";
        can2d.shadowOffsetX = 0;
        can2d.shadowOffsetY = 0;
        can2d.shadowBlur = 50;
        drawEllipse(510, 175, 256, 16, 0, "#505070", "#000000");
        can2d.globalCompositeOperation = "source-over";
        can2d.shadowBlur = 0;
        can2d.fillStyle = "#ffffff";
        can2d.font = "100px 'ＭＳ 明朝'";
        if (title.length > 4 & title.length < 8) for (let i = 0; i < title.length - 4; i++) can2d.fillText(title[i], 320 - (title.length - 4 - i) * 100, 170 + Math.sin(i) * 40);
        if (title.length > 3) can2d.fillText(title[title.length - 4], 320, 170);
        if (title.length > 2) can2d.fillText(title[title.length - 3], 420, 150);
        if (title.length > 0) can2d.fillText(title[title.length - 1], 620, 180);
        can2d.fillStyle = "#ff0000";
        if (title.length > 1) can2d.fillText(title[title.length - 2], 520, 200);
        can2d.fillStyle = "#ffffff";
        can2d.font = "20px 'Meiryo'";
        can2d.fillText("矢印：選択　/　Z：決定", 10, 590);
        can2d.font = "50px 'Meiryo'";
        if (selector % 2 == 0) {
            can2d.fillStyle = "#ff0000";
            can2d.fillText("Start", 75, 300);
            can2d.fillStyle = "#ff9090";
            can2d.fillText("Info", 125, 350);
            drawRect(75, 300, 200, 5, 0, "#ff0000", "#000000");
        } else {
            can2d.fillStyle = "#ff9090";
            can2d.fillText("Start", 75, 300);
            can2d.fillStyle = "#ff0000";
            can2d.fillText("Info", 125, 350);
            drawRect(125, 350, 150, 5, 0, "#ff0000", "#000000");
        }
    }
    if (mode == 1) {
        drawBack(0, "#070707");
        playerBall();
        drawRect(player.x - player.size / 2, player.y - player.size / 2, player.size - 2, player.size - 2, 6, "#0000ff", "#00ffff");
        enemysProcess();
        for (let i = 0; i < player.life; i++) drawCircle(8 + 16 * i, 8, 8, 0, "#ffefef", "#000000");
        can2d.fillStyle = "ff9090";
        can2d.font = "20px 'Meiryo'";
        can2d.fillText("score：" + score, 0, 32);
        if (player.life == 0) {
            for (let i = 0; i < enemy.length; i++) enemy[i].time = 0;
            for (let i = 0; i < pattern.length; i++) pattern[i].time = 0;
            mode = 2;
        }
        if (mouse.rem.length !== 0) for (let i = 0; i < mouse.rem.length; i++) { mouse.rem.shift(); continue; }
    }
    if (mode == 2) {
        drawBack(0, "#000");
        can2d.fillStyle = "#ff0000";
        can2d.font = "100px Meiryo";
        can2d.fillText("Game over", 110, 200);
        can2d.fillStyle = "#ffffff";
        can2d.font = "80px Meiryo";
        can2d.fillText("score:" + score, 110, 350);
        can2d.font = "20px Meiryo";
        can2d.fillText("X：タイトルに戻る", 50, 590);
    }
    if (mode == 3) {
        drawBack(0, "#000");
        can2d.fillStyle = "#f00";
        can2d.font = "30px Meiryo";
        can2d.fillText("ルール", 50, 50);
        can2d.fillStyle = "#fff";
        can2d.fillText("　GameOverまで敵を倒す", 50, 80);
        can2d.fillText("　敵を倒すとscore加点(左上に数値)", 50, 110);
        can2d.fillText("　敵に当たると残機減(左上に丸)", 50, 140);
        can2d.fillText("　残機がなくなるとGameOver", 50, 170);
        can2d.fillStyle = "#f00";
        can2d.fillText("操作方法", 50, 230);
        can2d.fillStyle = "#fff";
        can2d.fillText("　矢印キー：移動", 50, 260);
        can2d.fillText("　　　　Ｚ：弾を出す", 50, 290);
        can2d.fillText("　     Shift：低速移動", 50, 320);
        drawRect(10, 570, 100, 25, 0, "#555", "#000")
        can2d.font = "20px Meiryo";
        can2d.fillText("<<X:戻る", 10, 590);
    }
    if (mode !== 1) {
        drawCircle(mouse.x, mouse.y, 6, 2, "None", "#f00");
        for (let i = 0; i < mouse.rem.length; i++) {
            can2d.globalAlpha = (100 - mouse.rem[i].rt) / 100;
            drawCircle(mouse.rem[i].rx, mouse.rem[i].ry, mouse.rem[i].rt / 2, 2, "None", "#f00");
            can2d.globalAlpha = 1;
            mouse.rem[i].increment(2);
            if (mouse.rem[i].rt == 0) { mouse.rem.shift(); continue; }
        }
    }
    time++;
}
/*===============================================================================================================================*/
/*key処理*/
addEventListener('keydown', function (e) {
    for (let i = 0; i < 4; i++) {
        if (e.keyCode == 37 + i) key[i] = true;
    }
    if (e.keyCode == 90) key[4] = true;
    if (e.keyCode == 16) key[5] = true;
    if (e.keyCode == 88) key[6] = true;
    if (e.keyCode == 48) key[7] = true;
}, false);
addEventListener('keyup', function (e) {
    for (let i = 0; i < 4; i++) {
        if (e.keyCode == 37 + i) key[i] = false;
    }
    if (e.keyCode == 90) key[4] = false;
    if (e.keyCode == 16) key[5] = false;
    if (e.keyCode == 88) key[6] = false;
    if (e.keyCode == 48) key[7] = false;
}, false);
addEventListener('mousemove', function (e) {
    mouse.x = e.x;
    mouse.y = e.y - 30;
}, false);

addEventListener('click', function (e) {
    mouse.rem.push(new Remain(1, mouse.x, mouse.y));
    if (mode == 0) {
        /*タイトル画面*/
        if (75 <= mouse.x & mouse.x <= 275 & 255 <= mouse.y & mouse.y <= 305) { selector = 0; mode = 1; }
        if (125 <= mouse.x & mouse.x <= 325 & 305 <= mouse.y & mouse.y <= 355) { selector = 1; mode = 3; }
    }
    if (mode == 1) {
        /*プレイ画面*/
    }
    if (mode == 2) {
        /*オワリ画面*/
    }
    if (mode == 3) {
        /*説明画面*/
        if (10 <= mouse.x & mouse.x <= 110 & 570 <= mouse.y & mouse.y <= 595) { mode = 0; }
    }
}, false);
function keyPush() {
    if (mode == 0) {
        if (key[0] & sel_wait == 0) {
            if (selector > 0) {
                selector -= 1;
            } else {
                selector = 1;
            }
            sel_wait = 20;
        }
        if (key[1] & sel_wait == 0) {
            if (selector > 0) {
                selector -= 1;
            } else {
                selector = 1;
            }
            sel_wait = 20;
        }
        if (key[2] & sel_wait == 0) {
            selector += 1;
            sel_wait = 20;
        }
        if (key[3] & sel_wait == 0) {
            selector += 1;
            sel_wait = 20;
        }
        if (key[4] & sel_wait == 0) {
            if (selector % 2 == 0) mode = 1;
            if (selector % 2 == 1) mode = 3;
        }
        if (sel_wait > 0) sel_wait -= 1;
    }
    if (mode == 1) {
        for (let i = 0; i < 4; i++) {
            player.x += ((i - 1) * (1 - i % 2)) * (key[i] * (player.x * (i - 1) < 800 * (i / 2) - player.size / 2)) * player.speed;
            player.y += ((i - 2) * (i % 2)) * (key[i] * (player.y * (i - 2) < 600 * ((i - 1) / 2) - player.size / 2)) * player.speed;
        }
        if (key[4] & time % 5 == 0) player.ball.push({ x: player.x, y: player.y });
        if (key[5]) {
            player.speed = 1;
        } else {
            player.speed = 2;
        }
    }
    if (mode == 2) {
        if (key[6]) {
            mode = 0;
            start();
        }
    }
    if (mode == 3) {
        if (key[6]) mode = 0;
    }
}
/*プレイヤーボール*/
function playerBall() {
    for (let i = 0; i < player.ball.length; i++) {
        drawCircle(player.ball[i].x, player.ball[i].y, 10, 2, "#0000ff", "#ffffff");
        player.ball[i].y -= 16;
        if (player.ball[i].y < -5) {
            player.ball.splice(i, 1);
            continue;
        }
        for (let j = 0; j < nowEnemy.length; j++) {
            let theEnemy = enemy[nowEnemy[j]];
            let distance = Math.pow(theEnemy.x - player.ball[i].x, 2) + Math.pow(theEnemy.y - player.ball[i].y, 2);
            if (distance < 128) {
                theEnemy.hp--;
                if (theEnemy.hp <= 0) {
                    nowEnemy = nowEnemy.slice(0, j).concat(nowEnemy.slice(j + 1));
                    theEnemy.time = 0;
                    theEnemy.hp = theEnemy.fullHp;
                    score += theEnemy.fullHp * 100;
                }
            }
        }//<<for j
        /*場の敵がいなくなった場合*/
        if (nowEnemy.length == 0) {
            nowEnemysId += 1;
            if (nowEnemysId == spawnEnemy.length) {
                //nowEnemysId = 0;
                /*全パターン攻略ごとにランダムに一パターン追加*/
                var howmany = Math.floor(Math.random() * Math.floor(4));
                spawnEnemy.push([Math.floor(Math.random() * Math.floor(enemy.length - 1)) + 1]);
                for (let j = 0; j < howmany; j++) {
                    let in_enemy;
                    do { in_enemy = Math.floor(Math.random() * Math.floor(enemy.length - 1)) + 1; } while (spawnEnemy[spawnEnemy.length - 1].includes(in_enemy));
                    spawnEnemy[spawnEnemy.length - 1].push(in_enemy);
                }
            }//<<if (nowEnemysId == spawnEnemy.length)
            nowEnemy = spawnEnemy[nowEnemysId];
        }//<<if (nowEnemy.length == 0)
    }//<<for i
}//<<func playerBall
/*enemys*/
function enemysProcess() {
    for (let i = 0; i < nowEnemy.length; i++) {
        enemy[nowEnemy[i]].process(nowEnemy[i]);
    }
    for (let i = 0; i < ball.length; i++) {
        ball[i].process(i);
    }
    for (let i = 0; i < nowEnemy.length; i++) {
        enemy[nowEnemy[i]].draw();
    }
}
/*背景*/
function drawBack(mode, color, other) {
    var old_color = can2d.fillStyle;
    can2d.fillStyle = color;
    can2d.fillRect(0, 0, 800, 600);
    if (mode == 1) {
        can2d.fillStyle = other.color;
        can2d.fillRect(other.x, other.y, other.w, other.h);
    }
    can2d.fillStyle = old_color;
}
/*四角の描画短縮化関数*/
function drawRect(sx, sy, ex, ey, border, inColor, outColor) {
    var old_color = can2d.fillStyle;
    can2d.fillStyle = inColor;
    can2d.fillRect(sx, sy, ex, ey);
    if (border !== 0) {
        can2d.lineWidth = border;
        can2d.strokeStyle = outColor;
        can2d.strokeRect(sx, sy, ex, ey);
    }
    can2d.fillStyle = old_color;
}
/*円の描画短縮化関数*/
function drawCircle(sx, sy, radius, border, inColor, outColor) {
    var old_color = can2d.fillStyle;
    can2d.beginPath();
    can2d.arc(sx, sy, radius, 0, Math.PI * 2, true);
    can2d.closePath();
    if (inColor !== "None") {
        can2d.fillStyle = inColor;
        can2d.fill();
    }
    if (border !== 0) {
        can2d.lineWidth = border;
        can2d.strokeStyle = outColor;
        can2d.stroke();
    }
    can2d.fillStyle = old_color;
}
/*楕円のアレ*/
function drawEllipse(sx, sy, radx, rady, border, inColor, outColor) {
    var old_color = can2d.fillStyle;
    can2d.beginPath();
    can2d.ellipse(sx, sy, radx, rady, 0, 0, Math.PI * 2);
    can2d.closePath();
    can2d.fillStyle = inColor;
    can2d.fill();
    if (border !== 0) {
        can2d.lineWidth = border;
        can2d.strokeStyle = outColor;
        can2d.stroke();
    }
    can2d.fillStyle = old_color;
}