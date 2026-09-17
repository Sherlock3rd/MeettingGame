# MeettingGame — 灰烬之子 · 会所议事夜

四种帮派议会交互原型：谁先领头、一诺换票、把事安排妥、各领其命。

## 试玩

GitHub Pages: https://sherlock3rd.github.io/MeettingGame/

保持投票 → 认领差事 → 同伴领取剩余差事 → 散会。任务只到领命，不执行、不发放奖励。人物职级、两方议案与会议室为本原型既有设计。

## 本地运行

在仓库根目录运行 `py -3 -m http.server 8788 --bind 127.0.0.1`，浏览器访问 `http://127.0.0.1:8788/`。

## 验证

`node --test playtest/council-model.test.cjs playtest/council-guide.test.cjs playtest/council-identity.test.cjs`

## 本次发布

- 职级布章、头像、姓名跨座位/对白/计票/行动纸统一。
- 保留逐人投票与真实多数结果，以人手槽、帮徽、行动纸状态代替大段操作教程。
- 玩家先领命，同伴随后开口认领胜方剩余差事，最终展示双方分工。
- 仅收录运行必需代码、两张场景/头像图集与测试，不包含其他工作区资料。
