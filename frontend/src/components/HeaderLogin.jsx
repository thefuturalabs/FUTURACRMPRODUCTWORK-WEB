import logo from "../assets/images/logo.svg";
import { Link } from 'react-router';

const HeaderLogin = () => {
    return <div className="fixed top-0 left-0 flex justify-between items-center px-2 md:px-4 text-white h-14 w-screen bg-primary">
        <div>
            <Link to={'/'}>
                <img className="h-10" src={logo} alt="Futura Labs"/>
            </Link>
        </div>
        <div className='support'>
            Support: 0000 00 00 00
        </div>
    </div>
}

export default HeaderLogin