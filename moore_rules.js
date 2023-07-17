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

    convertCoordinateToIndex(coord) {
        const order = this.order;
    }

}