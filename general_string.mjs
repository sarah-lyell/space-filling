
export class GeneralInstructionString {

    constructor(order, axiom, {...replacementRules}, charsToSkip) {
        this.order = order;
        this.start = axiom;
        this.rules = {...replacementRules};
        this.charsToSkip = charsToSkip;
    }


    generateLStringRecursive(currentString, order) {
        let nextString = '';
    
        if (order == 0) {
            return currentString;
        }
    
        for (const c of currentString) {
            for (let key in this.rules) {
                if (c == key) {
                    nextString += this.rules[key];
                }
            }
        }
        
        return this.generateLStringRecursive(nextString, order - 1);
    }
    
    generateLString() {
        let start = this.start;
        let order = this.order;
    
        let finalString = this.generateLStringRecursive(start, order);
    
        return finalString;
    }

    // Remove characters not relevant to drawing of curve
    generateStringForGraphics(str) {
        const charactersToRemove = new RegExp(`[${this.charsToSkip}]`, 'g');
        const result = str.replace(charactersToRemove, '');
        return result;
    }

    
}
