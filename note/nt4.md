---
layout: note
title: マイリスト合計再生時間ブックマークレット
firstedit: 2022/07/10
finaledit: 2022/07/10
headimg: note_default.png
---
以下を『ブックマークバー』にドラッグ&ドロップ  
<div style="width:100%;background-color:#808080;">
javascript:alert((n=>[n/3600,n%(3600)/60,n%(60)].map((v,i)=>("0"+Math.floor(v)).slice((-2)**(i&&1))))([...document.querySelectorAll(".NC-VideoLength")].reduce((ac,el)=>ac+el.innerText.split(':').reduce((a,l,i,r)=>a+l*60**(r.length-1-i),0),0)||0).filter((t,i)=>i||t!=0).join(':'))
</div>  
マイリスト画面でクリックして使用  

以下は備忘録  
JS初心者向けでも上級者テクニックでもない、ただの俺流コード
# 各パーツ解説
(編集中)
