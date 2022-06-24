import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
const Navbar = () => {
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
    <div className="navbar bg-white px-72">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">StudentID</a>
        <div className="flex space-x-4 pl-16">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <a
                className={classNames(
                  router.pathname == `${item.href}`
                    ? "bg-gray-900 text-white"
                    : "text-accent  hover:bg-gray-700 hover:text-white",
                  "px-3 py-2 rounded-md text-sm font-semibold"
                )}
                aria-current={
                  router.pathname == `${item.href}` ? "page" : undefined
                }
              >
                {item.name}
              </a>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered"
          />
        </div>
        <div>
          <button className="bg-primarypink w-32 p-3 flex justify-center rounded-md">
            {/* <center> */}
            <img className="w-6" src="/images/log-out.png" />
            <h1 className="pl-2 font-semibold text-gray-50">LEAVE</h1>
            {/* </center> */}
          </button>
        </div>
        <div className="dropdown dropdown-end">
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
    </div>
  );
};

export default Navbar;
