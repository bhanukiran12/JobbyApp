import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Header extends Component {
  logOutHandler = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    return (
      <div className="header">
        <Link to="/">
          <li>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </li>
        </Link>
        <ul className="nav-items">
          <Link to="/" className="no-line">
            <li>Home</li>
          </Link>
          <Link to="/jobs" className="no-line">
            <li>Jobs</li>
          </Link>
          <Link to="/about" className="no-line">
            <li>About</li>
          </Link>
        </ul>
        <li>
          <button type="button" className="logout" onClick={this.logOutHandler}>
            Logout
          </button>
        </li>
      </div>
    )
  }
}

export default withRouter(Header)
