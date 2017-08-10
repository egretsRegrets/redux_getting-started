const expect = require('expect');
const deepFreeze = require('deep-freeze');

/**
 * state in this application is an array of
 * numbers representing individual
 * counters
 */

const addCounter = (list) => {
    return [...list, 0];
};

const removeCounter = (list, index) => {
    return [...list.slice(0, index),...list.slice(index + 1)];
    /**
     * or:
     * return list
     *  .slice(0, index)
     *  .concat(list.slice(index + 1));
     */
};

const incrementCounter = (list, index) => {
    return [
        ...list.slice(0, index),
        list[index] + 1,
        ...list.slice(index + 1)
    ];
};

// uses https://github.com/Automattic/expect.js?files=1

/**
 * uses deepFreeze
 * a recursive Object.freeze()
 * https://github.com/substack/deep-freeze
 * Object.freeze() prevents the target object
 * from being edited in anyway; we can use it in our tests to make
 * sure we never mutate existing state.
 */

const testAddCounter = () => {
    const listBefore = [];
    const listAfter = [0];

    deepFreeze(listBefore);

    expect(
        addCounter(listBefore)
    ).toEqual(listAfter);
};

const testRemoveCounter = () => {
    const listBefore = [0, 10, 20];
    const listAfter = [0, 20];

    deepFreeze(listBefore);

    expect(
        removeCounter(listBefore, 1)
    ).toEqual(listAfter);
};

const testIncrementCounter = () => {
    const listBefore = [0, 10, 20];
    const listAfter = [0, 11, 20];

    deepFreeze(listBefore);

    expect(
        incrementCounter(listBefore, 1)
    ).toEqual(listAfter);
};

testAddCounter();
testRemoveCounter();
testIncrementCounter();
console.log('tests passed');