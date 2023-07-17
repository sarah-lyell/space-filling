/*
 * File to measure various properties of different curves at different 
 * levels, with a focus on Chebyshev distance
 *
 */
import { MortonOrder } from "./morton_rule.js";
import { HilbertRules } from "./hilbert_rules.mjs";
export class Measurements {

    constructor(curveType, order) {
        this.curveType = curveType;
        this.order = order;
        this.sideLength = (2 ** order);
        this.maxCoordVal = this.sideLength - 1;
        this.maxIndex = (this.sideLength ** 2) - 1;
    }

    /* 
     * The nearest neigbor stretch of a coordinate or grid point is how 
     * far away such grid points are when converted to the one dimensional
     * index. This function returns the average of the average nearest neighbor
     * stretch across all coordinates. 
     */
    get avgNearestNeighborStretch() {
        return this.calculateAverageNeighborStretch();
    }

    /*
     * Create and return a list of all (x,y) coordinates in use
     */
    generateCoordinates() {
        const coordinates = [];
        for (let i = 0; i <= this.maxCoordVal; i++) {
            for (let j = 0; j <= this.maxCoordVal; j++) {
                coordinates.push([i,j]);
            }
        }
        return coordinates;
    }

    /*
     * Given a coordinate pair, return a list of valid chebyshev neighbors
     * I'm sure this can be made more efficient, but this will do for now
     */
    findChebyshevNeighbors(coordPair) {
        const chebNeighbors = [];
        const x = coordPair[0];
        const y = coordPair[1];
        
        // Add valid neighobors 
        if (x > 0 && x < this.maxCoordVal && y > 0 && y < this.maxCoordVal) {
            // Non edge cells, all possible neighbors are valid 
            chebNeighbors.push([x - 1, y - 1]);
            chebNeighbors.push([x - 1, y]);
            chebNeighbors.push([x, y - 1]);
            chebNeighbors.push([x + 1, y - 1]);
            chebNeighbors.push([x + 1, y]);
            chebNeighbors.push([x - 1, y + 1]);
            chebNeighbors.push([x, y + 1]);
            chebNeighbors.push([x + 1, y + 1]);
        } else {
            // Check cases individually
            if (x > 0 && y > 0) {
                chebNeighbors.push([x - 1, y - 1]);
            }
            if (x > 0) {
                chebNeighbors.push([x - 1, y]);
            }
            if (y > 0) {
                chebNeighbors.push([x, y - 1]);
            }
            if (x < this.maxCoordVal && y  > 0) {
                chebNeighbors.push([x + 1, y - 1]);
            }
            if (x < this.maxCoordVal) {
                chebNeighbors.push([x + 1, y]);
            }
            if (x > 0 && y < this.maxCoordVal) {
                chebNeighbors.push([x - 1, y + 1]);
            }
            if (y < this.maxCoordVal) {
                chebNeighbors.push([x, y + 1]);
            }
            if (x < this.maxCoordVal && y < this.maxCoordVal){
                chebNeighbors.push([x + 1, y + 1]);
            }
        }
        
        return chebNeighbors;

    }

    /*
     * Return a map of every point and all of its neighbors
     */
    mapOfNeighbors() {
        const mapOfNeighbors = new Map();
        const coordinates = this.generateCoordinates();
        for (let coord of coordinates) {
            let neighbors = this.findChebyshevNeighbors(coord);
            mapOfNeighbors.set(coord, neighbors);
        }
        console.log(mapOfNeighbors);
        return mapOfNeighbors;
    }

    /*
     * Calculate the average nearest neighbor stretch for a coordinate given
     * a list of its neigbors
     */
    calculateNeighborStretch(coord, neighbors) {
        const distances = [];
        // Need to make this more general for other curves
        const morton = new MortonOrder(this.order);
        const coordX = coord[0];
        const coordY = coord[1];
        const coordIndex = morton.calcZOrder(coordX, coordY);
        for (let neighbor of neighbors) {
            const x = neighbor[0];
            const y = neighbor[1];
            const thisIndex = morton.calcZOrder(x, y);
            const distance = Math.abs(thisIndex - coordIndex);
            distances.push(distance);
        }
        const sum = distances.reduce((acc, val) => acc + val, 0);
        const average = sum / distances.length;
        return average;
    }

    /* Separate function because I used an idiosyncratic coordinate
     * labeling scheme to make computations easier */
    generateHilbertCoordinates() {
        const coordinates = [];
        const hilbert = new HilbertRules(this.order);
        for (let i = 0; i <= this.maxIndex; i++) {
            let coord = hilbert.convertIndexToCoordinate(i);
            coordinates.push(coord);
        }
        return coordinates;
    }

