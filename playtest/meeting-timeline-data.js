/* Source: meeting-timeline.json */
window.CouncilTimelineData = {
  "readDate": "2026-11-14",
  "defaultSlot": "prologue-end",
  "sources": {
    "prologue": {
      "title": "FTE序章及第一章 · 序幕(第一章)图文台本",
      "sheet": "0KlfTi",
      "revision": 1712,
      "url": "https://t6bdpf8yjg.feishu.cn/wiki/Lt9Mwl5G5il5jIkORxAcwqRInlw?sheet=0KlfTi"
    },
    "chapter1": {
      "title": "FTE序章及第一章 · 第一幕图文台本",
      "sheet": "1JJTqq",
      "revision": 1712,
      "url": "https://t6bdpf8yjg.feishu.cn/wiki/Lt9Mwl5G5il5jIkORxAcwqRInlw?sheet=1JJTqq"
    },
    "chapter2": {
      "title": "Dobe-第二章+第三章 · 第二章",
      "sheet": "9d6b76",
      "revision": 1790,
      "url": "https://t6bdpf8yjg.feishu.cn/sheets/K8TNs4hfUhg3iCtow2ec2gsdngc?sheet=9d6b76"
    },
    "chapter3": {
      "title": "Dobe-第二章+第三章 · 第三章",
      "sheet": "fqCeaP",
      "revision": 1790,
      "url": "https://t6bdpf8yjg.feishu.cn/sheets/K8TNs4hfUhg3iCtow2ec2gsdngc?sheet=fqCeaP"
    }
  },
  "chapters": [
    {
      "id": "prologue",
      "name": "序章",
      "title": "运货考验与正式转正",
      "scope": "前期已写台本",
      "status": "core",
      "source": "prologue",
      "events": [
        {
          "node": "L01",
          "title": "运货遇警察追捕",
          "detail": "开场 CG 接驾驶 SUP，建立运货考验。",
          "rows": "3–49",
          "kind": "event"
        },
        {
          "node": "L02–L03",
          "title": "遭伏击，兄弟接应",
          "detail": "博救援，摩托后座枪战；脱险后安排拖车。",
          "rows": "50–133",
          "kind": "event"
        },
        {
          "node": "L04",
          "title": "返镇入会所，汇报验货",
          "detail": "杰森确认考验完成；这是会所汇报与转正承接，未明确列投票议事。",
          "rows": "134–154",
          "kind": "ceremony",
          "slot": {
            "id": "after-report",
            "label": "验货后 → 转正前",
            "why": "可讨论见证与接纳：让玩家进入组织。必须保留随后已有的转正职责。",
            "priority": "early"
          }
        },
        {
          "node": "L05",
          "title": "正式成员仪式与帮派树",
          "detail": "背章与马甲变化，授予 Full Patch；说明声望、话语权和产业职责。",
          "rows": "155–195",
          "kind": "ceremony",
          "slot": {
            "id": "after-membership",
            "label": "转正后 → 任务入口前",
            "why": "可讨论第一次被邀请发言：用新身份获得回应；避免再做一次授衔。",
            "priority": "early"
          }
        },
        {
          "node": "L05",
          "title": "解锁主线任务，准备接管改车厂",
          "detail": "任务入口显现，查看升级改车厂与修复摩托车目标。",
          "rows": "197–226",
          "kind": "event",
          "slot": {
            "id": "prologue-end",
            "label": "序章 → 第一章",
            "why": "本轮预期区域。转正和任务解锁之后、L06 接管之前，讨论如何让新成员开始参与；不能打断必要引导或提前授予后期政令权限。",
            "priority": "preferred"
          }
        }
      ],
      "summary": "运货考验中遭到追捕与伏击，兄弟出手接应。返镇交货后，科尔通过考验，获得正式成员身份，开始承担帮派事务。",
      "beats": [
        "运货脱险",
        "返镇验货",
        "授予正式背章"
      ],
      "systems": [
        "SUP驾驶／后座枪战",
        "帮派树与职级",
        "主线任务"
      ],
      "meeting": "会所汇报与转正仪式；尚未明确投票议事。"
    },
    {
      "id": "chapter1",
      "name": "第一章",
      "title": "新的铠甲",
      "scope": "已完成 · 用户范围口径",
      "status": "core",
      "source": "chapter1",
      "events": [
        {
          "node": "L06–L07",
          "title": "接管改车厂，升级与修车",
          "detail": "包含台本 L06A 完成反馈；完成最初两项主线任务。",
          "rows": "3–77",
          "kind": "event",
          "slot": {
            "id": "after-repair",
            "label": "修车后 → 爆炸前",
            "why": "可比较低压参与会议，但距离 L09 紧急议会很近，需要验证是否重复。",
            "priority": "early"
          }
        },
        {
          "node": "L08",
          "title": "突发爆炸，紧急召集",
          "detail": "博带玩家赴会所。地点表述在台本中有冲突，此处只标爆炸事件。",
          "rows": "78–107",
          "kind": "event",
          "slot": {
            "id": "existing-l09",
            "label": "沿用 / 改造现有 L09",
            "why": "已有明确会议位置，可在此比较四种表达；这是改造现有节点，不是另加一场。",
            "priority": "existing"
          }
        },
        {
          "node": "L09",
          "title": "议会决定全面反击",
          "detail": "明确出现的议事节点。台本保留黑盒：进入 → 反击决定 → 结束；投票等形式未定。",
          "rows": "109–139",
          "kind": "meeting"
        },
        {
          "node": "L10–L12",
          "title": "收车、拆车、强化车辆",
          "detail": "反击准备阶段；当前台本与旧 demo 的分工/任务包装并非完全同版。",
          "rows": "142–229",
          "kind": "event"
        },
        {
          "node": "L13–L15",
          "title": "获得枪，伏击与收尾",
          "detail": "博交枪，进入 SUP 伏击；车辆射击 QTE 与回收收尾。",
          "rows": "230–264",
          "kind": "event"
        },
        {
          "node": "L16",
          "title": "成果认可，晋升 Enforcer",
          "detail": "领取声望，帮派树晋升。认可/晋升不自动算作另一场议会。",
          "rows": "268–313",
          "kind": "report",
          "slot": {
            "id": "chapter1-end",
            "label": "反击认可后 → 第二章",
            "why": "可讨论职责扩大和经营承接；避免与已存在的晋升反馈重复。",
            "priority": "later"
          }
        }
      ],
      "summary": "接管改车厂并修好摩托后，爆炸打破平静。帮派召开紧急议会，决定反击；科尔备车备枪、伏击敌方车队，凭战果获得晋升。",
      "beats": [
        "接管与修车",
        "爆炸后议事",
        "准备并反击",
        "成果认可与晋升"
      ],
      "systems": [
        "改车厂城建与修车",
        "议会",
        "限时任务",
        "收车／拆车／改装",
        "SUP伏击与QTE"
      ],
      "meeting": "已有会议：L09 紧急议会决定反击，具体表现未定。"
    },
    {
      "id": "chapter2",
      "name": "第二章",
      "title": "废铁与兄弟",
      "scope": "已完成 · 用户范围口径",
      "status": "core",
      "source": "chapter2",
      "events": [
        {
          "node": "L17–L19",
          "title": "接管并升级废车厂",
          "detail": "从反击转向接管与经营；升级后需要补充人手。",
          "rows": "3–41",
          "kind": "event"
        },
        {
          "node": "L20–L22",
          "title": "收服条件、拆车与改车",
          "detail": "学习 NPC 前置条件，获取配件并提升车辆战力。",
          "rows": "43–74",
          "kind": "event"
        },
        {
          "node": "L23–L24",
          "title": "竞速收服，派遣生产",
          "detail": "1v1 后获得可派遣成员，派到废车厂，展示产出和自动拆车收益。",
          "rows": "77–109",
          "kind": "event",
          "slot": {
            "id": "after-dispatch",
            "label": "派遣生效后 → 敌情出现前",
            "why": "可比较经营安排体验；派遣增益是既有内容，不能直接称为已实现政令 buff。",
            "priority": "later"
          }
        },
        {
          "node": "L25–L26",
          "title": "残余敌情与特殊战斗",
          "detail": "获得战斗帮手并进行首次推关教学；台本不同列的人物版本有差异，不在此定角色。",
          "rows": "110–148",
          "kind": "event"
        },
        {
          "node": "L27–L28",
          "title": "晋升与汇报",
          "detail": "自由领取任务奖励、晋升并承接下一章；没有明确新增会议流程。",
          "rows": "149–155",
          "kind": "report",
          "slot": {
            "id": "chapter2-end",
            "label": "第二章结束 → 第三章",
            "why": "可作为成长回顾的比较位置；当前优先讨论仍是序章至第一章。",
            "priority": "later"
          }
        }
      ],
      "summary": "反击后开始扩大经营：接管废车厂，改车赢得兄弟认可，再安排人手生产。处理镇内残余敌情后，汇报成果并继续晋升。",
      "beats": [
        "接管废车厂",
        "竞速收服兄弟",
        "派遣生产",
        "处理敌情与汇报"
      ],
      "systems": [
        "废车厂经营",
        "NPC收服／1v1竞速",
        "派遣／自动拆车",
        "首次推关教学"
      ],
      "meeting": ""
    },
    {
      "id": "chapter3",
      "name": "第三章",
      "title": "肃清内奸",
      "scope": "已完成 · 用户范围口径",
      "status": "core",
      "source": "chapter3",
      "events": [
        {
          "node": "L29–L32",
          "title": "内奸线索，常驻推关与第二英雄",
          "detail": "交代押运泄密，开放常驻推关，收服第二英雄并推进战斗。",
          "rows": "3–80",
          "kind": "event"
        },
        {
          "node": "L33",
          "title": "迎风逼供",
          "detail": "SUP 取得调查进展。",
          "rows": "81–103",
          "kind": "event"
        },
        {
          "node": "L34",
          "title": "回会所汇报，内奸逃亡",
          "detail": "杰森授权追捕；“议会桌上替你担着”是台词，不代表已发生议会。",
          "rows": "104–120",
          "kind": "report"
        },
        {
          "node": "L35–L38",
          "title": "提升战力，推关追击",
          "detail": "英雄/车辆养成与推关目标，接 boss 战。",
          "rows": "123–170",
          "kind": "event"
        },
        {
          "node": "L39",
          "title": "处决叛徒",
          "detail": "处决演出/QTE；叛徒要求上议会桌，流程并未回到议会审判。",
          "rows": "171–192",
          "kind": "event"
        },
        {
          "node": "L40–L44",
          "title": "商业街接管与经营收服",
          "detail": "台本合并节点范围；接管、升级、收服、派遣继续经营。",
          "rows": "194–232",
          "kind": "event"
        },
        {
          "node": "L45–L46",
          "title": "晋升与汇报",
          "detail": "领取任务奖励，晋升，汇报并结束本章。",
          "rows": "240–245",
          "kind": "report",
          "slot": {
            "id": "chapter3-end",
            "label": "第三章结束 → 填充章节",
            "why": "可讨论后续常驻系统接口，但两份资料没有把正式政令锁定在此。",
            "priority": "later"
          }
        }
      ],
      "summary": "押运泄密引出内奸线索。科尔招揽帮手、调查逼供并追击逃亡者，最终处决叛徒；随后接管商业街，继续经营与晋升。",
      "beats": [
        "调查内奸",
        "追击与处决",
        "接管商业街",
        "经营与晋升"
      ],
      "systems": [
        "常驻推关",
        "英雄收服与养成",
        "车辆养成",
        "SUP／处决QTE",
        "商业街经营"
      ],
      "meeting": ""
    },
    {
      "id": "chapter4",
      "name": "第四章",
      "title": "填充章节",
      "scope": "填充范围 · 核心事件待补",
      "status": "filler",
      "events": [
        {
          "node": "未提供节点",
          "title": "保留章节位置",
          "detail": "用户指定为后续填充章节；两份来源未提供本章台本，不补写事件、会议或奖励。",
          "kind": "placeholder",
          "slot": {
            "id": "chapter4-slot",
            "label": "第四章待定位置",
            "why": "只供会议讨论摆放；前后事件、触发与职责尚未锚定。",
            "priority": "placeholder"
          }
        }
      ],
      "summary": "后续填充章节，具体剧情待补。",
      "beats": [],
      "systems": [
        "待补"
      ],
      "meeting": ""
    },
    {
      "id": "chapter5",
      "name": "第五章",
      "title": "填充章节",
      "scope": "填充范围 · 核心事件待补",
      "status": "filler",
      "events": [
        {
          "node": "未提供节点",
          "title": "保留章节位置",
          "detail": "不把填充章节自动等同于政令系统上线，也不预设时长或新剧情。",
          "kind": "placeholder",
          "slot": {
            "id": "chapter5-slot",
            "label": "第五章待定位置",
            "why": "只供会议讨论摆放；正式政令的版本、触发和权限仍待确定。",
            "priority": "placeholder"
          }
        }
      ],
      "summary": "后续填充章节，具体剧情待补。",
      "beats": [],
      "systems": [
        "待补"
      ],
      "meeting": ""
    }
  ]
};
