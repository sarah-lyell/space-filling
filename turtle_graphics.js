
export class TurtleGraphics {

    constructor(startX, startY, startAngle, cellSize, context) {
        this.cellSize = cellSize;
        this.x = startX;
        this.y = startY;
        this.angle = startAngle;
        this.context = context;
    }

    forward(distance) {
        const cellSize = this.cellSize;
        const context = this.context;

        const newX = this.x + (distance * cellSize) * Math.cos(this.angle * (Math.PI / 180));
        const newY = this.y + (distance * cellSize) * Math.sin(this.angle * (Math.PI / 180));
        context.strokeStyle = '#f00'; // Set the color of the curve
        context.lineWidth = 3; // Set the line width
      
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(newX, newY);
        context.stroke();
    
        this.x = newX;
        this.y = newY;
      }
    
      // Rotate turtle left
      left(angle) {
        this.angle = (this.angle - angle) % 360;
      }
    
      // Rotate turtle right
      right(angle) {
        this.angle = (this.angle + angle + 360) % 360;
      }

}