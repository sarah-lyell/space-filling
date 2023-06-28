import { GeneralInstructionString } from './general_string.mjs';

export class GosperRules extends GeneralInstructionString{

    constructor(order) {
        const axiom = 'A';
        const replacementRules = {
            'A': 'A-B--B+A++AA+B-',
            'B': '+A-BB--B-A++A+B',
            '+': '+',
            '-': '-'
        };
        const charsToSkip = '';
        super(order, axiom, replacementRules, charsToSkip);
        this.order = order;
        this._curveType = 'L-based';
    }

    get curveType() {
        return this._curveType;
    }

}
