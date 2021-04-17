export interface XtalJsonParseProps{
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
    modifyParsedObjectFn: (mergedObj: any, t: XtalJsonParseProps) => any;

    
    /**
     * Number of milliseconds to wait before passing the input on for processing.
     * @type {number}
     * 
     */
     delay: number;
}

