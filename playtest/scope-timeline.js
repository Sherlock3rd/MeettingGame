/* Local discussion board. Source events stay fixed; only the candidate pin moves. */
(() => {
  const D = window.CouncilTimelineData;
  const overview = document.getElementById('design-overview');
  if (!D || !overview) return;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const visibleSlots = new Set(['prologue-end','existing-l09','chapter1-end','chapter2-end','chapter3-end','chapter4-slot','chapter5-slot']);
  const slots = D.chapters.flatMap(ch => ch.events.filter(e => e.slot).map(e => ({...e.slot, chapter:ch.name, chapterId:ch.id, after:e.node}))).filter(s=>visibleSlots.has(s.id));
  const key = 'dobe-meeting-discussion-pin-v1';
  let state = {slotId:D.defaultSlot, locked:false, note:''};
  let storageOK = true;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    if(saved){const migration={'after-report':'prologue-end','after-membership':'prologue-end','after-repair':'existing-l09','after-dispatch':'chapter2-end'};saved.slotId=migration[saved.slotId]||saved.slotId;}
    if (saved && slots.some(s => s.id === saved.slotId)) state = {slotId:saved.slotId, locked:saved.locked === true, note:typeof saved.note === 'string' ? saved.note.slice(0,240) : ''};
  } catch { storageOK = false; }
  const slotHTML = id => {
    const slot=slots.find(s=>s.id===id);
    return `<div class="tl-dropzone" data-slot-id="${slot.id}"><button type="button" class="tl-slot-target" data-move-slot="${slot.id}">＋ ${esc(slot.label)}</button><div class="tl-pin-home"></div></div>`;
  };
  overview.insertAdjacentHTML('beforebegin', `<section id="scope-timeline" class="tl-section" aria-labelledby="tl-title"><div class="eyebrow">第二步 · 一日版本剧情轴</div><h2 id="tl-title">从序章到第五章</h2><p class="tl-lead">第一至第三章已完成，第四、第五章为填充章节。沿剧情向下看，每章只列概述与关键系统。</p>
  <div class="tl-board" role="region" aria-label="序章至第五章纵向剧情轴"><div class="tl-columns">${D.chapters.map((ch,i)=>{
    const boundary=ch.events.filter(e=>e.slot&&visibleSlots.has(e.slot.id)&&e.slot.id!=='existing-l09').map(e=>slotHTML(e.slot.id)).join('');
    return `<section class="tl-chapter ${ch.status==='filler'?'tl-filler':''}" id="tl-${ch.id}"><div class="tl-story-card"><div class="tl-chapter-head"><span>0${i}</span><h3>${ch.name} · ${ch.title}</h3><small>${ch.status==='filler'?'填充章节':i===0?'序章':'已完成'}</small></div><p class="tl-summary">${esc(ch.summary)}</p>${ch.beats.length?`<div class="tl-beats">${ch.beats.map(b=>`<span>${esc(b)}</span>`).join('<i>→</i>')}</div>`:''}<div class="tl-systems"><b>关键系统</b><div>${ch.systems.map(x=>`<span>${esc(x)}</span>`).join('')}</div></div>${ch.meeting?`<p class="tl-meeting-note ${i===1?'is-meeting':''}">${esc(ch.meeting)}</p>`:''}${ch.id==='chapter1'?slotHTML('existing-l09'):''}</div>${boundary}</section>`;
  }).join('')}</div></div>
  <p class="tl-hint">◆ PIN 是待讨论的会议位置。可拖动，也可点击虚线位置移动。</p>
  <details class="tl-tools"><summary>调整 PIN / 添加讨论备注</summary><div class="tl-controls"><div class="tl-position"><strong id="pin-position"></strong><span id="pin-status"></span></div><div class="tl-buttons"><button type="button" id="pin-prev">← 前一处</button><button type="button" id="pin-next">后一处 →</button><button type="button" id="pin-lock" class="tl-primary">锚定此位置</button><button type="button" id="pin-reset">回到序章 → 第一章</button></div>
  <div class="tl-selects"><label>选择讨论位置<select id="pin-location" aria-label="选择讨论位置">${slots.map(s=>`<option value="${s.id}">${s.chapter} · ${esc(s.label)}</option>`).join('')}</select></label><button type="button" id="pin-reveal">查看 PIN</button></div>
  <label class="tl-note">讨论备注<input id="pin-note" type="text" maxlength="240" placeholder="这场会议希望带来什么体验？"></label><p id="pin-context"></p><small id="pin-storage"></small><div class="tl-live" role="status" aria-live="polite" id="pin-live"></div></div></details>
  <details class="tl-source-notes"><summary>来源、已有会议判断与版本差异</summary><p>读取日期 ${D.readDate}：第一份工作簿 revision 1712，第二份 revision 1790。按事件内容将第一份“序幕(第一章)图文台本”映射为序章 L01–L05，“第一幕图文台本”映射为第一章 L06–L16；不把页签括号名称另算一个章节。</p><ul>${Object.values(D.sources).map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)} ↗</a> · sheet ${s.sheet}</li>`).join('')}</ul><p><b>会议定位：</b>L09 明确保留会议黑盒；L04–L05 是会所汇报/转正仪式。L16、L27–L28、L34、L45–L46 为认可或汇报，未明确给出议会流程。第三章 L39 的“拿到议会桌上”是人物诉求，实际仍接处决，不能标作已发生审判会议。</p><p><b>版本差异：</b>第一章 84/91 行要求不指定爆炸地点，95/127 行台词提到仓库，本图只写“突发爆炸”。123 行写两项准备任务，248 行仍写三项准备，本图不定任务数量。第二章 L25–L26 不同列存在人物版本差异，本图只保留敌情、帮手、战斗的共同事件。</p><p><b>政令范围：</b>第二章表 177 行写“议会政令系统-7日”，没有一日版正式开放节点。此处可讨论前期会议插入，但不能把常驻政令自动标成一日版已完成内容。第四、第五章无来源台本，只有填充位置。</p></details>
  <a class="tl-next" href="#meeting-formats">第三步：比较四种会议形式 ↓</a></section>`);
  const root = document.getElementById('scope-timeline');
  const board = root.querySelector('.tl-board');
  const location = root.querySelector('#pin-location');
  const note = root.querySelector('#pin-note');
  const lock = root.querySelector('#pin-lock');
  const pin = document.createElement('button');
  pin.type='button'; pin.id='meeting-pin'; pin.className='tl-pin'; pin.textContent='◆ PIN · 拟新增会议'; pin.title='拖动到虚线候选位置，或用方向键移动';
  note.value=state.note;
  overview.querySelector('h2').textContent='同一张会桌，可以承载不同表达形式';
  overview.querySelector('.eyebrow').textContent='会所议事视觉参考';
  overview.querySelector('p').textContent='前两步确定会议目的与故事落点；接下来先比较玩家如何表达和作决定。';
  overview.querySelector('.dn-thesis-detail').textContent='试玩沿用旧反击会议情境，止于领命。新的 CP1 需要重新编排符合插入时点、玩家身份与信息的议题。';
  const anchorSummary=document.createElement('div'); anchorSummary.id='timeline-anchor-summary'; anchorSummary.className='tl-anchor-summary'; overview.querySelector('.dn-thesis-detail').after(anchorSummary);
  const contentSection=document.getElementById('meeting-content');
  const contentPin=document.createElement('p');contentPin.className='content-pin-summary';contentPin.id='content-pin-summary';
  if(contentSection)contentSection.querySelector('h2')?.after(contentPin);
  function save(){try{localStorage.setItem(key,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}}
  function update(announce=false){
    const s=slots.find(s=>s.id===state.slotId), index=slots.indexOf(s);
    if(contentPin)contentPin.textContent=`PIN 当前落点：${s.chapter} · ${s.label}。第四步的第一章遇袭后与第三章结尾仍是内容候选，最终插入位置未定。`;
    root.querySelectorAll('.tl-dropzone').forEach(z=>{z.classList.toggle('is-selected',z.dataset.slotId===s.id);z.classList.remove('is-dragover');});
    root.querySelector(`[data-slot-id="${s.id}"] .tl-pin-home`).append(pin);
    pin.textContent=state.locked?'◆ PIN · 讨论位置已锚定':s.priority==='existing'?'◆ PIN · 改造已有会议':'◆ PIN · 拟新增会议';
    pin.setAttribute('aria-label',`会议讨论 pin，${s.chapter}，${s.label}，${state.locked?'已锚定，请先解除锚定':'可拖动或用方向键移动'}`);
    pin.setAttribute('aria-disabled',String(state.locked));
    root.querySelector('#pin-position').textContent=`${s.chapter} · ${s.label}`;
    root.querySelector('#pin-status').textContent=state.locked?'已锚定本次讨论位置 · 不等于正式设计批准':'可移动 · 初始预期为序章到第一章之间';
    root.querySelector('#pin-context').textContent=s.why;
    root.querySelector('#pin-storage').textContent=storageOK?'位置与备注保存在当前浏览器；不会修改飞书台本，也不会同步到其他参会者。':'当前浏览器无法保存；本次页面内仍可移动，刷新可能恢复默认位置。';
    root.querySelector('#pin-prev').disabled=state.locked||index===0;
    root.querySelector('#pin-next').disabled=state.locked||index===slots.length-1;
    root.querySelectorAll('[data-move-slot]').forEach(b=>{b.disabled=state.locked;b.setAttribute('aria-pressed',String(b.dataset.moveSlot===s.id));});
    location.value=s.id; location.disabled=state.locked; lock.textContent=state.locked?'解除锚定，继续移动':'锚定此位置';
    anchorSummary.replaceChildren();
    const title=document.createElement('strong'); title.textContent=(state.locked?'已锚定：':'尚未锚定 · 当前示意：')+s.chapter+' · '+s.label;
    const context=document.createElement('p');context.textContent=state.locked?'围绕这个位置比较下方表达；原有事件与主线仍保留。':'先回到第二步拖动 PIN 并锚定讨论位置，再决定这场会议的表达。';
    const link=document.createElement('a');link.href='#scope-timeline';link.textContent='返回第二步调整 ↑';
    anchorSummary.append(title,context,link);
    if(state.note){const p=document.createElement('p');p.textContent='讨论体验：'+state.note;anchorSummary.append(p);}
    if(announce)root.querySelector('#pin-live').textContent=`${state.locked?'已锚定':'已移动到'} ${s.chapter}，${s.label}`;
  }
  function reveal(){pin.scrollIntoView({behavior:'auto',block:'center'});}
  function move(id,show=false){if(state.locked||!slots.some(s=>s.id===id))return;state.slotId=id;save();update(true);if(show)reveal();}
  root.addEventListener('click',e=>{const b=e.target.closest('[data-move-slot]');if(b)move(b.dataset.moveSlot);});
  root.querySelector('#pin-prev').addEventListener('click',()=>move(slots[slots.findIndex(s=>s.id===state.slotId)-1]?.id,true));
  root.querySelector('#pin-next').addEventListener('click',()=>move(slots[slots.findIndex(s=>s.id===state.slotId)+1]?.id,true));
  location.addEventListener('change',()=>move(location.value,true));
  root.querySelector('#pin-reveal').addEventListener('click',reveal);
  lock.addEventListener('click',()=>{state.locked=!state.locked;save();update(true);});
  root.querySelector('#pin-reset').addEventListener('click',()=>{state.slotId=D.defaultSlot;state.locked=false;save();update(true);reveal();});
  note.addEventListener('input',()=>{state.note=note.value;save();update();});
  pin.addEventListener('keydown',e=>{
    if(state.locked)return;
    const i=slots.findIndex(s=>s.id===state.slotId);
    const j=e.key==='Home'?0:e.key==='End'?slots.length-1:['ArrowRight','ArrowDown'].includes(e.key)?Math.min(i+1,slots.length-1):['ArrowLeft','ArrowUp'].includes(e.key)?Math.max(i-1,0):null;
    if(j!==null){e.preventDefault();move(slots[j].id,true);pin.focus({preventScroll:true});}
  });
  let drag=null;
  function finishDrag(cancel=false){
    if(!drag)return;
    const target=drag.target, moved=drag.moved, pointer=drag.id;
    drag=null;pin.classList.remove('is-dragging');pin.removeAttribute('style');
    if(pin.hasPointerCapture(pointer))pin.releasePointerCapture(pointer);
    if(!cancel&&moved&&target)move(target);else update();
    root.querySelector('#pin-live').textContent=cancel?'已取消拖动，位置保持不变':moved&&!target?'未落到候选位置，已回到原位':root.querySelector('#pin-live').textContent;
  }
  pin.addEventListener('pointerdown',e=>{
    if(state.locked||e.button!==0)return;
    const r=pin.getBoundingClientRect();drag={id:e.pointerId,startX:e.clientX,startY:e.clientY,offsetX:e.clientX-r.left,offsetY:e.clientY-r.top,width:r.width,height:r.height,target:null,moved:false};
    pin.setPointerCapture(e.pointerId);
  });
  pin.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;
    if(!drag.moved&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<5)return;
    drag.moved=true;pin.classList.add('is-dragging');
    Object.assign(pin.style,{position:'fixed',left:(e.clientX-drag.offsetX)+'px',top:(e.clientY-drag.offsetY)+'px',width:drag.width+'px',height:drag.height+'px',pointerEvents:'none',zIndex:'10000',margin:'0'});
    if(e.clientY<65)window.scrollBy(0,-18);else if(e.clientY>innerHeight-65)window.scrollBy(0,18);
    const z=document.elementFromPoint(e.clientX,e.clientY)?.closest('.tl-dropzone');drag.target=z&&root.contains(z)?z.dataset.slotId:null;
    root.querySelectorAll('.tl-dropzone').forEach(el=>el.classList.toggle('is-dragover',el.dataset.slotId===drag.target));
  });
  pin.addEventListener('pointerup',()=>finishDrag());
  pin.addEventListener('pointercancel',()=>finishDrag(true));
  pin.addEventListener('lostpointercapture',()=>{if(drag)finishDrag(true);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drag){e.preventDefault();finishDrag(true);}});
  window.addEventListener('blur',()=>finishDrag(true));
  update();
  const legacy=document.createElement('details');legacy.className='dn-legacy';legacy.innerHTML='<summary>展开旧四版试玩的详细设计分析与参考映射</summary>';
  const archived=[...document.querySelectorAll('.dn-scope,.dn-nav,.dn-chapter,.dn-compare')];
  archived.forEach(node=>legacy.append(node));
  document.querySelector('#demo-playground')?.after(legacy);
})();
