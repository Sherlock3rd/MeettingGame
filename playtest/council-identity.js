/* All displayed ranks and NPC identities use the user's roster image. Old keys remain simulation-only. */
(() => {
 const roster={杰森:['会长','杰森',10,0],伊摩:['后队护卫','伊莱',4,1],博姆:['后队护卫','科腾',4,4],卡莱布:['正式成员','卡莱布',2,2],科尔:['财务官','戴尔',6,3],小八:['路线队长','博',5,5],瑞秋:['武装队长','雷',7,6],你:['正式成员','你',2,7]};
 const get=who=>roster[who];
 const name=who=>get(who)[1];
 const text=value=>String(value).replace(/伊摩|博姆|科尔|小八|瑞秋/g,key=>roster[key][1]);
 const label=who=>{const [title,n,rank]=get(who);return `<span class="identity-label"><span class="rank-patch" ${rank?`data-rank="${rank}"`:''}>${title}</span><small class="member-name">${n}</small></span>`;};
 const face=who=>`<span class="member-id"><span class="portrait face p${get(who)[3]}" aria-hidden="true"></span>${label(who)}</span>`;
 document.querySelectorAll('.seat').forEach(seat=>{seat.querySelector('b').innerHTML=label(seat.dataset.who);});
 window.CouncilIdentity={get,name,text,label,face};
})();
