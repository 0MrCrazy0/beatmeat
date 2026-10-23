// v10: finisher prompt for a human winner during END THEM!
(function(){const o=drawHUD;drawHUD=function(){o.apply(this,arguments);
 if(typeof F==='undefined'||!F||F.phase!=='finish'||!F.win||F.win.cpu||G.freezeHud)return;const pad=LAST_DEV&&LAST_DEV[F.win.idx||0]==='pad';
 const m=pad?'LT':'METER';const a=Math.sin(performance.now()/120)*.25+.75;X.save();X.globalAlpha=a;const y=H-SAFE.b-44;X.fillStyle='rgba(0,0,0,.6)';rrect(X,W/2-120,y-9,240,18,5);X.fill();
 txt(m+' + \u2193 / \u2191 / \u2192  FINISHER'+(STAGE_FIN[F.stIdx]?'   \u2022   '+m+' + \u2190  STAGE KILL':''),W/2,y,{sz:7,big:1,c:'#ffd23a',lw:1.5});X.restore()}})();
