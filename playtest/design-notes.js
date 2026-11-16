/* Design explanation for the lobby. Uses the same vote model as the demo. */
(() => {
  const menu = document.querySelector('#menu');
  const M = window.CouncilModel;
  const person = (name, p) => `<span class="dn-person"><i class="portrait p${p}" aria-hidden="true"></i><b>${name}</b></span>`;
  const dots = (a, b) => `<span class="dn-ballots" aria-label="暗中突破 ${a} 票，全面反击 ${b} 票">${Array.from({length:a},()=>'<i class="a">潜</i>').join('')}${Array.from({length:b},()=>'<i class="b">战</i>').join('')}</span>`;
  const flow = steps => `<ol class="dn-flow">${steps.map(x=>`<li>${x}</li>`).join('')}</ol>`;
  const examples = (mode, choices) => `<div class="dn-experiment" data-example="${mode}"><p class="dn-example-label">切换表达，看会议如何回应 · 演示示意</p><div class="dn-controls">${choices.map((x,i)=>`<button type="button" data-example-choice="${i}" aria-pressed="${i===0}">${x}</button>`).join('')}</div><div class="dn-result" aria-live="polite"></div></div>`;
  const cards = [
    {id:'call',n:'01',title:'谁先领头',tone:'#de936d',label:'带动集体立场',quote:'“我请他站出来，几位兄弟跟了上去。”',purpose:'让玩家看见自己对集体的影响：点名一位领头人，带动犹豫者表态。自己的决定，通过具体成员的落徽被看见。',question:'我请谁先站出来？',visual:`<div class="dn-people">${person('你 · 点名',7)}<span class="dn-arrow">→</span><span class="dn-leader">${person('伊莱 · 领头',1)}</span><span class="dn-arrow">→</span><div>${person('戴尔 · 跟随',3)}${person('博 · 跟随',5)}</div></div>${flow(['点名领头人','三票先落定','你再投票','集体决议'])}${examples('call',['请伊莱领头','请科腾领头'])}`,proof:'同样投暗中突破，只更换先领头的人，结果就从 5∶2 通过变成 3∶4 落败。影响来自前置点名。',limit:'点名后的跟票和胜方可以由系统预设；此处重点是让带动关系清楚、自然地被看见。即使局势可控、主线相同，也可以成立“我被重视、有人跟随”的体验。',check:'玩家能否认出谁回应了自己的点名，并感到自己参与了这次集体决定？',variables:['跟随反馈的强度：人数与回应越明显，带动感越强；需让人物反应可信。','自己投票的时点：调整先看兄弟回应、再表态的节奏，突出自己的参与时刻。','逐票公布间隔：太快看不清跟随，太慢拖长会议。']},
    {id:'sway',n:'02',title:'一诺换票',tone:'#d6a641',label:'用承诺换来支持',quote:'“我争到了这一票，也答应了镇里不动炸药。”',purpose:'让玩家听见一位兄弟的顾虑，作出回应后得到认可。一次承诺让这段交流具有个人指向，重点是“他听了我的话，愿意支持我”。',question:'我怎样回应这位兄弟的顾虑？',visual:`<div class="dn-contract"><div>${person('戴尔 · 财务官',3)}<p>“镇里不动炸药，做得到，我跟你。”</p></div><div class="dn-paper"><span>会桌上的约定</span><strong>镇内禁用炸药</strong><small>我作出保证 ⇄ 他回应支持</small></div></div>${flow(['听到顾虑','接受 / 拒绝','一人改票','约定随领命保留'])}${examples('sway',['不作承诺','接受禁爆承诺'])}`,proof:'同样投暗中突破，拒绝条件是 3∶4，接受条件是 4∶3；戴尔的改票确实改变多数结果。',limit:'承诺可以服务当场的人物交流，不要求额外制造长期损失或分支。当前约定随领命保留，后续仍进入共同主线；验收重点是人物回应能否让玩家感到被听见。',check:'玩家是否记得这位兄弟在担心什么，以及他如何回应自己的保证？',variables:['票差的呈现：突出这位兄弟支持的重要性，配合预期的情绪起伏。','顾虑与承诺的清晰度：一句话能理解、符合人物；无需靠高成本制造纠结。','交流长度：保留听顾虑、作回应、获认可的节奏，避免拖慢主线。']},
    {id:'amend',n:'03',title:'把事安排妥',tone:'#a4be7b',label:'靠安排赢得认同',quote:'“只有两组人，我得决定先解决哪些顾虑。”',purpose:'让玩家在安排准备事项的过程中获得统筹感。系统可以清晰引导一套合理安排，再通过不同成员的回应，让玩家感到“我把事情说清了，大家认可我的安排”。',question:'有限人手，优先解决什么问题？',visual:`<div class="dn-capacity"><strong>2 组人手</strong><span>疏散邻街</span><span>摸清巡逻</span><span>安排接应</span><b>三选二</b></div>${flow(['分配两组人','多人的顾虑改变','意见重新形成','集体表决'])}${examples('amend',['疏散＋摸路','疏散＋接应','摸路＋接应'])}`,proof:'同样投暗中突破，三种准备分别产生 5∶2、4∶3、3∶4。改变方案内容，会同时改变多名成员的意见。',limit:'存在清晰的推荐安排或容易发现的答案，符合系统引导的定位。两组人手用于承载安排过程与成员反馈；重点是让玩家理解并获得认可感，无需追求长期最优解博弈。',check:'玩家是否理解自己做了什么安排，并从成员回应中感到“这件事让我安排妥了”？',variables:['准备项数量：控制一次会议的操作量与理解负担，让玩家容易进入统筹角色。','推荐安排的可读性：顾虑、选项与回应对应清楚，让系统引导自然发生。','成员认可的反馈：回应顺序和强度决定安排是否有被大家接受的感觉。']},
    {id:'draft',n:'04',title:'各领其命',tone:'#8bb8c7',label:'主动承担自己的差事',quote:'“方向大家定。这件交给我，剩下的兄弟接。”',purpose:'在集体决定之后保留个人自主，同时让帮派共同分工可见。即使集体没有采纳我的立场，我仍能主动承担一件自己选择的事。',question:'既然方向定了，我愿意负责哪一件？',visual:`<div class="dn-speech">“收车、拆车、改车，你挑一件，剩下的我们接。”</div>${flow(['多数决定方向','你接话认领','同伴回应','三人各负其责'])}${examples('draft',['我来收车','我来拆车','我来改车'])}`,proof:'选择不同接话，玩家与同伴的任务归属同步变化；最终三项任务各有负责人，没有重复分配。',limit:'四版共享任务认领，符合相同玩法与主线的基础。此版突出“我主动开口、兄弟接话”的体验；任务归属可以变化，后续内容仍统一收束。',check:'相比点击任务纸，说“交给我”并得到回应，是否更有主动承担和兄弟分工的感觉？',variables:['候选任务数：提供足够表达意愿的机会，同时控制阅读与选择时间。','任务信息的可见程度：太少无法选择，太多像读配置。','同伴回应的长度：没有回应缺少确认，过长拖慢散会。']}
  ];
  const displayOrder = ['sway','call','amend','draft'];
  cards.sort((a,b)=>displayOrder.indexOf(a.id)-displayOrder.indexOf(b.id));
  const meaning = {
    call:{duty:'把集体立场的形成过程显露出来，让玩家看见一次点名如何带动具体成员。',experience:['还没形成共同立场：我不知道谁会先站出来。','我请一人领头，看见戴尔和博跟随落徽。','我能影响这张桌子；随后自己的票是在回应已形成的局势。'],model:'顺序带动：先行动者 → 跟随者 → 集体多数',reference:'King of the Castle',kind:'局部表现参考；领头带票为本地原创',img:'king-castle-vote-balance.png',url:'https://www.team17.com/news/king-of-the-castle-1-1-update-good-to-be-king-is-out-now',caption:'官方更新截图：成员名字与选项、票数并置；此图实际有三个选项。',original:'原作把成员的表态归入各选项，让读票同时变成“看谁站在哪里”。',abstract:'可识别的人物 → 公开立场 → 可见的集体结果。',mapping:'沿用人物与票绑定的反馈思路；点名某人后固定带动两名 NPC，是本 demo 的原创规则。',boundary:'不能用这张图证明原作有“先点名领头就带两票”的机制，也不把真人多选项议会当作两方 NPC 同构参考。'},
    sway:{duty:'让成员顾虑进入集体决策，并把争取支持时的约定带到领命环节。',experience:['只差关键支持：自己的主张可能落败。','我听到戴尔的顾虑，用一句保证回应他。','他真的改票，我赢得支持，也记住了自己答应的事。'],model:'回应顾虑：听见诉求 → 作出保证 → 获得支持',reference:'冰汽时代2 / Frostpunk 2',kind:'体验片段借鉴：顾虑、回应与支持',img:'frostpunk2-council.jpg',url:'https://store.steampowered.com/app/1601580/Frostpunk_2/',caption:'官方商店截图：左侧法案效果、For / Hesitant / Against 票势与 Vote / Negotiate 操作同屏。',original:'原作让玩家与派系协商、作出承诺，以争取决策支持；议会决定进入城市治理。',abstract:'原有支持＋交换得到的支持 ≥ 通过门槛；支持附带承诺。',mapping:'提取“听见顾虑—回应—获得支持”的交流片段，压缩到一名可识别的戴尔；改票与约定承接这次交流，后续汇合主线。',boundary:'借鉴人物交流与支持反馈，不承接原作完整的派系、长期承诺和治理压力；实际兑现成本不作为本次会议体验成立的前提。'},
    amend:{duty:'把行动安排变成成员评价议案的依据，让“支持”能追溯到顾虑是否被解决。',experience:['三件准备、两组人：我不能把所有问题都处理掉。','我调换人手，观察谁因此支持、谁仍然反对。','大家对我的安排作出回应，我感到自己像个能安排事情的成员。'],model:'引导式安排：听见顾虑 → 安排准备 → 看见成员认可',reference:"The King's Dilemma: Chronicles",kind:'抽象对照；两组人手与顾虑映射为本地原创',img:'kings-dilemma-01.jpg',url:'https://horribleguild.com/eu/product/the-kings-dilemma-chronicles/',caption:'官方产品图：左侧各家 Aye / Nay 与投入，右侧王国资源轨道。',original:'原作允许用有限 Power 或财力影响议会；选择还会影响家族关系和王国资源。',abstract:'资源有限 → 无法满足所有目标 → 选择投入 → 影响集体结果。',mapping:'提取“由我安排有限资源”的参与姿态。原作投入政治力量；demo 通过准备人手和成员回应呈现统筹感，允许存在清晰的引导答案。',boundary:'这是体验层面的抽象对照，原作没有本 demo 的两组人手三选二。原作的资源博弈与长期代价不作为本方案目标。'},
    draft:{duty:'将集体决议转为可认领的个人任务，让玩家与同伴各自承担一份行动责任。',experience:['方向由大家决定，我的意见未必被采纳。','同伴问我接哪件，我主动开口认领。','有人回应并接走余项：我有自己的责任，也不是独自做事。'],model:'受约束的自主选择：集体方向 → 候选任务 → 个人认领 → 分工',reference:'太阁立志传Ⅴ DX',kind:'核心体验局部借鉴：评定后自主选择主命',img:'taikou5dx-5100_03.png',url:'https://www.gamecity.com.tw/manual/taikou5dx/sc/5100.html',caption:'官方说明书截图：主命候选、最低身份与重要技能同时显示，玩家选择适合自己的一项。',original:'原作在评定中按方针与身份提供主命；玩家选取、执行，再回报成果获得功勋。',abstract:'组织方向约束候选 → 玩家选任务 → 实际执行 → 成果与成长。',mapping:'提取“组织定方向，我主动选一项”的身份体验。接话、同伴回应和三人分工让玩家感到共同承担；完成要求仍服务同一主线。',boundary:'借鉴主动领命的感受，不要求复刻原作不同主命的完整玩法路线。demo 止于领命；后续任务收束一致是设计前提，非体验缺陷。'}
  };
  const foundations = `<section class="dn-foundations" id="meeting-purpose"><div class="eyebrow">会议承担 / SYSTEM ROLE</div><h2>会议承担什么，玩家应该经历什么？</h2><p>会议在既定主线中负责交代行动动机、建立组织身份、承接人物回应与共同分工。系统可编排局势，让玩家参与走向主线的过程。</p><div class="dn-table-wrap"><table><thead><tr><th>会议承担</th><th>输入 → 输出</th><th>玩家体验</th><th>当前覆盖</th></tr></thead><tbody>
    <tr><th>剧情推进与行动动机</th><td>商业街遇袭 → 帮派提出反击议案</td><td>这是我们的事，我知道为什么要出发。</td><td>开场冲突、两方主张、行动对白</td></tr>
    <tr><th>身份与组织仪式</th><td>成员身份 → 入席、发言、落徽、会长落槌</td><td>我被当作正式成员，有资格参与。</td><td>职级、席位、投票仪式；没有动态授衔</td></tr>
    <tr><th>集体决策与人物关系</th><td>不同立场和顾虑 → 多数决议与行动约定</td><td>兄弟会回应我的表达，我参与了大家的决定。</td><td>I 带动感、II 被回应感、III 统筹感；成员反应可编排</td></tr>
    <tr><th>任务分发与共同承担</th><td>决议 → 收车、拆车、改车各有负责人</td><td>我主动领一件，兄弟们也在行动。</td><td>四版共有分工，IV 强化对话认领；止于领命</td></tr>
    <tr><th>成长与内容解锁接口</th><td>特定晋升会议 → 身份确认与后续权限承接</td><td>组织认可我的贡献，我获得更大的责任与权限。</td><td>项目既有晋升节点职责；本次反击会议 demo 未实现，不把每次开会等同于晋升</td></tr>
    </tbody></table></div><div class="dn-loop"><span>剧情冲突</span><b>→</b><span>集体议事</span><b>→</b><span>领命与分工</span><b>⇢</b><span class="dn-future">任务执行</span><b>⇢</b><span class="dn-future">成果 / 奖励 / 成长</span></div><p class="dn-evidence">实线部分可在本 demo 体验；虚线部分是后续系统接口，尚未接入。建筑、英雄、人力、奖励的具体投放需由对应正式节点规定，不能由会议原型自行补造。</p></section>`;
  const experienceBlock = id => { const m=meaning[id]; return `<section class="dn-experience"><h3>本方案让会议重点承担</h3><p>${m.duty}</p><h3>玩家体验 · 从处境到感受</h3><ol>${m.experience.map((v,i)=>`<li><span>${['处境','动作与反馈','目标感受'][i]}</span>${v}</li>`).join('')}</ol><p class="dn-evidence">以上是待验证的体验目标；验收看玩家是否感到被回应、被认可、共同承担，以及汇入主线是否自然。</p></section>`; };
  const referenceBlock = id => { const m=meaning[id]; return `<section class="dn-reference"><div class="dn-reference-heading"><div><span class="dn-label">抽象游戏参考与映射</span><h3>${m.reference}</h3></div><span class="dn-ref-kind">${m.kind}</span></div><div class="dn-reference-grid"><figure><a href="../assets/${m.img}" target="_blank" rel="noopener"><img src="../assets/${m.img}" alt="${m.caption}" loading="lazy"></a><figcaption>${m.caption} <a href="${m.url}" target="_blank" rel="noopener">官方来源 ↗</a></figcaption></figure><div><h4>原作中的具体场景</h4><p>${m.original}</p><h4>抽象出的机制</h4><p class="dn-model">${m.abstract}</p><h4>映射到本 demo</h4><p>${m.mapping}</p><h4>借鉴边界</h4><p>${m.boundary}</p></div></div><div class="dn-model-caption"><b>本方案最小模型</b><span>${m.model}</span></div></section>`; };
  const premise = `<section class="dn-premise" id="design-premise" aria-labelledby="premise-title"><div class="eyebrow">基础设计支点 / 已确认</div><h2 id="premise-title">同一套会议玩法，四种参与体验。<br>不同的当场回应，收束到同一主线。</h2><p>DOBE 以“假单机”的方式呈现这场帮派会议：成员立场、票型和回应可以由系统编排，玩家的选择可以被引导。选择主要影响会议中的表达、人物回应、局势演出与分工感受，后续游戏体验保持相近，最终进入相同的主线内容。</p><div class="dn-premise-grid"><div><b>系统可以引导</b><p>通过议题包装、成员态度、选项措辞与票型安排，让玩家自然走向主线需要的决议。</p></div><div><b>选择得到回应</b><p>玩家开口、点名或认领后，应有对应人物和反馈承接，让参与过程可感知、前后连贯。</p></div><div><b>主线统一收束</b><p>无需为每次选择制作新的关卡、长期损失或剧情分支。不同表达最终服务同一段内容。</p></div></div><div class="dn-converge"><span class="dn-anchor">共同冲突：商业街遇袭</span><div class="dn-branches"><span>我带动了兄弟</span><span>兄弟回应了我</span><span>我的安排被认可</span><span>我主动接下责任</span></div><span class="dn-anchor">共同主线：收车 → 拆车 → 改车 → 伏击车队</span></div><p class="dn-evidence">图中四路代表会议体验重心，随后汇合为同一主线。现有 demo 的票数和认领逻辑保留；这一轮调整的是设计定位、讲解口径和验收标准。</p></section>`;
  menu.id = 'menu';
  menu.querySelector('.menu-head').innerHTML = `<div><div class="eyebrow">灰烬之子 · 会所议事夜</div><h1>会议设计讨论</h1><p>设计目的 → 剧情位置 → 会议形式 → 会议内容 → 试玩</p></div><a class="dn-jump" href="#meeting-position">开始讨论 ↓</a>`;
  const modeCards = menu.querySelectorAll('.mode-card');
  const labels={
    call:{n:'CP2',title:'站票选边',verb:'公开站队 → 看见两边对抗',tag:'旧原型：谁先领头',ref:'逐席跟票对照',body:'提案让成员公开站队。现原型用领头跟票呈现态度，还没有角色起身站位。'},
    sway:{n:'CP1',title:'谈判承诺',verb:'旧02试玩：承诺 → 获得支持',tag:'旧原型：一诺换票',ref:'进入试玩 ↗',body:'此入口打开旧02：向成员作出保证以争取支持；尚未实现付出代价 A 换取抉择权。'},
    amend:{n:'CP3',title:'选项覆盖',verb:'组合选项 → 覆盖成员顾虑',tag:'旧原型：把事安排妥',ref:'有限方案对照',body:'选方案覆盖不同顾虑，观察成员态度如何变化。现原型用两组人手安排三项准备做对照。'},
    draft:{n:'CP4',title:'普通投票',verb:'投票 → 计票 → 形成决议',tag:'旧原型：各领其命',ref:'普通计票对照',body:'围绕议题直接投票并公布结果；认领任务是投票后的共同分工。'}
  };
  modeCards.forEach(el=>{const c=labels[el.dataset.mode];el.querySelector('.n').textContent=c.n;el.querySelector('h2').textContent=c.title;el.querySelector('.verb').textContent=c.verb;el.querySelector('.tag').textContent=c.tag;el.querySelector('.ref').textContent=c.ref;el.querySelector('p').textContent=c.body;});
  menu.insertAdjacentHTML('beforeend', `
    <section class="dn-overview" id="design-overview" aria-labelledby="dn-title">
      <div class="dn-room"><img src="../assets/dobe-council-room-v2-isometric.png" alt="灰烬之子会所：成员围坐长桌，主持人在桌首，会议连接集体决议与行动分工" loading="lazy"><span>同一张会桌 · 四种参与感 · 同一主线</span></div>
      <div><div class="eyebrow">会议的用途 / 玩家体验</div><h2 id="dn-title">会议用来做什么？<br>给玩家什么体验？</h2><p>会议把下一段主线任务组织成一次帮派共同决定、分头承担的行动：交代为什么要做，让成员表达立场，再明确谁来负责。</p><p class="dn-thesis-detail">玩家在这个过程中知道行动的理由，感到自己的发言被重视、看见兄弟的回应，并主动接下一份责任。会议因此承载行动动机、组织身份、参与感与共同承担，四个 demo 用来比较这些体验如何被表达。</p><div class="dn-common"><span>知道为何行动</span><span>感到身份与参与</span><span>看见回应与共同承担</span></div></div>
    </section>
    <div class="dn-scope"><b>当前试玩边界</b><p>两种决议有不同理由、台词和分工表达，但都汇合到收车、拆车、改车，再进入伏击车队的同一主线。当前原型止于领命；图示展示当场反馈，不代表已经执行后续任务。</p></div>
    <nav class="dn-nav" aria-label="设计章节">${cards.map(c=>`<a href="#design-${c.id}">${c.n} ${c.title}</a>`).join('')}</nav>
    ${cards.map(c=>`<article class="dn-chapter" id="design-${c.id}" style="--tone:${c.tone}" aria-labelledby="title-${c.id}">
      <div class="dn-chapter-head"><span class="dn-number">${c.n}</span><div><span class="dn-label">${c.label}</span><h2 id="title-${c.id}">${c.title}</h2></div><button type="button" class="dn-play" data-mode="${c.id}">试玩这一版 ↗</button></div>
      <blockquote>${c.quote}</blockquote>${experienceBlock(c.id)}<div class="dn-columns"><div class="dn-copy"><h3>设计目的</h3><p>${c.purpose}</p><div class="dn-question"><small>玩家在决定</small><strong>${c.question}</strong></div><h3>怎样判断体验成立</h3><p>${c.check}</p></div><figure class="dn-figure">${c.visual}<figcaption>${c.proof}</figcaption></figure></div>
      <div class="dn-boundary"><b>设计取向与验收重点</b><p>${c.limit}</p></div><details class="dn-variables"><summary>三个决定体验的变量</summary><ul>${c.variables.map(v=>`<li>${v}</li>`).join('')}</ul></details>
      ${referenceBlock(c.id)}
    </article>`).join('')}
    <section class="dn-compare"><div class="eyebrow">体验差异 / SIDE BY SIDE</div><h2>会议的作用相同，体验重心各有不同。</h2><div class="dn-table-wrap"><table><thead><tr><th>方案</th><th>参与动作</th><th>当场反馈</th><th>希望玩家感受到</th></tr></thead><tbody><tr><th>一诺换票</th><td>谈条件、作承诺</td><td>一位成员的支持与行动约定</td><td>兄弟听见并回应了我的保证</td></tr><tr><th>谁先领头</th><td>点名、观察跟随</td><td>领头人带动成员立场</td><td>我的选择带动了大家</td></tr><tr><th>把事安排妥</th><td>安排、撤回、比较</td><td>方案内容与多人的顾虑</td><td>我把事情安排得让人信服</td></tr><tr><th>各领其命</th><td>接话、认领、确认</td><td>决议后的个人分工</td><td>我主动接下一份责任</td></tr></tbody></table></div><p>会议共同承担“交代动机、呈现组织关系、让玩家参与、把行动分给大家”的作用。四版分别强调带动、被回应、被认可与主动承担；可按剧情节点选用或组合，最终进入同一主线。评审首先看：玩家是否知道为什么要行动、是否感到自己的参与被重视，以及是否看见兄弟们共同承担。</p></section>
    <details class="cp-archive dn-shared-notes"><summary>展开共同设计依据：会议承担、玩家体验与主线收束</summary>${foundations}${premise}</details>
    <footer class="dn-footer"><span>依据：CP 文档规范 · 核心设计思考规范<br>设计分析 / 2026.11.12 · 图示由现行原型模型驱动</span><a href="#menu">返回讨论开头 ↑</a></footer>`);
  function update(box,index){
    const mode=box.dataset.example;
    box.querySelectorAll('[data-example-choice]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
    const out=box.querySelector('.dn-result');
    if(mode==='draft'){
      const a=window.CouncilActions.claim('a',['collect','salvage','modify'][index]);
      out.innerHTML=`<small>暗中突破通过后 · 三项任务归属</small><div class="dn-assigned">${a.assignments.map(p=>`<div>${person(p.who==='伊摩'?'伊莱':p.who,p.who==='你'?7:p.who==='伊摩'?1:2)}<strong>${{collect:'收车',salvage:'拆车',modify:'改车'}[p.id]}</strong></div>`).join('')}</div>`;
      return;
    }
    const votes=mode==='call'?M.callVotes(index===0?'伊摩':'博姆','a'):mode==='sway'?M.votes('sway','a',index===1):M.proposalVotes([['safe','scout'],['safe','riders'],['scout','riders']][index],'a');
    if(mode==='call') menu.querySelector('.dn-leader').innerHTML=person(index===0?'伊莱 · 领头':'科腾 · 领头',index===0?1:4);
    const t=M.tally(votes);
    out.innerHTML=`<small>保持玩家投「暗中突破」不变</small>${dots(t.a,t.b)}<strong>${t.a} ∶ ${t.b} <span>${t.winner==='a'?'暗中突破通过':'全面反击通过'}</span></strong>`;
  }
  menu.querySelectorAll('[data-example]').forEach(box=>{
    box.querySelectorAll('[data-example-choice]').forEach((b,i)=>b.addEventListener('click',()=>update(box,i)));
    update(box,0);
  });
})();
