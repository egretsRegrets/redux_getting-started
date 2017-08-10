const expect = require('expect');
const deepFreeze = require('deep-freeze');

const toggleTodo = (todo) => {
    /**
     * mutable version
     * todo.completed = !todo.completed;
     * return todo;
     */
    
     /**
      * with Objeect.assign(), the last source,
      * from left to right, overrides the properties of
      * sources before it, where discrepancies occur.
      */
    return Object.assign({}, todo, {
        completed: !todo.completed
    });
    /**
     *  we can also use the newer object spread operator
     * available in babel, stage 2 preset or greater.
     * return {
     *  ...todo,
     * completed: !todo.completed
     * };
    */
};

const testToggleTodo = () => {
    const todoBefore = {
        id: 0,
        text: 'Learn Redux',
        completed: false
    };
    const todoAfter = {
        id: 0,
        text: 'Learn Redux',
        completed: true
    };

    deepFreeze(todoBefore);
    
    expect(
        toggleTodo(todoBefore)
    ).toEqual(todoAfter);
};

testToggleTodo();
console.log('all tests passed');