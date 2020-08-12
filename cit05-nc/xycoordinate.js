// xycoordinate.js
// ＝＝＝＝＝Ｘ－Ｙ軸系ＣＡＮＶＡＳ＝＝＝＝＝　作成者　木暮仁
// ＨＴＭＬ５のＣＡＮＶＡＳ関連のJavaScript関数は、左上が原点でｙが増加すると下に下がる。
// ここでは、数学系の処理を容易にするために、画素数 cw*ch の物理的CANVASを、
// 左下 (xmin,ymin)、右上 (xmax,ymax) の仮想WINDOWとして取り扱えるようにしたものである。
//
// ●重要！！
// 利用条件（それぞれの関数を呼び出す以前に）
// １　cw,ch (HTMLのcanvasタグで設定したcanvasのwidthとheight）を定義して、
//   　setCanvas関数を呼び出しておくこと。
// ２　xmin, xmax, ymin, ymax を定義しておくこと
//　これらの６変数と「canvas」「ctx」は、xycoordinate.jsでグローバル変数にしています。
//
// 留意事項
// １　縦・横の比率が崩されないためには、xmax-xmin：ymax-ymin＝cw：ch の利率にするのが望ましい。
// ２　点表示などのキザミ幅は、画素との対応が適切なほうが画像が鮮明になる。
// 　　そのためにはxmax+xmin, ymax-ymin とcw, chが整数比にするのがよい。
//     例えば、cw = 400なのにxmin=10,xmax=27(xmax+xmin=37) などとするのは不適切である。
// 　　また、dx = (xmax+xmin)/cw*整数 とするとよい。
// ３　pointsizeやlinewidthなど、点の大きさや線の太さに関する変数の値は、画素数であり、
// 　　xminなどの仮想WINDOWの値には無関係である。
//
// 記述例
// <!DOCTYPE html>
// <head>
// <meta charset="UTF-8"></meta> （HTMLはUTF-8が望ましい)
// <script src="xycoordinate.js"></script> (このライブラリ。パスは状況により異なる）
// <script>
// function test() {
//     cw = 400;  ch = 400;　　　　　　　　　　　　　　─┬　これらの変数は必須
//     xmin = -40; xmax = 40;  ymin = -40; ymax = 40;　─┘　var をつけない！
//     setCanvas("canvas1", "black");　　──　必須　次にsetCanvasを与えるまで、すべての
//     drawPoint(20,10, "red", 6);                   functionはcanvas1を対象にする
//     drawLine(-20,-10, 15,25, "yellow", 2);
//　　　　：
//  }
// </script>
// </headl>
// <body>
// <form name="iform">
//  :
// <input type="button" value="実行" onclick="test()"></input>
// <canvas id="canvas1" width="400" height="400"></input>
// 　　　canvas1 は setCanvasのCANVAS名（任意）、widthとheightの値は、cwとchの値に一致させる
// ：
// 
//●ご利用方法
// 　あくまでも私自身のＷｅｂページ制作過程で、以降のtips用に作成したものです。
// 　適当にコピーしてご利用されても構いませんが、品質保証はしていません。
// 　著作権は私にあります。　ご利用は自由ですが、著作権の主張をしないでください。
// 
// 


  //======================================================================
  //グローバル変数

  var cw, ch;
  var xmin, xmax, ymin, ymax;
  var canvas, ctx;
  var canvasImageData; // canvasの全ピクセルの保存
  //======================================================================
  //ＣＡＮＶＡＳの定義
function setCanvas(canvasname, backcolor) {
    //描画コンテキストの取得
    canvas = document.getElementById(canvasname);
    if ( ! canvas || ! canvas.getContext ) {
      return false;
    }
    /* 2Dコンテキスト */
    ctx = canvas.getContext('2d');
    //CANVASを黒く塗りつぶす
    ctx.fillStyle = backcolor;
    ctx.beginPath();
    ctx.fillRect(0,0,cw,ch);
    ctx.stroke();
}
     //例
     //●重要！　cw = 400; ch = 400;  これを記述しておく必要あり 　 ←┐
     //setCanvas("canvas1", "black");  canvas1はidで与えたcanvas名　←┤名称と値を
     //ＨＴＭＬでは 　　　　　　　　　　　　　　　　　　　　　　　　　│一致させる
     //<canvas id="canvas1" width="400" height="400"></canvas>　　　←┘

  //========================================================================
  //画面全体を消す（１つの色で塗りつぶす）
function clearScreen(fillcolor) {
    ctx.fillStyle = fillcolor; 
    ctx.beginPath();
    ctx.fillRect(0,0, cw,ch);
    ctx.stroke();
}
     //例　画面全体（背景色）を赤にする
     // drawRect("red");

  //========================================================================
  //点に色をつける。
function drawPoint(x,y, pointcolor, pointsize) {
    var cx, cy, d;
    cx = Math.round((x-xmin)/(xmax-xmin)*cw);
    cy = Math.round((ymax-y)/(ymax-ymin)*ch);
    d = Math.floor((pointsize + 1)/2);
    ctx.fillStyle = pointcolor;
    ctx.fillRect(cx-d, cy-d, pointsize, pointsize);
}
     //例：pointsizeは画素数。の矩形）
     // drawPoint(x,y, "white", 4);

  //========================================================================
  //直線を引く
  // dash は破線指定（省略可：実線）
function drawLine(x0,y0, x1,y1, linecolor,linewidth, dash) {
    var cx0,cy0,cx1,cy1;
    cx0 = Math.round((x0-xmin)/(xmax-xmin)*cw);
    cy0 = Math.round((ymax-y0)/(ymax-ymin)*ch);
    cx1 = Math.round((x1-xmin)/(xmax-xmin)*cw);
    cy1 = Math.round((ymax-y1)/(ymax-ymin)*ch);
    ctx.strokeStyle = linecolor; //線の色 #xxxxxx でも red でもよい
    ctx.lineWidth = linewidth;   // 線の太さ 1, 2など
    if (dash !== undefined) ctx.setLineDash(dash); // 破線指定
    ctx.beginPath();
    ctx.moveTo(cx0,cy0);
    ctx.lineTo(cx1,cy1);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);  // 破線指定解除（実線に戻す）
}
     //例
     //Ｘ軸　  drawLine(0,ymin, 0,ymax, "aqua", 1);
     //破線　　drawLine(1,ymin, 1,ymax, "aqua", 1, [4,2]);

  //========================================================================
  // 矢印付きの直線を引く
  // arrow = "end" 点(x1,y1)に付ける （省略時）
  //         "start" 点(x0,y0)に付ける
  //         "both"    両点に付ける
