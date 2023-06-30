

export class MortonRules {

    constructor(order) {
        this.order = order;
        this._curveType = 'coordinateBased';
    }

    get curveType() {
        return this._curveType;
    }

    get coordinateSequence() {
        
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

}