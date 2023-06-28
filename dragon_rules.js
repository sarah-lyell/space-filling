import { GeneralInstructionString } from './general_string.mjs';

export class DragonRules extends GeneralInstructionString{

    constructor(order) {
        const axiom = 'F';
        const replacementRules = {
            'F': 'F+G',
            'G': 'F-G',
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
