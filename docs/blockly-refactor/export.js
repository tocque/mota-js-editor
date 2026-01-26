
// 语句集合和表达式集合
MotaActionBlocks = {
    "shoplist": [
      "shopsub",
      "shopitem",
      "shopcommonevent",
      "emptyshop"
    ],
    "levelChooseList": [
      "levelChooseChoice",
      "levelChooseEmpty"
    ],
    "floorPartitionList": [
      "floorPartitionItem",
      "floorPartitionEmpty"
    ],
    "equipList": [
      "equipKnown",
      "equipUnknown",
      "equipEmpty"
    ],
    "floorImageList": [
      "floorOneImage",
      "floorEmptyImage"
    ],
    "doorKeyList": [
      "doorKeyKnown",
      "doorKeyUnknown",
      "doorKeyEmpty"
    ],
    "nameMapList": [
      "nameMapBgm",
      "nameMapSoundKnown",
      "nameMapSoundUnknown",
      "nameMapImage",
      "nameMapAnimate",
      "nameMapUnknown",
      "nameMapEmpty"
    ],
    "splitImagesList": [
      "splitImagesOne",
      "splitImagesEmpty"
    ],
    "action": [
      "text_0_s",
      "text_1_s",
      "text_2_s",
      "moveTextBox_s",
      "clearTextBox_s",
      "comment_s",
      "autoText_s",
      "scrollText_s",
      "setText_s",
      "tip_s",
      "setValue_s",
      "setEnemy_s",
      "setEnemyOnPoint_s",
      "resetEnemyOnPoint_s",
      "moveEnemyOnPoint_s",
      "moveEnemyOnPoint_1_s",
      "setEquip_s",
      "setFloor_s",
      "setGlobalAttribute_s",
      "setGlobalValue_s",
      "setGlobalFlag_s",
      "setNameMap_s",
      "show_s",
      "hide_s",
      "setBlockOpacity_s",
      "setBlockFilter_s",
      "trigger_s",
      "insert_1_s",
      "insert_2_s",
      "exit_s",
      "setBlock_s",
      "turnBlock_s",
      "showFloorImg_s",
      "hideFloorImg_s",
      "showBgFgMap_s",
      "hideBgFgMap_s",
      "setBgFgBlock_s",
      "setHeroIcon_s",
      "update_s",
      "showStatusBar_s",
      "hideStatusBar_s",
      "setHeroOpacity_s",
      "sleep_s",
      "wait_s",
      "waitAsync_s",
      "stopAsync_s",
      "battle_s",
      "battle_1_s",
      "openDoor_s",
      "closeDoor_s",
      "changeFloor_s",
      "changePos_s",
      "setViewport_s",
      "setViewport_1_s",
      "lockViewport_s",
      "useItem_s",
      "loadEquip_s",
      "unloadEquip_s",
      "openShop_s",
      "disableShop_s",
      "follow_s",
      "unfollow_s",
      "animate_s",
      "animate_1_s",
      "stopAnimate_s",
      "vibrate_s",
      "showImage_s",
      "showImage_1_s",
      "hideImage_s",
      "showTextImage_s",
      "moveImage_s",
      "rotateImage_s",
      "scaleImage_s",
      "showGif_s",
      "setCurtain_0_s",
      "setCurtain_1_s",
      "screenFlash_s",
      "setWeather_s",
      "move_s",
      "moveAction_s",
      "moveHero_s",
      "jump_s",
      "jump_1_s",
      "jumpHero_s",
      "jumpHero_1_s",
      "playBgm_s",
      "pauseBgm_s",
      "resumeBgm_s",
      "loadBgm_s",
      "freeBgm_s",
      "playSound_s",
      "playSound_1_s",
      "stopSound_s",
      "setVolume_s",
      "setBgmSpeed_s",
      "win_s",
      "lose_s",
      "restart_s",
      "if_s",
      "if_1_s",
      "switch_s",
      "for_s",
      "forEach_s",
      "while_s",
      "dowhile_s",
      "break_s",
      "continue_s",
      "input_s",
      "input2_s",
      "choices_s",
      "confirm_s",
      "callBook_s",
      "callSave_s",
      "autoSave_s",
      "forbidSave_s",
      "callLoad_s",
      "previewUI_s",
      "clearMap_s",
      "setAttribute_s",
      "setFilter_s",
      "fillText_s",
      "fillBoldText_s",
      "drawTextContent_s",
      "fillRect_s",
      "strokeRect_s",
      "drawLine_s",
      "drawArrow_s",
      "fillPolygon_s",
      "strokePolygon_s",
      "fillEllipse_s",
      "strokeEllipse_s",
      "fillArc_s",
      "strokeArc_s",
      "drawImage_s",
      "drawImage_1_s",
      "drawIcon_s",
      "drawBackground_s",
      "drawSelector_s",
      "drawSelector_1_s",
      "unknown_s",
      "function_s",
      "pass_s"
    ],
    "textDrawingList": [
      "textDrawing",
      "textDrawingEmpty"
    ],
    "waitContext": [
      "waitContext_1",
      "waitContext_2",
      "waitContext_3",
      "waitContext_4",
      "waitContext_empty"
    ],
    "expression": [
      "expression_arithmetic_0",
      "negate_e",
      "unaryOperation_e",
      "bool_e",
      "idFixedList_e",
      "idFlag_e",
      "idTemp_e",
      "idIdList_e",
      "idString_e",
      "enemyattr_e",
      "blockId_e",
      "blockNumber_e",
      "blockCls_e",
      "equip_e",
      "nextXY_e",
      "isReplaying_e",
      "hasVisitedFloor_e",
      "isShopVisited_e",
      "hasEquip_e",
      "canBattle_e",
      "damage_e",
      "damage_1_e",
      "rand_e",
      "evalString_e"
    ]
  }
  // 所有域的默认行为
  MotaActionBlocks = Object.assign(MotaActionBlocks,{
    "IdText": {
      "type": "field_input",
      "text": "IdText_default"
    },
    "RawEvalString": {
      "type": "field_input",
      "text": "RawEvalString_default"
    },
    "JsonEvalString": {
      "type": "field_input",
      "text": "JsonEvalString_default"
    },
    "PosString": {
      "type": "field_input",
      "text": "PosString_default"
    },
    "IntString": {
      "type": "field_input",
      "text": "IntString_default"
    },
    "ColorString": {
      "type": "field_input",
      "text": "ColorString_default"
    },
    "FontString": {
      "type": "field_input",
      "text": "FontString_default"
    },
    "Floor_List": {
      "type": "field_dropdown",
      "options": [
        [
          "楼层ID",
          "floorId"
        ],
        [
          "前一楼",
          ":before"
        ],
        [
          "后一楼",
          ":next"
        ],
        [
          "当前楼",
          ":now"
        ]
      ],
      "default": "floorId"
    },
    "Stair_List": {
      "type": "field_dropdown",
      "options": [
        [
          "坐标",
          "loc"
        ],
        [
          "上楼梯",
          "upFloor"
        ],
        [
          "下楼梯",
          "downFloor"
        ],
        [
          "保持不变",
          ":now"
        ],
        [
          "中心对称点",
          ":symmetry"
        ],
        [
          "x对称点",
          ":symmetry_x"
        ],
        [
          "y对称点",
          ":symmetry_y"
        ],
        [
          "楼传落点",
          "flyPoint"
        ]
      ],
      "default": "loc"
    },
    "SetTextPosition_List": {
      "type": "field_dropdown",
      "options": [
        [
          "不改变",
          "null"
        ],
        [
          "距离顶部",
          "up"
        ],
        [
          "居中",
          "center"
        ],
        [
          "距离底部",
          "down"
        ]
      ],
      "default": "null"
    },
    "TextAlign_List": {
      "type": "field_dropdown",
      "options": [
        [
          "不改变",
          "null"
        ],
        [
          "左对齐",
          "left"
        ],
        [
          "左右居中",
          "center"
        ],
        [
          "右对齐",
          "right"
        ]
      ],
      "default": "null"
    },
    "TextBaseline_List": {
      "type": "field_dropdown",
      "options": [
        [
          "不改变",
          "null"
        ],
        [
          "顶部",
          "top"
        ],
        [
          "悬挂",
          "hanging"
        ],
        [
          "居中",
          "middle"
        ],
        [
          "标准值",
          "alphabetic"
        ],
        [
          "ideographic",
          "ideographic"
        ],
        [
          "底部",
          "bottom"
        ]
      ],
      "default": "null"
    },
    "Reverse_List": {
      "type": "field_dropdown",
      "options": [
        [
          "不改变",
          "null"
        ],
        [
          "左右翻转",
          ":x"
        ],
        [
          "上下翻转",
          ":y"
        ],
        [
          "中心翻转",
          ":o"
        ]
      ],
      "default": "null"
    },
    "ShopUse_List": {
      "type": "field_dropdown",
      "options": [
        [
          "金币",
          "money"
        ],
        [
          "经验",
          "exp"
        ]
      ],
      "default": "money"
    },
    "Arithmetic_List": {
      "type": "field_dropdown",
      "options": [
        [
          "加",
          "+"
        ],
        [
          "减",
          "-"
        ],
        [
          "乘",
          "*"
        ],
        [
          "除",
          "/"
        ],
        [
          "取余",
          "%"
        ],
        [
          "乘方",
          "**"
        ],
        [
          "等于",
          "==="
        ],
        [
          "不等于",
          "!=="
        ],
        [
          "大于",
          ">"
        ],
        [
          "小于",
          "<"
        ],
        [
          "大于等于",
          ">="
        ],
        [
          "小于等于",
          "<="
        ],
        [
          "且",
          "&&"
        ],
        [
          "或",
          "||"
        ],
        [
          "异或",
          "^"
        ],
        [
          "取较大",
          "max"
        ],
        [
          "取较小",
          "min"
        ],
        [
          "弱相等",
          "=="
        ],
        [
          "弱不相等",
          "!="
        ],
        [
          "开始于",
          "startsWith"
        ],
        [
          "结束于",
          "endsWith"
        ],
        [
          "包含",
          "includes"
        ]
      ],
      "default": "+"
    },
    "AssignOperator_List": {
      "type": "field_dropdown",
      "options": [
        [
          "设为",
          "="
        ],
        [
          "增加",
          "+="
        ],
        [
          "减少",
          "-="
        ],
        [
          "乘以",
          "*="
        ],
        [
          "除以",
          "/="
        ],
        [
          "乘方",
          "**="
        ],
        [
          "除以并取商",
          "//="
        ],
        [
          "除以并取余",
          "%="
        ],
        [
          "设为不小于",
          "max="
        ],
        [
          "设为不大于",
          "min="
        ]
      ],
      "default": "="
    },
    "UnaryOperator_List": {
      "type": "field_dropdown",
      "options": [
        [
          "向下取整",
          "Math.floor"
        ],
        [
          "向上取整",
          "Math.ceil"
        ],
        [
          "四舍五入",
          "Math.round"
        ],
        [
          "整数截断",
          "Math.trunc"
        ],
        [
          "绝对值",
          "Math.abs"
        ],
        [
          "开方",
          "Math.sqrt"
        ],
        [
          "变量类型",
          "typeof"
        ]
      ],
      "default": "Math.floor"
    },
    "Weather_List": {
      "type": "field_dropdown",
      "options": [
        [
          "无",
          "null"
        ],
        [
          "雨",
          "rain"
        ],
        [
          "雪",
          "snow"
        ],
        [
          "晴",
          "sun"
        ],
        [
          "雾",
          "fog"
        ],
        [
          "云",
          "cloud"
        ]
      ],
      "default": "null"
    },
    "B_0_List": {
      "type": "field_dropdown",
      "options": [
        [
          "不改变",
          "null"
        ],
        [
          "不可通行",
          "true"
        ],
        [
          "可以通行",
          "false"
        ]
      ],
      "default": "null"
    },
    "B_1_List": {
      "type": "field_dropdown",
      "options": [
        [
          "不改变",
          "null"
        ],
        [
          "设为粗体",
          "true"
        ],
        [
          "取消粗体",
          "false"
        ]
      ],
      "default": "null"
    },
    "Bg_Fg_List": {
      "type": "field_dropdown",
      "options": [
        [
          "背景层",
          "bg"
        ],
        [
          "前景层",
          "fg"
        ]
      ],
      "default": "bg"
    },
    "Bg_Fg2_List": {
      "type": "field_dropdown",
      "options": [
        [
          "背景层",
          "bg"
        ],
        [
          "前景层",
          "fg"
        ],
        [
          "自适配",
          "auto"
        ]
      ],
      "default": "bg"
    },
    "IgnoreChangeFloor_List": {
      "type": "field_dropdown",
      "options": [
        [
          "全局默认值",
          "null"
        ],
        [
          "可穿透",
          "true"
        ],
        [
          "不可穿透",
          "false"
        ]
      ],
      "default": "null"
    },
    "Event_List": {
      "type": "field_dropdown",
      "options": [
        [
          "普通事件",
          "null"
        ],
        [
          "战前事件",
          "beforeBattle"
        ],
        [
          "战后事件",
          "afterBattle"
        ],
        [
          "道具后事件",
          "afterGetItem"
        ],
        [
          "开门后事件",
          "afterOpenDoor"
        ]
      ],
      "default": "null"
    },
    "Floor_Meta_List": {
      "type": "field_dropdown",
      "options": [
        [
          "楼层中文名",
          "title"
        ],
        [
          "状态栏名称",
          "name"
        ],
        [
          "能否楼传飞到",
          "canFlyTo"
        ],
        [
          "能否楼传飞出",
          "canFlyFrom"
        ],
        [
          "能否打开快捷商店",
          "canUseQuickShop"
        ],
        [
          "是否不可浏览地图",
          "cannotViewMap"
        ],
        [
          "是否不可瞬间移动",
          "cannotMoveDirectly"
        ],
        [
          "默认地面ID",
          "defaultGround"
        ],
        [
          "宝石血瓶效果",
          "ratio"
        ],
        [
          "上楼点坐标",
          "upFloor"
        ],
        [
          "下楼点坐标",
          "downFloor"
        ],
        [
          "楼传落点坐标",
          "flyPoint"
        ],
        [
          "背景音乐",
          "bgm"
        ],
        [
          "画面色调",
          "color"
        ],
        [
          "天气和强度",
          "weather"
        ],
        [
          "是否地下层",
          "underGround"
        ]
      ],
      "default": "title"
    },
    "Global_Attribute_List": {
      "type": "field_dropdown",
      "options": [
        [
          "全局字体",
          "font"
        ],
        [
          "横屏左侧状态栏背景",
          "statusLeftBackground"
        ],
        [
          "竖屏上方状态栏背景",
          "statusTopBackground"
        ],
        [
          "竖屏下方道具栏背景",
          "toolsBackground"
        ],
        [
          "边框颜色",
          "borderColor"
        ],
        [
          "状态栏文字色",
          "statusBarColor"
        ],
        [
          "选中框颜色",
          "selectColor"
        ],
        [
          "楼层转换样式",
          "floorChangingStyle"
        ],
        [
          "装备列表",
          "equipName"
        ]
      ],
      "default": "font"
    },
    "Global_Value_List": {
      "type": "field_dropdown",
      "options": [
        [
          "血网伤害",
          "lavaDamage"
        ],
        [
          "中毒伤害",
          "poisonDamage"
        ],
        [
          "衰弱效果",
          "weakValue"
        ],
        [
          "红宝石效果",
          "redGem"
        ],
        [
          "蓝宝石效果",
          "blueGem"
        ],
        [
          "绿宝石效果",
          "greenGem"
        ],
        [
          "红血瓶效果",
          "redPotion"
        ],
        [
          "蓝血瓶效果",
          "bluePotion"
        ],
        [
          "黄血瓶效果",
          "yellowPotion"
        ],
        [
          "绿血瓶效果",
          "greenPotion"
        ],
        [
          "破甲比例",
          "breakArmor"
        ],
        [
          "反击比例",
          "counterAttack"
        ],
        [
          "净化比例",
          "purify"
        ],
        [
          "仇恨增加值",
          "hatred"
        ],
        [
          "图块每帧时间",
          "animateSpeed"
        ],
        [
          "上下楼时间",
          "floorChangeTime"
        ]
      ],
      "default": "lavaDamage"
    },
    "Global_Flag_List": {
      "type": "field_dropdown",
      "options": [
        [
          "显示当前楼层",
          "s:enableFloor"
        ],
        [
          "显示勇士图标",
          "s:enableName"
        ],
        [
          "显示当前等级",
          "s:enableLv"
        ],
        [
          "启用生命上限",
          "s:enableHPMax"
        ],
        [
          "显示生命值",
          "s:enableHP"
        ],
        [
          "显示魔力值",
          "s:enableMana"
        ],
        [
          "显示攻击力",
          "s:enableAtk"
        ],
        [
          "显示防御力",
          "s:enableDef"
        ],
        [
          "显示护盾值",
          "s:enableMDef"
        ],
        [
          "显示金币值",
          "s:enableMoney"
        ],
        [
          "显示经验值",
          "s:enableExp"
        ],
        [
          "允许等级提升",
          "s:enableLevelUp"
        ],
        [
          "升级扣除模式",
          "s:levelUpLeftMode"
        ],
        [
          "显示钥匙数量",
          "s:enableKeys"
        ],
        [
          "显示绿钥匙",
          "s:enableGreenKey"
        ],
        [
          "显示破炸飞",
          "s:enablePZF"
        ],
        [
          "显示毒衰咒",
          "s:enableDebuff"
        ],
        [
          "显示当前技能",
          "s:enableSkill"
        ],
        [
          "横屏底部工具栏",
          "extendToolbar"
        ],
        [
          "楼梯边才能楼传",
          "flyNearStair"
        ],
        [
          "楼传平面塔模式",
          "flyRecordPosition"
        ],
        [
          "开启加点",
          "enableAddPoint"
        ],
        [
          "开启负伤",
          "enableNegativeDamage"
        ],
        [
          "夹击不超伤害值",
          "betweenAttackMax"
        ],
        [
          "二分计算临界",
          "useLoop"
        ],
        [
          "允许轻按",
          "enableGentleClick"
        ],
        [
          "允许走到将死领域",
          "canGoDeadZone"
        ],
        [
          "允许瞬间移动",
          "enableMoveDirectly"
        ],
        [
          "阻激夹域后禁用快捷商店",
          "disableShopOnDamage"
        ],
        [
          "虚化前景层",
          "blurFg"
        ]
      ],
      "default": "s:enableFloor"
    },
    "NextXY_List": {
      "type": "field_dropdown",
      "options": [
        [
          "横坐标",
          "nextX"
        ],
        [
          "纵坐标",
          "nextY"
        ]
      ],
      "default": "nextX"
    },
    "EquipValueType_List": {
      "type": "field_dropdown",
      "options": [
        [
          "数值项",
          "value"
        ],
        [
          "百分比项",
          "percentage"
        ]
      ],
      "default": "value"
    },
    "Vibrate_List": {
      "type": "field_dropdown",
      "options": [
        [
          "左右",
          "horizontal"
        ],
        [
          "上下",
          "vertical"
        ],
        [
          "左上-右下",
          "diagonal1"
        ],
        [
          "左下-右上",
          "diagonal2"
        ],
        [
          "随机",
          "random"
        ]
      ],
      "default": "horizontal"
    },
    "Colour": {
      "type": "field_colour",
      "colour": "#ff0000"
    },
    "Angle": {
      "type": "field_angle",
      "angle": 90
    },
    "Bool": {
      "type": "field_checkbox",
      "checked": true
    },
    "Int": {
      "type": "field_number",
      "value": 0,
      "min": 0,
      "precision": 1
    },
    "NInt": {
      "type": "field_input",
      "text": "NInt_default"
    },
    "Letter_List": {
      "type": "field_dropdown",
      "options": [
        [
          "A",
          "A"
        ],
        [
          "B",
          "B"
        ],
        [
          "C",
          "C"
        ],
        [
          "D",
          "D"
        ],
        [
          "E",
          "E"
        ],
        [
          "F",
          "F"
        ],
        [
          "G",
          "G"
        ],
        [
          "H",
          "H"
        ],
        [
          "I",
          "I"
        ],
        [
          "J",
          "J"
        ],
        [
          "K",
          "K"
        ],
        [
          "L",
          "L"
        ],
        [
          "M",
          "M"
        ],
        [
          "N",
          "N"
        ],
        [
          "O",
          "O"
        ],
        [
          "P",
          "P"
        ],
        [
          "Q",
          "Q"
        ],
        [
          "R",
          "R"
        ],
        [
          "S",
          "S"
        ],
        [
          "T",
          "T"
        ],
        [
          "U",
          "U"
        ],
        [
          "V",
          "V"
        ],
        [
          "W",
          "W"
        ],
        [
          "X",
          "X"
        ],
        [
          "Y",
          "Y"
        ],
        [
          "Z",
          "Z"
        ]
      ],
      "default": "A"
    },
    "Number": {
      "type": "field_number",
      "value": 0
    },
    "Direction_List": {
      "type": "field_dropdown",
      "options": [
        [
          "上",
          "up"
        ],
        [
          "下",
          "down"
        ],
        [
          "左",
          "left"
        ],
        [
          "右",
          "right"
        ]
      ],
      "default": "up"
    },
    "DirectionEx_List": {
      "type": "field_dropdown",
      "options": [
        [
          "不变",
          "null"
        ],
        [
          "朝上",
          "up"
        ],
        [
          "朝下",
          "down"
        ],
        [
          "朝左",
          "left"
        ],
        [
          "朝右",
          "right"
        ],
        [
          "左转",
          ":left"
        ],
        [
          "右转",
          ":right"
        ],
        [
          "背对",
          ":back"
        ],
        [
          "角色同向",
          ":hero"
        ],
        [
          "角色反向",
          ":backhero"
        ]
      ],
      "default": "null"
    },
    "StepString": {
      "type": "field_input",
      "text": "StepString_default"
    },
    "IdString": {
      "type": "field_input",
      "text": "IdString_default"
    },
    "FixedId_List": {
      "type": "field_dropdown",
      "options": [
        [
          "生命",
          "status:hp"
        ],
        [
          "生命上限",
          "status:hpmax"
        ],
        [
          "攻击",
          "status:atk"
        ],
        [
          "防御",
          "status:def"
        ],
        [
          "护盾",
          "status:mdef"
        ],
        [
          "黄钥匙",
          "item:yellowKey"
        ],
        [
          "蓝钥匙",
          "item:blueKey"
        ],
        [
          "红钥匙",
          "item:redKey"
        ],
        [
          "金币",
          "status:money"
        ],
        [
          "经验",
          "status:exp"
        ],
        [
          "魔力",
          "status:mana"
        ],
        [
          "魔力上限",
          "status:manamax"
        ],
        [
          "当前横坐标",
          "status:x"
        ],
        [
          "当前纵坐标",
          "status:y"
        ],
        [
          "当前朝向",
          "status:direction"
        ],
        [
          "攻击增益",
          "buff:atk"
        ],
        [
          "防御增益",
          "buff:def"
        ],
        [
          "护盾增益",
          "buff:mdef"
        ]
      ],
      "default": "status:hp"
    },
    "Id_List": {
      "type": "field_dropdown",
      "options": [
        [
          "变量",
          "flag"
        ],
        [
          "状态",
          "status"
        ],
        [
          "物品",
          "item"
        ],
        [
          "增益",
          "buff"
        ],
        [
          "独立开关",
          "switch"
        ],
        [
          "临时变量",
          "temp"
        ],
        [
          "全局存储",
          "global"
        ]
      ],
      "default": "flag"
    },
    "EnemyId_List": {
      "type": "field_dropdown",
      "options": [
        [
          "生命",
          "hp"
        ],
        [
          "攻击",
          "atk"
        ],
        [
          "防御",
          "def"
        ],
        [
          "金币",
          "money"
        ],
        [
          "经验",
          "exp"
        ],
        [
          "加点",
          "point"
        ],
        [
          "特殊属性",
          "special"
        ],
        [
          "名称",
          "name"
        ],
        [
          "映射名",
          "displayInBook"
        ],
        [
          "属性值",
          "value"
        ],
        [
          "退化扣攻",
          "atkValue"
        ],
        [
          "退化扣防",
          "defValue"
        ],
        [
          "不可炸",
          "notBomb"
        ],
        [
          "九宫格领域",
          "zoneSquare"
        ],
        [
          "领域范围",
          "range"
        ],
        [
          "连击数",
          "n"
        ],
        [
          "吸血到自身",
          "add"
        ],
        [
          "固伤值",
          "damage"
        ]
      ],
      "default": "hp"
    },
    "EnemyPoint_List": {
      "type": "field_dropdown",
      "options": [
        [
          "生命",
          "hp"
        ],
        [
          "攻击",
          "atk"
        ],
        [
          "防御",
          "def"
        ],
        [
          "金币",
          "money"
        ],
        [
          "经验",
          "exp"
        ],
        [
          "加点",
          "point"
        ],
        [
          "名称",
          "name"
        ]
      ],
      "default": "hp"
    },
    "Equip_List": {
      "type": "field_dropdown",
      "options": [
        [
          "生命",
          "hp"
        ],
        [
          "生命上限",
          "hpmax"
        ],
        [
          "攻击",
          "atk"
        ],
        [
          "防御",
          "def"
        ],
        [
          "护盾",
          "mdef"
        ],
        [
          "魔力",
          "mana"
        ],
        [
          "魔力上限",
          "manamax"
        ]
      ],
      "default": "hp"
    },
    "Key_List": {
      "type": "field_dropdown",
      "options": [
        [
          "黄钥匙",
          "yellowKey"
        ],
        [
          "蓝钥匙",
          "blueKey"
        ],
        [
          "红钥匙",
          "redKey"
        ],
        [
          "绿钥匙",
          "greenKey"
        ],
        [
          "铁门钥匙",
          "steelKey"
        ]
      ],
      "default": "yellowKey"
    },
    "Move_List": {
      "type": "field_dropdown",
      "options": [
        [
          "上",
          "up"
        ],
        [
          "下",
          "down"
        ],
        [
          "左",
          "left"
        ],
        [
          "右",
          "right"
        ],
        [
          "前",
          "forward"
        ],
        [
          "后",
          "backward"
        ],
        [
          "左上",
          "leftup"
        ],
        [
          "左下",
          "leftdown"
        ],
        [
          "右上",
          "rightup"
        ],
        [
          "右下",
          "rightdown"
        ],
        [
          "设置速度",
          "speed"
        ]
      ],
      "default": "up"
    },
    "MoveMode_List": {
      "type": "field_dropdown",
      "options": [
        [
          "匀速移动",
          ""
        ],
        [
          "缓入快出",
          "easeIn"
        ],
        [
          "快入缓出",
          "easeOut"
        ],
        [
          "缓入缓出",
          "easeInOut"
        ],
        [
          "随机",
          "random"
        ]
      ],
      "default": ""
    },
    "NameMap_List": {
      "type": "field_dropdown",
      "options": [
        [
          "确定",
          "确定"
        ],
        [
          "取消",
          "取消"
        ],
        [
          "操作失败",
          "操作失败"
        ],
        [
          "光标移动",
          "光标移动"
        ],
        [
          "打开界面",
          "打开界面"
        ],
        [
          "读档",
          "读档"
        ],
        [
          "存档",
          "存档"
        ],
        [
          "获得道具",
          "获得道具"
        ],
        [
          "回血",
          "回血"
        ],
        [
          "宝石",
          "宝石"
        ],
        [
          "炸弹",
          "炸弹"
        ],
        [
          "飞行器",
          "飞行器"
        ],
        [
          "开关门",
          "开关门"
        ],
        [
          "上下楼",
          "上下楼"
        ],
        [
          "跳跃",
          "跳跃"
        ],
        [
          "破墙镐",
          "破墙镐"
        ],
        [
          "破冰镐",
          "破冰镐"
        ],
        [
          "阻激夹域",
          "阻激夹域"
        ],
        [
          "穿脱装备",
          "穿脱装备"
        ],
        [
          "商店",
          "商店"
        ]
      ],
      "default": "确定"
    },
    "EvalString": {
      "type": "field_input",
      "text": "EvalString_default"
    },
    "EvalString_Multi": {
      "type": "field_multilinetext",
      "text": "EvalString_Multi_default"
    },
    "BGNL": {
      "type": "input_dummy"
    }
  });
  // 所有方块的实际内容
  MotaActionBlocks = Object.assign(MotaActionBlocks,{
    "common_m": {
      "type": "statement",
      "json": {
        "type": "common_m",
        "message0": "编辑事件 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "编辑事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','common_m');
        }
        var code = '[\n'+action_0+']\n';
        return code;
      },
      "args": [
        "action_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('common_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('common_m',inputs,isShadow,comment);
      }
    },
    "event_m": {
      "type": "statement",
      "json": {
        "type": "event_m",
        "message0": "事件 %1 覆盖触发器 %2 启用 %3 通行状态 %4 显伤 %5 不透明度 %6 %7 该点特效 虚化 %8 色相 %9 灰度 %10 反色 %11 阴影 %12 %13 %14",
        "args0": [
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": true
          }),
          Object.assign({},MotaActionBlocks.B_0_List,{
            "name": "B_0_List_0"
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_2",
            "checked": true
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_0",
            "value": 1
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_1",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_2",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_3",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_3",
            "value": 0
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "编辑魔塔的事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        var B_0_List_0 = block.getFieldValue('B_0_List_0');
        B_0_List_0 = MotaActionFunctions.pre('B_0_List')(B_0_List_0);
        var Bool_2 = block.getFieldValue('Bool_2') === 'TRUE';
        Bool_2 = MotaActionFunctions.pre('Bool')(Bool_2);
        var Number_0 = block.getFieldValue('Number_0');
        Number_0 = MotaActionFunctions.pre('Number')(Number_0);
        var Number_1 = block.getFieldValue('Number_1');
        Number_1 = MotaActionFunctions.pre('Number')(Number_1);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Number_2 = block.getFieldValue('Number_2');
        Number_2 = MotaActionFunctions.pre('Number')(Number_2);
        var Bool_3 = block.getFieldValue('Bool_3') === 'TRUE';
        Bool_3 = MotaActionFunctions.pre('Bool')(Bool_3);
        var Number_3 = block.getFieldValue('Number_3');
        Number_3 = MotaActionFunctions.pre('Number')(Number_3);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','event_m');
        }
        B_0_List_0=eval(B_0_List_0);
        if (Number_0 < 0 || Number_0 > 1) throw '不透明度需要在0~1之间';
        if (Number_1 < 0) throw '虚化不得小于0；0为完全没有虚化';
        if (Int_0 < 0 || Int_0 >= 360) throw '色相需要在0~359之间';
        if (Number_2 < 0 || Number_2 > 1) throw '灰度需要在0~1之间';
        if (Number_3 < 0) throw '阴影不得小于0；0为完全没有阴影';
        var code = {
            'trigger': Bool_0?'action':null,
            'enable': Bool_1,
            'noPass': B_0_List_0,
            'displayDamage': Bool_2,
            'opacity': Number_0,
            'filter': {
                'blur': Number_1,
                'hue': Int_0,
                'grayscale': Number_2,
                'invert': Bool_3,
                'shadow': Number_3
            },
            'data': 'data_asdfefw'
        }
        if (!Bool_0 && Bool_1 && B_0_List_0===null && Bool_2 && Number_0==1.0 && Number_1==0 && Int_0==0 && Number_2==0 && !Bool_3 && Number_3==0) 
            code = 'data_asdfefw';
        code=JSON.stringify(code,null,2).split('"data_asdfefw"').join('[\n'+action_0+']\n');
        return code;
      },
      "args": [
        "Bool_0",
        "Bool_1",
        "B_0_List_0",
        "Bool_2",
        "Number_0",
        "Number_1",
        "Int_0",
        "Number_2",
        "Bool_3",
        "Number_3",
        "action_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field","field","statement"],
      "argsGrammarName": ["Bool","Bool","B_0_List","Bool","Number","Number","Int","Number","Bool","Number","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('event_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('event_m',inputs,isShadow,comment);
      }
    },
    "autoEvent_m": {
      "type": "statement",
      "json": {
        "type": "autoEvent_m",
        "message0": "自动事件： 触发条件 %1 优先级 %2 %3 仅在本层检测 %4 事件流中延迟执行 %5 允许多次执行 %6 %7 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": "flag:__door__===2"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": true
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_2",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "自动事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        if (EvalString_Multi_0==='') {
          throw new OmitedError(block,'EvalString_Multi_0','autoEvent_m');
        }
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        var Bool_2 = block.getFieldValue('Bool_2') === 'TRUE';
        Bool_2 = MotaActionFunctions.pre('Bool')(Bool_2);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','autoEvent_m');
        }
        var code = {
            "condition": 'autoEvent_condition', // 条件不可为null
            "currentFloor": Bool_0, // 是否仅在本层检测
            "priority": Int_0, // 优先级
            "delayExecute": Bool_1, // 延迟执行
            "multiExecute": Bool_2, // 是否允许多次执行
            "data": 'autoEvent_asdfefw', // 事件列表
        };
        code=JSON.stringify(code,null,2).replace('autoEvent_condition', EvalString_Multi_0).split('"autoEvent_asdfefw"').join('[\n'+action_0+']\n');
        return code;
      },
      "args": [
        "EvalString_Multi_0",
        "Int_0",
        "Bool_0",
        "Bool_1",
        "Bool_2",
        "action_0"
      ],
      "argsType": ["field","field","field","field","field","statement"],
      "argsGrammarName": ["EvalString_Multi","Int","Bool","Bool","Bool","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('autoEvent_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('autoEvent_m',inputs,isShadow,comment);
      }
    },
    "level_m": {
      "type": "statement",
      "json": {
        "type": "level_m",
        "message0": "等级提升 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "levelCase_0",
            "check": "levelCase"
          }
        ],
        "tooltip": "升级事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var levelCase_0 = Blockly.JavaScript.statementToCode(block, 'levelCase_0');
        if (levelCase_0==='') {
          throw new OmitedError(block,'levelCase_0','level_m');
        }
        var code = '[\n'+levelCase_0+']\n';
        return code;
      },
      "args": [
        "levelCase_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["levelCase"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('level_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('level_m',inputs,isShadow,comment);
      }
    },
    "levelCase": {
      "type": "statement",
      "json": {
        "type": "levelCase",
        "message0": "需求 %1 称号 %2 是否扣除经验 %3 %4 %5",
        "args0": [
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": ""
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "升级设定",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250,
        "previousStatement": "levelCase",
        "nextStatement": "levelCase"
      },
      "generFunc": function(block) {
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','levelCase');
        }
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','levelCase');
        }
        Bool_0 = Bool_0?', "clear": true':'';
        var code = '{"need": "'+expression_0+'", "title": "'+EvalString_0+'"'+Bool_0+', "action": [\n'+action_0+']},\n';
        return code;
      },
      "args": [
        "expression_0",
        "EvalString_0",
        "Bool_0",
        "action_0"
      ],
      "argsType": ["value","field","field","statement"],
      "argsGrammarName": ["expression","EvalString","Bool","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('levelCase',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('levelCase',inputs,isShadow,comment);
      }
    },
    "shop_m": {
      "type": "statement",
      "json": {
        "type": "shop_m",
        "message0": "全局商店列表 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "shoplist_0",
            "check": MotaActionBlocks.shoplist
          }
        ],
        "tooltip": "全局商店列表",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var shoplist_0 = Blockly.JavaScript.statementToCode(block, 'shoplist_0');
        if (shoplist_0==='') {
          throw new OmitedError(block,'shoplist_0','shop_m');
        }
        var code = '['+shoplist_0+']\n';
        return code;
      },
      "args": [
        "shoplist_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["shoplist"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('shop_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('shop_m',inputs,isShadow,comment);
      }
    },
    "emptyshop": {
      "type": "statement",
      "json": {
        "type": "emptyshop",
        "message0": "",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 70,
        "previousStatement": "emptyshop",
        "nextStatement": MotaActionBlocks.shoplist
      },
      "generFunc": function(block) {
        var code = ' \n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('emptyshop',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('emptyshop',inputs,isShadow,comment);
      }
    },
    "shopsub": {
      "type": "statement",
      "json": {
        "type": "shopsub",
        "message0": "商店 id %1 标题 %2 图像 %3 %4 文字 %5 %6 快捷名称 %7 未开启不显示 %8 不可预览 %9 %10 %11",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "shop1"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "贪婪之神"
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_1",
            "text": "moneyShop"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": "勇敢的武士啊, 给我${20+2*flag:shop1}金币就可以："
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "金币商店"
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "shopChoices_0",
            "check": "shopChoices"
          }
        ],
        "tooltip": "全局商店",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "shopsub",
        "nextStatement": MotaActionBlocks.shoplist
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','shopsub');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var IdString_1 = block.getFieldValue('IdString_1');
        IdString_1 = MotaActionFunctions.pre('IdString')(IdString_1);
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','shopsub');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        var shopChoices_0 = Blockly.JavaScript.statementToCode(block, 'shopChoices_0');
        if (shopChoices_0==='') {
          throw new OmitedError(block,'shopChoices_0','shopsub');
        }
        var title='';
        if (EvalString_0==''){
            if (IdString_1=='') title='';
            else title='\t['+IdString_1+']';
        } else {
            if (IdString_1=='')title='\t['+EvalString_0+']';
            else title='\t['+EvalString_0+','+IdString_1+']';
        }
        title += EvalString_Multi_0;
        var code = '{\n"id": "'+IdString_0+'",\n"text": "'+title+'",\n"textInList": "'+EvalString_1+'",\n"mustEnable": '+Bool_0+',\n"disablePreview": '+Bool_1+',\n"choices":[\n'+shopChoices_0+']},\n';
        return code;
      },
      "args": [
        "IdString_0",
        "EvalString_0",
        "IdString_1",
        "EvalString_Multi_0",
        "EvalString_1",
        "Bool_0",
        "Bool_1",
        "shopChoices_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","statement"],
      "argsGrammarName": ["IdString","EvalString","IdString","EvalString_Multi","EvalString","Bool","Bool","shopChoices"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('shopsub',keyOrIndex);
      },
      "menu": [],
      "doubleclicktext": "EvalString_Multi_0",
      "allIds": "['IdString_1']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('shopsub',inputs,isShadow,comment);
      }
    },
    "shopChoices": {
      "type": "statement",
      "json": {
        "type": "shopChoices",
        "message0": "商店选项 %1 使用条件 %2 %3 图标 %4 颜色 %5 %6 出现条件 %7 %8 %9",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "攻击+1"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "status:money>=20+2*flag:shop1"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_2",
            "text": ""
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "商店选项",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250,
        "previousStatement": "shopChoices",
        "nextStatement": "shopChoices"
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','shopChoices');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','shopChoices');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var EvalString_2 = block.getFieldValue('EvalString_2');
        EvalString_2 = MotaActionFunctions.pre('EvalString')(EvalString_2);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','shopChoices');
        }
        ColorString_0 = ColorString_0 ? (', "color": ['+ColorString_0+']') : '';
        EvalString_2 = EvalString_2 && (', "condition": "'+EvalString_2+'"')
        IdString_0 = IdString_0? (', "icon": "'+IdString_0+'"'):'';
        var code = '{"text": "'+EvalString_0+'", "need": "'+EvalString_1+'"'+IdString_0+ColorString_0+EvalString_2+', "action": [\n'+action_0+']},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "IdString_0",
        "ColorString_0",
        "Colour_0",
        "EvalString_2",
        "action_0"
      ],
      "argsType": ["field","field","field","field","field","field","statement"],
      "argsGrammarName": ["EvalString","EvalString","IdString","ColorString","Colour","EvalString","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('shopChoices',keyOrIndex);
      },
      "menu": [],
      "allIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('shopChoices',inputs,isShadow,comment);
      }
    },
    "shopitem": {
      "type": "statement",
      "json": {
        "type": "shopitem",
        "message0": "道具商店 id %1 快捷名称 %2 使用 %3 未开启不显示 %4 %5 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "itemShop"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "道具商店"
          }),
          Object.assign({},MotaActionBlocks.ShopUse_List,{
            "name": "ShopUse_List_0",
            "default": false
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0"
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "shopItemChoices_0",
            "check": "shopItemChoices"
          }
        ],
        "tooltip": "道具商店",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "shopitem",
        "nextStatement": MotaActionBlocks.shoplist
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','shopitem');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','shopitem');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var ShopUse_List_0 = block.getFieldValue('ShopUse_List_0');
        ShopUse_List_0 = MotaActionFunctions.pre('ShopUse_List')(ShopUse_List_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var shopItemChoices_0 = Blockly.JavaScript.statementToCode(block, 'shopItemChoices_0');
        if (shopItemChoices_0==='') {
          throw new OmitedError(block,'shopItemChoices_0','shopitem');
        }
        var code = {
            'id': IdString_0,
            'item': true,
            'textInList': EvalString_0,
            'use': ShopUse_List_0 || 'money',
            'mustEnable': Bool_0,
            'choices': 'choices_aqwedsa'
        }
        code=JSON.stringify(code,null,2).split('"choices_aqwedsa"').join('[\n'+shopItemChoices_0+']')+',\n';
        return code;
      },
      "args": [
        "IdString_0",
        "EvalString_0",
        "ShopUse_List_0",
        "Bool_0",
        "shopItemChoices_0"
      ],
      "argsType": ["field","field","field","field","statement"],
      "argsGrammarName": ["IdString","EvalString","ShopUse_List","Bool","shopItemChoices"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('shopitem',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('shopitem',inputs,isShadow,comment);
      }
    },
    "shopItemChoices": {
      "type": "statement",
      "json": {
        "type": "shopItemChoices",
        "message0": "道具名 %1 存量 %2 买入价格 %3 卖出价格 %4 出现条件 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "yellowKey"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "10"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_2",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "道具商店选项，每一项是道具名；买入或卖出可以不填表示只能卖出或买入",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250,
        "previousStatement": "shopItemChoices",
        "nextStatement": "shopItemChoices"
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','shopItemChoices');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var EvalString_2 = block.getFieldValue('EvalString_2');
        EvalString_2 = MotaActionFunctions.pre('EvalString')(EvalString_2);
        IntString_0 = IntString_0 ? (', "number": '+IntString_0) : '';
        EvalString_0 = EvalString_0 ? (', "money": "'+EvalString_0+'"') : '';
        EvalString_1 = EvalString_1 ? (', "sell": "'+EvalString_1+'"') : '';
        if (!EvalString_0 && !EvalString_1) throw "买入金额和卖出金额至少需要填写一个";
        EvalString_2 = EvalString_2 ? (', "condition": "'+EvalString_2+'"') : '';
        var code = '{"id": "' + IdString_0 + '"' + IntString_0 + EvalString_0 + EvalString_1 + EvalString_2 + '},\n';
        return code;
      },
      "args": [
        "IdString_0",
        "IntString_0",
        "EvalString_0",
        "EvalString_1",
        "EvalString_2"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["IdString","IntString","EvalString","EvalString","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('shopItemChoices',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('shopItemChoices',inputs,isShadow,comment);
      }
    },
    "shopcommonevent": {
      "type": "statement",
      "json": {
        "type": "shopcommonevent",
        "message0": "公共事件商店 id %1 快捷名称 %2 未开启不显示 %3 %4 执行的公共事件名 %5 参数列表 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "shop1"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "回收钥匙商店"
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "回收钥匙商店"
          }),
          Object.assign({},MotaActionBlocks.JsonEvalString,{
            "name": "JsonEvalString_0",
            "text": ""
          })
        ],
        "tooltip": "全局商店, 执行一个公共事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "shopcommonevent",
        "nextStatement": MotaActionBlocks.shoplist
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','shopcommonevent');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','shopcommonevent');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','shopcommonevent');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var JsonEvalString_0 = block.getFieldValue('JsonEvalString_0');
        JsonEvalString_0 = MotaActionFunctions.pre('JsonEvalString')(JsonEvalString_0);
        if (JsonEvalString_0) {
            if (!(JSON.parse(JsonEvalString_0) instanceof Array))
                throw new Error('参数列表必须是个有效的数组！');
        }
        var code = {
            'id': IdString_0,
            'textInList': EvalString_0,
            'mustEnable': Bool_0,
            'commonEvent': EvalString_1
        }
        if (JsonEvalString_0) code.args = JSON.parse(JsonEvalString_0);
        code=JSON.stringify(code,null,2)+',\n';
        return code;
      },
      "args": [
        "IdString_0",
        "EvalString_0",
        "Bool_0",
        "EvalString_1",
        "JsonEvalString_0"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["IdString","EvalString","Bool","EvalString","JsonEvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('shopcommonevent',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('shopcommonevent',inputs,isShadow,comment);
      }
    },
    "beforeBattle_m": {
      "type": "statement",
      "json": {
        "type": "beforeBattle_m",
        "message0": "战斗开始前 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "战斗开始前",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','beforeBattle_m');
        }
        var code = '[\n'+action_0+']\n';
        return code;
      },
      "args": [
        "action_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('beforeBattle_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('beforeBattle_m',inputs,isShadow,comment);
      }
    },
    "afterBattle_m": {
      "type": "statement",
      "json": {
        "type": "afterBattle_m",
        "message0": "战斗结束后 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "系统引发的战后",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','afterBattle_m');
        }
        var code = '[\n'+action_0+']\n';
        return code;
      },
      "args": [
        "action_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('afterBattle_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('afterBattle_m',inputs,isShadow,comment);
      }
    },
    "afterGetItem_m": {
      "type": "statement",
      "json": {
        "type": "afterGetItem_m",
        "message0": "获取道具后 轻按时不触发 %1 %2 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0"
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "系统引发的道具后事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','afterGetItem_m');
        }
        if (Bool_0) {
          return '{"disableOnGentleClick": true, "data": [\n'+action_0+']\n}';
        } else {
          return '[\n'+action_0+']\n';
        }
      },
      "args": [
        "Bool_0",
        "action_0"
      ],
      "argsType": ["field","statement"],
      "argsGrammarName": ["Bool","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('afterGetItem_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('afterGetItem_m',inputs,isShadow,comment);
      }
    },
    "afterOpenDoor_m": {
      "type": "statement",
      "json": {
        "type": "afterOpenDoor_m",
        "message0": "打开门后 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "系统引发的自定义事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','afterOpenDoor_m');
        }
        var code = '[\n'+action_0+']\n';
        return code;
      },
      "args": [
        "action_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('afterOpenDoor_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('afterOpenDoor_m',inputs,isShadow,comment);
      }
    },
    "firstArrive_m": {
      "type": "statement",
      "json": {
        "type": "firstArrive_m",
        "message0": "首次到达楼层 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "首次到达楼层",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','firstArrive_m');
        }
        var code = '[\n'+action_0+']\n';
        return code;
      },
      "args": [
        "action_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('firstArrive_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('firstArrive_m',inputs,isShadow,comment);
      }
    },
    "eachArrive_m": {
      "type": "statement",
      "json": {
        "type": "eachArrive_m",
        "message0": "每次到达楼层 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "每次到达楼层",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','eachArrive_m');
        }
        var code = '[\n'+action_0+']\n';
        return code;
      },
      "args": [
        "action_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('eachArrive_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('eachArrive_m',inputs,isShadow,comment);
      }
    },
    "changeFloor_m": {
      "type": "statement",
      "json": {
        "type": "changeFloor_m",
        "message0": "楼梯, 传送门 %1 %2 %3 %4 x %5 , y %6 朝向 %7 动画时间 %8 穿透性 %9",
        "args0": [
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.Floor_List,{
            "name": "Floor_List_0"
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "MTx"
          }),
          Object.assign({},MotaActionBlocks.Stair_List,{
            "name": "Stair_List_0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.DirectionEx_List,{
            "name": "DirectionEx_List_0"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IgnoreChangeFloor_List,{
            "name": "IgnoreChangeFloor_List_0"
          })
        ],
        "tooltip": "楼梯, 传送门, 如果目标楼层有多个楼梯, 写upFloor或downFloor可能会导致到达的楼梯不确定, 这时候请使用loc方式来指定具体的点位置",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var Floor_List_0 = block.getFieldValue('Floor_List_0');
        Floor_List_0 = MotaActionFunctions.pre('Floor_List')(Floor_List_0);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Stair_List_0 = block.getFieldValue('Stair_List_0');
        Stair_List_0 = MotaActionFunctions.pre('Stair_List')(Stair_List_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var DirectionEx_List_0 = block.getFieldValue('DirectionEx_List_0');
        DirectionEx_List_0 = MotaActionFunctions.pre('DirectionEx_List')(DirectionEx_List_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var IgnoreChangeFloor_List_0 = block.getFieldValue('IgnoreChangeFloor_List_0');
        IgnoreChangeFloor_List_0 = MotaActionFunctions.pre('IgnoreChangeFloor_List')(IgnoreChangeFloor_List_0);
        var toFloorId = IdString_0;
        if (Floor_List_0!='floorId') toFloorId = Floor_List_0;
        var loc = '';
        if (PosString_0 && PosString_1) {
          loc = ', "loc": ['+PosString_0+', '+PosString_1+']';
        }
        if (Stair_List_0===':now') loc = '';
        else if (Stair_List_0!=='loc')loc = ', "stair": "'+Stair_List_0+'"';
        if (DirectionEx_List_0 == 'null') DirectionEx_List_0 = '';
        DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        if (IgnoreChangeFloor_List_0!='null') {
          IgnoreChangeFloor_List_0 = ', "ignoreChangeFloor": '+IgnoreChangeFloor_List_0;
        } else {
          IgnoreChangeFloor_List_0 = '';
        }
        var code = '{"floorId": "'+toFloorId+'"'+loc+DirectionEx_List_0+IntString_0+IgnoreChangeFloor_List_0+' }\n';
        return code;
      },
      "args": [
        "Floor_List_0",
        "IdString_0",
        "Stair_List_0",
        "PosString_0",
        "PosString_1",
        "DirectionEx_List_0",
        "IntString_0",
        "IgnoreChangeFloor_List_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["Floor_List","IdString","Stair_List","PosString","PosString","DirectionEx_List","IntString","IgnoreChangeFloor_List"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('changeFloor_m',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"PosString_0\", \"PosString_1\", \"IdString_0\", true]",
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('changeFloor_m',inputs,isShadow,comment);
      }
    },
    "commonEvent_m": {
      "type": "statement",
      "json": {
        "type": "commonEvent_m",
        "message0": "公共事件 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "公共事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','commonEvent_m');
        }
        var code = '[\n'+action_0+']\n';
        return code;
      },
      "args": [
        "action_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('commonEvent_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('commonEvent_m',inputs,isShadow,comment);
      }
    },
    "item_m": {
      "type": "statement",
      "json": {
        "type": "item_m",
        "message0": "使用道具事件 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "使用道具事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','item_m');
        }
        var code = '[\n'+action_0+']\n';
        return code;
      },
      "args": [
        "action_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('item_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('item_m',inputs,isShadow,comment);
      }
    },
    "levelChoose_m": {
      "type": "statement",
      "json": {
        "type": "levelChoose_m",
        "message0": "难度分歧 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "levelChooseList_0",
            "check": MotaActionBlocks.levelChooseList
          }
        ],
        "tooltip": "难度分歧",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var levelChooseList_0 = Blockly.JavaScript.statementToCode(block, 'levelChooseList_0');
        if (levelChooseList_0==='') {
          throw new OmitedError(block,'levelChooseList_0','levelChoose_m');
        }
        var code = '[\n'+levelChooseList_0+']\n';
        return code;
      },
      "args": [
        "levelChooseList_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["levelChooseList"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('levelChoose_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('levelChoose_m',inputs,isShadow,comment);
      }
    },
    "levelChooseEmpty": {
      "type": "statement",
      "json": {
        "type": "levelChooseEmpty",
        "message0": "",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 70,
        "previousStatement": "levelChooseEmpty",
        "nextStatement": MotaActionBlocks.levelChooseList
      },
      "generFunc": function(block) {
        var code = ' \n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('levelChooseEmpty',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('levelChooseEmpty',inputs,isShadow,comment);
      }
    },
    "levelChooseChoice": {
      "type": "statement",
      "json": {
        "type": "levelChooseChoice",
        "message0": "难度分歧项 名称 %1 简写 %2 变量:hard值 %3 颜色 %4 %5 %6 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "简单"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "Easy"
          }),
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_0",
            "text": 1
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0"
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "难度分歧项",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "levelChooseChoice",
        "nextStatement": MotaActionBlocks.levelChooseList
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','levelChooseChoice');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','levelChooseChoice');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var NInt_0 = block.getFieldValue('NInt_0');
        if (NInt_0==='') {
          throw new OmitedError(block,'NInt_0','levelChooseChoice');
        }
        NInt_0 = MotaActionFunctions.pre('NInt')(NInt_0);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','levelChooseChoice');
        }
        ColorString_0 = ColorString_0 ? (', "color": [' + ColorString_0 + ']') : '';
        var code = '{"title": "'+EvalString_0+'", "name": "'+EvalString_1+'", "hard": '+NInt_0+ColorString_0+', "action": [\n'+action_0+']},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "NInt_0",
        "ColorString_0",
        "Colour_0",
        "action_0"
      ],
      "argsType": ["field","field","field","field","field","statement"],
      "argsGrammarName": ["EvalString","EvalString","NInt","ColorString","Colour","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('levelChooseChoice',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('levelChooseChoice',inputs,isShadow,comment);
      }
    },
    "floorPartition_m": {
      "type": "statement",
      "json": {
        "type": "floorPartition_m",
        "message0": "高层塔分区管理 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "floorPartitionList_0",
            "check": MotaActionBlocks.floorPartitionList
          }
        ],
        "tooltip": "高层塔分区管理",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var floorPartitionList_0 = Blockly.JavaScript.statementToCode(block, 'floorPartitionList_0');
        if (floorPartitionList_0==='') {
          throw new OmitedError(block,'floorPartitionList_0','floorPartition_m');
        }
        var code = '[\n'+floorPartitionList_0+']\n';
        return code;
      },
      "args": [
        "floorPartitionList_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["floorPartitionList"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('floorPartition_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('floorPartition_m',inputs,isShadow,comment);
      }
    },
    "floorPartitionEmpty": {
      "type": "statement",
      "json": {
        "type": "floorPartitionEmpty",
        "message0": "",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 70,
        "previousStatement": "floorPartitionEmpty",
        "nextStatement": MotaActionBlocks.floorPartitionList
      },
      "generFunc": function(block) {
        var code = ' \n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('floorPartitionEmpty',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('floorPartitionEmpty',inputs,isShadow,comment);
      }
    },
    "floorPartitionItem": {
      "type": "statement",
      "json": {
        "type": "floorPartitionItem",
        "message0": "分区项 起始楼层ID %1 终止楼层ID（不填代表到最后一层） %2",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "MTx"
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_1",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "难度分歧项",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "floorPartitionItem",
        "nextStatement": MotaActionBlocks.floorPartitionList
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','floorPartitionItem');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var IdString_1 = block.getFieldValue('IdString_1');
        IdString_1 = MotaActionFunctions.pre('IdString')(IdString_1);
        IdString_1 = IdString_1 ? (', "'+IdString_1+'"') : '';
        var code = '["'+IdString_0+'"'+IdString_1+'],\n';
        return code;
      },
      "args": [
        "IdString_0",
        "IdString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["IdString","IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('floorPartitionItem',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('floorPartitionItem',inputs,isShadow,comment);
      }
    },
    "equip_m": {
      "type": "statement",
      "json": {
        "type": "equip_m",
        "message0": "装备 类型 %1 装备动画（第一个装备格有效） %2 %3 数值提升项 %4 百分比提升项 %5 穿上时事件 %6 脱下时事件 %7 此道具cls须为equips并设置canUseItemEffect",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "equipList_0",
            "check": MotaActionBlocks.equipList
          },
          {
            "type": "input_statement",
            "name": "equipList_1",
            "check": MotaActionBlocks.equipList
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          },
          {
            "type": "input_statement",
            "name": "action_1",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "装备",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','equip_m');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var equipList_0 = Blockly.JavaScript.statementToCode(block, 'equipList_0');
        if (equipList_0==='') {
          throw new OmitedError(block,'equipList_0','equip_m');
        }
        var equipList_1 = Blockly.JavaScript.statementToCode(block, 'equipList_1');
        if (equipList_1==='') {
          throw new OmitedError(block,'equipList_1','equip_m');
        }
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','equip_m');
        }
        var action_1 = Blockly.JavaScript.statementToCode(block, 'action_1');
        if (action_1==='') {
          throw new OmitedError(block,'action_1','equip_m');
        }
        if (!/^\d+$/.test(EvalString_0)) {
            EvalString_0 = '"' + EvalString_0 + '"';
        }
        IdString_0 = IdString_0 && (', "animate": "'+IdString_0+'"');
        if (action_0.trim()) action_0 = ', "equipEvent": [\n' + action_0 + ']';
        if (action_1.trim()) action_1 = ', "unequipEvent": [\n' + action_1 + ']';
        var code = '{"type": '+EvalString_0+IdString_0+', "value": {\n'+equipList_0+'\n}, "percentage": {\n'+equipList_1+'\n}'+action_0+action_1+'}';
        return code;
      },
      "args": [
        "EvalString_0",
        "IdString_0",
        "equipList_0",
        "equipList_1",
        "action_0",
        "action_1"
      ],
      "argsType": ["field","field","statement","statement","statement","statement"],
      "argsGrammarName": ["EvalString","IdString","equipList","equipList","action","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('equip_m',keyOrIndex);
      },
      "menu": [],
      "allAnimates": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('equip_m',inputs,isShadow,comment);
      }
    },
    "equipKnown": {
      "type": "statement",
      "json": {
        "type": "equipKnown",
        "message0": "%1 : %2",
        "args0": [
          Object.assign({},MotaActionBlocks.Equip_List,{
            "name": "Equip_List_0",
            "default": "atk"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": 10
          })
        ],
        "inputsInline": true,
        "tooltip": "装备项",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "equipKnown",
        "nextStatement": MotaActionBlocks.equipList
      },
      "generFunc": function(block) {
        var Equip_List_0 = block.getFieldValue('Equip_List_0');
        Equip_List_0 = MotaActionFunctions.pre('Equip_List')(Equip_List_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','equipKnown');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        if (!/^[+-]?\d+(\.\d+)?$/.test(EvalString_0)) EvalString_0 = '"' + EvalString_0 + '"';
        return '"'+Equip_List_0+'": '+EvalString_0+', ';
      },
      "args": [
        "Equip_List_0",
        "EvalString_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["Equip_List","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('equipKnown',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('equipKnown',inputs,isShadow,comment);
      }
    },
    "equipUnknown": {
      "type": "statement",
      "json": {
        "type": "equipUnknown",
        "message0": "%1 : %2",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "speed"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": 10
          })
        ],
        "inputsInline": true,
        "tooltip": "装备项",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "equipUnknown",
        "nextStatement": MotaActionBlocks.equipList
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','equipUnknown');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','equipUnknown');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        if (!/^[+-]?\d+(\.\d+)?$/.test(EvalString_1)) EvalString_1 = '"' + EvalString_1 + '"';
        return '"'+EvalString_0+'": '+EvalString_1+', ';
      },
      "args": [
        "EvalString_0",
        "EvalString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["EvalString","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('equipUnknown',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('equipUnknown',inputs,isShadow,comment);
      }
    },
    "equipEmpty": {
      "type": "statement",
      "json": {
        "type": "equipEmpty",
        "message0": "",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 70,
        "previousStatement": "equipEmpty",
        "nextStatement": MotaActionBlocks.equipList
      },
      "generFunc": function(block) {
        var code = ' \n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('equipEmpty',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('equipEmpty',inputs,isShadow,comment);
      }
    },
    "floorImage_m": {
      "type": "statement",
      "json": {
        "type": "floorImage_m",
        "message0": "楼层贴图 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "floorImageList_0",
            "check": MotaActionBlocks.floorImageList
          }
        ],
        "tooltip": "楼层贴图",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var floorImageList_0 = Blockly.JavaScript.statementToCode(block, 'floorImageList_0');
        if (floorImageList_0==='') {
          throw new OmitedError(block,'floorImageList_0','floorImage_m');
        }
        var code = '[\n'+floorImageList_0+']\n';
        return code;
      },
      "args": [
        "floorImageList_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["floorImageList"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('floorImage_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('floorImage_m',inputs,isShadow,comment);
      }
    },
    "floorOneImage": {
      "type": "statement",
      "json": {
        "type": "floorOneImage",
        "message0": "图片名 %1 翻转 %2 图层 %3 绘制坐标 x %4 y %5 初始禁用 %6 %7 裁剪起点坐标 x %8 y %9 宽 %10 高 %11 帧数 %12",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "bg.jpg"
          }),
          Object.assign({},MotaActionBlocks.Reverse_List,{
            "name": "Reverse_List_0",
            "default": "null"
          }),
          Object.assign({},MotaActionBlocks.Bg_Fg2_List,{
            "name": "Bg_Fg2_List_0",
            "default": "bg"
          }),
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_0",
            "text": 0
          }),
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_1",
            "text": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_3",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_4",
            "text": ""
          })
        ],
        "tooltip": "楼层贴图",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "floorOneImage",
        "nextStatement": MotaActionBlocks.floorImageList
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','floorOneImage');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Reverse_List_0 = block.getFieldValue('Reverse_List_0');
        Reverse_List_0 = MotaActionFunctions.pre('Reverse_List')(Reverse_List_0);
        var Bg_Fg2_List_0 = block.getFieldValue('Bg_Fg2_List_0');
        Bg_Fg2_List_0 = MotaActionFunctions.pre('Bg_Fg2_List')(Bg_Fg2_List_0);
        var NInt_0 = block.getFieldValue('NInt_0');
        if (NInt_0==='') {
          throw new OmitedError(block,'NInt_0','floorOneImage');
        }
        NInt_0 = MotaActionFunctions.pre('NInt')(NInt_0);
        var NInt_1 = block.getFieldValue('NInt_1');
        if (NInt_1==='') {
          throw new OmitedError(block,'NInt_1','floorOneImage');
        }
        NInt_1 = MotaActionFunctions.pre('NInt')(NInt_1);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var IntString_1 = block.getFieldValue('IntString_1');
        IntString_1 = MotaActionFunctions.pre('IntString')(IntString_1);
        var IntString_2 = block.getFieldValue('IntString_2');
        IntString_2 = MotaActionFunctions.pre('IntString')(IntString_2);
        var IntString_3 = block.getFieldValue('IntString_3');
        IntString_3 = MotaActionFunctions.pre('IntString')(IntString_3);
        var IntString_4 = block.getFieldValue('IntString_4');
        IntString_4 = MotaActionFunctions.pre('IntString')(IntString_4);
        if (Reverse_List_0 && Reverse_List_0 != 'null') {
            Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
        } else Reverse_List_0 = '';
        Bool_0 = Bool_0 ? (', "disable": true') : '';
        IntString_0 = IntString_0 && (', "sx": '+IntString_0);
        IntString_1 = IntString_1 && (', "sy": '+IntString_1);
        IntString_2 = IntString_2 && (', "w": '+IntString_2);
        IntString_3 = IntString_3 && (', "h": '+IntString_3);
        IntString_4 = IntString_4 && (', "frame": '+IntString_4);
        return '{"name": "'+EvalString_0+'"'+Reverse_List_0+', "canvas": "'+Bg_Fg2_List_0+'", "x": '+NInt_0+', "y": '+NInt_1+Bool_0+IntString_0+IntString_1+IntString_2+IntString_3+IntString_4+'},\n';
      },
      "args": [
        "EvalString_0",
        "Reverse_List_0",
        "Bg_Fg2_List_0",
        "NInt_0",
        "NInt_1",
        "Bool_0",
        "IntString_0",
        "IntString_1",
        "IntString_2",
        "IntString_3",
        "IntString_4"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","Reverse_List","Bg_Fg2_List","NInt","NInt","Bool","IntString","IntString","IntString","IntString","IntString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('floorOneImage',keyOrIndex);
      },
      "menu": [],
      "allImages": "['EvalString_0']",
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('floorOneImage',inputs,isShadow,comment);
      }
    },
    "floorEmptyImage": {
      "type": "statement",
      "json": {
        "type": "floorEmptyImage",
        "message0": "",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 70,
        "previousStatement": "floorEmptyImage",
        "nextStatement": MotaActionBlocks.floorImageList
      },
      "generFunc": function(block) {
        var code = ' \n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('floorEmptyImage',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('floorEmptyImage',inputs,isShadow,comment);
      }
    },
    "doorInfo_m": {
      "type": "statement",
      "json": {
        "type": "doorInfo_m",
        "message0": "门信息 开关门时间 %1 开门音效 %2 关门音效 %3 %4 需要钥匙 %5 如需撞到开门还需要把图块触发器改成 openDoor %6 开门后事件 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 160
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "door.mp3"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "door.mp3"
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "doorKeyList_0",
            "check": MotaActionBlocks.doorKeyList
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "开门信息",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var doorKeyList_0 = Blockly.JavaScript.statementToCode(block, 'doorKeyList_0');
        if (doorKeyList_0==='') {
          throw new OmitedError(block,'doorKeyList_0','doorInfo_m');
        }
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','doorInfo_m');
        }
        EvalString_0 = EvalString_0 && (', "openSound": "' + EvalString_0 + '"');
        EvalString_1 = EvalString_1 && (', "closeSound": "' + EvalString_1 + '"');
        if (action_0.trim()) action_0 = ', "afterOpenDoor": [\n' + action_0 + ']';
        var code = '{"time": '+Int_0+EvalString_0+EvalString_1+', "keys": {\n'+doorKeyList_0+'\n}'+action_0.trim()+'}';
        return code;
      },
      "args": [
        "Int_0",
        "EvalString_0",
        "EvalString_1",
        "doorKeyList_0",
        "action_0"
      ],
      "argsType": ["field","field","field","statement","statement"],
      "argsGrammarName": ["Int","EvalString","EvalString","doorKeyList","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('doorInfo_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('doorInfo_m',inputs,isShadow,comment);
      }
    },
    "doorKeyKnown": {
      "type": "statement",
      "json": {
        "type": "doorKeyKnown",
        "message0": "%1 : %2 需要但不消耗 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.Key_List,{
            "name": "Key_List_0",
            "default": "yellowKey"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 1
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "开门需要钥匙",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "doorKeyKnown",
        "nextStatement": MotaActionBlocks.doorKeyList
      },
      "generFunc": function(block) {
        var Key_List_0 = block.getFieldValue('Key_List_0');
        Key_List_0 = MotaActionFunctions.pre('Key_List')(Key_List_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if (Bool_0) Key_List_0 += ':o';
        return '"'+Key_List_0+'": '+Int_0+', ';
      },
      "args": [
        "Key_List_0",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["Key_List","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('doorKeyKnown',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('doorKeyKnown',inputs,isShadow,comment);
      }
    },
    "doorKeyUnknown": {
      "type": "statement",
      "json": {
        "type": "doorKeyUnknown",
        "message0": "%1 : %2 需要但不消耗 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "orangeKey"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 1
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "开门需要钥匙",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "doorKeyUnknown",
        "nextStatement": MotaActionBlocks.doorKeyList
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','doorKeyUnknown');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if (Bool_0) IdString_0 += ':o';
        return '"'+IdString_0+'": '+Int_0+', ';
      },
      "args": [
        "IdString_0",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["IdString","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('doorKeyUnknown',keyOrIndex);
      },
      "menu": [],
      "allItems": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('doorKeyUnknown',inputs,isShadow,comment);
      }
    },
    "doorKeyEmpty": {
      "type": "statement",
      "json": {
        "type": "doorKeyEmpty",
        "message0": "",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 70,
        "previousStatement": "doorKeyEmpty",
        "nextStatement": MotaActionBlocks.doorKeyList
      },
      "generFunc": function(block) {
        var code = ' \n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('doorKeyEmpty',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('doorKeyEmpty',inputs,isShadow,comment);
      }
    },
    "faceIds_m": {
      "type": "statement",
      "json": {
        "type": "faceIds_m",
        "message0": "行走图朝向: %1 向下ID %2 向左ID %3 向右ID %4 向上ID %5",
        "args0": [
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_3",
            "text": ""
          })
        ],
        "tooltip": "行走图朝向",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var IdString_1 = block.getFieldValue('IdString_1');
        IdString_1 = MotaActionFunctions.pre('IdString')(IdString_1);
        var IdString_2 = block.getFieldValue('IdString_2');
        IdString_2 = MotaActionFunctions.pre('IdString')(IdString_2);
        var IdString_3 = block.getFieldValue('IdString_3');
        IdString_3 = MotaActionFunctions.pre('IdString')(IdString_3);
        return '{' + [
            IdString_0 && ('"down": "' + IdString_0 +'"'),
            IdString_1 && ('"left": "' + IdString_1 +'"'),
            IdString_2 && ('"right": "' + IdString_2 +'"'),
            IdString_3 && ('"up": "' + IdString_3 +'"'),
        ].filter(function (x) { return x; }).join(', ') + '}\n';
      },
      "args": [
        "IdString_0",
        "IdString_1",
        "IdString_2",
        "IdString_3"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["IdString","IdString","IdString","IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('faceIds_m',keyOrIndex);
      },
      "menu": [],
      "allIds": "['IdString_0','IdString_1','IdString_2','IdString_3']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('faceIds_m',inputs,isShadow,comment);
      }
    },
    "mainStyle_m": {
      "type": "statement",
      "json": {
        "type": "mainStyle_m",
        "message0": "主要样式设置： 标题界面背景图： %1 %2 竖屏标题界面背景图： %3 %4 标题样式；可写 display: none 隐藏标题 %5 %6 标题按钮样式： %7 %8 横屏状态栏背景；url(...) 0 0/100% 100% no-repeat 可将图片拉伸自适配 %9 %10 %11 竖屏状态栏背景： %12 %13 竖屏工具栏背景： %14 %15 楼层切换样式： %16 %17 状态栏颜色 %18 %19 边框颜色 %20 %21 %22 选中框颜色 %23 %24 全局字体 %25",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "project/images/bg.jpg"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "project/images/bg.jpg"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_2",
            "text": "color: white"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_3",
            "text": "background-color: #32369F; opacity: 0.85; color: #FFFFFF; border: #FFFFFF 2px solid; caret-color: #FFD700;"
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_4",
            "text": "url(project/materials/ground.png) repeat"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_5",
            "text": "url(project/materials/ground.png) repeat"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_6",
            "text": "url(project/materials/ground.png) repeat"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_7",
            "text": "background-color: black; color: white"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": "255,255,255,1"
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_1",
            "text": "204,204,204,1"
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_1",
            "colour": "rgba(204,204,204,1)"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_2",
            "text": "255,215,0,1"
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_2",
            "colour": "rgba(255,215,0,1)"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_8",
            "text": "Verdana"
          })
        ],
        "tooltip": "主要样式设置",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','mainStyle_m');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','mainStyle_m');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var EvalString_2 = block.getFieldValue('EvalString_2');
        if (EvalString_2==='') {
          throw new OmitedError(block,'EvalString_2','mainStyle_m');
        }
        EvalString_2 = MotaActionFunctions.pre('EvalString')(EvalString_2);
        var EvalString_3 = block.getFieldValue('EvalString_3');
        if (EvalString_3==='') {
          throw new OmitedError(block,'EvalString_3','mainStyle_m');
        }
        EvalString_3 = MotaActionFunctions.pre('EvalString')(EvalString_3);
        var EvalString_4 = block.getFieldValue('EvalString_4');
        if (EvalString_4==='') {
          throw new OmitedError(block,'EvalString_4','mainStyle_m');
        }
        EvalString_4 = MotaActionFunctions.pre('EvalString')(EvalString_4);
        var EvalString_5 = block.getFieldValue('EvalString_5');
        if (EvalString_5==='') {
          throw new OmitedError(block,'EvalString_5','mainStyle_m');
        }
        EvalString_5 = MotaActionFunctions.pre('EvalString')(EvalString_5);
        var EvalString_6 = block.getFieldValue('EvalString_6');
        if (EvalString_6==='') {
          throw new OmitedError(block,'EvalString_6','mainStyle_m');
        }
        EvalString_6 = MotaActionFunctions.pre('EvalString')(EvalString_6);
        var EvalString_7 = block.getFieldValue('EvalString_7');
        if (EvalString_7==='') {
          throw new OmitedError(block,'EvalString_7','mainStyle_m');
        }
        EvalString_7 = MotaActionFunctions.pre('EvalString')(EvalString_7);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        if (ColorString_0==='') {
          throw new OmitedError(block,'ColorString_0','mainStyle_m');
        }
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var ColorString_1 = block.getFieldValue('ColorString_1');
        if (ColorString_1==='') {
          throw new OmitedError(block,'ColorString_1','mainStyle_m');
        }
        ColorString_1 = MotaActionFunctions.pre('ColorString')(ColorString_1);
        var Colour_1 = block.getFieldValue('Colour_1');
        Colour_1 = MotaActionFunctions.pre('Colour')(Colour_1);
        var ColorString_2 = block.getFieldValue('ColorString_2');
        if (ColorString_2==='') {
          throw new OmitedError(block,'ColorString_2','mainStyle_m');
        }
        ColorString_2 = MotaActionFunctions.pre('ColorString')(ColorString_2);
        var Colour_2 = block.getFieldValue('Colour_2');
        Colour_2 = MotaActionFunctions.pre('Colour')(Colour_2);
        var EvalString_8 = block.getFieldValue('EvalString_8');
        if (EvalString_8==='') {
          throw new OmitedError(block,'EvalString_8','mainStyle_m');
        }
        EvalString_8 = MotaActionFunctions.pre('EvalString')(EvalString_8);
        var code = {
            startBackground: EvalString_0,
            startVerticalBackground: EvalString_1,
            startLogoStyle: EvalString_2,
            startButtonsStyle: EvalString_3,
            statusLeftBackground: EvalString_4,
            statusTopBackground: EvalString_5,
            toolsBackground: EvalString_6,
            floorChangingStyle: EvalString_7,
            statusBarColor: JSON.parse('['+ColorString_0+']'),
            borderColor: JSON.parse('['+ColorString_1+']'),
            selectColor: JSON.parse('['+ColorString_2+']'),
            font: EvalString_8
        };
        return JSON.stringify(code);
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "EvalString_2",
        "EvalString_3",
        "EvalString_4",
        "EvalString_5",
        "EvalString_6",
        "EvalString_7",
        "ColorString_0",
        "Colour_0",
        "ColorString_1",
        "Colour_1",
        "ColorString_2",
        "Colour_2",
        "EvalString_8"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","EvalString","EvalString","EvalString","EvalString","EvalString","EvalString","ColorString","Colour","ColorString","Colour","ColorString","Colour","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('mainStyle_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('mainStyle_m',inputs,isShadow,comment);
      }
    },
    "nameMap_m": {
      "type": "statement",
      "json": {
        "type": "nameMap_m",
        "message0": "文件别名设置 （可以游戏中使用此别名代替原始文件名） %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "nameMapList_0",
            "check": MotaActionBlocks.nameMapList
          }
        ],
        "tooltip": "文件别名设置",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var nameMapList_0 = Blockly.JavaScript.statementToCode(block, 'nameMapList_0');
        if (nameMapList_0==='') {
          throw new OmitedError(block,'nameMapList_0','nameMap_m');
        }
        var value = nameMapList_0.trim();
        if (value.startsWith(',')) value = value.substring(1);
        return '{'+value+'}';
      },
      "args": [
        "nameMapList_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["nameMapList"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('nameMap_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('nameMap_m',inputs,isShadow,comment);
      }
    },
    "nameMapBgm": {
      "type": "statement",
      "json": {
        "type": "nameMapBgm",
        "message0": "映射背景音乐 名称 %1 映射到文件 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "背景音乐"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "bgm.mp3"
          })
        ],
        "inputsInline": true,
        "tooltip": "映射背景音乐",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "nameMapBgm",
        "nextStatement": MotaActionBlocks.nameMapList
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','nameMapBgm');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','nameMapBgm');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        return ',"'+EvalString_0+'":"'+EvalString_1+'"';
      },
      "args": [
        "EvalString_0",
        "EvalString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["EvalString","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('nameMapBgm',keyOrIndex);
      },
      "menu": [],
      "allBgms": "['EvalString_1']",
      "material": "[\"./project/bgms/\", \"EvalString_1\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('nameMapBgm',inputs,isShadow,comment);
      }
    },
    "nameMapSoundKnown": {
      "type": "statement",
      "json": {
        "type": "nameMapSoundKnown",
        "message0": "映射系统音效 名称 %1 映射到文件 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.NameMap_List,{
            "name": "NameMap_List_0",
            "default": "确定"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "confirm.mp3"
          })
        ],
        "inputsInline": true,
        "tooltip": "映射系统音效",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "nameMapSoundKnown",
        "nextStatement": MotaActionBlocks.nameMapList
      },
      "generFunc": function(block) {
        var NameMap_List_0 = block.getFieldValue('NameMap_List_0');
        NameMap_List_0 = MotaActionFunctions.pre('NameMap_List')(NameMap_List_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','nameMapSoundKnown');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        return ',"'+NameMap_List_0+'":"'+EvalString_0+'"';
      },
      "args": [
        "NameMap_List_0",
        "EvalString_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["NameMap_List","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('nameMapSoundKnown',keyOrIndex);
      },
      "menu": [],
      "allSounds": "['EvalString_0']",
      "material": "[\"./project/sounds/\", \"EvalString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('nameMapSoundKnown',inputs,isShadow,comment);
      }
    },
    "nameMapSoundUnknown": {
      "type": "statement",
      "json": {
        "type": "nameMapSoundUnknown",
        "message0": "映射音效 名称 %1 映射到文件 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "攻击"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "attack.mp3"
          })
        ],
        "inputsInline": true,
        "tooltip": "映射音效",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "nameMapSoundUnknown",
        "nextStatement": MotaActionBlocks.nameMapList
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','nameMapSoundUnknown');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','nameMapSoundUnknown');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        return ',"'+EvalString_0+'":"'+EvalString_1+'"';
      },
      "args": [
        "EvalString_0",
        "EvalString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["EvalString","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('nameMapSoundUnknown',keyOrIndex);
      },
      "menu": [],
      "allSounds": "['EvalString_1']",
      "material": "[\"./project/sounds/\", \"EvalString_1\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('nameMapSoundUnknown',inputs,isShadow,comment);
      }
    },
    "nameMapImage": {
      "type": "statement",
      "json": {
        "type": "nameMapImage",
        "message0": "映射图片 名称 %1 映射到文件 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "背景图"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "bg.jpg"
          })
        ],
        "inputsInline": true,
        "tooltip": "映射图片",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "nameMapImage",
        "nextStatement": MotaActionBlocks.nameMapList
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','nameMapImage');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','nameMapImage');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        return ',"'+EvalString_0+'":"'+EvalString_1+'"';
      },
      "args": [
        "EvalString_0",
        "EvalString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["EvalString","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('nameMapImage',keyOrIndex);
      },
      "menu": [],
      "allImages": "['EvalString_1']",
      "material": "[\"./project/images/:images\", \"EvalString_1\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('nameMapImage',inputs,isShadow,comment);
      }
    },
    "nameMapAnimate": {
      "type": "statement",
      "json": {
        "type": "nameMapAnimate",
        "message0": "映射动画 名称 %1 映射到文件 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "领域"
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "zone"
          })
        ],
        "inputsInline": true,
        "tooltip": "映射图片",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "nameMapAnimate",
        "nextStatement": MotaActionBlocks.nameMapList
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','nameMapAnimate');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','nameMapAnimate');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        return ',"'+EvalString_0+'":"'+IdString_0+'"';
      },
      "args": [
        "EvalString_0",
        "IdString_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["EvalString","IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('nameMapAnimate',keyOrIndex);
      },
      "menu": [],
      "allAnimates": "['IdString_0']",
      "material": "[\"./project/animates/\", \"IdString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('nameMapAnimate',inputs,isShadow,comment);
      }
    },
    "nameMapUnknown": {
      "type": "statement",
      "json": {
        "type": "nameMapUnknown",
        "message0": "未知映射 名称 %1 映射到文件 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "文件名"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "file.jpg"
          })
        ],
        "inputsInline": true,
        "tooltip": "未知映射",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "nameMapUnknown",
        "nextStatement": MotaActionBlocks.nameMapList
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','nameMapUnknown');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','nameMapUnknown');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        return ',"'+EvalString_0+'":"'+EvalString_1+'"';
      },
      "args": [
        "EvalString_0",
        "EvalString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["EvalString","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('nameMapUnknown',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('nameMapUnknown',inputs,isShadow,comment);
      }
    },
    "nameMapEmpty": {
      "type": "statement",
      "json": {
        "type": "nameMapEmpty",
        "message0": "",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 70,
        "previousStatement": "nameMapEmpty",
        "nextStatement": MotaActionBlocks.nameMapList
      },
      "generFunc": function(block) {
        return ' \n';
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('nameMapEmpty',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('nameMapEmpty',inputs,isShadow,comment);
      }
    },
    "splitImages_m": {
      "type": "statement",
      "json": {
        "type": "splitImages_m",
        "message0": "图片切分（你可以将一张png格式的大图切分为若干小图） %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "splitImagesList_0",
            "check": MotaActionBlocks.splitImagesList
          }
        ],
        "tooltip": "图片裁剪",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250
      },
      "generFunc": function(block) {
        var splitImagesList_0 = Blockly.JavaScript.statementToCode(block, 'splitImagesList_0');
        if (splitImagesList_0==='') {
          throw new OmitedError(block,'splitImagesList_0','splitImages_m');
        }
        var code = '[\n'+splitImagesList_0+']\n';
        return code;
      },
      "args": [
        "splitImagesList_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["splitImagesList"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('splitImages_m',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('splitImages_m',inputs,isShadow,comment);
      }
    },
    "splitImagesOne": {
      "type": "statement",
      "json": {
        "type": "splitImagesOne",
        "message0": "图片切分项 图片名 %1 每个小图宽度 %2 高度 %3 生成小图的前缀 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "hero.png"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 32
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_1",
            "value": 32
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "hero_"
          })
        ],
        "inputsInline": true,
        "tooltip": "图片裁剪项",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "splitImagesOne",
        "nextStatement": MotaActionBlocks.splitImagesList
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','splitImagesOne');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Int_1 = block.getFieldValue('Int_1');
        Int_1 = MotaActionFunctions.pre('Int')(Int_1);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','splitImagesOne');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var code = '{"name": "'+EvalString_0+'", "width": '+Int_0+', "height": '+Int_1+', "prefix": "'+EvalString_1+'"},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "Int_0",
        "Int_1",
        "EvalString_1"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["EvalString","Int","Int","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('splitImagesOne',keyOrIndex);
      },
      "menu": [],
      "material": "[\"./project/images/:images\", \"EvalString_0\"]",
      "allImages": "['EvalString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('splitImagesOne',inputs,isShadow,comment);
      }
    },
    "splitImagesEmpty": {
      "type": "statement",
      "json": {
        "type": "splitImagesEmpty",
        "message0": "",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 70,
        "previousStatement": "splitImagesEmpty",
        "nextStatement": MotaActionBlocks.splitImagesList
      },
      "generFunc": function(block) {
        var code = ' \n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('splitImagesEmpty',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('splitImagesEmpty',inputs,isShadow,comment);
      }
    },
    "text_0_s": {
      "type": "statement",
      "json": {
        "type": "text_0_s",
        "message0": "显示文章 : %1",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": "欢迎使用事件编辑器(双击方块可直接预览)"
          })
        ],
        "inputsInline": true,
        "tooltip": "text：显示一段文字（剧情）",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "text_0_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        if (EvalString_Multi_0==='') {
          throw new OmitedError(block,'EvalString_Multi_0','text_0_s');
        }
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var code = '"'+EvalString_Multi_0+'"';
        if (block.isCollapsed() || !block.isEnabled()) {
            code = '{"type": "text", "text": '+code;
            if (block.isCollapsed()) code += ', "_collapsed": true';
            if (!block.isEnabled()) code += ', "_disabled": true';
            code += '}';
        }
        return code+',\n';
      },
      "args": [
        "EvalString_Multi_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["EvalString_Multi"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('text_0_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('text_0_s',inputs,isShadow,comment);
      }
    },
    "text_1_s": {
      "type": "statement",
      "json": {
        "type": "text_1_s",
        "message0": "标题 %1 图像 %2 对话框效果 %3 起点 px %4 py %5 宽 %6 编号 %7 不等待操作 %8 %9 %10",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "小妖精"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "fairy"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": "欢迎使用事件编辑器(双击方块可直接预览)"
          })
        ],
        "tooltip": "text：显示一段文字（剧情）,选项较多请右键点击帮助",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "text_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var EvalString_2 = block.getFieldValue('EvalString_2');
        EvalString_2 = MotaActionFunctions.pre('EvalString')(EvalString_2);
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        if (EvalString_Multi_0==='') {
          throw new OmitedError(block,'EvalString_Multi_0','text_1_s');
        }
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var title='';
        if (EvalString_0==''){
            if (EvalString_1=='' )title='';
            else title='\\t['+EvalString_1+']';
        } else {
            if (EvalString_1=='')title='\\t['+EvalString_0+']';
            else title='\\t['+EvalString_0+','+EvalString_1+']';
        }
        var pos = '';
        if (PosString_0 || PosString_1) {
            if (EvalString_2) throw new Error('对话框效果和起点像素位置只能设置一项！');
            pos = '[' + (PosString_0||0) + ',' + (PosString_1||0);
            if (PosString_2) pos += ',' + PosString_2;
            pos += ']';
        }
        if(EvalString_2 && !(/^(up|center|down|hero|this)(,(hero|null|\d+,\d+|\d+))?$/.test(EvalString_2))) {
          throw new Error('对话框效果的用法请右键点击帮助');
        }
        EvalString_2 = EvalString_2 && ('\\b['+EvalString_2+']');
        var code =  '"'+title+EvalString_2+EvalString_Multi_0+'"';
        if (block.isCollapsed() || !block.isEnabled() || pos || Int_0 || Bool_0) {
            code = '{"type": "text", "text": '+code;
            if (pos) code += ', "pos": ' + pos;
            if (Int_0) code += ', "code": ' + Int_0;
            if (Bool_0) code += ', "async": true';
            if (block.isCollapsed()) code += ', "_collapsed": true';
            if (!block.isEnabled()) code += ', "_disabled": true';
            code += '}';
        }
        return code+',\n';
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "EvalString_2",
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "Int_0",
        "Bool_0",
        "EvalString_Multi_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","EvalString","PosString","PosString","PosString","Int","Bool","EvalString_Multi"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('text_1_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "allIds": "['EvalString_1']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('text_1_s',inputs,isShadow,comment);
      }
    },
    "text_2_s": {
      "type": "statement",
      "json": {
        "type": "text_2_s",
        "message0": "标题 %1 图像 %2 对话框效果 %3 起点 px %4 py %5 宽 %6 编号 %7 不等待操作 %8 %9 %10 %11 %12",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "小妖精"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "fairy"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": "欢迎使用事件编辑器(双击方块可直接预览)"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0"
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "textDrawingList_0",
            "check": MotaActionBlocks.textDrawingList
          }
        ],
        "tooltip": "text：显示一段文字（剧情）,选项较多请右键点击帮助",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "text_2_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var EvalString_2 = block.getFieldValue('EvalString_2');
        EvalString_2 = MotaActionFunctions.pre('EvalString')(EvalString_2);
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        if (EvalString_Multi_0==='') {
          throw new OmitedError(block,'EvalString_Multi_0','text_2_s');
        }
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var textDrawingList_0 = Blockly.JavaScript.statementToCode(block, 'textDrawingList_0');
        var title='';
        if (EvalString_0==''){
            if (EvalString_1=='' )title='';
            else title='\\t['+EvalString_1+']';
        } else {
            if (EvalString_1=='')title='\\t['+EvalString_0+']';
            else title='\\t['+EvalString_0+','+EvalString_1+']';
        }
        var pos = '';
        if (PosString_0 || PosString_1) {
            if (EvalString_2) throw new Error('对话框效果和起点像素位置只能设置一项！');
            pos = '[' + (PosString_0||0) + ',' + (PosString_1||0);
            if (PosString_2) pos += ',' + PosString_2;
            pos += ']';
        }
        if(EvalString_2 && !(/^(up|center|down|hero|this)(,(hero|null|\d+,\d+|\d+))?$/.test(EvalString_2))) {
          throw new Error('对话框效果的用法请右键点击帮助');
        }
        EvalString_2 = EvalString_2 && ('\\b['+EvalString_2+']');
        var code =  '"'+title+EvalString_2+textDrawingList_0.replace(/\s/g, '')+EvalString_Multi_0+'"';
        if (block.isCollapsed() || !block.isEnabled() || pos || Int_0 || Bool_0) {
            code = '{"type": "text", "text": '+code;
            if (pos) code += ', "pos": ' + pos;
            if (Int_0) code += ', "code": ' + Int_0;
            if (Bool_0) code += ', "async": true';
            if (block.isCollapsed()) code += ', "_collapsed": true';
            if (!block.isEnabled()) code += ', "_disabled": true';
            code += '}';
        }
        return code+',\n';
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "EvalString_2",
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "Int_0",
        "Bool_0",
        "EvalString_Multi_0",
        "textDrawingList_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field","statement"],
      "argsGrammarName": ["EvalString","EvalString","EvalString","PosString","PosString","PosString","Int","Bool","EvalString_Multi","textDrawingList"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('text_2_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "allIds": "['EvalString_1']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('text_2_s',inputs,isShadow,comment);
      }
    },
    "textDrawing": {
      "type": "statement",
      "json": {
        "type": "textDrawing",
        "message0": "立绘 %1 翻转 %2 绘制坐标 x %3 y %4 宽 %5 高 %6 %7 裁剪坐标 x %8 y %9 宽 %10 高 %11 不透明度 %12 旋转角度 %13",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "fairy.png"
          }),
          Object.assign({},MotaActionBlocks.Reverse_List,{
            "name": "Reverse_List_0",
            "default": "null"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_3",
            "text": ""
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_4",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_5",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_6",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_7",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_8",
            "text": ""
          })
        ],
        "tooltip": "立绘",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250,
        "previousStatement": "textDrawing",
        "nextStatement": MotaActionBlocks.textDrawingList
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','textDrawing');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Reverse_List_0 = block.getFieldValue('Reverse_List_0');
        Reverse_List_0 = MotaActionFunctions.pre('Reverse_List')(Reverse_List_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        if (IntString_0==='') {
          throw new OmitedError(block,'IntString_0','textDrawing');
        }
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var IntString_1 = block.getFieldValue('IntString_1');
        if (IntString_1==='') {
          throw new OmitedError(block,'IntString_1','textDrawing');
        }
        IntString_1 = MotaActionFunctions.pre('IntString')(IntString_1);
        var IntString_2 = block.getFieldValue('IntString_2');
        IntString_2 = MotaActionFunctions.pre('IntString')(IntString_2);
        var IntString_3 = block.getFieldValue('IntString_3');
        IntString_3 = MotaActionFunctions.pre('IntString')(IntString_3);
        var IntString_4 = block.getFieldValue('IntString_4');
        IntString_4 = MotaActionFunctions.pre('IntString')(IntString_4);
        var IntString_5 = block.getFieldValue('IntString_5');
        IntString_5 = MotaActionFunctions.pre('IntString')(IntString_5);
        var IntString_6 = block.getFieldValue('IntString_6');
        IntString_6 = MotaActionFunctions.pre('IntString')(IntString_6);
        var IntString_7 = block.getFieldValue('IntString_7');
        IntString_7 = MotaActionFunctions.pre('IntString')(IntString_7);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IntString_8 = block.getFieldValue('IntString_8');
        IntString_8 = MotaActionFunctions.pre('IntString')(IntString_8);
        if (Reverse_List_0 && Reverse_List_0 != 'null') EvalString_0 += Reverse_List_0;
        var list = [EvalString_0, IntString_0, IntString_1];
        if (IntString_2 || IntString_3) {
            if (list.length != 3 || !IntString_2 || !IntString_3) {
                throw "绘制的宽和高需同时设置";
            }
            list.push(IntString_2);
            list.push(IntString_3);
        }
        if (IntString_4 || IntString_5 || IntString_6 || IntString_7) {
            if (list.length != 5) throw "如设置裁剪区域，请先设置绘制区域的宽高";
            if (!IntString_4 || !IntString_5 || !IntString_6 || !IntString_7) {
                throw "如设置裁剪区域，请同时设置全部的裁剪坐标和宽高";
            }
            list.splice(1, 0, IntString_4, IntString_5, IntString_6, IntString_7);
        }
        if (EvalString_1) {
            if (list.length != 9) throw "如设置不透明度，需填满所有坐标和宽高";
            var opacity = parseFloat(EvalString_1);
            if (isNaN(opacity) || opacity < 0 || opacity > 1) throw "不合法的不透明度，必须是0到1之间"
            list.push(opacity);
        }
        if (IntString_8) {
            if (list.length != 10) throw "如设置旋转角度，需填满所有坐标和宽高，以及不透明度";
            list.push(IntString_8);
        }
        return "\\f[" + list.join(",")+"]";
      },
      "args": [
        "EvalString_0",
        "Reverse_List_0",
        "IntString_0",
        "IntString_1",
        "IntString_2",
        "IntString_3",
        "IntString_4",
        "IntString_5",
        "IntString_6",
        "IntString_7",
        "EvalString_1",
        "IntString_8"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","Reverse_List","IntString","IntString","IntString","IntString","IntString","IntString","IntString","IntString","EvalString","IntString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('textDrawing',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "allImages": "['EvalString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('textDrawing',inputs,isShadow,comment);
      }
    },
    "textDrawingEmpty": {
      "type": "statement",
      "json": {
        "type": "textDrawingEmpty",
        "message0": "",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 70,
        "previousStatement": "textDrawingEmpty",
        "nextStatement": MotaActionBlocks.textDrawingList
      },
      "generFunc": function(block) {
        var code = '';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('textDrawingEmpty',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('textDrawingEmpty',inputs,isShadow,comment);
      }
    },
    "moveTextBox_s": {
      "type": "statement",
      "json": {
        "type": "moveTextBox_s",
        "message0": "移动对话框 : %1 px %2 py %3 使用增量 %4 移动方式 %5 动画时间 %6 不等待执行完毕 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 1
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.MoveMode_List,{
            "name": "MoveMode_List_0",
            "default": ""
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_1",
            "value": 500
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "移动对话框",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "moveTextBox_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','moveTextBox_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','moveTextBox_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var MoveMode_List_0 = block.getFieldValue('MoveMode_List_0');
        MoveMode_List_0 = MotaActionFunctions.pre('MoveMode_List')(MoveMode_List_0);
        var Int_1 = block.getFieldValue('Int_1');
        Int_1 = MotaActionFunctions.pre('Int')(Int_1);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
        Bool_0 = Bool_0 ?', "relative": true':'';
        Bool_1 = Bool_1 ?', "async": true':'';
        var code = '{"type": "moveTextBox", "code": '+Int_0+', "loc": ['+PosString_0+','+PosString_1+']'+Bool_0+MoveMode_List_0+', "time": '+Int_1+Bool_1+'},\n';
        return code;
      },
      "args": [
        "Int_0",
        "PosString_0",
        "PosString_1",
        "Bool_0",
        "MoveMode_List_0",
        "Int_1",
        "Bool_1"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["Int","PosString","PosString","Bool","MoveMode_List","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('moveTextBox_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('moveTextBox_s',inputs,isShadow,comment);
      }
    },
    "clearTextBox_s": {
      "type": "statement",
      "json": {
        "type": "clearTextBox_s",
        "message0": "清除对话框 : %1",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "1"
          })
        ],
        "inputsInline": true,
        "tooltip": "清除对话框",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "clearTextBox_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        if (EvalString_0 && !/^\d+(,\d+)*$/.test(EvalString_0)) throw new Error('对话框编号需要以逗号分隔');
        EvalString_0 = EvalString_0 ? (', "code": ['+EvalString_0+']') : '';
        var code = '{"type": "clearTextBox"'+EvalString_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('clearTextBox_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('clearTextBox_s',inputs,isShadow,comment);
      }
    },
    "comment_s": {
      "type": "statement",
      "json": {
        "type": "comment_s",
        "message0": "添加注释 : %1",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": "可以在这里写添加任何注释内容"
          })
        ],
        "inputsInline": true,
        "tooltip": "comment：添加一段会被游戏跳过的注释内容",
        "helpUrl": "/_docs/#/instruction",
        "colour": 285,
        "previousStatement": "comment_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        if (EvalString_Multi_0==='') {
          throw new OmitedError(block,'EvalString_Multi_0','comment_s');
        }
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var code = '{"type": "comment", "text": "'+EvalString_Multi_0+'"},\n';
        return code;
      },
      "args": [
        "EvalString_Multi_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["EvalString_Multi"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('comment_s',keyOrIndex);
      },
      "menu": [],
      "doubleclicktext": "EvalString_Multi_0",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('comment_s',inputs,isShadow,comment);
      }
    },
    "autoText_s": {
      "type": "statement",
      "json": {
        "type": "autoText_s",
        "message0": "自动剧情文本: 标题 %1 图像 %2 对话框效果 %3 时间 %4 %5 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "小妖精"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "fairy"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 3000
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": "用户无法跳过自动剧情文本，大段剧情文本请添加“是否跳过剧情”的提示"
          })
        ],
        "tooltip": "autoText：自动剧情文本,用户无法跳过自动剧情文本,大段剧情文本请添加“是否跳过剧情”的提示",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "autoText_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var EvalString_2 = block.getFieldValue('EvalString_2');
        EvalString_2 = MotaActionFunctions.pre('EvalString')(EvalString_2);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        if (EvalString_Multi_0==='') {
          throw new OmitedError(block,'EvalString_Multi_0','autoText_s');
        }
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var title='';
        if (EvalString_0==''){
            if (EvalString_1=='' )title='';
            else title='\\t['+EvalString_1+']';
        } else {
            if (EvalString_1=='')title='\\t['+EvalString_0+']';
            else title='\\t['+EvalString_0+','+EvalString_1+']';
        }
        if(EvalString_2 && !(/^(up|center|down|hero|this)(,(hero|null|\d+,\d+|\d+))?$/.test(EvalString_2))) {
          throw new Error('对话框效果的用法请右键点击帮助');
        }
        EvalString_2 = EvalString_2 && ('\\b['+EvalString_2+']');
        var code =  '{"type": "autoText", "text": "'+title+EvalString_2+EvalString_Multi_0+'", "time": '+Int_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "EvalString_2",
        "Int_0",
        "EvalString_Multi_0"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","EvalString","Int","EvalString_Multi"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('autoText_s',keyOrIndex);
      },
      "menu": [],
      "doubleclicktext": "EvalString_Multi_0",
      "allIds": "['EvalString_1']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('autoText_s',inputs,isShadow,comment);
      }
    },
    "scrollText_s": {
      "type": "statement",
      "json": {
        "type": "scrollText_s",
        "message0": "滚动剧情文本: 时间 %1 行距 %2 不等待执行完毕 %3 %4 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 5000
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_0",
            "value": 1.4
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": "时间是总时间，可以使用setText事件来控制字体、颜色、大小、偏移量等"
          })
        ],
        "tooltip": "scrollText：滚动剧情文本，将从下到上进行滚动显示。",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "scrollText_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Number_0 = block.getFieldValue('Number_0');
        Number_0 = MotaActionFunctions.pre('Number')(Number_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        if (EvalString_Multi_0==='') {
          throw new OmitedError(block,'EvalString_Multi_0','scrollText_s');
        }
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        Bool_0 = Bool_0?', "async": true':'';
        var code =  '{"type": "scrollText", "text": "'+EvalString_Multi_0+'"'+Bool_0+', "time" :'+Int_0+', "lineHeight": '+Number_0+'},\n';
        return code;
      },
      "args": [
        "Int_0",
        "Number_0",
        "Bool_0",
        "EvalString_Multi_0"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["Int","Number","Bool","EvalString_Multi"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('scrollText_s',keyOrIndex);
      },
      "menu": [],
      "doubleclicktext": "EvalString_Multi_0",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('scrollText_s',inputs,isShadow,comment);
      }
    },
    "setText_s": {
      "type": "statement",
      "json": {
        "type": "setText_s",
        "message0": "设置剧情文本的属性 位置 %1 偏移像素 %2 对齐 %3 粗体 %4 %5 标题颜色 %6 %7 正文颜色 %8 %9 背景色 %10 %11 %12 标题大小 %13 正文大小 %14 行距 %15 打字间隔 %16 字符间距 %17 淡入淡出时间 %18",
        "args0": [
          Object.assign({},MotaActionBlocks.SetTextPosition_List,{
            "name": "SetTextPosition_List_0"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.TextAlign_List,{
            "name": "TextAlign_List_0"
          }),
          Object.assign({},MotaActionBlocks.B_1_List,{
            "name": "B_1_List_0"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_1",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_2",
            "colour": "rgba(255,255,255,1)"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_3",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_4",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_5",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_6",
            "text": ""
          })
        ],
        "tooltip": "setText：设置剧情文本的属性,颜色为RGB三元组或RGBA四元组,打字间隔为剧情文字添加的时间间隔,为整数或不填，字符间距为字符之间的距离，为整数或不填。",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "setText_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var SetTextPosition_List_0 = block.getFieldValue('SetTextPosition_List_0');
        SetTextPosition_List_0 = MotaActionFunctions.pre('SetTextPosition_List')(SetTextPosition_List_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var TextAlign_List_0 = block.getFieldValue('TextAlign_List_0');
        TextAlign_List_0 = MotaActionFunctions.pre('TextAlign_List')(TextAlign_List_0);
        var B_1_List_0 = block.getFieldValue('B_1_List_0');
        B_1_List_0 = MotaActionFunctions.pre('B_1_List')(B_1_List_0);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var ColorString_1 = block.getFieldValue('ColorString_1');
        ColorString_1 = MotaActionFunctions.pre('ColorString')(ColorString_1);
        var Colour_1 = block.getFieldValue('Colour_1');
        Colour_1 = MotaActionFunctions.pre('Colour')(Colour_1);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Colour_2 = block.getFieldValue('Colour_2');
        Colour_2 = MotaActionFunctions.pre('Colour')(Colour_2);
        var IntString_1 = block.getFieldValue('IntString_1');
        IntString_1 = MotaActionFunctions.pre('IntString')(IntString_1);
        var IntString_2 = block.getFieldValue('IntString_2');
        IntString_2 = MotaActionFunctions.pre('IntString')(IntString_2);
        var IntString_3 = block.getFieldValue('IntString_3');
        IntString_3 = MotaActionFunctions.pre('IntString')(IntString_3);
        var IntString_4 = block.getFieldValue('IntString_4');
        IntString_4 = MotaActionFunctions.pre('IntString')(IntString_4);
        var IntString_5 = block.getFieldValue('IntString_5');
        IntString_5 = MotaActionFunctions.pre('IntString')(IntString_5);
        var IntString_6 = block.getFieldValue('IntString_6');
        IntString_6 = MotaActionFunctions.pre('IntString')(IntString_6);
        SetTextPosition_List_0 =SetTextPosition_List_0==='null'?'': ', "position": "'+SetTextPosition_List_0+'"';
        TextAlign_List_0 = TextAlign_List_0==='null'?'': ', "align": "'+TextAlign_List_0+'"';
        var colorRe = MotaActionFunctions.pattern.colorRe;
        IntString_0 = IntString_0 ? (', "offset": '+IntString_0) : '';
        ColorString_0 = ColorString_0 ? (', "title": ['+ColorString_0+']') : '';
        ColorString_1 = ColorString_1 ? (', "text": ['+ColorString_1+']') : '';
        if (EvalString_0) {
          if (colorRe.test(EvalString_0)) {
            EvalString_0 = ', "background": ['+EvalString_0+']';
          }
          else if (/^\w+\.png$/.test(EvalString_0)) {
            EvalString_0 = ', "background": "'+EvalString_0+'"';
          }
          else {
            throw new Error('背景格式错误,必须是形如0~255,0~255,0~255,0~1的颜色，或一个WindowSkin的png图片名称');
          }
        }
        IntString_1 = IntString_1 ? (', "titlefont": '+IntString_1) : '';
        IntString_2 = IntString_2 ? (', "textfont": '+IntString_2) : '';
        IntString_3 = IntString_3 ? (', "lineHeight": '+IntString_3) : '';
        IntString_4 = IntString_4 ? (', "time": '+IntString_4) : '';
        IntString_5 = IntString_5 ? (', "letterSpacing": '+IntString_5) : '';
        IntString_6 = IntString_6 ? (', "animateTime": ' + IntString_6) : '';
        B_1_List_0 = B_1_List_0==='null'?'':', "bold": '+B_1_List_0;
        var code = '{"type": "setText"'+SetTextPosition_List_0+IntString_0+TextAlign_List_0+B_1_List_0+ColorString_0+ColorString_1+EvalString_0+IntString_1+IntString_2+IntString_3+IntString_4+IntString_5+IntString_6+'},\n';
        return code;
      },
      "args": [
        "SetTextPosition_List_0",
        "IntString_0",
        "TextAlign_List_0",
        "B_1_List_0",
        "ColorString_0",
        "Colour_0",
        "ColorString_1",
        "Colour_1",
        "EvalString_0",
        "Colour_2",
        "IntString_1",
        "IntString_2",
        "IntString_3",
        "IntString_4",
        "IntString_5",
        "IntString_6"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["SetTextPosition_List","IntString","TextAlign_List","B_1_List","ColorString","Colour","ColorString","Colour","EvalString","Colour","IntString","IntString","IntString","IntString","IntString","IntString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setText_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setText_s',inputs,isShadow,comment);
      }
    },
    "tip_s": {
      "type": "statement",
      "json": {
        "type": "tip_s",
        "message0": "显示提示 : %1 图标ID %2",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "这段话将在左上角以气泡形式显示"
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "tip：显示一段提示文字",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "tip_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','tip_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        IdString_0 = IdString_0 && (', "icon": "' + IdString_0 + '"');
        var code = '{"type": "tip", "text": "'+EvalString_0+'"'+IdString_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "IdString_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["EvalString","IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('tip_s',keyOrIndex);
      },
      "menu": [],
      "allIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('tip_s',inputs,isShadow,comment);
      }
    },
    "setValue_s": {
      "type": "statement",
      "json": {
        "type": "setValue_s",
        "message0": "数值操作 : 名称 %1 %2 %3 不刷新状态栏 %4",
        "args0": [
          {
            "type": "input_value",
            "name": "idString_e_0",
            "check": "idString_e"
          },
          Object.assign({},MotaActionBlocks.AssignOperator_List,{
            "name": "AssignOperator_List_0",
            "default": ""
          }),
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "setValue：设置勇士的某个属性、道具个数, 或某个变量/Flag的值",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "setValue_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var idString_e_0 = Blockly.JavaScript.valueToCode(block, 'idString_e_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (idString_e_0==='') {
          throw new OmitedError(block,'idString_e_0','setValue_s');
        }
        var AssignOperator_List_0 = block.getFieldValue('AssignOperator_List_0');
        AssignOperator_List_0 = MotaActionFunctions.pre('AssignOperator_List')(AssignOperator_List_0);
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','setValue_s');
        }
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if (AssignOperator_List_0 && AssignOperator_List_0 != '=') {
          AssignOperator_List_0 = ', "operator": "' + AssignOperator_List_0 + '"';
        } else AssignOperator_List_0 = '';
        Bool_0 = Bool_0 ? ', "norefresh": true' : '';
        var code = '{"type": "setValue", "name": "'+idString_e_0+'"'+AssignOperator_List_0+', "value": "'+expression_0+'"' + Bool_0 + '},\n';
        return code;
      },
      "args": [
        "idString_e_0",
        "AssignOperator_List_0",
        "expression_0",
        "Bool_0"
      ],
      "argsType": ["value","field","value","field"],
      "argsGrammarName": ["idString_e","AssignOperator_List","expression","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setValue_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setValue_s',inputs,isShadow,comment);
      }
    },
    "setEnemy_s": {
      "type": "statement",
      "json": {
        "type": "setEnemy_s",
        "message0": "设置怪物属性 : 怪物ID %1 的 %2 %3 %4 不刷新显伤 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "greenSlime"
          }),
          Object.assign({},MotaActionBlocks.EnemyId_List,{
            "name": "EnemyId_List_0",
            "default": "atk"
          }),
          Object.assign({},MotaActionBlocks.AssignOperator_List,{
            "name": "AssignOperator_List_0",
            "default": "="
          }),
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "setEnemy：设置某个怪物的属性",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "setEnemy_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','setEnemy_s');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var EnemyId_List_0 = block.getFieldValue('EnemyId_List_0');
        EnemyId_List_0 = MotaActionFunctions.pre('EnemyId_List')(EnemyId_List_0);
        var AssignOperator_List_0 = block.getFieldValue('AssignOperator_List_0');
        AssignOperator_List_0 = MotaActionFunctions.pre('AssignOperator_List')(AssignOperator_List_0);
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','setEnemy_s');
        }
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if (AssignOperator_List_0 && AssignOperator_List_0 != '=') {
          AssignOperator_List_0 = ', "operator": "' + AssignOperator_List_0 + '"';
        } else AssignOperator_List_0 = '';
        Bool_0 = Bool_0 ? ', "norefresh": true' : '';
        var code = '{"type": "setEnemy", "id": "'+IdString_0+'", "name": "'+EnemyId_List_0+'"'+AssignOperator_List_0+', "value": "'+expression_0+'"'+Bool_0+'},\n';
        return code;
      },
      "args": [
        "IdString_0",
        "EnemyId_List_0",
        "AssignOperator_List_0",
        "expression_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","value","field"],
      "argsGrammarName": ["IdString","EnemyId_List","AssignOperator_List","expression","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setEnemy_s',keyOrIndex);
      },
      "menu": [],
      "allEnemys": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setEnemy_s',inputs,isShadow,comment);
      }
    },
    "setEquip_s": {
      "type": "statement",
      "json": {
        "type": "setEquip_s",
        "message0": "设置装备属性 : 装备ID %1 %2 的 %3 %4 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "sword1"
          }),
          Object.assign({},MotaActionBlocks.EquipValueType_List,{
            "name": "EquipValueType_List_0",
            "default": "value"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "atk"
          }),
          Object.assign({},MotaActionBlocks.AssignOperator_List,{
            "name": "AssignOperator_List_0",
            "default": "="
          }),
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          }
        ],
        "inputsInline": true,
        "tooltip": "setEquip：设置某个怪物的属性",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "setEquip_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','setEquip_s');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var EquipValueType_List_0 = block.getFieldValue('EquipValueType_List_0');
        EquipValueType_List_0 = MotaActionFunctions.pre('EquipValueType_List')(EquipValueType_List_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','setEquip_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var AssignOperator_List_0 = block.getFieldValue('AssignOperator_List_0');
        AssignOperator_List_0 = MotaActionFunctions.pre('AssignOperator_List')(AssignOperator_List_0);
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','setEquip_s');
        }
        EquipValueType_List_0 = EquipValueType_List_0 == 'percentage' ? ', "valueType": "percentage"' : ', "valueType": "value"';
        if (AssignOperator_List_0 && AssignOperator_List_0 != '=') {
          AssignOperator_List_0 = ', "operator": "' + AssignOperator_List_0 + '"';
        } else AssignOperator_List_0 = '';
        var code = '{"type": "setEquip", "id": "'+IdString_0+'"'+EquipValueType_List_0+', "name": "'+EvalString_0+'"'+AssignOperator_List_0+', "value": "'+expression_0+'"},\n';
        return code;
      },
      "args": [
        "IdString_0",
        "EquipValueType_List_0",
        "EvalString_0",
        "AssignOperator_List_0",
        "expression_0"
      ],
      "argsType": ["field","field","field","field","value"],
      "argsGrammarName": ["IdString","EquipValueType_List","EvalString","AssignOperator_List","expression"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setEquip_s',keyOrIndex);
      },
      "menu": [],
      "allEquips": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setEquip_s',inputs,isShadow,comment);
      }
    },
    "setEnemyOnPoint_s": {
      "type": "statement",
      "json": {
        "type": "setEnemyOnPoint_s",
        "message0": "设置某点怪物属性 : x %1 , y %2 楼层 %3 的 %4 %5 %6 不刷新显伤 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EnemyPoint_List,{
            "name": "EnemyPoint_List_0",
            "default": "atk"
          }),
          Object.assign({},MotaActionBlocks.AssignOperator_List,{
            "name": "AssignOperator_List_0",
            "default": "="
          }),
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "setEnemyOnPoint：设置某个点上怪物的属性",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "setEnemyOnPoint_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var EnemyPoint_List_0 = block.getFieldValue('EnemyPoint_List_0');
        EnemyPoint_List_0 = MotaActionFunctions.pre('EnemyPoint_List')(EnemyPoint_List_0);
        var AssignOperator_List_0 = block.getFieldValue('AssignOperator_List_0');
        AssignOperator_List_0 = MotaActionFunctions.pre('AssignOperator_List')(AssignOperator_List_0);
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','setEnemyOnPoint_s');
        }
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
        if (AssignOperator_List_0 && AssignOperator_List_0 != '=') {
          AssignOperator_List_0 = ', "operator": "' + AssignOperator_List_0 + '"';
        } else AssignOperator_List_0 = '';
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        Bool_0 = Bool_0 ? ', "norefresh": true' : '';
        var code = '{"type": "setEnemyOnPoint"'+floorstr+IdString_0+', "name": "'+EnemyPoint_List_0+'"'+AssignOperator_List_0+', "value": "'+expression_0+'"'+Bool_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "IdString_0",
        "EnemyPoint_List_0",
        "AssignOperator_List_0",
        "expression_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","value","field"],
      "argsGrammarName": ["EvalString","EvalString","IdString","EnemyPoint_List","AssignOperator_List","expression","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setEnemyOnPoint_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"EvalString_0\", \"EvalString_1\", \"IdString_0\"]",
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setEnemyOnPoint_s',inputs,isShadow,comment);
      }
    },
    "resetEnemyOnPoint_s": {
      "type": "statement",
      "json": {
        "type": "resetEnemyOnPoint_s",
        "message0": "重置某点怪物属性 : x %1 , y %2 楼层 %3 不刷新显伤 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "resetEnemyOnPoint：重置某个点上怪物的属性",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "resetEnemyOnPoint_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        Bool_0 = Bool_0 ? ', "norefresh": true' : '';
        var code = '{"type": "resetEnemyOnPoint"'+floorstr+IdString_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "IdString_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","IdString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('resetEnemyOnPoint_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"EvalString_0\", \"EvalString_1\", \"IdString_0\"]",
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('resetEnemyOnPoint_s',inputs,isShadow,comment);
      }
    },
    "moveEnemyOnPoint_s": {
      "type": "statement",
      "json": {
        "type": "moveEnemyOnPoint_s",
        "message0": "移动某点怪物属性 : 起点 x %1 , y %2 终点 x %3 y %4 楼层 %5 不刷新显伤 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "moveEnemyOnPoint：移动某个点上怪物的属性到其他点",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "moveEnemyOnPoint_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        var floorstr = PosString_0 && PosString_1 ? ', "from": ['+PosString_0+','+PosString_1+']' : '';
        if (PosString_2 && PosString_3) floorstr += ', "to": ['+PosString_2+','+PosString_3+']'
        Bool_0 = Bool_0 ? ', "norefresh": true' : '';
        var code = '{"type": "moveEnemyOnPoint"'+floorstr+IdString_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "IdString_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","IdString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('moveEnemyOnPoint_s',keyOrIndex);
      },
      "menu": [['选择起点位置','editor_blockly.selectPoint(block,["PosString_0", "PosString_1"])']],
      "allFloorIds": "['IdString_0']",
      "selectPoint": "[\"PosString_2\", \"PosString_3\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('moveEnemyOnPoint_s',inputs,isShadow,comment);
      }
    },
    "moveEnemyOnPoint_1_s": {
      "type": "statement",
      "json": {
        "type": "moveEnemyOnPoint_1_s",
        "message0": "移动某点怪物属性 : 起点 x %1 , y %2 增量 dx %3 dy %4 楼层 %5 不刷新显伤 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "moveEnemyOnPoint：移动某个点上怪物的属性到其他点",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "moveEnemyOnPoint_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        var floorstr = PosString_0 && PosString_1 ? ', "from": ['+PosString_0+','+PosString_1+']' : '';
        if (PosString_2 && PosString_3) floorstr += ', "dxy": ['+PosString_2+','+PosString_3+']'
        Bool_0 = Bool_0 ? ', "norefresh": true' : '';
        var code = '{"type": "moveEnemyOnPoint"'+floorstr+IdString_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "IdString_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","IdString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('moveEnemyOnPoint_1_s',keyOrIndex);
      },
      "menu": [],
      "allFloorIds": "['IdString_0']",
      "selectPoint": "[\"PosString_0\", \"PosString_1\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('moveEnemyOnPoint_1_s',inputs,isShadow,comment);
      }
    },
    "setFloor_s": {
      "type": "statement",
      "json": {
        "type": "setFloor_s",
        "message0": "设置楼层属性 : %1 楼层名 %2 为 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.Floor_Meta_List,{
            "name": "Floor_Meta_List_0",
            "default": "title"
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.JsonEvalString,{
            "name": "JsonEvalString_0",
            "text": "\"新楼层名\""
          })
        ],
        "inputsInline": true,
        "tooltip": "setFloor：设置楼层属性；该楼层属性和编辑器中的楼层属性一一对应",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "setFloor_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Floor_Meta_List_0 = block.getFieldValue('Floor_Meta_List_0');
        Floor_Meta_List_0 = MotaActionFunctions.pre('Floor_Meta_List')(Floor_Meta_List_0);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var JsonEvalString_0 = block.getFieldValue('JsonEvalString_0');
        if (JsonEvalString_0==='') {
          throw new OmitedError(block,'JsonEvalString_0','setFloor_s');
        }
        JsonEvalString_0 = MotaActionFunctions.pre('JsonEvalString')(JsonEvalString_0);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        var code = '{"type": "setFloor", "name": "'+Floor_Meta_List_0+'"'+IdString_0+', "value": '+JsonEvalString_0+'},\n';
        return code;
      },
      "args": [
        "Floor_Meta_List_0",
        "IdString_0",
        "JsonEvalString_0"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["Floor_Meta_List","IdString","JsonEvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setFloor_s',keyOrIndex);
      },
      "menu": [],
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setFloor_s',inputs,isShadow,comment);
      }
    },
    "setGlobalAttribute_s": {
      "type": "statement",
      "json": {
        "type": "setGlobalAttribute_s",
        "message0": "设置全局属性 : %1 为 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.Global_Attribute_List,{
            "name": "Global_Attribute_List_0",
            "default": "font"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "Verdana"
          })
        ],
        "inputsInline": true,
        "tooltip": "setGlobalAttribute：设置全局属性",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "setGlobalAttribute_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Global_Attribute_List_0 = block.getFieldValue('Global_Attribute_List_0');
        Global_Attribute_List_0 = MotaActionFunctions.pre('Global_Attribute_List')(Global_Attribute_List_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','setGlobalAttribute_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var code = '{"type": "setGlobalAttribute", "name": "'+Global_Attribute_List_0+'", "value": "'+EvalString_0+'"},\n';
        return code;
      },
      "args": [
        "Global_Attribute_List_0",
        "EvalString_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["Global_Attribute_List","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setGlobalAttribute_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setGlobalAttribute_s',inputs,isShadow,comment);
      }
    },
    "setGlobalValue_s": {
      "type": "statement",
      "json": {
        "type": "setGlobalValue_s",
        "message0": "设置全局数值 : %1 为 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.Global_Value_List,{
            "name": "Global_Value_List_0",
            "default": "lavaDamage"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "100"
          })
        ],
        "inputsInline": true,
        "tooltip": "setGlobalValue：设置全局属性",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "setGlobalValue_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Global_Value_List_0 = block.getFieldValue('Global_Value_List_0');
        Global_Value_List_0 = MotaActionFunctions.pre('Global_Value_List')(Global_Value_List_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','setGlobalValue_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var code = '{"type": "setGlobalValue", "name": "'+Global_Value_List_0+'", "value": '+EvalString_0+'},\n';
        return code;
      },
      "args": [
        "Global_Value_List_0",
        "EvalString_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["Global_Value_List","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setGlobalValue_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setGlobalValue_s',inputs,isShadow,comment);
      }
    },
    "setGlobalFlag_s": {
      "type": "statement",
      "json": {
        "type": "setGlobalFlag_s",
        "message0": "设置系统开关 : %1 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.Global_Flag_List,{
            "name": "Global_Flag_List_0",
            "default": "s:enableFloor"
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": "true"
          })
        ],
        "inputsInline": true,
        "tooltip": "setGlobalFlag：设置系统开关",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "setGlobalFlag_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Global_Flag_List_0 = block.getFieldValue('Global_Flag_List_0');
        Global_Flag_List_0 = MotaActionFunctions.pre('Global_Flag_List')(Global_Flag_List_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var code = '{"type": "setGlobalFlag", "name": "'+Global_Flag_List_0+'", "value": '+Bool_0+'},\n';
        return code;
      },
      "args": [
        "Global_Flag_List_0",
        "Bool_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["Global_Flag_List","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setGlobalFlag_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setGlobalFlag_s',inputs,isShadow,comment);
      }
    },
    "setNameMap_s": {
      "type": "statement",
      "json": {
        "type": "setNameMap_s",
        "message0": "设置文件别名 : %1 为 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "背景音乐"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "setNameMap：设置文件别名",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "setNameMap_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','setNameMap_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        EvalString_1 = EvalString_1 ? (', "value": "' + EvalString_1 + '"') : '';
        var code = '{"type": "setNameMap", "name": "'+EvalString_0+'"'+EvalString_1+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["EvalString","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setNameMap_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setNameMap_s',inputs,isShadow,comment);
      }
    },
    "show_s": {
      "type": "statement",
      "json": {
        "type": "show_s",
        "message0": "显示事件 x %1 , y %2 楼层 %3 动画时间 %4 不等待执行完毕 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "show: 将禁用事件启用,楼层和动画时间可不填,xy可用逗号分隔表示多个点",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "show_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        Bool_0 = Bool_0 ?', "async": true':'';
        var code = '{"type": "show"'+floorstr+IdString_0+''+IntString_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "IdString_0",
        "IntString_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","IdString","IntString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('show_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"EvalString_0\", \"EvalString_1\", \"IdString_0\"]",
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('show_s',inputs,isShadow,comment);
      }
    },
    "hide_s": {
      "type": "statement",
      "json": {
        "type": "hide_s",
        "message0": "隐藏事件 x %1 , y %2 楼层 %3 同时删除 %4 动画时间 %5 不等待执行完毕 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": true
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "hide: 隐藏事件，同时可删除",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "hide_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        Bool_0 = Bool_0 ?', "remove": true':'';
        Bool_1 = Bool_1 ?', "async": true':'';
        var code = '{"type": "hide"'+floorstr+IdString_0+Bool_0+IntString_0+Bool_1+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "IdString_0",
        "Bool_0",
        "IntString_0",
        "Bool_1"
      ],
      "argsType": ["field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","IdString","Bool","IntString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('hide_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"EvalString_0\", \"EvalString_1\", \"IdString_0\"]",
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('hide_s',inputs,isShadow,comment);
      }
    },
    "setBlockOpacity_s": {
      "type": "statement",
      "json": {
        "type": "setBlockOpacity_s",
        "message0": "设置图块不透明度 x %1 , y %2 楼层 %3 不透明度 %4 动画时间 %5 不等待执行完毕 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_0",
            "value": 1
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "setBlockOpacity: 设置图块不透明度",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "setBlockOpacity_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Number_0 = block.getFieldValue('Number_0');
        Number_0 = MotaActionFunctions.pre('Number')(Number_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
        if (Number_0 < 0 || Number_0 > 1) throw new Error('不透明度需要在0~1之间');
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        Bool_0 = Bool_0 ?', "async": true':'';
        var code = '{"type": "setBlockOpacity"'+floorstr+IdString_0+', "opacity": '+Number_0+IntString_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "IdString_0",
        "Number_0",
        "IntString_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","IdString","Number","IntString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setBlockOpacity_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"EvalString_0\", \"EvalString_1\", \"IdString_0\"]",
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setBlockOpacity_s',inputs,isShadow,comment);
      }
    },
    "setBlockFilter_s": {
      "type": "statement",
      "json": {
        "type": "setBlockFilter_s",
        "message0": "设置图块特效 x %1 , y %2 楼层 %3 虚化 %4 色相 %5 灰度 %6 反色 %7 阴影 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_1",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_2",
            "value": 0
          })
        ],
        "inputsInline": true,
        "tooltip": "setBlockFilter: 设置图块特效",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "setBlockFilter_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Number_0 = block.getFieldValue('Number_0');
        Number_0 = MotaActionFunctions.pre('Number')(Number_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Number_1 = block.getFieldValue('Number_1');
        Number_1 = MotaActionFunctions.pre('Number')(Number_1);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Number_2 = block.getFieldValue('Number_2');
        Number_2 = MotaActionFunctions.pre('Number')(Number_2);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
        if (Number_0 < 0) throw '虚化不得小于0；0为完全没有虚化';
        if (Int_0 < 0 || Int_0 >= 360) throw '色相需要在0~359之间';
        if (Number_1 < 0 || Number_1 > 1) throw '灰度需要在0~1之间';
        if (Number_2 < 0) throw '阴影不得小于0；0为完全没有阴影';
        
        var code = '{"type": "setBlockFilter"'+floorstr+IdString_0+', "blur": '+Number_0+', "hue": '+Int_0+', "grayscale": '+Number_1+', "invert": '+Bool_0+', "shadow": '+Number_2+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "IdString_0",
        "Number_0",
        "Int_0",
        "Number_1",
        "Bool_0",
        "Number_2"
      ],
      "argsType": ["field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","IdString","Number","Int","Number","Bool","Number"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setBlockFilter_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"EvalString_0\", \"EvalString_1\", \"IdString_0\"]",
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setBlockFilter_s',inputs,isShadow,comment);
      }
    },
    "trigger_s": {
      "type": "statement",
      "json": {
        "type": "trigger_s",
        "message0": "触发系统事件 x %1 , y %2",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "trigger: 立即触发另一个地点的事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "trigger_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var floorstr = '';
        if (PosString_0 && PosString_1) {
            floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
        }
        var code = '{"type": "trigger"'+floorstr+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('trigger_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"PosString_0\", \"PosString_1\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('trigger_s',inputs,isShadow,comment);
      }
    },
    "insert_1_s": {
      "type": "statement",
      "json": {
        "type": "insert_1_s",
        "message0": "插入公共事件 %1 参数列表 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "加点事件"
          }),
          Object.assign({},MotaActionBlocks.JsonEvalString,{
            "name": "JsonEvalString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "insert: 插入公共事件并执行",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "insert_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','insert_1_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var JsonEvalString_0 = block.getFieldValue('JsonEvalString_0');
        JsonEvalString_0 = MotaActionFunctions.pre('JsonEvalString')(JsonEvalString_0);
        if (JsonEvalString_0) {
            if (!(JSON.parse(JsonEvalString_0) instanceof Array))
                throw new Error('参数列表必须是个有效的数组！');
            JsonEvalString_0 = ', "args": ' +JsonEvalString_0;
        }
        var code = '{"type": "insert", "name": "'+EvalString_0+'"'+JsonEvalString_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "JsonEvalString_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["EvalString","JsonEvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('insert_1_s',keyOrIndex);
      },
      "menu": [],
      "allEvents": "['EvalString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('insert_1_s',inputs,isShadow,comment);
      }
    },
    "insert_2_s": {
      "type": "statement",
      "json": {
        "type": "insert_2_s",
        "message0": "插入事件 x %1 , y %2 %3 楼层 %4 参数列表 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.Event_List,{
            "name": "Event_List_0"
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.JsonEvalString,{
            "name": "JsonEvalString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "insert: 立即插入另一个地点的事件执行，当前事件不会中断，事件坐标不会改变",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "insert_2_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var Event_List_0 = block.getFieldValue('Event_List_0');
        Event_List_0 = MotaActionFunctions.pre('Event_List')(Event_List_0);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var JsonEvalString_0 = block.getFieldValue('JsonEvalString_0');
        JsonEvalString_0 = MotaActionFunctions.pre('JsonEvalString')(JsonEvalString_0);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        if (JsonEvalString_0) {
            if (!(JSON.parse(JsonEvalString_0) instanceof Array))
                throw new Error('参数列表必须是个有效的数组！');
            JsonEvalString_0 = ', "args": ' +JsonEvalString_0;
        }
        if (Event_List_0 && Event_List_0 !=='null')
            Event_List_0 = ', "which": "'+Event_List_0+'"';
        else Event_List_0 = '';
        var floorstr = '';
        if (PosString_0 && PosString_1) {
            floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
        }
        var code = '{"type": "insert"'+floorstr+Event_List_0+IdString_0+JsonEvalString_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "Event_List_0",
        "IdString_0",
        "JsonEvalString_0"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","Event_List","IdString","JsonEvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('insert_2_s',keyOrIndex);
      },
      "menu": [],
      "allFloorIds": "['IdString_0']",
      "selectPoint": "[\"PosString_0\", \"PosString_1\", \"IdString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('insert_2_s',inputs,isShadow,comment);
      }
    },
    "exit_s": {
      "type": "statement",
      "json": {
        "type": "exit_s",
        "message0": "立刻结束当前事件",
        "inputsInline": true,
        "tooltip": "exit: 立刻结束当前事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "exit_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var code = '{"type": "exit"},\n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('exit_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('exit_s',inputs,isShadow,comment);
      }
    },
    "setBlock_s": {
      "type": "statement",
      "json": {
        "type": "setBlock_s",
        "message0": "转变图块为 %1 x %2 , y %3 楼层 %4 动画时间 %5 不等待执行完毕 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "yellowDoor"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "setBlock：设置某个图块,忽略坐标楼层则为当前事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "setBlock_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','setBlock_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var EvalString_2 = block.getFieldValue('EvalString_2');
        EvalString_2 = MotaActionFunctions.pre('EvalString')(EvalString_2);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_1, EvalString_2);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        IntString_0 = IntString_0 && (', "time": ' + IntString_0);
        Bool_0 = Bool_0 ? (', "async": true') : '';
        var code = '{"type": "setBlock", "number": "'+EvalString_0+'"'+floorstr+IdString_0+IntString_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "EvalString_2",
        "IdString_0",
        "IntString_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","EvalString","IdString","IntString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setBlock_s',keyOrIndex);
      },
      "menu": [],
      "allFloorIds": "['IdString_0']",
      "allIds": "['EvalString_0']",
      "selectPoint": "[\"EvalString_1\", \"EvalString_2\", \"IdString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setBlock_s',inputs,isShadow,comment);
      }
    },
    "turnBlock_s": {
      "type": "statement",
      "json": {
        "type": "turnBlock_s",
        "message0": "事件转向 %1 x %2 , y %3 楼层 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.DirectionEx_List,{
            "name": "DirectionEx_List_0"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "turnBlock：事件转向；自动检索faceIds",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "turnBlock_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var DirectionEx_List_0 = block.getFieldValue('DirectionEx_List_0');
        DirectionEx_List_0 = MotaActionFunctions.pre('DirectionEx_List')(DirectionEx_List_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
        if (DirectionEx_List_0 == 'null') DirectionEx_List_0 = '';
        DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        var code = '{"type": "turnBlock"'+DirectionEx_List_0+floorstr+IdString_0+'},\n';
        return code;
      },
      "args": [
        "DirectionEx_List_0",
        "EvalString_0",
        "EvalString_1",
        "IdString_0"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["DirectionEx_List","EvalString","EvalString","IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('turnBlock_s',keyOrIndex);
      },
      "menu": [],
      "allFloorIds": "['IdString_0']",
      "selectPoint": "[\"EvalString_0\", \"EvalString_1\", \"IdString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('turnBlock_s',inputs,isShadow,comment);
      }
    },
    "showFloorImg_s": {
      "type": "statement",
      "json": {
        "type": "showFloorImg_s",
        "message0": "显示贴图 像素坐标 x %1 , y %2 楼层 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "showFloorImg: 显示一个贴图，xy为左上角坐标，可用逗号分隔表示多个点",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "showFloorImg_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        var code = '{"type": "showFloorImg"'+floorstr+IdString_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "IdString_0"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('showFloorImg_s',keyOrIndex);
      },
      "menu": [],
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('showFloorImg_s',inputs,isShadow,comment);
      }
    },
    "hideFloorImg_s": {
      "type": "statement",
      "json": {
        "type": "hideFloorImg_s",
        "message0": "隐藏贴图 像素坐标 x %1 , y %2 楼层 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "hideFloorImg: 隐藏一个贴图，xy为左上角坐标，可用逗号分隔表示多个点",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "hideFloorImg_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        var code = '{"type": "hideFloorImg"'+floorstr+IdString_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "IdString_0"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('hideFloorImg_s',keyOrIndex);
      },
      "menu": [],
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('hideFloorImg_s',inputs,isShadow,comment);
      }
    },
    "showBgFgMap_s": {
      "type": "statement",
      "json": {
        "type": "showBgFgMap_s",
        "message0": "显示图层块 %1 x %2 , y %3 楼层 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.Bg_Fg_List,{
            "name": "Bg_Fg_List_0",
            "default": "bg"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "showBgFgMap: 显示图层块，即背景图层/前景图层的某些图块，xy为左上角坐标，可用逗号分隔表示多个点",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "showBgFgMap_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bg_Fg_List_0 = block.getFieldValue('Bg_Fg_List_0');
        Bg_Fg_List_0 = MotaActionFunctions.pre('Bg_Fg_List')(Bg_Fg_List_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        var code = '{"type": "showBgFgMap", "name": "' + Bg_Fg_List_0 + '"' +floorstr+IdString_0+'},\n';
        return code;
      },
      "args": [
        "Bg_Fg_List_0",
        "EvalString_0",
        "EvalString_1",
        "IdString_0"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["Bg_Fg_List","EvalString","EvalString","IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('showBgFgMap_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"EvalString_0\", \"EvalString_1\", \"IdString_0\"]",
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('showBgFgMap_s',inputs,isShadow,comment);
      }
    },
    "hideBgFgMap_s": {
      "type": "statement",
      "json": {
        "type": "hideBgFgMap_s",
        "message0": "隐藏图层块 %1 x %2 , y %3 楼层 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.Bg_Fg_List,{
            "name": "Bg_Fg_List_0",
            "default": "bg"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "hideBgFgMap: 隐藏图层块，即背景图层/前景图层的某些图块，xy为左上角坐标，可用逗号分隔表示多个点",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "hideBgFgMap_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bg_Fg_List_0 = block.getFieldValue('Bg_Fg_List_0');
        Bg_Fg_List_0 = MotaActionFunctions.pre('Bg_Fg_List')(Bg_Fg_List_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_0, EvalString_1);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        var code = '{"type": "hideBgFgMap", "name": "' + Bg_Fg_List_0 + '"' +floorstr+IdString_0+'},\n';
        return code;
      },
      "args": [
        "Bg_Fg_List_0",
        "EvalString_0",
        "EvalString_1",
        "IdString_0"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["Bg_Fg_List","EvalString","EvalString","IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('hideBgFgMap_s',keyOrIndex);
      },
      "menu": [],
      "allFloorIds": "['IdString_0']",
      "selectPoint": "[\"EvalString_0\", \"EvalString_1\", \"IdString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('hideBgFgMap_s',inputs,isShadow,comment);
      }
    },
    "setBgFgBlock_s": {
      "type": "statement",
      "json": {
        "type": "setBgFgBlock_s",
        "message0": "转变图层块 %1 为 %2 x %3 , y %4 楼层 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.Bg_Fg_List,{
            "name": "Bg_Fg_List_0",
            "default": "bg"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "yellowDoor"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "setBgFgBlock：设置某个图层块,忽略坐标楼层则为当前点",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "setBgFgBlock_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bg_Fg_List_0 = block.getFieldValue('Bg_Fg_List_0');
        Bg_Fg_List_0 = MotaActionFunctions.pre('Bg_Fg_List')(Bg_Fg_List_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','setBgFgBlock_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var EvalString_2 = block.getFieldValue('EvalString_2');
        EvalString_2 = MotaActionFunctions.pre('EvalString')(EvalString_2);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var floorstr = MotaActionFunctions.processMultiLoc(EvalString_1, EvalString_2);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        var code = '{"type": "setBgFgBlock", "name": "' + Bg_Fg_List_0 + '", "number": "'+EvalString_0+'"'+floorstr+IdString_0+'},\n';
        return code;
      },
      "args": [
        "Bg_Fg_List_0",
        "EvalString_0",
        "EvalString_1",
        "EvalString_2",
        "IdString_0"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["Bg_Fg_List","EvalString","EvalString","EvalString","IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setBgFgBlock_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"EvalString_1\", \"EvalString_2\", \"IdString_0\"]",
      "allIds": "['EvalString_0']",
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setBgFgBlock_s',inputs,isShadow,comment);
      }
    },
    "setHeroIcon_s": {
      "type": "statement",
      "json": {
        "type": "setHeroIcon_s",
        "message0": "更改角色行走图 %1 不重绘 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "hero.png"
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "setHeroIcon：更改角色行走图",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "setHeroIcon_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        EvalString_0 = EvalString_0 && (', "name": "'+EvalString_0+'"');
        Bool_0 = Bool_0 ? (', "noDraw": true') : '';
        var code = '{"type": "setHeroIcon"'+EvalString_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "Bool_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["EvalString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setHeroIcon_s',keyOrIndex);
      },
      "menu": [],
      "allImages": "['EvalString_0']",
      "material": "[\"./project/images/:images\", \"EvalString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setHeroIcon_s',inputs,isShadow,comment);
      }
    },
    "update_s": {
      "type": "statement",
      "json": {
        "type": "update_s",
        "message0": "更新状态栏和地图显伤 不检查自动事件 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "update: 立刻更新状态栏和地图显伤",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "update_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        Bool_0 = Bool_0 ? (', "doNotCheckAutoEvents": true') : ''
        var code = '{"type": "update"'+Bool_0+'},\n';
        return code;
      },
      "args": [
        "Bool_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('update_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('update_s',inputs,isShadow,comment);
      }
    },
    "showStatusBar_s": {
      "type": "statement",
      "json": {
        "type": "showStatusBar_s",
        "message0": "显示状态栏",
        "inputsInline": true,
        "tooltip": "showStatusBar: 显示状态栏",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "showStatusBar_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var code = '{"type": "showStatusBar"},\n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('showStatusBar_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('showStatusBar_s',inputs,isShadow,comment);
      }
    },
    "hideStatusBar_s": {
      "type": "statement",
      "json": {
        "type": "hideStatusBar_s",
        "message0": "隐藏状态栏 不隐藏竖屏工具栏 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "hideStatusBar: 隐藏状态栏",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "hideStatusBar_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        Bool_0 = Bool_0?', "toolbox": true':'';
        var code = '{"type": "hideStatusBar"'+Bool_0+'},\n';
        return code;
      },
      "args": [
        "Bool_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('hideStatusBar_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('hideStatusBar_s',inputs,isShadow,comment);
      }
    },
    "setHeroOpacity_s": {
      "type": "statement",
      "json": {
        "type": "setHeroOpacity_s",
        "message0": "设置勇士不透明度 %1 渐变方式 %2 动画时间 %3 不等待执行完毕 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_0",
            "value": 1
          }),
          Object.assign({},MotaActionBlocks.MoveMode_List,{
            "name": "MoveMode_List_0",
            "default": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "setHeroOpacity: 设置勇士不透明度",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "setHeroOpacity_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Number_0 = block.getFieldValue('Number_0');
        Number_0 = MotaActionFunctions.pre('Number')(Number_0);
        var MoveMode_List_0 = block.getFieldValue('MoveMode_List_0');
        MoveMode_List_0 = MotaActionFunctions.pre('MoveMode_List')(MoveMode_List_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if (Number_0 < 0 || Number_0 > 1) throw new Error('不透明度需要在0~1之间');
        MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
        IntString_0 = IntString_0 && (', "time": ' + IntString_0);
        Bool_0 = Bool_0 ? (', "async": true') : '';
        var code = '{"type": "setHeroOpacity", "opacity": '+Number_0+MoveMode_List_0+IntString_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "Number_0",
        "MoveMode_List_0",
        "IntString_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["Number","MoveMode_List","IntString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setHeroOpacity_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setHeroOpacity_s',inputs,isShadow,comment);
      }
    },
    "sleep_s": {
      "type": "statement",
      "json": {
        "type": "sleep_s",
        "message0": "等待 %1 毫秒 不可被Ctrl跳过 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 500
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "sleep: 等待多少毫秒",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "sleep_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        Bool_0 = Bool_0?', "noSkip": true':'';
        var code = '{"type": "sleep", "time": '+Int_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('sleep_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('sleep_s',inputs,isShadow,comment);
      }
    },
    "battle_s": {
      "type": "statement",
      "json": {
        "type": "battle_s",
        "message0": "强制战斗 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "greenSlime"
          })
        ],
        "inputsInline": true,
        "tooltip": "battle: 强制战斗",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "battle_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','battle_s');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var code = '{"type": "battle", "id": "'+IdString_0+'"},\n';
        return code;
      },
      "args": [
        "IdString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('battle_s',keyOrIndex);
      },
      "menu": [],
      "allEnemys": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('battle_s',inputs,isShadow,comment);
      }
    },
    "battle_1_s": {
      "type": "statement",
      "json": {
        "type": "battle_1_s",
        "message0": "强制战斗 x %1 , y %2",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "battle: 强制战斗",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "battle_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var floorstr = '';
        if (PosString_0 && PosString_1) {
            floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
        }
        var code = '{"type": "battle"'+floorstr+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('battle_1_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"PosString_0\", \"PosString_1\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('battle_1_s',inputs,isShadow,comment);
      }
    },
    "openDoor_s": {
      "type": "statement",
      "json": {
        "type": "openDoor_s",
        "message0": "开门 x %1 , y %2 楼层 %3 需要钥匙 %4 不等待执行完毕 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "openDoor: 开门,楼层可不填表示当前层",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "openDoor_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        IdString_0 = IdString_0 && (', "floorId": "'+IdString_0+'"');
        var floorstr = '';
        if (PosString_0 && PosString_1) {
            floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
        }
        Bool_0 = Bool_0 ? ', "needKey": true' : '';
        Bool_1 = Bool_1 ? ', "async": true' : '';
        var code = '{"type": "openDoor"'+floorstr+IdString_0+Bool_0+Bool_1+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "IdString_0",
        "Bool_0",
        "Bool_1"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","IdString","Bool","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('openDoor_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"PosString_0\", \"PosString_1\", \"IdString_0\"]",
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('openDoor_s',inputs,isShadow,comment);
      }
    },
    "closeDoor_s": {
      "type": "statement",
      "json": {
        "type": "closeDoor_s",
        "message0": "关门 x %1 , y %2 ID %3 不等待执行完毕 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "yellowDoor"
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "closeDoor: 关门事件，需要该点本身无事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "closeDoor_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','closeDoor_s');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var floorstr = '';
        if (PosString_0 && PosString_1) {
            floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
        }
        Bool_0 = Bool_0 ? ', "async": true' : '';
        var code = '{"type": "closeDoor", "id": "'+IdString_0+'"'+floorstr+Bool_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "IdString_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","IdString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('closeDoor_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"PosString_0\", \"PosString_1\"]",
      "allDoors": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('closeDoor_s',inputs,isShadow,comment);
      }
    },
    "changeFloor_s": {
      "type": "statement",
      "json": {
        "type": "changeFloor_s",
        "message0": "楼层切换 %1 %2 %3 x %4 , y %5 朝向 %6 动画时间 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.Floor_List,{
            "name": "Floor_List_0"
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Stair_List,{
            "name": "Stair_List_0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.DirectionEx_List,{
            "name": "DirectionEx_List_0"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "changeFloor: 楼层切换,动画时间可不填",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "changeFloor_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Floor_List_0 = block.getFieldValue('Floor_List_0');
        Floor_List_0 = MotaActionFunctions.pre('Floor_List')(Floor_List_0);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Stair_List_0 = block.getFieldValue('Stair_List_0');
        Stair_List_0 = MotaActionFunctions.pre('Stair_List')(Stair_List_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var DirectionEx_List_0 = block.getFieldValue('DirectionEx_List_0');
        DirectionEx_List_0 = MotaActionFunctions.pre('DirectionEx_List')(DirectionEx_List_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var toFloorId = IdString_0;
        if (Floor_List_0!='floorId') toFloorId = Floor_List_0;
        toFloorId = toFloorId ? (', "floorId": "' + toFloorId +'"') : '';
        var loc = '';
        if (PosString_0 && PosString_1) {
          loc = ', "loc": ['+PosString_0+', '+PosString_1+']';
        }
        if (Stair_List_0===':now') loc = '';
        else if (Stair_List_0!=='loc')loc = ', "stair": "'+Stair_List_0+'"';
        if (DirectionEx_List_0 == 'null') DirectionEx_List_0 = '';
        DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        var code = '{"type": "changeFloor"'+toFloorId+loc+DirectionEx_List_0+IntString_0+' },\n';
        return code;
      },
      "args": [
        "Floor_List_0",
        "IdString_0",
        "Stair_List_0",
        "PosString_0",
        "PosString_1",
        "DirectionEx_List_0",
        "IntString_0"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["Floor_List","IdString","Stair_List","PosString","PosString","DirectionEx_List","IntString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('changeFloor_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"PosString_0\", \"PosString_1\", \"IdString_0\", true]",
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('changeFloor_s',inputs,isShadow,comment);
      }
    },
    "changePos_s": {
      "type": "statement",
      "json": {
        "type": "changePos_s",
        "message0": "位置朝向切换 x %1 , y %2 朝向 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.DirectionEx_List,{
            "name": "DirectionEx_List_0"
          })
        ],
        "inputsInline": true,
        "tooltip": "changePos: 当前位置切换",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "changePos_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var DirectionEx_List_0 = block.getFieldValue('DirectionEx_List_0');
        DirectionEx_List_0 = MotaActionFunctions.pre('DirectionEx_List')(DirectionEx_List_0);
        var loc = (PosString_0 && PosString_1) ? (', "loc": ['+PosString_0+','+PosString_1+']') : '';
        if (DirectionEx_List_0 == 'null') DirectionEx_List_0 = '';
        DirectionEx_List_0 = DirectionEx_List_0 && (', "direction": "'+DirectionEx_List_0+'"');
        var code = '{"type": "changePos"'+loc+DirectionEx_List_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "DirectionEx_List_0"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["PosString","PosString","DirectionEx_List"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('changePos_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"PosString_0\", \"PosString_1\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('changePos_s',inputs,isShadow,comment);
      }
    },
    "useItem_s": {
      "type": "statement",
      "json": {
        "type": "useItem_s",
        "message0": "使用道具 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "pickaxe"
          })
        ],
        "inputsInline": true,
        "tooltip": "useItem: 使用道具",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "useItem_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','useItem_s');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var code = '{"type": "useItem", "id": "'+IdString_0+'"},\n';
        return code;
      },
      "args": [
        "IdString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('useItem_s',keyOrIndex);
      },
      "menu": [],
      "allItems": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('useItem_s',inputs,isShadow,comment);
      }
    },
    "loadEquip_s": {
      "type": "statement",
      "json": {
        "type": "loadEquip_s",
        "message0": "装上装备 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "sword1"
          })
        ],
        "inputsInline": true,
        "tooltip": "loadEquip: 装上装备",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "loadEquip_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','loadEquip_s');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var code = '{"type": "loadEquip", "id": "'+IdString_0+'"},\n';
        return code;
      },
      "args": [
        "IdString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('loadEquip_s',keyOrIndex);
      },
      "menu": [],
      "allEquips": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('loadEquip_s',inputs,isShadow,comment);
      }
    },
    "unloadEquip_s": {
      "type": "statement",
      "json": {
        "type": "unloadEquip_s",
        "message0": "卸下第 %1 格装备孔的装备",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          })
        ],
        "inputsInline": true,
        "tooltip": "unloadEquip: 卸下装备",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "unloadEquip_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var code = '{"type": "unloadEquip", "pos": '+Int_0+'},\n';
        return code;
      },
      "args": [
        "Int_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Int"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('unloadEquip_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('unloadEquip_s',inputs,isShadow,comment);
      }
    },
    "openShop_s": {
      "type": "statement",
      "json": {
        "type": "openShop_s",
        "message0": "启用全局商店 %1 同时打开 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "shop1"
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": true
          })
        ],
        "inputsInline": true,
        "tooltip": "全局商店",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "openShop_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','openShop_s');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        Bool_0 = Bool_0 ? (', "open": true') : '';
        var code = '{"type": "openShop", "id": "'+IdString_0+'"'+Bool_0+'},\n';
        return code;
      },
      "args": [
        "IdString_0",
        "Bool_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["IdString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('openShop_s',keyOrIndex);
      },
      "menu": [],
      "allShops": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('openShop_s',inputs,isShadow,comment);
      }
    },
    "disableShop_s": {
      "type": "statement",
      "json": {
        "type": "disableShop_s",
        "message0": "禁用全局商店 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "shop1"
          })
        ],
        "inputsInline": true,
        "tooltip": "全局商店",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "disableShop_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','disableShop_s');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var code = '{"type": "disableShop", "id": "'+IdString_0+'"},\n';
        return code;
      },
      "args": [
        "IdString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('disableShop_s',keyOrIndex);
      },
      "menu": [],
      "allShops": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('disableShop_s',inputs,isShadow,comment);
      }
    },
    "follow_s": {
      "type": "statement",
      "json": {
        "type": "follow_s",
        "message0": "跟随勇士 行走图 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "npc.png"
          })
        ],
        "inputsInline": true,
        "tooltip": "follow: 跟随勇士",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "follow_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','follow_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var code = '{"type": "follow", "name": "'+EvalString_0+'"},\n';
        return code;
      },
      "args": [
        "EvalString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('follow_s',keyOrIndex);
      },
      "menu": [],
      "allImages": "['EvalString_0']",
      "material": "[\"./project/images/:images\", \"EvalString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('follow_s',inputs,isShadow,comment);
      }
    },
    "unfollow_s": {
      "type": "statement",
      "json": {
        "type": "unfollow_s",
        "message0": "取消跟随 行走图 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "unfollow: 取消跟随",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "unfollow_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        EvalString_0 = EvalString_0 ? (', "name": "' + EvalString_0 + '"') : "";
        var code = '{"type": "unfollow"' + EvalString_0 + '},\n';
        return code;
      },
      "args": [
        "EvalString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('unfollow_s',keyOrIndex);
      },
      "menu": [],
      "allImages": "['EvalString_0']",
      "material": "[\"./project/images/:images\", \"EvalString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('unfollow_s',inputs,isShadow,comment);
      }
    },
    "vibrate_s": {
      "type": "statement",
      "json": {
        "type": "vibrate_s",
        "message0": "画面震动 方向 %1 时间 %2 速度 %3 振幅 %4 不等待执行完毕 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.Vibrate_List,{
            "name": "Vibrate_List_0",
            "default": "horizontal"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 2000
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_1",
            "value": 10
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_2",
            "value": 10
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "vibrate: 画面震动",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "vibrate_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Vibrate_List_0 = block.getFieldValue('Vibrate_List_0');
        Vibrate_List_0 = MotaActionFunctions.pre('Vibrate_List')(Vibrate_List_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Int_1 = block.getFieldValue('Int_1');
        Int_1 = MotaActionFunctions.pre('Int')(Int_1);
        var Int_2 = block.getFieldValue('Int_2');
        Int_2 = MotaActionFunctions.pre('Int')(Int_2);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var async = Bool_0?', "async": true':''
        var code = '{"type": "vibrate", "direction": "'+Vibrate_List_0+'", "time": '+Int_0+', "speed": '+Int_1+', "power": '+Int_2+async+'},\n';
        return code;
      },
      "args": [
        "Vibrate_List_0",
        "Int_0",
        "Int_1",
        "Int_2",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["Vibrate_List","Int","Int","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('vibrate_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('vibrate_s',inputs,isShadow,comment);
      }
    },
    "animate_s": {
      "type": "statement",
      "json": {
        "type": "animate_s",
        "message0": "显示动画 %1 位置 x %2 y %3 相对窗口坐标 %4 不等待执行完毕 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "zone"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "animate：显示动画,位置填hero或者1,2形式的位置,或者不填代表当前事件点",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "animate_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','animate_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        var loc = PosString_0&&PosString_1?(', "loc": ['+PosString_0+','+PosString_1+']'):'';
        Bool_0 = Bool_0?', "alignWindow": true':'';
        Bool_1 = Bool_1?', "async": true':'';
        var code = '{"type": "animate", "name": "'+EvalString_0+'"'+loc+Bool_0+Bool_1+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "PosString_0",
        "PosString_1",
        "Bool_0",
        "Bool_1"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["EvalString","PosString","PosString","Bool","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('animate_s',keyOrIndex);
      },
      "menu": [['选择位置', 'editor_blockly.selectPoint(block, ["PosString_0", "PosString_1"])']],
      "allAnimates": "['EvalString_0']",
      "material": "[\"./project/animates/\", \"EvalString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('animate_s',inputs,isShadow,comment);
      }
    },
    "animate_1_s": {
      "type": "statement",
      "json": {
        "type": "animate_1_s",
        "message0": "显示动画并跟随角色 %1 不等待执行完毕 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "zone"
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "animate：显示动画并跟随角色",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "animate_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','animate_1_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        Bool_0 = Bool_0?', "async": true':'';
        var code = '{"type": "animate", "name": "'+EvalString_0+'", "loc": "hero"'+Bool_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "Bool_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["EvalString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('animate_1_s',keyOrIndex);
      },
      "menu": [],
      "allAnimates": "['EvalString_0']",
      "material": "[\"./project/animates/\", \"EvalString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('animate_1_s',inputs,isShadow,comment);
      }
    },
    "stopAnimate_s": {
      "type": "statement",
      "json": {
        "type": "stopAnimate_s",
        "message0": "停止所有动画 执行动画回调 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "stopAnimate：停止所有动画",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "stopAnimate_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        Bool_0 = Bool_0?', "doCallback": true':'';
        var code = '{"type": "stopAnimate"'+Bool_0+'},\n';
        return code;
      },
      "args": [
        "Bool_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('stopAnimate_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('stopAnimate_s',inputs,isShadow,comment);
      }
    },
    "setViewport_s": {
      "type": "statement",
      "json": {
        "type": "setViewport_s",
        "message0": "设置视角 左上角坐标 x %1 , y %2 移动方式 %3 动画时间 %4 不等待执行完毕 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.MoveMode_List,{
            "name": "MoveMode_List_0",
            "default": ""
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "setViewport: 设置视角",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "setViewport_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var MoveMode_List_0 = block.getFieldValue('MoveMode_List_0');
        MoveMode_List_0 = MotaActionFunctions.pre('MoveMode_List')(MoveMode_List_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var loc = '';
        if (PosString_0 && PosString_1) {
            loc = ', "loc": ['+PosString_0+','+PosString_1+']';
        }
        Int_0 = Int_0 ?(', "time": '+Int_0):'';
        Bool_0 = Bool_0?', "async": true':'';
        MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
        var code = '{"type": "setViewport"'+loc+MoveMode_List_0+Int_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "MoveMode_List_0",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","MoveMode_List","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setViewport_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"PosString_0\", \"PosString_1\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setViewport_s',inputs,isShadow,comment);
      }
    },
    "setViewport_1_s": {
      "type": "statement",
      "json": {
        "type": "setViewport_1_s",
        "message0": "设置视角 增量坐标 dx %1 , dy %2 移动方式 %3 动画时间 %4 不等待执行完毕 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.MoveMode_List,{
            "name": "MoveMode_List_0",
            "default": ""
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "setViewport: 设置视角",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "setViewport_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var MoveMode_List_0 = block.getFieldValue('MoveMode_List_0');
        MoveMode_List_0 = MotaActionFunctions.pre('MoveMode_List')(MoveMode_List_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var loc = '';
        if (PosString_0 && PosString_1) {
            loc = ', "dxy": ['+PosString_0+','+PosString_1+']';
        }
        Int_0 = Int_0 ?(', "time": '+Int_0):'';
        Bool_0 = Bool_0?', "async": true':'';
        MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
        var code = '{"type": "setViewport"'+loc+MoveMode_List_0+Int_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "MoveMode_List_0",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","MoveMode_List","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setViewport_1_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setViewport_1_s',inputs,isShadow,comment);
      }
    },
    "lockViewport_s": {
      "type": "statement",
      "json": {
        "type": "lockViewport_s",
        "message0": "是否锁定视角 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "lockViewport: 是否锁定视角",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "lockViewport_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        Bool_0 = Bool_0 ? (', "lock": true') : '';
        var code = '{"type": "lockViewport"'+Bool_0+'},\n';
        return code;
      },
      "args": [
        "Bool_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('lockViewport_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('lockViewport_s',inputs,isShadow,comment);
      }
    },
    "showImage_s": {
      "type": "statement",
      "json": {
        "type": "showImage_s",
        "message0": "显示图片 图片编号 %1 图片 %2 翻转 %3 %4 绘制的起点像素 x %5 y %6 不透明度 %7 时间 %8 不等待执行完毕 %9",
        "args0": [
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_0",
            "text": 1
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "bg.jpg"
          }),
          Object.assign({},MotaActionBlocks.Reverse_List,{
            "name": "Reverse_List_0",
            "default": "null"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_0",
            "value": 1
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "tooltip": "showImage：显示图片",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "showImage_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var NInt_0 = block.getFieldValue('NInt_0');
        if (NInt_0==='') {
          throw new OmitedError(block,'NInt_0','showImage_s');
        }
        NInt_0 = MotaActionFunctions.pre('NInt')(NInt_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','showImage_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Reverse_List_0 = block.getFieldValue('Reverse_List_0');
        Reverse_List_0 = MotaActionFunctions.pre('Reverse_List')(Reverse_List_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','showImage_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','showImage_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var Number_0 = block.getFieldValue('Number_0');
        Number_0 = MotaActionFunctions.pre('Number')(Number_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if (Reverse_List_0 && Reverse_List_0 != 'null') {
            Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
        } else Reverse_List_0 = '';
        var async = Bool_0?', "async": true':'';
        var code = '{"type": "showImage", "code": '+NInt_0+', "image": "'+EvalString_0+'"'+Reverse_List_0+', "loc": ['+PosString_0+','+PosString_1+'], "opacity": '+Number_0+', "time": '+Int_0+async+'},\n';
        return code;
      },
      "args": [
        "NInt_0",
        "EvalString_0",
        "Reverse_List_0",
        "PosString_0",
        "PosString_1",
        "Number_0",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["NInt","EvalString","Reverse_List","PosString","PosString","Number","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('showImage_s',keyOrIndex);
      },
      "menu": [['选择图片','editor_blockly.selectMaterial(block, ["./project/images/:images", "EvalString_0"])']],
      "allImages": "['EvalString_0']",
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('showImage_s',inputs,isShadow,comment);
      }
    },
    "showImage_1_s": {
      "type": "statement",
      "json": {
        "type": "showImage_1_s",
        "message0": "显示图片 图片编号 %1 图片 %2 翻转 %3 %4 裁剪的起点像素 x %5 y %6 宽 %7 高 %8 不透明度 %9 %10 绘制的起点像素 x %11 y %12 宽 %13 高 %14 时间 %15 不等待执行完毕 %16",
        "args0": [
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_0",
            "text": 1
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "bg.jpg"
          }),
          Object.assign({},MotaActionBlocks.Reverse_List,{
            "name": "Reverse_List_0",
            "default": "null"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_0",
            "value": 1
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_4",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_5",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_6",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_7",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "tooltip": "showImage_1：显示图片",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "showImage_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var NInt_0 = block.getFieldValue('NInt_0');
        if (NInt_0==='') {
          throw new OmitedError(block,'NInt_0','showImage_1_s');
        }
        NInt_0 = MotaActionFunctions.pre('NInt')(NInt_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','showImage_1_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Reverse_List_0 = block.getFieldValue('Reverse_List_0');
        Reverse_List_0 = MotaActionFunctions.pre('Reverse_List')(Reverse_List_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','showImage_1_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','showImage_1_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var Number_0 = block.getFieldValue('Number_0');
        Number_0 = MotaActionFunctions.pre('Number')(Number_0);
        var PosString_4 = block.getFieldValue('PosString_4');
        if (PosString_4==='') {
          throw new OmitedError(block,'PosString_4','showImage_1_s');
        }
        PosString_4 = MotaActionFunctions.pre('PosString')(PosString_4);
        var PosString_5 = block.getFieldValue('PosString_5');
        if (PosString_5==='') {
          throw new OmitedError(block,'PosString_5','showImage_1_s');
        }
        PosString_5 = MotaActionFunctions.pre('PosString')(PosString_5);
        var PosString_6 = block.getFieldValue('PosString_6');
        PosString_6 = MotaActionFunctions.pre('PosString')(PosString_6);
        var PosString_7 = block.getFieldValue('PosString_7');
        PosString_7 = MotaActionFunctions.pre('PosString')(PosString_7);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if (Reverse_List_0 && Reverse_List_0 != 'null') {
            Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
        } else Reverse_List_0 = '';
        var async = Bool_0?', "async": true':'';
        var code = '{"type": "showImage", "code": '+NInt_0+', "image": "'+EvalString_0+'"'+Reverse_List_0+', '+
                   '"sloc": ['+PosString_0+','+PosString_1+','+PosString_2+','+PosString_3+'], '+
                   '"loc": ['+PosString_4+','+PosString_5+','+PosString_6+','+PosString_7+'], '+
                   '"opacity": '+Number_0+', "time": '+Int_0+async+'},\n';
        return code;
      },
      "args": [
        "NInt_0",
        "EvalString_0",
        "Reverse_List_0",
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "Number_0",
        "PosString_4",
        "PosString_5",
        "PosString_6",
        "PosString_7",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["NInt","EvalString","Reverse_List","PosString","PosString","PosString","PosString","Number","PosString","PosString","PosString","PosString","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('showImage_1_s',keyOrIndex);
      },
      "menu": [['选择图片','editor_blockly.selectMaterial(block, ["./project/images/:images", "EvalString_0"])']],
      "allImages": "['EvalString_0']",
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('showImage_1_s',inputs,isShadow,comment);
      }
    },
    "showTextImage_s": {
      "type": "statement",
      "json": {
        "type": "showTextImage_s",
        "message0": "显示图片化文本 %1 %2 图片编号 %3 起点像素 x %4 y %5 行距 %6 翻转 %7 不透明度 %8 时间 %9 不等待执行完毕 %10",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": "可以使用setText事件来控制字体、颜色、大小、偏移量等"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_0",
            "text": 1
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_0",
            "value": 1.4
          }),
          Object.assign({},MotaActionBlocks.Reverse_List,{
            "name": "Reverse_List_0",
            "default": "null"
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_1",
            "value": 1
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "tooltip": "showTextImage：显示图片化文本",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "showTextImage_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        if (EvalString_Multi_0==='') {
          throw new OmitedError(block,'EvalString_Multi_0','showTextImage_s');
        }
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var NInt_0 = block.getFieldValue('NInt_0');
        if (NInt_0==='') {
          throw new OmitedError(block,'NInt_0','showTextImage_s');
        }
        NInt_0 = MotaActionFunctions.pre('NInt')(NInt_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','showTextImage_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','showTextImage_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var Number_0 = block.getFieldValue('Number_0');
        Number_0 = MotaActionFunctions.pre('Number')(Number_0);
        var Reverse_List_0 = block.getFieldValue('Reverse_List_0');
        Reverse_List_0 = MotaActionFunctions.pre('Reverse_List')(Reverse_List_0);
        var Number_1 = block.getFieldValue('Number_1');
        Number_1 = MotaActionFunctions.pre('Number')(Number_1);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if (Reverse_List_0 && Reverse_List_0 != 'null') {
            Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
        } else Reverse_List_0 = '';
        var async = Bool_0?', "async": true':'';
        var code = '{"type": "showTextImage", "code": '+NInt_0+', "text": "'+EvalString_Multi_0+'", "loc": ['+PosString_0+','+PosString_1+'], "lineHeight": '+Number_0+Reverse_List_0+', "opacity": '+Number_1+', "time": '+Int_0+async+'},\n';
        return code;
      },
      "args": [
        "EvalString_Multi_0",
        "NInt_0",
        "PosString_0",
        "PosString_1",
        "Number_0",
        "Reverse_List_0",
        "Number_1",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString_Multi","NInt","PosString","PosString","Number","Reverse_List","Number","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('showTextImage_s',keyOrIndex);
      },
      "menu": [],
      "doubleclicktext": "EvalString_Multi_0",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('showTextImage_s',inputs,isShadow,comment);
      }
    },
    "hideImage_s": {
      "type": "statement",
      "json": {
        "type": "hideImage_s",
        "message0": "清除图片 图片编号 %1 时间 %2 不等待执行完毕 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_0",
            "text": 1
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "hideImage：清除图片",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "hideImage_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var NInt_0 = block.getFieldValue('NInt_0');
        if (NInt_0==='') {
          throw new OmitedError(block,'NInt_0','hideImage_s');
        }
        NInt_0 = MotaActionFunctions.pre('NInt')(NInt_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var async = Bool_0?', "async": true':'';
        var code = '{"type": "hideImage", "code": '+NInt_0+', "time": '+Int_0+async+'},\n';
        return code;
      },
      "args": [
        "NInt_0",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["NInt","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('hideImage_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('hideImage_s',inputs,isShadow,comment);
      }
    },
    "showGif_s": {
      "type": "statement",
      "json": {
        "type": "showGif_s",
        "message0": "显示或清除动图 %1 起点像素位置 x %2 y %3",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "showGif：显示动图",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "showGif_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        EvalString_0 = EvalString_0 ? (', "name": "'+EvalString_0+'"') : '';
        var loc = (PosString_0 && PosString_1) ? (', "loc": ['+PosString_0+','+PosString_1+']') : '';
        var code = '{"type": "showGif"'+EvalString_0+loc+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "PosString_0",
        "PosString_1"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["EvalString","PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('showGif_s',keyOrIndex);
      },
      "menu": [],
      "allImages": "['EvalString_0']",
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('showGif_s',inputs,isShadow,comment);
      }
    },
    "moveImage_s": {
      "type": "statement",
      "json": {
        "type": "moveImage_s",
        "message0": "图片移动 图片编号 %1 终点像素位置 x %2 y %3 %4 不透明度 %5 移动方式 %6 移动时间 %7 不等待执行完毕 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_0",
            "text": 1
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.MoveMode_List,{
            "name": "MoveMode_List_0",
            "default": ""
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 500
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "tooltip": "moveImage：图片移动",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "moveImage_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var NInt_0 = block.getFieldValue('NInt_0');
        if (NInt_0==='') {
          throw new OmitedError(block,'NInt_0','moveImage_s');
        }
        NInt_0 = MotaActionFunctions.pre('NInt')(NInt_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var MoveMode_List_0 = block.getFieldValue('MoveMode_List_0');
        MoveMode_List_0 = MotaActionFunctions.pre('MoveMode_List')(MoveMode_List_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var toloc = '';
        if (PosString_0 && PosString_1)
          toloc = ', "to": ['+PosString_0+','+PosString_1+']';
        EvalString_0 = (EvalString_0!=='') ? (', "opacity": '+EvalString_0):'';
        MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
        var async = Bool_0?', "async": true':'';
        var code = '{"type": "moveImage", "code": '+NInt_0+toloc+MoveMode_List_0+EvalString_0+', "time": '+Int_0+async+'},\n';
        return code;
      },
      "args": [
        "NInt_0",
        "PosString_0",
        "PosString_1",
        "EvalString_0",
        "MoveMode_List_0",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["NInt","PosString","PosString","EvalString","MoveMode_List","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('moveImage_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('moveImage_s',inputs,isShadow,comment);
      }
    },
    "rotateImage_s": {
      "type": "statement",
      "json": {
        "type": "rotateImage_s",
        "message0": "图片旋转 图片编号 %1 中心点像素 x %2 y %3 移动方式 %4 %5 旋转度数（正数顺时针，负数逆时针） %6 旋转时间 %7 不等待执行完毕 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_0",
            "text": 1
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.MoveMode_List,{
            "name": "MoveMode_List_0",
            "default": ""
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_1",
            "text": 90
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 500
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "tooltip": "rotateImage：图片旋转",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "rotateImage_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var NInt_0 = block.getFieldValue('NInt_0');
        if (NInt_0==='') {
          throw new OmitedError(block,'NInt_0','rotateImage_s');
        }
        NInt_0 = MotaActionFunctions.pre('NInt')(NInt_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var MoveMode_List_0 = block.getFieldValue('MoveMode_List_0');
        MoveMode_List_0 = MotaActionFunctions.pre('MoveMode_List')(MoveMode_List_0);
        var NInt_1 = block.getFieldValue('NInt_1');
        if (NInt_1==='') {
          throw new OmitedError(block,'NInt_1','rotateImage_s');
        }
        NInt_1 = MotaActionFunctions.pre('NInt')(NInt_1);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var loc = '';
        if (PosString_0 && PosString_1)
          loc = ', "center": ['+PosString_0+','+PosString_1+']';
        MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
        var async = Bool_0?', "async": true':'';
        var code = '{"type": "rotateImage", "code": '+NInt_0+loc+', "angle": '+NInt_1+MoveMode_List_0+', "time": '+Int_0+async+'},\n';
        return code;
      },
      "args": [
        "NInt_0",
        "PosString_0",
        "PosString_1",
        "MoveMode_List_0",
        "NInt_1",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["NInt","PosString","PosString","MoveMode_List","NInt","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('rotateImage_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('rotateImage_s',inputs,isShadow,comment);
      }
    },
    "scaleImage_s": {
      "type": "statement",
      "json": {
        "type": "scaleImage_s",
        "message0": "图片放缩 图片编号 %1 中心点像素 x %2 y %3 移动方式 %4 %5 放缩比例 %6 动画时间 %7 不等待执行完毕 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_0",
            "text": 1
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.MoveMode_List,{
            "name": "MoveMode_List_0",
            "default": ""
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_0",
            "value": 0.8
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "tooltip": "scaleImage：图片放缩",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "scaleImage_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var NInt_0 = block.getFieldValue('NInt_0');
        if (NInt_0==='') {
          throw new OmitedError(block,'NInt_0','scaleImage_s');
        }
        NInt_0 = MotaActionFunctions.pre('NInt')(NInt_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var MoveMode_List_0 = block.getFieldValue('MoveMode_List_0');
        MoveMode_List_0 = MotaActionFunctions.pre('MoveMode_List')(MoveMode_List_0);
        var Number_0 = block.getFieldValue('Number_0');
        Number_0 = MotaActionFunctions.pre('Number')(Number_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if (Number_0 <= 0) throw new Error('放缩比例需要大于0'); 
        var loc = '';
        if (PosString_0 && PosString_1)
          loc = ', "center": ['+PosString_0+','+PosString_1+']';
        MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
        var async = Bool_0?', "async": true':'';
        var code = '{"type": "scaleImage", "code": '+NInt_0+loc+', "scale": '+Number_0+MoveMode_List_0+', "time": '+Int_0+async+'},\n';
        return code;
      },
      "args": [
        "NInt_0",
        "PosString_0",
        "PosString_1",
        "MoveMode_List_0",
        "Number_0",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["NInt","PosString","PosString","MoveMode_List","Number","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('scaleImage_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('scaleImage_s',inputs,isShadow,comment);
      }
    },
    "setCurtain_0_s": {
      "type": "statement",
      "json": {
        "type": "setCurtain_0_s",
        "message0": "更改画面色调 %1 %2 动画时间 %3 %4 渐变方式 %5 持续到下一个本事件 %6 不等待执行完毕 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": "255,255,255,1"
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": 500
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.MoveMode_List,{
            "name": "MoveMode_List_0",
            "default": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": true
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          })
        ],
        "tooltip": "setCurtain: 更改画面色调,动画时间可不填",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "setCurtain_0_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var ColorString_0 = block.getFieldValue('ColorString_0');
        if (ColorString_0==='') {
          throw new OmitedError(block,'ColorString_0','setCurtain_0_s');
        }
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var MoveMode_List_0 = block.getFieldValue('MoveMode_List_0');
        MoveMode_List_0 = MotaActionFunctions.pre('MoveMode_List')(MoveMode_List_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
        Bool_0 = Bool_0 ? ', "keep": true' : '';
        var async = Bool_1?', "async": true':'';
        var code = '{"type": "setCurtain", "color": ['+ColorString_0+']'+IntString_0+MoveMode_List_0+Bool_0+async+'},\n';
        return code;
      },
      "args": [
        "ColorString_0",
        "Colour_0",
        "IntString_0",
        "MoveMode_List_0",
        "Bool_0",
        "Bool_1"
      ],
      "argsType": ["field","field","field","field","field","field"],
      "argsGrammarName": ["ColorString","Colour","IntString","MoveMode_List","Bool","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setCurtain_0_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setCurtain_0_s',inputs,isShadow,comment);
      }
    },
    "setCurtain_1_s": {
      "type": "statement",
      "json": {
        "type": "setCurtain_1_s",
        "message0": "恢复画面色调 动画时间 %1 渐变方式 %2 不等待执行完毕 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": 500
          }),
          Object.assign({},MotaActionBlocks.MoveMode_List,{
            "name": "MoveMode_List_0",
            "default": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "setCurtain: 恢复画面色调,动画时间可不填",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "setCurtain_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var MoveMode_List_0 = block.getFieldValue('MoveMode_List_0');
        MoveMode_List_0 = MotaActionFunctions.pre('MoveMode_List')(MoveMode_List_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
        var async = Bool_0?', "async": true':'';
        var code = '{"type": "setCurtain"'+IntString_0+MoveMode_List_0 +async+'},\n';
        return code;
      },
      "args": [
        "IntString_0",
        "MoveMode_List_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["IntString","MoveMode_List","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setCurtain_1_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setCurtain_1_s',inputs,isShadow,comment);
      }
    },
    "screenFlash_s": {
      "type": "statement",
      "json": {
        "type": "screenFlash_s",
        "message0": "画面闪烁 %1 %2 单次时间 %3 执行次数 %4 渐变方式 %5 不等待执行完毕 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": "255,255,255,1"
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 500
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": 1
          }),
          Object.assign({},MotaActionBlocks.MoveMode_List,{
            "name": "MoveMode_List_0",
            "default": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "screenFlash: 画面闪烁,动画时间可不填",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "screenFlash_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var ColorString_0 = block.getFieldValue('ColorString_0');
        if (ColorString_0==='') {
          throw new OmitedError(block,'ColorString_0','screenFlash_s');
        }
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var MoveMode_List_0 = block.getFieldValue('MoveMode_List_0');
        MoveMode_List_0 = MotaActionFunctions.pre('MoveMode_List')(MoveMode_List_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if (ColorString_0 == '') throw new Error('颜色格式错误,形如:0~255,0~255,0~255,0~1');
        IntString_0 = IntString_0 ? (', "times": '+IntString_0):'';
        MoveMode_List_0 = (MoveMode_List_0!=='') ? (', "moveMode": "'+MoveMode_List_0+'"'):'';
        var async = Bool_0?', "async": true':'';
        var code = '{"type": "screenFlash", "color": ['+ColorString_0+'], "time": '+Int_0 +IntString_0+MoveMode_List_0+async+'},\n';
        return code;
      },
      "args": [
        "ColorString_0",
        "Colour_0",
        "Int_0",
        "IntString_0",
        "MoveMode_List_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field"],
      "argsGrammarName": ["ColorString","Colour","Int","IntString","MoveMode_List","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('screenFlash_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('screenFlash_s',inputs,isShadow,comment);
      }
    },
    "setWeather_s": {
      "type": "statement",
      "json": {
        "type": "setWeather_s",
        "message0": "更改天气 %1 强度 %2 持续到下个本事件 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.Weather_List,{
            "name": "Weather_List_0"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 1
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": true
          })
        ],
        "inputsInline": true,
        "tooltip": "setWeather：更改天气",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "setWeather_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Weather_List_0 = block.getFieldValue('Weather_List_0');
        Weather_List_0 = MotaActionFunctions.pre('Weather_List')(Weather_List_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if(Int_0<1 || Int_0>10) throw new Error('天气的强度等级, 在1-10之间');
        Bool_0 = Bool_0 ? ', "keep": true' : ''
        var code = '{"type": "setWeather", "name": "'+Weather_List_0+'", "level": '+Int_0+Bool_0+'},\n';
        if(Weather_List_0===''||Weather_List_0==='null'||Weather_List_0==null)code = '{"type": "setWeather"},\n';
        return code;
      },
      "args": [
        "Weather_List_0",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["Weather_List","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setWeather_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setWeather_s',inputs,isShadow,comment);
      }
    },
    "move_s": {
      "type": "statement",
      "json": {
        "type": "move_s",
        "message0": "移动事件 x %1 , y %2 动画时间 %3 不消失 %4 不等待执行完毕 %5 %6 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": 500
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": true
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "moveDirection_0",
            "check": "moveDirection"
          }
        ],
        "tooltip": "move: 让某个NPC/怪物移动,位置可不填代表当前事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "move_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        var moveDirection_0 = Blockly.JavaScript.statementToCode(block, 'moveDirection_0');
        if (moveDirection_0==='') {
          throw new OmitedError(block,'moveDirection_0','move_s');
        }
        var floorstr = '';
        if (PosString_0 && PosString_1) {
            floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
        }
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        Bool_0 = Bool_0?', "keep": true':'';
        Bool_1 = Bool_1?', "async": true':'';
        var code = '{"type": "move"'+floorstr+IntString_0+Bool_0+Bool_1+', "steps": ['+moveDirection_0.trim().substring(2)+']},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "IntString_0",
        "Bool_0",
        "Bool_1",
        "moveDirection_0"
      ],
      "argsType": ["field","field","field","field","field","statement"],
      "argsGrammarName": ["PosString","PosString","IntString","Bool","Bool","moveDirection"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('move_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"PosString_0\", \"PosString_1\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('move_s',inputs,isShadow,comment);
      }
    },
    "moveDirection": {
      "type": "statement",
      "json": {
        "type": "moveDirection",
        "message0": "移动方向 %1 格数 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.Move_List,{
            "name": "Move_List_0",
            "default": "up"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          })
        ],
        "inputsInline": true,
        "tooltip": "移动方向",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250,
        "previousStatement": "moveDirection",
        "nextStatement": "moveDirection"
      },
      "generFunc": function(block) {
        var Move_List_0 = block.getFieldValue('Move_List_0');
        Move_List_0 = MotaActionFunctions.pre('Move_List')(Move_List_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        if (Move_List_0 == 'speed' && Int_0 < 16) throw '设置的移动速度值不得小于16';
        return ', "' + Move_List_0 + ':' + Int_0 + '"';
      },
      "args": [
        "Move_List_0",
        "Int_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["Move_List","Int"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('moveDirection',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('moveDirection',inputs,isShadow,comment);
      }
    },
    "moveAction_s": {
      "type": "statement",
      "json": {
        "type": "moveAction_s",
        "message0": "勇士前进一格或撞击",
        "inputsInline": true,
        "tooltip": "moveAction: 前进一格或撞击",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "moveAction_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        return '{"type": "moveAction"},\n';
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('moveAction_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('moveAction_s',inputs,isShadow,comment);
      }
    },
    "moveHero_s": {
      "type": "statement",
      "json": {
        "type": "moveHero_s",
        "message0": "无视地形移动勇士 动画时间 %1 不等待执行完毕 %2 %3 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "moveDirection_0",
            "check": "moveDirection"
          }
        ],
        "tooltip": "moveHero：移动勇士,用这种方式移动勇士的过程中将无视一切地形, 无视一切事件, 中毒状态也不会扣血",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "moveHero_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var moveDirection_0 = Blockly.JavaScript.statementToCode(block, 'moveDirection_0');
        if (moveDirection_0==='') {
          throw new OmitedError(block,'moveDirection_0','moveHero_s');
        }
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        Bool_0 = Bool_0?', "async": true':'';
        var code = '{"type": "moveHero"'+IntString_0+Bool_0+', "steps": ['+moveDirection_0.trim().substring(2)+']},\n';
        return code;
      },
      "args": [
        "IntString_0",
        "Bool_0",
        "moveDirection_0"
      ],
      "argsType": ["field","field","statement"],
      "argsGrammarName": ["IntString","Bool","moveDirection"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('moveHero_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('moveHero_s',inputs,isShadow,comment);
      }
    },
    "jump_s": {
      "type": "statement",
      "json": {
        "type": "jump_s",
        "message0": "跳跃事件 起始 x %1 , y %2 终止 x %3 , y %4 动画时间 %5 不消失 %6 不等待执行完毕 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": 500
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": true
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "jump: 让某个NPC/怪物跳跃",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "jump_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        var floorstr = '';
        if (PosString_0 && PosString_1) {
            floorstr += ', "from": ['+PosString_0+','+PosString_1+']';
        }
        if (PosString_2 && PosString_3) {
            floorstr += ', "to": ['+PosString_2+','+PosString_3+']';
        }
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        Bool_0 = Bool_0?', "keep": true':'';
        Bool_1 = Bool_1?', "async": true':'';
        var code = '{"type": "jump"'+floorstr+''+IntString_0+Bool_0+Bool_1+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "IntString_0",
        "Bool_0",
        "Bool_1"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","IntString","Bool","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('jump_s',keyOrIndex);
      },
      "menu": [['选择起点位置','editor_blockly.selectPoint(block,["PosString_0", "PosString_1"])']],
      "selectPoint": "[\"PosString_2\", \"PosString_3\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('jump_s',inputs,isShadow,comment);
      }
    },
    "jump_1_s": {
      "type": "statement",
      "json": {
        "type": "jump_1_s",
        "message0": "跳跃事件 起始 x %1 , y %2 增量 dx %3 , dy %4 动画时间 %5 不消失 %6 不等待执行完毕 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": 500
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": true
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "jump: 让某个NPC/怪物跳跃，给定增量",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "jump_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        var floorstr = '';
        if (PosString_0 && PosString_1) {
            floorstr += ', "from": ['+PosString_0+','+PosString_1+']';
        }
        if (PosString_2 && PosString_3) {
            floorstr += ', "dxy": ['+PosString_2+','+PosString_3+']';
        }
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        Bool_0 = Bool_0?', "keep": true':'';
        Bool_1 = Bool_1?', "async": true':'';
        var code = '{"type": "jump"'+floorstr+''+IntString_0+Bool_0+Bool_1+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "IntString_0",
        "Bool_0",
        "Bool_1"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","IntString","Bool","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('jump_1_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"PosString_0\", \"PosString_1\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('jump_1_s',inputs,isShadow,comment);
      }
    },
    "jumpHero_s": {
      "type": "statement",
      "json": {
        "type": "jumpHero_s",
        "message0": "跳跃勇士 x %1 , y %2 动画时间 %3 不等待执行完毕 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": 500
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "jumpHero: 跳跃勇士",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "jumpHero_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var floorstr = '';
        if (PosString_0 && PosString_1) {
            floorstr = ', "loc": ['+PosString_0+','+PosString_1+']';
        }
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        Bool_0 = Bool_0?', "async": true':'';
        var code = '{"type": "jumpHero"'+floorstr+IntString_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "IntString_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","IntString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('jumpHero_s',keyOrIndex);
      },
      "menu": [],
      "selectPoint": "[\"PosString_0\", \"PosString_1\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('jumpHero_s',inputs,isShadow,comment);
      }
    },
    "jumpHero_1_s": {
      "type": "statement",
      "json": {
        "type": "jumpHero_1_s",
        "message0": "跳跃勇士 增量 dx %1 , dy %2 动画时间 %3 不等待执行完毕 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": 500
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "jumpHero: 跳跃勇士，给定增量",
        "helpUrl": "/_docs/#/instruction",
        "colour": 175,
        "previousStatement": "jumpHero_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var floorstr = '';
        if (PosString_0 && PosString_1) {
            floorstr = ', "dxy": ['+PosString_0+','+PosString_1+']';
        }
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        Bool_0 = Bool_0?', "async": true':'';
        var code = '{"type": "jumpHero"'+floorstr+IntString_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "IntString_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","IntString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('jumpHero_1_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('jumpHero_1_s',inputs,isShadow,comment);
      }
    },
    "playBgm_s": {
      "type": "statement",
      "json": {
        "type": "playBgm_s",
        "message0": "播放背景音乐 %1 开始播放秒数 %2 持续到下个本事件 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "bgm.mp3"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": true
          })
        ],
        "inputsInline": true,
        "tooltip": "playBgm: 播放背景音乐",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "playBgm_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','playBgm_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        Int_0 = Int_0 ? (', "startTime": '+Int_0) : '';
        Bool_0 = Bool_0 ? ', "keep": true' : '';
        var code = '{"type": "playBgm", "name": "'+EvalString_0+'"'+Int_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["EvalString","Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('playBgm_s',keyOrIndex);
      },
      "menu": [],
      "allBgms": "['EvalString_0']",
      "material": "[\"./project/bgms/\", \"EvalString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('playBgm_s',inputs,isShadow,comment);
      }
    },
    "pauseBgm_s": {
      "type": "statement",
      "json": {
        "type": "pauseBgm_s",
        "message0": "暂停背景音乐",
        "inputsInline": true,
        "tooltip": "pauseBgm: 暂停背景音乐",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "pauseBgm_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var code = '{"type": "pauseBgm"},\n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('pauseBgm_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('pauseBgm_s',inputs,isShadow,comment);
      }
    },
    "resumeBgm_s": {
      "type": "statement",
      "json": {
        "type": "resumeBgm_s",
        "message0": "恢复背景音乐 从暂停位置继续播放 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0"
          })
        ],
        "inputsInline": true,
        "tooltip": "resumeBgm: 恢复背景音乐",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "resumeBgm_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        Bool_0 = Bool_0 ? ', "resume": true' : '';
        var code = '{"type": "resumeBgm"' + Bool_0 + '},\n';
        return code;
      },
      "args": [
        "Bool_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('resumeBgm_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('resumeBgm_s',inputs,isShadow,comment);
      }
    },
    "loadBgm_s": {
      "type": "statement",
      "json": {
        "type": "loadBgm_s",
        "message0": "预加载背景音乐 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "bgm.mp3"
          })
        ],
        "inputsInline": true,
        "tooltip": "loadBgm: 预加载某个背景音乐，之后可以直接播放",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "loadBgm_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','loadBgm_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var code = '{"type": "loadBgm", "name": "'+EvalString_0+'"},\n';
        return code;
      },
      "args": [
        "EvalString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('loadBgm_s',keyOrIndex);
      },
      "menu": [],
      "allBgms": "['EvalString_0']",
      "material": "[\"./project/bgms/\", \"EvalString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('loadBgm_s',inputs,isShadow,comment);
      }
    },
    "freeBgm_s": {
      "type": "statement",
      "json": {
        "type": "freeBgm_s",
        "message0": "释放背景音乐的缓存 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "bgm.mp3"
          })
        ],
        "inputsInline": true,
        "tooltip": "freeBgm: 释放背景音乐的缓存",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "freeBgm_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','freeBgm_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var code = '{"type": "freeBgm", "name": "'+EvalString_0+'"},\n';
        return code;
      },
      "args": [
        "EvalString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('freeBgm_s',keyOrIndex);
      },
      "menu": [],
      "allBgms": "['EvalString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('freeBgm_s',inputs,isShadow,comment);
      }
    },
    "playSound_s": {
      "type": "statement",
      "json": {
        "type": "playSound_s",
        "message0": "播放音效 %1 停止之前音效 %2 音调 %3 等待播放完毕 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "item.mp3"
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "playSound: 播放音效",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "playSound_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','playSound_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        if (IntString_0) {
            if (parseInt(IntString_0) < 30 || parseInt(IntString_0) > 300) throw '音调设置只能在30-300之间；100为正常音调。';
            IntString_0 = ', "pitch": ' + IntString_0;
        } else IntString_0 = '';
        Bool_0 = Bool_0 ? ', "stop": true' : '';
        Bool_1 = Bool_1 ? ', "sync": true' : '';
        var code = '{"type": "playSound", "name": "'+EvalString_0+'"'+Bool_0+IntString_0+Bool_1+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "Bool_0",
        "IntString_0",
        "Bool_1"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["EvalString","Bool","IntString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('playSound_s',keyOrIndex);
      },
      "menu": [],
      "allSounds": "['EvalString_0']",
      "material": "[\"./project/sounds/\", \"EvalString_0\"]",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('playSound_s',inputs,isShadow,comment);
      }
    },
    "playSound_1_s": {
      "type": "statement",
      "json": {
        "type": "playSound_1_s",
        "message0": "播放系统音效 %1 停止之前音效 %2 音调 %3 等待播放完毕 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.NameMap_List,{
            "name": "NameMap_List_0",
            "default": "确定"
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "playSound: 播放系统音效",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "playSound_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var NameMap_List_0 = block.getFieldValue('NameMap_List_0');
        NameMap_List_0 = MotaActionFunctions.pre('NameMap_List')(NameMap_List_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        if (IntString_0) {
            if (parseInt(IntString_0) < 30 || parseInt(IntString_0) > 300) throw '音调设置只能在30-300之间；100为正常音调。';
            IntString_0 = ', "pitch": ' + IntString_0;
        } else IntString_0 = '';
        Bool_0 = Bool_0 ? ', "stop": true' : '';
        Bool_1 = Bool_1 ? ', "sync": true' : '';
        var code = '{"type": "playSound", "name": "'+NameMap_List_0+'"'+Bool_0+IntString_0+Bool_1+'},\n';
        return code;
      },
      "args": [
        "NameMap_List_0",
        "Bool_0",
        "IntString_0",
        "Bool_1"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["NameMap_List","Bool","IntString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('playSound_1_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('playSound_1_s',inputs,isShadow,comment);
      }
    },
    "stopSound_s": {
      "type": "statement",
      "json": {
        "type": "stopSound_s",
        "message0": "停止所有音效",
        "inputsInline": true,
        "tooltip": "stopSound: 停止所有音效",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "stopSound_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var code = '{"type": "stopSound"},\n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('stopSound_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('stopSound_s',inputs,isShadow,comment);
      }
    },
    "setVolume_s": {
      "type": "statement",
      "json": {
        "type": "setVolume_s",
        "message0": "设置音量 %1 渐变时间 %2 不等待执行完毕 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 90
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": 500
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "setVolume: 设置音量",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "setVolume_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        IntString_0 = IntString_0 ?(', "time": '+IntString_0):'';
        var async = Bool_0?', "async": true':'';
        var code = '{"type": "setVolume", "value": '+Int_0+IntString_0+async+'},\n';
        return code;
      },
      "args": [
        "Int_0",
        "IntString_0",
        "Bool_0"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["Int","IntString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setVolume_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setVolume_s',inputs,isShadow,comment);
      }
    },
    "setBgmSpeed_s": {
      "type": "statement",
      "json": {
        "type": "setBgmSpeed_s",
        "message0": "设置背景音乐播放速度 %1 同时改变音调 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 100
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": true
          })
        ],
        "inputsInline": true,
        "tooltip": "setSpeed: 设置背景音乐播放速度",
        "helpUrl": "/_docs/#/instruction",
        "colour": 45,
        "previousStatement": "setBgmSpeed_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        if (Int_0 < 30 || Int_0 > 300) throw '速度只能设置只能在30-300之间；100为正常速度。';
        Bool_0 = Bool_0?', "pitch": true':'';
        var code = '{"type": "setBgmSpeed", "value": '+Int_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "Int_0",
        "Bool_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["Int","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setBgmSpeed_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setBgmSpeed_s',inputs,isShadow,comment);
      }
    },
    "win_s": {
      "type": "statement",
      "json": {
        "type": "win_s",
        "message0": "游戏胜利,结局 : %1 不计入榜单 %2 不结束游戏 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "win: 获得胜利, 该事件会显示获胜页面, 并重新游戏",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "win_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        Bool_0 = Bool_0?', "norank": 1':'';
        Bool_1 = Bool_1?', "noexit": 1':'';
        var code = '{"type": "win", "reason": "'+EvalString_0+'"'+Bool_0+Bool_1+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "Bool_0",
        "Bool_1"
      ],
      "argsType": ["field","field","field"],
      "argsGrammarName": ["EvalString","Bool","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('win_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('win_s',inputs,isShadow,comment);
      }
    },
    "lose_s": {
      "type": "statement",
      "json": {
        "type": "lose_s",
        "message0": "游戏失败,结局 : %1",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "lose: 游戏失败, 该事件会显示失败页面, 并重新开始游戏",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "lose_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var code = '{"type": "lose", "reason": "'+EvalString_0+'"},\n';
        return code;
      },
      "args": [
        "EvalString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('lose_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('lose_s',inputs,isShadow,comment);
      }
    },
    "restart_s": {
      "type": "statement",
      "json": {
        "type": "restart_s",
        "message0": "直接回到标题界面",
        "inputsInline": true,
        "tooltip": "restart: 直接回到标题界面",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "restart_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var code = '{"type": "restart"},\n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('restart_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('restart_s',inputs,isShadow,comment);
      }
    },
    "input_s": {
      "type": "statement",
      "json": {
        "type": "input_s",
        "message0": "接受用户输入数字,提示 : %1",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "请输入一个数"
          })
        ],
        "inputsInline": true,
        "tooltip": "input：接受用户输入数字, 事件只能接受非负整数输入, 所有非法的输入将全部变成0",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "input_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','input_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var code = '{"type": "input", "text": "'+EvalString_0+'"},\n';
        return code;
      },
      "args": [
        "EvalString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('input_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('input_s',inputs,isShadow,comment);
      }
    },
    "input2_s": {
      "type": "statement",
      "json": {
        "type": "input2_s",
        "message0": "接受用户输入文本,提示 : %1",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "请输入文本"
          })
        ],
        "inputsInline": true,
        "tooltip": "input2：接受用户输入文本, 允许用户输入任何形式的文本",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "input2_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','input2_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var code = '{"type": "input2", "text": "'+EvalString_0+'"},\n';
        return code;
      },
      "args": [
        "EvalString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('input2_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('input2_s',inputs,isShadow,comment);
      }
    },
    "if_s": {
      "type": "statement",
      "json": {
        "type": "if_s",
        "message0": "如果 : %1 %2 %3 否则 : %4 %5",
        "args0": [
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_1",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "if: 条件判断",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "if_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','if_s');
        }
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','if_s');
        }
        var action_1 = Blockly.JavaScript.statementToCode(block, 'action_1');
        if (action_1==='') {
          throw new OmitedError(block,'action_1','if_s');
        }
        var code = ['{"type": "if", "condition": "',expression_0,'",',
            block.isCollapsed()?' "_collapsed": true,':'',
            block.isEnabled()?'':' "_disabled": true,',
            '\n"true": [\n',action_0,'],\n',
            '"false": [\n',action_1,']',
        '},\n'].join('');
        return code;
      },
      "args": [
        "expression_0",
        "action_0",
        "action_1"
      ],
      "argsType": ["value","statement","statement"],
      "argsGrammarName": ["expression","action","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('if_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('if_s',inputs,isShadow,comment);
      }
    },
    "if_1_s": {
      "type": "statement",
      "json": {
        "type": "if_1_s",
        "message0": "如果 : %1 %2 %3",
        "args0": [
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "if: 条件判断",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "if_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','if_1_s');
        }
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','if_1_s');
        }
        var code = ['{"type": "if", "condition": "',expression_0,'",',
            block.isCollapsed()?' "_collapsed": true,':'',
            block.isEnabled()?'':' "_disabled": true,',
            '\n"true": [\n',action_0,']',
        '},\n'].join('');
        return code;
      },
      "args": [
        "expression_0",
        "action_0"
      ],
      "argsType": ["value","statement"],
      "argsGrammarName": ["expression","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('if_1_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('if_1_s',inputs,isShadow,comment);
      }
    },
    "switch_s": {
      "type": "statement",
      "json": {
        "type": "switch_s",
        "message0": "多重分歧 条件判定 : %1 %2 %3",
        "args0": [
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "switchCase_0",
            "check": "switchCase"
          }
        ],
        "tooltip": "switch: 多重条件分歧",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "switch_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','switch_s');
        }
        var switchCase_0 = Blockly.JavaScript.statementToCode(block, 'switchCase_0');
        if (switchCase_0==='') {
          throw new OmitedError(block,'switchCase_0','switch_s');
        }
        var code = ['{"type": "switch", "condition": "',expression_0,'", ',
            block.isCollapsed()?'"_collapsed": true, ':'',
            block.isEnabled()?'':'"_disabled": true, ',
            '"caseList": [\n',
            switchCase_0,
        '], },\n'].join('');
        return code;
      },
      "args": [
        "expression_0",
        "switchCase_0"
      ],
      "argsType": ["value","statement"],
      "argsGrammarName": ["expression","switchCase"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('switch_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('switch_s',inputs,isShadow,comment);
      }
    },
    "switchCase": {
      "type": "statement",
      "json": {
        "type": "switchCase",
        "message0": "如果是 %1 的场合 不跳出 %2 %3 %4",
        "args0": [
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": ""
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "选项的选择",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250,
        "previousStatement": "switchCase",
        "nextStatement": "switchCase"
      },
      "generFunc": function(block) {
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','switchCase');
        }
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','switchCase');
        }
        Bool_0 = Bool_0?', "nobreak": true':'';
        var collapsed=block.isCollapsed()?', "_collapsed": true':'';
        var disabled=block.isEnabled()?'':', "_disabled": true';
        var code = '{"case": "'+expression_0+'"'+Bool_0+collapsed+disabled+', "action": [\n'+action_0+']},\n';
        return code;
      },
      "args": [
        "expression_0",
        "Bool_0",
        "action_0"
      ],
      "argsType": ["value","field","statement"],
      "argsGrammarName": ["expression","Bool","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('switchCase',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('switchCase',inputs,isShadow,comment);
      }
    },
    "choices_s": {
      "type": "statement",
      "json": {
        "type": "choices_s",
        "message0": "选项 : %1 %2 标题 %3 图像 %4 超时毫秒数 %5 宽度 %6 %7 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": ""
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "流浪者"
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "trader"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "choicesContext_0",
            "check": "choicesContext"
          }
        ],
        "tooltip": "choices: 给用户提供选项",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "choices_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var choicesContext_0 = Blockly.JavaScript.statementToCode(block, 'choicesContext_0');
        if (choicesContext_0==='') {
          throw new OmitedError(block,'choicesContext_0','choices_s');
        }
        var title='';
        if (EvalString_0==''){
            if (IdString_0=='')title='';
            else title='\\t['+IdString_0+']';
        } else {
            if (IdString_0=='')title='\\t['+EvalString_0+']';
            else title='\\t['+EvalString_0+','+IdString_0+']';
        }
        EvalString_Multi_0 = title+EvalString_Multi_0;
        EvalString_Multi_0 = EvalString_Multi_0 ?(', "text": "'+EvalString_Multi_0+'"'):'';
        Int_0 = Int_0 ? (', "timeout": '+Int_0) : '';
        IntString_0 = IntString_0 ? (', "width": ' + IntString_0) : '';
        var code = ['{"type": "choices"',EvalString_Multi_0,Int_0,IntString_0,
            block.isCollapsed()?', "_collapsed": true':'',
            block.isEnabled()?'':', "_disabled": true',
            ', "choices": [\n',
            choicesContext_0,
        ']},\n'].join('');
        return code;
      },
      "args": [
        "EvalString_Multi_0",
        "EvalString_0",
        "IdString_0",
        "Int_0",
        "IntString_0",
        "choicesContext_0"
      ],
      "argsType": ["field","field","field","field","field","statement"],
      "argsGrammarName": ["EvalString_Multi","EvalString","IdString","Int","IntString","choicesContext"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('choices_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "allIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('choices_s',inputs,isShadow,comment);
      }
    },
    "choicesContext": {
      "type": "statement",
      "json": {
        "type": "choicesContext",
        "message0": "子选项 %1 图标 %2 颜色 %3 %4 启用条件 %5 出现条件 %6 %7 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "提示文字:红钥匙"
          }),
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_2"
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "选项的选择",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250,
        "previousStatement": "choicesContext",
        "nextStatement": "choicesContext"
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','choicesContext');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var IdString_0 = block.getFieldValue('IdString_0');
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var EvalString_2 = block.getFieldValue('EvalString_2');
        EvalString_2 = MotaActionFunctions.pre('EvalString')(EvalString_2);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','choicesContext');
        }
        ColorString_0 = ColorString_0 ? (', "color": ['+ColorString_0+']') : '';
        EvalString_1 = EvalString_1 && (', "need": "'+EvalString_1+'"');
        EvalString_2 = EvalString_2 && (', "condition": "'+EvalString_2+'"');
        IdString_0 = IdString_0?(', "icon": "'+IdString_0+'"'):'';
        var collapsed=block.isCollapsed()?', "_collapsed": true':'';
        var disabled=block.isEnabled()?'':', "_disabled": true';
        var code = '{"text": "'+EvalString_0+'"'+IdString_0+ColorString_0+EvalString_1+EvalString_2+collapsed+disabled+', "action": [\n'+action_0+']},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "IdString_0",
        "ColorString_0",
        "Colour_0",
        "EvalString_1",
        "EvalString_2",
        "action_0"
      ],
      "argsType": ["field","field","field","field","field","field","statement"],
      "argsGrammarName": ["EvalString","IdString","ColorString","Colour","EvalString","EvalString","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('choicesContext',keyOrIndex);
      },
      "menu": [],
      "allIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('choicesContext',inputs,isShadow,comment);
      }
    },
    "confirm_s": {
      "type": "statement",
      "json": {
        "type": "confirm_s",
        "message0": "显示确认框 : %1 超时毫秒数 %2 %3 确定的场合 : （默认选中 %4 ） %5 %6 取消的场合 : %7 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": "确认要xxx吗?"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_1",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "弹出确认框",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "confirm_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        if (EvalString_Multi_0==='') {
          throw new OmitedError(block,'EvalString_Multi_0','confirm_s');
        }
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','confirm_s');
        }
        var action_1 = Blockly.JavaScript.statementToCode(block, 'action_1');
        if (action_1==='') {
          throw new OmitedError(block,'action_1','confirm_s');
        }
        Bool_0 = Bool_0?', "default": true':''
        Int_0 = Int_0 ? (', "timeout": '+Int_0) : '';
        var code = ['{"type": "confirm"'+Int_0+Bool_0+', "text": "',EvalString_Multi_0,'",',
            block.isCollapsed()?' "_collapsed": true,':'',
            block.isEnabled()?'':' "_disabled": true,',
            '\n"yes": [\n',action_0,'],\n',
            '"no": [\n',action_1,']\n',
        '},\n'].join('');
        return code;
      },
      "args": [
        "EvalString_Multi_0",
        "Int_0",
        "Bool_0",
        "action_0",
        "action_1"
      ],
      "argsType": ["field","field","field","statement","statement"],
      "argsGrammarName": ["EvalString_Multi","Int","Bool","action","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('confirm_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('confirm_s',inputs,isShadow,comment);
      }
    },
    "for_s": {
      "type": "statement",
      "json": {
        "type": "for_s",
        "message0": "循环遍历 :  %1 从 %2 到 %3 步增 %4 %5 %6",
        "args0": [
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_2"
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "for：循环遍历",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "for_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','for_s');
        }
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','for_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','for_s');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var EvalString_2 = block.getFieldValue('EvalString_2');
        if (EvalString_2==='') {
          throw new OmitedError(block,'EvalString_2','for_s');
        }
        EvalString_2 = MotaActionFunctions.pre('EvalString')(EvalString_2);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','for_s');
        }
        if (!/^temp:[A-Z]$/.test(expression_0)) {
          throw new Error('循环遍历仅允许使用临时变量！');
        }
        var collapsed=block.isCollapsed()?', "_collapsed": true':'';
        var disabled=block.isEnabled()?'':', "_disabled": true';
        return '{"type": "for", "name": "'+expression_0+'", "from": "'+EvalString_0+'", "to": "'+EvalString_1+'", "step": "'+EvalString_2+'"'+collapsed+disabled+',\n"data": [\n'+action_0+']},\n';
      },
      "args": [
        "expression_0",
        "EvalString_0",
        "EvalString_1",
        "EvalString_2",
        "action_0"
      ],
      "argsType": ["value","field","field","field","statement"],
      "argsGrammarName": ["expression","EvalString","EvalString","EvalString","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('for_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('for_s',inputs,isShadow,comment);
      }
    },
    "forEach_s": {
      "type": "statement",
      "json": {
        "type": "forEach_s",
        "message0": "循环遍历 : 以 %1 逐项读取列表 %2 %3 %4",
        "args0": [
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          Object.assign({},MotaActionBlocks.JsonEvalString,{
            "name": "JsonEvalString_0"
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "forEach：循环遍历列表",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "forEach_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','forEach_s');
        }
        var JsonEvalString_0 = block.getFieldValue('JsonEvalString_0');
        if (JsonEvalString_0==='') {
          throw new OmitedError(block,'JsonEvalString_0','forEach_s');
        }
        JsonEvalString_0 = MotaActionFunctions.pre('JsonEvalString')(JsonEvalString_0);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','forEach_s');
        }
        if (!/^temp:[A-Z]$/.test(expression_0)) {
          throw new Error('循环遍历仅允许使用临时变量！');
        }
        if (JsonEvalString_0 == '' || !(JSON.parse(JsonEvalString_0) instanceof Array)) {
          throw new Error('参数列表必须是个有效的数组！');
        }
        var collapsed=block.isCollapsed()?', "_collapsed": true':'';
        var disabled=block.isEnabled()?'':', "_disabled": true';
        return '{"type": "forEach", "name": "'+expression_0+'", "list": '+JsonEvalString_0 + collapsed+disabled+',\n"data": [\n'+action_0+']},\n';
      },
      "args": [
        "expression_0",
        "JsonEvalString_0",
        "action_0"
      ],
      "argsType": ["value","field","statement"],
      "argsGrammarName": ["expression","JsonEvalString","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('forEach_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('forEach_s',inputs,isShadow,comment);
      }
    },
    "while_s": {
      "type": "statement",
      "json": {
        "type": "while_s",
        "message0": "前置条件循环 ： 当 %1 时 %2 %3",
        "args0": [
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "while：前置条件循环",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "while_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','while_s');
        }
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','while_s');
        }
        var code = ['{"type": "while", "condition": "',expression_0,'",',
            block.isCollapsed()?' "_collapsed": true,':'',
            block.isEnabled()?'':' "_disabled": true,',
            '\n"data": [\n',action_0,'],\n',
        '},\n'].join('');
        return code;
      },
      "args": [
        "expression_0",
        "action_0"
      ],
      "argsType": ["value","statement"],
      "argsGrammarName": ["expression","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('while_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('while_s',inputs,isShadow,comment);
      }
    },
    "dowhile_s": {
      "type": "statement",
      "json": {
        "type": "dowhile_s",
        "message0": "后置条件循环 ： %1 %2 当 %3 时",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          },
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          }
        ],
        "tooltip": "dowhile：后置条件循环",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "dowhile_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','dowhile_s');
        }
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','dowhile_s');
        }
        var code = ['{"type": "dowhile", "condition": "',expression_0,'",',
            block.isCollapsed()?' "_collapsed": true,':'',
            block.isEnabled()?'':' "_disabled": true,',
            '\n"data": [\n',action_0,'],\n',
        '},\n'].join('');
        return code;
      },
      "args": [
        "action_0",
        "expression_0"
      ],
      "argsType": ["statement","value"],
      "argsGrammarName": ["action","expression"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('dowhile_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('dowhile_s',inputs,isShadow,comment);
      }
    },
    "break_s": {
      "type": "statement",
      "json": {
        "type": "break_s",
        "message0": "跳出循环或公共事件 层数 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 1
          })
        ],
        "inputsInline": true,
        "tooltip": "break：跳出循环或公共事件！",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "break_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        if (Int_0 <= 0) throw "层数至少为1！";
        var code = '{"type": "break", "n": '+Int_0+'},\n';
        return code;
      },
      "args": [
        "Int_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Int"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('break_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('break_s',inputs,isShadow,comment);
      }
    },
    "continue_s": {
      "type": "statement",
      "json": {
        "type": "continue_s",
        "message0": "提前结束循环或跳出公共事件 层数 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 1
          })
        ],
        "inputsInline": true,
        "tooltip": "continue：提前结束循环或跳出公共事件，或跳出公共事件！",
        "helpUrl": "/_docs/#/instruction",
        "colour": 220,
        "previousStatement": "continue_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        if (Int_0 <= 0) throw "层数至少为1！";
        var code = '{"type": "continue", "n": '+Int_0+'},\n';
        return code;
      },
      "args": [
        "Int_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Int"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('continue_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('continue_s',inputs,isShadow,comment);
      }
    },
    "wait_s": {
      "type": "statement",
      "json": {
        "type": "wait_s",
        "message0": "等待用户操作并获得按键或点击信息 仅检测子块 %1 超时毫秒数 %2 %3 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": true
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "waitContext_0",
            "check": MotaActionBlocks.waitContext
          }
        ],
        "tooltip": "wait: 等待用户操作并获得按键或点击信息",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "wait_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var waitContext_0 = Blockly.JavaScript.statementToCode(block, 'waitContext_0');
        Bool_0 = Bool_0?(', "forceChild": true'):'';
        Int_0 = Int_0?(', "timeout": ' + Int_0):'';
        waitContext_0 = waitContext_0 ? (', "data": [\n' + waitContext_0 + ']') : '';
        var collapsed=block.isCollapsed()?', "_collapsed": true':'';
        var disabled=block.isEnabled()?'':', "_disabled": true';
        var code = '{"type": "wait"' + Bool_0 + Int_0 + collapsed + disabled + waitContext_0 + '},\n';
        return code;
      },
      "args": [
        "Bool_0",
        "Int_0",
        "waitContext_0"
      ],
      "argsType": ["field","field","statement"],
      "argsGrammarName": ["Bool","Int","waitContext"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('wait_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('wait_s',inputs,isShadow,comment);
      }
    },
    "waitContext_1": {
      "type": "statement",
      "json": {
        "type": "waitContext_1",
        "message0": "按键的场合： 键值（右键查表） %1 不进行剩余判定 %2 %3 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "wait: 等待用户操作并获得按键或点击信息",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250,
        "previousStatement": "waitContext_1",
        "nextStatement": MotaActionBlocks.waitContext
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','waitContext_1');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','waitContext_1');
        }
        if (!/^\d+(,\d+)*$/.test(EvalString_0)) {
          throw new Error('键值必须是正整数，可以以逗号分隔');
        }
        Bool_0 = Bool_0?', "break": true':'';
        var collapsed=block.isCollapsed()?', "_collapsed": true':'';
        var disabled=block.isEnabled()?'':', "_disabled": true';
        var code = '{"case": "keyboard", "keycode": "' + EvalString_0 + '"'+Bool_0+collapsed+disabled+', "action": [\n' + action_0 + ']},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "Bool_0",
        "action_0"
      ],
      "argsType": ["field","field","statement"],
      "argsGrammarName": ["EvalString","Bool","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('waitContext_1',keyOrIndex);
      },
      "menu": [["查询键值表", "editor_blockly.showKeyCodes()"]],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('waitContext_1',inputs,isShadow,comment);
      }
    },
    "waitContext_2": {
      "type": "statement",
      "json": {
        "type": "waitContext_2",
        "message0": "点击的场合： 像素x范围 %1 ~ %2 ; y范围 %3 ~ %4 不进行剩余判定 %5 %6 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": 0
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": 32
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": 0
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": 32
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "wait: 等待用户操作并获得按键或点击信息",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250,
        "previousStatement": "waitContext_2",
        "nextStatement": MotaActionBlocks.waitContext
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','waitContext_2');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','waitContext_2');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','waitContext_2');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','waitContext_2');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','waitContext_2');
        }
        Bool_0 = Bool_0?', "break": true':'';
        var collapsed=block.isCollapsed()?', "_collapsed": true':'';
        var disabled=block.isEnabled()?'':', "_disabled": true';
        var code = '{"case": "mouse", "px": [' + PosString_0 + ',' + PosString_1 + '], "py": [' + PosString_2 + ',' + PosString_3 + ']'+Bool_0+collapsed+disabled+', "action": [\n' + action_0 + ']},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "Bool_0",
        "action_0"
      ],
      "argsType": ["field","field","field","field","field","statement"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","Bool","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('waitContext_2',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('waitContext_2',inputs,isShadow,comment);
      }
    },
    "waitContext_3": {
      "type": "statement",
      "json": {
        "type": "waitContext_3",
        "message0": "自定义条件的场合： %1 不进行剩余判定 %2 %3 %4",
        "args0": [
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": "true"
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "wait: 等待用户操作并获得按键或点击信息",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250,
        "previousStatement": "waitContext_3",
        "nextStatement": MotaActionBlocks.waitContext
      },
      "generFunc": function(block) {
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','waitContext_3');
        }
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','waitContext_3');
        }
        Bool_0 = Bool_0?', "break": true':'';
        var collapsed=block.isCollapsed()?', "_collapsed": true':'';
        var disabled=block.isEnabled()?'':', "_disabled": true';
        var code = '{"case": "condition", "condition": "'+expression_0+'"'+Bool_0+collapsed+disabled+', "action": [\n' + action_0 + ']},\n';
        return code;
      },
      "args": [
        "expression_0",
        "Bool_0",
        "action_0"
      ],
      "argsType": ["value","field","statement"],
      "argsGrammarName": ["expression","Bool","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('waitContext_3',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('waitContext_3',inputs,isShadow,comment);
      }
    },
    "waitContext_4": {
      "type": "statement",
      "json": {
        "type": "waitContext_4",
        "message0": "超时的场合： 不进行剩余判定 %1 %2 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "wait: 等待用户操作并获得按键或点击信息",
        "helpUrl": "/_docs/#/instruction",
        "colour": 250,
        "previousStatement": "waitContext_4",
        "nextStatement": MotaActionBlocks.waitContext
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','waitContext_4');
        }
        Bool_0 = Bool_0?', "break": true':'';
        var collapsed=block.isCollapsed()?', "_collapsed": true':'';
        var disabled=block.isEnabled()?'':', "_disabled": true';
        var code = '{"case": "timeout"'+Bool_0+collapsed+disabled+', "action": [\n' + action_0 + ']},\n';
        return code;
      },
      "args": [
        "Bool_0",
        "action_0"
      ],
      "argsType": ["field","statement"],
      "argsGrammarName": ["Bool","action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('waitContext_4',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('waitContext_4',inputs,isShadow,comment);
      }
    },
    "waitContext_empty": {
      "type": "statement",
      "json": {
        "type": "waitContext_empty",
        "message0": "",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 70,
        "previousStatement": "waitContext_empty",
        "nextStatement": MotaActionBlocks.waitContext
      },
      "generFunc": function(block) {
        return '';
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('waitContext_empty',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('waitContext_empty',inputs,isShadow,comment);
      }
    },
    "waitAsync_s": {
      "type": "statement",
      "json": {
        "type": "waitAsync_s",
        "message0": "等待所有异步事件执行完毕 不等待动画 %1 等待音效 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_1",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "waitAsync: 等待所有异步事件执行完毕",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "waitAsync_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Bool_1 = block.getFieldValue('Bool_1') === 'TRUE';
        Bool_1 = MotaActionFunctions.pre('Bool')(Bool_1);
        Bool_0 = Bool_0 ? ', "excludeAnimates": true' : '';
        Bool_1 = Bool_1 ? ', "includeSounds": true' : '';
        var code = '{"type": "waitAsync"'+Bool_0+Bool_1+'},\n';
        return code;
      },
      "args": [
        "Bool_0",
        "Bool_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["Bool","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('waitAsync_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('waitAsync_s',inputs,isShadow,comment);
      }
    },
    "stopAsync_s": {
      "type": "statement",
      "json": {
        "type": "stopAsync_s",
        "message0": "立刻结束所有异步事件 %1",
        "args0": [
          {
            "type": "input_dummy"
          }
        ],
        "tooltip": "stopAsync: 立刻结束所有异步事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "stopAsync_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var code = '{"type": "stopAsync"},\n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('stopAsync_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('stopAsync_s',inputs,isShadow,comment);
      }
    },
    "callBook_s": {
      "type": "statement",
      "json": {
        "type": "callBook_s",
        "message0": "呼出怪物手册",
        "inputsInline": true,
        "tooltip": "callBook: 呼出怪物手册；返回游戏后将继续执行后面的事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "callBook_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var code = '{"type": "callBook"},\n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('callBook_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('callBook_s',inputs,isShadow,comment);
      }
    },
    "callSave_s": {
      "type": "statement",
      "json": {
        "type": "callSave_s",
        "message0": "呼出存档页面",
        "inputsInline": true,
        "tooltip": "callSave: 呼出存档页面",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "callSave_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var code = '{"type": "callSave"},\n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('callSave_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('callSave_s',inputs,isShadow,comment);
      }
    },
    "autoSave_s": {
      "type": "statement",
      "json": {
        "type": "autoSave_s",
        "message0": "自动存档 读档到触发前 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "autoSave: 自动存档",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "autoSave_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        Bool_0 = Bool_0 ? (', "removeLast": true') : '';
        var code = '{"type": "autoSave"'+Bool_0+'},\n';
        return code;
      },
      "args": [
        "Bool_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('autoSave_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('autoSave_s',inputs,isShadow,comment);
      }
    },
    "forbidSave_s": {
      "type": "statement",
      "json": {
        "type": "forbidSave_s",
        "message0": "是否禁止存档 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "inputsInline": true,
        "tooltip": "forbidSave: 禁止存档",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "forbidSave_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        Bool_0 = Bool_0 ? (', "forbid": true') : '';
        var code = '{"type": "forbidSave"'+Bool_0+'},\n';
        return code;
      },
      "args": [
        "Bool_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('forbidSave_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('forbidSave_s',inputs,isShadow,comment);
      }
    },
    "callLoad_s": {
      "type": "statement",
      "json": {
        "type": "callLoad_s",
        "message0": "呼出读档页面",
        "inputsInline": true,
        "tooltip": "callLoad: 呼出存档页面；返回游戏后将继续执行后面的事件",
        "helpUrl": "/_docs/#/instruction",
        "colour": 20,
        "previousStatement": "callLoad_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var code = '{"type": "callLoad"},\n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('callLoad_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('callLoad_s',inputs,isShadow,comment);
      }
    },
    "previewUI_s": {
      "type": "statement",
      "json": {
        "type": "previewUI_s",
        "message0": "ui绘制并预览 （双击此项可进行预览） %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_statement",
            "name": "action_0",
            "check": MotaActionBlocks.action
          }
        ],
        "tooltip": "previewUI: ui绘制并预览",
        "helpUrl": "/_docs/#/instruction",
        "colour": 70,
        "previousStatement": "previewUI_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var action_0 = Blockly.JavaScript.statementToCode(block, 'action_0');
        if (action_0==='') {
          throw new OmitedError(block,'action_0','previewUI_s');
        }
        var collapsed=block.isCollapsed()?', "_collapsed": true':'';
        var disabled=block.isEnabled()?'':', "_disabled": true';
        var code = ['{"type": "previewUI"'+collapsed+disabled+', "action": [\n', action_0,']},\n'].join('');
        return code;
      },
      "args": [
        "action_0"
      ],
      "argsType": ["statement"],
      "argsGrammarName": ["action"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('previewUI_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('previewUI_s',inputs,isShadow,comment);
      }
    },
    "clearMap_s": {
      "type": "statement",
      "json": {
        "type": "clearMap_s",
        "message0": "清除画布 起点像素 x %1 y %2 宽 %3 高 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "clearMap: 清除画布",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "clearMap_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        PosString_0 = PosString_0 && (', "x": ' + PosString_0);
        PosString_1 = PosString_1 && (', "y": ' + PosString_1);
        PosString_2 = PosString_2 && (', "width": ' + PosString_2);
        PosString_3 = PosString_3 && (', "height": ' + PosString_3);
        var code = '{"type": "clearMap"'+PosString_0+PosString_1+PosString_2+PosString_3+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('clearMap_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('clearMap_s',inputs,isShadow,comment);
      }
    },
    "setAttribute_s": {
      "type": "statement",
      "json": {
        "type": "setAttribute_s",
        "message0": "设置画布属性 字体 %1 填充样式 %2 %3 边框样式 %4 %5 %6 线宽度 %7 不透明度 %8 对齐 %9 基准线 %10 z值 %11",
        "args0": [
          Object.assign({},MotaActionBlocks.FontString,{
            "name": "FontString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_1",
            "colour": "rgba(255,255,255,1)"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.TextAlign_List,{
            "name": "TextAlign_List_0"
          }),
          Object.assign({},MotaActionBlocks.TextBaseline_List,{
            "name": "TextBaseline_List_0"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_1",
            "text": ""
          })
        ],
        "tooltip": "setAttribute：设置画布属性",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "setAttribute_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var FontString_0 = block.getFieldValue('FontString_0');
        FontString_0 = MotaActionFunctions.pre('FontString')(FontString_0);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var ColorString_1 = block.getFieldValue('ColorString_1');
        ColorString_1 = MotaActionFunctions.pre('ColorString')(ColorString_1);
        var Colour_1 = block.getFieldValue('Colour_1');
        Colour_1 = MotaActionFunctions.pre('Colour')(Colour_1);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var TextAlign_List_0 = block.getFieldValue('TextAlign_List_0');
        TextAlign_List_0 = MotaActionFunctions.pre('TextAlign_List')(TextAlign_List_0);
        var TextBaseline_List_0 = block.getFieldValue('TextBaseline_List_0');
        TextBaseline_List_0 = MotaActionFunctions.pre('TextBaseline_List')(TextBaseline_List_0);
        var IntString_1 = block.getFieldValue('IntString_1');
        IntString_1 = MotaActionFunctions.pre('IntString')(IntString_1);
        TextAlign_List_0 = TextAlign_List_0==='null'?'': ', "align": "'+TextAlign_List_0+'"';
        TextBaseline_List_0 = TextBaseline_List_0==='null'?'': ', "baseline": "'+TextBaseline_List_0+'"';
        FontString_0 = FontString_0 ? (', "font": "' + FontString_0 + '"') : '';
        ColorString_0 = ColorString_0 ? (', "fillStyle": ['+ColorString_0+']') : '';
        ColorString_1 = ColorString_1 ? (', "strokeStyle": ['+ColorString_1+']') : '';
        IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
        if (EvalString_0) {
          var f = parseFloat(EvalString_0);
          if (isNaN(f) || f<0 || f>1) throw new Error('不透明度必须是0到1的浮点数或不填');
          EvalString_0 = ', "alpha": '+EvalString_0;
        }
        IntString_1 = IntString_1 ? (', "z": '+IntString_1) : '';
        var code = '{"type": "setAttribute"'+FontString_0+ColorString_0+ColorString_1+IntString_0+
          EvalString_0+TextAlign_List_0+TextBaseline_List_0+IntString_1+'},\n';
        return code;
      },
      "args": [
        "FontString_0",
        "ColorString_0",
        "Colour_0",
        "ColorString_1",
        "Colour_1",
        "IntString_0",
        "EvalString_0",
        "TextAlign_List_0",
        "TextBaseline_List_0",
        "IntString_1"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["FontString","ColorString","Colour","ColorString","Colour","IntString","EvalString","TextAlign_List","TextBaseline_List","IntString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setAttribute_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setAttribute_s',inputs,isShadow,comment);
      }
    },
    "setFilter_s": {
      "type": "statement",
      "json": {
        "type": "setFilter_s",
        "message0": "设置画布特效 虚化 %1 色相 %2 灰度 %3 反色 %4 阴影 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_1",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          Object.assign({},MotaActionBlocks.Number,{
            "name": "Number_2",
            "value": 0
          })
        ],
        "inputsInline": true,
        "tooltip": "setFilter: 设置画布特效",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "setFilter_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Number_0 = block.getFieldValue('Number_0');
        Number_0 = MotaActionFunctions.pre('Number')(Number_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var Number_1 = block.getFieldValue('Number_1');
        Number_1 = MotaActionFunctions.pre('Number')(Number_1);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var Number_2 = block.getFieldValue('Number_2');
        Number_2 = MotaActionFunctions.pre('Number')(Number_2);
        if (Number_0 < 0) throw '虚化不得小于0；0为完全没有虚化';
        if (Int_0 < 0 || Int_0 >= 360) throw '色相需要在0~359之间';
        if (Number_1 < 0 || Number_1 > 1) throw '灰度需要在0~1之间';
        if (Number_2 < 0) throw '阴影不得小于0；0为完全没有阴影';
        var code = '{"type": "setFilter", "blur": '+Number_0+', "hue": '+Int_0+', "grayscale": '+Number_1+', "invert": '+Bool_0+', "shadow": '+Number_2+'},\n';
        return code;
      },
      "args": [
        "Number_0",
        "Int_0",
        "Number_1",
        "Bool_0",
        "Number_2"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["Number","Int","Number","Bool","Number"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('setFilter_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('setFilter_s',inputs,isShadow,comment);
      }
    },
    "fillText_s": {
      "type": "statement",
      "json": {
        "type": "fillText_s",
        "message0": "绘制文本 x %1 y %2 样式 %3 %4 字体 %5 最大宽度 %6 %7 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.FontString,{
            "name": "FontString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "绘制一行文本"
          })
        ],
        "tooltip": "fillText：绘制一行文本；可以设置最大宽度进行放缩",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "fillText_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','fillText_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','fillText_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var FontString_0 = block.getFieldValue('FontString_0');
        FontString_0 = MotaActionFunctions.pre('FontString')(FontString_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','fillText_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        FontString_0 = FontString_0 ? (', "font": "' + FontString_0 + '"') : '';
        IntString_0 = IntString_0 ? (', "maxWidth": '+IntString_0) : '';
        var code = '{"type": "fillText", "x": '+PosString_0+', "y": '+PosString_1+ColorString_0+FontString_0+IntString_0+', "text": "'+EvalString_0+'"},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "ColorString_0",
        "Colour_0",
        "FontString_0",
        "IntString_0",
        "EvalString_0"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","ColorString","Colour","FontString","IntString","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('fillText_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('fillText_s',inputs,isShadow,comment);
      }
    },
    "fillBoldText_s": {
      "type": "statement",
      "json": {
        "type": "fillBoldText_s",
        "message0": "绘制描边文本 x %1 y %2 样式 %3 %4 描边颜色 %5 %6 字体 %7 %8 %9",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_1",
            "colour": "rgba(0,0,0,1)"
          }),
          Object.assign({},MotaActionBlocks.FontString,{
            "name": "FontString_0",
            "text": ""
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "绘制一行描边文本"
          })
        ],
        "tooltip": "fillBoldText：绘制一行描边文本",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "fillBoldText_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','fillBoldText_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','fillBoldText_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var ColorString_1 = block.getFieldValue('ColorString_1');
        ColorString_1 = MotaActionFunctions.pre('ColorString')(ColorString_1);
        var Colour_1 = block.getFieldValue('Colour_1');
        Colour_1 = MotaActionFunctions.pre('Colour')(Colour_1);
        var FontString_0 = block.getFieldValue('FontString_0');
        FontString_0 = MotaActionFunctions.pre('FontString')(FontString_0);
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','fillBoldText_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        ColorString_1 = ColorString_1 ? (', "strokeStyle": ['+ColorString_1+']') : '';
        FontString_0 = FontString_0 ? (', "font": "' + FontString_0 + '"') : '';
        var code = '{"type": "fillBoldText", "x": '+PosString_0+', "y": '+PosString_1+ColorString_0+ColorString_1+FontString_0+', "text": "'+EvalString_0+'"},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "ColorString_0",
        "Colour_0",
        "ColorString_1",
        "Colour_1",
        "FontString_0",
        "EvalString_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","ColorString","Colour","ColorString","Colour","FontString","EvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('fillBoldText_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('fillBoldText_s',inputs,isShadow,comment);
      }
    },
    "drawTextContent_s": {
      "type": "statement",
      "json": {
        "type": "drawTextContent_s",
        "message0": "绘制多行文本 %1 %2 起点像素 x %3 y %4 最大宽度 %5 颜色 %6 %7 %8 对齐 %9 字体大小 %10 行距 %11 粗体 %12",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": "绘制多行文本\\n可双击编辑"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.TextAlign_List,{
            "name": "TextAlign_List_0"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_1",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          })
        ],
        "tooltip": "drawTextContent：绘制多行文本",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "drawTextContent_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        if (EvalString_Multi_0==='') {
          throw new OmitedError(block,'EvalString_Multi_0','drawTextContent_s');
        }
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','drawTextContent_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','drawTextContent_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var TextAlign_List_0 = block.getFieldValue('TextAlign_List_0');
        TextAlign_List_0 = MotaActionFunctions.pre('TextAlign_List')(TextAlign_List_0);
        var IntString_1 = block.getFieldValue('IntString_1');
        IntString_1 = MotaActionFunctions.pre('IntString')(IntString_1);
        var IntString_2 = block.getFieldValue('IntString_2');
        IntString_2 = MotaActionFunctions.pre('IntString')(IntString_2);
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        TextAlign_List_0 = TextAlign_List_0==='null'?'': ', "align": "'+TextAlign_List_0+'"';
        Bool_0 = Bool_0 ?  (', "bold": true') : '';
        IntString_0 = IntString_0 ? (', "maxWidth": '+IntString_0) : '';
        IntString_1 = IntString_1 ? (', "fontSize": '+IntString_1) : '';
        IntString_2 = IntString_2 ? (', "lineHeight": '+IntString_2) : '';
        ColorString_0 = ColorString_0 ? (', "color": ['+ColorString_0+']') : '';
        var code = '{"type": "drawTextContent", "text": "'+EvalString_Multi_0+'", "left": '+PosString_0+', "top": '+PosString_1+TextAlign_List_0+IntString_0+IntString_1+IntString_2+ColorString_0+Bool_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_Multi_0",
        "PosString_0",
        "PosString_1",
        "IntString_0",
        "ColorString_0",
        "Colour_0",
        "TextAlign_List_0",
        "IntString_1",
        "IntString_2",
        "Bool_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString_Multi","PosString","PosString","IntString","ColorString","Colour","TextAlign_List","IntString","IntString","Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('drawTextContent_s',keyOrIndex);
      },
      "menu": [['预览多行文本','editor_blockly.previewBlock(block)']],
      "doubleclicktext": "EvalString_Multi_0",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('drawTextContent_s',inputs,isShadow,comment);
      }
    },
    "fillRect_s": {
      "type": "statement",
      "json": {
        "type": "fillRect_s",
        "message0": "绘制矩形 起点像素 x %1 y %2 宽 %3 高 %4 圆角半径 %5 旋转度数 %6 颜色 %7 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "flag:x"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "300"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_4",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_5",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          })
        ],
        "inputsInline": true,
        "tooltip": "fillRect：绘制矩形",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "fillRect_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','fillRect_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','fillRect_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','fillRect_s');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','fillRect_s');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var PosString_4 = block.getFieldValue('PosString_4');
        PosString_4 = MotaActionFunctions.pre('PosString')(PosString_4);
        var PosString_5 = block.getFieldValue('PosString_5');
        PosString_5 = MotaActionFunctions.pre('PosString')(PosString_5);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        PosString_4 = PosString_4 ? (', "radius": '+PosString_4) : '';
        PosString_5 = PosString_5 ? (', "angle": ' + PosString_5) : '';
        var code = '{"type": "fillRect", "x": '+PosString_0+', "y": '+PosString_1+', "width": '+PosString_2+', "height": '+PosString_3+PosString_4+PosString_5+ColorString_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "PosString_4",
        "PosString_5",
        "ColorString_0",
        "Colour_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","PosString","PosString","ColorString","Colour"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('fillRect_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('fillRect_s',inputs,isShadow,comment);
      }
    },
    "strokeRect_s": {
      "type": "statement",
      "json": {
        "type": "strokeRect_s",
        "message0": "绘制矩形边框 起点像素 x %1 y %2 宽 %3 高 %4 圆角半径 %5 旋转度数 %6 颜色 %7 %8 线宽 %9",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "flag:x"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "300"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_4",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_5",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "strokeRect：绘制矩形边框",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "strokeRect_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','strokeRect_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','strokeRect_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','strokeRect_s');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','strokeRect_s');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var PosString_4 = block.getFieldValue('PosString_4');
        PosString_4 = MotaActionFunctions.pre('PosString')(PosString_4);
        var PosString_5 = block.getFieldValue('PosString_5');
        PosString_5 = MotaActionFunctions.pre('PosString')(PosString_5);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
        PosString_4 = PosString_4 ? (', "radius": '+PosString_4) : '';
        PosString_5 = PosString_5 ? (', "angle": ' + PosString_5) : '';
        var code = '{"type": "strokeRect", "x": '+PosString_0+', "y": '+PosString_1+', "width": '+PosString_2+', "height": '+PosString_3+PosString_4+PosString_5+ColorString_0+IntString_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "PosString_4",
        "PosString_5",
        "ColorString_0",
        "Colour_0",
        "IntString_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","PosString","PosString","ColorString","Colour","IntString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('strokeRect_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('strokeRect_s',inputs,isShadow,comment);
      }
    },
    "drawLine_s": {
      "type": "statement",
      "json": {
        "type": "drawLine_s",
        "message0": "绘制线段 起点像素 x %1 y %2 终点像素 x %3 y %4 颜色 %5 %6 线宽 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "flag:x"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "300"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "drawLine：绘制线段",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "drawLine_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','drawLine_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','drawLine_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','drawLine_s');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','drawLine_s');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
        var code = '{"type": "drawLine", "x1": '+PosString_0+', "y1": '+PosString_1+', "x2": '+PosString_2+', "y2": '+PosString_3+ColorString_0+IntString_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "ColorString_0",
        "Colour_0",
        "IntString_0"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","ColorString","Colour","IntString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('drawLine_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('drawLine_s',inputs,isShadow,comment);
      }
    },
    "drawArrow_s": {
      "type": "statement",
      "json": {
        "type": "drawArrow_s",
        "message0": "绘制箭头 起点像素 x %1 y %2 终点像素 x %3 y %4 颜色 %5 %6 线宽 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "flag:x"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "300"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "drawArrow：绘制箭头",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "drawArrow_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','drawArrow_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','drawArrow_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','drawArrow_s');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','drawArrow_s');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
        var code = '{"type": "drawArrow", "x1": '+PosString_0+', "y1": '+PosString_1+', "x2": '+PosString_2+', "y2": '+PosString_3+ColorString_0+IntString_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "ColorString_0",
        "Colour_0",
        "IntString_0"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","ColorString","Colour","IntString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('drawArrow_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('drawArrow_s',inputs,isShadow,comment);
      }
    },
    "fillPolygon_s": {
      "type": "statement",
      "json": {
        "type": "fillPolygon_s",
        "message0": "绘制多边形 顶点像素列表 x %1 y %2 颜色 %3 %4",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "0,0,100"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "0,100,0"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          })
        ],
        "inputsInline": true,
        "tooltip": "fillPolygon：绘制多边形",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "fillPolygon_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','fillPolygon_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','fillPolygon_s');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
        if(!pattern2.test(EvalString_0) || !pattern2.test(EvalString_1))throw new Error('坐标格式错误,请右键点击帮助查看格式');
        EvalString_0=EvalString_0.split(',');
        EvalString_1=EvalString_1.split(',');
        if(EvalString_0.length!==EvalString_1.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
        for(var ii=0;ii<EvalString_0.length;ii++)EvalString_0[ii]='['+EvalString_0[ii]+','+EvalString_1[ii]+']';
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        var code = '{"type": "fillPolygon", "nodes": ['+EvalString_0+']'+ColorString_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "ColorString_0",
        "Colour_0"
      ],
      "argsType": ["field","field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","ColorString","Colour"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('fillPolygon_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('fillPolygon_s',inputs,isShadow,comment);
      }
    },
    "strokePolygon_s": {
      "type": "statement",
      "json": {
        "type": "strokePolygon_s",
        "message0": "绘制多边形边框 顶点像素列表 x %1 y %2 颜色 %3 %4 线宽 %5",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "0,0,100"
          }),
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_1",
            "text": "0,100,0"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "strokePolygon：绘制多边形边框",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "strokePolygon_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','strokePolygon_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var EvalString_1 = block.getFieldValue('EvalString_1');
        if (EvalString_1==='') {
          throw new OmitedError(block,'EvalString_1','strokePolygon_s');
        }
        EvalString_1 = MotaActionFunctions.pre('EvalString')(EvalString_1);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        var pattern2 = /^([+-]?\d+)(,[+-]?\d+)*$/;
        if(!pattern2.test(EvalString_0) || !pattern2.test(EvalString_1))throw new Error('坐标格式错误,请右键点击帮助查看格式');
        EvalString_0=EvalString_0.split(',');
        EvalString_1=EvalString_1.split(',');
        if(EvalString_0.length!==EvalString_1.length)throw new Error('坐标格式错误,请右键点击帮助查看格式');
        for(var ii=0;ii<EvalString_0.length;ii++)EvalString_0[ii]='['+EvalString_0[ii]+','+EvalString_1[ii]+']';
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
        var code = '{"type": "strokePolygon", "nodes": ['+EvalString_0+']'+ColorString_0+IntString_0+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "EvalString_1",
        "ColorString_0",
        "Colour_0",
        "IntString_0"
      ],
      "argsType": ["field","field","field","field","field"],
      "argsGrammarName": ["EvalString","EvalString","ColorString","Colour","IntString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('strokePolygon_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('strokePolygon_s',inputs,isShadow,comment);
      }
    },
    "fillEllipse_s": {
      "type": "statement",
      "json": {
        "type": "fillEllipse_s",
        "message0": "绘制椭圆 中心 x %1 y %2 长半径 %3 短半径 %4 旋转度数 %5 颜色 %6 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "100"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "100"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_4",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          })
        ],
        "inputsInline": true,
        "tooltip": "fillEllipse：绘制椭圆",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "fillEllipse_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','fillEllipse_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','fillEllipse_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','fillEllipse_s');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','fillEllipse_s');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var PosString_4 = block.getFieldValue('PosString_4');
        PosString_4 = MotaActionFunctions.pre('PosString')(PosString_4);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        PosString_4 = PosString_4 ? (', "angle": ' + PosString_4) : '';
        var code = '{"type": "fillEllipse", "x": '+PosString_0+', "y": '+PosString_1+', "a": '+PosString_2+', "b": '+PosString_3+PosString_4+ColorString_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "PosString_4",
        "ColorString_0",
        "Colour_0"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","PosString","ColorString","Colour"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('fillEllipse_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('fillEllipse_s',inputs,isShadow,comment);
      }
    },
    "strokeEllipse_s": {
      "type": "statement",
      "json": {
        "type": "strokeEllipse_s",
        "message0": "绘制椭圆边框 中心 x %1 y %2 长半径 %3 短半径 %4 旋转度数 %5 颜色 %6 %7 线宽 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "100"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "100"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_4",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "strokeEllipse：绘制椭圆边框",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "strokeEllipse_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','strokeEllipse_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','strokeEllipse_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','strokeEllipse_s');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','strokeEllipse_s');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var PosString_4 = block.getFieldValue('PosString_4');
        PosString_4 = MotaActionFunctions.pre('PosString')(PosString_4);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
        PosString_4 = PosString_4 ? (', "angle": ' + PosString_4) : '';
        var code = '{"type": "strokeEllipse", "x": '+PosString_0+', "y": '+PosString_1+', "a": '+PosString_2+', "b": '+PosString_3+PosString_4+ColorString_0+IntString_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "PosString_4",
        "ColorString_0",
        "Colour_0",
        "IntString_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","PosString","ColorString","Colour","IntString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('strokeEllipse_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('strokeEllipse_s',inputs,isShadow,comment);
      }
    },
    "fillArc_s": {
      "type": "statement",
      "json": {
        "type": "fillArc_s",
        "message0": "绘制扇形 中心 x %1 y %2 半径 %3 起点角度 %4 终点角度 %5 颜色 %6 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "100"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_4",
            "text": "90"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          })
        ],
        "inputsInline": true,
        "tooltip": "fillArc：绘制扇形",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "fillArc_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','fillArc_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','fillArc_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','fillArc_s');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','fillArc_s');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var PosString_4 = block.getFieldValue('PosString_4');
        if (PosString_4==='') {
          throw new OmitedError(block,'PosString_4','fillArc_s');
        }
        PosString_4 = MotaActionFunctions.pre('PosString')(PosString_4);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        var code = '{"type": "fillArc", "x": '+PosString_0+', "y": '+PosString_1+', "r": '+PosString_2+', "start": '+PosString_3+', "end": '+PosString_4+ColorString_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "PosString_4",
        "ColorString_0",
        "Colour_0"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","PosString","ColorString","Colour"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('fillArc_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('fillArc_s',inputs,isShadow,comment);
      }
    },
    "strokeArc_s": {
      "type": "statement",
      "json": {
        "type": "strokeArc_s",
        "message0": "绘制弧 中心 x %1 y %2 半径 %3 起点角度 %4 终点角度 %5 颜色 %6 %7 线宽 %8",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "100"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_4",
            "text": "90"
          }),
          Object.assign({},MotaActionBlocks.ColorString,{
            "name": "ColorString_0",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.IntString,{
            "name": "IntString_0",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "strokeArc：绘制弧",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "strokeArc_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','strokeArc_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','strokeArc_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','strokeArc_s');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','strokeArc_s');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var PosString_4 = block.getFieldValue('PosString_4');
        if (PosString_4==='') {
          throw new OmitedError(block,'PosString_4','strokeArc_s');
        }
        PosString_4 = MotaActionFunctions.pre('PosString')(PosString_4);
        var ColorString_0 = block.getFieldValue('ColorString_0');
        ColorString_0 = MotaActionFunctions.pre('ColorString')(ColorString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var IntString_0 = block.getFieldValue('IntString_0');
        IntString_0 = MotaActionFunctions.pre('IntString')(IntString_0);
        ColorString_0 = ColorString_0 ? (', "style": ['+ColorString_0+']') : '';
        IntString_0 = IntString_0 ? (', "lineWidth": '+IntString_0) : '';
        var code = '{"type": "strokeArc", "x": '+PosString_0+', "y": '+PosString_1+', "r": '+PosString_2+', "start": '+PosString_3+', "end": '+PosString_4+ColorString_0+IntString_0+'},\n';
        return code;
      },
      "args": [
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "PosString_4",
        "ColorString_0",
        "Colour_0",
        "IntString_0"
      ],
      "argsType": ["field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["PosString","PosString","PosString","PosString","PosString","ColorString","Colour","IntString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('strokeArc_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('strokeArc_s',inputs,isShadow,comment);
      }
    },
    "drawImage_s": {
      "type": "statement",
      "json": {
        "type": "drawImage_s",
        "message0": "绘制图片 %1 翻转 %2 起点像素 x %3 y %4 宽 %5 高 %6 旋转度数 %7",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "bg.jpg"
          }),
          Object.assign({},MotaActionBlocks.Reverse_List,{
            "name": "Reverse_List_0",
            "default": "null"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_4",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "drawImage：绘制图片",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "drawImage_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','drawImage_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Reverse_List_0 = block.getFieldValue('Reverse_List_0');
        Reverse_List_0 = MotaActionFunctions.pre('Reverse_List')(Reverse_List_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','drawImage_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','drawImage_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var PosString_4 = block.getFieldValue('PosString_4');
        PosString_4 = MotaActionFunctions.pre('PosString')(PosString_4);
        if (Reverse_List_0 && Reverse_List_0 != 'null') {
            Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
        } else Reverse_List_0 = '';
        PosString_2 = PosString_2 ? (', "w": '+PosString_2) : '';
        PosString_3 = PosString_3 ? (', "h": '+PosString_3) : '';
        PosString_4 = PosString_4 ? (', "angle": ' + PosString_4) : '';
        var code = '{"type": "drawImage", "image": "'+EvalString_0+'"'+Reverse_List_0+', "x": '+PosString_0+', "y": '+PosString_1+PosString_2+PosString_3+PosString_4+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "Reverse_List_0",
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "PosString_4"
      ],
      "argsType": ["field","field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","Reverse_List","PosString","PosString","PosString","PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('drawImage_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "allImages": "['EvalString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('drawImage_s',inputs,isShadow,comment);
      }
    },
    "drawImage_1_s": {
      "type": "statement",
      "json": {
        "type": "drawImage_1_s",
        "message0": "绘制图片 %1 翻转 %2 裁剪的起点像素 x %3 y %4 宽 %5 高 %6 %7 绘制的起点像素 x %8 y %9 宽 %10 高 %11 旋转度数 %12",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "bg.jpg"
          }),
          Object.assign({},MotaActionBlocks.Reverse_List,{
            "name": "Reverse_List_0",
            "default": "null"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "32"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "32"
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_4",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_5",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_6",
            "text": "32"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_7",
            "text": "32"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_8",
            "text": ""
          })
        ],
        "tooltip": "drawImage：绘制图片",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "drawImage_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','drawImage_1_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Reverse_List_0 = block.getFieldValue('Reverse_List_0');
        Reverse_List_0 = MotaActionFunctions.pre('Reverse_List')(Reverse_List_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','drawImage_1_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','drawImage_1_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','drawImage_1_s');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','drawImage_1_s');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var PosString_4 = block.getFieldValue('PosString_4');
        if (PosString_4==='') {
          throw new OmitedError(block,'PosString_4','drawImage_1_s');
        }
        PosString_4 = MotaActionFunctions.pre('PosString')(PosString_4);
        var PosString_5 = block.getFieldValue('PosString_5');
        if (PosString_5==='') {
          throw new OmitedError(block,'PosString_5','drawImage_1_s');
        }
        PosString_5 = MotaActionFunctions.pre('PosString')(PosString_5);
        var PosString_6 = block.getFieldValue('PosString_6');
        if (PosString_6==='') {
          throw new OmitedError(block,'PosString_6','drawImage_1_s');
        }
        PosString_6 = MotaActionFunctions.pre('PosString')(PosString_6);
        var PosString_7 = block.getFieldValue('PosString_7');
        if (PosString_7==='') {
          throw new OmitedError(block,'PosString_7','drawImage_1_s');
        }
        PosString_7 = MotaActionFunctions.pre('PosString')(PosString_7);
        var PosString_8 = block.getFieldValue('PosString_8');
        PosString_8 = MotaActionFunctions.pre('PosString')(PosString_8);
        if (Reverse_List_0 && Reverse_List_0 != 'null') {
            Reverse_List_0 = ', "reverse": "' + Reverse_List_0 + '"';
        } else Reverse_List_0 = '';
        PosString_8 = PosString_8 ? (', "angle": ' + PosString_8) : '';
        var code = '{"type": "drawImage", "image": "'+EvalString_0+'"'+Reverse_List_0+
                   ', "x": '+PosString_0+', "y": '+PosString_1+', "w": '+PosString_2+', "h": '+PosString_3+
                   ', "x1": '+PosString_4+', "y1": '+PosString_5+', "w1": '+PosString_6+', "h1": '+PosString_7+PosString_8+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "Reverse_List_0",
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3",
        "PosString_4",
        "PosString_5",
        "PosString_6",
        "PosString_7",
        "PosString_8"
      ],
      "argsType": ["field","field","field","field","field","field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","Reverse_List","PosString","PosString","PosString","PosString","PosString","PosString","PosString","PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('drawImage_1_s',keyOrIndex);
      },
      "menu": [],
      "allImages": "['EvalString_0']",
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('drawImage_1_s',inputs,isShadow,comment);
      }
    },
    "drawIcon_s": {
      "type": "statement",
      "json": {
        "type": "drawIcon_s",
        "message0": "绘制图标 ID %1 帧 %2 起点像素 x %3 y %4 宽 %5 高 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "yellowKey"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": ""
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": ""
          })
        ],
        "inputsInline": true,
        "tooltip": "drawIcon：绘制图标",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "drawIcon_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','drawIcon_s');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','drawIcon_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','drawIcon_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        Int_0 = Int_0 ? (', "frame": '+Int_0) : '';
        PosString_2 = PosString_2 ? (', "width": '+PosString_2) : '';
        PosString_3 = PosString_3 ? (', "height": '+PosString_3) : '';
        var code = '{"type": "drawIcon", "id": "'+IdString_0+'"'+Int_0+', "x": '+PosString_0+', "y": '+PosString_1+PosString_2+PosString_3+'},\n';
        return code;
      },
      "args": [
        "IdString_0",
        "Int_0",
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3"
      ],
      "argsType": ["field","field","field","field","field","field"],
      "argsGrammarName": ["IdString","Int","PosString","PosString","PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('drawIcon_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "allIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('drawIcon_s',inputs,isShadow,comment);
      }
    },
    "drawBackground_s": {
      "type": "statement",
      "json": {
        "type": "drawBackground_s",
        "message0": "绘制背景图 %1 %2 起点像素 x %3 y %4 宽 %5 高 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "winskin.png"
          }),
          Object.assign({},MotaActionBlocks.Colour,{
            "name": "Colour_0",
            "colour": "rgba(255,255,255,1)"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "100"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "100"
          })
        ],
        "inputsInline": true,
        "tooltip": "drawBackground：绘制背景",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "drawBackground_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','drawBackground_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Colour_0 = block.getFieldValue('Colour_0');
        Colour_0 = MotaActionFunctions.pre('Colour')(Colour_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','drawBackground_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','drawBackground_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','drawBackground_s');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','drawBackground_s');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var colorRe = MotaActionFunctions.pattern.colorRe;
        if (colorRe.test(EvalString_0)) {
          EvalString_0 = ', "background": ['+EvalString_0+']';
        }
        else if (/^\w+\.png$/.test(EvalString_0)) {
          EvalString_0 = ', "background": "'+EvalString_0+'"';
        }
        else {
          throw new Error('背景格式错误,必须是形如0~255,0~255,0~255,0~1的颜色，或一个WindowSkin的png图片名称');
        }
        var code = '{"type": "drawBackground"'+EvalString_0+', "x": '+PosString_0+', "y": '+PosString_1+', "width": '+PosString_2+', "height": '+PosString_3+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "Colour_0",
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3"
      ],
      "argsType": ["field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","Colour","PosString","PosString","PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('drawBackground_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('drawBackground_s',inputs,isShadow,comment);
      }
    },
    "drawSelector_s": {
      "type": "statement",
      "json": {
        "type": "drawSelector_s",
        "message0": "绘制闪烁光标 %1 编号 %2 起点像素 x %3 y %4 宽 %5 高 %6",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString,{
            "name": "EvalString_0",
            "text": "winskin.png"
          }),
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": "1"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": "0"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_2",
            "text": "100"
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_3",
            "text": "100"
          })
        ],
        "inputsInline": true,
        "tooltip": "drawSelector：绘制闪烁光标",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "drawSelector_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var EvalString_0 = block.getFieldValue('EvalString_0');
        if (EvalString_0==='') {
          throw new OmitedError(block,'EvalString_0','drawSelector_s');
        }
        EvalString_0 = MotaActionFunctions.pre('EvalString')(EvalString_0);
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','drawSelector_s');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','drawSelector_s');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        var PosString_2 = block.getFieldValue('PosString_2');
        if (PosString_2==='') {
          throw new OmitedError(block,'PosString_2','drawSelector_s');
        }
        PosString_2 = MotaActionFunctions.pre('PosString')(PosString_2);
        var PosString_3 = block.getFieldValue('PosString_3');
        if (PosString_3==='') {
          throw new OmitedError(block,'PosString_3','drawSelector_s');
        }
        PosString_3 = MotaActionFunctions.pre('PosString')(PosString_3);
        var code = '{"type": "drawSelector", "image": "'+EvalString_0+'", "code": '+Int_0+', "x": '+PosString_0+', "y": '+PosString_1+', "width": '+PosString_2+', "height": '+PosString_3+'},\n';
        return code;
      },
      "args": [
        "EvalString_0",
        "Int_0",
        "PosString_0",
        "PosString_1",
        "PosString_2",
        "PosString_3"
      ],
      "argsType": ["field","field","field","field","field","field"],
      "argsGrammarName": ["EvalString","Int","PosString","PosString","PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('drawSelector_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('drawSelector_s',inputs,isShadow,comment);
      }
    },
    "drawSelector_1_s": {
      "type": "statement",
      "json": {
        "type": "drawSelector_1_s",
        "message0": "清除闪烁光标 编号 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": "1"
          })
        ],
        "inputsInline": true,
        "tooltip": "drawSelector：清除闪烁光标",
        "helpUrl": "/_docs/#/instruction",
        "colour": 359,
        "previousStatement": "drawSelector_1_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var code = '{"type": "drawSelector", "code": '+Int_0+'},\n';
        return code;
      },
      "args": [
        "Int_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Int"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('drawSelector_1_s',keyOrIndex);
      },
      "menu": [],
      "previewBlock": "true",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('drawSelector_1_s',inputs,isShadow,comment);
      }
    },
    "unknown_s": {
      "type": "statement",
      "json": {
        "type": "unknown_s",
        "message0": "自定义事件 %1 %2",
        "args0": [
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.JsonEvalString,{
            "name": "JsonEvalString_0",
            "text": "{\"type\":\"test\", \"data\": \"这是自定义的参数\"}"
          })
        ],
        "tooltip": "通过脚本自定义的事件类型, 以及编辑器不识别的事件类型",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "unknown_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var JsonEvalString_0 = block.getFieldValue('JsonEvalString_0');
        if (JsonEvalString_0==='') {
          throw new OmitedError(block,'JsonEvalString_0','unknown_s');
        }
        JsonEvalString_0 = MotaActionFunctions.pre('JsonEvalString')(JsonEvalString_0);
        try {
            var tempobj = JSON.parse(JsonEvalString_0);
        } catch (e) {throw new Error("不合法的JSON格式！");}
        if (!tempobj.type) throw new Error("自定义事件需要一个type:xxx");
        var code = JSON.stringify(tempobj) +',\n';
        return code;
      },
      "args": [
        "JsonEvalString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["JsonEvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('unknown_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('unknown_s',inputs,isShadow,comment);
      }
    },
    "function_s": {
      "type": "statement",
      "json": {
        "type": "function_s",
        "message0": "自定义JS脚本 不自动执行下一个事件 %1 %2 %3",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0",
            "checked": false
          }),
          {
            "type": "input_dummy"
          },
          Object.assign({},MotaActionBlocks.RawEvalString,{
            "name": "RawEvalString_0",
            "text": "alert(core.getStatus(\"atk\"));"
          })
        ],
        "tooltip": "可双击多行编辑，请勿使用异步代码。常见API参见文档附录。",
        "helpUrl": "/_docs/#/instruction",
        "colour": 130,
        "previousStatement": "function_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var RawEvalString_0 = block.getFieldValue('RawEvalString_0');
        if (RawEvalString_0==='') {
          throw new OmitedError(block,'RawEvalString_0','function_s');
        }
        RawEvalString_0 = MotaActionFunctions.pre('RawEvalString')(RawEvalString_0);
        Bool_0 = Bool_0?', "async": true':'';
        var code = '{"type": "function"'+Bool_0+', "function": "function(){\\n'+JSON.stringify(RawEvalString_0).slice(1,-1).split('\\\\n').join('\\n')+'\\n}"},\n';
        return code;
      },
      "args": [
        "Bool_0",
        "RawEvalString_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["Bool","RawEvalString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('function_s',keyOrIndex);
      },
      "menu": [],
      "doubleclicktext": "RawEvalString_0",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('function_s',inputs,isShadow,comment);
      }
    },
    "pass_s": {
      "type": "statement",
      "json": {
        "type": "pass_s",
        "message0": "",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 70,
        "previousStatement": "pass_s",
        "nextStatement": MotaActionBlocks.action
      },
      "generFunc": function(block) {
        var code = ' \n';
        return code;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('pass_s',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('pass_s',inputs,isShadow,comment);
      }
    },
    "expression_arithmetic_0": {
      "type": "value",
      "json": {
        "type": "expression_arithmetic_0",
        "message0": "%1 %2 %3",
        "args0": [
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          },
          Object.assign({},MotaActionBlocks.Arithmetic_List,{
            "name": "Arithmetic_List_0"
          }),
          {
            "type": "input_value",
            "name": "expression_1",
            "check": MotaActionBlocks.expression
          }
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "expression_arithmetic_0"
      },
      "generFunc": function(block) {
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','expression_arithmetic_0');
        }
        var Arithmetic_List_0 = block.getFieldValue('Arithmetic_List_0');
        Arithmetic_List_0 = MotaActionFunctions.pre('Arithmetic_List')(Arithmetic_List_0);
        var expression_1 = Blockly.JavaScript.valueToCode(block, 'expression_1', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_1==='') {
          throw new OmitedError(block,'expression_1','expression_arithmetic_0');
        }
        //todo 修改recieveOrder,根据Arithmetic_List_0不同的值设定不同的recieveOrder
        var code = expression_0 + Arithmetic_List_0 + expression_1;
        var ops = {
            '**': 'Math.pow('+expression_0+','+expression_1+')',
            'min': 'Math.min('+expression_0+','+expression_1+')',
            'max': 'Math.max('+expression_0+','+expression_1+')',
            'startsWith': expression_0+'.startsWith('+expression_1+')',
            'endsWith': expression_0+'.endsWith('+expression_1+')',
            'includes': expression_0+'.includes('+expression_1+')',
        }
        if (ops[Arithmetic_List_0])code = ops[Arithmetic_List_0];
        var orders = {
            '+': Blockly.JavaScript.ORDER_ADDITION,
            '-': Blockly.JavaScript.ORDER_SUBTRACTION,
            '*': Blockly.JavaScript.ORDER_MULTIPLICATION,
            '/': Blockly.JavaScript.ORDER_DIVISION,
            '%': Blockly.JavaScript.ORDER_MODULUS,
            '**': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
            '==': Blockly.JavaScript.ORDER_EQUALITY,
            '!=': Blockly.JavaScript.ORDER_EQUALITY,
            '===': Blockly.JavaScript.ORDER_EQUALITY,
            '!==': Blockly.JavaScript.ORDER_EQUALITY,
            '>': Blockly.JavaScript.ORDER_RELATIONAL,
            '<': Blockly.JavaScript.ORDER_RELATIONAL,
            '>=': Blockly.JavaScript.ORDER_RELATIONAL,
            '<=': Blockly.JavaScript.ORDER_RELATIONAL,
            '&&': Blockly.JavaScript.ORDER_LOGICAL_AND,
            '||': Blockly.JavaScript.ORDER_LOGICAL_OR,
            '^': Blockly.JavaScript.ORDER_BITWISE_XOR,
            'min': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
            'max': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
            'startsWith': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
            'endsWith': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
            'includes': Blockly.JavaScript.ORDER_MEMBER, //recieveOrder : ORDER_COMMA
        }
        return [code, orders[Arithmetic_List_0]];
      },
      "args": [
        "expression_0",
        "Arithmetic_List_0",
        "expression_1"
      ],
      "argsType": ["value","field","value"],
      "argsGrammarName": ["expression","Arithmetic_List","expression"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('expression_arithmetic_0',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('expression_arithmetic_0',inputs,isShadow,comment);
      }
    },
    "negate_e": {
      "type": "value",
      "json": {
        "type": "negate_e",
        "message0": "非 %1",
        "args0": [
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          }
        ],
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "negate_e"
      },
      "generFunc": function(block) {
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','negate_e');
        }
        //todo 修改recieveOrder : ORDER_LOGICAL_NOT 修改 inputsInline
        var code = '!'+expression_0;
        return [code, Blockly.JavaScript.ORDER_LOGICAL_NOT];
      },
      "args": [
        "expression_0"
      ],
      "argsType": ["value"],
      "argsGrammarName": ["expression"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('negate_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('negate_e',inputs,isShadow,comment);
      }
    },
    "unaryOperation_e": {
      "type": "value",
      "json": {
        "type": "unaryOperation_e",
        "message0": "%1 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.UnaryOperator_List,{
            "name": "UnaryOperator_List_0"
          }),
          {
            "type": "input_value",
            "name": "expression_0",
            "check": MotaActionBlocks.expression
          }
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "unaryOperation_e"
      },
      "generFunc": function(block) {
        var UnaryOperator_List_0 = block.getFieldValue('UnaryOperator_List_0');
        UnaryOperator_List_0 = MotaActionFunctions.pre('UnaryOperator_List')(UnaryOperator_List_0);
        var expression_0 = Blockly.JavaScript.valueToCode(block, 'expression_0', 
          Blockly.JavaScript.ORDER_ATOMIC);
        if (expression_0==='') {
          throw new OmitedError(block,'expression_0','unaryOperation_e');
        }
        var code = UnaryOperator_List_0 + '(' + expression_0 + ')';
        return [code, Blockly.JavaScript.ORDER_MEMBER];
      },
      "args": [
        "UnaryOperator_List_0",
        "expression_0"
      ],
      "argsType": ["field","value"],
      "argsGrammarName": ["UnaryOperator_List","expression"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('unaryOperation_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('unaryOperation_e',inputs,isShadow,comment);
      }
    },
    "bool_e": {
      "type": "value",
      "json": {
        "type": "bool_e",
        "message0": ": %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Bool,{
            "name": "Bool_0"
          })
        ],
        "inputsInline": true,
        "tooltip": "逻辑是否",
        "helpUrl": "",
        "colour": 330,
        "output": "bool_e"
      },
      "generFunc": function(block) {
        var Bool_0 = block.getFieldValue('Bool_0') === 'TRUE';
        Bool_0 = MotaActionFunctions.pre('Bool')(Bool_0);
        var code = Bool_0;
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "Bool_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Bool"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('bool_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('bool_e',inputs,isShadow,comment);
      }
    },
    "idString_e": {
      "type": "value",
      "json": {
        "type": "idString_e",
        "message0": "%1",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "变量：生命"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 310,
        "output": "idString_e"
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','idString_e');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var code = IdString_0;
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "IdString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('idString_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('idString_e',inputs,isShadow,comment);
      }
    },
    "idIdList_e": {
      "type": "value",
      "json": {
        "type": "idIdList_e",
        "message0": "%1 : %2",
        "args0": [
          Object.assign({},MotaActionBlocks.Id_List,{
            "name": "Id_List_0"
          }),
          Object.assign({},MotaActionBlocks.IdText,{
            "name": "IdText_0",
            "text": "自定义flag"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 310,
        "output": "idString_e"
      },
      "generFunc": function(block) {
        var Id_List_0 = block.getFieldValue('Id_List_0');
        Id_List_0 = MotaActionFunctions.pre('Id_List')(Id_List_0);
        var IdText_0 = block.getFieldValue('IdText_0');
        if (IdText_0==='') {
          throw new OmitedError(block,'IdText_0','idIdList_e');
        }
        IdText_0 = MotaActionFunctions.pre('IdText')(IdText_0);
        var code = MotaActionFunctions.replaceFromName(MotaActionFunctions.replaceToName(Id_List_0+':'+IdText_0));
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "Id_List_0",
        "IdText_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["Id_List","IdText"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('idIdList_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('idIdList_e',inputs,isShadow,comment);
      }
    },
    "idFixedList_e": {
      "type": "value",
      "json": {
        "type": "idFixedList_e",
        "message0": "%1",
        "args0": [
          Object.assign({},MotaActionBlocks.FixedId_List,{
            "name": "FixedId_List_0"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 310,
        "output": "idString_e"
      },
      "generFunc": function(block) {
        var FixedId_List_0 = block.getFieldValue('FixedId_List_0');
        FixedId_List_0 = MotaActionFunctions.pre('FixedId_List')(FixedId_List_0);
        var code = FixedId_List_0;
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "FixedId_List_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["FixedId_List"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('idFixedList_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('idFixedList_e',inputs,isShadow,comment);
      }
    },
    "enemyattr_e": {
      "type": "value",
      "json": {
        "type": "enemyattr_e",
        "message0": "怪物 %1 的 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "greenSlime"
          }),
          Object.assign({},MotaActionBlocks.EnemyId_List,{
            "name": "EnemyId_List_0",
            "default": "hp"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "enemyattr_e"
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','enemyattr_e');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var EnemyId_List_0 = block.getFieldValue('EnemyId_List_0');
        EnemyId_List_0 = MotaActionFunctions.pre('EnemyId_List')(EnemyId_List_0);
        var code = 'enemy:'+IdString_0+':'+EnemyId_List_0;
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "IdString_0",
        "EnemyId_List_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["IdString","EnemyId_List"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('enemyattr_e',keyOrIndex);
      },
      "menu": [],
      "allEnemys": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('enemyattr_e',inputs,isShadow,comment);
      }
    },
    "blockId_e": {
      "type": "value",
      "json": {
        "type": "blockId_e",
        "message0": "图块ID: %1 , %2",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": 0
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": 0
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "blockId_e"
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','blockId_e');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','blockId_e');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        if (/^\d+$/.test(PosString_0) && /^\d+$/.test(PosString_1)) {
            return ['blockId:'+PosString_0+','+PosString_1, Blockly.JavaScript.ORDER_ATOMIC];
        }
        if (PosString_0.startsWith('"')) {
            PosString_0 = PosString_0.substring(1, PosString_0.length - 1);
        }
        if (PosString_1.startsWith('"')) {
            PosString_1 = PosString_1.substring(1, PosString_1.length - 1);
        }
        return ['core.getBlockId('+PosString_0+','+PosString_1+')', Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "PosString_0",
        "PosString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('blockId_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('blockId_e',inputs,isShadow,comment);
      }
    },
    "blockNumber_e": {
      "type": "value",
      "json": {
        "type": "blockNumber_e",
        "message0": "图块数字: %1 , %2",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": 0
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": 0
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "blockNumber_e"
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','blockNumber_e');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','blockNumber_e');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        if (/^\d+$/.test(PosString_0) && /^\d+$/.test(PosString_1)) {
            return ['blockNumber:'+PosString_0+','+PosString_1, Blockly.JavaScript.ORDER_ATOMIC];
        }
        if (PosString_0.startsWith('"')) {
            PosString_0 = PosString_0.substring(1, PosString_0.length - 1);
        }
        if (PosString_1.startsWith('"')) {
            PosString_1 = PosString_1.substring(1, PosString_1.length - 1);
        }
        return ['core.getBlockNumber('+PosString_0+','+PosString_1+')', Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "PosString_0",
        "PosString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('blockNumber_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('blockNumber_e',inputs,isShadow,comment);
      }
    },
    "blockCls_e": {
      "type": "value",
      "json": {
        "type": "blockCls_e",
        "message0": "图块类别: %1 , %2",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": 0
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": 0
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "blockCls_e"
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','blockCls_e');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','blockCls_e');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        if (/^\d+$/.test(PosString_0) && /^\d+$/.test(PosString_1)) {
            return ['blockCls:'+PosString_0+','+PosString_1, Blockly.JavaScript.ORDER_ATOMIC];
        }
        if (PosString_0.startsWith('"')) {
            PosString_0 = PosString_0.substring(1, PosString_0.length - 1);
        }
        if (PosString_1.startsWith('"')) {
            PosString_1 = PosString_1.substring(1, PosString_1.length - 1);
        }
        return ['core.getBlockCls('+PosString_0+','+PosString_1+')', Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "PosString_0",
        "PosString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('blockCls_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('blockCls_e',inputs,isShadow,comment);
      }
    },
    "nextXY_e": {
      "type": "value",
      "json": {
        "type": "nextXY_e",
        "message0": "前方 %1 格的 %2",
        "args0": [
          Object.assign({},MotaActionBlocks.NInt,{
            "name": "NInt_0",
            "text": 1
          }),
          Object.assign({},MotaActionBlocks.NextXY_List,{
            "name": "NextXY_List_0",
            "default": "nextX"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "nextXY_e"
      },
      "generFunc": function(block) {
        var NInt_0 = block.getFieldValue('NInt_0');
        if (NInt_0==='') {
          throw new OmitedError(block,'NInt_0','nextXY_e');
        }
        NInt_0 = MotaActionFunctions.pre('NInt')(NInt_0);
        var NextXY_List_0 = block.getFieldValue('NextXY_List_0');
        NextXY_List_0 = MotaActionFunctions.pre('NextXY_List')(NextXY_List_0);
        var code = NextXY_List_0 == 'nextY' ? ('core.nextY('+NInt_0+')') : ('core.nextX('+NInt_0+')');
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "NInt_0",
        "NextXY_List_0"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["NInt","NextXY_List"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('nextXY_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('nextXY_e',inputs,isShadow,comment);
      }
    },
    "isReplaying_e": {
      "type": "value",
      "json": {
        "type": "isReplaying_e",
        "message0": "录像播放中",
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "isReplaying_e"
      },
      "generFunc": function(block) {
        var code = 'core.isReplaying()';
        return [code, Blockly.JavaScript.ORDER_ATOMIC];;
      },
      "args": [],
      "argsType": [],
      "argsGrammarName": [],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('isReplaying_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('isReplaying_e',inputs,isShadow,comment);
      }
    },
    "hasVisitedFloor_e": {
      "type": "value",
      "json": {
        "type": "hasVisitedFloor_e",
        "message0": "访问过楼层 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "MT0"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "hasVisitedFloor_e"
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','hasVisitedFloor_e');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var code = 'core.hasVisitedFloor(\'' + IdString_0 + '\')';
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "IdString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('hasVisitedFloor_e',keyOrIndex);
      },
      "menu": [],
      "allFloorIds": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('hasVisitedFloor_e',inputs,isShadow,comment);
      }
    },
    "isShopVisited_e": {
      "type": "value",
      "json": {
        "type": "isShopVisited_e",
        "message0": "开启过商店 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "shop1"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "isShopVisited_e"
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','isShopVisited_e');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var code = 'core.isShopVisited(\'' + IdString_0 + '\')';
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "IdString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('isShopVisited_e',keyOrIndex);
      },
      "menu": [],
      "allShops": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('isShopVisited_e',inputs,isShadow,comment);
      }
    },
    "hasEquip_e": {
      "type": "value",
      "json": {
        "type": "hasEquip_e",
        "message0": "当前正在装备 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "sword1"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "hasEquip_e"
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','hasEquip_e');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var code = 'core.hasEquip(\'' + IdString_0 + '\')';
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "IdString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('hasEquip_e',keyOrIndex);
      },
      "menu": [],
      "allEquips": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('hasEquip_e',inputs,isShadow,comment);
      }
    },
    "canBattle_e": {
      "type": "value",
      "json": {
        "type": "canBattle_e",
        "message0": "当前能否战斗 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "greenSlime"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "canBattle_e"
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','canBattle_e');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var code = 'core.canBattle(\'' + IdString_0 + '\')';
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "IdString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('canBattle_e',keyOrIndex);
      },
      "menu": [],
      "allEnemys": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('canBattle_e',inputs,isShadow,comment);
      }
    },
    "damage_e": {
      "type": "value",
      "json": {
        "type": "damage_e",
        "message0": "战斗伤害 怪物ID %1",
        "args0": [
          Object.assign({},MotaActionBlocks.IdString,{
            "name": "IdString_0",
            "text": "greenSlime"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "damage_e"
      },
      "generFunc": function(block) {
        var IdString_0 = block.getFieldValue('IdString_0');
        if (IdString_0==='') {
          throw new OmitedError(block,'IdString_0','damage_e');
        }
        IdString_0 = MotaActionFunctions.pre('IdString')(IdString_0);
        var code = 'core.getDamage(\'' + IdString_0 + '\')';
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "IdString_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["IdString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('damage_e',keyOrIndex);
      },
      "menu": [],
      "allEnemys": "['IdString_0']",
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('damage_e',inputs,isShadow,comment);
      }
    },
    "damage_1_e": {
      "type": "value",
      "json": {
        "type": "damage_1_e",
        "message0": "战斗伤害 点坐标 x %1 y %2",
        "args0": [
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_0",
            "text": 0
          }),
          Object.assign({},MotaActionBlocks.PosString,{
            "name": "PosString_1",
            "text": 0
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "damage_1_e"
      },
      "generFunc": function(block) {
        var PosString_0 = block.getFieldValue('PosString_0');
        if (PosString_0==='') {
          throw new OmitedError(block,'PosString_0','damage_1_e');
        }
        PosString_0 = MotaActionFunctions.pre('PosString')(PosString_0);
        var PosString_1 = block.getFieldValue('PosString_1');
        if (PosString_1==='') {
          throw new OmitedError(block,'PosString_1','damage_1_e');
        }
        PosString_1 = MotaActionFunctions.pre('PosString')(PosString_1);
        if (PosString_0.startsWith('"')) {
            PosString_0 = PosString_0.substring(1, PosString_0.length - 1);
        }
        if (PosString_1.startsWith('"')) {
            PosString_1 = PosString_1.substring(1, PosString_1.length - 1);
        }
        var code = 'core.getDamage(null, ' + PosString_0 + ',' + PosString_1 + ')';
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "PosString_0",
        "PosString_1"
      ],
      "argsType": ["field","field"],
      "argsGrammarName": ["PosString","PosString"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('damage_1_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('damage_1_e',inputs,isShadow,comment);
      }
    },
    "rand_e": {
      "type": "value",
      "json": {
        "type": "rand_e",
        "message0": "随机数 [0,  %1 )",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": "10"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "rand_e"
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var code = 'core.rand(' + Int_0 + ')';
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "Int_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Int"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('rand_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('rand_e',inputs,isShadow,comment);
      }
    },
    "equip_e": {
      "type": "value",
      "json": {
        "type": "equip_e",
        "message0": "第 %1 格装备孔",
        "args0": [
          Object.assign({},MotaActionBlocks.Int,{
            "name": "Int_0",
            "value": 0
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "equip_e"
      },
      "generFunc": function(block) {
        var Int_0 = block.getFieldValue('Int_0');
        Int_0 = MotaActionFunctions.pre('Int')(Int_0);
        var code = 'equip:'+Int_0;
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "Int_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Int"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('equip_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('equip_e',inputs,isShadow,comment);
      }
    },
    "idFlag_e": {
      "type": "value",
      "json": {
        "type": "idFlag_e",
        "message0": "独立开关 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Letter_List,{
            "name": "Letter_List_0",
            "default": "A"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 310,
        "output": "idString_e"
      },
      "generFunc": function(block) {
        var Letter_List_0 = block.getFieldValue('Letter_List_0');
        Letter_List_0 = MotaActionFunctions.pre('Letter_List')(Letter_List_0);
        var code = "switch:"+Letter_List_0;
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "Letter_List_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Letter_List"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('idFlag_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('idFlag_e',inputs,isShadow,comment);
      }
    },
    "idTemp_e": {
      "type": "value",
      "json": {
        "type": "idTemp_e",
        "message0": "临时变量 %1",
        "args0": [
          Object.assign({},MotaActionBlocks.Letter_List,{
            "name": "Letter_List_0",
            "default": "A"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 310,
        "output": "idString_e"
      },
      "generFunc": function(block) {
        var Letter_List_0 = block.getFieldValue('Letter_List_0');
        Letter_List_0 = MotaActionFunctions.pre('Letter_List')(Letter_List_0);
        var code = "temp:"+Letter_List_0;
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "Letter_List_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["Letter_List"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('idTemp_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('idTemp_e',inputs,isShadow,comment);
      }
    },
    "evalString_e": {
      "type": "value",
      "json": {
        "type": "evalString_e",
        "message0": "%1",
        "args0": [
          Object.assign({},MotaActionBlocks.EvalString_Multi,{
            "name": "EvalString_Multi_0",
            "text": "值"
          })
        ],
        "inputsInline": true,
        "tooltip": "",
        "helpUrl": "",
        "colour": 330,
        "output": "evalString_e"
      },
      "generFunc": function(block) {
        var EvalString_Multi_0 = block.getFieldValue('EvalString_Multi_0');
        if (EvalString_Multi_0==='') {
          throw new OmitedError(block,'EvalString_Multi_0','evalString_e');
        }
        EvalString_Multi_0 = MotaActionFunctions.pre('EvalString_Multi')(EvalString_Multi_0);
        var code = EvalString_Multi_0;
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
      },
      "args": [
        "EvalString_Multi_0"
      ],
      "argsType": ["field"],
      "argsGrammarName": ["EvalString_Multi"],
      "fieldDefault": function (keyOrIndex) {
        return MotaActionFunctions.fieldDefault('evalString_e',keyOrIndex);
      },
      "menu": [],
      "xmlText": function (inputs,isShadow,comment) {
        return MotaActionFunctions.xmlText('evalString_e',inputs,isShadow,comment);
      }
    }
  });
  
  
  //生成代码中,当一个不允许省略的值或块省略时,会抛出这个错误
  function OmitedError(block, var_, rule, fileName, lineNumber) {
    var message = 'no omitted '+var_+' at '+rule;
    var instance = new Error(message, fileName, lineNumber);
    instance.block = block;
    instance.varName = var_;
    instance.blockName = rule;
    instance.name = 'OmitedError';
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    if (Error.captureStackTrace) {
      Error.captureStackTrace(instance, OmitedError);
    }
    return instance;
  }
  
  OmitedError.prototype = Object.create(Error.prototype);
  OmitedError.prototype.constructor = OmitedError;
  //处理此错误的omitedcheckUpdateFunction定义在下面
  
  
  MotaActionFunctions={}
  
  MotaActionParser()
  
  MotaActionFunctions.Int_pre = function(intstr) {
    return parseInt(intstr);
  }
  
  MotaActionFunctions.Number_pre = function(intstr) {
    return parseFloat(intstr);
  }
  
  //返回各LexerRule文本域的预处理函数,方便用来统一转义等等
  MotaActionFunctions.pre = function(LexerId) {
    if (MotaActionFunctions.hasOwnProperty(LexerId+'_pre')) {
      return MotaActionFunctions[LexerId+'_pre'];
    }
    return function(obj){return obj}
  }
  
  
  // MotaActionFunctions.fieldDefault
  // 根据输入是整数字符串或null
  // 第index个或者名字为key的域的默认值, null时返回所有field默认值的数组
  MotaActionFunctions.fieldDefault = function (ruleName,keyOrIndex) {
    var rule = MotaActionBlocks[ruleName];
    var iskey=typeof keyOrIndex==typeof '';
    var isindex=typeof keyOrIndex==typeof 0;
    function args0_content_to_default(cnt) {
      var key = ({
        'field_input':'text',
        'field_multilinetext':'text',
        'field_number':'value',
        'field_dropdown':'default',
        'field_checkbox':'checked',
        'field_colour':'colour',
        'field_angle':'angle',
        // 'field_image':'src'
      })[cnt.type];
      return cnt[key];
    }
    var allDefault=[];
    for(var ii=0,index=-1,cnt;cnt=rule.json.args0[ii];ii++){
      if (!cnt.name || cnt.type.slice(0,5)!='field' || cnt.type=='field_image') continue;
      index++;
      if (iskey && cnt.name==keyOrIndex)return args0_content_to_default(cnt);
      if (isindex && index==keyOrIndex)return args0_content_to_default(cnt);
      allDefault.push(args0_content_to_default(cnt))
    }
    if (iskey || isindex) return undefined;
    return allDefault;
  }
  
  
  // MotaActionFunctions.defaultCode
  MotaActionFunctions.defaultCode = function (ruleName,args) {
    var rule = MotaActionBlocks[ruleName];
    var message=rule.json.message0;
    for(var ii=0;ii<args.length;ii++){
      message=message.split(new RegExp('%'+(ii+1)+'\\b'))
      if (args[ii]==='\n') {
        message[1]=message[1].slice(1);
      }
      if (rule.json.args0[ii].type=="input_statement") {
        message[0]=message[0]+'\n';
        message[1]=message[1].slice(1);
      }
      message=message.join(args[ii]);
    }
    if (rule.type=='statement') {
      message=message+'\n';
    }
    return message;
  }
  
  
  // MotaActionFunctions.xmlText
  // 构造这个方法是为了能够不借助workspace,从语法树直接构造图块结构
  // inputs的第i个元素是第i个args的xmlText,null或undefined表示空
  // inputs的第rule.args.length个元素是其下一个语句的xmlText
  MotaActionFunctions.xmlText = function (ruleName,inputs,isShadow,comment) {
    var rule = MotaActionBlocks[ruleName];
    var blocktext = isShadow?'shadow':'block';
    var xmlText = [];
    xmlText.push('<'+blocktext+' type="'+ruleName+'">');
    if(!inputs)inputs=[];
    for (var ii=0,inputType;inputType=rule.argsType[ii];ii++) {
      var input = inputs[ii];
      var _input = '';
      var noinput = (input===null || input===undefined);
      if(noinput && inputType==='field' && MotaActionBlocks[rule.argsGrammarName[ii]].type!=='field_dropdown') continue;
      if(noinput && inputType==='field') {
        noinput = false;
        input = rule.fieldDefault(rule.args[ii])
      }
      if(noinput) input = '';
      if(inputType!=='field') {
        var subList = false;
        var subrulename = rule.argsGrammarName[ii];
        var subrule = MotaActionBlocks[subrulename];
        if (subrule instanceof Array) {
          subrulename=subrule[subrule.length-1];
          subrule = MotaActionBlocks[subrulename];
          subList = true;
        }
        _input = subrule.xmlText([],true);
        if(noinput && !subList && !isShadow) {
          //无输入的默认行为是: 如果语句块的备选方块只有一个,直接代入方块
          input = subrule.xmlText();
        }
      }
      xmlText.push('<'+inputType+' name="'+rule.args[ii]+'">');
      xmlText.push(_input+input);
      xmlText.push('</'+inputType+'>');
    }
    if(comment){
      xmlText.push('<comment><![CDATA[');
      xmlText.push(comment.replace(/]]>/g,'] ] >'));
      xmlText.push(']]></comment>');
    }
    var next = inputs[rule.args.length];
    if (next) {//next
      xmlText.push('<next>');
      xmlText.push(next);
      xmlText.push('</next>');
    }
    xmlText.push('</'+blocktext+'>');
    return xmlText.join('');
  }
  
  
  // MotaActionFunctions.blocksIniter
  // 把各方块的信息注册到Blockly中
  MotaActionFunctions.blocksIniter = function(){
    var blocksobj = MotaActionBlocks;
    for(var key in blocksobj) {
      var value = blocksobj[key];
      if(value instanceof Array)continue;
      if(/^[A-Z].*$/.exec(key))continue;
      (function(key,value){
        if (value.menu && value.menu.length) {
          var menuRegisterMixin={
            customContextMenu: function(options) {
              for(var ii=0,op;op=value.menu[ii];ii++){
                var option = {enabled: true};
                option.text = op[0];
                var check = 'function('
                if (option.text.slice(0,check.length)==check){
                  option.text=eval('('+option.text+')(this)');
                }
                (function(block,fstr){
                  option.callback = function(){
                    eval(fstr)
                  }
                })(this,op[1]);
                options.push(option);
              }
            }
          };
          value.json.extensions=value.json.extensions||[];
          var mixinName = 'contextMenu_MotaAction_'+value.json.type
          value.json.extensions.push(mixinName)
          Blockly.Extensions.registerMixin(mixinName,menuRegisterMixin);
        }
        Blockly.Blocks[key] = {
          init: function() {this.jsonInit(value.json);}
        }
        Blockly.JavaScript[key] = value.generFunc;
      })(key,value);
    }
  }
  
  
  MotaActionFunctions.blocksIniter();
  
  
  (function(){
    var getCategory = function(name,custom){
      for(var node of document.getElementById('toolbox').children) {
        if(node.getAttribute('name')==name) return node;
      }
      var node = document.createElement('category');
      node.setAttribute('name',name);
      if(custom)node.setAttribute('custom',custom);
      document.getElementById('toolbox').appendChild(node);
      return node;
    }
  
    var toolboxObj = {
      '入口方块':[
        '<label text="入口方块会根据当前类型在此数组中筛选,具体控制在editor_blockly.entranceCategoryCallback中"></label>',
        MotaActionFunctions.actionParser.parse([
          "欢迎使用事件编辑器",
          "本事件触发一次后会消失",
          {"type": "hide", "time": 500},
        ],'event'),
        MotaActionFunctions.actionParser.parse({
          "condition": "flag:__door__===2",
          "currentFloor": true,
          "priority": 0,
          "delayExecute": false,
          "multiExecute": false,
          "data": [
            {"type": "openDoor", "loc": [10,5]}
          ],
        },'autoEvent'),
        MotaActionBlocks['changeFloor_m'].xmlText(),
        MotaActionFunctions.actionParser.parse([{
          "id": "shop1",
          "text": "\t[贪婪之神,moneyShop]勇敢的武士啊, 给我${20+2*flag:shop1}金币就可以：", 
          "textInList": "1F金币商店",  
          "choices": [ 
            {"text": "生命+800", "need": "status:money>=20+2*flag:shop1", "action": [
              {"type": "comment", "text": "新版商店中需要手动扣减金币和增加访问次数"},
              {"type": "setValue", "name": "status:money", "operator": "-=", "value": "20+2*flag:shop1"},
              {"type": "setValue", "name": "flag:shop1", "operator": "+=", "value": "1"},
              {"type": "setValue", "name": "status:hp", "operator": "+=", "value": "800"}
            ]}
          ]
        },{
          "id": "itemShop",
          "item": true,
          "textInList": "道具商店",
          "choices": [
            {"id": "yellowKey", "number": 10, "money": 10}
          ]
        },{
          "id": "keyShop1",
          "textInList": "回收钥匙商店",
          "commonEvent": "回收钥匙商店",
          "args": ""
        }],'shop'),
        MotaActionBlocks['common_m'].xmlText(),
        MotaActionBlocks['beforeBattle_m'].xmlText(),
        MotaActionBlocks['afterBattle_m'].xmlText(),
        MotaActionBlocks['afterGetItem_m'].xmlText(),
        MotaActionBlocks['afterOpenDoor_m'].xmlText(),
        MotaActionBlocks['firstArrive_m'].xmlText(),
        MotaActionBlocks['eachArrive_m'].xmlText(),
        MotaActionBlocks['level_m'].xmlText(),
        MotaActionFunctions.actionParser.parse([
          ['MTx', '']
        ], 'floorPartition'),
        MotaActionBlocks['commonEvent_m'].xmlText(),
        MotaActionBlocks['item_m'].xmlText(),
        MotaActionFunctions.actionParser.parse([
          {"title":"简单", "name": "Easy", "hard": 1, "action": [
            {"type": "comment", "text": "在这里写该难度需执行的事件"}
          ]}
        ], 'levelChoose'),
        MotaActionFunctions.actionParser.parse({
          "type": 0, "value": {"atk": 10}, "percentage": {"speed": 10},
        }, 'equip'),
        MotaActionFunctions.actionParser.parse([{
          "name": "bg.jpg", "x": 0, "y": 0, "canvas": "bg"
        }], 'floorImage'),
        MotaActionFunctions.actionParser.parse({
          "time": 160, "openSound": "door.mp3", "closeSound": "door.mp3", "keys": {"yellowKey": 1, "orangeKey": 1}
        }, 'doorInfo'),
        MotaActionBlocks['faceIds_m'].xmlText(),
        MotaActionBlocks['mainStyle_m'].xmlText(),
        MotaActionFunctions.actionParser.parse({
          "背景音乐": "bgm.mp3", "确定": "confirm.mp3", "攻击": "attack.mp3", "背景图": "bg.jpg", "领域": "zone", "文件名": "file.jpg"
        }, 'nameMap'),
        MotaActionFunctions.actionParser.parse([
          {"name": "hero.png", "width": 32, "height": 32, "prefix": "hero_"},
        ], 'splitImages'),
      ],
      '显示文字':[
        MotaActionBlocks['text_0_s'].xmlText(),
        MotaActionBlocks['text_1_s'].xmlText(),
        MotaActionFunctions.actionParser.parseList("\t[小妖精,fairy]\f[fairy.png,0,0]欢迎使用事件编辑器(双击方块可直接预览)"),
        MotaActionBlocks['moveTextBox_s'].xmlText(),
        MotaActionBlocks['clearTextBox_s'].xmlText(),
        MotaActionBlocks['comment_s'].xmlText(),
        MotaActionBlocks['autoText_s'].xmlText(),
        MotaActionBlocks['scrollText_s'].xmlText(),
        MotaActionBlocks['setText_s'].xmlText(),
        MotaActionBlocks['tip_s'].xmlText(),
        MotaActionBlocks['confirm_s'].xmlText(),
        MotaActionBlocks['choices_s'].xmlText([
          '选择剑或者盾','流浪者','man',0,'',MotaActionBlocks['choicesContext'].xmlText([
            '剑','','',null,'','',MotaActionFunctions.actionParser.parseList([{"type": "openDoor", "loc": [3,3]}]),
          ])
        ]),
        MotaActionBlocks['win_s'].xmlText(),
        MotaActionBlocks['lose_s'].xmlText(),
        MotaActionBlocks['restart_s'].xmlText(),
      ],
      '数据相关':[
        MotaActionBlocks['setValue_s'].xmlText([
          MotaActionBlocks['idIdList_e'].xmlText(['status','生命']), '=', '', false
        ]),
        MotaActionBlocks['setEnemy_s'].xmlText(),
        MotaActionBlocks['setEnemyOnPoint_s'].xmlText(),
        MotaActionBlocks['resetEnemyOnPoint_s'].xmlText(),
        MotaActionBlocks['moveEnemyOnPoint_s'].xmlText(),
        MotaActionBlocks['moveEnemyOnPoint_1_s'].xmlText(),
        MotaActionBlocks['setEquip_s'].xmlText(),
        MotaActionBlocks['setFloor_s'].xmlText(),
        MotaActionBlocks['setGlobalAttribute_s'].xmlText(),
        MotaActionBlocks['setGlobalValue_s'].xmlText(),
        MotaActionBlocks['setGlobalFlag_s'].xmlText(),
        MotaActionBlocks['setNameMap_s'].xmlText(),
        MotaActionBlocks['input_s'].xmlText(),
        MotaActionBlocks['input2_s'].xmlText(),
        MotaActionBlocks['update_s'].xmlText(),
        MotaActionBlocks['moveAction_s'].xmlText(),
        MotaActionBlocks['changeFloor_s'].xmlText(),
        MotaActionBlocks['changePos_s'].xmlText(),
        MotaActionBlocks['battle_s'].xmlText(),
        MotaActionBlocks['useItem_s'].xmlText(),
        MotaActionBlocks['loadEquip_s'].xmlText(),
        MotaActionBlocks['unloadEquip_s'].xmlText(),
        MotaActionBlocks['openShop_s'].xmlText(),
        MotaActionBlocks['disableShop_s'].xmlText(),
        MotaActionBlocks['setHeroIcon_s'].xmlText(),
        MotaActionBlocks['follow_s'].xmlText(),
        MotaActionBlocks['unfollow_s'].xmlText(),
      ],
      '地图处理':[
        MotaActionBlocks['battle_1_s'].xmlText(),
        MotaActionBlocks['openDoor_s'].xmlText(),
        MotaActionBlocks['closeDoor_s'].xmlText(),
        MotaActionBlocks['show_s'].xmlText(),
        MotaActionBlocks['hide_s'].xmlText(),
        MotaActionBlocks['setBlock_s'].xmlText(),
        MotaActionBlocks['setBlockOpacity_s'].xmlText(),
        MotaActionBlocks['setBlockFilter_s'].xmlText(),
        MotaActionBlocks['turnBlock_s'].xmlText(),
        MotaActionBlocks['moveHero_s'].xmlText(),
        MotaActionBlocks['move_s'].xmlText(),
        MotaActionBlocks['jumpHero_s'].xmlText(),
        MotaActionBlocks['jumpHero_1_s'].xmlText(),
        MotaActionBlocks['jump_s'].xmlText(),
        MotaActionBlocks['jump_1_s'].xmlText(),
        MotaActionBlocks['showBgFgMap_s'].xmlText(),
        MotaActionBlocks['hideBgFgMap_s'].xmlText(),
        MotaActionBlocks['setBgFgBlock_s'].xmlText(),
        MotaActionBlocks['showFloorImg_s'].xmlText(),
        MotaActionBlocks['hideFloorImg_s'].xmlText(),
      ],
      '事件控制':[
        MotaActionBlocks['if_1_s'].xmlText(),
        MotaActionBlocks['if_s'].xmlText(),
        MotaActionFunctions.actionParser.parseList({"type": "switch", "condition": "判别值", "caseList": [
          {"action": [{"type": "comment", "text": "当判别值是值的场合执行此事件"}]},
          {"case": "default", "action": [{"type": "comment", "text": "当没有符合的值的场合执行default事件"}]},
        ]}),
        MotaActionFunctions.actionParser.parseList({"type": "for", "name": "temp:A", "from": "0", "to": "12", "step": "1", "data": []}),
        MotaActionFunctions.actionParser.parseList({"type": "forEach", "name": "temp:A", "list": ["status:atk","status:def"], "data": []}),
        MotaActionBlocks['while_s'].xmlText(),
        MotaActionBlocks['dowhile_s'].xmlText(),
        MotaActionBlocks['break_s'].xmlText(),
        MotaActionBlocks['continue_s'].xmlText(),
        MotaActionBlocks['exit_s'].xmlText(),
        MotaActionBlocks['trigger_s'].xmlText(),
        MotaActionBlocks['insert_1_s'].xmlText(),
        MotaActionBlocks['insert_2_s'].xmlText(),
      ],
      '特效表现':[
        MotaActionBlocks['sleep_s'].xmlText(),
        MotaActionFunctions.actionParser.parseList({"type": "wait", "timeout": 0, "data": [
          {"case": "keyboard", "keycode": "13,32", "action": [{"type": "comment", "text": "当按下回车(keycode=13)或空格(keycode=32)时执行此事件\n超时剩余时间会写入flag:timeout"}]},
          {"case": "mouse", "px": [0,32], "py": [0,32], "action": [{"type": "comment", "text": "当点击地图左上角时执行此事件\n超时剩余时间会写入flag:timeout"}]},
          {"case": "condition", "condition": "flag:type==0\n&&flag:keycode==13", "action": [{"type": "comment", "text": "当满足自定义条件时会执行此事件\n超时剩余时间会写入flag:timeout"}]},
          {"case": "timeout", "action": [{"type": "comment", "text": "当超时未操作时执行此事件"}]},
        ]}),
        MotaActionBlocks['waitAsync_s'].xmlText(),
        MotaActionBlocks['stopAsync_s'].xmlText(),
        MotaActionBlocks['vibrate_s'].xmlText(),
        MotaActionBlocks['animate_s'].xmlText(),
        MotaActionBlocks['animate_1_s'].xmlText(),
        MotaActionBlocks['stopAnimate_s'].xmlText(),
        MotaActionBlocks['setViewport_s'].xmlText(),
        MotaActionBlocks['setViewport_1_s'].xmlText(),
        MotaActionBlocks['lockViewport_s'].xmlText(),      
        MotaActionBlocks['showStatusBar_s'].xmlText(),
        MotaActionBlocks['hideStatusBar_s'].xmlText(),
        MotaActionBlocks['setHeroOpacity_s'].xmlText(),
        MotaActionBlocks['setCurtain_0_s'].xmlText(),
        MotaActionBlocks['setCurtain_1_s'].xmlText(),
        MotaActionBlocks['screenFlash_s'].xmlText(),
        MotaActionBlocks['setWeather_s'].xmlText(),
        MotaActionBlocks['callBook_s'].xmlText(),
        MotaActionBlocks['callSave_s'].xmlText(),
        MotaActionBlocks['autoSave_s'].xmlText(),
        MotaActionBlocks['forbidSave_s'].xmlText(),
        MotaActionBlocks['callLoad_s'].xmlText(),
      ],
      '音像处理':[
        MotaActionBlocks['showImage_s'].xmlText(),
        MotaActionBlocks['showImage_1_s'].xmlText(),
        MotaActionBlocks['hideImage_s'].xmlText(),
        MotaActionBlocks['showTextImage_s'].xmlText(),
        MotaActionBlocks['moveImage_s'].xmlText(),
        MotaActionBlocks['rotateImage_s'].xmlText(),
        MotaActionBlocks['scaleImage_s'].xmlText(),
        MotaActionBlocks['showGif_s'].xmlText(),
        MotaActionBlocks['playBgm_s'].xmlText(),
        MotaActionBlocks['pauseBgm_s'].xmlText(),
        MotaActionBlocks['resumeBgm_s'].xmlText(),
        MotaActionBlocks['loadBgm_s'].xmlText(),
        MotaActionBlocks['freeBgm_s'].xmlText(),
        MotaActionBlocks['playSound_s'].xmlText(),
        MotaActionBlocks['playSound_1_s'].xmlText(),
        MotaActionBlocks['stopSound_s'].xmlText(),
        MotaActionBlocks['setVolume_s'].xmlText(),
        MotaActionBlocks['setBgmSpeed_s'].xmlText(),
      ],
      'UI绘制':[
        MotaActionBlocks['previewUI_s'].xmlText(),
        MotaActionBlocks['clearMap_s'].xmlText(),
        MotaActionBlocks['setAttribute_s'].xmlText(),
        MotaActionBlocks['setFilter_s'].xmlText(),
        MotaActionBlocks['fillText_s'].xmlText(),
        MotaActionBlocks['fillBoldText_s'].xmlText(),
        MotaActionBlocks['drawTextContent_s'].xmlText(),
        MotaActionBlocks['fillRect_s'].xmlText(),
        MotaActionBlocks['strokeRect_s'].xmlText(),
        MotaActionBlocks['drawLine_s'].xmlText(),
        MotaActionBlocks['drawArrow_s'].xmlText(),
        MotaActionBlocks['fillPolygon_s'].xmlText(),
        MotaActionBlocks['strokePolygon_s'].xmlText(),
        MotaActionBlocks['fillEllipse_s'].xmlText(),
        MotaActionBlocks['strokeEllipse_s'].xmlText(),
        MotaActionBlocks['fillArc_s'].xmlText(),
        MotaActionBlocks['strokeArc_s'].xmlText(),
        MotaActionBlocks['drawImage_s'].xmlText(),
        MotaActionBlocks['drawImage_1_s'].xmlText(),
        MotaActionBlocks['drawIcon_s'].xmlText(),
        MotaActionBlocks['drawBackground_s'].xmlText(),
        MotaActionBlocks['drawSelector_s'].xmlText(),
        MotaActionBlocks['drawSelector_1_s'].xmlText(),
      ],
      '原生脚本':[
        MotaActionBlocks['function_s'].xmlText(),
        MotaActionBlocks['unknown_s'].xmlText(),
      ],
      '值块':[
        MotaActionBlocks['setValue_s'].xmlText([
          MotaActionBlocks['idIdList_e'].xmlText(['status','生命']), '=', '', false
        ]),
        MotaActionBlocks['expression_arithmetic_0'].xmlText(),
        MotaActionBlocks['idFlag_e'].xmlText(),
        MotaActionBlocks['idTemp_e'].xmlText(),
        MotaActionBlocks['negate_e'].xmlText(),
        MotaActionBlocks['unaryOperation_e'].xmlText(),
        MotaActionBlocks['bool_e'].xmlText(),
        MotaActionBlocks['idString_e'].xmlText(),
        MotaActionBlocks['idIdList_e'].xmlText(),
        MotaActionBlocks['idFixedList_e'].xmlText(),
        MotaActionBlocks['enemyattr_e'].xmlText(),
        MotaActionBlocks['blockId_e'].xmlText(),
        MotaActionBlocks['blockNumber_e'].xmlText(),
        MotaActionBlocks['blockCls_e'].xmlText(),
        MotaActionBlocks['hasEquip_e'].xmlText(),
        MotaActionBlocks['equip_e'].xmlText(),
        MotaActionBlocks['nextXY_e'].xmlText(),
        MotaActionBlocks['isReplaying_e'].xmlText(),
        MotaActionBlocks['hasVisitedFloor_e'].xmlText(),
        MotaActionBlocks['isShopVisited_e'].xmlText(),
        MotaActionBlocks['canBattle_e'].xmlText(),
        MotaActionBlocks['damage_e'].xmlText(),
        MotaActionBlocks['damage_1_e'].xmlText(),
        MotaActionBlocks['rand_e'].xmlText(),
        MotaActionBlocks['evalString_e'].xmlText(),
      ],
      '常见事件模板':[
        '<label text="检测音乐如果没有开启则系统提示开启"></label>',
        MotaActionFunctions.actionParser.parseList({"type": "if", "condition": "!core.musicStatus.bgmStatus",
          "true": [
            "\t[系统提示]你当前音乐处于关闭状态，本塔开音乐游戏效果更佳"
          ],
          "false": []
        }),
        '<label text="仿新新魔塔一次性商人"></label>',
        MotaActionFunctions.actionParser.parse([
          {
            "type": "if",
            "condition": "switch:A",
            "true": [
              "\t[行商,trader]\b[this]这是购买我的道具后我给玩家的提示。",
              {
                "type": "comment",
                "text": "下一条指令可视情况使用或不使用"
              },
              {
                "type": "hide",
                "remove": true,
                "time": 250
              }
            ],
            "false": [
              {
                "type": "confirm",
                "text": "我有3把黄钥匙，\n你出50金币就卖给你。",
                "yes": [
                  {
                    "type": "if",
                    "condition": "status:money>=50",
                    "true": [
                      {
                        "type": "setValue",
                        "name": "status:money",
                        "operator": "-=",
                        "value": "50"
                      },
                      {
                        "type": "setValue",
                        "name": "item:yellowKey",
                        "operator": "+=",
                        "value": "3"
                      },
                      {
                        "type": "playSound",
                        "name": "确定",
                        "stop": true
                      },
                      {
                        "type": "setValue",
                        "name": "switch:A",
                        "value": "true"
                      }
                    ],
                    "false": [
                      {
                        "type": "playSound",
                        "name": "操作失败"
                      },
                      "\t[行商,trader]\b[this]你的金币不足！"
                    ]
                  }
                ],
                "no": []
              }
            ]
        }
        ], 'event'),
        '<label text="全地图选中一个点"></label>',
        MotaActionFunctions.actionParser.parse([
          {
            "type": "comment",
            "text": "全地图选中一个点，需要用鼠标或触屏操作"
          },
          {
            "type": "setValue",
            "name": "temp:X",
            "value": "status:x"
          },
          {
            "type": "setValue",
            "name": "temp:Y",
            "value": "status:y"
          },
          {
            "type": "tip",
            "text": "再次点击闪烁位置确认"
          },
          {
            "type": "while",
            "condition": "true",
            "data": [
              {
                "type": "drawSelector",
                "image": "winskin.png",
                "code": 1,
                "x": "32*temp:X",
                "y": "32*temp:Y",
                "width": 32,
                "height": 32
              },
              {
                "type": "wait"
              },
              {
                "type": "if",
                "condition": "(flag:type === 1)",
                "true": [
                  {
                    "type": "if",
                    "condition": "((temp:X===flag:x)&&(temp:Y===flag:y))",
                    "true": [
                      {
                        "type": "break",
                        "n": 1
                      }
                    ]
                  },
                  {
                    "type": "setValue",
                    "name": "temp:X",
                    "value": "flag:x"
                  },
                  {
                    "type": "setValue",
                    "name": "temp:Y",
                    "value": "flag:y"
                  }
                ]
              }
            ]
          },
          {
            "type": "drawSelector",
            "code": 1
          },
          {
            "type": "comment",
            "text": "流程进行到这里可以对[X,Y]点进行处理，比如"
          },
          {
            "type": "closeDoor",
            "id": "yellowDoor",
            "loc": [
              "temp:X",
              "temp:Y"
            ]
          }
        ],'event'),
        '<label text="多阶段Boss战斗"></label>',
        MotaActionFunctions.actionParser.parse([
          {
            "type": "comment",
            "text": "多阶段boss，请直接作为战后事件使用"
          },
          {
            "type": "setValue",
            "name": "switch:A",
            "operator": "+=",
            "value": "1"
          },
          {
            "type": "switch",
            "condition": "switch:A",
            "caseList": [
              {
                "case": "1",
                "action": [
                  {
                    "type": "setBlock",
                    "number": "redSlime"
                  },
                  "\t[2阶段boss,redSlime]\b[this]你以为你已经打败我了吗？没听说过史莱姆有九条命吗？"
                ]
              },
              {
                "case": "2",
                "action": [
                  {
                    "type": "setBlock",
                    "number": "blackSlime"
                  },
                  "\t[3阶段boss,blackSlime]\b[this]不能消灭我的，只会让我更强大！"
                ]
              },
              {
                "case": "3",
                "action": [
                  {
                    "type": "setBlock",
                    "number": "slimelord"
                  },
                  "\t[4阶段boss,slimelord]\b[this]我还能打！"
                ]
              },
              {
                "case": "4",
                "action": [
                  "\t[4阶段boss,slimelord]我一定会回来的！"
                ]
              }
            ]
          }
        ],'afterBattle'),
      ],
      '最近使用事件':[
        '<label text="此处只是占位符,实际定义在editor_blockly.searchBlockCategoryCallback中"></label>',
      ]
    }
    var toolboxgap = '<sep gap="5"></sep>'
    //xml_text = MotaActionFunctions.actionParser.parse(obj,type||'event')
    //MotaActionBlocks['idString_e'].xmlText()
  
    for (var name in toolboxObj){
      var custom = null;
      if(name=='最近使用事件')custom='searchBlockCategory';
      if(name=='入口方块')custom='entranceCategory';
      getCategory(name,custom).innerHTML = toolboxObj[name].join(toolboxgap);
    }
  
  var blocklyArea = document.getElementById('blocklyArea');
  var blocklyDiv = document.getElementById('blocklyDiv');
  var workspace = Blockly.inject(blocklyDiv,{
    media: '_server/blockly/media/',
    toolbox: document.getElementById('toolbox'),
    zoom:{
      controls: true,
      wheel: false,//滚轮改为上下(shift:左右)翻滚
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.08
    },
    trashcan: false,
  });
  
  editor_blockly.isCommonEntry = function () {
    var commonEntries = ['beforeBattle', 'afterBattle', 'afterOpenDoor', 'firstArrive', 'eachArrive', 'commonEvent', 'item'];
    return commonEntries.indexOf(editor_blockly.entryType) >= 0;
  }
  
  editor_blockly.entranceCategoryCallback = function(workspace) {
    var list=toolboxObj['入口方块']
    var xmlList = [];
    var eventType = (editor_blockly.isCommonEntry() ? 'common' : editor_blockly.entryType)+'_m';
    for(var ii=0,blockText;blockText=list[ii];ii++){
      if(new RegExp('<block type="'+eventType+'">').exec(blockText)){
        var block = Blockly.Xml.textToDom('<xml>'+blockText+'</xml>').firstChild;
        block.setAttribute("gap", 5);
        xmlList.push(block);
      }
    }
    return xmlList;
  }
  
  workspace.registerToolboxCategoryCallback(
    'entranceCategory', editor_blockly.entranceCategoryCallback);
  
  editor_blockly.searchBlockCategoryCallback = function(workspace) {
    var xmlList = [];
    var labels = editor_blockly.searchBlock();
    for (var i = 0; i < labels.length; i++) {
      var blockText = '<xml>' +
          MotaActionBlocks[labels[i]].xmlText() +
          '</xml>';
      var block = Blockly.Xml.textToDom(blockText).firstChild;
      block.setAttribute("gap", 5);
      xmlList.push(block);
    }
    return xmlList;
  };
  
  workspace.registerToolboxCategoryCallback(
    'searchBlockCategory', editor_blockly.searchBlockCategoryCallback);
   
  var onresize = function(e) {
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    Blockly.svgResize(workspace);
  };
  if(typeof editor !== "undefined" && !editor.isMobile)window.addEventListener('resize', onresize, false);
  onresize();
  //Blockly.svgResize(workspace);
  
  //Blockly.bindEventWithChecks_(workspace.svgGroup_,"wheel",workspace,function(e){});
  document.getElementById('blocklyDiv').onmousewheel = function(e){
    //console.log(e);
    e.preventDefault();
    var hvScroll = e.shiftKey?'hScroll':'vScroll';
    var mousewheelOffsetValue=20/380*workspace.scrollbar[hvScroll].handleLength_*3;
    workspace.scrollbar[hvScroll].handlePosition_+=( ((e.deltaY||0)+(e.detail||0)) >0?mousewheelOffsetValue:-mousewheelOffsetValue);
    workspace.scrollbar[hvScroll].onScroll_();
    // workspace.setScale(workspace.scale);
  }
  
  var doubleClickCheck=[[0,'abc']];
  function omitedcheckUpdateFunction(event) {
    if(event.type==='create'){
      editor_blockly.addIntoLastUsedType(event.blockId);
    }
    if(event.type==='ui' && event.element == 'click'){
      var newClick = [new Date().getTime(),event.blockId];
      var lastClick = doubleClickCheck.shift();
      doubleClickCheck.push(newClick);
      if(newClick[0]-lastClick[0]<500){
        if(newClick[1]===lastClick[1]){
          editor_blockly.doubleClickBlock(newClick[1]);
        }
      }
    }
    // Only handle these events
    if (["create", "move", "change", "delete"].indexOf(event.type) < 0) return;
    if(editor_blockly.workspace.topBlocks_.length>=2){
      editor_blockly.setValue('入口方块只能有一个');
      return;
    }
    var eventType = editor_blockly.entryType;
    if(editor_blockly.workspace.topBlocks_.length==1){
      var blockType = editor_blockly.workspace.topBlocks_[0].type;
      if(blockType!==eventType+'_m' && !(editor_blockly.isCommonEntry() && blockType == 'common_m')){
        editor_blockly.setValue('入口方块类型错误');
        return;
      }
    }
    try {
      var code = Blockly.JavaScript.workspaceToCode(workspace).replace(/\\(i|c|d|e|g|z)/g, '\\\\$1');
      editor_blockly.setValue(code);
    } catch (error) {
      editor_blockly.setValue(String(error));
      if (error instanceof OmitedError){
      var blockName = error.blockName;
      var varName = error.varName;
      var block = error.block;
      }
      // console.log(error);
    }
    }
  
    workspace.addChangeListener(omitedcheckUpdateFunction);
  
    workspace.addChangeListener(Blockly.Events.disableOrphans);
  
    editor_blockly.workspace = workspace;
  
    MotaActionFunctions.workspace = function(){
      return editor_blockly.workspace;
    }
  
    // 因为在editor_blockly.parse里已经HTML转义过一次了,所以这里要覆盖掉以避免在注释中出现&lt;等
    MotaActionFunctions.xmlText = function (ruleName,inputs,isShadow,comment,collapsed,disabled) {
      var rule = MotaActionBlocks[ruleName];
      var blocktext = isShadow?'shadow':'block';
      var xmlText = [];
      xmlText.push('<'+blocktext+' type="'+ruleName+'"'+(collapsed ? ' collapsed="true"' : '')+(disabled ? ' disabled="true"' : '')+'>');
      if(!inputs)inputs=[];
      for (var ii=0,inputType;inputType=rule.argsType[ii];ii++) {
        var input = inputs[ii];
        var _input = '';
        var noinput = (input===null || input===undefined);
        if(noinput && inputType==='field' && MotaActionBlocks[rule.argsGrammarName[ii]].type!=='field_dropdown') continue;
        if(noinput && inputType==='field') {
          noinput = false;
          input = rule.fieldDefault(rule.args[ii])
        }
        if(noinput) input = '';
        if(inputType==='field' && MotaActionBlocks[rule.argsGrammarName[ii]].type==='field_checkbox')input=input?'TRUE':'FALSE';
        if(inputType!=='field') {
          var subList = false;
          var subrulename = rule.argsGrammarName[ii];
          var subrule = MotaActionBlocks[subrulename];
          if (subrule instanceof Array) {
            subrulename=subrule[subrule.length-1];
            subrule = MotaActionBlocks[subrulename];
            subList = true;
          }
          _input = subrule.xmlText([],true);
          if(noinput && !subList && !isShadow) {
            //无输入的默认行为是: 如果语句块的备选方块只有一个,直接代入方块
            input = subrule.xmlText();
          }
        }
        xmlText.push('<'+inputType+' name="'+rule.args[ii]+'">');
        xmlText.push(_input+input);
        xmlText.push('</'+inputType+'>');
      }
      if(comment){
        xmlText.push('<comment>');
        xmlText.push(comment);
        xmlText.push('</comment>');
      }
      var next = inputs[rule.args.length];
      if (next) {//next
        xmlText.push('<next>');
        xmlText.push(next);
        xmlText.push('</next>');
      }
      xmlText.push('</'+blocktext+'>');
      return xmlText.join('');
    }
  })();
  