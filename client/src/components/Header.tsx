import { Link, useNavigate } from "react-router-dom"
import { useAppContext } from "../context/Appcontext"
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {
  const {userData, backendUrl, setUserData, setIsLoggedin} = useAppContext();
  const navigate = useNavigate();

  
  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl+'/api/auth/logout');
      data.success && setIsLoggedin(false);
      data.success && setUserData(null);
      navigate('/'); 
    } catch (error : any) {
      toast.error(error.message)
    }
  }

  return (
    <header className="header" >
      {/* <h2 className="icon">ICON</h2> */}
      <nav className="nav-bar">
        {/* <a href="#">HOME</a> */}
        <Link to='/' className="nav-link">HOME</Link>
        <div className="logo-box">
          <span className="logo-left-text" > MERN </span>
          <span className="logo-right-text" > AUTH </span>
        </div>
        {/* <a href="#">LOGIN</a> */}
        {userData? <div className="logout-button" onClick={handleLogout} > Logout </div> 
        : <Link to='/login' className="nav-link">LOGIN</Link>}
      </nav> 
    </header>
  )
}

export default Header