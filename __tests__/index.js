import { ruleName, messages } from '../index.js';

// border && 1px
testRule({
  ruleName,
  config: [true, { ignore: ['1px'] }],

  accept: [
    { code: '.foo { border-left: 1px solid #333; }' },
    { code: '.foo { border-left: 0px solid #333; }' },
    { code: '.foo { width: 1px; }' },
  ],

  reject: [
    {
      code: '.foo { font-size: 15px; }',
      message: messages.remOverPx('15px'),
      line: 1,
      column: 8,
    },
    {
      code: '.foo { margin-left: -10px; }',
      message: messages.remOverPx('-10px'),
      line: 1,
      column: 8,
    },
    {
      code: '.foo { margin-left: +10px; }',
      message: messages.remOverPx('+10px'),
      line: 1,
      column: 8,
    },
    {
      code: "@width: 1;\n.foo { border-width: ~'@{width}px solid #333'; }",
      message: messages.remOverPx("~'@{width}px solid #333'"),
      line: 2,
      column: 8,
    },
    {
      code: '@width: 10px;\n.foo { border-width: @width * 2 solid #333; }',
      message: messages.remOverPx('10px'),
      line: 1,
      column: 1,
    },
  ],
});

// border && 1px (config: true)
testRule({
  ruleName,
  config: true,

  accept: [
    { code: '.foo { border-left: 1px solid #333; }' },
    { code: '.foo { border-left: 0px solid #333; }' },
    { code: '.foo { width: 1px; }' },
  ],

  reject: [
    {
      code: '.foo { font-size: 15px; }',
      message: messages.remOverPx('15px'),
      line: 1,
      column: 8,
    },
    {
      code: '.foo { margin-left: -10px; }',
      message: messages.remOverPx('-10px'),
      line: 1,
      column: 8,
    },
    {
      code: '.foo { margin-left: +10px; }',
      message: messages.remOverPx('+10px'),
      line: 1,
      column: 8,
    },
    {
      code: "@width: 1;\n.foo { border-width: ~'@{width}px solid #333'; }",
      message: messages.remOverPx("~'@{width}px solid #333'"),
      line: 2,
      column: 8,
    },
    {
      code: '@width: 10px;\n.foo { border-width: @width * 2 solid #333; }',
      message: messages.remOverPx('10px'),
      line: 1,
      column: 1,
    },
  ],
});

// always ignore media query
testRule({
  ruleName,
  config: [true, { ignore: [] }],

  accept: [{ code: '.a { @media screen and (max-width: 370px) {} }' }],

  reject: [
    {
      code: '.a { \n@media screen and (max-width: 370px) { \npadding: 10px; } }',
      message: messages.remOverPx('10px'),
      line: 3,
      column: 1,
    },
  ],
});

// all
testRule({
  ruleName,
  config: [true, { ignore: [] }],

  accept: [],

  reject: [
    {
      code: '.foo { border-left: 1px solid #333; }',
      message: messages.remOverPx('1px solid #333'),
      line: 1,
      column: 8,
    },
    {
      code: "@width: 1;\n.foo { border-width: ~'@{width}px solid #333'; }",
      message: messages.remOverPx("~'@{width}px solid #333'"),
      line: 2,
      column: 8,
    },
    {
      code: '@width: 10px;\n.foo { border-width: @width * 2 solid #333; }',
      message: messages.remOverPx('10px'),
      line: 1,
      column: 1,
    },
  ],
});

// font || 1px
testRule({
  ruleName,
  config: [true, { ignore: ['1px', 'font', '5px'] }],

  accept: [
    { code: '.foo { border-left: 1px solid #333; padding: 5px; }' },
    { code: '.foo { font-size: 15px; }' },
    { code: '.foo { font-size: 1px; }' },
  ],

  reject: [
    {
      code: "@width: 1;\n.foo { border-width: ~'@{width}px solid #333'; }",
      message: messages.remOverPx("~'@{width}px solid #333'"),
      line: 2,
      column: 8,
    },
    {
      code: '@width: 10px;\n.foo { border-width: @width * 2 solid #333; }',
      message: messages.remOverPx('10px'),
      line: 1,
      column: 1,
    },
    {
      code: '.foo { padding: 50px; }',
      message: messages.remOverPx('50px'),
      line: 1,
      column: 8,
    },
  ],
});

