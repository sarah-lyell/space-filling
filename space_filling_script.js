
import { HilbertRules } from "./hilbert_rules.mjs";
import { MooreRules } from "./moore_rules.js";
import { GosperRules } from "./gosper_rules.js";
import { DragonRules } from "./dragon_rules.js";
import { TurtleGraphics } from "./turtle_graphics.js";

class CurveDrawer {
    
    constructor(order, cellSize) {
      //this.curveType = curve;  
      this.order = order; 
      this.cellSize = cellSize;

      this.canvas = document.getElementById('canvas');
      this.context = this.canvas.getContext('2d');
        
      // Use pow(2, order) for Moore and Hilbert and pow(2, order) for gosper
      this.gridSize = Math.pow(2, order);
      this.canvasSize = this.gridSize * cellSize;
      this.halfCell = this.cellSize / 2;
    }


    drawGrid() {
        const { context, canvasSize, cellSize } = this;
        context.strokeStyle = '#000'; // Set the color of the grid lines
        
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
    
      /*
    drawCurve() {
      // cases for which function to call based on the name of the curve
      // or type of the curve. 
      const curveType = this.curveType.toLowerCase();
      switch(curveType) {
        case 'hilbert':
        
        case 'moore':
        
        case 'dragon':
      }
    }

    drawLBasedCurve() {
      this.drawGrid();

      this.context.strokeStyle = '#f00'; // Set the color of the curve
      this.context.lineWidth = 3; // Set the line width
        
      
      
      const curveType = this.curveType.toLowerCase();
      switch(curveType) {
        case 'hilbert':
        
        case 'moore':
        
        case 'dragon':
      }
    } */
    
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
        this.drawGrid();
        this.context.strokeStyle = '#f00'; // Set the color of the curve
        this.context.lineWidth = 3; // Set the line width

        const gosper = new GosperRules(this.order);
        const gosperLString = gosper.generateLString();
        const gosperInstructions = gosper.generateStringForGraphics(gosperLString);

        // Start the turtle facing up in upper left of grid (approximate)
        const startX = this.halfCell;
        const startY = Math.ceil(.3 * this.canvasSize) - this.halfCell;
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
        this.drawGrid();
        this.context.strokeStyle = '#f00'; // Set the color of the curve
        this.context.lineWidth = 3; // Set the line width

        const dragon = new DragonRules(this.order);

        // There are no chars to skip, so instruction and L string are same
        const dragonInstructions = dragon.generateLString();

        // Start the turtle facing up towards the center (approximate)
        const startX = this.halfCell + (.25 * this.gridSize * this.cellSize);
        const startY = (.25 * this.gridSize * this.cellSize) + this.halfCell;
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

const curveDrawer = new CurveDrawer(5, 20);
curveDrawer.drawMooreCurve.bind(curveDrawer)();

