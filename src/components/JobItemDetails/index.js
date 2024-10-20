import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {RiSuitcaseFill} from 'react-icons/ri'
import Header from '../Header'

import './index.css'

class JobItemDetails extends Component {
  state = {
    jobDetails: [],
    similarJobs: [],
    isLoading: true,
    fetching: true,
  }

  componentDidMount() {
    this.getjobDetails()
  }

  getjobDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const data1 = data.job_details
      const updatedJobDetails = {
        companyLogoUrl: data1.company_logo_url,
        companyWebsiteUrl: data1.company_website_url,
        employmentType: data1.employment_type,
        id: data1.id,
        jobDescription: data1.job_description,
        skills: data1.skills.map(each => ({
          imageUrl: each.image_url,
          name: each.name,
        })),
        lifeAtCompany: {
          description: data1.life_at_company.description,
          imageUrl: data1.life_at_company.image_url,
        },
        location: data1.location,
        packagePerAnnum: data1.package_per_annnum,
        rating: data1.rating,
      }
      const data3 = data.similar_jobs
      const updatedSimiliarJobs = data3.map(data2 => ({
        companyLogoUrl: data2.company_logo_url,
        employmentType: data2.employment_type,
        id: data2.id,
        jobDescription: data2.job_description,
        location: data2.location,
        rating: data2.rating,
        title: data2.title,
      }))
      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimiliarJobs,
        isLoading: false,
      })
    } else {
      this.setState({fetching: false})
    }
  }

  jobSkills = () => {
    const {jobDetails} = this.state
    const {skills} = jobDetails
    return (
      <>
        <h1> Skills</h1>
        <div className="skills">
          {skills.map(each => (
            <li key={each.name}>
              <div className="skill">
                <img src={each.imageUrl} alt={each.name} />
                <p>{each.name}</p>
              </div>
            </li>
          ))}
        </div>
      </>
    )
  }

  jobSection = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
      lifeAtCompany,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job">
        <div className="job-img">
          <img src={companyLogoUrl} alt="job details company logo" />
          <div>
            <p className="job-title">{title}</p>
            <div className="rating-container">
              <FaStar className="rating-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>

        <div className="job-details">
          <div className="flex">
            <MdLocationOn /> <p className="location">{location}</p>
            <RiSuitcaseFill />
            <p className="internship">{employmentType}</p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="space-between">
          <p className="description">Description</p>
          <a href={companyWebsiteUrl} target="_self" className="visit">
            Visit =>
          </a>
        </div>
        <p>{jobDescription}</p>
        {this.jobSkills()}
        <div className="company-life-container">
          <div className="company-description">
            <h1 className="company-life">Life at Company</h1>
            <p>{description}</p>
          </div>
          <img src={imageUrl} alt="life at company" />
        </div>
      </div>
    )
  }

  similarJobsSection = () => {
    const {similarJobs} = this.state

    return (
      <>
        <h1 className="similarjobs-title">Similar Jobs</h1>
        <div className="similar-jobs-container">
          {similarJobs.map(each => (
            <li key={each.id}>
              <div className="similar-jobs">
                <div className="job-img">
                   <img src={each.companyLogoUrl} 
                   alt="similar job company logo" />
                  <div>
                     <h1 className="job-title">{each.title}</h1>
                    <div className="rating-container">
                      <FaStar className="rating-icon" />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <p className="description">Description</p>
                <p>{each.jobDescription}</p>
                <div className="job-details bottom">
                  <div className="flex">
                    <MdLocationOn /> <p className="location">{each.location}</p>
                    <RiSuitcaseFill />
                    <p className="internship">{each.employmentType}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
         
        </div>
      </>
    )
  }

  failureview = () => ( 
    <div className="failureview">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button className="retry-btn" onClick={this.getjobDetails}>Retry</button>
      </div>
  )
  
   
 
  isLoading = () => (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  
  successView = () => (
      <>
        {this.jobSection()}
        {this.similarJobsSection()}
      </>
    )
  
  finalrender = () => {
    const {fetching} = this.state
    return fetching ? this.successView() : this.failureview()
  }
  render() {
    const {isLoading} = this.state
    return (
      <>
        <Header />
        <div className="similarjobs-main">
          {isLoading ? this.isLoading() : this.finalrender()}
        </div>
      </>
    )
  }
}
export default JobItemDetails
