// this will extend general_string
import { GeneralInstructionString } from './general_string.mjs';

export class HilbertRules extends GeneralInstructionString{

    constructor(order) {
        const axiom = 'L';
        const replacementRules = {
            'L': '+RF-LFL-FR+',
            'R': '-LF+RFR+FL-',
            'F': 'F',
            '+': '+',
            '-': '-'
        };
        const charsToSkip = 'LR'
        super(order, axiom, replacementRules, charsToSkip);
        this.order = order;
        this._curveType = 'L-based';
    }

    get curveType() {
        return this._curveType;
    }

    /*  **this is not working as expected**
     * This method converts a coordinate pair to its associated index
     * in a Hilbert ordering. Assumes that coord is a valid coordinate 
     * for this Hilbert ordering. 
     */
    convertCoordToIndex(coord) {
        // store coord since it is modified by recursive function
        let [x, y] = [...coord];

        const order = this.order;
        const index = this.convertCoordToIndexRecursive(coord, order);
        
        //restore coord before returning
        coord[0] = x;
        coord[1] = y;

        return index;
    }

    convertCoordToIndexRecursive(coord, order) {
        let x = coord[0];
        let y = coord[1];
        let shift = (2 * (order - 1));

        // Find the quadrant, prob a better/faster way to do this
        let quadrant;
        if (x < 0 && y < 0) {
            quadrant = 0; // bottom left quadrant
        } else if (x < 0 && y > 0) {
            quadrant = 1; // top left quadrant
        } else if (x > 0 && y > 0) {
            quadrant = 2; // top right quadrant
        } else if (x > 0 && y < 0) {
            quadrant = 3;
        }
        //console.log(quadrant);
        if (order == 1) {
            return quadrant;
        } else {
            let prevIndex;
            switch (quadrant) {
                case 0: // Lower left quadrant
                    x += shift;
                    y += shift;
                    y = -y; // reflect over y axis
                    coord[0] = -y;
                    coord[1] = x; 
                    prevIndex = this.convertCoordToIndexRecursive(coord, order - 1);
                    //console.log(coord);
                    //console.log(prevIndex);
                    return prevIndex;
                case 1: // Upper left quadrant
                    x += shift;
                    y -= shift;
                    coord[0] = x; // no rotation
                    coord[1] = y;
                    prevIndex = this.convertCoordToIndexRecursive(coord, order - 1);
                    //console.log(coord);
                    //console.log(prevIndex);
                    return prevIndex + Math.pow(4, (order - 1));
                case 2: // Upper right quadrant
                    x -= shift;
                    y -= shift;
                    coord[0] = x;
                    coord[1] = y;
                    //console.log(coord);
                    prevIndex = this.convertCoordToIndexRecursive(coord, order - 1);
                    //console.log(prevIndex);
                    return prevIndex + (2 * Math.pow(4, (order - 1)));
                case 3: // Lower right quadrant
                    x -= shift;
                    y += shift;
                    //console.log(x, y);
                    y = -y; // reflect over x axis
                    coord[0] = y; // 90deg clockwise rotation
                    coord[1] = -x;
                    prevIndex = this.convertCoordToIndexRecursive(coord, order - 1);
                    //console.log(coord);
                    //console.log(prevIndex);
                    return prevIndex + (3 * Math.pow(4, (order - 1)));
            }
            
        }
    }


    /* 
     * This method converts an index (assuming such an index is valid) to 
     * it's associated coordinate pair without using recursion. [0,0] 
     * represents the bottom left corner in a grid, where x is the horizontal
     * axis and y is the vertical axis. The function assumes that the order and 
     * index are valid.
     */
    convertIndexToCoordinate(index) {
        const order = this.order;
        return this.convertHelper(index, order);

    }

    /* Use recursion to calcualate coordinates */
    convertHelper(index, order) {
        const positions = [
            // In a first order curve, zero index correspond to [0,0], etc.
                [-1,-1], // zero
                [-1,1], // one
                [1,1], // two
                [1,-1] // three
        ];
    
        if (order == 1) {
            //console.log(positions[index]);
            return positions[index];
        } else {
            // keep first two bits of index
            let shift = (2 * (order - 1));
            let quad = (index & (0x3 << shift));
            //console.log(quad.toString(2));
            let currentQuadrant = (index & (0x3 << shift)) >> shift;
            const thirtyTwoOnes = (2 ** 32) - 1;
            let mask = thirtyTwoOnes >>> (32 - shift);
            //console.log(mask.toString(2));
            //console.log(index.toString(2));
            //console.log((index & mask).toString(2));
            let prevCoord = this.convertHelper(index & mask, order - 1);
            let x = prevCoord[0];
            let y = prevCoord[1];
            //console.log(prevCoord);
            //console.log(currentQuadrant);
            switch (currentQuadrant) {
                case 0: // Lower left quadrant
                    // reflext over y axis and rotate 90deg clockwise
                    x = -x;
                    let tmp = x;
                    x = y;
                    y = -tmp;
                    //console.log([x - shift, y - shift]);
                    return [x - shift, y - shift];
                case 1: // Upper left quadrant
                    // just translate
                    //console.log([x - shift, y + shift]);
                    return [x - shift, y + shift];
                case 2: // Upper right quadrant
                    //just translate
                    //console.log([x + shift, y + shift]);
                    return [x + shift, y + shift];
                case 3: // Lower right quadrant
                    x = -x; // reflect
                    // Rotate 90deg counter clockwise
                    let temp = x;
                    x = -y;
                    y = temp;
                    // Translate and return
                    //console.log([x + shift, y - shift]);
                    return [x + shift, y - shift];
            }
        }
    }



}

