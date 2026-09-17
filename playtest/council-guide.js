/* First-visit guidance: chapter stamps live outside the room; no extra modal. */
(() => {
  const host=document.querySelector('.vote-view-toolbar');
  host.classList.add('chapter-guide');
  host.setAttribute('aria-label','当前会务');
  let current='',title='';
  const steps=['听议题','商量办法','正式投票','认领差事','散会'];
  const chapters={
    action:[3,'准备动手','行动安排','',''],
    claim:[3,'各领一件','正在领命','',''],
    opening:[0,'先听缘由','还没投票','先听两种办法：暗中突破，还是全面反击。决定后，每人再领一件差事。','点“继续”，听兄弟把话说完。'],
    call:[1,'请人领头','还没投票','科尔和小八愿意跟随先领头的人。你选谁先开口，会影响接下来两人的投票。','请一人领头；他会先投票，科尔、小八随后投。'],
    sway:[1,'先把话说开','还没投票','先问兄弟赞成哪种办法，才能知道谁有顾虑。科尔担心伤及镇民，你还有机会谈妥。','找科尔谈条件，或不再商量，直接投票。'],
    offer:[1,'给兄弟一句准话','承诺不是票','科尔愿意用支持换取“不动炸药”的保证。答应会改变他的想法，也约束之后的行动。','答应或拒绝；谈妥后，仍要每个人正式投票。'],
    reply:[1,'听他的答复','还没投票','你的话已经说出口。听清科尔是否愿意支持；之后仍由全桌正式投票。','点“继续”，听完答复后再投你的一票。'],
    amend:[1,'出门前先安排','还没投票','兄弟要看准备是否周全，才肯支持潜入。每人的顾虑写在下方；只有两组人可用。','选两件准备；看谁改变想法，再交给全桌投票。'],
    vote:[2,'轮到你投票','选定就不改票','帮徽代表一票。你只能投自己这一票；七位兄弟参加，会长主持，四票通过。','选暗中突破或全面反击；随后逐人亮票，按多数办。'],
    ballot:[2,'一人一票','正式计票','现在才按落下的帮徽计票。说过支持不等于已经投票；未点到的人仍显示待投。','看每位兄弟落徽，等会长点齐七票。'],
    verdict:[2,'会长落槌','七票点齐','方向由全桌多数决定。即使你没投赢，也能自己认领接下来负责的差事。','听完决议，再看桌上的两件差事。'],
    jobs:[3,'挑一件你来办','只领一件','桌上只摆通过的那一路行动。两件事去的地方、要做的事不同，先看清再认领。','翻开一张行动纸；确认前可以换另一张。'],
    duty:[3,'这件事我来','接话就是选差事','同伴正在和你分工。你接哪一句，就认领那件差事；另一件由他负责。','选一句回应，看两张纸上的名字如何分配。'],
    dutyReply:[3,'分工说清楚','尚未领命','你已经挑好差事，名字先写到纸上。同伴会接下另一件，最后由你确认。','点“继续”听完分工；确认前仍可以改口。'],
    confirm:[3,'把差事认准','尚可改口','这次确认的是你负责什么，不是再次投票。确认后，会长会把你的名字记进名单。','确认领命，或返回换一件差事。'],
    end:[4,'各自领命','议会结束','投票定了方向，你也领到了差事。现在只是接下行动，还没有出发或取得战果。','核对你的差事与约定，然后返回前厅。']
  };
  window.CouncilGuide={
    set(key,override={}){
      const [index,heading,stamp,why,action]=chapters[key];title=heading;
      const changed=key!==current;current=key;
      host.dataset.chapter=key;
      document.querySelector('#game').dataset.chapter=key;
      host.innerHTML=`<ol class="chapter-trail" aria-label="今晚的议事顺序">${steps.map((s,i)=>`<li class="${i===index?'now':i<index?'past':''}" ${i===index?'aria-current="step"':''}><span>${i<index?'✓':i+1}</span>${s}</li>`).join('')}</ol><div class="chapter-art ${changed?'chapter-impact':''}" role="status"><h2>${heading}</h2><b>${override.stamp||stamp}</b></div>`;
    },
    get title(){return title;}
  };
})();
