import Zdog, { TAU } from 'zdog';

let isSpinning = true;

let illo = new Zdog.Illustration({
  element: '.zdog-canvas',
  dragRotate: true,
  resize: true,
  rotate: { y: -TAU/20},
    // stop rotation when dragging starts
  onDragStart: function() {
    isSpinning = false;
    },
});

let anchor = new Zdog.Anchor({
  addTo: illo,
  // options
});

//front side of book
let book = new Zdog.RoundedRect({
  addTo: anchor,
  width: 50,
  height: 80,
  stroke: 12,
  color: '#FB7E19',
  fill: true,
});

//pages of book
new Zdog.RoundedRect({
  addTo: anchor,
  width: 50,
  height: 80,
  stroke: 12,
  color: 'white',
  fill: true,
  translate: { x: 2, y: -1, z: -3 },
  backface: false,
});

//hole anchor
let anchorHoles = new Zdog.Anchor({
  addTo: book,
  translate: { x: -22, y: -35 }, //move left 22px, up 35px
});

//holes on book
let hole = new Zdog.Shape({
  addTo: anchorHoles,
  // no path set, default to single point
  stroke: 4,
  color: 'white',
  backface: false,
});

//binding rings
let ring = new Zdog.Ellipse({
  addTo: anchorHoles,
  diameter: 11,
  quarters: 2,
  stroke: 5,
  color: 'black',
  translate: { x: -4 },
  rotate: { x: TAU/4, y: TAU/2 },
});

//next series of holes and rings
for (let i = 10; i <= 70; i+= 10) {
  hole.copy({
    translate: { y: i },
  }); 
  ring.copy({
    translate: { x: -4, y: i },
  });
}

//design on book

let face = new Zdog.Group({
  addTo: book,
});

let eye = new Zdog.RoundedRect({
  addTo: face,
  translate: { x: -8, y: -20, z: 5 },
  backface: false,
  stroke: 3,
  color: 'white',
  cornerRadius: 10,
  width: 12,
  height: 14,
  fill: true,
});


let pupil = new Zdog.Hemisphere({
  addTo: eye,
  diameter: 8,
  stroke: false,
  color: 'black',
  backface: false,
  translate: { z: 1 },
});

let otherEye= eye.copy({
  translate: { x: 12, y: -20, z: 5},
});

pupil.copy({
  addTo: otherEye,
});


let smiley = new Zdog.Ellipse({
  addTo: book,
  diameter: 20,
  quarters: 2,
  translate: { x: 2, y: 2.5, z: 4.5 },
  rotate: { z: TAU/4 },
  closed: true,
  color: 'white',
  stroke: 8,
  fill: true,
  backface: false,
});

//tongue
smiley.copy({
  addTo: smiley,
  diameter: 10,
  color: 'pink',
  translate: { x: 4, y: 0, z: 2 },
  rotate: { z: TAU },
});
  
  // -- animate --- //
  
  function animate() {
    if (isSpinning) illo.rotate.y -= 0.02;
    illo.updateRenderGraph();
    // animate next frame
    requestAnimationFrame( animate );
  }
  
  export { animate };