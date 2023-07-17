import { Measurements } from "./measurements.mjs";

document.addEventListener('DOMContentLoaded', function() {
    const drawButton = document.getElementById('tableButton');
    drawButton.addEventListener('click', generateTable);
  });

/* Generate table for AvgNNS. Only generates once */
function generateTable() {
    const table = new Table();
    table.createTable();
    this.removeEventListener('click', generateTable);
}

document.addEventListener('DOMContentLoaded', function() {
    const drawButton = document.getElementById('tableTwoButton');
    drawButton.addEventListener('click', generateTableTwo);
  });
  
/* Generate table for MedNNS. Only generates once */
function generateTableTwo() {
    const table = new Table();
    table.createTableTwo();
    this.removeEventListener('click', generateTableTwo);
}

export class Table {

    /* Creates a 10x3 table with some default cell text */
    createTable() {
        // Get the test results
        let hilbertANNSResults = this.hilbertANNSTests();
        let mortonANNSResults = this.mortonANNSTests();
        
        // Create a <table> element and a <tbody> element
        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");

        // Creating the cells (10 rows for now)
        for (let r = 0; r < 3; r++) {
            // First row contains titles
            if (r == 0) {
                const row = document.createElement("tr");
                for (let c = 0; c < 10; c++) {
                    const cell = document.createElement("td");
                    cell.style.width = "150px"; // set the width
                    if (c == 0) {
                        const cellText = document.createTextNode('x: order, y: curve');
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    } else {
                        const cellText = document.createTextNode(`${c + 1}`);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                }
                tblBody.appendChild(row);

            } else {
                const row = document.createElement("tr");
                for (let c = 0; c < 10; c++) {
                    const cell = document.createElement("td");
                    cell.style.width = "150px"; // set the width
                    cell.style.overflow = "auto"; // set overflow to auto
                    if (c == 0 && r == 1) {
                        const cellText = document.createTextNode("Hilbert");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    } else if (c == 0 && r == 2) {
                        const cellText = document.createTextNode("Morton");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    } else if (r == 1) {
                        let result = hilbertANNSResults[c - 1];
                        
                        // Don't parse order 10 since undefined
                        if (c != 9) {
                            // Limit precision to 2 decimal places
                            result = parseFloat(result).toFixed(2); 
                        }
                        const cellText = document.createTextNode(result);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    } else if (r == 2) {
                        let result = mortonANNSResults[c - 1];
                        // Limit precision to 2 decimal places
                        result = parseFloat(result).toFixed(2);
                        const cellText = document.createTextNode(result);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                }
                tblBody.appendChild(row);
            }

        }

        // Put the <tbody> in the <table>
        tbl.appendChild(tblBody);
        // Get the reference to the button
        const button = document.getElementById('tableButton');

        // Insert the table after the button
        button.parentNode.insertBefore(tbl, button.nextSibling);
        
        tbl.setAttribute("border", "2");
    }

    /* Creates a 3x10 table */
    createTableTwo() {
        // Get the test results
        let hilbertMNNSResults = this.hilbertMNNSTests();
        let mortonMNNSResults = this.mortonMNNSTests();
        
        // Create a <table> element and a <tbody> element
        const tbl = document.createElement("table");
        const tblBody = document.createElement("tbody");

        // Creating the cells (10 rows for now)
        for (let r = 0; r < 3; r++) {
            // First row contains titles
            if (r == 0) {
                const row = document.createElement("tr");
                for (let c = 0; c < 10; c++) {
                    const cell = document.createElement("td");
                    cell.style.width = "150px"; // set the width
                    if (c == 0) {
                        const cellText = document.createTextNode('x: order, y: curve');
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    } else {
                        const cellText = document.createTextNode(`${c + 1}`);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                }
                tblBody.appendChild(row);

            } else {
                const row = document.createElement("tr");
                for (let c = 0; c < 10; c++) {
                    const cell = document.createElement("td");
                    cell.style.width = "150px"; // set the width
                    if (c == 0 && r == 1) {
                        const cellText = document.createTextNode("Hilbert");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    } else if (c == 0 && r == 2) {
                        const cellText = document.createTextNode("Morton");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    } else if (r == 1) {
                        const result = hilbertMNNSResults[c - 1];
                        const cellText = document.createTextNode(result);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    } else if (r == 2) {
                        const result = mortonMNNSResults[c - 1];
                        const cellText = document.createTextNode(result);
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                }
                tblBody.appendChild(row);
            }

        }

        // Put the <tbody> in the <table>
        tbl.appendChild(tblBody);

        // Get the reference to the button
        const button = document.getElementById('tableTwoButton');

        // Insert the table after the button
        button.parentNode.insertBefore(tbl, button.nextSibling);

        tbl.setAttribute("border", "2");
    }

    /* average nearest neighbor stretch for orders 2-10 of hilbert
     * returns an array of the result of the average nearest neighbor 
     * stretches for the given orders 
     */
    hilbertANNSTests() {
        let hilbertAvgNNS = [];
        for (let i = 2; i <= 9; i++) {
            const hilbert = new Measurements('hilbert', i);
            hilbertAvgNNS.push(hilbert.avgNearestNeighborStretch);
        }
        //console.log(hilbertAvgNNS);
        return hilbertAvgNNS;
    }

    /* 
     * median nearest neighbor stretch for orders 2-10 of hilbert
     * returns an array of the result of the median nearest neighbor 
     * stretches for the given orders 
     */
    hilbertMNNSTests() {
        let hilbertMedNNS = [];
        for (let i = 2; i <= 10; i++) {
            const hilbert = new Measurements('hilbert', i);
            hilbertMedNNS.push(hilbert.medNearestNeighborStretch);
        }
        //console.log(hilbertMedNNS);
        return hilbertMedNNS;
    }

    /* average nearest neighbor stretch for orders 2-10 of morton
     * returns an array of the result of the average nearest neighbor 
     * stretches for the given orders */
    mortonANNSTests() {
        let mortonAvgNNS = [];
        for (let i = 2; i<= 10; i++) {
            const morton = new Measurements('morton', i);
            mortonAvgNNS.push(morton.avgNearestNeighborStretch);
        }
        //console.log(mortonAvgNNS);
        return mortonAvgNNS;
    }

    /* 
     * median nearest neighbor stretch for orders 2-10 of Morton curve.
     * returns an array of the result of the median nearest neighbor 
     * stretches for the given orders 
     */
    mortonMNNSTests() {
        let mortonMedNNS = [];
        for (let i = 2; i <= 10; i++) {
            const morton = new Measurements('morton', i);
            mortonMedNNS.push(morton.medNearestNeighborStretch);
        }

        return mortonMedNNS;
    }
    

}

const test = new Measurements('morton', 4);
const med = test.medNearestNeighborStretch;
const median = test.calculateMedian([10,2,1,12,15,13]);
const neighbors = test.mapOfNeighbors();
console.log(neighbors);

console.log(median);
