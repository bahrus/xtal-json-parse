# xtal-json-parse

<a href="https://nodei.co/npm/xtal-json-parse/"><img src="https://nodei.co/npm/xtal-json-parse.png"></a>

xtal-json-parse is a custom element which parses the json inside the element.

This can be used to set a property of a neighboring element.

Example:

```html
<xtal-json-parse>
    <script type="application/json">
    [
        {
            "type": "Ionic",
            "examples": [
                {
                    "formula": "NaCl",
                    "meltingPoint": 801,
                    "boilingPoint": 1413
                },
                {
                    "formula": "CaF2",
                    "meltingPoint": 1418,
                    "boilingPoint": 1533
                }
            ]
        }
        
    ]
    </script>
</xtal-json-parse>
<p-d on=value-changed to=[-value] val=detail.value init-val=value m=1></p-d>
<xtal-editor -value key="Classes of Crystalline Solids"></xtal-editor>
```

## Running Your Element Locally

1. Install node.js
2. fork or clone https://github.com/bahrus/xtal-json-parse
3. Open command window to location of fork or clone.  Issue command:

```
$ npm install
$ npm run serve
```

Open your browser to the address specified, and navigate to (typically) http://localhost:3030/demo/dev

