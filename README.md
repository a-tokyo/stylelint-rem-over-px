# stylelint-rem-over-px

A stylelint rule to enforce the usage of rem units over px units. It can also be used to migrate a project that uses px to use rem.

<a href="https://npmjs.com/package/stylelint-rem-over-px">
  <img src="https://img.shields.io/npm/v/stylelint-rem-over-px.svg"></img>
  <img src="https://img.shields.io/npm/dt/stylelint-rem-over-px.svg"></img>
</a>
<a href="https://twitter.com/intent/follow?screen_name=ahmad_tokyo"><img src="https://img.shields.io/twitter/follow/ahmad_tokyo.svg?label=Follow%20@ahmad_tokyo" alt="Follow @ahmad_tokyo"></img></a>

```css
width: 8px; // error -> can be autofixed to width: 0.5rem;
height: 1.5rem; // ok
border: 1px solid #000000; // ok
border: 2px solid #000000; // error -> can be autofixed to width: 0.125rem;
@media (max-width: 768px) { display: none }; // ok
background-image: url('https://exapmle.com?size=500pxX500px'); // ok
```

## Installation

```
npm install stylelint-rem-over-px --save-dev
```
OR
```
yarn add -D stylelint-rem-over-px --save-dev
```

## Usage

Add it to your stylelint config

```javascript
// .stylelintrc
{
  "plugins": [
    "stylelint-rem-over-px"
  ],
  "rules": {
    // Declare the rule
    "rem-over-px/rem-over-px": true,
    // Declaring the rule with default values is equivalent to:
    // "rem-over-px/rem-over-px": [true, { "ignore": "1px", "ignoreFunctions": ["url"] , "ignoreAtRules": ["media"], fontSize: 16 }],
  }
}
```

## Options

### ignore: Item[]

ignore value check.

Valid value of Item: `propertyName` | `'1px'` | `'${propertyName} 1px'`

Default: ["1px"]

### ignoreFunctions: string[]

ignore check for functions.

Default: ["url"]

### ignoreAtRules: string[]

ignore check for @ rules.

Default: ["media"]

### fontSize: number

Base font size in pixels. Used to fix px values to rem.

Default: 16

### AutoFixing
This plugin supports auto-fixing. Simply run stylelint with the --fix option. The plugin will then replace all px occurrences with rem.
