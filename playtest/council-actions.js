/* Shared chapter content: routes change the framing, never completion requirements. */
(function(root){
 const tasks={collect:{content:'完成收车任务',map:'收车地点'},salvage:{content:'完成拆解废车',map:'废车回收厂'},modify:{content:'完成改车',map:'改车厂'}};
 const names={a:['备好跟踪车辆','拆取备用零件','整备伏击用车'],b:['集结出击车辆','拆出整备零件','整备截击用车']};
 const plans={a:{peer:'伊摩',intro:'收车、拆车、改车，你挑一件，剩下的我们接。',lines:[['杰森','别惊动他们。等袭击者的车队经过，再把这笔账讨回来。'],['伊摩','得先弄到车，拆出能用的零件，把车改到能跟上他们。']]},b:{peer:'博姆',intro:'收车、拆车、改车，你挑一件，剩下的我们接。',lines:[['杰森','这笔账现在就算。先截住袭击者的车队，断了他们的支援。'],['博姆','光靠狠话拦不住车队。车得收回来，废车得拆，改好了才能出门。']]}};
 const ids=Object.keys(tasks);
 function jobs(side){if(!plans[side])throw Error('Unknown route');return ids.map((id,i)=>({id,name:names[side][i],skill:tasks[id].content,map:tasks[id].map,content:tasks[id].content}));}
 function job(side,id){const j=jobs(side).find(j=>j.id===id);if(!j)throw Error('Unknown chapter task');return j;}
 function plan(side){return {...plans[side],choices:jobs(side).map(j=>({id:j.id,goal:j.content,line:`${j.name}交给我。`,reply:'行，这件归你。剩下两件，我们分头接。'}))};}
 function claim(side,id){job(side,id);const others=ids.filter(k=>k!==id),peer=plans[side].peer;return {side,job:id,peer,peerJob:others[0],status:'proposed',assignments:[{id,who:'你'},...others.map((k,i)=>({id:k,who:i===0?peer:'卡莱布'}))]};}
 function briefing(side){return [...plans[side].lines,['杰森','那就分头准备。收车、拆车、改车，一件都不能落。你先领，剩下的兄弟接。准备齐了，一起去伏击袭击者车队。']];}
 const api={tasks,jobs,job,plan,claim,briefing};if(typeof module!=='undefined')module.exports=api;else root.CouncilActions=api;
})(typeof window!=='undefined'?window:globalThis);
