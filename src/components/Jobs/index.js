import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {RiSuitcaseFill} from 'react-icons/ri'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profile: [],
    isProfileLoading: true,
    employmentType: [],
    salary: '',
    searchInput: '',
    jobs: [],
    isJobsLoading: true,
    fetchingProfile: true,
    fetchingJob: true,
  }
  componentDidMount() {
    this.getProfileDetatils()
    this.getJobDetails()
  }
  getProfileDetatils = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({isProfileLoading: true})
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()

      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profile: updatedData,
        isProfileLoading: false,
        fetchingProfile: true,
      })
    } else {
      this.setState({fetchingProfile: false})
    }
  }
  getJobDetails = async () => {
    const {employmentType, salary, searchInput} = this.state
    this.setState({isJobsLoading: true})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }

    const employment = employmentType.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employment}&minimum_package=${salary}&search=${searchInput}`
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    console.log(data)
    if (response.ok) {
      const updatedData = data.jobs.map(item => ({
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        id: item.id,
        jobDescription: item.job_description,
        location: item.location,
        packagePerAnnum: item.package_per_annum,
        rating: item.rating,
        title: item.title,
      }))
      this.setState({
        jobs: updatedData,
        isJobsLoading: false,
        fetchingJob: true,
      })
    } else {
      this.setState({fetchingJob: false})
    }
  }
  handleEmploymentType = (event, id) => {
    const {employmentType} = this.state

    if (event.target.checked) {
      if (employmentType.length === 0) {
        this.setState({employmentType: [id]}, this.getJobDetails)
      } else {
        this.setState(
          prevState => ({
            employmentType: [...prevState.employmentType, id],
          }),
          this.getJobDetails,
        )
      }
    } else {
      this.setState(
        prevState => ({
          employmentType: prevState.employmentType.filter(each => each !== id),
        }),
        this.getJobDetails,
      )
    }
  }
  handleSalary = event => {
    this.setState({salary: event.target.value}, this.getJobDetails)
  }

  handleSearchbar = event => {
    this.setState({searchInput: event.target.value})
  }
  isLoading = () => {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }
  profileRendering = () => {
    const {isProfileLoading, profile} = this.state
    const {name, profileImageUrl, shortBio} = profile
    return isProfileLoading ? (
      this.isLoading()
    ) : (
      <div className="profile">
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }
  employmentFilter = () => {
    return (
      <div>
        <hr />
        <h1 className="filter-heading">Type of employment</h1>
        <ul>
          {employmentTypesList.map(each => (
            <li key={each.employmentTypeId}>
              <input
                type="checkbox"
                id={each.employmentTypeId}
                onChange={event =>
                  this.handleEmploymentType(event, each.employmentTypeId)
                }
              />
              <label>{each.label}</label>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  salaryFilter = () => {
    const {salary} = this.state
    return (
      <div>
        <hr />
        <h1 className="filter-heading">Salary Range</h1>
        <ul>
          {salaryRangesList.map(each => (
            <li key={each.salaryRangeId}>
              <input
                type="radio"
                id={each.salaryRangeId}
                value={each.salaryRangeId}
                checked={salary === each.salaryRangeId}
                onChange={this.handleSalary}
              />
              <label>{each.label}</label>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  searchBar = () => {
    return (
      <div className="searchbar ">
        <input
          type="search"
          className="search"
          placeholder="search"
          onChange={this.handleSearchbar}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-button"
          onClick={this.getJobDetails}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }
  jobsSection = () => {
    const {jobs} = this.state
    return (
      <>
        {this.searchBar()}
        {jobs.map(each => (
          <Link to={`/jobs/${each.id}`} className="link">
            <li key={each.id}>
              <div className="jobs">
                <div className="job-img">
                  <img src={each.companyLogoUrl} alt="company logo" />
                  <div>
                    <h1 className="job-title">{each.title}</h1>
                    <div className="rating-container">
                      <FaStar className="rating-icon" />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>

                <div className="job-details">
                  <div className="flex">
                    <MdLocationOn /> <p className="location">{each.location}</p>
                    <RiSuitcaseFill />
                    <p className="internship">{each.employmentType}</p>
                  </div>
                  <p>{each.packagePerAnnum}</p>
                </div>
                <hr />
                <h1 className="description">Description</h1>
                <p>{each.jobDescription}</p>
              </div>
            </li>
          </Link>
        ))}
      </>
    )
  }
  noJobsFoundView = () => {
    return (
      <>
        {this.searchBar()}
        <div className="flex-col">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not dind any jobs.Try other filters</p>
        </div>
      </>
    )
  }
  jobsRendering = () => {
    const {isJobsLoading, jobs} = this.state
    if (isJobsLoading === true) {
      return this.isLoading()
    } else if (jobs.length === 0) {
      return this.noJobsFoundView()
    } else {
      return this.jobsSection()
    }
  }

  failureProfileView = () => (
    <div className="flex-col">
      <button className="retry-btn" onClick={this.getProfileDetatils}>
        Retry
      </button>
      {this.employmentFilter()}
      {this.salaryFilter()}
    </div>
  )
  failureJobView = () => {
    return (
      <>
        {this.searchBar()}
        <div className="flex-col">
          <img
            src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
            alt="failure view"
            className="failure-img"
          />
          <h1>OOPS! Something Went Wrong</h1>
          <p>We cannot seem to find the page you are looking for</p>
          <button className="retry-btn" onClick={this.getJobDetails}>
            Retry
          </button>
        </div>
      </>
    )
  }
  profileSucessView = () => {
    return (
      <>
        {this.profileRendering()}
        {this.employmentFilter()}
        {this.salaryFilter()}
      </>
    )
  }
  render() {
    const {fetchingProfile, fetchingJob} = this.state
    return (
      <>
        <Header />
        <div className="jobs-main">
          <div className="jobs-part1">
            {fetchingProfile
              ? this.profileSucessView()
              : this.failureProfileView()}
          </div>
          <div className="jobs-part2">
            {fetchingJob ? this.jobsRendering() : this.failureJobView()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
