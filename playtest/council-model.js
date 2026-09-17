/* Shared by the playable UI and node tests. Values are local demonstration data. */
(function(root) {
  const jobs = {
    warehouse: {name:'仓库渗透', map:'商业街后巷', skill:'观察巡逻 · 选择时机', reward:'枪械材料', side:'a'},
    tail: {name:'盯梢账房', map:'灰溪镇', skill:'控制跟踪距离', reward:'据点情报', side:'a'},
    intercept: {name:'公路截击', map:'灰溪公路', skill:'读路况 · 变道截停', reward:'车辆零件', side:'b'},
    assault: {name:'车厂突袭', map:'废弃车厂', skill:'识别威胁 · 掩护反击', reward:'枪械材料', side:'b'}
  };
  function votes(mode, player, accepted=false) {
    const sides = mode==='sway' ? ['a','b','a','b',accepted?'a':'b','b']
      : mode==='mission' ? ['a','b','a','b','a','a'] : ['a','b','a','b','a','b'];
    return ['伊摩','博姆','卡莱布','小八','科尔','瑞秋','你'].map((who,i)=>({who,side:i===6?player:sides[i],changed:mode==='sway'&&accepted&&who==='科尔'}));
  }
  function tally(list) {
    const a=list.filter(v=>v.side==='a').length,b=list.filter(v=>v.side==='b').length;
    return {a,b,winner:a===b?null:a>b?'a':'b'};
  }
  function newJob(id, quiet=false) {
    if (!jobs[id]) throw Error('Unknown job');
    return {id,quiet,turn:0,progress:0,damage:0,distance:25,done:false,success:false,selected:[],message:'无线电接通。等你行动。'};
  }
  const targetMoves=[10,-10,15,-5];
  function act(s, input) {
    if(s.done) return s;
    const n={...s,selected:[...s.selected]};
    if(s.id==='warehouse') {
      if(input==='blast') {
        if(s.quiet) return {...n,message:'你答应过科尔：镇里不动炸药。换个办法。'};
        return {...n,turn:s.turn+1,done:true,success:true,progress:3,message:'武器箱被炸毁；没能带回材料。'};
      }
      if(input==='wait') {n.turn++;n.message='你缩回阴影，等守卫走过。';return n;}
      const box=Number(input);
      if(![0,1,2].includes(box)||s.selected.includes(box)) return s;
      if(s.turn%2===0) return {...n,turn:s.turn+1,done:true,success:false,message:'守卫正朝货架走来，你搬箱时被发现。只能撤退。'};
      n.selected.push(box);n.progress++;n.turn++;n.message='一箱武器已送上车。守卫折返，先观察。';
    } else if(s.id==='tail') {
      const move={closer:10,hold:0,back:-10}[input];if(move===undefined)return s;
      n.distance=s.distance+targetMoves[s.turn]-move;n.turn++;
      if(n.distance<15||n.distance>35)return {...n,done:true,success:false,message:n.distance<15?'跟得太近，账房回头认出了你。':'目标拐进巷子，超出视线，你跟丢了。'};
      n.progress++;n.message='你留在灯光之外，账房没有察觉。';
    } else if(s.id==='intercept') {
      const lane=Number(input);if(![0,1,2].includes(lane))return s;
      const open=[2,0,1][s.turn];n.turn++;
      if(lane!==open) {n.damage++;n.message='道路被堵，你急刹绕行，车队又拉开了距离。';}
      else {n.progress++;n.message='你穿过空隙，逼近了补给车。';}
      if(n.turn===3) return {...n,done:true,success:n.progress===3,message:n.progress===3?'补给车被逼停，零件装上了你的摩托。':'车队逃进据点，截击失败。'};
    } else if(s.id==='assault') {
      if(!['cover','fire'].includes(input))return s;
      const firing=s.turn%2===0;n.turn++;
      if(input==='fire'&&firing){n.damage++;n.message='你在敌人开火时探身，受伤退回掩体。';}
      else if(input==='fire'){n.progress++;n.message='趁对方换弹，击退一组守卫。';}
      else n.message=firing?'子弹打在掩体上，你等到了换弹空当。':'你错过了射击空当，对方重新举枪。';
      if(n.damage>=2)return {...n,done:true,success:false,message:'无法继续推进，兄弟们把你撤出了车厂。'};
    }
    const required=s.id==='tail'?4:3;
    if(n.progress>=required){n.done=true;n.success=true;n.message=s.id==='tail'?'安全屋入口已确认，账房始终没有发现你。':s.id==='warehouse'?'三箱武器完整运回，镇里没有响起爆炸。':'三组守卫退散，车厂里的武器已被控制。';}
    return n;
  }
  function reward(s){return s.done&&s.success?(s.id==='warehouse'&&s.selected.length!==3?0:s.id==='tail'?1:s.progress):0;}
  // Council prototypes use local, finite meeting decisions, never a new permanent currency.
  const preparations={safe:{name:'疏散邻街',effect:'镇民先撤离；镇内不动炸药'},scout:{name:'摸清巡逻',effect:'车队经过的路线情报'},riders:{name:'安排接应',effect:'小八带车队接应；不必独自撤离'}};
  function callVotes(first,player){
    if(!['伊摩','博姆'].includes(first))throw Error('Unknown first speaker');
    const side=first==='伊摩'?'a':'b',other=side==='a'?'博姆':'伊摩';
    return [{who:first,side,reason:'我先带队，算我一票。'},
      {who:'科尔',side,reason:`${first}肯领头，我跟他。`},
      {who:'小八',side,reason:`有${first}带队，我也跟。`},
      {who:'你',side:player}, {who:other,side:side==='a'?'b':'a'}, {who:'卡莱布',side:'a'}, {who:'瑞秋',side:'b'}];
  }
  function proposalVotes(selected,player){
    if(selected.length>2||new Set(selected).size!==selected.length||selected.some(k=>!preparations[k]))throw Error('Invalid preparation');
    const has=k=>selected.includes(k);
    const support=[true,false,has('scout'),has('riders')&&has('safe'),has('safe'),has('safe')&&has('scout')];
    const reasons=['先断他们的武器。','我仍主张正面反击。',has('scout')?'有人先摸清路线，我赞成。':'不安排摸路，进去就是送命。',has('riders')&&has('safe')?'撤人和接应都安排了。我赞成。':'撤人和接应缺一不可。',has('safe')?'安排镇民先撤，我赞成。':'不安排撤离，我不支持。',has('safe')&&has('scout')?'撤人和摸路都有安排。我跟。':'撤人和摸路缺一不可。'];
    return ['伊摩','博姆','卡莱布','小八','科尔','瑞秋'].map((who,i)=>({who,side:support[i]?'a':'b',reason:reasons[i]})).concat({who:'你',side:player});
  }
  const dutyPlans={
    a:{peer:'伊摩',intro:'我熟仓库，准备带人进去。账房那边也得有人盯。你接哪边？',choices:[
      {id:'tail',line:'账房我来盯，你去仓库。',goal:'跟住账房，找到他们藏身的据点。',reply:'行，账房交给你。我去仓库把武器弄出来。'},
      {id:'warehouse',line:'仓库让我去，你帮我盯账房。',goal:'避开巡逻，把仓库里的武器带回来。',reply:'好，仓库你来。我盯账房，把他的落脚点找出来。'}]},
    b:{peer:'博姆',intro:'我准备带人进车厂。公路上的补给车也得有人截。你接哪边？',choices:[
      {id:'intercept',line:'补给车我来截，你带人进车厂。',goal:'在灰溪公路截停补给车。',reply:'行，公路交给你。我带兄弟进车厂。'},
      {id:'assault',line:'车厂让我去，你守公路。',goal:'攻入废弃车厂，控制里面的武器。',reply:'那车厂交给你。我去公路堵住他们的补给车。'}]}
  };
  function claimDuty(side,id){
    const plan=dutyPlans[side];
    if(!plan||!plan.choices.some(c=>c.id===id))throw Error('Duty must belong to the winning proposal');
    return {side,job:id,peer:plan.peer,peerJob:plan.choices.find(c=>c.id!==id).id,status:'proposed'};
  }
  const api={jobs,votes,tally,newJob,act,reward,targetMoves,preparations,callVotes,proposalVotes,dutyPlans,claimDuty};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CouncilModel=api;
})(typeof window!=='undefined'?window:globalThis);
