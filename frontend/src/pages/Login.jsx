import { Link } from 'react-router';
import HeaderLogin from '../components/HeaderLogin';
import { Fragment } from 'react';
import { MdOutlineLock, MdOutlinePhoneIphone } from "react-icons/md"

const Login = () => {

    const handleLogin = () => {

    }

    return <Fragment>
        <HeaderLogin/>
        <div className="flex mt-14 flex-col sm:flex-row sm:justify-center sm:gap-10 w-screen px-2 md:px-4">
            <div className="w-full flex flex-col items-center">    
                <form action={handleLogin} className="w-full md:w-[400px] lg:w-[450px] flex flex-col gap-3 bg-white p-5 rounded-lg mt-10">
                    <h2 className='text-2xl font-medium text-center'>Sign In Access</h2>
                    <p className='text-sm text-gray-400 text-center'>You must become a member to login and access the entire site</p>
                    <div className='mt-3 flex flex-col gap-2'>
                        <label htmlFor="number">Enter Number:</label>
                        <div className="flex items-center border-2 border-gray-200 rounded">
                            <div className='ps-3 pr-1'><MdOutlinePhoneIphone /></div>
                            <input type="text" placeholder="xxxx xx xx xx" className="p-2 outline-none bg-white w-full"/>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="password">Enter Password:</label>
                        <div className="flex items-center border-2 border-gray-200 rounded">
                            <div className='ps-3 pr-1'><MdOutlineLock /></div>
                            <input type="password" placeholder="xxxxxxxx" className="p-2 outline-none bg-white w-full"/>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-primary rounded text-white p-2">Login</button>
                    <div className="w-full text-center">
                        <Link to={"/password/reset"} className="text-primary">
                            Forgot password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </Fragment>
}

export default Login