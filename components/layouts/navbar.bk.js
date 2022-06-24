import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!open);
  };

  const navigation = [
    { name: "MyDocuments", href: "/digidocs" },
    { name: "Organization", href: "/organizations1" },
    { name: "Contacts", href: "/contacts" },
    // { name: "Credentails", href: "/ctypes/index1" },
    // { name: "Create Credentails", href: "/ctypes/create1" },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const router = useRouter();
  return (
    <header className=" bg-white px-3 py-2 lg:px-72 sm:p-2 lg:flex flex justify-between items-center lg:items-center lg:justify-between">
      <div>
        <div className="lg:hidden flex">
          <div>
            <button
              onClick={toggle}
              className="focus:outline-none hover:text-white focus:text-white lg:hidden "
            >
              <svg
                className="h-6 w-6 fill-current text-gray-500 "
                viewBox="0 0 24 24"
              >
                {open ? (
                  <path d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
                )}
              </svg>
            </button>
          </div>
          <div>
            <p className="text-xl font-bold text-center -mt-1 ml-5">
              StudentID
            </p>
          </div>
        </div>
        <div className={open ? "block lg:hidden" : "hidden lg:block"}>
          <div className="lg:flex">
            <p className="text-xl font-bold py-1 mr-16 sm:block hidden">
              StudentID
            </p>
            <div className="sm:flex cursor-pointer">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <p
                    className={classNames(
                      router.pathname == `${item.href}`
                        ? "bg-gray-900 text-white"
                        : "text-accent  hover:bg-gray-700 hover:text-white",
                      "px-3 py-2 rounded-md text-sm font-semibold sm:ml-2"
                    )}
                    aria-current={
                      router.pathname == `${item.href}` ? "page" : undefined
                    }
                  >
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="lg:flex lg:gap-2">
        <div className="form-control hidden lg:block">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered"
          />
        </div>
        <div className="hidden lg:block">
          <button className="bg-primarypink w-32 p-3 flex justify-center rounded-md">
            {/* <center> */}
            <img className="w-6" src="/images/log-out.png" />
            <h1 className="pl-2 font-semibold text-gray-50">LEAVE</h1>
            {/* </center> */}
          </button>
        </div>
        <div className="dropdown dropdown-end ">
          <label tabindex="0" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://api.lorem.space/image/face?hash=33791" />
            </div>
          </label>
          <ul
            tabindex="0"
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 filter backdrop-blur-2xl backdrop-brightness-50"
          >
            <li>
              <Link href="/" className="justify-between">
                Profile
              </Link>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
