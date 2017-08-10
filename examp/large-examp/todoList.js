const expect = require('expect');
const deepFreeze = require('deep-freeze');

const redux = require('redux');

const React = require('react');
const ReactDom = require('react-dom');

// state is described as a list of todos

/**
 * just as in a function,
 * we want to limit our reducers to addressing one concern
 * so we have separate reducers for handling our array of entities/todos
 * and our individual entities/todos.
 * The todos reducer calls the todo reducer, incorporating the return into
 * the returned array of state.
 * This process is reducer composition (just like function composition).
 */

const todo = (state, action) => {
    switch(action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }
            return Object.assign({}, state, {
                completed: !state.completed
            });
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t => todo(t, action));
        default:
            return state;
    }
};

// visibility filter reducer:
/**
 * state in the visibilityFilter is a string
 * representing the filter
 */

const visibilityFilter = (state = 'SHOW_ALL', action) => {
    switch(action.type) {
        case 'SET_VISIBILITY_FILTER':
            return action.filter;
        default:
            return state;
    }
};

/**
 * the todoApp reducer combines our other reducers into one 
 * top-level reducer:
 * when an action comes in it is passed to our other reducers;
 * the results are the values in the current application state
 * object.
 */

/*
// here's our manual implementation of a combined reducer
 const todoApp = (state = {}, action) => {
    return{
        todos: todos(
            state.todos,
            action
        ),
        visibilityFilter: visibilityFilter(
            state.visibilityFilter,
            action
        )
    };
}
*/

// reducer composition with combineReducers() method:
/**
 * The only argument to the combine reducers method
 * is an object specifying the mapping mapping between
 * the state field names and the reducers managing those
 * parts of state.
 * {todos, visibilityFilter} is equivalent to
 * {todos: todos, visibilityFilter: visibilityFilter}
 * thanks to the es6 object literal shorthand notation.
 */

// we can take combineReducers from redux; we can also implement it ourself

const combineReducers = (reducers) => {
    return(state = {}, action) => {
        return Object.keys(reducers).reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](
                    state[key],
                    action
                );
                return nextState;
            },
            {} // empty object is the first value for nextState
        );
    };
};

const todoApp = combineReducers({
    todos,
    visibilityFilter
});

// initialize store:
const store = redux.createStore(todoApp);

//tests:

const testAddTodo = () => {
    const stateBefore = [];
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    };
    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        }
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);
};

const testToggleTodo = () => {
    const stateBefore = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go Shopping',
            completed: false
        }
    ];
    const action = {
        type: 'TOGGLE_TODO',
        id: 1
    };
    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go Shopping',
            completed: true
        }
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter);

};

testAddTodo();
testToggleTodo();
console.log('all tests passed');

// end tests

// logs:
console.log('Initial state:', store.getState());
console.log('--------------');

console.log('Dispatching ADD_TODO');
store.dispatch({
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
});
console.log('Current state:', store.getState());
console.log('--------------');

console.log('Dispatching ADD_TODO');
store.dispatch({
    type: 'ADD_TODO',
    id: 1,
    text: 'Go Shopping'
});
console.log('Current state:', store.getState());
console.log('--------------');

console.log('Dispatching TOGGLE_TODO');
store.dispatch({
    type: 'TOGGLE_TODO',
    id: 0
});
console.log('Current state:', store.getState());
console.log('--------------');

console.log('Dispatching SET_VISIBILITY_FILTER');
store.dispatch({
    type: 'SET_VISIBILITY_FILTER',
    filter: 'SHOW_COMPLETED'
});
console.log('Current state:', store.getState());
console.log('--------------');