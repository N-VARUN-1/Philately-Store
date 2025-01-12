import React from 'react'

export default function About() {
  return (
    <>
      <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div className="animate__animated animate__heartBeat animate__repeat-1">
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About Philately Store
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to Philately Store! This is not just a store, this is our community of Philatelists all over india. 
              We aim to provide a seamless service to the Users(Philatelists) as well as Indian postal circles to ensure customer satisfaction and feasibility 
            </p>

            <p>
              On this community, you'll find weekly articles and new releases of philatelic materials all over india
            </p>

            <p>
              We believe that a community of Clever minds can help
              each other grow and improve and hope to the Users for best possible access to the Store.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
