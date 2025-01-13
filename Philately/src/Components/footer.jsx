
"use client";
import React from "react";
import { Footer } from "flowbite-react";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";

export default function Component() {
  return (
    <Footer className=" border rounded-lg">
      <div className="w-full">
        <div className="grid w-full grid-cols-2 gap-8 px-6 py-8 md:grid-cols-4">
          <div>
            <Footer.Title title="Company" />
            <Footer.LinkGroup col>
              <Footer.Link href="/aboutPhilatelyStore">About</Footer.Link>
            </Footer.LinkGroup>
          </div>
          <div>
            <Footer.Title title="help center" />
            <Footer.LinkGroup col>
              <Footer.Link href="/contactPhilatelyStore">Contact Us</Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>
        <div className="w-full border px-4 py-6 sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="Philately Store™" year={2024} />
        </div>
      </div>
    </Footer>
  );
}
