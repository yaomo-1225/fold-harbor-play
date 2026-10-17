(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FoldHarbor = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VECTORS = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
  const REFLECTIONS = [[1, 0, 3, 2], [3, 2, 1, 0]];
  // Deliberately fixed, offline-verified boards. Coordinates are zero-based.
  // slash 0 = /; slash 1 = \\; phase 1 turns non-fixed mirrors by 90 degrees.
  const LEVELS = [
  {
    "id": 1,
    "title": "空港来信",
    "subtitle": "拨开船影，找到通往海面的航线",
    "width": 5,
    "height": 5,
    "phase": 0,
    "parFlips": 0,
    "ships": [
      {
        "id": "A",
        "x": 1,
        "y": 4,
        "dir": 0
      },
      {
        "id": "B",
        "x": 1,
        "y": 1,
        "dir": 1
      },
      {
        "id": "C",
        "x": 4,
        "y": 1,
        "dir": 2
      }
    ],
    "mirrors": [],
    "walls": [],
    "tip": "船只沿箭头前进。放走前方的船，就会为后面的船腾出航道。",
    "chapter": 1,
    "chapterTitle": "初航群岛",
    "difficulty": 1
  },
  {
    "id": 2,
    "title": "折光初航",
    "subtitle": "每次离港，镜面都会换向",
    "width": 5,
    "height": 5,
    "phase": 0,
    "parFlips": 0,
    "ships": [
      {
        "id": "A",
        "x": 0,
        "y": 1,
        "dir": 1
      },
      {
        "id": "B",
        "x": 4,
        "y": 3,
        "dir": 3
      }
    ],
    "mirrors": [
      {
        "x": 3,
        "y": 1,
        "slash": 0
      },
      {
        "x": 1,
        "y": 3,
        "slash": 0
      }
    ],
    "walls": [],
    "tip": "镜面会把航线转弯；一艘船离港后，所有镜面自动旋转。观察下一艘船的新航线。",
    "chapter": 1,
    "chapterTitle": "初航群岛",
    "difficulty": 1
  },
  {
    "id": 3,
    "title": "把光拨回来",
    "subtitle": "自由切换两相，让航线避开礁石",
    "width": 5,
    "height": 5,
    "phase": 0,
    "parFlips": 1,
    "ships": [
      {
        "id": "A",
        "x": 0,
        "y": 1,
        "dir": 1
      },
      {
        "id": "B",
        "x": 0,
        "y": 3,
        "dir": 1
      }
    ],
    "mirrors": [
      {
        "x": 3,
        "y": 1,
        "slash": 0
      },
      {
        "x": 1,
        "y": 3,
        "slash": 0
      }
    ],
    "walls": [
      {
        "x": 3,
        "y": 4
      },
      {
        "x": 1,
        "y": 4
      }
    ],
    "tip": "这片海域的南岸有礁石。随时换相，看看镜面能否把船引向北方。",
    "chapter": 1,
    "chapterTitle": "初航群岛",
    "difficulty": 1
  },
  {
    "id": 4,
    "title": "光的岔路",
    "subtitle": "同一面镜子，通往两个方向",
    "width": 5,
    "height": 5,
    "phase": 1,
    "parFlips": 1,
    "ships": [
      {
        "id": "A",
        "x": 4,
        "y": 0,
        "dir": 2
      },
      {
        "id": "B",
        "x": 4,
        "y": 3,
        "dir": 1
      },
      {
        "id": "C",
        "x": 3,
        "y": 1,
        "dir": 2
      },
      {
        "id": "D",
        "x": 3,
        "y": 0,
        "dir": 2
      },
      {
        "id": "E",
        "x": 1,
        "y": 3,
        "dir": 1
      }
    ],
    "mirrors": [
      {
        "x": 4,
        "y": 2,
        "slash": 0
      },
      {
        "x": 0,
        "y": 1,
        "slash": 1
      },
      {
        "x": 3,
        "y": 3,
        "slash": 0
      },
      {
        "x": 3,
        "y": 4,
        "slash": 1
      },
      {
        "x": 0,
        "y": 0,
        "slash": 0
      }
    ],
    "walls": [
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 1,
        "y": 4
      },
      {
        "x": 0,
        "y": 3
      }
    ],
    "tip": "镜面的一次转向，就能改变出口。可以放走任何航线畅通的船，换相不限次数。",
    "chapter": 1,
    "chapterTitle": "初航群岛",
    "difficulty": 2
  },
  {
    "id": 5,
    "title": "借船让潮",
    "subtitle": "离港的涟漪，让全场镜面转向",
    "width": 5,
    "height": 5,
    "phase": 1,
    "parFlips": 1,
    "ships": [
      {
        "id": "A",
        "x": 3,
        "y": 1,
        "dir": 1
      },
      {
        "id": "B",
        "x": 2,
        "y": 3,
        "dir": 1
      },
      {
        "id": "C",
        "x": 0,
        "y": 2,
        "dir": 2
      },
      {
        "id": "D",
        "x": 0,
        "y": 1,
        "dir": 2
      },
      {
        "id": "E",
        "x": 1,
        "y": 0,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 2,
        "y": 4,
        "slash": 1
      },
      {
        "x": 4,
        "y": 1,
        "slash": 1
      },
      {
        "x": 2,
        "y": 0,
        "slash": 0
      },
      {
        "x": 4,
        "y": 3,
        "slash": 0
      },
      {
        "x": 0,
        "y": 3,
        "slash": 1
      }
    ],
    "walls": [
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 4,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      }
    ],
    "tip": "每次离港也会自动换相。观察涟漪后的新航线，遇到阻挡就试试另一相。",
    "chapter": 1,
    "chapterTitle": "初航群岛",
    "difficulty": 2
  },
  {
    "id": 6,
    "title": "南岸回声",
    "subtitle": "循着折光，越过南岸的礁石",
    "width": 6,
    "height": 6,
    "phase": 1,
    "parFlips": 1,
    "ships": [
      {
        "id": "A",
        "x": 3,
        "y": 2,
        "dir": 1
      },
      {
        "id": "B",
        "x": 0,
        "y": 1,
        "dir": 2
      },
      {
        "id": "C",
        "x": 1,
        "y": 5,
        "dir": 2
      },
      {
        "id": "D",
        "x": 0,
        "y": 3,
        "dir": 2
      },
      {
        "id": "E",
        "x": 3,
        "y": 3,
        "dir": 1
      },
      {
        "id": "F",
        "x": 0,
        "y": 0,
        "dir": 2
      },
      {
        "id": "G",
        "x": 3,
        "y": 4,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 4,
        "y": 4,
        "slash": 1
      },
      {
        "x": 0,
        "y": 5,
        "slash": 1
      },
      {
        "x": 3,
        "y": 5,
        "slash": 0
      },
      {
        "x": 5,
        "y": 1,
        "slash": 0
      },
      {
        "x": 1,
        "y": 1,
        "slash": 1
      },
      {
        "x": 5,
        "y": 2,
        "slash": 1
      },
      {
        "x": 4,
        "y": 3,
        "slash": 0
      }
    ],
    "walls": [
      {
        "x": 5,
        "y": 4
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 2,
        "y": 3
      },
      {
        "x": 4,
        "y": 0
      },
      {
        "x": 5,
        "y": 3
      }
    ],
    "tip": "南岸的镜面能把纵向航线变成横向。先预览折线，再决定是否放行。",
    "chapter": 1,
    "chapterTitle": "初航群岛",
    "difficulty": 3
  },
  {
    "id": 7,
    "title": "七船连锁",
    "subtitle": "一条航线，可以连折数次",
    "width": 6,
    "height": 6,
    "phase": 0,
    "parFlips": 1,
    "ships": [
      {
        "id": "A",
        "x": 3,
        "y": 0,
        "dir": 2
      },
      {
        "id": "B",
        "x": 0,
        "y": 3,
        "dir": 1
      },
      {
        "id": "C",
        "x": 1,
        "y": 2,
        "dir": 2
      },
      {
        "id": "D",
        "x": 4,
        "y": 0,
        "dir": 2
      },
      {
        "id": "E",
        "x": 3,
        "y": 3,
        "dir": 3
      },
      {
        "id": "F",
        "x": 3,
        "y": 4,
        "dir": 3
      },
      {
        "id": "G",
        "x": 5,
        "y": 3,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 4,
        "y": 3,
        "slash": 1
      },
      {
        "x": 5,
        "y": 5,
        "slash": 1
      },
      {
        "x": 0,
        "y": 5,
        "slash": 0
      },
      {
        "x": 1,
        "y": 3,
        "slash": 0
      },
      {
        "x": 3,
        "y": 5,
        "slash": 1
      },
      {
        "x": 0,
        "y": 4,
        "slash": 0
      },
      {
        "x": 1,
        "y": 5,
        "slash": 0
      }
    ],
    "walls": [
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 5,
        "y": 1
      },
      {
        "x": 4,
        "y": 4
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      }
    ],
    "tip": "航线可以连续经过多面镜子。留意每次转折，自由换相来寻找连通的出口。",
    "chapter": 1,
    "chapterTitle": "初航群岛",
    "difficulty": 3
  },
  {
    "id": 8,
    "title": "双相星港",
    "subtitle": "在两种光路之间，自由领航",
    "width": 6,
    "height": 6,
    "phase": 0,
    "parFlips": 2,
    "ships": [
      {
        "id": "A",
        "x": 5,
        "y": 3,
        "dir": 1
      },
      {
        "id": "B",
        "x": 0,
        "y": 2,
        "dir": 1
      },
      {
        "id": "C",
        "x": 5,
        "y": 0,
        "dir": 3
      },
      {
        "id": "D",
        "x": 3,
        "y": 1,
        "dir": 1
      },
      {
        "id": "E",
        "x": 4,
        "y": 0,
        "dir": 3
      },
      {
        "id": "F",
        "x": 1,
        "y": 1,
        "dir": 1
      },
      {
        "id": "G",
        "x": 2,
        "y": 1,
        "dir": 1
      }
    ],
    "mirrors": [
      {
        "x": 4,
        "y": 1,
        "slash": 0
      },
      {
        "x": 3,
        "y": 2,
        "slash": 1
      },
      {
        "x": 3,
        "y": 0,
        "slash": 1
      },
      {
        "x": 5,
        "y": 1,
        "slash": 0
      },
      {
        "x": 2,
        "y": 3,
        "slash": 0
      },
      {
        "x": 0,
        "y": 3,
        "slash": 1
      },
      {
        "x": 1,
        "y": 2,
        "slash": 0
      }
    ],
    "walls": [
      {
        "x": 1,
        "y": 0
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 2,
        "y": 2
      },
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 4,
        "y": 2
      }
    ],
    "tip": "两相都是可随时使用的航道。放走眼前畅通的船，再切换光路，直到全港归航。",
    "chapter": 1,
    "chapterTitle": "初航群岛",
    "difficulty": 4
  },
  {
    "chapter": 2,
    "chapterTitle": "金镜海湾",
    "difficulty": 1,
    "width": 5,
    "height": 5,
    "phase": 0,
    "parFlips": 0,
    "walls": [],
    "portals": [],
    "gates": [],
    "id": 9,
    "title": "金镜初见",
    "subtitle": "金镜不转，普通镜随离港翻转",
    "mechanicIntro": "fixed",
    "ships": [
      {
        "id": "A",
        "x": 0,
        "y": 1,
        "dir": 1
      },
      {
        "id": "B",
        "x": 4,
        "y": 3,
        "dir": 3
      },
      {
        "id": "C",
        "x": 0,
        "y": 4,
        "dir": 0
      }
    ],
    "mirrors": [
      {
        "x": 3,
        "y": 1,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 1,
        "y": 3,
        "slash": 1
      },
      {
        "x": 0,
        "y": 2,
        "slash": 0,
        "fixed": true
      }
    ],
    "tip": "金色镜面保持朝向，蓝色镜面随离港翻转。先看一看两种镜面的不同。"
  },
  {
    "id": 10,
    "chapter": 2,
    "chapterTitle": "金镜海湾",
    "difficulty": 2,
    "title": "一静一动",
    "subtitle": "金镜保持方向，普通镜随潮翻转",
    "width": 5,
    "height": 5,
    "phase": 1,
    "parFlips": 0,
    "ships": [
      {
        "id": "A",
        "x": 3,
        "y": 4,
        "dir": 0
      },
      {
        "id": "B",
        "x": 0,
        "y": 2,
        "dir": 0
      },
      {
        "id": "C",
        "x": 0,
        "y": 0,
        "dir": 2
      },
      {
        "id": "D",
        "x": 3,
        "y": 1,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 4,
        "y": 3,
        "slash": 1
      },
      {
        "x": 1,
        "y": 0,
        "slash": 1
      },
      {
        "x": 0,
        "y": 1,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 3,
        "y": 3,
        "slash": 0,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 4,
        "y": 2
      }
    ],
    "portals": [],
    "gates": [],
    "tip": "金色镜面始终保持方向。普通镜会随离港翻转，也能随时自由换相。"
  },
  {
    "id": 11,
    "chapter": 2,
    "chapterTitle": "金镜海湾",
    "difficulty": 3,
    "title": "金色折返",
    "subtitle": "金镜保持方向，普通镜随潮翻转",
    "width": 6,
    "height": 6,
    "phase": 1,
    "parFlips": 2,
    "ships": [
      {
        "id": "A",
        "x": 2,
        "y": 1,
        "dir": 1
      },
      {
        "id": "B",
        "x": 3,
        "y": 1,
        "dir": 1
      },
      {
        "id": "C",
        "x": 4,
        "y": 1,
        "dir": 0
      },
      {
        "id": "D",
        "x": 4,
        "y": 4,
        "dir": 0
      },
      {
        "id": "E",
        "x": 4,
        "y": 5,
        "dir": 0
      }
    ],
    "mirrors": [
      {
        "x": 5,
        "y": 0,
        "slash": 1
      },
      {
        "x": 0,
        "y": 2,
        "slash": 0
      },
      {
        "x": 5,
        "y": 1,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 3,
        "y": 3,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 4,
        "y": 0,
        "slash": 0,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 3,
        "y": 2
      }
    ],
    "portals": [],
    "gates": [],
    "tip": "金色镜面始终保持方向。普通镜会随离港翻转，也能随时自由换相。"
  },
  {
    "id": 12,
    "chapter": 2,
    "chapterTitle": "金镜海湾",
    "difficulty": 3,
    "title": "斜光长廊",
    "subtitle": "金镜保持方向，普通镜随潮翻转",
    "width": 6,
    "height": 6,
    "phase": 1,
    "parFlips": 0,
    "ships": [
      {
        "id": "A",
        "x": 1,
        "y": 3,
        "dir": 1
      },
      {
        "id": "B",
        "x": 0,
        "y": 3,
        "dir": 1
      },
      {
        "id": "C",
        "x": 0,
        "y": 1,
        "dir": 1
      },
      {
        "id": "D",
        "x": 2,
        "y": 1,
        "dir": 1
      },
      {
        "id": "E",
        "x": 1,
        "y": 1,
        "dir": 1
      },
      {
        "id": "F",
        "x": 4,
        "y": 3,
        "dir": 1
      }
    ],
    "mirrors": [
      {
        "x": 3,
        "y": 1,
        "slash": 0
      },
      {
        "x": 2,
        "y": 5,
        "slash": 0
      },
      {
        "x": 3,
        "y": 0,
        "slash": 0
      },
      {
        "x": 0,
        "y": 5,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 5,
        "y": 3,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 5,
        "y": 0,
        "slash": 0,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 0,
        "y": 4
      },
      {
        "x": 2,
        "y": 0
      }
    ],
    "portals": [],
    "gates": [],
    "tip": "金色镜面始终保持方向。普通镜会随离港翻转，也能随时自由换相。"
  },
  {
    "id": 13,
    "chapter": 2,
    "chapterTitle": "金镜海湾",
    "difficulty": 4,
    "title": "交错灯塔",
    "subtitle": "金镜保持方向，普通镜随潮翻转",
    "width": 6,
    "height": 6,
    "phase": 0,
    "parFlips": 1,
    "ships": [
      {
        "id": "A",
        "x": 4,
        "y": 2,
        "dir": 0
      },
      {
        "id": "B",
        "x": 0,
        "y": 1,
        "dir": 1
      },
      {
        "id": "C",
        "x": 5,
        "y": 2,
        "dir": 0
      },
      {
        "id": "D",
        "x": 5,
        "y": 1,
        "dir": 0
      },
      {
        "id": "E",
        "x": 2,
        "y": 4,
        "dir": 0
      },
      {
        "id": "F",
        "x": 2,
        "y": 3,
        "dir": 0
      },
      {
        "id": "G",
        "x": 0,
        "y": 0,
        "dir": 1
      }
    ],
    "mirrors": [
      {
        "x": 0,
        "y": 5,
        "slash": 0
      },
      {
        "x": 2,
        "y": 0,
        "slash": 0
      },
      {
        "x": 1,
        "y": 0,
        "slash": 0
      },
      {
        "x": 1,
        "y": 1,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 5,
        "y": 3,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 4,
        "y": 1,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 5,
        "y": 0,
        "slash": 1,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 2,
        "y": 5
      },
      {
        "x": 4,
        "y": 3
      }
    ],
    "portals": [],
    "gates": [],
    "tip": "金色镜面始终保持方向。普通镜会随离港翻转，也能随时自由换相。"
  },
  {
    "id": 14,
    "chapter": 2,
    "chapterTitle": "金镜海湾",
    "difficulty": 4,
    "title": "星湾回环",
    "subtitle": "金镜保持方向，普通镜随潮翻转",
    "width": 6,
    "height": 6,
    "phase": 1,
    "parFlips": 2,
    "ships": [
      {
        "id": "A",
        "x": 0,
        "y": 0,
        "dir": 2
      },
      {
        "id": "B",
        "x": 1,
        "y": 2,
        "dir": 1
      },
      {
        "id": "C",
        "x": 2,
        "y": 0,
        "dir": 1
      },
      {
        "id": "D",
        "x": 2,
        "y": 2,
        "dir": 1
      },
      {
        "id": "E",
        "x": 4,
        "y": 0,
        "dir": 2
      },
      {
        "id": "F",
        "x": 0,
        "y": 2,
        "dir": 1
      },
      {
        "id": "G",
        "x": 1,
        "y": 0,
        "dir": 1
      },
      {
        "id": "H",
        "x": 1,
        "y": 3,
        "dir": 3
      }
    ],
    "mirrors": [
      {
        "x": 5,
        "y": 1,
        "slash": 1
      },
      {
        "x": 3,
        "y": 2,
        "slash": 1
      },
      {
        "x": 4,
        "y": 1,
        "slash": 0
      },
      {
        "x": 0,
        "y": 1,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 3,
        "y": 1,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 0,
        "y": 3,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 3,
        "y": 0,
        "slash": 1,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 5,
        "y": 5
      }
    ],
    "portals": [],
    "gates": [],
    "tip": "金色镜面始终保持方向。普通镜会随离港翻转，也能随时自由换相。"
  },
  {
    "id": 15,
    "chapter": 2,
    "chapterTitle": "金镜海湾",
    "difficulty": 5,
    "title": "九船候潮",
    "subtitle": "金镜保持方向，普通镜随潮翻转",
    "width": 6,
    "height": 6,
    "phase": 0,
    "parFlips": 1,
    "ships": [
      {
        "id": "A",
        "x": 3,
        "y": 0,
        "dir": 2
      },
      {
        "id": "B",
        "x": 2,
        "y": 5,
        "dir": 0
      },
      {
        "id": "C",
        "x": 2,
        "y": 1,
        "dir": 3
      },
      {
        "id": "D",
        "x": 0,
        "y": 4,
        "dir": 2
      },
      {
        "id": "E",
        "x": 0,
        "y": 3,
        "dir": 2
      },
      {
        "id": "F",
        "x": 1,
        "y": 1,
        "dir": 3
      },
      {
        "id": "G",
        "x": 1,
        "y": 0,
        "dir": 3
      },
      {
        "id": "H",
        "x": 0,
        "y": 2,
        "dir": 2
      },
      {
        "id": "I",
        "x": 5,
        "y": 2,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 1,
        "y": 4,
        "slash": 1
      },
      {
        "x": 0,
        "y": 1,
        "slash": 1
      },
      {
        "x": 2,
        "y": 4,
        "slash": 0
      },
      {
        "x": 5,
        "y": 4,
        "slash": 1
      },
      {
        "x": 0,
        "y": 0,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 1,
        "y": 5,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 3,
        "y": 1,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 0,
        "y": 5,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 5,
        "y": 3,
        "slash": 1,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 4,
        "y": 3
      }
    ],
    "portals": [],
    "gates": [],
    "tip": "金色镜面始终保持方向。普通镜会随离港翻转，也能随时自由换相。"
  },
  {
    "id": 16,
    "chapter": 2,
    "chapterTitle": "金镜海湾",
    "difficulty": 5,
    "title": "万镜归航",
    "subtitle": "金镜保持方向，普通镜随潮翻转",
    "width": 6,
    "height": 6,
    "phase": 1,
    "parFlips": 2,
    "ships": [
      {
        "id": "A",
        "x": 4,
        "y": 5,
        "dir": 3
      },
      {
        "id": "B",
        "x": 2,
        "y": 5,
        "dir": 3
      },
      {
        "id": "C",
        "x": 5,
        "y": 5,
        "dir": 3
      },
      {
        "id": "D",
        "x": 0,
        "y": 5,
        "dir": 1
      },
      {
        "id": "E",
        "x": 3,
        "y": 5,
        "dir": 3
      },
      {
        "id": "F",
        "x": 0,
        "y": 2,
        "dir": 2
      },
      {
        "id": "G",
        "x": 0,
        "y": 1,
        "dir": 2
      },
      {
        "id": "H",
        "x": 0,
        "y": 3,
        "dir": 2
      },
      {
        "id": "I",
        "x": 1,
        "y": 2,
        "dir": 2
      },
      {
        "id": "J",
        "x": 1,
        "y": 3,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 2,
        "y": 4,
        "slash": 0
      },
      {
        "x": 4,
        "y": 4,
        "slash": 1
      },
      {
        "x": 1,
        "y": 5,
        "slash": 1
      },
      {
        "x": 2,
        "y": 3,
        "slash": 1
      },
      {
        "x": 1,
        "y": 0,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 1,
        "y": 4,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 5,
        "y": 1,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 0,
        "y": 0,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 0,
        "y": 4,
        "slash": 1,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 1,
        "y": 1
      },
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 4,
        "y": 1
      }
    ],
    "portals": [],
    "gates": [],
    "tip": "金色镜面始终保持方向。普通镜会随离港翻转，也能随时自由换相。"
  },
  {
    "chapter": 3,
    "chapterTitle": "双子星门",
    "difficulty": 1,
    "width": 5,
    "height": 5,
    "phase": 0,
    "parFlips": 0,
    "walls": [],
    "portals": [
      {
        "x": 1,
        "y": 1,
        "pair": "1"
      },
      {
        "x": 3,
        "y": 3,
        "pair": "1"
      }
    ],
    "gates": [],
    "id": 17,
    "title": "双子来信",
    "subtitle": "同号星门相连，出门后方向不变",
    "mechanicIntro": "portal",
    "ships": [
      {
        "id": "A",
        "x": 0,
        "y": 1,
        "dir": 1
      },
      {
        "id": "B",
        "x": 2,
        "y": 3,
        "dir": 1
      },
      {
        "id": "C",
        "x": 0,
        "y": 4,
        "dir": 1
      }
    ],
    "mirrors": [
      {
        "x": 3,
        "y": 4,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 4,
        "y": 1,
        "slash": 1
      }
    ],
    "tip": "船进入星门①，会立刻出现在另一座①，继续朝原方向走。预览中的虚线只是跳跃，不会碰到中间的物体。"
  },
  {
    "id": 18,
    "chapter": 3,
    "chapterTitle": "双子星门",
    "difficulty": 2,
    "title": "隔海相逢",
    "subtitle": "穿过同号星门，沿原方向继续航行",
    "width": 5,
    "height": 5,
    "phase": 1,
    "parFlips": 0,
    "ships": [
      {
        "id": "A",
        "x": 0,
        "y": 3,
        "dir": 0
      },
      {
        "id": "B",
        "x": 0,
        "y": 4,
        "dir": 0
      },
      {
        "id": "C",
        "x": 0,
        "y": 2,
        "dir": 0
      },
      {
        "id": "D",
        "x": 0,
        "y": 0,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 2,
        "y": 4,
        "slash": 1
      },
      {
        "x": 0,
        "y": 1,
        "slash": 0
      },
      {
        "x": 3,
        "y": 1,
        "slash": 1,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 2,
        "y": 2
      }
    ],
    "portals": [
      {
        "x": 1,
        "y": 3,
        "pair": "1"
      },
      {
        "x": 3,
        "y": 2,
        "pair": "1"
      }
    ],
    "gates": [],
    "tip": "同号星门成对相连。邮船跳到另一端后仍朝原方向前进，预览中虚线表示跳跃。"
  },
  {
    "id": 19,
    "chapter": 3,
    "chapterTitle": "双子星门",
    "difficulty": 3,
    "title": "星门接力",
    "subtitle": "穿过同号星门，沿原方向继续航行",
    "width": 6,
    "height": 6,
    "phase": 1,
    "parFlips": 0,
    "ships": [
      {
        "id": "A",
        "x": 4,
        "y": 5,
        "dir": 3
      },
      {
        "id": "B",
        "x": 5,
        "y": 5,
        "dir": 3
      },
      {
        "id": "C",
        "x": 3,
        "y": 5,
        "dir": 3
      },
      {
        "id": "D",
        "x": 0,
        "y": 1,
        "dir": 0
      },
      {
        "id": "E",
        "x": 5,
        "y": 0,
        "dir": 3
      }
    ],
    "mirrors": [
      {
        "x": 0,
        "y": 0,
        "slash": 0
      },
      {
        "x": 5,
        "y": 4,
        "slash": 1
      },
      {
        "x": 0,
        "y": 3,
        "slash": 0,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 4,
        "y": 2
      }
    ],
    "portals": [
      {
        "x": 2,
        "y": 0,
        "pair": "1"
      },
      {
        "x": 2,
        "y": 5,
        "pair": "1"
      }
    ],
    "gates": [],
    "tip": "同号星门成对相连。邮船跳到另一端后仍朝原方向前进，预览中虚线表示跳跃。"
  },
  {
    "id": 20,
    "chapter": 3,
    "chapterTitle": "双子星门",
    "difficulty": 3,
    "title": "折光跃迁",
    "subtitle": "穿过同号星门，沿原方向继续航行",
    "width": 6,
    "height": 6,
    "phase": 0,
    "parFlips": 0,
    "ships": [
      {
        "id": "A",
        "x": 3,
        "y": 5,
        "dir": 0
      },
      {
        "id": "B",
        "x": 3,
        "y": 4,
        "dir": 0
      },
      {
        "id": "C",
        "x": 2,
        "y": 2,
        "dir": 3
      },
      {
        "id": "D",
        "x": 3,
        "y": 3,
        "dir": 0
      },
      {
        "id": "E",
        "x": 0,
        "y": 2,
        "dir": 1
      },
      {
        "id": "F",
        "x": 1,
        "y": 3,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 0,
        "y": 4,
        "slash": 0
      },
      {
        "x": 1,
        "y": 2,
        "slash": 0
      },
      {
        "x": 3,
        "y": 2,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 0,
        "y": 0,
        "slash": 1,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 0,
        "y": 1
      },
      {
        "x": 5,
        "y": 4
      }
    ],
    "portals": [
      {
        "x": 1,
        "y": 5,
        "pair": "1"
      },
      {
        "x": 5,
        "y": 5,
        "pair": "1"
      }
    ],
    "gates": [],
    "tip": "同号星门成对相连。邮船跳到另一端后仍朝原方向前进，预览中虚线表示跳跃。"
  },
  {
    "id": 21,
    "chapter": 3,
    "chapterTitle": "双子星门",
    "difficulty": 4,
    "title": "彼岸航标",
    "subtitle": "穿过同号星门，沿原方向继续航行",
    "width": 6,
    "height": 6,
    "phase": 0,
    "parFlips": 4,
    "ships": [
      {
        "id": "A",
        "x": 1,
        "y": 4,
        "dir": 3
      },
      {
        "id": "B",
        "x": 0,
        "y": 3,
        "dir": 1
      },
      {
        "id": "C",
        "x": 3,
        "y": 3,
        "dir": 1
      },
      {
        "id": "D",
        "x": 1,
        "y": 3,
        "dir": 1
      },
      {
        "id": "E",
        "x": 2,
        "y": 3,
        "dir": 1
      },
      {
        "id": "F",
        "x": 4,
        "y": 1,
        "dir": 2
      },
      {
        "id": "G",
        "x": 4,
        "y": 0,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 4,
        "y": 2,
        "slash": 1
      },
      {
        "x": 5,
        "y": 2,
        "slash": 1
      },
      {
        "x": 4,
        "y": 5,
        "slash": 1
      },
      {
        "x": 0,
        "y": 4,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 3,
        "y": 5,
        "slash": 1,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 2,
        "y": 4
      }
    ],
    "portals": [
      {
        "x": 1,
        "y": 2,
        "pair": "1"
      },
      {
        "x": 2,
        "y": 2,
        "pair": "1"
      },
      {
        "x": 4,
        "y": 3,
        "pair": "2"
      },
      {
        "x": 0,
        "y": 2,
        "pair": "2"
      }
    ],
    "gates": [],
    "tip": "同号星门成对相连。邮船跳到另一端后仍朝原方向前进，预览中虚线表示跳跃。"
  },
  {
    "id": 22,
    "chapter": 3,
    "chapterTitle": "双子星门",
    "difficulty": 4,
    "title": "两组星桥",
    "subtitle": "穿过同号星门，沿原方向继续航行",
    "width": 6,
    "height": 6,
    "phase": 1,
    "parFlips": 2,
    "ships": [
      {
        "id": "A",
        "x": 2,
        "y": 4,
        "dir": 2
      },
      {
        "id": "B",
        "x": 0,
        "y": 1,
        "dir": 0
      },
      {
        "id": "C",
        "x": 0,
        "y": 4,
        "dir": 0
      },
      {
        "id": "D",
        "x": 0,
        "y": 2,
        "dir": 0
      },
      {
        "id": "E",
        "x": 0,
        "y": 3,
        "dir": 0
      },
      {
        "id": "F",
        "x": 0,
        "y": 5,
        "dir": 0
      },
      {
        "id": "G",
        "x": 3,
        "y": 0,
        "dir": 2
      },
      {
        "id": "H",
        "x": 2,
        "y": 3,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 5,
        "y": 0,
        "slash": 0
      },
      {
        "x": 3,
        "y": 2,
        "slash": 0
      },
      {
        "x": 1,
        "y": 2,
        "slash": 0
      },
      {
        "x": 4,
        "y": 1,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 2,
        "y": 5,
        "slash": 1,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 4,
        "y": 0
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 1,
        "y": 0
      }
    ],
    "portals": [
      {
        "x": 5,
        "y": 5,
        "pair": "1"
      },
      {
        "x": 1,
        "y": 5,
        "pair": "1"
      },
      {
        "x": 0,
        "y": 0,
        "pair": "2"
      },
      {
        "x": 5,
        "y": 1,
        "pair": "2"
      }
    ],
    "gates": [],
    "tip": "同号星门成对相连。邮船跳到另一端后仍朝原方向前进，预览中虚线表示跳跃。"
  },
  {
    "id": 23,
    "chapter": 3,
    "chapterTitle": "双子星门",
    "difficulty": 5,
    "title": "金镜穿梭",
    "subtitle": "穿过同号星门，沿原方向继续航行",
    "width": 6,
    "height": 6,
    "phase": 0,
    "parFlips": 3,
    "ships": [
      {
        "id": "A",
        "x": 2,
        "y": 4,
        "dir": 0
      },
      {
        "id": "B",
        "x": 1,
        "y": 1,
        "dir": 1
      },
      {
        "id": "C",
        "x": 2,
        "y": 5,
        "dir": 0
      },
      {
        "id": "D",
        "x": 5,
        "y": 5,
        "dir": 3
      },
      {
        "id": "E",
        "x": 4,
        "y": 0,
        "dir": 2
      },
      {
        "id": "F",
        "x": 3,
        "y": 5,
        "dir": 1
      },
      {
        "id": "G",
        "x": 0,
        "y": 1,
        "dir": 1
      },
      {
        "id": "H",
        "x": 4,
        "y": 1,
        "dir": 2
      },
      {
        "id": "I",
        "x": 2,
        "y": 3,
        "dir": 0
      }
    ],
    "mirrors": [
      {
        "x": 4,
        "y": 2,
        "slash": 1
      },
      {
        "x": 5,
        "y": 4,
        "slash": 0
      },
      {
        "x": 4,
        "y": 5,
        "slash": 0
      },
      {
        "x": 4,
        "y": 4,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 1,
        "y": 2,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 0,
        "y": 2,
        "slash": 0,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 0
      },
      {
        "x": 4,
        "y": 3
      }
    ],
    "portals": [
      {
        "x": 0,
        "y": 5,
        "pair": "1"
      },
      {
        "x": 5,
        "y": 3,
        "pair": "1"
      },
      {
        "x": 2,
        "y": 1,
        "pair": "2"
      },
      {
        "x": 1,
        "y": 4,
        "pair": "2"
      }
    ],
    "gates": [],
    "tip": "同号星门成对相连。邮船跳到另一端后仍朝原方向前进，预览中虚线表示跳跃。"
  },
  {
    "id": 24,
    "chapter": 3,
    "chapterTitle": "双子星门",
    "difficulty": 5,
    "title": "星海远航",
    "subtitle": "穿过同号星门，沿原方向继续航行",
    "width": 6,
    "height": 6,
    "phase": 0,
    "parFlips": 4,
    "ships": [
      {
        "id": "A",
        "x": 5,
        "y": 0,
        "dir": 3
      },
      {
        "id": "B",
        "x": 4,
        "y": 0,
        "dir": 3
      },
      {
        "id": "C",
        "x": 2,
        "y": 0,
        "dir": 3
      },
      {
        "id": "D",
        "x": 1,
        "y": 0,
        "dir": 3
      },
      {
        "id": "E",
        "x": 0,
        "y": 1,
        "dir": 0
      },
      {
        "id": "F",
        "x": 3,
        "y": 0,
        "dir": 3
      },
      {
        "id": "G",
        "x": 3,
        "y": 4,
        "dir": 0
      },
      {
        "id": "H",
        "x": 2,
        "y": 4,
        "dir": 0
      },
      {
        "id": "I",
        "x": 2,
        "y": 2,
        "dir": 2
      },
      {
        "id": "J",
        "x": 4,
        "y": 3,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 2,
        "y": 3,
        "slash": 1
      },
      {
        "x": 5,
        "y": 4,
        "slash": 1
      },
      {
        "x": 2,
        "y": 5,
        "slash": 0
      },
      {
        "x": 3,
        "y": 3,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 1,
        "y": 5,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 0,
        "y": 2,
        "slash": 0,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 4,
        "y": 2
      },
      {
        "x": 2,
        "y": 1
      },
      {
        "x": 4,
        "y": 5
      }
    ],
    "portals": [
      {
        "x": 3,
        "y": 5,
        "pair": "1"
      },
      {
        "x": 0,
        "y": 0,
        "pair": "1"
      },
      {
        "x": 5,
        "y": 2,
        "pair": "2"
      },
      {
        "x": 4,
        "y": 4,
        "pair": "2"
      }
    ],
    "gates": [],
    "tip": "同号星门成对相连。邮船跳到另一端后仍朝原方向前进，预览中虚线表示跳跃。"
  },
  {
    "chapter": 4,
    "chapterTitle": "潮汐群岛",
    "difficulty": 1,
    "width": 5,
    "height": 5,
    "phase": 0,
    "parFlips": 0,
    "walls": [],
    "portals": [],
    "gates": [
      {
        "x": 2,
        "y": 1,
        "openPhase": 0
      },
      {
        "x": 2,
        "y": 3,
        "openPhase": 1
      }
    ],
    "id": 25,
    "title": "潮门初开",
    "subtitle": "亮门通行，暗门换相再走",
    "mechanicIntro": "gate",
    "ships": [
      {
        "id": "A",
        "x": 0,
        "y": 1,
        "dir": 1
      },
      {
        "id": "B",
        "x": 4,
        "y": 3,
        "dir": 3
      },
      {
        "id": "C",
        "x": 0,
        "y": 4,
        "dir": 1
      }
    ],
    "mirrors": [
      {
        "x": 3,
        "y": 4,
        "slash": 0,
        "fixed": true
      }
    ],
    "tip": "亮起的潮门可直接穿过，暗门会挡住航线。每次离港都会换相，也可以随时主动切换。"
  },
  {
    "id": 26,
    "chapter": 4,
    "chapterTitle": "潮汐群岛",
    "difficulty": 2,
    "title": "一开一合",
    "subtitle": "看准潮门明暗，在两相之间穿行",
    "width": 5,
    "height": 5,
    "phase": 1,
    "parFlips": 0,
    "ships": [
      {
        "id": "A",
        "x": 4,
        "y": 1,
        "dir": 3
      },
      {
        "id": "B",
        "x": 2,
        "y": 3,
        "dir": 2
      },
      {
        "id": "C",
        "x": 1,
        "y": 4,
        "dir": 1
      },
      {
        "id": "D",
        "x": 2,
        "y": 2,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 2,
        "y": 4,
        "slash": 0
      },
      {
        "x": 1,
        "y": 3,
        "slash": 0
      },
      {
        "x": 3,
        "y": 4,
        "slash": 0,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 0,
        "y": 4
      }
    ],
    "portals": [
      {
        "x": 3,
        "y": 0,
        "pair": "1"
      },
      {
        "x": 0,
        "y": 0,
        "pair": "1"
      }
    ],
    "gates": [
      {
        "x": 2,
        "y": 1,
        "openPhase": 0
      }
    ],
    "tip": "亮起的潮门可以直穿，暗下的潮门暂时阻挡。换相不限次数，总能继续找到出口。"
  },
  {
    "id": 27,
    "chapter": 4,
    "chapterTitle": "潮汐群岛",
    "difficulty": 3,
    "title": "潮间航线",
    "subtitle": "看准潮门明暗，在两相之间穿行",
    "width": 6,
    "height": 6,
    "phase": 1,
    "parFlips": 1,
    "ships": [
      {
        "id": "A",
        "x": 3,
        "y": 4,
        "dir": 0
      },
      {
        "id": "B",
        "x": 3,
        "y": 5,
        "dir": 0
      },
      {
        "id": "C",
        "x": 1,
        "y": 5,
        "dir": 0
      },
      {
        "id": "D",
        "x": 1,
        "y": 4,
        "dir": 0
      },
      {
        "id": "E",
        "x": 2,
        "y": 3,
        "dir": 1
      }
    ],
    "mirrors": [
      {
        "x": 2,
        "y": 5,
        "slash": 0
      },
      {
        "x": 1,
        "y": 2,
        "slash": 0
      },
      {
        "x": 3,
        "y": 2,
        "slash": 1,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 4,
        "y": 5
      },
      {
        "x": 4,
        "y": 4
      }
    ],
    "portals": [
      {
        "x": 0,
        "y": 2,
        "pair": "1"
      },
      {
        "x": 0,
        "y": 0,
        "pair": "1"
      }
    ],
    "gates": [
      {
        "x": 3,
        "y": 3,
        "openPhase": 0
      }
    ],
    "tip": "亮起的潮门可以直穿，暗下的潮门暂时阻挡。换相不限次数，总能继续找到出口。"
  },
  {
    "id": 28,
    "chapter": 4,
    "chapterTitle": "潮汐群岛",
    "difficulty": 3,
    "title": "越潮折返",
    "subtitle": "看准潮门明暗，在两相之间穿行",
    "width": 6,
    "height": 6,
    "phase": 1,
    "parFlips": 5,
    "ships": [
      {
        "id": "A",
        "x": 4,
        "y": 2,
        "dir": 3
      },
      {
        "id": "B",
        "x": 2,
        "y": 2,
        "dir": 3
      },
      {
        "id": "C",
        "x": 3,
        "y": 2,
        "dir": 3
      },
      {
        "id": "D",
        "x": 0,
        "y": 4,
        "dir": 2
      },
      {
        "id": "E",
        "x": 1,
        "y": 2,
        "dir": 3
      },
      {
        "id": "F",
        "x": 5,
        "y": 5,
        "dir": 3
      }
    ],
    "mirrors": [
      {
        "x": 3,
        "y": 4,
        "slash": 1
      },
      {
        "x": 4,
        "y": 1,
        "slash": 1
      },
      {
        "x": 0,
        "y": 2,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 1,
        "y": 5,
        "slash": 0,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 0,
        "y": 0
      },
      {
        "x": 1,
        "y": 3
      }
    ],
    "portals": [
      {
        "x": 4,
        "y": 4,
        "pair": "1"
      },
      {
        "x": 0,
        "y": 5,
        "pair": "1"
      }
    ],
    "gates": [
      {
        "x": 5,
        "y": 2,
        "openPhase": 0
      },
      {
        "x": 4,
        "y": 5,
        "openPhase": 1
      }
    ],
    "tip": "亮起的潮门可以直穿，暗下的潮门暂时阻挡。换相不限次数，总能继续找到出口。"
  },
  {
    "id": 29,
    "chapter": 4,
    "chapterTitle": "潮汐群岛",
    "difficulty": 4,
    "title": "星门听潮",
    "subtitle": "看准潮门明暗，在两相之间穿行",
    "width": 6,
    "height": 6,
    "phase": 0,
    "parFlips": 4,
    "ships": [
      {
        "id": "A",
        "x": 2,
        "y": 0,
        "dir": 1
      },
      {
        "id": "B",
        "x": 1,
        "y": 0,
        "dir": 1
      },
      {
        "id": "C",
        "x": 4,
        "y": 2,
        "dir": 2
      },
      {
        "id": "D",
        "x": 4,
        "y": 1,
        "dir": 2
      },
      {
        "id": "E",
        "x": 0,
        "y": 0,
        "dir": 1
      },
      {
        "id": "F",
        "x": 3,
        "y": 0,
        "dir": 1
      },
      {
        "id": "G",
        "x": 0,
        "y": 3,
        "dir": 2
      }
    ],
    "mirrors": [
      {
        "x": 2,
        "y": 3,
        "slash": 1
      },
      {
        "x": 4,
        "y": 5,
        "slash": 1
      },
      {
        "x": 0,
        "y": 5,
        "slash": 1
      },
      {
        "x": 2,
        "y": 2,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 4,
        "y": 0,
        "slash": 1,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 3,
        "y": 5
      },
      {
        "x": 5,
        "y": 0
      }
    ],
    "portals": [
      {
        "x": 3,
        "y": 1,
        "pair": "1"
      },
      {
        "x": 2,
        "y": 5,
        "pair": "1"
      },
      {
        "x": 5,
        "y": 1,
        "pair": "2"
      },
      {
        "x": 4,
        "y": 3,
        "pair": "2"
      }
    ],
    "gates": [
      {
        "x": 5,
        "y": 5,
        "openPhase": 0
      },
      {
        "x": 3,
        "y": 4,
        "openPhase": 1
      }
    ],
    "tip": "亮起的潮门可以直穿，暗下的潮门暂时阻挡。换相不限次数，总能继续找到出口。"
  },
  {
    "id": 30,
    "chapter": 4,
    "chapterTitle": "潮汐群岛",
    "difficulty": 4,
    "title": "三潮交汇",
    "subtitle": "看准潮门明暗，在两相之间穿行",
    "width": 6,
    "height": 6,
    "phase": 0,
    "parFlips": 1,
    "ships": [
      {
        "id": "A",
        "x": 1,
        "y": 2,
        "dir": 2
      },
      {
        "id": "B",
        "x": 2,
        "y": 3,
        "dir": 2
      },
      {
        "id": "C",
        "x": 1,
        "y": 1,
        "dir": 2
      },
      {
        "id": "D",
        "x": 0,
        "y": 3,
        "dir": 1
      },
      {
        "id": "E",
        "x": 2,
        "y": 5,
        "dir": 0
      },
      {
        "id": "F",
        "x": 4,
        "y": 1,
        "dir": 0
      },
      {
        "id": "G",
        "x": 4,
        "y": 3,
        "dir": 0
      },
      {
        "id": "H",
        "x": 4,
        "y": 2,
        "dir": 0
      }
    ],
    "mirrors": [
      {
        "x": 2,
        "y": 4,
        "slash": 1
      },
      {
        "x": 0,
        "y": 2,
        "slash": 1
      },
      {
        "x": 3,
        "y": 1,
        "slash": 0
      },
      {
        "x": 1,
        "y": 4,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 0,
        "y": 5,
        "slash": 0,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 3,
        "y": 2
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 1,
        "y": 0
      }
    ],
    "portals": [
      {
        "x": 5,
        "y": 3,
        "pair": "1"
      },
      {
        "x": 5,
        "y": 1,
        "pair": "1"
      },
      {
        "x": 0,
        "y": 4,
        "pair": "2"
      },
      {
        "x": 4,
        "y": 4,
        "pair": "2"
      }
    ],
    "gates": [
      {
        "x": 1,
        "y": 3,
        "openPhase": 0
      },
      {
        "x": 4,
        "y": 0,
        "openPhase": 1
      }
    ],
    "tip": "亮起的潮门可以直穿，暗下的潮门暂时阻挡。换相不限次数，总能继续找到出口。"
  },
  {
    "id": 31,
    "chapter": 4,
    "chapterTitle": "潮汐群岛",
    "difficulty": 5,
    "title": "群岛协奏",
    "subtitle": "看准潮门明暗，在两相之间穿行",
    "width": 6,
    "height": 6,
    "phase": 0,
    "parFlips": 1,
    "ships": [
      {
        "id": "A",
        "x": 4,
        "y": 2,
        "dir": 2
      },
      {
        "id": "B",
        "x": 3,
        "y": 2,
        "dir": 2
      },
      {
        "id": "C",
        "x": 4,
        "y": 1,
        "dir": 2
      },
      {
        "id": "D",
        "x": 2,
        "y": 0,
        "dir": 2
      },
      {
        "id": "E",
        "x": 2,
        "y": 4,
        "dir": 0
      },
      {
        "id": "F",
        "x": 2,
        "y": 5,
        "dir": 0
      },
      {
        "id": "G",
        "x": 5,
        "y": 1,
        "dir": 3
      },
      {
        "id": "H",
        "x": 5,
        "y": 2,
        "dir": 3
      },
      {
        "id": "I",
        "x": 2,
        "y": 2,
        "dir": 3
      }
    ],
    "mirrors": [
      {
        "x": 3,
        "y": 5,
        "slash": 1
      },
      {
        "x": 2,
        "y": 3,
        "slash": 0
      },
      {
        "x": 2,
        "y": 1,
        "slash": 1
      },
      {
        "x": 0,
        "y": 0,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 0,
        "y": 2,
        "slash": 0,
        "fixed": true
      },
      {
        "x": 5,
        "y": 3,
        "slash": 0,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 4,
        "y": 0
      },
      {
        "x": 3,
        "y": 0
      },
      {
        "x": 5,
        "y": 0
      }
    ],
    "portals": [
      {
        "x": 1,
        "y": 1,
        "pair": "1"
      },
      {
        "x": 5,
        "y": 4,
        "pair": "1"
      },
      {
        "x": 4,
        "y": 3,
        "pair": "2"
      },
      {
        "x": 3,
        "y": 1,
        "pair": "2"
      }
    ],
    "gates": [
      {
        "x": 4,
        "y": 5,
        "openPhase": 0
      },
      {
        "x": 0,
        "y": 4,
        "openPhase": 1
      },
      {
        "x": 3,
        "y": 3,
        "openPhase": 0
      }
    ],
    "tip": "亮起的潮门可以直穿，暗下的潮门暂时阻挡。换相不限次数，总能继续找到出口。"
  },
  {
    "id": 32,
    "chapter": 4,
    "chapterTitle": "潮汐群岛",
    "difficulty": 5,
    "title": "万岛归航",
    "subtitle": "看准潮门明暗，在两相之间穿行",
    "width": 6,
    "height": 6,
    "phase": 1,
    "parFlips": 4,
    "ships": [
      {
        "id": "A",
        "x": 5,
        "y": 1,
        "dir": 3
      },
      {
        "id": "B",
        "x": 5,
        "y": 0,
        "dir": 3
      },
      {
        "id": "C",
        "x": 2,
        "y": 1,
        "dir": 3
      },
      {
        "id": "D",
        "x": 3,
        "y": 4,
        "dir": 0
      },
      {
        "id": "E",
        "x": 2,
        "y": 4,
        "dir": 3
      },
      {
        "id": "F",
        "x": 3,
        "y": 5,
        "dir": 0
      },
      {
        "id": "G",
        "x": 4,
        "y": 4,
        "dir": 3
      },
      {
        "id": "H",
        "x": 2,
        "y": 2,
        "dir": 3
      },
      {
        "id": "I",
        "x": 1,
        "y": 3,
        "dir": 0
      },
      {
        "id": "J",
        "x": 1,
        "y": 1,
        "dir": 0
      }
    ],
    "mirrors": [
      {
        "x": 0,
        "y": 0,
        "slash": 1
      },
      {
        "x": 4,
        "y": 2,
        "slash": 0
      },
      {
        "x": 3,
        "y": 1,
        "slash": 0
      },
      {
        "x": 0,
        "y": 5,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 1,
        "y": 4,
        "slash": 1,
        "fixed": true
      },
      {
        "x": 3,
        "y": 0,
        "slash": 1,
        "fixed": true
      }
    ],
    "walls": [
      {
        "x": 4,
        "y": 3
      },
      {
        "x": 0,
        "y": 3
      },
      {
        "x": 2,
        "y": 0
      }
    ],
    "portals": [
      {
        "x": 1,
        "y": 0,
        "pair": "1"
      },
      {
        "x": 0,
        "y": 1,
        "pair": "1"
      },
      {
        "x": 3,
        "y": 2,
        "pair": "2"
      },
      {
        "x": 4,
        "y": 0,
        "pair": "2"
      }
    ],
    "gates": [
      {
        "x": 0,
        "y": 2,
        "openPhase": 0
      },
      {
        "x": 3,
        "y": 3,
        "openPhase": 1
      },
      {
        "x": 4,
        "y": 1,
        "openPhase": 0
      }
    ],
    "tip": "亮起的潮门可以直穿，暗下的潮门暂时阻挡。换相不限次数，总能继续找到出口。"
  }
];

  function createState(level) {
    return {
      levelId: level.id,
      remaining: level.ships.map(function (ship) { return ship.id; }),
      phase: level.phase || 0,
      flipsUsed: 0,
      moves: 0
    };
  }

  function trace(level, state, id) {
    const ship = level.ships.find(function (candidate) { return candidate.id === id; });
    if (!ship || !state.remaining.includes(id)) {
      return { ok: false, reason: 'missing', points: [], reflections: 0, fixedReflections: 0, portalJumps: 0, gatePasses: 0 };
    }
    const occupied = new Map();
    level.ships.forEach(function (other) {
      if (state.remaining.includes(other.id)) occupied.set(other.x + ',' + other.y, other.id);
    });
    const walls = new Set((level.walls || []).map(function (wall) { return wall.x + ',' + wall.y; }));
    const mirrors = new Map((level.mirrors || []).map(function (mirror) { return [mirror.x + ',' + mirror.y, mirror]; }));
    const gates = new Map((level.gates || []).map(function (gate) { return [gate.x + ',' + gate.y, gate]; }));
    const portals = new Map();
    const pairs = new Map();
    (level.portals || []).forEach(function (portal) {
      portals.set(portal.x + ',' + portal.y, portal);
      if (!pairs.has(portal.pair)) pairs.set(portal.pair, []);
      pairs.get(portal.pair).push(portal);
    });
    const points = [{ x: ship.x, y: ship.y }];
    const visited = new Set();
    let x = ship.x, y = ship.y, dir = ship.dir;
    let reflections = 0, fixedReflections = 0, portalJumps = 0, gatePasses = 0;
    function result(ok, reason, extra) {
      return Object.assign({ ok: ok, reason: reason, points: points, reflections: reflections,
        fixedReflections: fixedReflections, portalJumps: portalJumps, gatePasses: gatePasses }, extra || {});
    }
    while (true) {
      const directedCell = x + ',' + y + ',' + dir;
      if (visited.has(directedCell)) return result(false, 'loop');
      visited.add(directedCell);
      x += VECTORS[dir].x;
      y += VECTORS[dir].y;
      points.push({ x: x, y: y });
      if (x < 0 || x >= level.width || y < 0 || y >= level.height) {
        return result(true, 'clear', { exitDir: dir });
      }
      const key = x + ',' + y;
      if (occupied.has(key)) return result(false, 'ship', { blockerId: occupied.get(key) });
      if (walls.has(key)) return result(false, 'wall');
      const gate = gates.get(key);
      if (gate) {
        if (gate.openPhase !== state.phase) return result(false, 'gate');
        gatePasses += 1;
      }
      const mirror = mirrors.get(key);
      if (mirror) {
        dir = REFLECTIONS[mirror.slash ^ (mirror.fixed ? 0 : state.phase)][dir];
        reflections += 1;
        if (mirror.fixed) fixedReflections += 1;
      }
      const portal = portals.get(key);
      if (portal) {
        const pair = pairs.get(portal.pair);
        if (!pair || pair.length !== 2) return result(false, 'portal');
        const target = pair[0] === portal ? pair[1] : pair[0];
        if (target.x === x && target.y === y) return result(false, 'portal');
        x = target.x; y = target.y;
        points.push({ x: x, y: y, jump: true });
        portalJumps += 1;
        // A jump preserves heading and resumes one cell beyond the paired gate.
        // Never sample the imaginary line between endpoints or teleport back.
      }
    }
  }

  function dispatch(level, state, id) {
    const route = trace(level, state, id);
    if (!route.ok) return { ok: false, state: state, trace: route };
    return {
      ok: true,
      trace: route,
      state: Object.assign({}, state, {
        remaining: state.remaining.filter(function (remainingId) { return remainingId !== id; }),
        phase: state.phase ^ 1,
        moves: state.moves + 1
      })
    };
  }

  function flip(level, state) {
    if (!canFlip(level, state)) return { ok: false, state: state };
    return {
      ok: true,
      state: Object.assign({}, state, {
        phase: state.phase ^ 1,
        flipsUsed: state.flipsUsed + 1,
        moves: state.moves + 1
      })
    };
  }

  function canFlip(level, state) {
    return !isWon(state) && ((level.mirrors || []).some(function (mirror) { return !mirror.fixed; }) || (level.gates || []).length > 0);
  }

  function isWon(state) { return state.remaining.length === 0; }

  // A 0-1 breadth-first search: departures cost 0, manual phase changes cost 1.
  // It returns the fewest ADDITIONAL manual changes from the supplied state.
  // Manual changes are unlimited and reversible; history counters are not part
  // of a position. Visiting only (remaining ships, phase) bounds the search and
  // prevents the two free-to-use phases from creating an infinite search loop.
  // Removing a ship only removes an obstacle. Since either phase can always be
  // restored, every legal departure from a solvable board preserves solvability.
  function solve(level, state) {
    const order = new Map(level.ships.map(function (ship, index) { return [ship.id, index]; }));
    function keyOf(s) {
      return s.remaining.map(function (id) { return order.get(id); }).sort(function (a, b) { return a - b; }).join(',') + ':' + s.phase;
    }
    const startKey = keyOf(state);
    const distances = new Map([[startKey, 0]]);
    const parents = new Map();
    const queue = [{ state: state, key: startKey, distance: 0 }];
    let nodes = 0;
    while (queue.length) {
      const current = queue.shift();
      if (current.distance !== distances.get(current.key)) continue;
      nodes += 1;
      if (isWon(current.state)) {
        const actions = [];
        let cursor = current.key;
        while (parents.has(cursor)) {
          const entry = parents.get(cursor);
          actions.push(entry.action);
          cursor = entry.previous;
        }
        actions.reverse();
        return { actions: actions, flipsUsed: current.distance, nodes: nodes };
      }
      const candidates = [];
      current.state.remaining.forEach(function (id) {
        const result = dispatch(level, current.state, id);
        if (result.ok) candidates.push({ result: result, action: { type: 'dispatch', id: id }, cost: 0 });
      });
      const flipped = flip(level, current.state);
      if (flipped.ok) candidates.push({ result: flipped, action: { type: 'flip' }, cost: 1 });
      candidates.forEach(function (candidate) {
        const next = candidate.result.state;
        const nextKey = keyOf(next);
        const distance = current.distance + candidate.cost;
        if (distances.has(nextKey) && distances.get(nextKey) <= distance) return;
        distances.set(nextKey, distance);
        parents.set(nextKey, { previous: current.key, action: candidate.action });
        const item = { state: next, key: nextKey, distance: distance };
        if (candidate.cost === 0) queue.unshift(item);
        else queue.push(item);
      });
    }
    return null;
  }

  return { LEVELS: LEVELS, VECTORS: VECTORS, createState: createState, trace: trace, dispatch: dispatch, flip: flip, canFlip: canFlip, solve: solve, isWon: isWon };
});
