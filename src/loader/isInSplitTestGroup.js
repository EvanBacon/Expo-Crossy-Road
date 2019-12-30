import * THREE from 'three';

import Storage from './Storage';
import getQueryVariable from './getQueryVariable';

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}


module.exports.isInSplitTestGroup = module.exports.assignTestGroups = undefined;

const _extends = Object.assign || function (target) {
    for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};

const now = new Date();
const defaults = {
    id: null,
    start: null,
    end: null,
    disabled: false,
    groups: [],
    domains: null
};
const tests = [_extends({}, defaults, {
    id: 'easy-access',
    groups: [{
        id: 'control',
        size: 1 / 2
    }, {
        id: 'new',
        size: 1 / 2
    }]
})];
const chooseRandomGroupFromTest = function chooseRandomGroupFromTest(test) {
    const roll = Math.random();
    let chosenGroup = null;
    let chance = 0;
    test.groups.forEach(group => {
        if (chosenGroup) {
            return;
        }
        chance += group.size;
        if (roll <= chance) {
            chosenGroup = group;
        }
    });
    return chosenGroup;
};
const getCurrentlyActiveTests = function getCurrentlyActiveTests(domain) {
    return tests.filter(test => !test.disabled && (test.domains === null || test.domains.includes(domain)) && (!test.start || test.start <= now) && (!test.end || test.end >= now));
};
const assignTestGroups = module.exports.assignTestGroups = function assignTestGroups(domain) {
    getCurrentlyActiveTests(domain).forEach(test => {
        const cookieData = getCookieData();
        const cookieGroupId = cookieData ? cookieData[test.id] : null;
        if (cookieGroupId) {
            assignGroupToTest(cookieGroupId, test.id);
            return;
        }
        const group = chooseRandomGroupFromTest(test);
        assignGroupToTest(group.id, test.id);
    });
};
var assignGroupToTest = function assignGroupToTest(groupId, testId) {
    updateCookieData(_extends({}, cachedCookieData, _defineProperty({}, testId, groupId)));
    window.splitTestGroups = window.splitTestGroups || [];
    window.splitTestGroups[testId] = groupId;
};
var cachedCookieData = null;
var getCookieData = function getCookieData() {
    if (cachedCookieData !== null) {
        return cachedCookieData;
    }
    const cookie = Storage.getItem('splitTests');
    if (cookie) {
        cachedCookieData = JSON.parse(cookie);
    }
    return cachedCookieData;
};
var updateCookieData = function updateCookieData(data) {
    cachedCookieData = data;
    Storage.setItem('splitTests', JSON.stringify(data));
};
const isInSplitTestGroup = module.exports.isInSplitTestGroup = function isInSplitTestGroup(test, group) {
    const forceGroup =  getQueryVariable(`split-test-${test}`);
    if (forceGroup) {
        return forceGroup === group;
    }
    return window.splitTestGroups && window.splitTestGroups[test] && window.splitTestGroups[test] === group;
};