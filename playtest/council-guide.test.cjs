const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function fixture(){
  const host={dataset:{},innerHTML:'',classList:{add(){}},setAttribute(){}};
  const context={window:{},document:{querySelector:()=>host}};
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'council-guide.js'),'utf8'),context);
  return {host,guide:context.window.CouncilGuide};
}
test('every chapter marks one current stage without tutorial paragraphs',()=>{
  const {host,guide}=fixture();
  for(const key of ['opening','call','sway','offer','reply','amend','vote','ballot','verdict','jobs','duty','dutyReply','confirm','claim','end']){
    guide.set(key);
    assert.equal(host.dataset.chapter,key);
    assert.ok(guide.title.length>0);
    assert.equal((host.innerHTML.match(/aria-current="step"/g)||[]).length,1);
    assert.match(host.innerHTML,/<h2>[^<]+<\/h2>/);
    assert.doesNotMatch(host.innerHTML,/chapter-instruction|你现在要做的|<p>/);
  }
});
test('chapter stamp replays only on stage changes, not preparation toggles',()=>{
  const {host,guide}=fixture();guide.set('amend');assert.match(host.innerHTML,/chapter-impact/);
  guide.set('amend');assert.doesNotMatch(host.innerHTML,/chapter-impact/);
  guide.set('vote');assert.match(host.innerHTML,/chapter-impact/);
});
test('legacy instruction overrides cannot reintroduce tutorial prose',()=>{
  const {host,guide}=fixture();guide.set('ballot',{action:'先看三票，然后轮到你。'});
  assert.doesNotMatch(host.innerHTML,/先看三票，然后轮到你。/);
  assert.match(host.innerHTML,/正式计票/);
});
test('task confirmation is not another vote and meeting end does not claim task completion',()=>{
  const {host,guide}=fixture();guide.set('confirm');assert.match(host.innerHTML,/尚可改口/);
  guide.set('end');assert.match(host.innerHTML,/议会结束/);assert.doesNotMatch(host.innerHTML,/任务完成|取得战果/);
});
