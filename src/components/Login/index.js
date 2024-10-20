import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorStatus: false,
    errormsg: '',
  }

  usernameHandler = event => {
    this.setState({username: event.target.value})
  }

  passwordHandler = event => {
    this.setState({password: event.target.value})
  }

  successHandler = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  loginRequest = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      Headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    console.log(username, password)
    if (data.jwt_token !== undefined) {
      this.successHandler(data.jwt_token)
    } else {
      this.setState({errormsg: data.error_msg, errorStatus: true})
    }
  }

  formElement = () => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    const {errorStatus, errormsg, username, password} = this.state
    return (
      <form className="form-container" onSubmit={this.loginRequest}>
        <label htmlFor="username">username</label>
        <input
          type="text"
          id="username"
          className="username"
          placeholder="username"
          value={username}
          onChange={this.usernameHandler}
        />
        <label htmlFor="password">password</label>
        <input
          type="password"
          className="password"
          id="password"
          placeholder="password"
          value={password}
          onChange={this.passwordHandler}
        />
        <button type="submit" className="login-btn">
          Login
        </button>
        {errorStatus && <p className="error_msg">*{errormsg}</p>}
      </form>
    )
  }

  render() {
    return (
      <div className="login-container">
        <div className="login">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          {this.formElement()}
        </div>
        <p className="login-info">username:rahul</p>
        <p className="login-info">password:rahul@2021</p>
      </div>
    )
  }
}

export default Login