function drawLineArrow(x0,y0, x1,y1, linecolor,linewidth, arrow, dash) {
    if (dash === undefined) drawLine(x0,y0, x1,y1, linecolor,linewidth); // ★
    else drawLine(x0,y0, x1,y1, linecolor,linewidth, dash);
    var t = Math.atan2((y1-y0), (x1-x0)); // 直線の角度
    var r = Math.sqrt((x1-x0)*(x1-x0)+(y1-y0)*(y1-y0))/10;  // 矢印の長さ
    var ax = -r;       // 矢印(0,0),(-r, 0.3r),(-r, -0.3r)
    var ay = 0.3*r;
    var t = Math.atan2((y1-y0), (x1-x0)); // 直線の角度
    if ( (arrow === undefined)||(arrow == "end")||(arrow == "both") ) {
        var up = ax*Math.cos(t) - ay*Math.sin(t) + x1;
        var vp = ax*Math.sin(t) + ay*Math.cos(t) + y1;
        var um = ax*Math.cos(t) + ay*Math.sin(t) + x1;
        var vm = ax*Math.sin(t) - ay*Math.cos(t) + y1;
        drawLine(x1,y1, up,vp, linecolor, linewidth);
        drawLine(x1,y1, um,vm, linecolor, linewidth);
    }
    if ( (arrow == "start")||(arrow == "both") ) {
        var up = -ax*Math.cos(t) + ay*Math.sin(t) + x0;
        var vp = -ax*Math.sin(t) - ay*Math.cos(t) + y0;
        var um = -ax*Math.cos(t) - ay*Math.sin(t) + x0;
        var vm = -ax*Math.sin(t) + ay*Math.cos(t) + y0;
        drawLine(x0,y0, up,vp, linecolor, linewidth);
        drawLine(x0,y0, um,vm, linecolor, linewidth);
    }

}

  // =====================================================================
  //  補助線（Ｙ軸、水平線）
  //  Ｘ軸を基準にdy刻みに水平線を引く
function drawLineYscale(dy, linecolor, linewidth, zerocolor, zerowidth, dash) {
    for (var y=dy; y<=ymax; y=y+dy) {
        if (dash === undefined) drawLine(xmin,y, xmax,y, linecolor, linewidth);
        else drawLine(xmin,y, xmax,y, linecolor, linewidth, dash);
    }
    for (y=-dy; y>=ymin; y=y-dy) {
        if (dash === undefined) drawLine(xmin,y, xmax,y, linecolor, linewidth);
        else drawLine(xmin,y, xmax,y, linecolor, linewidth, dash);
    }
    drawLine(xmin,0, xmax,0, zerocolor, zerowidth);
}
  // =====================================================================
  //  補助線（Ｘ軸、垂直線）
  //  Ｙ軸を基準にdx刻みに垂直線を引く
function drawLineXscale(dx, linecolor, linewidth, zerocolor, zerowidth, dash) {
    for (var x=dx; x<=xmax; x=x+dx) {
        if (dash === undefined) drawLine(x,ymin, x, ymax, linecolor, linewidth);
        else  drawLine(x,ymin, x, ymax, linecolor, linewidth, dash);
    }
    for (x=-dx; x>=xmin; x=x-dx) {
        if (dash === undefined) drawLine(x,ymin, x, ymax, linecolor, linewidth);
        else  drawLine(x,ymin, x, ymax, linecolor, linewidth, dash);
    }
    drawLine(0,ymin, 0,ymax, zerocolor, zerowidth);
}

  //========================================================================
  //長方形を描く
function drawRect(x0,y0, x1,y1, linecolor, linewidth, fillcolor, dash) {
    var cx0, cy0, cx1,cy1, w, h;
    cx0 = Math.round((x0-xmin)/(xmax-xmin)*cw);
    cy0 = Math.round((ymax-y0)/(ymax-ymin)*ch);
    cx1 = Math.round((x1-xmin)/(xmax-xmin)*cw);
    cy1 = Math.round((ymax-y1)/(ymax-ymin)*ch);
    w = cx1-cx0;
    h = cy1-cy0;
    ctx.strokeStyle = linecolor; // 枠線の色
    ctx.lineWidth = linewidth;   // 線の太さ
    if (dash !== undefined) ctx.setLineDash(dash); // 破線指定
    if (fillcolor!="none") ctx.fillStyle = fillcolor; 
　　　　　//塗りつぶし（塗らないときは"none"）
    ctx.beginPath();
    ctx.rect(cx0, cy0, w,h);
    if (fillcolor != "none") ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);  // 破線指定解除（実線に戻す）
}
     //例　(5,8)-(10,20)を対角線とした長方形の枠線を青の２の太さにして、その内部を赤にする
     // drawRect(5,8, 10,20, "blue", 2, "red");

  //========================================================================
  //三角形を描く