    findHilbertChebNeighbors(coord) {
        let x = coord[0];
        let y = coord[1];
        let chebNeighbors = [];
        
        // coordinates corresponding to edge of grid using hilbert scheme
        const minHilb = -(this.sideLength);
        const maxHilb = this.sideLength; 
        
        // Add valid neighobors 
        if (x > minHilb && x < maxHilb && y > minHilb && y < maxHilb) {
            // Non edge cells, all possible neighbors are valid 
            chebNeighbors.push([x - 2, y - 2]);
            chebNeighbors.push([x - 2, y]);
            chebNeighbors.push([x, y - 2]);
            chebNeighbors.push([x + 2, y - 2]);
            chebNeighbors.push([x + 2, y]);
            chebNeighbors.push([x - 2, y + 2]);
            chebNeighbors.push([x, y + 2]);
            chebNeighbors.push([x + 2, y + 2]);

        } else {
            // Check cases individually
            if (x > minHilb && y > minHilb) {
                chebNeighbors.push([x - 1, y - 1]);
            }
            if (x > minHilb) {
                chebNeighbors.push([x - 1, y]);
            }
            if (y > minHilb) {
                chebNeighbors.push([x, y - 1]);
            }
            if (x < maxHilb && y  > minHilb) {
                chebNeighbors.push([x + 1, y - 1]);
            }
            if (x < maxHilb) {
                chebNeighbors.push([x + 1, y]);
            }
            if (x > minHilb && y < maxHilb) {
                chebNeighbors.push([x - 1, y + 1]);
            }
            if (y < maxHilb) {
                chebNeighbors.push([x, y + 1]);
            }
            if (x < maxHilb && y < maxHilb){
                chebNeighbors.push([x + 1, y + 1]);
            }
        }
        
        return chebNeighbors;
    }

     /*
      * Return a map of every point and all of its neighbors in
      * Hilbert scheme
      */
     mapOfHilbertNeighbors() {
        const mapOfNeighbors = new Map();
        const coordinates = this.generateHilbertCoordinates();
        for (let coord of coordinates) {
            let neighbors = this.findHilbertChebNeighbors(coord);
            mapOfNeighbors.set(coord, neighbors);
        }
        console.log(mapOfNeighbors)
        return mapOfNeighbors;
    }
 
    /* 
     * Calculate the average nearest neighbor stretch for a coordinate
     * given a list of its neighbors in the hilbert coordinate scheme 
     */
    calculateHilbertNeighborStretch(coord, neighbors) {
        const distances = [];
        const hilbert = new HilbertRules(this.order);
        const coordIndex = hilbert.convertCoordToIndex(coord);
        
        for (let neighbor of neighbors) {
            const thisIndex = hilbert.convertCoordToIndex(neighbor);
            const distance = Math.abs(thisIndex - coordIndex);
            distances.push(distance);
        }
        console.log(distances);
        const sum = distances.reduce((acc, val) => acc + val, 0);
        console.log(sum);
        const average = sum / distances.length;
        console.log(average);
        return average;
    }


    /*
     * Calculate and return average nearest neighbor stretch
     */
    calculateAverageNeighborStretch() {
        const curveType = this.curveType;
        let mapOfNeighbors;
        switch (curveType) {
            case 'hilbert':
                mapOfNeighbors = this.mapOfHilbertNeighbors();
                console.log("Made it to hilbert");
                break;
            case 'morton':
                mapOfNeighbors = this.mapOfNeighbors();
                console.log("Made it to morton");
                break;
        }

        const averageStretches = [];
        
        // Get average nearest neighbor stretch for each individual point
        for (const key of mapOfNeighbors.keys()) {
            const avgStretch = 
              this.calculateNeighborStretch(key, mapOfNeighbors.get(key));
            averageStretches.push(avgStretch);      
        }

        const sum = averageStretches.reduce((acc, val) => acc + val, 0);
        const average = sum / averageStretches.length;
        return average;
    }


}

//const measure = new Mesaurements(8, 3);
//const coordinates = measure.generateCoordinates();
//console.log(coordinates);
//const avg = measure.avgNearestNeighborStretch;
//console.log(avg);
/*
const hilbert = new HilbertRules(3);
const index = hilbert.convertIndexToCoordinate(12);
console.log(index);
const coord = hilbert.convertCoordToIndex([3,-1]);
console.log(coord);
const diff = hilbert.convertIndexToCoordinate(15);
console.log(diff);
console.log(hilbert.convertCoordToIndex([3,-3]));
console.log(hilbert.convertIndexToCoordinate(4));
console.log(hilbert.convertCoordToIndex([-3,1]));
const measure = new Mesaurements('hilbert', 2)
const coordinates = measure.generateHilbertCoordinates();
console.log(coordinates);
const avg = measure.avgNearestNeighborStretch;
console.log(avg);
*/