// font
testRule({
  ruleName,
  config: [true, { ignore: ['font'] }],

  accept: [
    { code: '.foo { font-size: 15px; }' },
    { code: '.foo { font-size: 1px; }' },
  ],

  reject: [
    {
      code: '.foo { border-left: 1px solid #333; }',
      message: messages.remOverPx('1px solid #333'),
      line: 1,
      column: 8,
    },
    {
      code: "@width: 1;\n.foo { border-width: ~'@{width}px solid #333'; }",
      message: messages.remOverPx("~'@{width}px solid #333'"),
      line: 2,
      column: 8,
    },
    {
      code: '@width: 10px;\n.foo { border-width: @width * 2 solid #333; }',
      message: messages.remOverPx('10px'),
      line: 1,
      column: 1,
    },
  ],
});

// border + 1px
testRule({
  ruleName,
  config: [true, { ignore: ['border 1px'] }],

  accept: [{ code: '.foo { border-top: 1px solid #ccc; }' }],

  reject: [
    {
      code: '.foo { border-top: 2px solid #ccc; }',
      message: messages.remOverPx('2px solid #ccc'),
      line: 1,
      column: 8,
    },
    {
      code: '.foo { padding: 1px; }',
      message: messages.remOverPx('1px'),
      line: 1,
      column: 8,
    },
  ],
});

// disabled
testRule({
  ruleName,
  config: false,

  accept: [
    { code: '.foo { padding: 20px; }' },
    { code: '@width: 10px;\n.foo { border-width: @width * 2 solid #333; }' },
  ],

  reject: [],
});

// ignoreFunctions
testRule({
  ruleName,
  config: [true, { ignoreFunctions: ['rem', 'rem-calc'] }],

  accept: [
    {
      code: '.foo { font-size: rem(15px); border-left: rem-calc(12px) solid #333; }',
    },
  ],

  reject: [
    {
      code: '.foo { width: calc(100% - 12px); }',
      message: messages.remOverPx('calc(100% - 12px)'),
      line: 1,
      column: 8,
    },
  ],
});

// ignoreAtRules
testRule({
  ruleName,
  config: [true, { ignoreAtRules: ['keyframes'] }],

  accept: [
    { code: '@keyframes move { from {top: 0px;} to {top: 200px;} }' },
  ],

  reject: [],
});

// autofix: px -> rem conversion (new coverage for the fix path)
testRule({
  ruleName,
  config: [true, { ignore: ['1px'] }],
  fix: true,

  accept: [
    { code: '.foo { border-left: 1px solid #333; }' },
    { code: '.foo { height: 1.5rem; }' },
  ],

  reject: [
    {
      code: '.foo { font-size: 15px; }',
      fixed: '.foo { font-size: 0.9375rem; }',
      message: messages.remOverPx('15px'),
      line: 1,
      column: 8,
    },
    {
      code: '.foo { margin-left: -10px; }',
      fixed: '.foo { margin-left: -0.625rem; }',
      message: messages.remOverPx('-10px'),
      line: 1,
      column: 8,
    },
    {
      code: '.foo { width: calc(100% - 12px); }',
      fixed: '.foo { width: calc(100% - 0.75rem); }',
      message: messages.remOverPx('calc(100% - 12px)'),
      line: 1,
      column: 8,
    },
  ],
});

// autofix with custom fontSize
testRule({
  ruleName,
  config: [true, { ignore: ['1px'], fontSize: 10 }],
  fix: true,

  accept: [],

  reject: [
    {
      code: '.foo { width: 8px; }',
      fixed: '.foo { width: 0.8rem; }',
      message: messages.remOverPx('8px'),
      line: 1,
      column: 8,
    },
  ],
});

// disableFix: reports but does not autofix
testRule({
  ruleName,
  config: [true, { ignore: ['1px'], disableFix: true }],
  fix: true,

  accept: [],

  reject: [
    {
      code: '.foo { font-size: 15px; }',
      message: messages.remOverPx('15px'),
      line: 1,
      column: 8,
      unfixable: true,
    },
  ],
});

