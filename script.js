/* ════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════ */
function sidebar_toggle(){
  var sb=document.getElementById('sidebar');
  var ov=document.getElementById('sidebar-overlay');
  var hb=document.getElementById('hamburger');
  var open=sb.classList.toggle('open');
  ov.classList.toggle('show',open);
  hb.classList.toggle('open',open);
}
function sidebar_close(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
  document.getElementById('hamburger').classList.remove('open');
}

/* ════════════════════════════════════════
   COUNTER
════════════════════════════════════════ */
function counter_update(){
  var h=JSON.parse(localStorage.getItem('elk_h')||'[]');
  var n=h.length;
  document.getElementById('hdr-count').textContent=n;
  document.getElementById('sb-count').textContent=n;
  var hc=document.getElementById('hist-count');
  if(hc)hc.textContent=n;
}

/* ════════════════════════════════════════
   STANDARD CALCULATOR
════════════════════════════════════════ */
var cc={display:'0',expr:'',first:null,op:null,waitNext:false};
var OP_SYM={'+':'+','-':'−','x':'×','/':'÷'};

function cc_update(){
  var el=document.getElementById('calc-display');
  el.textContent=cc.display;
  var cls='calc-main-display';
  if(cc.display.length>14)cls+=' sm';
  else if(cc.display.length>9)cls+=' md';
  el.className=cls;
  document.getElementById('calc-expr').textContent=cc.expr;
}
function cc_digit(d){
  if(cc.waitNext){cc.display=d;cc.waitNext=false;}
  else{cc.display=cc.display==='0'?d:(cc.display.length<16?cc.display+d:cc.display);}
  cc_update();
}
function cc_dot(){
  if(cc.waitNext){cc.display='0.';cc.waitNext=false;}
  else if(cc.display.indexOf('.')===-1)cc.display+='.';
  cc_update();
}
function cc_clear(){
  cc={display:'0',expr:'',first:null,op:null,waitNext:false};
  cc_update();
}
function cc_toggleSign(){
  var v=parseFloat(cc.display);
  if(!isNaN(v))cc.display=(v*-1).toString();
  cc_update();
}
function cc_percent(){
  cc.display=(parseFloat(cc.display)/100).toString();
  cc_update();
}
function cc_sqrt(){
  var v=parseFloat(cc.display);
  if(v<0){cc.display='Error';cc.expr='√'+v+' = Error';}
  else{var r=Math.sqrt(v);cc.display=(+(r.toFixed(10))).toString();cc.expr='√'+v+' = '+cc.display;}
  cc.waitNext=true;hist_save('√'+v+' = '+cc.display);
  cc_update();
}
function cc_square(){
  var v=parseFloat(cc.display);
  var r=v*v;
  cc.display=(+(r.toFixed(10))).toString();
  cc.expr=v+'² = '+cc.display;
  cc.waitNext=true;hist_save(v+'² = '+cc.display);
  cc_update();
}
function cc_op(op){
  if(cc.op&&!cc.waitNext)cc_equals(true);
  cc.first=parseFloat(cc.display);
  cc.op=op;
  cc.expr=cc.display+' '+(OP_SYM[op]||op);
  cc.waitNext=true;
  cc_update();
}
function cc_equals(chain){
  if(cc.op===null||cc.first===null)return;
  var a=cc.first,b=parseFloat(cc.display),op=cc.op,r;
  if(op==='+')r=a+b;
  else if(op==='-')r=a-b;
  else if(op==='x')r=a*b;
  else if(op==='/')r=b!==0?a/b:NaN;
  if(!chain){
    var txt=a+' '+(OP_SYM[op]||op)+' '+b+' = '+(isNaN(r)?'Error':+(r.toFixed(10)));
    hist_save(txt);
    cc.expr=txt;cc.op=null;cc.first=null;cc.waitNext=true;
  }
  cc.display=isNaN(r)?'Error':(+(r.toFixed(10))).toString();
  cc_update();
}
document.addEventListener('keydown',function(e){
  if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;
  if(e.key>='0'&&e.key<='9')cc_digit(e.key);
  if(e.key==='.')cc_dot();
  if(e.key==='+')cc_op('+');
  if(e.key==='-')cc_op('-');
  if(e.key==='*')cc_op('x');
  if(e.key==='/'&&!e.ctrlKey){e.preventDefault();cc_op('/');}
  if(e.key==='Enter'||e.key==='=')cc_equals();
  if(e.key==='Escape')cc_clear();
  if(e.key==='Backspace'){
    cc.display=cc.display.length>1?cc.display.slice(0,-1):'0';cc_update();
  }
});