function drawTri(x0,y0, x1,y1, x2,y2, linecolor, linewidth, fillcolor, dash) {
    var cx0, cy0, cx1,cy1, cx2,cy2;
    cx0 = Math.round((x0-xmin)/(xmax-xmin)*cw);
    cy0 = Math.round((ymax-y0)/(ymax-ymin)*ch);
    cx1 = Math.round((x1-xmin)/(xmax-xmin)*cw);
    cy1 = Math.round((ymax-y1)/(ymax-ymin)*ch);
    cx2 = Math.round((x2-xmin)/(xmax-xmin)*cw);
    cy2 = Math.round((ymax-y2)/(ymax-ymin)*ch);

    ctx.strokeStyle = linecolor; // 枠線の色
    ctx.lineWidth = linewidth;   // 線の太さ
    if (dash !== undefined) ctx.setLineDash(dash); // 破線指定
    if (fillcolor!="none") ctx.fillStyle = fillcolor; 
　　　　　//塗りつぶし（塗らないときは"none"）
    ctx.beginPath();
    ctx.moveTo(cx0, cy0);
    ctx.lineTo(cx1, cy1);
    ctx.lineTo(cx2, cy2);
    ctx.closePath();
    if (fillcolor != "none") ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);  // 破線指定解除（実線に戻す）
}
     //例　(10,5)-(20,10)-(30,5)を頂点とする三角形の枠線を青の２の太さにして、その内部を赤にする
     // drawTri(10,5, 20,10, 30,5, "blue", 2, "red");



// ========================================================================
// 多角形の描画
//　xyarray = [ [x0,y0],[x1,y1],…,[xn,yn] ] で与えた点を頂点とする多角形

function drawPolygon(xyarray, linecolor, linewidth, fillcolor, dash) {
    ctx.strokeStyle = linecolor; // 枠線の色
    ctx.lineWidth = linewidth;   // 線の太さ
    if (dash !== undefined) ctx.setLineDash(dash); // 破線指定
    if (fillcolor!="none") ctx.fillStyle = fillcolor; 
　　　　　//塗りつぶし（塗らないときは"none"）
    var n = xyarray.length;
    ctx.beginPath();  // 多角形定義開始
    var x = xyarray[0][0];
    var y = xyarray[0][1]; 
    var w = Math.round((x-xmin)/(xmax-xmin)*cw);
    var h = Math.round((ymax-y)/(ymax-ymin)*ch);
    ctx.moveTo(w, h);
    for (var i=1; i<n; i++){
        x = xyarray[i][0];
        y = xyarray[i][1]; 
        w = Math.round((x-xmin)/(xmax-xmin)*cw);
        h = Math.round((ymax-y)/(ymax-ymin)*ch);
        ctx.lineTo(w, h);
    }
    ctx.closePath();  // 多角形定義終了
    if (fillcolor != "none") ctx.fill();
    ctx.stroke();         // 描画
    ctx.setLineDash([]);  // 破線指定解除（実線に戻す）
}

// ========================================================================
// 正多角形の描画
//　中心(x,y)、半径ｒの円に内接する正ｎ角形。選択により対角線表示

function drawRegularPolygon(n, x,y, r, base, type, linecolor, linewidth, fillcolor, dash) {
      var d;                 // 辺の長さ
      var a0;
      var u = new Array();   // 頂点座標
      var v = new Array();
      if (base == 0) {
          d = 2*r*Math.sin(Math.PI/n);
          a0 = (2/n)*Math.PI;
          u[0] = x + r*Math.sin(Math.PI/n);
          v[0] = y - r*Math.cos(Math.PI/n);
      }
      else {
          d = 2*r*Math.sin(Math.PI/n);
          a0 = Math.PI/n;
          u[0] = x;
          v[0] = y - r;
      }
      // 頂点の計算をする
      for (var i=1; i<n; i++) {
          a = a0+ (2/n)*Math.PI*(i-1);
          u[i] = u[i-1] + d*Math.cos(a);
          v[i] = v[i-1] + d*Math.sin(a);
      }
      u[n] = u[0];  v[n] = v[0];   // i=nの点を最初点と一致させる。後続のループを簡単にするため

      // ============== ここからは、図形操作のためピクセル座標系に変更
      // u,vをピクセル系に変換する
      for (i=0; i<=n; i++) {
          u[i] = Math.round((u[i]-xmin)/(xmax-xmin)*cw);
          v[i] = Math.round((ymax-v[i])/(ymax-ymin)*ch);
      }
      // 図形の色や太さ
      ctx.fillStyle = fillcolor;
      ctx.strokeStyle = linecolor; // 枠線の色
      ctx.lineWidth = linewidth;   // 線の太さ
      if (dash !== undefined) ctx.setLineDash(dash); // 破線指定
      if (fillcolor!="none") ctx.fillStyle = fillcolor; 
      // 多角形の周辺を描画する
      if (type != 1) {
          ctx.beginPath();
          ctx.moveTo(u[0], v[0]);
          for (i=1; i<=n; i++) {
              ctx.lineTo(u[i], v[i]);
          }
          ctx.closePath();
          if (fillcolor != "none")  ctx.fill(); 
          ctx.stroke();
      }
      // 対角線を描画する　線が消えるので内部色は付けない
      if (type != 0) {
          for (i=0; i<n; i++) {
              for (var j=i+2; j<=n-2+i; j++) {
                  ctx.beginPath();
                  ctx.moveTo(u[i], v[i]);
                  ctx.lineTo(u[j], v[j]);
                  ctx.stroke();
                  ctx.closePath();
              }
          }
      }            
      ctx.setLineDash([]);  // 破線指定解除（実線に戻す）
}
  //パラメータ
  // n： 　　≧３　ｎ角形、辺・頂点の数
  // x,y： 　正多角形の外接円の中心座標
  // r： 　　その半径
  // base：　＝０　円中心の下が底辺、＝１　円中心の下が頂点
  // type：　＝０　周辺のみを表示、＝１　対角線だけを表示、＝２　周辺と対角線を表示　　　　　
  // linecolor：線（周辺、対角線）の太さ
  // fillcolor：正多角形内部の色。　塗らないときは "none"
  //          対角線を結んだ図形だけに色を塗ることはできない
  // 
  //例  drawRegularPolygon(5, 0.3, 0.5, 1, 0, 2, "white", 4, "red");
  // 　点(0.3, 0.5)を中心とする半径１の円に内接する正５角形を描画する。
  // 　中心点の下は底辺（底辺がＸ軸に平行）であり、正多角形と対角線を表示する
  // 　線は"white"色太さは４px。正多角形の内部は"red"色

  //========================================================================
  //円を描く
