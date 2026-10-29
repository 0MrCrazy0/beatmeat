// v10: finisher prompt for a human winner during FINISH THEM!
(function(){const o=drawHUD;drawHUD=function(){o.apply(this,arguments);
 if(typeof F==='undefined'||!F||F.phase!=='finish'||!F.win||F.win.cpu||G.freezeHud)return;const pad=LAST_DEV&&LAST_DEV[F.win.idx||0]==='pad';
 const a=Math.sin(performance.now()/120)*.25+.75;X.save();X.globalAlpha=a;const y=H-SAFE.b-44;X.fillStyle='rgba(0,0,0,.6)';rrect(X,W/2-150,y-9,300,18,5);X.fill();
 txt('\u2193\u2198\u2192\u2193\u2198\u2192 + P / K   \u2022   \u2193\u2199\u2190\u2193\u2199\u2190 + P'+(STAGE_FIN[F.stIdx]?'   \u2022   \u2193\u2193 + THROW  STAGE KILL':''),W/2,y,{sz:7,big:1,c:'#ffd23a',lw:1.5});X.restore()}})();
