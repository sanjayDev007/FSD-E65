import React from 'react'
import ComA from './components/ComA'
import store from './store/store'
import { Provider } from 'react-redux'
function App() {
  return (
   <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <Provider store={store}>
      <ComA/>
      </Provider>
    </div>
   </div>
  )
}
export default App