import { GeneralInstructionString } from './general_string.mjs';

export class MooreRules extends GeneralInstructionString {
    constructor(order) {
        const axiom = 'LFL+F+LFL';
        const replacementRules = {
            'L': '-RF+LFL+FR-',
            'R': '+LF-RFR-FL+',
            'F': 'F',
            '+': '+',
            '-': '-'
        };
        const charsToSkip = 'LR'
        super(order, axiom, replacementRules, charsToSkip);

        // The axiom in this case provides the first order, so we adjust
        // order. This ensures that (e.g) a first order curve passes through
        // four grid elements
        this.order = order - 1;

        this._curveType = 'L-based';
    }

    get curveType() {
        return this._curveType;
    }

     /*  
     * This method converts a coordinate pair to its associated index
     * in a Morton ordering. Assumes that coord is a valid coordinate 
     * for this Morton ordering. 
     */
     convertCoordinateToIndex(coord) {
        // store coord since it is modified by recursive function
        let [x, y] = [...coord];

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

        const order = this.order + 1;
        let shift = (2 * (order - 1));
        let tempX = x;
        let tempY = y;
        switch(quadrant) {
            case 0:
                // Shift to center
                tempX += shift;
                tempY += shift;
                // rotate 90deg counterClockwise
                coord[0] = -tempY;
                coord[1] = tempX;
                break;
            case 1:
                // Shift to center
                tempX += shift;
                tempY -= shift;
                // rotate 90deg Counter Clockwise
                coord[0] = -tempY;
                coord[1] = tempX;
                break;
            case 2: 
                // Shift to center
                tempX -= shift;
                tempY -= shift;
                // rotate 90deg clockwise
                coord[0] = tempY;
                coord[1] = -tempX;
                break;
            case 3:
                // Shift to center
                tempX -= shift;
                tempY += shift;
                coord[0] = tempY;
                coord[1] = -tempX;
                break;
        }

        const prevHilbertIndex = this.convertCoordToIndexRecursive(coord, order - 1);
        //console.log(prevHilbertIndex);
        let index = prevHilbertIndex;
        
        // Add number of points indexed prior to current quadrant to index
        switch(quadrant) {
            case 0: // Nothing added
                break;
            case 1: 
                index += Math.pow(4, (order - 1));
                break;
            case 2: 
                index += (2 * Math.pow(4, (order - 1)));
                break;
            case 3:
                index += (3 * Math.pow(4, (order - 1)));
                break;
        }

        //restore coord before returning
        coord[0] = x;
        coord[1] = y;

        return index;
    }


    /* This finds the index in a Hilbert ordering, which we then adjust to 
     * find the right index for a Moore ordering */
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
        const order = this.order + 1;
        
        // keep first two bits of index
        let shift = (2 * (order - 1));
        let currentQuadrant = (index & (0x3 << shift)) >> shift;
        const thirtyTwoOnes = (2 ** 32) - 1;
        let mask = thirtyTwoOnes >>> (32 - shift);
        const prevHilbertCoord = this.convertHelper(index & mask, order - 1);
        let coord = prevHilbertCoord;
        let x = prevHilbertCoord[0];
        let y = prevHilbertCoord[1];
        switch(currentQuadrant) {
            case 0:
                // Rotate 90deg counter clockwise (-y,x)
                coord[0] = -y;
                coord[1] = x;
                // Shift
                coord[0] -= shift;
                coord[1] -= shift;
                break;
            case 1:
                // Rotate 90deg counter clockwise (-y,x)
                coord[0] = -y;
                coord[1] = x;
                // Shift
                coord[0] -= shift;
                coord[1] += shift;
                break;
            case 2:
                // Rotate 90deg clockwise (y, -x)
                coord[0] = y;
                coord[1] = -x;
                // Shift
                coord[0] += shift;
                coord[1] += shift;
                break;
            case 3:
                // Rotate 90deg clockwise (y, -x)
                coord[0] = y;
                coord[1] = -x;
                // Shift
                coord[0] += shift;
                coord[1] -= shift;
                break;
        }
        return coord;
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