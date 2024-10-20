import {Switch, Redirect, Route} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import Jobs from './components/Jobs'
import About from './components/About'
import JobItemDetails from './components/JobItemDetails'
import NotFound from './components/NotFound'
import Login from './components/Login'
import './App.css'

const App = () => (
  <Switch>
    <ProtectedRoute exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/about" component={About} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
    <ProtectedRoute exact path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
