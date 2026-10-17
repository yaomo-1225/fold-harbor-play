/* Native SVG artwork. All forms remain sharp without images or web fonts. */
(function () {
  'use strict';

  function drawShip(group, color, el) {
    const jade = /4f83bd|jade|7bd8bf|50bdab/i.test(color);
    const ivory = /f7e7b7|ivory|f4e6c5/i.test(color);
    const hull = ivory ? '#f0dfb6' : jade ? '#69cdb5' : '#f28e76';
    const edge = ivory ? '#bda472' : jade ? '#258d80' : '#c95e52';
    const light = ivory ? '#fff6d8' : jade ? '#b9f1d7' : '#ffc3a2';
    const dark = '#113647';

    // A low, soft shadow and an extruded lower hull give the toys real weight.
    el('ellipse', { cx: 0, cy: 6, rx: 24, ry: 28, fill: '#020f19', opacity: .32, class: 'ship-shadow' }, group);
    el('path', { d: 'M0-29C9-24 20-8 23 15L17 27H-17L-23 15C-20-8-9-24 0-29Z', transform: 'translate(0 4)', fill: edge, stroke: '#0a2936', 'stroke-width': 1.5 }, group);
    el('path', { d: 'M0-31C10-23 20-9 23 11L18 23H-18L-23 11C-20-9-10-23 0-31Z', fill: hull, stroke: light, 'stroke-width': 1.3, class: 'ship-body' }, group);
    el('path', { d: 'M0-27C8-20 15-8 18 6H-18C-15-8-8-20 0-27Z', fill: light, opacity: .72 }, group);
    // Pointed foredeck, dark windshield and raised cabin read at a 6×6 scale.
    el('path', { d: 'M0-25 7-17H3V-11H-3V-17H-7Z', fill: ivory ? '#314b4f' : '#fff5d8', stroke: ivory ? '#fff0c8' : edge, 'stroke-width': .6, opacity: .96, class: 'ship-arrow' }, group);
    el('path', { d: 'M-11-5Q0-12 11-5L13 3H-13Z', fill: dark, stroke: '#163e4a', 'stroke-width': 1, class: 'ship-window' }, group);
    el('path', { d: 'M-7-5 0-7 7-5', fill: 'none', stroke: '#aee5df', 'stroke-width': 1.7, 'stroke-linecap': 'round', opacity: .9 }, group);
    el('rect', { x: -11, y: 6, width: 22, height: 11, rx: 3, fill: light, stroke: edge, 'stroke-width': .8 }, group);
    el('path', { d: 'M-16 14V18M16 14V18M-7 22V25M7 22V25', stroke: '#fff7df', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: .7 }, group);
    el('path', { d: 'M-9 31V38M0 33V42M9 31V38', stroke: jade ? '#8ed9c4' : '#bddcd3', 'stroke-width': 2.3, 'stroke-linecap': 'round', opacity: .35, class: 'ship-wake' }, group);
  }

  function drawBoard(group, layout, el) {
    const { width, height, cols, rows, CELL, PAD } = layout;
    el('rect', { x: 7, y: 9, width: width - 14, height: height - 14, rx: 27, fill: '#061b26', stroke: '#31616a', 'stroke-width': 1.5, class: 'sea-bed' }, group);
    el('rect', { x: 13, y: 14, width: width - 26, height: height - 27, rx: 22, fill: '#103c47', stroke: '#183f4c', 'stroke-width': 1.2, class: 'sea-inset' }, group);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = PAD + (x + .5) * CELL, cy = PAD + (y + .5) * CELL;
        el('rect', { x: cx - CELL / 2 + 3, y: cy - CELL / 2 + 3, width: CELL - 6, height: CELL - 6, rx: 12, fill: (x + y) % 2 ? '#154751' : '#174b54', stroke: '#285b61', 'stroke-width': .9, class: 'water-tile' }, group);
        el('path', { d: `M${cx - 25} ${cy - 31}H${cx + 24}`, stroke: '#37717a', opacity: .42, 'stroke-width': .9, class: 'tile-highlight' }, group);
        el('circle', { cx, cy, r: 1.6, fill: '#699b9b', opacity: .48, class: 'grid-dot' }, group);
      }
    }
    // Brass navigation studs replace the old paper-board boundary marks.
    for (let x = 0; x < cols; x++) {
      const cx = PAD + (x + .5) * CELL;
      for (const cy of [9, height - 8]) el('rect', { x: cx - 5, y: cy - 1.5, width: 10, height: 3, rx: 1.5, fill: '#b4a371', opacity: .7, class: 'dock-marker' }, group);
    }
    for (let y = 0; y < rows; y++) {
      const cy = PAD + (y + .5) * CELL;
      for (const cx of [9, width - 9]) el('rect', { x: cx - 1.5, y: cy - 5, width: 3, height: 10, rx: 1.5, fill: '#b4a371', opacity: .7, class: 'dock-marker' }, group);
    }
    for (const [cx, cy] of [[12, 14], [width - 12, 14], [12, height - 13], [width - 12, height - 13]]) {
      el('circle', { cx, cy, r: 3, fill: '#c2ad77', stroke: '#0a2730', 'stroke-width': 1 }, group);
    }
  }

  function drawMirror(group, config, el) {
    const { fixed, orientation, previousOrientation, animate } = config;
    const rim = fixed ? '#c4a966' : '#70bdb1';
    el('rect', { x: -23, y: -20, width: 46, height: 46, rx: 11, transform: 'rotate(45)', fill: '#061e2b', opacity: .55 }, group);
    el('rect', { x: -22, y: -22, width: 44, height: 44, rx: 10, transform: 'rotate(45)', fill: fixed ? '#8b7849' : '#3a7d7c', stroke: '#0b2731', 'stroke-width': 2, class: 'mirror-gem' }, group);
    el('rect', { x: -18, y: -18, width: 36, height: 36, rx: 7, transform: 'rotate(45)', fill: fixed ? '#30424a' : '#204d5a', stroke: rim, 'stroke-width': 1.2 }, group);
    const direction = el('g', { transform: `rotate(${orientation * 90})` }, group);
    el('path', { d: 'M-16 16 16-16', stroke: '#071f2b', 'stroke-width': 10, 'stroke-linecap': 'round', transform: 'translate(0 2)' }, direction);
    el('path', { d: 'M-16 16 16-16', stroke: fixed ? '#e8ca82' : '#b2eadc', 'stroke-width': 7, 'stroke-linecap': 'round', class: 'mirror-line' }, direction);
    el('path', { d: 'M-13 13 13-13', stroke: '#f0f5db', 'stroke-width': 1.6, 'stroke-linecap': 'round', opacity: .9 }, direction);
    for (const [x, y] of [[-15, -15], [15, 15]]) el('circle', { cx: x, cy: y, r: 2, fill: rim }, group);
    if (fixed) el('path', { d: 'M-4 20V16a4 4 0 0 1 8 0v4M-5 20H5V27H-5Z', fill: '#d7b86f', stroke: '#17303a', 'stroke-width': 1.2 }, group);
    if (!fixed && animate) el('animateTransform', { attributeName: 'transform', type: 'rotate', from: (previousOrientation ?? orientation) * 90, to: orientation * 90, dur: '.22s', fill: 'freeze' }, direction);
  }

  function drawPortal(group, config, el) {
    const pair = String(config.pair), color = pair === '2' ? '#f0ac8d' : '#b5a8de';
    el('ellipse', { cy: 5, rx: 27, ry: 26, fill: '#071c2b', opacity: .8 }, group);
    el('circle', { r: 26, fill: '#263952', stroke: '#0b202d', 'stroke-width': 3 }, group);
    el('circle', { r: 22, fill: '#152d40', stroke: color, 'stroke-width': 2, class: 'portal-rim' }, group);
    el('circle', { r: 16, fill: '#213b50', stroke: color, 'stroke-width': 1.2, 'stroke-dasharray': '3 6', opacity: .75 }, group);
    for (const a of [0, 90, 180, 270]) el('path', { d: 'M-3-29H3L2-23H-2Z', fill: color, transform: `rotate(${a})` }, group);
    el('text', { y: 6.5, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: color }, group, pair);
  }

  function drawGate(group, config, el) {
    const { open, phase } = config, color = phase ? '#e8a18a' : '#83c4c0';
    el('rect', { x: -26, y: -23, width: 52, height: 51, rx: 10, fill: '#061d2b', opacity: .55 }, group);
    el('rect', { x: -25, y: -25, width: 50, height: 50, rx: 9, fill: open ? '#194a51' : '#2b3c45', stroke: color, 'stroke-width': 2 }, group);
    for (const x of [-23, 23]) {
      el('rect', { x: x - 3.5, y: -23, width: 7, height: 46, rx: 2, fill: color }, group);
      for (const y of [-15, 15]) el('circle', { cx: x, cy: y, r: 1.4, fill: '#14323a' }, group);
    }
    if (open) {
      el('path', { d: 'M-11-15-5-20 1-15M-11 17-5 22 1 17', fill: 'none', stroke: color, 'stroke-width': 2, 'stroke-linecap': 'round', opacity: .6 }, group);
    } else {
      for (const y of [-15, 15]) el('path', { d: `M-19 ${y}H19`, stroke: color, 'stroke-width': 6 }, group);
      el('path', { d: 'M-15-13 15 13M-15 13 15-13', stroke: color, 'stroke-width': 1, opacity: .3 }, group);
    }
    el('text', { y: 6, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: color }, group, phase ? 'B' : 'A');
  }

  function drawWall(group, el) {
    el('ellipse', { cy: 17, rx: 29, ry: 10, fill: '#092a38', opacity: .7 }, group);
    el('path', { d: 'M-25 12-19-12-4-24 15-17 26 3 19 23-10 25Z', fill: '#30434b', stroke: '#112e3a', 'stroke-width': 2 }, group);
    el('path', { d: 'M-19-12-4-24 6-6-3 8-25 12Z', fill: '#75828a' }, group);
    el('path', { d: 'M-4-24 15-17 26 3 6-6Z', fill: '#526571' }, group);
    el('path', { d: 'M6-6 26 3 19 23-3 8Z', fill: '#405460' }, group);
    el('path', { d: 'M-25 12-3 8-10 25Z', fill: '#586b72' }, group);
    el('path', { d: 'M-17-11-7-19M-18 10-9 8', stroke: '#a3a996', 'stroke-width': 1.3, 'stroke-linecap': 'round', opacity: .5 }, group);
    el('path', { d: 'M13-12q-6-5-11 1l4 5 9-2M-18 17q5-7 10-2l-3 8-8-2', fill: '#698772' }, group);
    el('path', { d: 'M15-14 17-25M17-19 23-24M17-21 12-26', stroke: '#a8b77d', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, group);
  }

  window.HarborVisuals = Object.freeze({ drawShip, drawBoard, drawMirror, drawPortal, drawGate, drawWall });
})();
