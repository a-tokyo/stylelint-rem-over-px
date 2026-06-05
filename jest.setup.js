import { getTestRule } from 'jest-preset-stylelint';

import plugin from './index.js';

global.testRule = getTestRule({ plugins: [plugin] });
