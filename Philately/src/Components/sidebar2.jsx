"use client";

import { Button, Card } from "flowbite-react";

export default function NotificationSidebar() {
  return (
    <div className="w-72 flex flex-col gap-3 p-2"> {/* Reduced width to w-72 */}
      <Card 
        className="w-full flex items-center shadow-2xl bg-gray-800 rounded-lg"
      >
        <h5 className="text-lg font-bold tracking-tight text-white">
          Notifications
        </h5>
      </Card>
      
      <Card 
        className="w-full shadow-2xl bg-yellow-200 rounded-lg 
        transition duration-300 ease-in-out 
        hover:shadow-xl hover:scale-105 transform"
      >
        <div className="space-y-4">
          <h4 className="text-lg font-bold tracking-tight text-gray-900">
            Cancellation Releases
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            Post Office Circles have announced the cancellation of certain scheduled releases. Please check your inbox for details on affected services and new timelines.
          </p>
          <Button 
            size="sm" 
            className="w-full flex justify-center items-center"
          >
            Read more
            <svg 
              className="-mr-1 ml-2 h-4 w-4" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </Card>
      
      <Card 
        className="w-full shadow-2xl bg-yellow-200 rounded-lg 
        transition duration-300 ease-in-out 
        hover:shadow-xl hover:scale-105 transform"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            The Delhi Post Office Circle has announced the cancellation of upcoming scheduled releases. Please refer to the official communication for details on affected services and revised timelines.
          </p>
          <Button 
            size="sm" 
            className="w-full flex justify-center items-center"
          >
            Read more
            <svg 
              className="-mr-1 ml-2 h-4 w-4" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </Card>
    </div>
  );
}