function drawCircle(x,y, r, linecolor, linewidth, fillcolor, dash) {
    var cx, cy;
    cx = Math.round((x-xmin)/(xmax-xmin)*cw);
    cy = Math.round((ymax-y)/(ymax-ymin)*ch);
    cr = Math.round(r*cw/(xmax-xmin));
    ctx.strokeStyle = linecolor; //枠線の色は白
    ctx.lineWidth = linewidth;   // 線の太さ
    if (dash !== undefined) ctx.setLineDash(dash); // 破線指定
    if (fillcolor!="none") ctx.fillStyle = fillcolor; 
　　　　　//塗りつぶし（塗らないときは"none"）
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, 2*Math.PI, false);
    if (fillcolor != "none") ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);  // 破線指定解除（実線に戻す）
}
     //例　原点中心、半径１、線は白、内部は灰色
     // drawCircle(0,0, 1, "white", 2, "gray");

  //========================================================================
  // 楕円を描く（回転可）
function drawEllipse(x,y, r1, r2, angle, linecolor, linewidth, fillcolor ,dash) {
    var cx, cy; 
    cx = Math.round((x-xmin)/(xmax-xmin)*cw); // 中心
    cy = Math.round((ymax-y)/(ymax-ymin)*ch); 
    cr1 = Math.round(r1*cw/(xmax-xmin)); 
    ctx.strokeStyle = linecolor; //枠線の色は白 
    ctx.lineWidth = linewidth;   // 線の太さ 
    if (dash !== undefined) ctx.setLineDash(dash); // 破線指定 
    if (fillcolor!="none") ctx.fillStyle = fillcolor;  
    ctx.save();  // 座標系の退避
    ctx.translate(cx,cy);  // 中心の移動
    ctx.rotate(-angle);    // 回転。Ｘ軸右から反時計回り、単位ラジアン
    ctx.scale(1,r2/r1);    // Ｘ方向はそのまま(r1)、Ｙ方向はr2/r1倍に引伸ばす(r2)
    ctx.beginPath(); 
    ctx.arc(0, 0, cr1, 0, 2*Math.PI, false); // 円（引伸ばされて楕円になる）
    ctx.restore(); // 座標系の復元
    if (fillcolor != "none") ctx.fill(); 
    ctx.stroke();   // 楕円の表示
    ctx.setLineDash([]);  // 破線指定解除（実線に戻す） 
}

  //========================================================================
  // 円弧を描く
  // 水平線正方向を起点。wize=true(反時計回り) | false（時計回り）
function drawArc(x,y, r, startAngle, endAngle, wize, linecolor, linewidth, dash) {
      var cx, cy, cr;
      cx = Math.round((x-xmin)/(xmax-xmin)*cw);
      cy = Math.round((ymax-y)/(ymax-ymin)*ch);
      cr = Math.round(r*cw/(xmax-xmin));
      ctx.strokeStyle = linecolor;
      ctx.lineWidth = linewidth;
     if (dash !== undefined) ctx.setLineDash(dash); // 破線指定
      ctx.beginPath();
      ctx.arc(cx, cy, cr, -startAngle, -endAngle, wize);
      ctx.stroke();
      ctx.closePath();
      ctx.setLineDash([]);  // 破線指定解除（実線に戻す）
}

  //========================================================================
  //　矢印付きの円弧を描く
  //  arrow = "end" (省略時解釈）endAngle点
  //          "start"            startAngle点
  //          "both"             両方
function drawArcArrow(x,y, r, startAngle, endAngle, linecolor, linewidth, arrow) {
    // 円弧を描く
    drawArc(x,y, r, startAngle, endAngle, "true", linecolor, linewidth);
    // 矢印を付ける
    var ax = -r/10; // 矢印長さ
    var ay = 0.3*ax;
    if ( (arrow === undefined)||(arrow == "end")||(arrow == "both") ) {
        var t = -Math.PI/2 + endAngle;
        var x1 = x + r*Math.cos(-endAngle);
        var y1 = y - r*Math.sin(-endAngle);
        var up = -ax*Math.cos(t) + ay*Math.sin(t) + x1;
        var vp = -ax*Math.sin(t) - ay*Math.cos(t) + y1;
        var um = -ax*Math.cos(t) - ay*Math.sin(t) + x1;
        var vm = -ax*Math.sin(t) + ay*Math.cos(t) + y1;
        drawLine(x1,y1, up,vp, linecolor, linewidth);
        drawLine(x1,y1, um,vm, linecolor, linewidth);
     }
     if ( (arrow == "start")||(arrow == "both") ) {
        t =  Math.PI/2 + startAngle;
        x1 = x + r*Math.cos(-startAngle);
        y1 = y - r*Math.sin(-startAngle);
        up = -ax*Math.cos(t) + ay*Math.sin(t) + x1;
        vp = -ax*Math.sin(t) - ay*Math.cos(t) + y1;
        um = -ax*Math.cos(t) - ay*Math.sin(t) + x1;
        vm = -ax*Math.sin(t) + ay*Math.cos(t) + y1;
        drawLine(x1,y1, up,vp, linecolor, linewidth);
        drawLine(x1,y1, um,vm, linecolor, linewidth);
    }

}

  // ==================================================
  // 扇形を描く
  // 機能限界：扇角度が１８０°を越えると余計な部分も着色されます。
  // その場合は、中間角=(startAngle+endAngle)/2 で2つに分け
  //    drawArcFan(x,y, r, startAngle, 中間角, "rgba(0,0,0,0)", 1, "red"); 透明な枠線
  //    drawArcFan(x,y, r, 中間角, endAngle,, "rgba(0,0,0,0)", 1, "red");
　//    drawArcFan(x,y, r, startAngle, endAngle, linecolor, linewidth, "none"); 枠線だけ
  // とすることで解決できます。