/* ════════════════════════════════════════
   NLP ENGINE
════════════════════════════════════════ */
var NUM_MULTI=[
  ['dua puluh',20],['tiga puluh',30],['empat puluh',40],['lima puluh',50],
  ['enam puluh',60],['tujuh puluh',70],['delapan puluh',80],['sembilan puluh',90],
  ['dua belas',12],['tiga belas',13],['empat belas',14],['lima belas',15],
  ['enam belas',16],['tujuh belas',17],['delapan belas',18],['sembilan belas',19],
  ['dua ratus',200],['tiga ratus',300],['empat ratus',400],['lima ratus',500],
  ['enam ratus',600],['tujuh ratus',700],['delapan ratus',800],['sembilan ratus',900]
];
var NUM_SINGLE=[
  ['nol',0],['satu',1],['dua',2],['tiga',3],['empat',4],
  ['lima',5],['enam',6],['tujuh',7],['delapan',8],['sembilan',9],
  ['sepuluh',10],['sebelas',11],['seratus',100],['seribu',1000],
  ['sejuta',1000000],['selusin',12],['setengah',0.5],['seperempat',0.25]
];

function nlp_tokenize(text){
  var t=' '+text.toLowerCase()+' ';
  for(var i=0;i<NUM_MULTI.length;i++)t=t.split(NUM_MULTI[i][0]).join(' '+NUM_MULTI[i][1]+' ');
  for(var j=0;j<NUM_SINGLE.length;j++)t=t.replace(new RegExp('\\b'+NUM_SINGLE[j][0]+'\\b','g'),' '+NUM_SINGLE[j][1]+' ');
  return t;
}

function nlp_extractNums(text){
  var matches=[];
  var re=/[\d]+(?:[.,][\d]+)*/g,m;
  var t=text.replace(/\./g,'').replace(/,/g,'.');
  while((m=re.exec(t))!==null)matches.push(parseFloat(m[0]));
  return matches;
}

function nlp_solve(){
  var raw=document.getElementById('nlp-input').value.trim();
  if(!raw)return;
  var result=nlp_process(raw);
  var el=document.getElementById('nlp-result');
  el.innerHTML=result;
  el.classList.remove('hidden');
}

function nlp_clear(){
  document.getElementById('nlp-input').value='';
  document.getElementById('nlp-result').classList.add('hidden');
}

function nlp_chip(el){
  document.getElementById('nlp-input').value=el.textContent;
  document.getElementById('nlp-input').focus();
  document.querySelector('#nlp').scrollIntoView({behavior:'smooth'});
}

