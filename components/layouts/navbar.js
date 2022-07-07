import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
const Navbar = () => {
  const navigation = [
    { name: "MyDocuments", href: "/documents" },
    { name: "Organization", href: "/organizations" },
    { name: "Contacts", href: "/contacts" },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const router = useRouter();
  return (
    <div className="navbar bg-base-100 px-72">
      <div className="flex-1">
        <Link href="/">
          <a className="btn btn-ghost normal-case text-xl">StudentID</a>
        </Link>
        <div className="flex space-x-4 pl-16">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <a
                className={classNames(
                  router.pathname == `${item.href}`
                    ? "bg-gray-900 text-white"
                    : "text-base-content  hover:bg-gray-700 hover:text-white",
                  "px-3 py-2 rounded-md text-sm font-semibold"
                )}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input type="text" placeholder="Search" className="input input-bordered" />
        </div>
        <div>
          <button className="btn btn-error flex justify-center rounded-md">
            <img className="w-6" src="/images/log-out.png" />
            <h1 className="pl-2 font-semibold text-gray-50">LEAVE</h1>
          </button>
        </div>
        <div className="dropdown dropdown-end">
          <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://api.lorem.space/image/face?hash=33791" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className=" mt-3 dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-52 backdrop-blur-md bg-opacity-90"
          >
            <li>
              <a>Profile</a>
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
