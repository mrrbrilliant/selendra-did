import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const [open, setOpne] = useState(false);
  const toggle = () => {
    setOpne(!open);
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
    <div>
      <header className="lg:px-72 bg-white sm:flex sm:items-center sm:justify-between flex justify-between items-center">
        <div
          className={!open ? "flex px-4 py-3 " : "px-4 py-4"}
          //   className="flex px-4 py-3"
        >
          <div className="block sm:flex">
            <button
              onClick={toggle}
              className="px-2 focus:outline-none hover:text-white focus:text-white sm:hidden py-2"
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
          <div className="flex justify-between items-center ">
            <div className="flex justify-center text-center items-center sm:mr-10">
              <img
                //   className="h-8 w-auto"
                className={open ? "hidden sm:flex" : "h-8 w-auto rounded-full "}
                src="/images/Primary_Logo_V1.png"
              />
              <h1
                className={open ? "hidden sm:flex" : "text-md font-bold ml-2 "}
                // className="text-md font-bold ml-2"
              >
                StudentID
              </h1>
            </div>
            <div
              className={open ? "cursor-pointer block sm:" : "hidden sm:flex"}
            >
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <p
                    className={classNames(
                      router.pathname == `${item.href}`
                        ? "bg-gray-900 text-white"
                        : "text-accent  hover:bg-gray-700 hover:text-white",
                      "px-3 py-2 rounded-md text-sm font-semibold sm:ml-2 cursor-pointer"
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
        <div>
          <nav className="sm:flex sm:items-center sm:px-4 ">
            <div className="px-2 pt-2 pb-5 sm:flex sm:border-b-0 sm:py-0">
              <div className="form-control hidden lg:block pr-3">
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
            </div>
            <div
              //   className={!open ? "flex px-4 py-3" : "px-4 py-4"}
              className="dropdown dropdown-end -mt-12 px-3 sm:mt-0 sm:px-0"
            >
              <label tabindex="0" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    className={open ? "hidden " : "block"}
                    src="https://api.lorem.space/image/face?hash=33791"
                  />
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
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
