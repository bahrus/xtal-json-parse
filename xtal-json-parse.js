import { xc } from 'xtal-element/lib/XtalCore.js';
import { passAttrToProp } from 'xtal-element/lib/passAttrToProp.js';
/**
 * Parse and notify JSON contained inside.
 * @element xtal-json-insert
 * @event value-changed
 *
 */
export class XtalJsonParse extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
    }
    attributeChangedCallback(n, ov, nv) {
        passAttrToProp(this, slicedPropDefs, n, ov, nv);
    }
    connectedCallback() {
        this.style.display = 'none';
        xc.hydrate(this, slicedPropDefs);
        this.loadJSON();
    }
    onPropChange(n, prop, newVal) {
        this.reactor.addToQueue(prop, newVal);
    }
    merge(dest, src) {
        Object.assign(dest, src);
    }
    loadJSON() {
        const scriptTag = this.querySelector('script[type="application\/json"]');
        if (!scriptTag) {
            setTimeout(() => {
                this.loadJSON();
            }, 100);
            return;
        }
        this.stringToParse = scriptTag.innerHTML;
    }
}
XtalJsonParse.is = 'xtal-json-parse';
XtalJsonParse.observedAttributes = ['disabled', 'string-to-parse'];
export const linkParsedObject = ({ stringToParse, disabled, self }) => {
    setTimeout(() => {
        try {
            if (self.refs) {
                self.parsedObject = JSON.parse(self.stringToParse, (key, val) => {
                    if (typeof val !== 'string')
                        return val;
                    if (!val.startsWith('${refs.') || !val.endsWith('}'))
                        return val;
                    const realKey = val.substring(7, val.length - 1);
                    return self.refs[realKey];
                });
            }
            else {
                self.parsedObject = JSON.parse(stringToParse);
            }
            delete self.stringToParse;
        }
        catch (e) {
            console.error("Unable to parse " + stringToParse);
        }
    }, self.delay === undefined ? 0 : self.delay);
};
export const postParseCallback = ({ self, disabled, parsedObject, modifyParsedObjectFn }) => {
    let newVal = parsedObject;
    if (modifyParsedObjectFn !== undefined) {
        newVal = modifyParsedObjectFn(parsedObject, self);
    }
    self[slicedPropDefs.propLookup.value.alias] = newVal;
};
const propActions = [linkParsedObject, postParseCallback];
const baseProp = {
    dry: true,
    async: true,
};
const objProp1 = {
    ...baseProp,
    type: Object
};
const objProp2 = {
    ...objProp1,
    notify: true,
    obfuscate: true,
};
const objProp3 = {
    ...objProp1,
    parse: true,
    stopReactionsIfFalsy: true,
};
const objStr1 = {
    ...baseProp,
    type: String,
};
const objStr2 = {
    ...objStr1,
    stopReactionsIfFalsy: true,
};
const propDefMap = {
    refs: objProp1, parsedObject: objProp3, stringToParse: objStr2,
    value: objProp2,
    disabled: {
        ...baseProp,
        type: Boolean,
        stopReactionsIfTruthy: true,
    }
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(XtalJsonParse, slicedPropDefs, 'onPropChange');
xc.define(XtalJsonParse);
