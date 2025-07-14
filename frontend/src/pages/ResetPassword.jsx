import { Fragment, useState } from 'react'
import { Link } from 'react-router'
import HeaderLogin from '../components/HeaderLogin'
import { MdOutlineMessage, MdOutlinePhoneIphone } from 'react-icons/md';

const ResetPassword = () => {

    const [viewSendOTPForm, setViewSendOTPForm] = useState(true);
    const [viewSubmitOTPForm, setViewSubmitOTPForm] = useState(false);
    
    const sendOTP = ()=>{
        setViewSendOTPForm(false);
        setViewSubmitOTPForm(true);
    }

    const resendOTP= ()=>{
        setViewSendOTPForm(true);
        setViewSubmitOTPForm(false);
    }

    return <Fragment>
        <HeaderLogin/>
        <div className="flex mt-14 flex-col sm:flex-row sm:justify-center sm:gap-10 w-screen px-2 md:px-4">
            <div className="w-full flex flex-col items-center">    
                {
                    viewSendOTPForm && <form action={sendOTP} className="w-full md:w-[400px] lg:w-[450px] flex flex-col gap-3 bg-white p-5 rounded-lg mt-10">
                        <h2 className='text-2xl font-medium text-center'>Reset Password</h2>
                        <p className='text-sm text-gray-400 text-center'>You must become a member to reset your password</p>
                        <div className='mt-3 flex flex-col gap-2'>
                            <label htmlFor="number">Enter Number:</label>
                            <div className="flex items-center border-2 border-gray-200 rounded">
                                <div className='ps-3 pr-1'><MdOutlinePhoneIphone /></div>
                                <input type="text" placeholder="xxxx xx xx xx" className="p-2 outline-none bg-white w-full" />
                            </div>
                        </div>
                        <button   className="w-full bg-primary rounded text-white p-2">Send OTP</button>
                    </form>
                }
                {
                    viewSubmitOTPForm && <form action={sendOTP} className="w-full md:w-[400px] lg:w-[450px] flex flex-col gap-3 bg-white p-5 rounded-lg mt-10">
                        <h2 className='text-2xl font-medium text-center'>Reset Password</h2>
                            <p className='text-sm text-gray-400 text-center'>Please enter the OTP sent to your registered mobile number to reset your password</p>
                        <div className='mt-3 flex flex-col gap-2'>
                            <label htmlFor="number">Enter OTP:</label>
                            <div className="flex items-center border-2 border-gray-200 rounded">
                                <div className='ps-3 pr-1'><MdOutlineMessage /></div>
                                <input type="text" placeholder="00-00-00" className="p-2 outline-none bg-white w-full" />
                            </div>
                        </div>
                        <button className="w-full bg-primary rounded text-white p-2">Submit OTP</button>
                        <button onClick={resendOTP} className="w-full bg-primary rounded text-white p-2" type="button">Resend OTP</button>
                    </form>
                }
            </div>
        </div>    
        <div className="text-center mt-3">
            <Link to={'/'} className='link-primary text-center d-block pt-2'>
                Back to login
            </Link>
        </div>
    </Fragment>
}

export default ResetPassword