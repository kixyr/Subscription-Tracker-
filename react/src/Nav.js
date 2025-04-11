import { Link } from "react-router-dom";

const Nav = () =>{
  return(
    <nav>
      <div className='navbar'>
        <h1>Subsciption Tracker</h1>
        <div className='navbar-links'>
          <Link to='/'>Subscriptions</Link>
          <Link to='/reports'>Reports</Link>
          <Link to='/calender'>Calender</Link>
        </div> 

      </div>


    </nav>
  )
}
export default Nav;