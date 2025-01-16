import React, { useState } from 'react'

    function App() {
      const totalTokens = 70000000
      const [usedTokens, setUsedTokens] = useState(0)
      const remainingTokens = totalTokens - usedTokens

      return (
        <div className="container">
          <h1>Token Tracker</h1>
          <div className="token-display">
            <p>Total Tokens: {totalTokens.toLocaleString()}</p>
            <p>Used Tokens: {usedTokens.toLocaleString()}</p>
            <p>Remaining Tokens: {remainingTokens.toLocaleString()}</p>
          </div>
          <input
            type="number"
            value={usedTokens}
            onChange={(e) => setUsedTokens(Number(e.target.value))}
            placeholder="Enter used tokens"
          />
        </div>
      )
    }

    export default App