function drawArcFan(x,y, r, startAngle, endAngle, linecolor, linewidth, fillcolor) {
      var cx, cy, cr;
      cx = Math.round((x-xmin)/(xmax-xmin)*cw);
      cy = Math.round((ymax-y)/(ymax-ymin)*ch);
      cr = Math.round(r*cw/(xmax-xmin));
      ctx.strokeStyle = linecolor;
      ctx.lineWidth = linewidth;
      // 円周位置
      var p0x = x;
      var p0y = y;
      var p1x = x + r*Math.cos(-endAngle);
      var p1y = y - r*Math.sin(-endAngle);
      var p2x = x + r*Math.cos(-startAngle);
      var p2y = y - r*Math.sin(-startAngle);
      // ピクセル座標系への変更
      p0x = (p0x-xmin)/(xmax-xmin)*cw;
      p0y = (ymax-p0y)/(ymax-ymin)*ch;
      p1x = (p1x-xmin)/(xmax-xmin)*cw;
      p1y = (ymax-p1y)/(ymax-ymin)*ch;
      p2x = (p2x-xmin)/(xmax-xmin)*cw;
      p2y = (ymax-p2y)/(ymax-ymin)*ch;
     // 扇形
     ctx.beginPath();
     // 円弧
     ctx.arc(cx, cy, cr, -startAngle, -endAngle, true); 
     // リブ
     ctx.moveTo(p2x,p2y);
     ctx.lineTo(cx,cy);
     ctx.lineTo(p1x,p1y);
     // 塗りつぶし
     if (fillcolor != "none") {
         ctx.fillStyle = fillcolor; 
         ctx.fill();
     }
     ctx.stroke();
     ctx.closePath();
}


  // ========================================================================
  // テキスト（文字列）を描く
function drawText(text, x,y, position, color, font) {
    var align = "center";
    if (position.indexOf("end") >= 0) align = "end";
    if (position.indexOf("start") >= 0) align = "start";
    var baseline = "middle";
    if (position.indexOf("top") >= 0) baseline = "top";
    if (position.indexOf("bottom") >= 0) baseline = "bottom";
    var cx = Math.round((x-xmin)/(xmax-xmin)*cw);
    if (align == "start") cx = cx + 4;
    else if (align == "end") cx = cx - 4;
    var cy = Math.round((ymax-y)/(ymax-ymin)*ch);
    if (baseline == "top") cy = cy + 4;
    else if (baseline == "bottom") cy = cy - 4;
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    if (isNaN(font)) ctx.font = font;
    else ctx.font = font + "px sans-serif";
    ctx.fillText(text, cx, cy);
}

  // ========================================================================
  // テキスト（文字列）の回転表示
function drawTextRotate(text, x0,y0, x1,y1, position, color, font) {
        // ====== 角度の計算
    var x = (x0+x1)/2;
    var y = (y0+y1)/2;
    var w = Math.round((x-xmin)/(xmax-xmin)*cw);
　　var h = Math.round((ymax-y)/(ymax-ymin)*ch);
    var angle = -Math.atan2((y1-y0),(x1-x0));   // 回転角度（時計回りにする）
        // ===== 文字列設定
    ctx.fillStyle = color; 
    ctx.lineWidth = 1; 
    ctx.textAlign = "center";
    if (position == "over") ctx.textBaseline = "bottom";
    else if (position == "under") ctx.textBaseline = "top";
    else ctx.textBaseline = "middle";
    if (isNaN(font)) ctx.font = font;
    else ctx.font = font + "px sans-serif";
        // ===== 表示
    ctx.save();                 // 座標系の退避
    ctx.translate(w, h);           // 回転の中心
    ctx.rotate(angle);             // 回転
    ctx.fillText(text, 0, 0);   // ===== 文字列表示
    ctx.restore();              // ===== 座標系の復元
}

  //========================================================================
  // ＸＹ両軸に目盛り数値をつける
function drawTextXYscale(xfrom, xto, dx, yfrom, yto, dy, color, font) {
    var keta = function(d) {         // 小数点以下の桁数
        var w = String(d).split('.');
        if (w[1]) var w1 = w[1].length; else w1 = 0;
        return w1;
    }; 
    var kx = keta(dx);  // 刻み幅の小数点以下桁数
    var ky = keta(dy);
    if (isNaN(font)) ctx.font = font;
    else ctx.font = font + "px sans-serif";
    ctx.fillStyle = color;

    ctx.lineWidth = 1;
    if (isNaN(font)) ctx.font = font;
    else ctx.font = font + "px sans-serif";
    // Ｘ軸
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var cy = Math.round(ymax/(ymax-ymin)*ch) + 4;
    for (var x=xfrom; x<=xto; x=x+dx) {
        if (Math.abs(x) < 0.01) continue;
        var cx = Math.round((x-xmin)/(xmax-xmin)*cw);
        if (keta(x) <= kx) var text = String(x); else text = String(x.toFixed(kx));
    ctx.fillText(text, cx, cy);
    }
    // Ｙ軸
    ctx.textAlign = "end";
    ctx.textBaseline = "middle";
    cx = Math.round(-xmin/(xmax-xmin)*cw) - 4;
    for (var y=yfrom; y<=yto; y=y+dy) {
        if (Math.abs(y) < 0.01) continue;
        cy = Math.round((ymax-y)/(ymax-ymin)*ch);
        if (keta(y) <= ky) text = String(y); else text = String(y.toFixed(ky));
    ctx.fillText(text, cx, cy);
    }
    // ０点
    ctx.textAlign = "end";
    ctx.textBaseline = "top";
    cx = Math.round(-xmin/(xmax-xmin)*cw) - 4;
    cy = Math.round(ymax/(ymax-ymin)*ch) + 4;
    ctx.fillText("0", cx, cy);
}

  //========================================================================
  // Ｘ軸に目盛り数値をつける
