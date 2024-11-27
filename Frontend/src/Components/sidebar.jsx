"use client";

import { Sidebar } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Correctly import useNavigate from react-router-dom
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";

export default function Component() {
  const [signIn, setSignIn] = useState(false);
  const navigate = useNavigate(); // Correctly initialize navigate

  const handleSignIn = () => {
    setSignIn(true);
    navigate('/signin'); // Use navigate function to redirect
  } 

  return (
    <div className="min-h-screen shadow-4xl rounded-lg"> {/* Ensures the parent div takes full screen height */}
      <Sidebar aria-label="Default sidebar example" className="h-full"> {/* Sidebar will stretch the entire height */}
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="#" icon={HiInbox} label="3">
              Inbox
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiUser}>
              Users
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiShoppingBag}>
              Products
            </Sidebar.Item>
            <Sidebar.Collapse icon={HiViewBoards} label="List New Items">
              <Sidebar.Item href="#">Current Listing</Sidebar.Item>
              <Sidebar.Item href="#">Schedule listing</Sidebar.Item>
            </Sidebar.Collapse>
            <Sidebar.Item href="/signin" icon={HiArrowSmRight} onClick={handleSignIn}> {/* Changed onChange to onClick */}
              Sign In
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiTable}>
              Sign Up
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}