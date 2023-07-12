/*
 * File to measure various properties of different curves at different 
 * levels, with a focus on Chebyshev distance
 *
 */
import { MortonOrder } from "./morton_rule.js";
import { HilbertRules } from "./hilbert_rules.mjs";
class Mesaurements {

    constructor(sideLength, order) {
        this.order = order;
        this.maxCoordVal = sideLength - 1;
        //this.curve = curve;
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

    /*
     * Calculate and return average nearest neighbor stretch
     */
    calculateAverageNeighborStretch() {
        const mapOfNeighbors = this.mapOfNeighbors();
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
