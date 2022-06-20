import React from "react";

const Navbar = () => {
  return (
    <div class="navbar">
      <div class="flex-1">
        {/* <a class="btn btn-ghost normal-case text-xl">daisyUI</a> */}
      </div>
      <div class="flex-none gap-2">
        <div class="form-control">
          <input
            type="text"
            placeholder="Search"
            class="input input-bordered"
          />
        </div>
        <div>
          <div className="bg-primarypink w-28 p-3 flex justify-center rounded-md">
            {/* <center> */}
            <img className="w-5" src="/images/log-out.png" />
            <h1 className="pl-2 font-semibold text-gray-50">LEAVE</h1>
            {/* </center> */}
          </div>
        </div>
        {/* <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img src="https://api.lorem.space/image/face?hash=33791" />
            </div>
          </label>
          <ul
            tabindex="0"
            class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a class="justify-between">
                Profile
                <span class="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;
