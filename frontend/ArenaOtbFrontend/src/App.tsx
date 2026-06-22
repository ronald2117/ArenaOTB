import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <>
        <div className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">My App</h1>
        <p className="text-lg">Count: {count}</p>
        <button className="bg-white text-blue-500 hover:bg-gray-200 py-2 px-4 rounded" onClick={() => setCount(count + 1)}>
          Increment
        </button>
      </div>
      </>
  )
}

export default App
