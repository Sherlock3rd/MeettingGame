/* Four purpose-built readouts; counts are projections of model records. */
(() => {
 const game=document.querySelector('#game'),stage=document.querySelector('.stage');
 const toolbar=document.createElement('div');toolbar.className='vote-view-toolbar';game.prepend(toolbar);
 const deck=document.createElement('section');deck.id='voteView';deck.className='vote-view';deck.setAttribute('aria-label','议会记录');stage.after(deck);game.append(document.querySelector('#choiceLayer'));
 const people=['伊摩','博姆','卡莱布','小八','科尔','瑞秋','你'],portraits={杰森:0,伊摩:1,卡莱布:2,科尔:3,博姆:4,小八:5,瑞秋:6,你:7};
 const labels={call:['谁先领头','领头的人先落徽 · 其他兄弟随后表态'],sway:['一诺换票','承诺写在纸上 · 支持落在桌上'],amend:['把事安排妥','两组兄弟 · 三件准备 · 全桌表决'],draft:['各领其命','方向大家定 · 你来认领一件事']};
 const portrait=who=>`<i class="portrait p${portraits[who]}"></i>`;
 const I=window.CouncilIdentity;
 const badge=v=>`<span class="vote-chip ${v.side}">${portrait(v.who)}${I.label(v.who)}</span>`;
 let mode='call',votes=[],label='尚未开票',phase='idle',meta={},assignment=null;
 function render(){
  const a=votes.filter(v=>v.side==='a').length,b=votes.filter(v=>v.side==='b').length,n=votes.length,forecast=phase==='forecast',unit=forecast?'人':'票';
  game.dataset.voteView=mode;deck.dataset.phase=phase;
  if(!window.CouncilGuide)toolbar.innerHTML=`<b>${labels[mode][0]}</b><span>${labels[mode][1]}</span><small>7 位投票 · 会长不投票 · 4 票通过</small>`;
  const caption=forecast?`<div class="thought-caption"><strong>席间商议</strong><b>未开票</b></div>`:`<div class="view-caption"><strong class="red">暗中突破 <b>${phase==='idle'?'—':a}</b><small>票</small></strong><span>${n===7?'已点齐':'四票通过'}<br>${phase==='idle'?'未开票':`${n} / 7 已落徽`}</span><strong class="blue"><b>${phase==='idle'?'—':b}</b><small>票</small> 全面反击</strong></div>`;
  let body='';
  if(mode==='call'){
   const left=votes.filter(v=>v.side==='a'),right=votes.filter(v=>v.side==='b').reverse();
   body=`<div class="majority-track" aria-label="每格一票，任一方占四格通过">${left.map(v=>`<div class="vote-cell a">${badge(v)}</div>`).join('')}${Array.from({length:7-n},()=>'<div class="vote-cell pending">待投</div>').join('')}${right.map(v=>`<div class="vote-cell b">${badge(v)}</div>`).join('')}<div class="majority-gate"></div></div><div class="line-key"><span>暗中突破 → 占到第 4 格通过</span><b>${a>=4?'暗中突破已过半':b>=4?'全面反击已过半':'双方争取中间这一格'}</b><span>第 4 格通过 ← 全面反击</span></div><div class="cast-order">${votes.map((v,i)=>`<span>${i+1}. ${v.who} <b class="${v.side==='a'?'red':'blue'}">${v.side==='a'?'潜':'战'}</b></span>`).join('')||'<span>尚无人领头。</span>'}</div>`;
  }else if(mode==='sway'){
   body=`<div class="pledge-document"><div class="pledge-signature">${portrait('科尔')}<div><b>科尔的承诺</b><span>${meta.accepted?'已签：支持暗中突破':'未签：仍支持全面反击'}</span></div><strong class="signature">${meta.accepted?'科尔 ✓':'待议'}</strong></div><p>${meta.accepted?'你答应：镇内不动炸药。伏击车队时也得守约。':'“不动镇里的炸药，我才支持你们潜进去。”'}</p></div><div class="contract-trays"><div><small class="red">暗中突破</small><div>${votes.filter(v=>v.side==='a').map(badge).join('')||'—'}</div></div><div><small class="blue">全面反击</small><div>${votes.filter(v=>v.side==='b').map(badge).join('')||'—'}</div></div></div>`;
  }else if(mode==='amend'){
   body=`<div class="prep-summary">${Object.entries(CouncilModel.preparations).map(([k,p])=>`<span class="${meta.preps?.includes(k)?'ready':''}">${meta.preps?.includes(k)?'✓':'—'} ${p.name}</span>`).join('')}</div><div class="opinion-grid">${people.map(who=>{const v=votes.find(v=>v.who===who);return `<div class="opinion ${v?.side||'pending'}">${portrait(who)}<div>${I.label(who)}<span>${v?(v.side==='a'?'已投 · 暗中突破':'已投 · 全面反击'):'待落徽'}</span></div></div>`;}).join('')}</div>`;
  }else{
   body=`<div class="rollcall">${people.map(who=>{const v=votes.find(v=>v.who===who);return `<div class="roll-person ${v?.side||'pending'}">${portrait(who)}${I.label(who)}<span>${v?'已投 · '+(v.side==='a'?'潜':'战'):'待投'}</span></div>`;}).join('')}</div>`;
   if(assignment){
    const plan=CouncilActions.plan(assignment.side);
    body=`<div class="duty-papers">${plan.choices.map(c=>{const j=CouncilActions.job(assignment.side,c.id),who=assignment.assignments?.find(p=>p.id===c.id)?.who;return `<article class="duty-paper ${who==='你'?'yours':''}"><small>${j.map}</small><h3>${j.name}</h3><p>${c.goal}</p><div class="duty-signature">${who?I.face(who):'<span class="unsigned-mark">＋ 认领人</span>'}<span>${who?(assignment.status==='assigned'?'已领命':'待确认'):''}</span></div></article>`;}).join('')}</div>`;
   }
  }
  if(forecast){
   const thoughts=`<div class="thought-list">${votes.map(v=>`<div class="thought-person ${v.changed?'changed':''}">${portrait(v.who)}<div>${I.label(v.who)}<span class="stance ${v.side}">${v.side==='a'?'暗中突破':'全面反击'}${v.changed?' ✓':''}</span>${mode==='amend'?`<small>${v.reason}</small>`:v.who==='科尔'&&mode==='sway'?`<small>${meta.accepted?'已约定：镇内不爆破':'顾虑：镇民安危'}</small>`:''}</div></div>`).join('')}</div>`;
   body=(mode==='sway'?body.slice(0,body.indexOf('<div class="contract-trays">')):mode==='amend'?body.slice(0,body.indexOf('<div class="opinion-grid">')):'')+thoughts;
  }
  deck.innerHTML=I.text(caption+body);
  people.forEach(who=>{const seat=document.querySelector(`.seat[data-who="${who}"]`),v=votes.find(v=>v.who===who);seat.classList.remove('vote-a','vote-b','view-a','view-b','view-forecast');if(v){seat.classList.add(`view-${v.side}`);if(forecast)seat.classList.add('view-forecast');}seat.querySelector('.seat-vote').textContent=v&&!forecast?(v.side==='a'?'潜':'战'):'';});
 }
 window.CouncilVoteView={reset(m){mode=m;votes=[];phase='idle';label='尚未开票';meta={};assignment=null;render();},update(list,text,kind='ballot',details={}){const previous=votes;votes=list.map(v=>({...v,changed:v.changed||(kind==='forecast'&&phase==='forecast'&&previous.some(p=>p.who===v.who&&p.side!==v.side))}));label=text;phase=kind;meta=details;render();},assignment(d){assignment={...d};render();}};render();
})();