function drawTextXscale(xfrom, xto, dx, color, font) {
    var keta = function(d) {         // 小数点以下の桁数
        var w = String(d).split('.');
        if (w[1]) var w1 = w[1].length; else w1 = 0;
        return w1;
    }; 
    var kx = keta(dx);  // 刻み幅の小数点以下桁数
    if (isNaN(font)) ctx.font = font;
    else ctx.font = font + "px sans-serif";
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    if (isNaN(font)) ctx.font = font;
    else ctx.font = font + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    var cy = Math.round(ymax/(ymax-ymin)*ch) + 4;
    for (var x=xfrom; x<=xto; x=x+dx) {
        var cx = Math.round((x-xmin)/(xmax-xmin)*cw);
        if (keta(x) <= kx) var text = String(x); else text = String(x.toFixed(kx));
    ctx.fillText(text, cx, cy);
    }
}

  //========================================================================
  // Ｙ軸に目盛り数値をつける
function drawTextYscale(yfrom, yto, dy, color, font) {
    var keta = function(d) {         // 小数点以下の桁数
        var w = String(d).split('.');
        if (w[1]) var w1 = w[1].length; else w1 = 0;
        return w1;
    }; 
    var ky = keta(dy);  // 刻み幅の小数点以下桁数
    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    if (isNaN(font)) ctx.font = font;
    else ctx.font = font + "px sans-serif";
    ctx.textAlign = "end";
    ctx.textBaseline = "middle";
    var cx = Math.round(-xmin/(xmax-xmin)*cw) - 4;
    for (var y=yfrom; y<=yto; y=y+dy) {
        var cy = Math.round((ymax-y)/(ymax-ymin)*ch);
        if (keta(y) <= ky) text = String(y); else text = String(y.toFixed(ky));
    ctx.fillText(text, cx, cy);
    }
}


  // ========================================================================
  // 画像ファイルを表示する
function drawImage(image, x,y) {
      var w = Math.round((x-xmin)/(xmax-xmin)*cw);
      var h = Math.round((ymax-y)/(ymax-ymin)*ch);
      var img = new Image();
      img.onload = function() {
          ctx.drawImage(img, w, h, img.width, img.height);
      }
      img.src = image;
}

  // ========================================================================
  // 画像の回転表示
function drawImageRotate(image, x,y, angle) { 
    var w = Math.round((x-xmin)/(xmax-xmin)*cw);
    var h = Math.round((ymax-y)/(ymax-ymin)*ch);
    var img = new Image(); 
    img.onload = function() {
        ctx.save();  // ===== 座標系の退避、新座標系
        ctx.translate(w, h);  // 回転中心
        ctx.rotate(-angle);   // 回転（反時計回り）
        ctx.drawImage(img, -img.width/2, -img.height/2, img.width, img.height); 
        ctx.restore();  // ===== 座標系の復元
    }
    img.src = image;
}

  // ========================================================================
  // canvas保存（全ピクセルグローバル変数canvasImageDataに保存）
function backupCanvas() {
    canvasImageData = ctx.getImageData(0, 0, cw, ch);
}
  // ========================================================================
  // canvas復元（先に保存したcanvasImageDataでcanvasを復元表示）
function restoreCanvas() {
    ctx.putImageData(canvasImageData, 0, 0);
}

  // ========================================================================
  // canvasをクリックした点のx,y座標と色を、HTML で指定した「結果表示場所」に表示

function clickCanvas(結果表示場所) {
    canvas.onclick =  function(e) {
        // ===== クリック点のCW,CH系での座標
        var rect = e.target.getBoundingClientRect();
        var W = e.clientX - Math.floor(rect.left);
        var H = e.clientY - Math.floor(rect.top);
        // ==== RGBAの取得    
        var imagedata = ctx.getImageData(W, H, 1, 1);
        var r = imagedata.data[0];
        var g = imagedata.data[1];
        var b = imagedata.data[2];
        var a = (imagedata.data[3]/255).toFixed(1);
               // rgbaの透明度は 0～1 で表示するため

        var rgba = "rgba(" + r + "," + g + "," + b +"," + a +")";
        // ===== W,H の X-Y系への変換
        var x = ((xmax-xmin)*W/cw + xmin).toFixed(2);
        var y = ((ymin-ymax)*H/ch + ymax).toFixed(2);
        // 表示場所への表示
        document.getElementById(結果表示場所).innerHTML
            = "W=" + W + ", H=" + H + ", x=" + x + ", y=" + y + ", rgba=" + rgba;
     }
}

  // ========================================================================
  // Ｗ－Ｈ系座標→Ｘ－Ｙ座標変換
  // w,h を与えてx,y を戻す
  // rtn = WHtoXY(w,h);  x = rtn.x; y = rtn.y;
function WHtoXY(w,h) {
    var x = (xmax-xmin)*w/cw + xmin;
    var y = (ymin-ymax)*h/ch + ymax;
    return { "x": x, "y": y };
}

  // ========================================================================
  // Ｘ－Ｙ系座標→Ｗ－Ｈ座標変換
  // x,y を与えてw,h を戻す
  // rtn = XYtoWH(x,y);  w = rtn.w; h = rtn.h;
function XYtoWH(x,y) {
    var w = Math.round((x-xmin)/(xmax-xmin)*cw);
    var h = Math.round((ymax-y)/(ymax-ymin)*ch);
    return { "w": w, "h": h };
}

  // ========================================================================
  // 回転（角度を与える）
  // 直線Ｐ(x0,y0)ーＱ(x1,y1) をＰを中心として角度ｔ回転したときの、Ｑの新座標Ｒ(x,y)を求める。
  // rtn = rotateByAngle(x1,y0, x1,y1, t); x = rtn.x; y = rtn.y;
function rotateByAngle(x0,y0, x1,y1, t) {
    var x = (x1-x0)*Math.cos(t) - (y1-y0)*Math.sin(t) + x0;
    var y = (x1-x0)*Math.sin(t) + (y1-y0)*Math.cos(t) + y0;
    return { "x": x, "y": y };
}


  // ========================================================================
  // 軸対称
  // 直線Ｐ(x0,y0)ーＱ(x1,y1) をＰを中心として角度ｔ回転したときの、Ｑの新座標Ｒ(x,y)を求める。
  // rtn = rotateByAngle(x1,y0, x1,y1, θ); x = rtn.x; y = rtn.y;
