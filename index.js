'use strict';

const stylelint = require('stylelint');
const valueParser = require('postcss-value-parser');

/** rule name */
const ruleName = 'rem-over-px/rem-over-px';

/** rule messages */
const messages = stylelint.utils.ruleMessages(ruleName, {
	rem(val = '') {
		return `Expected px unit in "${val}" to be rem.`;
	},
});

/** default secondary options */
const defaultSecondaryOptions = {
	ignore: ['1px'],
	fontSize: 16,
};

// eslint-disable-next-line
const regexPX = new RegExp(/(\d+\.?\d*)px/, 'g');

/** Converts a string with px units to rem */
const _pxToRem = (CSSString = '', fontSize) =>
	CSSString.replace(regexPX, (match, n) => `${n / fontSize}rem`);

/** checks if prop is in ignore list */
const _propInIgnoreList = (prop, list) => (
  prop &&
  list.some((item) => prop.indexOf(item) > -1)
  );

const _propAddXpxInIgnoreList = (prop, list, px) => {
	const reg = new RegExp(`\\s${px}`);

	return (
		prop &&
		list.some((item) => reg.test(item) && prop.indexOf(item.replace(reg, '')) > -1)
	);
};

/**
 * check if a value has forbidden `px`
 */
const _hasForbiddenPX = (node, options) => {
	const { type } = node;
	const value = type === 'decl' ? node.value : node.params;
	const prop = type === 'decl' ? node.prop : null;

	const parsed = valueParser(value);
	const { ignore = defaultSecondaryOptions.ignore, ignoreFunctions = [] } = options;

  let hasPX = false;

  /** early exit and ignore */
	if (
    /* ignore media queries */
    type === 'atrule' && node.name === 'media'
    ||
    /* ignore declarations ignored by props */
    type === 'decl' && _propInIgnoreList(node.prop, ignore)
  ) {
    return;
  }

	parsed.walk((currNode) => {
		// if currNode is `url(xxx)`, prevent the traversal
		if (
			currNode.type === 'function' &&
			(currNode.value === 'url' || ignoreFunctions.indexOf(currNode.value) > -1)
		) {
			return false;
		}

    /** whether a px value was matched */
		let matched;

		if (currNode.type === 'word' && (matched = currNode.value.match(/^([-,+]?\d+(\.\d+)?px)$/))) {
			const px = matched[1];

			if (px === '0px') {
				return;
			}

			if (!_propAddXpxInIgnoreList(prop, ignore, px) && ignore.indexOf(px) === -1) {
				hasPX = true;
			}
		} else if (currNode.type === 'string' && /(@\{[\w-]+\})px\b/.test(currNode.value)) {
			// eg. ~'@{width}px'
			hasPX = true;
		}
	});

	return hasPX;
};

/** rem-over-px plugin handler */
const pluginHandler =
	(primaryOption, secondaryOptionObject = defaultSecondaryOptions, context = {}) =>
	(root, result) => {
		if (!primaryOption) {
			return;
		}

    // check for declarations
		root.walkDecls((declaration) => {
			if (_hasForbiddenPX(declaration, secondaryOptionObject)) {
				if (context.fix) {
					// Apply fixes using PostCSS API
					declaration.value = _pxToRem(declaration.value, secondaryOptionObject.fontSize);

					// Return and don't report a problem
					return;
				}

        // report a problem
				stylelint.utils.report({
					ruleName,
					result,
					node: declaration,
					message: messages.rem(declaration),
				});
			}
		});

    // check for rules
		root.walkAtRules((atRule) => {
			if (_hasForbiddenPX(atRule, secondaryOptionObject)) {
				if (context.fix) {
					// Apply fixes using PostCSS API
					atRule.value = _pxToRem(atRule.value, secondaryOptionObject.fontSize);

					// Return and don't report a problem
					return;
				}

        // report a problem
				stylelint.utils.report({
					ruleName,
					result,
					node: atRule,
					message: messages.rem(atRule),
				});
			}
		});
	};

/**
 * Stylelint plugin rem-over-px
 * 
 * Enforces the usage of rem units over px units.
 */
module.exports = stylelint.createPlugin(ruleName, pluginHandler);

module.exports.ruleName = ruleName;
module.exports.messages = messages;
