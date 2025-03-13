import { AxiosError } from "axios";
import apiClient from "../services/apiClient.ts";
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ErrorResponse {
  error: string;
  retryAfter?: number;
}

const CouponCard = () => {
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setLoading(true)
    const lastClaimCookie = Number(Cookies.get('last_claim'));

    // Client-side check
    if (lastClaimCookie && (Date.now() - lastClaimCookie < 3600000)) {
      setLoading(false)
      const remaining = Math.ceil((3600000 - (Date.now() - lastClaimCookie)) / 60000);
      toast(`Wait ${remaining} minutes! ⏳`);
      return;
    }

    try {
      const res = await apiClient.get('/claimCoupon'); 
      if (res.data.coupon) {
        setLoading(false)
        setCoupon(res.data.coupon.code);
        toast(`Your coupon code is ${res.data.coupon.code}`);
      } else {
        setLoading(false)
        toast(`${res.data.error}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setLoading(false)
      if (axiosError.response) {
        
        const { status, data } = axiosError.response;
        const errorData = data as ErrorResponse;
        if (status === 429) {
          toast(`Error: ${errorData.error}\nPlease retry after ${errorData.retryAfter} seconds.`);
        }
        else if(status === 404){
          toast(`No coupons Left !`);
        }
        else {
          toast(`Unexpected error: ${errorData.error || axiosError.message}`);
        }
      } else {
        toast(`Network or unexpected error: ${axiosError.message}`);
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-gradient-to-tl from-[#97ebf3] to-[#271bab] min-h-screen relative flex flex-col justify-center items-center p-4">

        <div className="absolute bg-gradient-to-br from-[#074b51] to-[#01212E] md:left-8 md:top-7 md:rounded-full w-full h-[20vh] top-0 left-0 md:size-72 flex items-center justify-center text-white p-4">
          <h1>Note: Backend is deployed on <span className="font-bold">render(free-tier)</span>, the server will take upto <span className="font-bold">20-30</span> seconds to boot up, Please Wait... </h1>
        </div>


        <h1 className="text-4xl md:text-5xl txt text-white mb-8 ">
          FAIRSHARE
        </h1>

        <div className="grad backdrop-blur-sm rounded-lg shadow-2xl p-6 w-full max-w-md">
          <div className="uppercase text-white text-2xl md:text-3xl font-bold text-center mb-6">
            CLAIM COUPON
          </div>

          <div className="relative w-[60%] h-48 bg-white/50 rounded-xl overflow-hidden flex items-center justify-center">
          {loading && <Loader2 className="animate-spin"/>}
            {coupon && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 text-black text-2xl md:text-3xl font-bold tracking-tighter p-4">
                {coupon}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">

          <button onClick={handleClaim} className=" uppercase bg-white rounded-full text-[#00292d] md:px-28 px-12 font-bold text-2xl py-2"><div className="primary">CLAIM</div><div className="sec">CLAIM</div></button>
         
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponCard;