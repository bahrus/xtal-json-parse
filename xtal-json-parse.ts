import {xc, PropAction, PropDef, PropDefMap, ReactiveSurface} from 'xtal-element/lib/XtalCore.js';
import {passAttrToProp} from 'xtal-element/lib/passAttrToProp.js';

type X = XtalJsonParse;
/**
 * Parse and notify JSON contained inside.
 * @element xtal-json-insert
 * @event value-changed
 *  
 */
export class XtalJsonParse extends HTMLElement implements ReactiveSurface{
    static is = 'xtal-json-parse';
    static observedAttributes = ['disabled', 'string-to-parse'];
    attributeChangedCallback(n: string, ov: string, nv: string){
        passAttrToProp(this, slicedPropDefs, n,ov,nv);
    }

    self = this;
    propActions = propActions;
    reactor = new xc.Rx(this);

    disabled: boolean | undefined;

    /**
     * @type {object}
     * ⚡value-changed
     * The inserted the input property with the JSON inside the script tag.
     * 
     */
    value: any;

    /**
     * A key value pair object that allows the JSON to be passed functions or objects during the JSON parsing phase.
     * @type {object}
     */
    refs: object;


    /**
     * Pass in a function to modify the parsed object, rather than using events.
     * @type {function}
     * 
     */
    modifyParsedObjectFn: (mergedObj: any, t: X) => any;


    /**
     * Number of milliseconds to wait before passing the input on for processing.
     * @type {number}
     * 
     */
    delay: number;

    /**
     * @private
     */
    stringToParse: string;

    parsedObject: any;



    connectedCallback(){
        this.style.display = 'none';
        xc.hydrate(this, slicedPropDefs);
        this.loadJSON();
    }

    onPropChange(n: string, prop: PropDef, newVal: any){
        this.reactor.addToQueue(prop, newVal);
    }

    merge(dest: object, src: object) {
        Object.assign(dest, src);
    }

    loadJSON() {
        const scriptTag = this.querySelector('script[type="application\/json"]') as HTMLScriptElement;
        if (!scriptTag) {
            setTimeout(() => {
                this.loadJSON();
            }, 100);
            return;
        }
        this.stringToParse = scriptTag.innerHTML;
    }
}

export const linkParsedObject =  ({ stringToParse, disabled, self}: X) => {
    setTimeout(() => {
        try {
            if (self.refs) {
                self.parsedObject = JSON.parse(self.stringToParse, (key, val) => {
                    if (typeof val !== 'string') return val;
                    if (!val.startsWith('${refs.') || !val.endsWith('}')) return val;
                    const realKey = val.substring(7, val.length - 1);
                    return self.refs[realKey];
                });
            } else {
                self.parsedObject = JSON.parse(stringToParse);
            }
            delete self.stringToParse;
        } catch (e) {
            console.error("Unable to parse " + stringToParse);
        }
    }, self.delay === undefined ? 0 : self.delay);
};

export const postParseCallback = ({ self, disabled, parsedObject, modifyParsedObjectFn }: X) => {
    
    let newVal = parsedObject;
    if (modifyParsedObjectFn !== undefined) {
        newVal = modifyParsedObjectFn(parsedObject, self);
    }
    self[slicedPropDefs.propLookup.value.alias] = newVal;
};

const propActions = [linkParsedObject, postParseCallback] as PropAction[];

const baseProp : PropDef = {
    dry: true,
    async: true,
};

const objProp1: PropDef = {
    ...baseProp,
    type: Object
};

const objProp2: PropDef = {
    ...objProp1,
    notify: true,
    obfuscate: true,
};

const objProp3: PropDef = {
    ...objProp1,
    parse: true,
    stopReactionsIfFalsy: true,
};

const objStr1: PropDef = {
    ...baseProp,
    type: String,
}

const objStr2: PropDef = {
    ...objStr1,
    stopReactionsIfFalsy: true,
}

const propDefMap: PropDefMap<X> = {
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