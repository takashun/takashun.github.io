const color_array = ['aqua', 'aquamarine', 'cadetblue', 'chartreuse', 'chocolate', `coral`, `crimson`, `cyan`,
    `darkorange`, `darkorchid`, `darkturquoise`, `fuchsia`, `gold`, `greenyellow`, `lawngreen`, `lime`,
    `mediumspringgreen`, `orange`, `orangered`, `red`, `springgreen`, `turquoise`, `yellow`];
function nibun() {
    const func01 = document.main.func_y.value;
    xmin = eval(document.main.xmin.value);
    xmax = eval(document.main.xmax.value);
    ymin = eval(document.main.ymin.value);
    ymax = eval(document.main.ymax.value);
    interval = eval(document.main.interval.value);
    EPS = eval(document.main.eps.value);

    let a = eval(document.main.nibun_a.value);
    let b = eval(document.main.nibun_b.value);

    let y_pos = ymax - 0.1;
    const variation = 0.1;
    let c;

    let count = 0;

    //グラフの目盛りとグラフの描写
    graph_init(func01, xmin, xmax, ymin, ymax);

    let timerId = setInterval(async function() {
        c = (a + b) / 2.0; // 2分計算

        y_pos = y_pos - variation;
        const color = color_array[Math.floor(Math.random() * color_array.length)];
        drawLine(a, y_pos, b, y_pos, color, 2, [4,2]);
        drawLine(c, y_pos, c, y_pos - variation, color, 2);

        if (func_y(c, func01) * func_y(a, func01) < 0) b = c; // 式(1.2)
        else a = c; // 式(1.3)

        console.log(c);

        if(!(Math.abs(a - b) > EPS)) { // 収束判別　式(1.4)の変形
            clearInterval(timerId);
            drawPoint(c, 0, "red", 6);
            await sleep(500);
            window.alert("二分法での実行回数は、" + count + "回でした。");
        }
        count++;
    }, interval);
}

function newton() {
    const func01 = document.main.func_y.value;
    xmin = eval(document.main.xmin.value);
    xmax = eval(document.main.xmax.value);
    ymin = eval(document.main.ymin.value);
    ymax = eval(document.main.ymax.value);
    interval = eval(document.main.interval.value);
    EPS = eval(document.main.eps.value);

    let a = eval(document.main.newton_a.value);
    const func02 = document.main.func_z.value;

    let b;

    let count = 0;

    //グラフの目盛りとグラフの描写
    graph_init(func01, xmin, xmax, ymin, ymax);

    let timerId = setInterval(async function() {
        b = a - func_y(a, func01) / func_z(a, func02); // 式(1.9)

        const color = color_array[Math.floor(Math.random() * color_array.length)];
        drawLine(a, func_y(a, func01), b, 0, color, 2);
        drawLineArrow(b, 0, b, func_y(b, func01), color, 2, "end", [4,2])

        console.log(b);

        if(!Math.abs(a - b) < EPS) { // 収束判定
            a = b;

            count++;
        }
        else {
            clearInterval(timerId);
            drawPoint(b, 0, "red", 6);
            await sleep(500);
            window.alert("ニュートン法での実行回数は、" + count + "回でした。");
        }
    }, interval);
}

function func_y(x, func01) {
    return eval(func01);
}

function func_z(x, func02) {
    return 3.0 * Math.pow(x, 2.0) + 1.0;
}

function graph_init(func01, xmin, xmax, ymin, ymax) {
    let x, y, x0, y0, dx;
    // ＸＹ座標系の設定
    cw = 600; ch = 600;
    setCanvas("canvas1", "black");
    drawLine(xmin, 0, xmax,0, "aqua", 1);
    drawLine(0, ymin, 0, ymax, "aqua", 1);
    drawAxisScale(xmin + 1, xmax - 1, ymin + 1, ymax - 1, "white");
    //　初期値設定
    dx = (xmax - xmin)/100;
    x = xmin;
    x0 = x;
    y0 = eval(func01);

    while(true) {
        x = x + dx;
        if(x>xmax) break;
        y = eval(func01);
        drawLine(x0, y0, x, y, "white", 4);
        x0 = x;
        y0 = y;
    }
}

function sleep(msec) {
    return new Promise(function(resolve) {
        setTimeout(function() {resolve()}, msec);
    })
}