function symmetryPoint(xc,yc, x0,y0, θ) {
    var v = -(x0-xc)*Math.sin(θ) + (y0-yc)*Math.cos(θ);
    var x =  2*v*Math.sin(θ) + x0;
    var y = -2*v*Math.cos(θ) + y0;
    return { "x": x, "y": y };
}



// ★★★★★★★★　やや特殊な用途、使用法に注意が必要な関数　★★★★★★★★
// ========================================================================


  //========================================================================
  // Ｘ軸・Ｙ軸に目盛り数値をつける
function drawAxisScale(xfrom, xto, yfrom, yto, color, dx, dy, font) {
    if (color == null) color = "black";
    if (dx == null) dx = 1;
    if (dy == null) dy = 1;
    if (font == null) font = 12;
    font = font + "pt Arial";
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.font = font;
    // Ｘ軸
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    for (var x=xfrom; x<=xto; x=x+dx) {
        var cx = (x-xmin)/(xmax-xmin)*cw;
        var cy = ymax/(ymax-ymin)*ch;
        var text = new String(x);
        ctx.strokeText(text, cx, cy);
    }
    // Ｙ軸
    ctx.textAlign = "end";
    ctx.textBaseline = "middle";
    for (var y=yfrom; y<=yto; y=y+dy) {
        if (y == 0) continue;
        var cx = -xmin/(xmax-xmin)*cw;
        var cy = (ymax-y)/(ymax-ymin)*ch;
        var text = new String(y);
        ctx.strokeText(text, cx, cy);
    }
}


// ========================================================================
// 指定した点(x,y)を囲む図形の内部をfillcolor色で塗りつぶす。
// ★fillcolorは、"red"や"white"などの形式のみです。rgba形式は使えません。
// ★該当する領域のすべてが変更されないことがあります。
// 　実際に表示させてみて、(x,y)を変えてみるか、
// 　異なる(x,y)でpaintAreaを数回呼び出して埋めることで対応します。

