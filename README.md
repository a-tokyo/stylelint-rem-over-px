# stylelint-rem-over-px

A stylelint rule to enforce the usage of rem units over px units. It can also be used to migrate a project that uses px to use rem.

<a href="https://npmjs.com/package/stylelint-rem-over-px">
  <img src="https://img.shields.io/npm/v/stylelint-rem-over-px.svg"></img>
  <img src="https://img.shields.io/npm/dt/stylelint-rem-over-px.svg"></img>
</a>
<a href="https://twitter.com/intent/follow?screen_name=ahmad_tokyo"><img src="https://img.shields.io/twitter/follow/ahmad_tokyo.svg?label=Follow%20@ahmad_tokyo" alt="Follow @ahmad_tokyo"></img></a>

```css
width: 10px; // error
height: 1.5rem; // ok
border: 1px solid #000000; // ok
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
    // ...
    "rem-over-px/rem-over-px": [true, { "ignore": ["1px"] }],
    // or just:
    "rem-over-px/rem-over-px": true,
    // ...
  }
}
```

## Options

### ignore: Item[]

ignore value check.

Valid value of Item: `propertyName` | `'1px'` | `'${propertyName} 1px'`

### ignoreFunctions: string[]

ignore check for functions.

### example(1) (the default options)

```javascript
// all 1px is ok
"rem-over-px/rem-over-px": [true, { "ignore": ["1px"] }],
```

```css
@padding-base: 20px; // error

.foo {
  border-top: 1px solid #ccc; // ok
  padding: 10px; // error
  height: 1px; // ok
  padding: @padding-base * 2;
}
```

### example(2)

```javascript
//  - all `1px` or `font` is ok
//  - rem(Npx) is ok
"rem-over-px/rem-over-px": [true, { "ignore": ["1px", "font"], "ignoreFunctions": ["rem"] }],
```

```css
.foo {
  border-top: 1px solid #ccc; // ok
  height: 1px; // ok
  font-size: 24px; // ok
  padding: 10px; // error
  width: calc(100% - 10px); // error
  font-size: rem(10px); // ok
}
```

### example(3)

```javascript
// only `border + 1px` is ok
"rem-over-px/rem-over-px": [true, { "ignore": ["border 1px"] }],
```

```css
.foo {
  border-top: 1px solid #ccc; // ok
  height: 1px; // error
}
```

### AutoFixing
This plugin supports auto-fixing. Simply run stylelint with the --fix option. The plugin will then replace all px occurrences with rem.
