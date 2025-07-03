import "./login.css"
import assets from "../../assets/assets.js"
import { useState } from "react"
import { signup, login } from '../../firebase-config/firebase.js'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!isLogin && !userName.trim()) {
      alert('Please enter a username')
      return
    }
    if (!email.trim() || !password.trim()) {
      alert('Please fill in all fields')
      return
    }

    if (isLogin) {
      await login(email, password)
    } else {
      await signup(email, userName, password)
    }
  }

  return (
    <div className="log-in-form">
      <div className="form-container">
        <div className="form-img">
          <img src={assets.log_in} alt="Login background" />
        </div>
        <div className="form-input">
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <form className="form" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Username"
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <br />
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Create one' : 'Login here'}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login