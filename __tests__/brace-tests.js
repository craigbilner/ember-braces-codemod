
'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, 'transform', null, 'replaces-unordered');
defineTest(__dirname, 'transform', null, 'replaces-brace-group');
defineTest(__dirname, 'transform', null, 'replaces-group-brace');
defineTest(__dirname, 'transform', null, 'no-replacement');
