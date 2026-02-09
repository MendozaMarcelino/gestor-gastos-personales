import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes/AppRouter'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  const [user, setUser] = useState<string | null>(null)

  const handleLogin = (username: string) => {
    setUser(username)
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <BrowserRouter>
      <AppRouter user={user} onLogin={handleLogin} onLogout={handleLogout} />
    </BrowserRouter>
  )
}

export default App
