
import { HilbertRules } from "./hilbert_rules.mjs";
import { MooreRules } from "./moore_rules.js";
import { GosperRules } from "./gosper_rules.js";
import { DragonRules } from "./dragon_rules.js";
import { MortonOrder } from "./morton_rule.js";
import { TurtleGraphics } from "./turtle_graphics.js";

document.addEventListener('DOMContentLoaded', function() {
  const drawButton = document.getElementById('drawButton');
  drawButton.addEventListener('click', drawCurve);
});

function drawCurve() {
  const curveType = document.getElementById('curveType');
  const curveSelected = curveType.value;
  const inputOrder = document.getElementById('order');
  const order = parseInt(inputOrder.value, 10);

  const curveDrawer = new CurveDrawer(curveSelected, order);
  curveDrawer.drawCurve.bind(curveDrawer)();
}

export class CurveDrawer {
    
    constructor(curve, order) {
      this.curveType = curve;  
      this.order = order; 
      this.cellSize = 30;

      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
        
      // Think is same for
      this.gridSize = Math.pow(2, order);
      this.canvasSize = this.gridSize * this.cellSize;
      this.halfCell = this.cellSize / 2;
    }


    drawGrid() {
        const { context, canvasSize, cellSize } = this;
        context.strokeStyle = '#5c5c5c'; // Set the color of the grid lines
        context.lineWidth = 2;
        
        // Draw vertical lines
        for (let x = 0; x <= canvasSize; x += cellSize) {
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, canvasSize);
          context.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= canvasSize; y += cellSize) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(canvasSize, y);
          context.stroke();
        }
      }
    
    
    drawCurve() {
      // First, clear the canvas
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);

      // cases for which function to call based on the name of the curve
      // or type of the curve. 
      const curveType = this.curveType.toLowerCase();
      switch(curveType) {
        case 'hilbert':
          this.drawHilbertCurve();
          break;
        case 'morton':
          this.drawMortonCurve();
          break;
        case 'moore':
          this.drawMooreCurve();
          break;
        case 'gosper':
          this.drawGosperCurve();
          break;
        case 'dragon':
          this.drawDragonCurve();
          break;

      }
    }
    
    drawHilbertCurve() {
        this.drawGrid();

        this.context.strokeStyle = '#f00'; // Set the color of the curve
        this.context.lineWidth = 3; // Set the line width
        
        const hilbert = new HilbertRules(this.order);
        const hilbertLString = hilbert.generateLString();
        const instructions = hilbert.generateStringForGraphics(hilbertLString);
        //const numMoves = Math.pow(4,order) - 1;

        // Start the turtle facing up in the bottom right corner cell
        const startX = this.canvasSize - this.halfCell;
        const startY = this.canvasSize - this.halfCell;
        const startAngle = 270;
        const turtle = new TurtleGraphics(startX, startY, startAngle, this.cellSize, this.context);
        
        for (const instruction of instructions) {
          if (instruction == '+') {
            turtle.left(90);
          } else if (instruction == '-') {
            turtle.right(90);
          } else if (instruction == 'F') {
            turtle.forward(1);
          }
        }
    }

    drawMortonCurve() {
      const morton = new MortonOrder(this.order);
      const coordinates = morton.coordinateSequence;
      
      this.drawGrid();

      const context = this.context;
      context.strokeStyle = '#f00'; // Set the color of the curve
      context.lineWidth = 2; // Set the line width
      context.beginPath();
      context.moveTo(this.halfCell, this.halfCell); // Start in upper left cell
      
      // Draw path through grid in specified order, through cell centers
      for (const coordPair of coordinates) {
        const x = (coordPair[0] * this.cellSize) + this.halfCell;
        const y = (coordPair[1] * this.cellSize) + this.halfCell;
        context.lineTo(x, y);
        context.stroke();
      }

    }

    drawMooreCurve() {
        this.drawGrid();
        this.context.strokeStyle = '#f00'; // Set the color of the curve
        this.context.lineWidth = 3; // Set the line width
        
        const moore = new MooreRules(this.order);
        const mooreLString = moore.generateLString();
        const mooreInstructions = moore.generateStringForGraphics(mooreLString);

        // Start the turtle facing up at the bottom of the grid in the right cell
        // of the two center cells
        const startX = (.5 * this.canvasSize) + this.halfCell;
        const startY = this.canvasSize - this.halfCell;
        const startAngle = 270;

        const turtle = new TurtleGraphics(startX, startY, startAngle, this.cellSize, this.context);
        
        for (const instruction of mooreInstructions) {
          if (instruction == '+') {
            turtle.left(90);
          } else if (instruction == '-') {
            turtle.right(90);
          } else if (instruction == 'F') {
            turtle.forward(1);
          }
        }
    }

    drawGosperCurve() {
        //this.drawGrid();
        this.context.strokeStyle = '#f00'; // Set the color of the curve
        this.context.lineWidth = 3; // Set the line width

        const gosper = new GosperRules(this.order);
        const gosperLString = gosper.generateLString();
        const gosperInstructions = gosper.generateStringForGraphics(gosperLString);

        // Start the turtle facing up in upper left of grid (approximate)
        const startX = this.halfCell;
        const startY = 800;
        const startAngle = 270;

        const turtle = new TurtleGraphics(startX, startY, startAngle, this.cellSize, this.context);

        for (const instruction of gosperInstructions) {
            if (instruction == 'A' || instruction == 'B') {
                turtle.forward(1)
            } else if (instruction == '+') {
                turtle.left(60);
            } else if (instruction == '-') {
                turtle.right(60);
            }
        }
    }

    drawDragonCurve() {
        //this.drawGrid();
        this.context.strokeStyle = '#f00'; // Set the color of the curve
        this.context.lineWidth = 3; // Set the line width

        const dragon = new DragonRules(this.order);

        // There are no chars to skip, so instruction and L string are same
        const dragonInstructions = dragon.generateLString();

        // Start the turtle facing up towards the center (approximate)
        const startX = 800; //this.halfCell + (.25 * this.gridSize * this.cellSize);
        const startY = 800; //(.25 * this.gridSize * this.cellSize) + this.halfCell;
        const startAngle = 270;

        const turtle = new TurtleGraphics(startX, startY, startAngle, this.cellSize, this.context);

        for (const instruction of dragonInstructions) {
            if (instruction == 'F' || instruction == 'G') {
                turtle.forward(1);
            } else if (instruction == '+') {
                turtle.left(90);
            } else if (instruction == '-') {
                turtle.right(90);
            }
        } 

    }

}

