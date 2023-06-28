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

}

/*
const testString = new HilbertRules(2);
const output = testString.generateLString();
console.log(output);
const stringForGraphics = testString.generateStringForGraphics(output);
console.log(stringForGraphics);
*/