

export class MortonOrder {

    constructor(order) {
        this.order = order;
        this._curveType = 'coordinateBased';
        this.sideLength = Math.pow(2, order); // num of x and y coordinates
    }

    get curveType() {
        return this._curveType;
    }

    get coordinateSequence() {
        return this.listCoordinates();
    }

    calcZOrder(xPos, yPos) {
        // This function interleaves the lower 16 bits of xPos and yPos so that 
        // the bits of x are in the even positions and the bits from yPos are in 
        // the odd positions. Idea courtesy of Bit Twiddling hacks:
        // http://www-graphics.stanford.edu/~seander/bithacks.html#InterleaveBMN

        const MASKS = [0x55555555, 0x33333333, 0x0F0F0F0F, 0x00FF00FF];
        const SHIFTS = [1, 2, 4, 8];
    
        let x = xPos;
        let y = yPos;
    
        x = (x | (x << SHIFTS[3])) & MASKS[3];
        x = (x | (x << SHIFTS[2])) & MASKS[2];
        x = (x | (x << SHIFTS[1])) & MASKS[1];
        x = (x | (x << SHIFTS[0])) & MASKS[0];
    
        y = (y | (y << SHIFTS[3])) & MASKS[3];
        y = (y | (y << SHIFTS[2])) & MASKS[2];
        y = (y | (y << SHIFTS[1])) & MASKS[1];
        y = (y | (y << SHIFTS[0])) & MASKS[0];
    
        const result = x | (y << 1);
        return result;
    }

    calcCoordinates(zPos) {
        // Calculate the x and y coordinates for the value
        // Inspired by the above function
        // Valid for 32 bit morton number

        const MASKS = [0x33333333, 0x0F0F0F0F, 0x00FF00FF, 0x0000FFFF];
        const SHIFTS = [1, 2, 4, 8];
  
        let x = zPos & 0x55555555;
        let y = (zPos >> 1) & 0x55555555;

        x = (x | (x >> SHIFTS[0])) & MASKS[0];
        x = (x | (x >> SHIFTS[1])) & MASKS[1];
        x = (x | (x >> SHIFTS[2])) & MASKS[2];
        x = (x | (x >> SHIFTS[3])) & MASKS[3];

        y = (y | (y >> SHIFTS[0])) & MASKS[0];
        y = (y | (y >> SHIFTS[1])) & MASKS[1];
        y = (y | (y >> SHIFTS[2])) & MASKS[2];
        y = (y | (y >> SHIFTS[3])) & MASKS[3];
  
        return [x, y];
    }

    listCoordinates() {
        // This function generates the list in which the coordinates are 
        // traversed by the Z curve. sideLength is guaranteed to be a power
        // of two by the constructor. 
        const numPoints = Math.pow(this.sideLength, 2);
        const coordinates = [];

        // Find coordinates for every point
        for (let i = 0; i < numPoints; i++) {
            const pair = this.calcCoordinates(i);
            coordinates.push(pair);
        }

        return coordinates;
    }

}

