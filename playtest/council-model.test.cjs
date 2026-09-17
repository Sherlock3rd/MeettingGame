const assert=require('node:assert/strict');
const {test}=require('node:test');
const M=require('./council-model.js');
const run=(id,inputs,quiet=false)=>inputs.reduce(M.act,M.newJob(id,quiet));
test('first leader produces a causal following; same player A can win or lose',()=>{
  assert.deepEqual(M.tally(M.callVotes('伊摩','a')),{a:5,b:2,winner:'a'});
  assert.deepEqual(M.tally(M.callVotes('博姆','a')),{a:3,b:4,winner:'b'});
  for(const first of ['伊摩','博姆'])for(const player of ['a','b']){
    const v=M.callVotes(first,player);assert.equal(new Set(v.map(x=>x.who)).size,7);
    assert.equal(v[1].side,v[0].side);assert.equal(v[2].side,v[0].side);assert.equal(v[3].who,'你');assert.equal(v[3].side,player);
  }
});
test('preparation composition changes real majority and rejects invalid allocations',()=>{
  assert.deepEqual(M.tally(M.proposalVotes(['safe','scout'],'a')),{a:5,b:2,winner:'a'});
  assert.deepEqual(M.tally(M.proposalVotes(['scout','riders'],'a')),{a:3,b:4,winner:'b'});
  assert.deepEqual(M.tally(M.proposalVotes(['safe','riders'],'a')),{a:4,b:3,winner:'a'});
  assert.throws(()=>M.proposalVotes(['safe','safe'],'a'));assert.throws(()=>M.proposalVotes(['safe','scout','riders'],'a'));
});
test('dialogue claim assigns exactly two winning-side tasks, one per person',()=>{
  for(const side of ['a','b']){
    const plan=M.dutyPlans[side];assert.equal(plan.choices.length,2);
    const [first,second]=plan.choices.map(c=>M.claimDuty(side,c.id));
    assert.equal(first.job,second.peerJob);assert.equal(first.peerJob,second.job);
    for(const d of [first,second]){assert.equal(M.jobs[d.job].side,side);assert.equal(M.jobs[d.peerJob].side,side);assert.equal(d.peer,plan.peer);assert.equal(d.status,'proposed');assert.ok(!('companion' in d));}
  }
  assert.throws(()=>M.claimDuty('a','assault'));assert.throws(()=>M.claimDuty('b','tail'));assert.throws(()=>M.claimDuty('a','supply'));
});
test('same player vote loses without agreement, wins with actual Cole flip',()=>{
  assert.deepEqual(M.tally(M.votes('sway','a',false)),{a:3,b:4,winner:'b'});
  assert.deepEqual(M.tally(M.votes('sway','a',true)),{a:4,b:3,winner:'a'});
  assert.equal(M.votes('sway','a',false)[4].side,'b');
  assert.equal(M.votes('sway','a',true)[4].side,'a');
});
test('independent player vote and majority, including changing mind after agreement',()=>{
  assert.equal(M.tally(M.votes('sway','b',true)).winner,'b');
  assert.equal(M.tally(M.votes('mission','b')).winner,'a');
  for(const mode of ['baseline','sway','mission'])for(const side of ['a','b'])for(const accepted of [false,true]){
    const votes=M.votes(mode,side,accepted),t=M.tally(votes);
    assert.equal(votes.length,7);assert.equal(t.a+t.b,7);assert.equal(t.winner,t.a>t.b?'a':'b');
  }
});
test('warehouse timing and promise are real gates',()=>{
  assert.equal(run('warehouse',['0']).success,false);
  const quiet=M.act(M.newJob('warehouse',true),'blast');assert.equal(quiet.done,false);
  const safe=run('warehouse',['wait','0','wait','1','wait','2'],true);
  assert.equal(safe.success,true);assert.equal(M.reward(safe),3);
  const blast=run('warehouse',['blast']);assert.equal(blast.success,true);assert.equal(M.reward(blast),0);
});
test('tailing uses distance, loses when too close or too far',()=>{
  const success=run('tail',['closer','hold','closer','hold']);assert.equal(success.success,true);assert.equal(M.reward(success),1);
  assert.equal(run('tail',['back']).success,false);
  assert.equal(run('tail',['closer','closer']).success,false);
});
test('interception requires three correct lane choices',()=>{
  assert.equal(run('intercept',['2','0','1']).success,true);
  const miss=run('intercept',['0','0','1']);assert.equal(miss.done,true);assert.equal(M.reward(miss),0);
});
test('assault requires cover while enemy fires, fire while enemy reloads',()=>{
  assert.equal(run('assault',['cover','fire','cover','fire','cover','fire']).success,true);
  assert.equal(run('assault',['fire','cover','fire']).done,true);
  assert.equal(run('assault',['fire','cover','fire']).success,false);
});
test('finished jobs cannot accrue rewards from extra inputs and reset creates independent state',()=>{
  const s=run('warehouse',['wait','0','wait','1','wait','2']);assert.deepEqual(M.act(s,'blast'),s);
  assert.deepEqual(M.newJob('warehouse').selected,[]);
  assert.equal(M.tally([]).winner,null);
});
