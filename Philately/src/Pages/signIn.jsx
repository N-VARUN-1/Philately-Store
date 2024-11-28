
import React from "react";

const OptionPage = () => {
  return (
    <div className="flex h-screen">
      {/* Left Section - Postal Circle Admin */}
      <div className=" flex-1 bg-blue-800 text-white flex flex-col justify-evenly items-center ">
        <img className='animate__animated animate__fadeInLeft animate__fast' size="small" src="/src/images/signinPage/adminPage.png" />
        <h2 className="animate__animated animate__fadeInLeft animate__fast text-4xl font-semibold">Postal Circle Admin</h2>
        <div className="animate__animated animate__fadeInLeft animate__fast flex flex-col justify-center items-center">
          <p className="text-lg mb-6 text-center max-w-md">
            Manage postal routes, track mail delivery schedules, and handle administrative tasks for postal services.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => (window.location.href = "/admin-signin")}
              className="px-6 py-3 bg-white text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition"
            >
              Sign In as Admin
            </button>
            <button
              onClick={() => (window.location.href = "/admin-signup")}
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-800 transition"
            >
              Sign Up as Admin
            </button>
          </div>
        </div>
      </div>

      {/* Right Section - Philatelist User */}
      <div className=" animate__fast flex-1 bg-green-700 text-white flex flex-col justify-evenly items-center">
        <img className='animate__animated animate__fadeInRight' src="/src/images/signinPage/userPage.png" />
        <h2 className="animate__animated animate__fadeInRight text-4xl font-semibold">Philatelist User</h2>
        <div className="animate__animated animate__fadeInRight flex flex-col justify-center items-center">         
          <p className="text-lg mb-6 text-center max-w-md">
            Explore collectible stamps, manage your collection, and connect with other philatelists in our community.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => (window.location.href = "/user-signin")}
              className="px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-200 transition"
            >
              Sign In as Philatelist
            </button>
            <button
              onClick={() => (window.location.href = "/user-signup")}
              className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-700 transition"
            >
              Sign Up as Philatelist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionPage;















