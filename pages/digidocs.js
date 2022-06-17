import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import MainLayout from "../components/mainLayout";
import { DataContext } from "../contexts/data";
import Modal from "../components/modal";

import NoData from "../assets/undraw_no_data_re_kwbl.svg";

function Claims() {
    const { isDocLoading, documents } = useContext(DataContext);
    const [createOpen, setCreateOpen] = useState(false);

    function toggleCreateOpen() {
        setCreateOpen(!createOpen);
    }

    return (
        <div className="overflow-x-auto w-full mt-4">
            {isDocLoading && <progress className="progress w-56" />}

            {!isDocLoading && documents?.length === 0 && (
                <div className="w-full h-[50vh] flex flex-col place-content-center place-items-center gap-6">
                    <Image src={NoData} alt="" width="176px" />
                    <h1 className="text-lg">No data recorded yet</h1>
                    <button className="btn btn-primary text-primary-content" onClick={toggleCreateOpen}>
                        Insert
                    </button>
                </div>
            )}
            {/* <table className="table w-full">
                <thead>
                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" className="checkbox" />
                            </label>
                        </th>
                        <th>Name</th>
                        <th>Job</th>
                        <th>Favorite Color</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" className="checkbox" />
                            </label>
                        </th>
                        <td>
                            <div className="flex items-center space-x-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                        <Image
                                            src={`https://avatars.dicebear.com/api/avataaars/laynath.svg`}
                                            alt="Avatar Tailwind CSS Component"
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">Hart Hagerty</div>
                                    <div className="text-sm opacity-50">United States</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            Zemlak, Daniel and Leannon
                            <br />
                            <span className="badge badge-ghost badge-sm">Desktop Support Technician</span>
                        </td>
                        <td>Purple</td>
                        <th>
                            <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                    </tr>

                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" className="checkbox" />
                            </label>
                        </th>
                        <td>
                            <div className="flex items-center space-x-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                        <Image
                                            src={`https://avatars.dicebear.com/api/avataaars/laynath.svg`}
                                            alt="Avatar Tailwind CSS Component"
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">Brice Swyre</div>
                                    <div className="text-sm opacity-50">China</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            Carroll Group
                            <br />
                            <span className="badge badge-ghost badge-sm">Tax Accountant</span>
                        </td>
                        <td>Red</td>
                        <th>
                            <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                    </tr>

                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" className="checkbox" />
                            </label>
                        </th>
                        <td>
                            <div className="flex items-center space-x-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                        <Image
                                            src={`https://avatars.dicebear.com/api/avataaars/laynath.svg`}
                                            alt="Avatar Tailwind CSS Component"
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">Marjy Ferencz</div>
                                    <div className="text-sm opacity-50">Russia</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            Rowe-Schoen
                            <br />
                            <span className="badge badge-ghost badge-sm">Office Assistant I</span>
                        </td>
                        <td>Crimson</td>
                        <th>
                            <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                    </tr>

                    <tr>
                        <th>
                            <label>
                                <input type="checkbox" className="checkbox" />
                            </label>
                        </th>
                        <td>
                            <div className="flex items-center space-x-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                        <Image
                                            src={`https://avatars.dicebear.com/api/avataaars/laynath.svg`}
                                            alt="Avatar Tailwind CSS Component"
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">Yancy Tear</div>
                                    <div className="text-sm opacity-50">Brazil</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            Wyman-Ledner
                            <br />
                            <span className="badge badge-ghost badge-sm">Community Outreach Specialist</span>
                        </td>
                        <td>Indigo</td>
                        <th>
                            <button className="btn btn-ghost btn-xs">details</button>
                        </th>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Job</th>
                        <th>Favorite Color</th>
                        <th></th>
                    </tr>
                </tfoot>
            </table> */}
            <Modal open={createOpen} toggle={toggleCreateOpen}>
                hi
            </Modal>
        </div>
    );
}

Claims.Layout = MainLayout;

export default Claims;
