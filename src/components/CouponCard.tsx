import { AxiosError } from "axios";
import apiClient from "../services/apiClient.ts";
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";

interface ErrorResponse {
  error: string;
  retryAfter?: number;
}

const CouponCard = () => {
  const [coupon, setCoupon] = useState('');

  const handleClaim = async () => {
    const lastClaimCookie = Number(Cookies.get('last_claim'));

    // Client-side check
    if (lastClaimCookie && (Date.now() - lastClaimCookie < 3600000)) {
      const remaining = Math.ceil((3600000 - (Date.now() - lastClaimCookie)) / 60000);
      toast(`Wait ${remaining} minutes! ⏳`);
      return;
    }

    try {
      const res = await apiClient.get(`${import.meta.env.VITE_API_URL}/claimCoupon`);
      if (res.data.coupon) {
        setCoupon(res.data.coupon.code);
        toast(`Your coupon code is ${res.data.coupon.code}`);
      } else {
        toast(`${res.data.error}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        const { status, data } = axiosError.response;
        const errorData = data as ErrorResponse;
        if (status === 429) {
          toast(`Error: ${errorData.error}\nPlease retry after ${errorData.retryAfter} seconds.`);
        } else {
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

      <div className="bg-gradient-to-tl from-[#97ebf3] to-[#271bab] min-h-screen flex flex-col justify-center items-center p-4">
        <h1 className="text-4xl md:text-5xl txt text-white mb-8 ">
          FAIRSHARE
        </h1>

        <div className="grad backdrop-blur-sm rounded-lg shadow-2xl p-6 w-full max-w-md">
          <div className="uppercase text-white text-2xl md:text-3xl font-bold text-center mb-6">
            CLAIM COUPON
          </div>

          <div className="relative w-[60%] h-48 bg-white/50 rounded-xl overflow-hidden flex items-center justify-center">
            {coupon && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 text-black text-2xl md:text-3xl font-bold tracking-tighter p-4">
                {coupon}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">

          <button onClick={handleClaim} className=" uppercase bg-white rounded-full text-[#00292d] px-28 font-bold text-2xl py-2"><div className="primary">CLAIM</div><div className="sec">CLAIM</div></button>
         
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponCard;