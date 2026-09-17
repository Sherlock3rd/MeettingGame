/* Four distinct council decisions. Stops at assignment, never executes a job. */
(() => {
  const $=s=>document.querySelector(s), M=window.CouncilModel, G=window.CouncilGuide, I=window.CouncilIdentity;
  const portraits={杰森:0,伊摩:1,卡莱布:2,科尔:3,博姆:4,小八:5,瑞秋:6,你:7};
  const names={call:'谁先领头',sway:'一诺换票',amend:'把事安排妥',draft:'各领其命'};
  let state={},timer=null,afterLine=null;
  const face=I.face;
  const sideName=s=>s==='a'?'暗中突破':'全面反击';
  function currentVotes(player='a'){
    if(state.mode==='call')return M.callVotes(state.first||'伊摩',player);
    if(state.mode==='amend')return M.proposalVotes(state.preps,player);
    return M.votes(state.mode==='draft'?'mission':state.mode,player,state.accepted);
  }
  function terms(){return state.mode==='amend'&&state.decision?.winner==='a'?state.preps.map(k=>M.preparations[k].effect).join('；'):state.accepted&&state.decision?.winner==='a'?'镇内不动炸药':'按议会决议行事';}
  function jobData(id){return window.CouncilActions.job(state.decision.winner,id);}
  function stop(){clearTimeout(timer);timer=null;afterLine=null;}
  function positionBubble(){
    const stage=$('.stage'),avatar=$(`.seat[data-who="${state.who||'杰森'}"] .avatar`),bubble=$('#speechBubble');
    if(!avatar||!$('#game').classList.contains('active'))return;
    const r=stage.getBoundingClientRect(),a=avatar.getBoundingClientRect(),b=bubble.getBoundingClientRect();
    const x=a.left+a.width/2-r.left,half=b.width/2,c=Math.min(r.width-half-12,Math.max(half+12,x));
    bubble.style.left=`${c}px`;bubble.style.top=`${Math.max(b.height+12,a.top-r.top-10)}px`;
    bubble.style.setProperty('--tail-x',`${Math.max(24,Math.min(b.width-24,x-c+half))}px`);
  }
  function say(who,text){
    state.who=who;
    $('#speaker').innerHTML=I.label(who);$('#line').textContent=I.text(text);
    $('#bubbleName').innerHTML=I.label(who);$('#bubbleText').textContent=I.text(text);
    ['#bubbleAvatar','#dialogueAvatar'].forEach(sel=>{$(sel).className=`${sel==='#bubbleAvatar'?'mini':'dialogue-avatar'} portrait p${portraits[who]}`;});
    document.querySelectorAll('.seat').forEach(el=>el.classList.toggle('active',el.dataset.who===who));
    positionBubble();requestAnimationFrame(positionBubble);
  }
  function closePanel(){ $('#choiceLayer').classList.remove('show');$('.stage').classList.remove('panel-open'); }
  function panel(title,body){
    state.phase='panel';afterLine=null;$('#continueBtn').hidden=true;
    $('#ballotBoard').classList.remove('show');
    $('.stage').classList.add('panel-open');$('#choiceLayer').classList.add('show');
    $('#choicePanel').innerHTML=I.text(`<h2>${title}</h2>${body}`);
  }
  function button(label,id,secondary=false){return `<button class="${secondary?'secondary':'primary'}" id="${id}">${label}</button>`;}
  function dialogue(lines,done){
    closePanel();state.phase='dialogue';let i=0;
    const next=()=>{if(i===lines.length){afterLine=null;done();return;}say(...lines[i++]);$('#continueBtn').hidden=false;$('#continueBtn').textContent=i===lines.length?'听明白了 ↵':'继续 ↵';};
    afterLine=next;next();
  }
  function forecast(locked=false){
    const votes=currentVotes().slice(0,6),t=M.tally(votes);
    window.CouncilVoteView.update(votes,'兄弟们现在的想法','forecast',{accepted:state.accepted,preps:state.preps,locked});
    $('#countA').textContent=`${t.a} 人表态`;$('#countB').textContent=`${t.b} 人表态`;
    return '';
  }
  function start(mode){
    stop();state={mode,phase:'dialogue',accepted:false,decision:null,job:null,player:null,preps:[],revealed:[]};
    window.CouncilVoteView.reset(mode);
    G.set('opening');
    $('#menu').style.display='none';$('#game').classList.add('active');$('.stage').classList.remove('in-action');
    $('#headerMode').textContent=names[mode];$('#ballotBoard').classList.remove('show');$('#whisper').classList.remove('show');
    document.querySelectorAll('.seat').forEach(el=>{el.classList.remove('vote-a','vote-b','changed','active');el.querySelector('.seat-vote').textContent='';});
    $('#countA').textContent='尚未表态';$('#countB').textContent='尚未表态';
    $('#flowLabel').textContent='宣案 · 落徽 · 选差事 · 领命 · 散会';
    $('#progress').innerHTML='';
    const intro=[['杰森','德拉尼炸了商业街，一间铺子，三条人命。兄弟们，说说这笔账怎么算。'],['伊摩','暗中突破，先断他们的武器。'],['博姆','全面反击，直接打垮他们。']];
    if(mode==='sway')intro.push(['科尔','我现在赞成全面反击。要是在镇里埋炸药等车队，旁边的镇民怎么办？']);
    if(mode==='call')intro.push(['科尔','我和小八还没定。谁肯先站出来领头，我们就跟谁。']);
    if(mode==='amend')intro.push(['杰森','暗中走这条路，得先把准备安排好。今晚只有两组兄弟能提前出门，三件事不能全办。']);
    if(mode==='draft')intro.push(['杰森','先落徽，把方向定下来。然后兄弟们分工，你自己说愿意接哪件事。']);
    dialogue(intro,()=>({sway:negotiate,call:callChoice,amend:amendChoice,draft:voteChoice}[mode])());
  }
  function callChoice(){
    G.set('call');
    say('杰森','你想先听谁把领队的事说清？一旦落徽，就不再改票。');
    panel('谁带第一队？',`<div class="followers"><span>等领队</span>${face('科尔')}${face('小八')}<span class="join-arrow">↓</span></div><div class="choices"><button class="choice leader-choice route-a" id="callImo"><b class="decision-route">暗中突破</b>${face('伊摩')}<span class="leader-action">请他领头 →</span></button><button class="choice leader-choice route-b" id="callBom"><b class="decision-route">全面反击</b>${face('博姆')}<span class="leader-action">请他领头 →</span></button></div>`);
    $('#callImo').onclick=()=>beginCall('伊摩');$('#callBom').onclick=()=>beginCall('博姆');
  }
  function beginCall(first){state.first=first;state.revealed=[];reveal(M.callVotes(first,'a').slice(0,3),()=>{voteChoice();});}
  function amendChoice(){
    G.set('amend');
    say('杰森','就两组人。疏散、摸路、接应，你来安排。');
    panel('今晚的人手',forecast()+`<div class="crew-slots">${[0,1].map(n=>`<div class="crew-slot ${state.preps[n]?'filled':''}"><strong>第${n+1}组</strong><span>${state.preps[n]?M.preparations[state.preps[n]].name:'＋ 待安排'}</span></div>`).join('')}</div><div class="prep-options">${Object.entries(M.preparations).map(([id,p])=>`<button class="prep ${state.preps.includes(id)?'selected':''}" data-prep="${id}" aria-pressed="${state.preps.includes(id)}"><b>${state.preps.includes(id)?'✓ ':''}${p.name}</b><span>${p.effect}</span><em>${state.preps.includes(id)?'撤回人手':'派一组人'}</em></button>`).join('')}</div><div class="actions">${button('落徽表决','submitPlan')}</div>`);
    $('#submitPlan').disabled=state.preps.length!==2;
    document.querySelectorAll('[data-prep]').forEach(b=>{b.disabled=state.preps.length===2&&!state.preps.includes(b.dataset.prep);});
    document.querySelectorAll('[data-prep]').forEach(b=>b.onclick=()=>{const k=b.dataset.prep;if(state.preps.includes(k))state.preps=state.preps.filter(x=>x!==k);else if(state.preps.length<2)state.preps.push(k);amendChoice();});
    $('#submitPlan').onclick=voteChoice;
  }
  function negotiate(){
    G.set('sway');
    say('杰森','科尔，你还有什么顾虑？');
    panel('开票前，最后一句话',forecast()+`<div class="negotiation"><div>${face('科尔')}<b>科尔 · 担心沿街的镇民</b><p>“你们要在镇里引爆，我就不支持。”</p></div><div class="actions">${button('找科尔谈谈','talk')}${button('不谈了，照常投票','direct',true)}</div></div>`);
    $('#talk').onclick=offer;$('#direct').onclick=voteChoice;
  }
  function offer(){
    G.set('offer');
    say('科尔','想让我支持暗中突破，就答应镇里不动炸药。靠车把他们截住，别再伤到镇民。');
    panel('这句保证，你给吗？',`<div class="offer-head">${face('科尔')}<p>“镇里不动炸药。做得到，我跟你。”</p></div><div class="choices"><button class="choice" id="accept"><b>签下：镇内禁用炸药</b><span>科尔 → 暗中突破</span><em>整备车辆，截住车队</em></button><button class="choice" id="reject"><b>不签，保留爆破</b><span>科尔 → 全面反击</span></button></div>`);
    $('#accept').onclick=()=>{state.accepted=true;forecast(true);G.set('reply');dialogue([['科尔','行，我愿意支持暗中突破。等会儿落徽时算我一个。记住，不许炸。']],voteChoice);};
    $('#reject').onclick=()=>{forecast(true);G.set('reply');dialogue([['科尔','那就没得谈了。我还是赞成全面反击。']],voteChoice);};
  }
  function voteChoice(){
    G.set('vote',state.mode==='call'?{why:'前三票已经算数。现在轮到你，之后还有三位兄弟；你的选择不能改掉已经投下的票。',action:'选一边投下你的一票；随后继续点余下的票。'}:{});
    say('杰森',state.mode==='call'?'前三票记下了。轮到你，落徽。':'话说完了。兄弟们，落徽。');
    if(state.mode!=='call')window.CouncilVoteView.update([],'四票通过','ballot',{accepted:state.accepted,preps:state.preps});
    panel('落下你的帮徽',`${state.accepted?'<p class="contract">已约定 · 镇内禁用炸药</p>':''}<div class="your-token">${face('你')}<span class="ballot-emblem">1</span></div><div class="choices ballot-choices"><button class="choice" id="voteA"><span class="token-socket" aria-hidden="true">＋</span><b>暗中突破</b><span>落徽支持</span></button><button class="choice" id="voteB"><span class="token-socket" aria-hidden="true">＋</span><b>全面反击</b><span>落徽支持</span></button></div>`);
    $('#voteA').onclick=()=>ballot('a');$('#voteB').onclick=()=>ballot('b');
  }
  function ballot(player){
    state.player=player;const order=currentVotes(player);state.votes=order;
    if(state.mode!=='call')state.revealed=[];
    reveal(order.slice(state.revealed.length),()=>{state.decision=M.tally(order);verdict();});
  }
  function reveal(order,done){
    G.set('ballot',state.mode==='call'&&state.revealed.length===0?{action:'先看领头人、科尔和小八落徽；三票之后，轮到你投票。'}:{});
    closePanel();state.phase='ballot';$('#continueBtn').hidden=true;let i=0;
    const next=()=>{
      if(i===order.length){timer=null;done();return;}
      const v=order[i++];state.revealed.push(v);
      say(v.who,`${v.reason|| (v.changed?'说好了，不动炸药。':'')}我投${sideName(v.side)}。`);
      window.CouncilVoteView.update(state.revealed,`${v.who}已落徽`,'ballot',{accepted:state.accepted,preps:state.preps});
      timer=setTimeout(next,1350);
    };next();
  }
  function verdict(){
    G.set('verdict');
    const {winner,a,b}=state.decision;
    window.CouncilVoteView.update(state.votes,'已落槌','ballot',{accepted:state.accepted,preps:state.preps});
    say('杰森',`${sideName(winner)}，${a} 比 ${b}。方向定了，接着说怎么动手。`);
    panel(`${sideName(winner)} · ${a}:${b}`,`<div class="decision-seal">议会通过</div><p class="contract">${terms()}</p><div class="actions">${button(state.mode==='draft'?'和兄弟分工':'摊开行动纸','jobs')}</div>`);
    $('#jobs').textContent='商定接下来的行动';
    $('#jobs').onclick=()=>{G.set('action');dialogue(window.CouncilActions.briefing(winner),state.mode==='draft'?dutyTalk:jobList);};
  }
  function dutyTalk(){
    G.set('duty');
    const side=state.decision.winner,plan=window.CouncilActions.plan(side);state.duty=null;
    window.CouncilVoteView.assignment({side,status:'open'});
    say(plan.peer,plan.intro);
    panel('你接哪件？',`${face(plan.peer)}<div class="duty-replies">${plan.choices.map(c=>`<button class="duty-reply" data-duty="${c.id}"><b>“${c.line}”</b><span>你负责：${jobData(c.id).name}</span></button>`).join('')}</div>`);
    document.querySelectorAll('[data-duty]').forEach(b=>b.onclick=()=>{
      const c=plan.choices.find(c=>c.id===b.dataset.duty);
      state.duty=window.CouncilActions.claim(side,c.id);window.CouncilVoteView.assignment(state.duty);
      G.set('dutyReply');
      dialogue([['你',c.line],[plan.peer,c.reply]],dutyConfirm);
    });
  }
  function dutyConfirm(){
    G.set('confirm');
    const d=state.duty;
    panel('三件差事，各自负责',`<div class="actions">${button('就这么分，领命','depart')}${button('我想换一件','other',true)}</div>`);
    $('#depart').onclick=()=>confirmAssignment(d.job);$('#other').onclick=dutyTalk;
  }
  function jobList(){
    G.set('jobs');
    state.job=null;$('#flowLabel').textContent='决议已定 · 挑选差事 · 确认领命';
    const winner=state.decision.winner,list=window.CouncilActions.jobs(winner).map(j=>[j.id,j]);
    say('杰森','收车、拆车、改车。你先挑一项，剩下两件兄弟们接。');
    const descriptions={warehouse:state.accepted?'不许爆破。观察守卫，分三次把武器箱运出来。':'可以等巡逻空当搬箱，也能直接爆破，但炸毁就带不回材料。',tail:'随目标快慢调整跟踪距离。太近会暴露，太远会跟丢。',intercept:'连续三个路口，找出畅通车道；选错路就会让补给车逃走。',assault:'盯住守卫开火和换弹；躲过扫射，抓住空当击退三组守卫。'};
    panel('出发前的三件差事',`<p class="contract">${terms()}</p><div class="job-folders">${list.map(([id,j])=>`<button class="folder" data-job="${id}"><small>${j.map}</small><h3>${j.name}</h3><p>${j.content}</p><div class="unsigned-mark">＋ 认领人</div><strong>拿起这张 →</strong></button>`).join('')}</div>`);
    document.querySelectorAll('[data-job]').forEach(b=>b.onclick=()=>jobDetail(b.dataset.job));
  }
  function jobDetail(id){
    G.set('confirm');
    const j=jobData(id);
    panel(j.name,`<article class="claim-paper"><small>${j.map}</small><p>${j.skill}</p><p>${terms()}</p><div class="claim-signature">${face('你')}<strong>待签字</strong></div></article><div class="actions">${button('签字领命','depart')}${button('放回，换另一张','other',true)}</div>`);
    $('#other').onclick=jobList;
    $('#depart').onclick=()=>confirmAssignment(id);
  }
  function confirmAssignment(id){
    G.set('claim');
    const j=jobData(id);
    state.duty=window.CouncilActions.claim(state.decision.winner,id);
    state.job={id,name:j.name,map:j.map,status:'assigned',quiet:state.accepted&&state.decision.winner==='a'};
    say('你',`${j.name}，我领了。`);
    let claimed=1;
    panel('差事各有所属',assignmentPapers(claimed));
    const nextClaim=()=>{const owner=state.duty.assignments[claimed++];
      say(owner.who,`${jobData(owner.id).name}归我。准备齐了，一起去伏击车队。`);
      if(claimed<state.duty.assignments.length){panel('差事各有所属',assignmentPapers(claimed));timer=setTimeout(nextClaim,1400);return;}
      timer=null;state.duty.status='assigned';G.set('end');
      $('#flowLabel').textContent='票已落定 · 各自领命 · 待行动';
      panel('各自领命 · 散会',assignmentPapers(claimed)+`<p class="contract">准备齐全 → 前往伏击袭击者车队</p><p class="contract">${sideName(state.decision.winner)} · ${terms()}</p><div class="actions">${button('回到会所前厅','home')}</div>`);
      $('#home').onclick=home;
    };timer=setTimeout(nextClaim,1400);
  }
  function assignmentPapers(claimed){
    const d=state.duty;
    return `<div class="duty-papers final-assignments" aria-live="polite">${d.assignments.map((p,i)=>`<article class="duty-paper ${p.who==='你'?'yours':'peer-paper'} ${i<claimed?'claimed':'awaiting'}"><small>${jobData(p.id).map}</small><h3>${jobData(p.id).name}</h3><p>${jobData(p.id).skill}</p><div class="duty-signature">${i<claimed?face(p.who):'<span class="unsigned-mark">＋ 认领人</span>'}<strong class="claim-stamp">${i<claimed?'已领命':'待认领'}</strong></div></article>`).join('')}</div>`;
  }
  function home(){stop();state.phase='menu';closePanel();$('#game').classList.remove('active');$('#menu').style.display='block';$('#headerMode').textContent='会所议事准备';}
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>start(b.dataset.mode));
  $('#continueBtn').onclick=()=>{if(afterLine)afterLine();};$('#menuBtn').onclick=home;
  document.addEventListener('keydown',e=>{if(e.repeat)return;if((e.key==='Enter'||e.key===' ')&&state.phase==='dialogue'&&afterLine){e.preventDefault();afterLine();}});
  window.addEventListener('resize',()=>requestAnimationFrame(positionBubble));
})();
