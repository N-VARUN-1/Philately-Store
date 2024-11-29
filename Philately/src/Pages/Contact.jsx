import React from 'react'

export default function About() {
  return (
    <>
      <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div className="animate__animated animate__heartBeat animate__repeat-1">
          <h1 className='text-3xl font font-semibold text-center my-7'>
            To Contact us:
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <h2>
                <a className='text-blue-500' href="">philatelystoreindia@gmail.com</a>
            </h2>
            <h2 className='text-blue-500'>
                +91 9193939448
            </h2>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