function paintArea(x,y, fillcolor) {
    // パラメタ
    var cx = Math.round((x-xmin)/(xmax-xmin)*cw);   // xに対応するピクセルの位置
    var cy = Math.round((ymax-y)/(ymax-ymin)*ch);   // yに対応するピクセルの位置
                                                    // fillcolor="red","green" などの文字列
    var rgbOld = new Array();       // Ｐ点の元の色
    // ===================== ＣＡＮＶＡＳ情報を配列PIXELに
    // canvas とpixel[i][j][c] の関連づけ
    var ctxImage = ctx.getImageData(0, 0, cw, ch);
    var inData  = ctxImage.data;
    // pixel[i][j][c] の定義　canvasの各画素をマトリクスに対応させる
         // i：canvas縦方向ピクセル番号　上端=0, 下端=ch
         // j：canvas横方向ピクセル番号　左端=0, 右端=cw
         // c：０=赤、１=緑、２=青、３＝透明度
    var pixel = new Array(ch);
    for (var i=0; i<ch; i++) {
        pixel[i] = new Array(cw);
        for (var j=0; j<cw; j++) {
            pixel[i][j] = new Array(4);
        }
    }
    // canvas全体の色情報をpixel[i][j][c]に読み込む
    var k = 0;
    for (i=0; i<ch; i++) {
        for (j=0; j<cw; j++) {
            for (c=0; c<=3; c++) {
                pixel[i][j][c] = inData[k];
                k++;
            }
        }
    }
    // =======================塗りつぶし処理
    // 点Ｐの元の色 
    rgbOld[0] = pixel[cx][cy][0];
    rgbOld[1] = pixel[cx][cy][1];
    rgbOld[2] = pixel[cx][cy][2];
    // ======= 右下象限
    // 横にスキャン
    i = cy;
    while (i < ch) {
        count = 0;
        j = cx;
        while (j < cw) {         // 右へ
            if ( ( pixel[i][j][0] != rgbOld[0] )
             ||  ( pixel[i][j][1] != rgbOld[1] )
             ||  ( pixel[i][j][2] != rgbOld[2] ) ) {  // 色がＰ点と変わった
                break;                                // 　→境界に達した→次の下の行へ
            }
            else {                                // 同じ色なら
                ctx.lineWidth = 1;
                ctx.fillStyle   = fillcolor;
                ctx.beginPath(); 
                ctx.fillRect(j, i, 1, 1);
                ctx.fill();
                ctx.stroke();             // (i,j) に指定i色で 1x1 の長方形を描くi
                count++;                          // この行で変更した回数
            }
            j++;     // 右のピクセルへ
        }                         // この行で右側の境界に達した
        if (count == 0) break;    // この行では変更しなかった→次の行では変更がないはず→縦にスキャン
        i++;                      // 次の下の行へ。
    }
                             // 終了条件：count=0 or i=ch
    // 縦にスキャン
    j = cx;
    while (j < cw) {
        count = 0;
        i = cy;
        while (i < ch) {         // 下へ
            if ( ( pixel[i][j][0] != rgbOld[0] )
             ||  ( pixel[i][j][1] != rgbOld[1] )
             ||  ( pixel[i][j][2] != rgbOld[2] ) ) {  // 色がＰ点と変わった
                break;                                // 　→境界に達した→次の下の行へ
            }
            else {                                // 同じ色なら
                ctx.lineWidth = 1;
                ctx.fillStyle   = fillcolor;
                ctx.beginPath(); 
                ctx.fillRect(j, i, 1, 1);
                ctx.fill();
                ctx.stroke();             // (i,j) に指定i色で 1x1 の長方形を描くi
                count++;                          // この行で変更した回数
            }
            i++;     // 下のピクセルへ
        }                         // この列で下側の境界に達した
        if (count == 0) break;    // この列では変更しなかった→次の列の変更がないはず→他の象限へ
        j++;                      // 下の行へ。
    }                             // 終了条件：count=0 or i=ch
    // ======= 右上象限
    // 
    i = cy-1;
    while (i >= 0) {
        count = 0;
        j = cx;
        while (j < cw) {
            if ( ( pixel[i][j][0] != rgbOld[0] )
             ||  ( pixel[i][j][1] != rgbOld[1] )
             ||  ( pixel[i][j][2] != rgbOld[2] ) ) {
                break;
            }
            else {
                ctx.lineWidth = 1;
                ctx.fillStyle   = fillcolor;
                ctx.beginPath(); 
                ctx.fillRect(j, i, 1, 1);
                ctx.fill();
                ctx.stroke();
                count++;
            }
            j++;
        }
        if (count == 0) break;
        i--;
    }
    // 
    j = cx;
    while (j < cw) {
        count = 0;
       i = cy-1;
        while (i >= 0) {
            if ( ( pixel[i][j][0] != rgbOld[0] )
             ||  ( pixel[i][j][1] != rgbOld[1] )
             ||  ( pixel[i][j][2] != rgbOld[2] ) ) {
                break;
            }
            else {
                ctx.lineWidth = 1;
                ctx.fillStyle   = fillcolor;
                ctx.beginPath(); 
                ctx.fillRect(j, i, 1, 1);
                ctx.fill();
                ctx.stroke();
                count++;
            }
            i++;
        }
        if (count == 0) break;
        j--;
    }
    // ======= 左下象限
    // 
    i = cy;
    while (i < ch) {
        count = 0;
        j = cx-1;
        while (j >= 0) {         // 右へ
            if ( ( pixel[i][j][0] != rgbOld[0] )
             ||  ( pixel[i][j][1] != rgbOld[1] )
             ||  ( pixel[i][j][2] != rgbOld[2] ) ) {
                break;
            }
            else {
                ctx.lineWidth = 1;
                ctx.fillStyle   = fillcolor;
                ctx.beginPath(); 
                ctx.fillRect(j, i, 1, 1);
                ctx.fill();
                ctx.stroke();
                count++;
            }
            j--;
        }
        if (count == 0) break;
        i++;
    }
    // 
    j = cx-1;
    while (j >= 0) {
        count = 0;
        i = cy;
        while (i < ch) {         // 右へ
            if ( ( pixel[i][j][0] != rgbOld[0] )
             ||  ( pixel[i][j][1] != rgbOld[1] )
             ||  ( pixel[i][j][2] != rgbOld[2] ) ) {
                break;
            }
            else {
                ctx.lineWidth = 1;
                ctx.fillStyle   = fillcolor;
                ctx.beginPath(); 
                ctx.fillRect(j, i, 1, 1);
                ctx.fill();
                ctx.stroke();
                count++;
            }
            i--;
        }
        if (count == 0) break;
        j++;
    }



    // ======= 左上象限
    //
    i = cy-1;
    while (i >= 0) {
        count = 0;
        j = cx-1;
        while (j >= 0) {
            if ( ( pixel[i][j][0] != rgbOld[0] )
             ||  ( pixel[i][j][1] != rgbOld[1] )
             ||  ( pixel[i][j][2] != rgbOld[2] ) ) {
                break;
            }
            else {
                ctx.lineWidth = 1;
                ctx.fillStyle   = fillcolor;
                ctx.beginPath(); 
                ctx.fillRect(j, i, 1, 1);
                ctx.fill();
                ctx.stroke();
                count++;
            }
            j--;
        }
        if (count == 0) break;
        i--;
    }
    // 
    j = cx-1;
    while (j >= 0) {
        count = 0;
        i = cy-1;
        while (i >= 0) {
            if ( ( pixel[i][j][0] != rgbOld[0] )
             ||  ( pixel[i][j][1] != rgbOld[1] )
             ||  ( pixel[i][j][2] != rgbOld[2] ) ) {
                break;
            }
            else {
                ctx.lineWidth = 1;
                ctx.fillStyle   = fillcolor;
                ctx.beginPath(); 
                ctx.fillRect(j, i, 1, 1);
                ctx.fill();
                ctx.stroke();
                count++;
            }
            i--;
        }
        if (count == 0) break;
        j--;
    }
}
// ===================
// 　画面変更は、現在のcanvas全体のピクセルを配列pixelにコピーし、
// 　変更後、配列pixel全体をcanvasに書き込むことにより行う。
// 　(x,y)に対応するピクセル表示点Ｐ(cx,cy)から上下左右に、ピクセルをスキャンし、
// 　Ｐと異なる色のピクセル（すなわち、囲む図形の境界）に出会うまで、
// 　そのピクセルをfillcolor色に変更する。
// ★fillcolorは、"red"や"white"などの形式のみです。rgba形式は使えません。
// ★該当する領域が点Ｐからみて凸でなければ、塗りつぶせない部分が発生します。
// 　領域内に文字などがあっても凸になりません。
// 　凸であっても、塗りつぶせない部分が発生することがありそうです。
// 　　　実際に表示させてみて、(x,y)を変えてみるか、
// 　　　異なる(x,y)でpaintAreaを数回呼び出して埋めることで対応します。
// 例
// 次のような画面があるとします。
// 　　cw = 400;  ch = 400;
// 　　xmin =-2; xmax=2; ymin=-2; ymax=2;
// 　　setCanvas("canvas1", "yellow");
// 　　drawCircle(0,0, 1, "green", 1, "white");
// 　　drawLine(-2, 0, 2,0, "black", 1);
// 　　drawLine( 0,-2, 0,2, "black", 1);
// 　　drawLine(-2,-2, 2,1, "blue", 1);
// 点(0.3, 0.5)を含む領域を"red"にします。
// 　　paintArea(0.3, 0.5, "red");


  //========================================================================
  //時間を遅らせる（他言語のSleepやWaitの機能）
function sleep(time) {
      var d1 = new Date().getTime();
      var d2 = new Date().getTime();
      alert("２回目以降「このページ～」にチェックを入れてください");
      while( d2 < d1 + time ){
          d2 = new Date().getTime();
      }
}
  // これはGoogle Chrome以外では使わないでください。
  // その場合でもalertを外すと、うまく動きません。

