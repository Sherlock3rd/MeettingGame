# MeettingGame — 灰烬之子 · 会所议事夜

会议是主线中的参与界面：说明行动动机，呈现组织身份与成员回应，并把决定交给大家共同执行。玩家在会上知道为何行动、感到发言被重视、看见兄弟回应，并参与共同分工。

## 设计讨论结构

页面按四步展开：

1. **设计目的**：会议承担什么，给玩家什么体验；比较 CPA「渐进参加会议，感受身份变化」与 CPB「常驻会议，持续给予玩家选择」。两条系统路线尚未定案。
2. **剧情位置**：序章至第五章的剧情轴，列出剧情概述与关键系统；通过活动 PIN 移动并锚定候选插入位置。第四、第五章仅作填充占位。
3. **体验形式**：CP1–CP4 每张卡展示对应的抽象游戏参考与旧原型映射，并可直达试玩；试玩仍加载旧原型，明确与新形式提案的差异。
4. **会议内容**：基于 CP1 比较第一章遇袭后、第三章结尾两个候选落点；新增生图示意同目标汇流、局部任务分歧，以及会议决议到任务回顾的闭环。选择是同一目标的不同路径，不预设善恶二元对立。

## 基础设计支点

游戏采用假单机呈现：系统可以引导选择和人物反馈。选择主要改变当场参与、身份感与关系回应，必要时影响局部任务；主线最终收束一致，不要求长期分叉。

CP1 对应旧 02「一诺换票」，但现有原型只表现承诺换支持，代价 A 与抉择权的交换规则仍待细化。CP2 对应旧 01「谁先领头」的逐席跟票对照，尚未实现角色站位；CP3 对应旧 03「把事安排妥」的有限方案对照；CP4 对应旧 04「各领其命」中的普通计票。页面将提案与现有试玩能力分开说明。

## 试玩

[打开 GitHub Pages](https://sherlock3rd.github.io/MeettingGame/playtest/)

现有试玩围绕两项反击议案投票、领命与分工，止于任务认领；任务执行、奖励和 OKR 回顾属于后续讨论，不代表原型已实现。

## 本地运行与生成

在仓库根目录运行 `py -3 -m http.server 8788 --bind 127.0.0.1`，然后打开 `http://127.0.0.1:8788/playtest/`。

`playtest/progression-notes.js` 由工作台文档 `docs/reference-briefings/gang-council-voting-minigames/brief.md` 经同目录 `build-progression-notes.py` 生成；`playtest/meeting-timeline-data.js` 由 `meeting-timeline.json` 生成。会议页面的四步说明不改变投票或任务逻辑。

验证命令：`node --test playtest/council-model.test.cjs playtest/council-guide.test.cjs playtest/council-identity.test.cjs playtest/council-actions.test.cjs`