// autofix: at-rule px -> rem conversion (mutates params, not value)
testRule({
  ruleName,
  config: [true, { ignore: ['1px'] }],
  fix: true,

  accept: [],

  reject: [
    {
      code: '@width: 10px;\n.foo { color: red; }',
      fixed: '@width: 0.625rem;\n.foo { color: red; }',
      message: messages.remOverPx('10px'),
      line: 1,
      column: 1,
    },
  ],
});

// --- regression coverage for fixed edge cases ------------------------------

// bug: declarations nested inside `@media { .sel { ... } }` were never linted,
// because `media` is in the default `ignoreAtRules`. Now `media` only skips the
// at-rule's own prelude; declarations nested inside it are linted normally.
testRule({
  ruleName,
  config: [true, { ignore: [] }],

  accept: [
    // the `@media (...)` prelude itself is still never flagged
    { code: '@media (max-width: 768px) { .a { margin: 1rem; } }' },
    { code: '@media (max-width: 768px) {}' },
  ],

  reject: [
    {
      code: '@media (max-width: 768px) {\n  .a { padding: 10px; }\n}',
      message: messages.remOverPx('10px'),
      line: 2,
      column: 8,
    },
  ],
});

// bug: `@keyframes` descendants are only skipped when `keyframes` is explicitly
// listed in `ignoreAtRules`; by default they are linted like any other rule.
testRule({
  ruleName,
  config: [true, { ignore: [] }],

  accept: [
    { code: '@keyframes spin { from { opacity: 0; } to { opacity: 1; } }' },
  ],

  reject: [
    {
      code: '@keyframes grow {\n  to { top: 200px; }\n}',
      message: messages.remOverPx('200px'),
      line: 2,
      column: 8,
    },
  ],
});

// bug: the keyframes opt-out only looked at the grandparent, so a declaration
// nested deeper inside the block was still reported. It now applies at any depth.
testRule({
  ruleName,
  config: [true, { ignoreAtRules: ['keyframes'] }],

  accept: [
    {
      code: '@keyframes k {\n  to {\n    @media screen { top: 200px; }\n  }\n}',
    },
    {
      code: '@keyframes k {\n  to {\n    .inner { top: 200px; }\n  }\n}',
    },
  ],

  reject: [],
});

// at-rule names are case-insensitive: an uppercase `@KEYFRAMES` is still
// recognised as a keyframes block for the opt-out.
testRule({
  ruleName,
  config: [true, { ignoreAtRules: ['KEYFRAMES'] }],

  accept: [{ code: '@KEYFRAMES k { to { top: 200px; } }' }],

  reject: [],
});

// an ignored outer keyframes block still wins even when an unignored,
// differently-named keyframes block sits between it and the declaration.
testRule({
  ruleName,
  config: [true, { ignore: [], ignoreAtRules: ['keyframes'] }],

  accept: [
    {
      code: '@keyframes a {\n  to {\n    @-webkit-keyframes b { to { top: 200px; } }\n  }\n}',
    },
  ],

  reject: [],
});

// bug: the warning message was stringified from the whole node, leaking
// `!important` and raw whitespace. It must report only the offending value.
testRule({
  ruleName,
  config: [true, { ignore: [] }],

  accept: [],

  reject: [
    {
      code: '.foo { margin: 10px !important; }',
      message: messages.remOverPx('10px'),
      line: 1,
      column: 8,
    },
    {
      code: '.foo {\n  padding:\n    12px;\n}',
      message: messages.remOverPx('12px'),
      line: 2,
      column: 3,
    },
  ],
});

// bug: the sign character class `[-,+]` accepted a stray comma; only `-`/`+`
// are valid signs. Comma-separated px lists are still each flagged and the
// message carries the full declaration value.
testRule({
  ruleName,
  config: [true, { ignore: [] }],

  accept: [
    { code: '.foo { transition: margin 0.2s, padding 0.2s; }' },
  ],

  reject: [
    {
      code: '.foo { transition: margin 10px, padding 20px; }',
      warnings: [
        {
          message: messages.remOverPx('margin 10px, padding 20px'),
          line: 1,
          column: 8,
        },
      ],
    },
  ],
});
