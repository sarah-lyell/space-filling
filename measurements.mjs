/*
 * File to measure various properties of different curves at different 
 * levels, with a focus on Chebyshev distance
 *
 */
import { MortonOrder } from "./morton_rule.js";
import { HilbertRules } from "./hilbert_rules.mjs";
import { MooreRules } from "./moore_rules.js";
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
        const curveType = this.curveType;
        switch(curveType) {
            case 'hilbert':
                return this.calcAvgHilbertNeighborStretch();
            case 'morton':
                return this.calculateAverageNeighborStretch();
            case 'moore':
                return this.calcAvgMooreNeighborStretch();
        }
    }

    /* 
     * Similar to the previous funtion, this returns the median of the median
     * nearest neighbor stretches for each grid point.
     */
    get medNearestNeighborStretch() {
        const curveType = this.curveType;
        switch(curveType) {
            case 'hilbert':
                return this.calculateMedianHilbertNeighborStretch();
            case 'morton':
                return this.calculateMedianNeighborStretch();
            case 'moore':
                return this.calculateMedianMooreNeighborStretch();
        }
    }

    /*
     * Calculate and return median of an array of numbers
     */
    calculateMedian(distances) {
        distances.sort((a, b) => (a - b));
        const length = distances.length;
        let median = NaN;
        if (length % 2 == 0) {
            const numOne = distances[(length / 2) - 1];
            const numTwo = distances[length / 2];
            median = ((numOne + numTwo) / 2);
        } else {
            const medianPosition = Math.floor(length / 2);
            median = distances[medianPosition];
        }
        return median;
    }

    /* 
     * Calculate and return the average of an array of numbers
     */
    calculateAverage(distances) {
        const sum = distances.reduce((acc, val) => acc + val, 0);
        const average = sum / distances.length;
        return average;
    }

    // Section for default calculations (currently Morton)

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
        //console.log(mapOfNeighbors);
        return mapOfNeighbors;
    }

    /*
     * Generate and return an array of stretches for a coordinate and its
     * neighbors
     */
    calculateNeighborDistances(coord, neighbors) {
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
        return distances;
    }

    /*
     * Calculate and return average nearest neighbor stretch for default
     * types of curves
     */
    calculateAverageNeighborStretch() {
        let mapOfNeighbors = this.mapOfNeighbors();
        const averageStretches = [];
        
        // Get average nearest neighbor stretch for each individual point
        for (const key of mapOfNeighbors.keys()) {
            const distances = 
              this.calculateNeighborDistances(key, mapOfNeighbors.get(key));
            const avgStretch = this.calculateAverage(distances);
            averageStretches.push(avgStretch);      
        }

        const average = this.calculateAverage(averageStretches);
        return average;
    }

    /*
     * Calculate and return median nearest neighbor stretch for default
     * types of curves. Calculates the median nearest neightbor stretch of 
     * each grid point and returns the median of these medians. 
     */
    calculateMedianNeighborStretch() {
        let mapOfNeighbors = this.mapOfNeighbors();
        const medianStretches = [];
            
        // Get median nearest neighbor stretch for each individual point
        for (const key of mapOfNeighbors.keys()) {
            const distances = 
                this.calculateNeighborDistances(key, mapOfNeighbors.get(key));
            const medStretch = this.calculateMedian(distances);
            medianStretches.push(medStretch);      
        }
        const medianStretch = this.calculateMedian(medianStretches);
        return medianStretch;
    }


    // The following functions correspond to Hilbert Calculations

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
        const hilbChebNeighbors = [];
        
        // coordinates corresponding to edge of grid using hilbert scheme
        const minHilb = -(this.sideLength - 1);
        const maxHilb = this.sideLength - 1; 
        
        // Add valid neighobors 
        if (x > minHilb && x < maxHilb && y > minHilb && y < maxHilb) {
            // Non edge cells, all possible neighbors are valid 
            hilbChebNeighbors.push([x - 2, y - 2]);
            hilbChebNeighbors.push([x - 2, y]);
            hilbChebNeighbors.push([x, y - 2]);
            hilbChebNeighbors.push([x + 2, y - 2]);
            hilbChebNeighbors.push([x + 2, y]);
            hilbChebNeighbors.push([x - 2, y + 2]);
            hilbChebNeighbors.push([x, y + 2]);
            hilbChebNeighbors.push([x + 2, y + 2]);

        } else {
            // Check cases individually
            if (x > minHilb && y > minHilb) {
                hilbChebNeighbors.push([x - 2, y - 2]);
            }
            if (x > minHilb) {
                hilbChebNeighbors.push([x - 2, y]);
            }
            if (y > minHilb) {
                hilbChebNeighbors.push([x, y - 2]);
            }
            if (x < maxHilb && y  > minHilb) {
                hilbChebNeighbors.push([x + 2, y - 2]);
            }
            if (x < maxHilb) {
                hilbChebNeighbors.push([x + 2, y]);
            }
            if (x > minHilb && y < maxHilb) {
                hilbChebNeighbors.push([x - 2, y + 2]);
            }
            if (y < maxHilb) {
                hilbChebNeighbors.push([x, y + 2]);
            }
            if (x < maxHilb && y < maxHilb){
                hilbChebNeighbors.push([x + 2, y + 2]);
            }
        }
        //console.log(hilbChebNeighbors);
        return hilbChebNeighbors;
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
        return mapOfNeighbors;
    }
 
    /* 
     * Calculate the distances between a coordinate and its Chebyshev neighbors
     * from the Hilbert ordering scheme when converted to index ordering. 
     * Return the array of "stretches"
     */
    calculateHilbertNeighborStretches(coord, neighbors) {
        const stretches = [];
        const hilbert = new HilbertRules(this.order);
        const coordIndex = hilbert.convertCoordToIndex(coord);
        for (let neighbor of neighbors) {
            const thisIndex = hilbert.convertCoordToIndex(neighbor);
            const distance = Math.abs(thisIndex - coordIndex);
            stretches.push(distance);
        }
        return stretches;
    }

    calcAvgHilbertNeighborStretch() {
        let mapOfNeighbors = this.mapOfHilbertNeighbors();
        const averageStretches = [];
        
        // Get average nearest neighbor stretch for each individual point
        for (const key of mapOfNeighbors.keys()) {
            const stretches = 
              this.calculateHilbertNeighborStretches(key, mapOfNeighbors.get(key));
            const avgStretch = this.calculateAverage(stretches);
            averageStretches.push(avgStretch);      
        }
        const average = this.calculateAverage(averageStretches);
        return average;
    }

    calculateMooreNeighborStretches(coord, neighbors) {
        const order = this.order;
        const stretches = [];
        const moore = new MooreRules(order);
        const coordIndex = moore.convertCoordinateToIndex(coord);
        for (let neighbor of neighbors) {
            const thisIndex = moore.convertCoordinateToIndex(neighbor);
            const distance = Math.abs(thisIndex - coordIndex);
            stretches.push(distance);
        }
        return stretches;
    }

    calcAvgMooreNeighborStretch() {
        // Hilbert and Moore use same ordering scheme, and the grid neighbors
        // do not change
        let mapOfNeighbors = this.mapOfHilbertNeighbors();
        const averageStretches = [];

        // Get average nearest neighbor stretch for each individual point
        for (const key of mapOfNeighbors.keys()) {
            const stretches = 
              this.calculateMooreNeighborStretches(key, mapOfNeighbors.get(key));
            const avgStretch = this.calculateAverage(stretches);
            averageStretches.push(avgStretch);      
        }
        const average = this.calculateAverage(averageStretches);
        return average;

    }

    calculateMedianMooreNeighborStretch() {
        let mapOfNeighbors = this.mapOfHilbertNeighbors();
        const medianStretches = [];
            
        // Get median nearest neighbor stretch for each individual point
        for (const key of mapOfNeighbors.keys()) {
            const stretches = 
                this.calculateMooreNeighborStretches(key, mapOfNeighbors.get(key));
            const medStretch = this.calculateMedian(stretches);
            medianStretches.push(medStretch);      
        }
    
        const medianStretch = this.calculateMedian(medianStretches);
        return medianStretch;
    }

 
    /*
     * Calculate and return median nearest neighbor stretch for Hilbert
     * curves. Calculates the median nearest neightbor stretch of each grid
     * point and returns the median of these medians. 
     */
    calculateMedianHilbertNeighborStretch() {
        let mapOfNeighbors = this.mapOfHilbertNeighbors();
        const medianStretches = [];
            
        // Get median nearest neighbor stretch for each individual point
        for (const key of mapOfNeighbors.keys()) {
            const stretches = 
                this.calculateHilbertNeighborStretches(key, mapOfNeighbors.get(key));
            const medStretch = this.calculateMedian(stretches);
            medianStretches.push(medStretch);      
        }
    
        const medianStretch = this.calculateMedian(medianStretches);
        return medianStretch;
    }

}

