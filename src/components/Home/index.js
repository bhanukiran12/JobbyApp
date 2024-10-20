import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="home-container">
          <div className="home-details">
            <h1>Find The Job That Fits Your Life</h1>
            <p>
              Millions of people are searching for jobs,salary
              information,company reviews.Find the Job that fits your abilites
              and potential
            </p>
            <Link to="/jobs">
              <button type="button" className="jobs-btn">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </>
    )
  }
}
export default Home