function fmt(n){
  if(n===Math.floor(n))return n.toLocaleString('id-ID');
  return (+(n.toFixed(4))).toLocaleString('id-ID');
}
function rp(n){return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',minimumFractionDigits:0}).format(n);}

function nlp_process(raw){
  var t=raw.toLowerCase();
  var tok=nlp_tokenize(raw);
  var nums=nlp_extractNums(tok);

  // ── Greetings ──
  if(/siapa\s*(nama|kamu|anda)/i.test(t)||/nama\s*(mu|kamu|anda)/i.test(t))
    return '<strong>Nama saya RAkulator 🤖</strong><br>Saya siap membantu menyelesaikan soal matematika!';
  if(/^(halo|hai|hello|hi)\b/i.test(t)&&t.length<20)
    return 'Halo! Saya RAkulator. Coba ketik soal cerita matematika! 😊';
  if(/terima\s*kasih|makasih/i.test(t))return 'Sama-sama! Senang bisa membantu 😊';

  // ── DISKON ──
  if(/diskon|potongan\s*harga/i.test(t)){
    var pct=null,price=null;
    var pctM=t.match(/(\d+(?:[.,]\d+)?)\s*%/);
    if(pctM)pct=parseFloat(pctM[1].replace(',','.'));
    var priceM=raw.match(/rp\.?\s*([\d.,]+)/i)||raw.match(/harga\s+(?:awal\s+)?(?:rp\.?\s*)?([\d.,]+)/i);
    if(!priceM)priceM=raw.match(/([\d]{4,})/);
    if(priceM)price=parseFloat(priceM[1].replace(/\./g,'').replace(',','.'));
    if(nums.length>=2&&pct===null){pct=Math.min(nums[0],nums[1]);price=Math.max(nums[0],nums[1]);}
    else if(nums.length>=1&&price===null)price=nums[0];
    if(price!==null&&pct!==null){
      var cut=price*(pct/100),final=price-cut;
      hist_save('NLP Diskon: '+rp(price)+' − '+pct+'% = '+rp(final));
      return '<strong>🛍️ Kalkulator Diskon</strong><br>'+
        '<div class="nlp-answer">Harga Akhir: '+rp(final)+'</div>'+
        '<div class="nlp-steps">Harga awal: '+rp(price)+'<br>Diskon '+pct+'%: −'+rp(cut)+'<br>Harga bayar: <strong>'+rp(final)+'</strong></div>';
    }
  }

  // ── PPN/PAJAK ──
  if(/pajak|ppn/i.test(t)){
    var pct2=11,price2=null;
    var m2=t.match(/(\d+)\s*%/);if(m2)pct2=parseFloat(m2[1]);
    if(nums.length)price2=Math.max(...nums);
    if(price2){
      var tax=price2*(pct2/100),total=price2+tax;
      hist_save('NLP PPN: '+rp(price2)+' + '+pct2+'% = '+rp(total));
      return '<strong>🧾 Kalkulator Pajak</strong>'+
        '<div class="nlp-answer">Total: '+rp(total)+'</div>'+
        '<div class="nlp-steps">Harga: '+rp(price2)+'<br>PPN '+pct2+'%: +'+rp(tax)+'<br>Total bayar: <strong>'+rp(total)+'</strong></div>';
    }
  }

  // ── STATISTIK rata-rata ──
  if(/rata.?rata|average|mean/i.test(t)&&nums.length>=2){
    var sum=nums.reduce(function(a,b){return a+b;},0),avg=sum/nums.length;
    hist_save('NLP Rata-rata: ('+nums.join(', ')+') = '+fmt(avg));
    return '<strong>📊 Rata-rata</strong>'+
      '<div class="nlp-answer">'+fmt(avg)+'</div>'+
      '<div class="nlp-steps">Data: '+nums.join(', ')+'<br>Jumlah: '+fmt(sum)+'<br>n: '+nums.length+'<br>Rata-rata: <strong>'+fmt(avg)+'</strong></div>';
  }
  if(/median/i.test(t)&&nums.length>=2){
    var sorted=nums.slice().sort(function(a,b){return a-b;}),med;
    var n=sorted.length;
    med=n%2===0?(sorted[n/2-1]+sorted[n/2])/2:sorted[Math.floor(n/2)];
    hist_save('NLP Median: ('+nums.join(', ')+') = '+fmt(med));
    return '<strong>📊 Median</strong>'+
      '<div class="nlp-answer">'+fmt(med)+'</div>'+
      '<div class="nlp-steps">Data terurut: '+sorted.join(', ')+'<br>Median: <strong>'+fmt(med)+'</strong></div>';
  }

  // ── GEOMETRI ──
  if(/luas\s*lingkaran|lingkaran/i.test(t)&&/luas/i.test(t)){
    var r=null;
    if(/jari.?jari|radius/i.test(t)&&nums.length)r=nums[0];
    else if(/diameter/i.test(t)&&nums.length)r=nums[0]/2;
    if(r!==null){
      var L=Math.PI*r*r;
      hist_save('NLP Luas lingkaran r='+r+': '+fmt(L)+' cm²');
      return '<strong>📐 Luas Lingkaran</strong>'+
        '<div class="nlp-answer">'+fmt(L)+' cm²</div>'+
        '<div class="nlp-steps">r = '+r+' cm<br>L = π × r² = π × '+r+'² = <strong>'+fmt(L)+' cm²</strong></div>';
    }
  }
  if(/keliling\s*lingkaran/i.test(t)&&nums.length){
    var r2=nums[0];if(/diameter/i.test(t))r2=nums[0]/2;
    var K=2*Math.PI*r2;
    hist_save('NLP Keliling lingkaran r='+r2+': '+fmt(K)+' cm');
    return '<strong>📐 Keliling Lingkaran</strong>'+
      '<div class="nlp-answer">'+fmt(K)+' cm</div>'+
      '<div class="nlp-steps">r = '+r2+' cm<br>K = 2πr = <strong>'+fmt(K)+' cm</strong></div>';
  }
  if(/luas\s*persegi\b(?!\s*panjang)/i.test(t)&&nums.length){
    var s=nums[0],La=s*s;
    hist_save('NLP Luas persegi s='+s+': '+La+' cm²');
    return '<strong>📐 Luas Persegi</strong>'+
      '<div class="nlp-answer">'+La+' cm²</div>'+
      '<div class="nlp-steps">s = '+s+' cm<br>L = s² = '+s+'² = <strong>'+La+' cm²</strong></div>';
  }
  if(/luas\s*persegi\s*panjang/i.test(t)&&nums.length>=2){
    var p=nums[0],lb=nums[1],Lb=p*lb;
    hist_save('NLP Luas persegi panjang '+p+'×'+lb+': '+Lb+' cm²');
    return '<strong>📐 Luas Persegi Panjang</strong>'+
      '<div class="nlp-answer">'+Lb+' cm²</div>'+
      '<div class="nlp-steps">p = '+p+', l = '+lb+'<br>L = p × l = <strong>'+Lb+' cm²</strong></div>';
  }
  if(/luas\s*segitiga/i.test(t)&&nums.length>=2){
    var a2=nums[0],t2=nums[1],Ls=0.5*a2*t2;
    hist_save('NLP Luas segitiga: '+Ls+' cm²');
    return '<strong>📐 Luas Segitiga</strong>'+
      '<div class="nlp-answer">'+Ls+' cm²</div>'+
      '<div class="nlp-steps">a = '+a2+', t = '+t2+'<br>L = ½ × a × t = <strong>'+Ls+' cm²</strong></div>';
  }

  // ── BANGUN RUANG ──
  if(/volume\s*kubus/i.test(t)&&nums.length){
    var s2=nums[0],V=s2*s2*s2;
    hist_save('NLP Volume kubus s='+s2+': '+V+' cm³');
    return '<strong>📦 Volume Kubus</strong>'+
      '<div class="nlp-answer">'+V+' cm³</div>'+
      '<div class="nlp-steps">s = '+s2+' cm<br>V = s³ = '+s2+'³ = <strong>'+V+' cm³</strong></div>';
  }
  if(/volume\s*balok/i.test(t)&&nums.length>=3){
    var p2=nums[0],l2=nums[1],t3=nums[2],Vb=p2*l2*t3;
    hist_save('NLP Volume balok: '+Vb+' cm³');
    return '<strong>📦 Volume Balok</strong>'+
      '<div class="nlp-answer">'+Vb+' cm³</div>'+
      '<div class="nlp-steps">p='+p2+', l='+l2+', t='+t3+'<br>V = p×l×t = <strong>'+Vb+' cm³</strong></div>';
  }
  if(/volume\s*tabung/i.test(t)&&nums.length>=2){
    var r3=nums[0],h=nums[1],Vt=Math.PI*r3*r3*h;
    hist_save('NLP Volume tabung r='+r3+' h='+h+': '+fmt(Vt)+' cm³');
    return '<strong>📦 Volume Tabung</strong>'+
      '<div class="nlp-answer">'+fmt(Vt)+' cm³</div>'+
      '<div class="nlp-steps">r='+r3+', h='+h+'<br>V = π×r²×h = <strong>'+fmt(Vt)+' cm³</strong></div>';
  }
  if(/volume\s*bola/i.test(t)&&nums.length){
    var r4=nums[0],Vb2=(4/3)*Math.PI*r4*r4*r4;
    hist_save('NLP Volume bola r='+r4+': '+fmt(Vb2)+' cm³');
    return '<strong>📦 Volume Bola</strong>'+
      '<div class="nlp-answer">'+fmt(Vb2)+' cm³</div>'+
      '<div class="nlp-steps">r = '+r4+' cm<br>V = 4/3 × π × r³ = <strong>'+fmt(Vb2)+' cm³</strong></div>';
  }

  // ── PYTHAGORAS ──
  if(/pythagoras|sisi\s*miring|hipotenusa/i.test(t)&&nums.length>=2){
    var a3=nums[0],b2=nums[1],c=Math.sqrt(a3*a3+b2*b2);
    hist_save('NLP Pythagoras '+a3+','+b2+': '+fmt(c));
    return '<strong>📐 Teorema Pythagoras</strong>'+
      '<div class="nlp-answer">c = '+fmt(c)+'</div>'+
      '<div class="nlp-steps">a='+a3+', b='+b2+'<br>c = √(a²+b²) = <strong>'+fmt(c)+'</strong></div>';
  }

  // ── KECEPATAN / JARAK / WAKTU ──
  if(/kecepatan|laju/i.test(t)&&nums.length>=2){
    var s3=Math.max(nums[0],nums[1]),t4=Math.min(nums[0],nums[1]),v=s3/t4;
    hist_save('NLP Kecepatan '+s3+'/'+t4+': '+fmt(v)+' km/jam');
    return '<strong>🚗 Kecepatan</strong>'+
      '<div class="nlp-answer">'+fmt(v)+' km/jam</div>'+
      '<div class="nlp-steps">Jarak: '+s3+' km, Waktu: '+t4+' jam<br>v = s/t = <strong>'+fmt(v)+' km/jam</strong></div>';
  }
  if(/berapa\s*lama|waktu\s*tempuh/i.test(t)&&nums.length>=2){
    var s4=Math.max(nums[0],nums[1]),v2=Math.min(nums[0],nums[1]),tt=s4/v2;
    hist_save('NLP Waktu '+s4+'/'+v2+': '+fmt(tt)+' jam');
    return '<strong>⏱️ Waktu Tempuh</strong>'+
      '<div class="nlp-answer">'+fmt(tt)+' jam</div>'+
      '<div class="nlp-steps">Jarak: '+s4+' km, Kecepatan: '+v2+' km/jam<br>t = s/v = <strong>'+fmt(tt)+' jam</strong></div>';
  }

  // ── SUHU ──
  if(/celsius|celcius.*fahrenheit|(\d+)\s*°?c\b/i.test(t)&&nums.length){
    var c2=nums[0],f=c2*9/5+32;
    hist_save('NLP Suhu '+c2+'°C = '+fmt(f)+'°F');
    return '<strong>🌡️ Konversi Suhu</strong>'+
      '<div class="nlp-answer">'+fmt(f)+' °F</div>'+
      '<div class="nlp-steps">'+c2+'°C → °F = ('+c2+' × 9/5) + 32 = <strong>'+fmt(f)+'°F</strong></div>';
  }
  if(/fahrenheit.*celsius|celcius|(\d+)\s*°?f\b/i.test(t)&&nums.length){
    var f2=nums[0],c3=(f2-32)*5/9;
    hist_save('NLP Suhu '+f2+'°F = '+fmt(c3)+'°C');
    return '<strong>🌡️ Konversi Suhu</strong>'+
      '<div class="nlp-answer">'+fmt(c3)+' °C</div>'+
      '<div class="nlp-steps">'+f2+'°F → °C = ('+f2+' − 32) × 5/9 = <strong>'+fmt(c3)+'°C</strong></div>';
  }

  // ── KEUANGAN ──
  if((/keuntungan|untung|profit/i.test(t))&&nums.length>=2){
    var modal=Math.max(...nums),pctP=Math.min(...nums);
    if(pctP<=100){
      var profit=modal*(pctP/100),totalP=modal+profit;
      hist_save('NLP Keuntungan modal '+rp(modal)+' '+pctP+'%: '+rp(totalP));
      return '<strong>💰 Keuntungan Usaha</strong>'+
        '<div class="nlp-answer">'+rp(totalP)+'</div>'+
        '<div class="nlp-steps">Modal: '+rp(modal)+'<br>Keuntungan '+pctP+'%: +'+rp(profit)+'<br>Total: <strong>'+rp(totalP)+'</strong></div>';
    }
  }
  if((/bunga|pinjaman/i.test(t))&&nums.length>=3){
    var pr2=nums.find(function(n){return n>1000;})||nums[0];
    var rt2=nums.find(function(n){return n<50;})||nums[1];
    var yr2=nums.find(function(n){return n<30&&n!==rt2;})||nums[2];
    var interest=pr2*(rt2/100)*yr2,totalI=pr2+interest;
    hist_save('NLP Bunga '+rp(pr2)+' '+rt2+'% '+yr2+'th: '+rp(totalI));
    return '<strong>🏦 Bunga Pinjaman</strong>'+
      '<div class="nlp-answer">Total Bayar: '+rp(totalI)+'</div>'+
      '<div class="nlp-steps">Pokok: '+rp(pr2)+'<br>Bunga '+rt2+'% × '+yr2+' th: +'+rp(interest)+'<br>Total: <strong>'+rp(totalI)+'</strong></div>';
  }

  // ── MATEMATIKA DASAR (operasi) ──
  var OPS=[
    ['ditambah|tambah(?!kan)|plus|dijumlah','+'],
    ['dikurangi|kurang(?!i)|minus','-'],
    ['dikali(?:\\s*dengan)?|kali(?:\\s*dengan)?|dikalikan','×'],
    ['dibagi(?:\\s*dengan)?|bagi(?:\\s*dengan)?','÷']
  ];
  for(var oi=0;oi<OPS.length;oi++){
    if(new RegExp(OPS[oi][0],'i').test(t)&&nums.length>=2){
      var A=nums[0],B=nums[1],R;
      var opSym=OPS[oi][1];
      if(opSym==='+')R=A+B;
      else if(opSym==='-')R=A-B;
      else if(opSym==='×')R=A*B;
      else if(opSym==='÷'){if(B===0)return'Tidak bisa membagi dengan nol! 😅';R=A/B;}
      hist_save('NLP: '+A+' '+opSym+' '+B+' = '+fmt(R));
      return '<strong>🔢 Operasi Dasar</strong>'+
        '<div class="nlp-answer">'+A+' '+opSym+' '+B+' = '+fmt(R)+'</div>';
    }
  }

  // ── Akar ──
  if(/akar/i.test(t)&&nums.length){
    var v=nums[0],rv=Math.sqrt(v);
    hist_save('NLP √'+v+' = '+fmt(rv));
    return '<strong>√ Akar Kuadrat</strong>'+
      '<div class="nlp-answer">√'+v+' = '+fmt(rv)+'</div>';
  }
  // Pangkat
  if(/pangkat|kuadrat|kubik/i.test(t)&&nums.length>=1){
    var base=nums[0],exp2=nums[1]||(/kubik/i.test(t)?3:2);
    var rp2=Math.pow(base,exp2);
    hist_save('NLP '+base+'^'+exp2+' = '+fmt(rp2));
    return '<strong>🔢 Perpangkatan</strong>'+
      '<div class="nlp-answer">'+base+'^'+exp2+' = '+fmt(rp2)+'</div>'+
      '<div class="nlp-steps">'+base+' dipangkatkan '+exp2+' = <strong>'+fmt(rp2)+'</strong></div>';
  }

  return 'Maaf, saya tidak dapat mengenali jenis soal ini. Coba gunakan kata kunci yang lebih spesifik seperti: <em>diskon, kecepatan, luas, volume, rata-rata, keuntungan</em>.';
}

/* ════════════════════════════════════════
   JARAK
════════════════════════════════════════ */
function jarak_update(){
  var type=document.getElementById('j-type').value;
  document.getElementById('j-wrap-s').style.display=(type==='v'||type==='t')?'block':'none';
  document.getElementById('j-wrap-v').style.display=(type==='s'||type==='t')?'block':'none';
  document.getElementById('j-wrap-t').style.display=(type==='v'||type==='s')?'block':'none';
}
function calc_jarak(){
  var type=document.getElementById('j-type').value;
  var s=parseFloat(document.getElementById('j-dist').value);
  var v=parseFloat(document.getElementById('j-speed').value);
  var tm=parseFloat(document.getElementById('j-time').value);
  var r,u;
  if(type==='v'){if(isNaN(s)||isNaN(tm)||tm===0){alert('Isi jarak & waktu.');return;}r=s/tm;u='km/jam';}
  else if(type==='s'){if(isNaN(v)||isNaN(tm)){alert('Isi kecepatan & waktu.');return;}r=v*tm;u='km';}
  else{if(isNaN(s)||isNaN(v)||v===0){alert('Isi jarak & kecepatan.');return;}r=s/v;u='jam';}
  document.getElementById('j-r1').textContent=r.toFixed(2)+' '+u;
  document.getElementById('j-result').classList.remove('hidden');
  document.getElementById('j-placeholder').style.display='none';
  hist_save('Jarak/Waktu: '+r.toFixed(2)+' '+u);
}


/* ════════════════════════════════════════
   KEUANGAN
════════════════════════════════════════ */
function fin_tab(name,btn){
  document.querySelectorAll('.fin-tab').forEach(function(b){b.classList.remove('active');});
  document.querySelectorAll('.fin-panel').forEach(function(p){p.classList.remove('active');});
  btn.classList.add('active');
  document.getElementById('fin-'+name).classList.add('active');
}
function calc_profit(){
  var m=parseFloat(document.getElementById('p-modal').value);
  var p=parseFloat(document.getElementById('p-pct').value);
  if(isNaN(m)||isNaN(p)){alert('Isi semua field.');return;}
  var profit=m*(p/100),total=m+profit;
  document.getElementById('p-r1').textContent=rp(m);
  document.getElementById('p-r2').textContent=rp(profit);
  document.getElementById('p-r3').textContent=rp(total);
  document.getElementById('p-result').classList.remove('hidden');
  document.getElementById('p-placeholder').style.display='none';
  hist_save('Keuntungan: Modal '+rp(m)+' + '+p+'% = '+rp(total));
}
function calc_interest(){
  var pr=parseFloat(document.getElementById('i-principal').value);
  var rt=parseFloat(document.getElementById('i-rate').value);
  var yr=parseFloat(document.getElementById('i-years').value);
  if(isNaN(pr)||isNaN(rt)||isNaN(yr)){alert('Isi semua field.');return;}
  var interest=pr*(rt/100)*yr,total=pr+interest;
  document.getElementById('i-r1').textContent=rp(pr);
  document.getElementById('i-r2').textContent=rp(interest);
  document.getElementById('i-r3').textContent=rp(total);
  document.getElementById('i-result').classList.remove('hidden');
  document.getElementById('i-placeholder').style.display='none';
  hist_save('Bunga: '+rp(pr)+' × '+rt+'% × '+yr+'th = '+rp(total));
}

/* ════════════════════════════════════════
   HISTORY
════════════════════════════════════════ */
function hist_save(txt){
  var h=JSON.parse(localStorage.getItem('elk_h')||'[]');
  h.unshift({text:txt,time:new Date().toLocaleString('id-ID')});
  if(h.length>80)h.pop();
  localStorage.setItem('elk_h',JSON.stringify(h));
  counter_update();
  hist_render();
}
function hist_render(){
  var h=JSON.parse(localStorage.getItem('elk_h')||'[]');
  var el=document.getElementById('hist-list');
  if(!h.length){
    el.innerHTML='<div class="hist-empty"><div class="empty-icon">📭</div><p>Belum ada riwayat perhitungan.<br>Lakukan perhitungan untuk melihat riwayat di sini.</p></div>';
  }else{
    el.innerHTML=h.map(function(i){
      return '<div class="hist-item"><div class="hist-time">'+i.time+'</div><div class="hist-text">'+i.text+'</div></div>';
    }).join('');
  }
}
function hist_clear(){
  if(!confirm('Hapus semua riwayat?'))return;
  localStorage.removeItem('elk_h');
  counter_update();hist_render();
}

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
jarak_update();
konv_update();
counter_update();
hist_render();te();


