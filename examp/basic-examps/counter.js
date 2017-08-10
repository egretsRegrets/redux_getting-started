/*
// without switch statement

function counter(state, action) {
    if (typeof state === 'undefined') {
        return 0; // return initial state if state in action is undefined
    }
    else if (action.type === 'INCREMENT') {
        return state + 1;
    } else if (action.type === 'DECREMENT') {
        return state - 1;
    } else {
        return state;
    }
}

*/

/**
 * notice that we take care of our if typeof state === 'undefined'
 * by giving state a default value of initial state
 */

const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}

/** this example uses cdn inclusion of redux in a script tag;
* it's a little different form how we would do it in Angular
* below we go ahead an implement a Redux method called createStore
*/

const createStore = (reducer) => {
    let state;
    // listeners will be all the various subscribed listeners
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);
        /**
         * state is updated so we need to call all of
         * the subscribed listeners
         */
        listeners.forEach(listener => listener());
    };

    const subscribe = (listener) => {
        listeners.push(listener);
        // a function that will unsubscribe the listener
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };

        /**
         *  here will go ahead and return initial state
         * for when our view is first subscribed
         */
        dispatch({});
    };

    return { getState, dispatch, subscribe };
};

const store = createStore(counter);

/**
 * the getState method is a redux method that basically does
 * exactly what you think it would
 */

const render = () => {
    document.body.innerText = store.getState();
}

/** subscribe lets us register a callback that will be called
* anytime an action is dispatched, so that we can update our UI
* whenever their is state change we want to watch
*/

store.subscribe(render);
render(); /**
 *  we want to also call render once to get initial state
 * on the page, just so we see '0' before we increment
 */

document.addEventListener('click', () => {
    store.dispatch({ type: 'INCREMENT' });
});