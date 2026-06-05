import stylelint from 'stylelint';
import valueParser from 'postcss-value-parser';

const {
  createPlugin,
  utils: { report, ruleMessages },
} = stylelint;

/** plugin name - prefixes all rules as per stylelint requirements */
const PLUGIN_NAME = 'rem-over-px';

/** rule name for rem-over-px */
const ruleName = `${PLUGIN_NAME}/rem-over-px`;

/** rule messages */
const messages = ruleMessages(ruleName, {
  /** Report message for prefer rem over px */
  remOverPx(val = '') {
    return `Expected px unit in "${val}" to be rem.`;
  },
});

/** rule metadata - required by stylelint to document and enable autofixing */
const meta = {
  url: 'https://github.com/a-tokyo/stylelint-rem-over-px',
  fixable: true,
};

/** default secondary options */
const defaultSecondaryOptions = {
  /** properties to ignore */
  ignore: ['1px'],
  /** functions to ignore */
  ignoreFunctions: ['url'],
  /** @ rules to ignore */
  ignoreAtRules: ['media'],
  /** Base font size - used by autofix to convert px to rem */
  fontSize: 16,
  /** New: disable auto-fixing */
  disableFix: false,
};

/** Regex to match pixels declarations in a string */
const regexPX = new RegExp(/(\d+\.?\d*)px/, 'g');

/** Converts a string with px units to rem */
const _pxToRem = (CSSString = '', fontSize = defaultSecondaryOptions.fontSize || 16) =>
  CSSString.replace(regexPX, (match, n) => `${n / fontSize}rem`);

/** checks if prop is in ignore list */
const _propInIgnoreList = (prop, list) =>
  prop && list.some((item) => prop.indexOf(item) > -1);

/** checks if prop is in ignore list with px */
const _propAddXpxInIgnoreList = (prop, list, px) => {
  const reg = new RegExp(`\\s${px}`);

  return (
    prop &&
    list.some(
      (item) => reg.test(item) && prop.indexOf(item.replace(reg, '')) > -1,
    )
  );
};

/**
 * check if a value has forbidden `px`
 */
const _hasForbiddenPX = (node, options) => {
  const { type } = node;
  /** value to check */
  const value = type === 'decl' ? node.value : node.params;
  /** prop to check */
  const prop = type === 'decl' ? node.prop : null;

  /** parsed value */
  const parsed = valueParser(value);
  /* parse secondaryOptions */
  const {
    ignore = defaultSecondaryOptions.ignore,
    ignoreFunctions = defaultSecondaryOptions.ignoreFunctions,
    ignoreAtRules = defaultSecondaryOptions.ignoreAtRules,
  } = options;

  /** Whether we matched px declarations */
  let hasPX = false;

  /** early exit and ignore */
  if (
    /* ignore atRules */
    (type === 'atrule' && ignoreAtRules.indexOf(node.name) !== -1) ||
    /* ignore declarations that are children of atrules - eg: keyframes */
    (type === 'decl' && node?.parent?.parent?.type === 'atrule' && ignoreAtRules.indexOf(node?.parent?.parent?.name) !== -1) ||
    /* ignore declarations ignored by props */
    (type === 'decl' && _propInIgnoreList(node.prop, ignore))
  ) {
    return;
  }

  /** Walk through the parsed tree and match - return boolean, true if we matched an issue */
  parsed.walk((currNode) => {
    // if currNode is `url(xxx)`, prevent the traversal
    if (
      currNode.type === 'function' &&
      ignoreFunctions.indexOf(currNode.value) !== -1
    ) {
      return false;
    }

    /** whether a px value was matched */
    let matched;

    if (
      currNode.type === 'word' &&
      (matched = currNode.value.match(/^([-,+]?\d+(\.\d+)?px)$/))
    ) {
      /** matched px value. eg: '10px' */
      const px = matched[1];

      /** handled 0px edge case */
      if (px === '0px') {
        return;
      }

      /** check if prop is in ignore list, else -> set hasPX since an issue was matched */
      if (
        !_propAddXpxInIgnoreList(prop, ignore, px) &&
        ignore.indexOf(px) === -1
      ) {
        hasPX = true;
      }
    } else if (
      /* handle string case, eg: mixins etc... */
      currNode.type === 'string' &&
      /(@\{[\w-]+\})px\b/.test(currNode.value)
    ) {
      // eg. ~'@{width}px'
      hasPX = true;
    }
  });

  return hasPX;
};

/** rem-over-px plugin handler */
const pluginHandler =
  (
    primaryOption,
    secondaryOptionObject = defaultSecondaryOptions,
    context = {},
  ) =>
  (root, result) => {
    /** no primary option was provided or null, rule is disabled */
    if (!primaryOption) {
      return;
    }

    const { disableFix, fontSize } = secondaryOptionObject;

    /* check for declarations */
    root.walkDecls((declaration) => {
      if (_hasForbiddenPX(declaration, secondaryOptionObject)) {
        /* report - stylelint applies the fix callback when in fix mode (unless disabled) */
        report({
          ruleName,
          result,
          node: declaration,
          message: messages.remOverPx(declaration),
          fix: disableFix
            ? undefined
            : () => {
                // Apply fixes using PostCSS API
                declaration.value = _pxToRem(declaration.value, fontSize);
              },
        });
      }
    });

    // check for rules
    root.walkAtRules((atRule) => {
      if (_hasForbiddenPX(atRule, secondaryOptionObject)) {
        /* report - stylelint applies the fix callback when in fix mode (unless disabled) */
        report({
          ruleName,
          result,
          node: atRule,
          message: messages.remOverPx(atRule),
          fix: disableFix
            ? undefined
            : () => {
                // Apply fixes using PostCSS API. At-rules are stringified from
                // `params` (not `value`), which is also what `_hasForbiddenPX`
                // inspects, so the fix must mutate `params`.
                atRule.params = _pxToRem(atRule.params, fontSize);
              },
        });
      }
    });
  };

pluginHandler.ruleName = ruleName;
pluginHandler.messages = messages;
pluginHandler.meta = meta;

/**
 * Stylelint plugin rem-over-px
 *
 * Enforces the usage of rem units over px units.
 */
const plugin = createPlugin(ruleName, pluginHandler);

export default plugin;

export { ruleName, messages };
