import { legacy_createStore } from 'redux';

 let initialValue = {
    count: 0
}
function countReducer(prevState = initialValue, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { ...prevState, count: prevState.count + 1 };
        case 'DECREMENT':
            return { ...prevState, count: prevState.count - 1 };
        default:
            console.log("No action matched, returning previous state");
    }
    return prevState;
}

const store = legacy_createStore(countReducer);

export default store;