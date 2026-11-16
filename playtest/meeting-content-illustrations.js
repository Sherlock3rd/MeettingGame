/* Generated concept art placed beside the Step 4 content options. */
(() => {
  const section = document.getElementById('meeting-content');
  if (!section || section.querySelector('.content-visuals')) return;

  const gallery = document.createElement('div');
  gallery.className = 'content-visuals';
  gallery.setAttribute('aria-label', '两种会议内容落点示意图');
  gallery.innerHTML = `
    <div class="content-visual-grid">
      <figure class="content-visual-card">
        <img src="../assets/meeting-same-goal-paths-converge.png" alt="从同一决策点分出两条反击路径，最终汇入同一目标和主线" loading="lazy">
        <figcaption>
          <h4>第一章遇袭后：同一目标，不同路径</h4>
          <p><strong>强攻 / 智取</strong>改变当场的选择表达与人物回应；一日版本中执行任务相同，随后回到同一条反击主线。</p>
        </figcaption>
      </figure>
      <figure class="content-visual-card">
        <img src="../assets/meeting-local-branch-tasks.png" alt="会议后通往改车厂与商业街的不同局部任务，远端发展路径仍待讨论" loading="lazy">
        <figcaption>
          <h4>第三章结尾：发展倾向改变局部任务</h4>
          <p>选择影响后续个别任务或优先级；<strong>分支长度与汇合节点尚待讨论</strong>，不预设长期分线。</p>
        </figcaption>
      </figure>
    </div>`;

  const table = section.querySelector('.cp-table');
  const followthroughHeading = section.querySelector('h3');
  if (table && followthroughHeading) followthroughHeading.before(gallery);

  if (followthroughHeading) {
    const followthrough = document.createElement('figure');
    followthrough.className = 'content-followthrough';
    followthrough.innerHTML = `
      <figcaption>会议不是终点：决议需要进入行动，再由结果回应玩家</figcaption>
      <img src="../assets/meeting-decision-to-review.png" alt="会议决议、任务执行、目标回顾、奖励和后续剧情依次连接" loading="lazy">
      <ol aria-label="会后体验流程">
        <li><b>01</b>会议决议</li>
        <li><b>02</b>收尾演出</li>
        <li><b>03</b>任务执行</li>
        <li><b>04</b>OKR 式回顾与奖励</li>
        <li><b>05</b>剧情响应</li>
      </ol>`;
    const firstExplanation = followthroughHeading.nextElementSibling;
    if (firstExplanation) firstExplanation.after(followthrough);
  }
})();
