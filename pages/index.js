import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "../components/mainLayout";
import { ContractContext } from "../contexts/contract";
import { WalletContext } from "../contexts/wallet";

function Home() {
    const [num, setNum] = useState(-1);
    const { createOrg, countOrgByUser, deleteOrg, organizationLists, orgMeta, organizationListsByUser } =
        useContext(ContractContext);

    const router = useRouter();

    async function count() {
        const c = await countOrgByUser();
        console.log(c);
    }

    return (
        <div className="flex flex-row gap-4">
            <button
                className="btn"
                onClick={() =>
                    createOrg({
                        name: "Nath Industry",
                        description: "Porn website",
                        orgUri: "https://nathindustry.com",
                    })
                }
            >
                Create Org
            </button>
            <button className="btn" onClick={count}>
                Count
            </button>

            <button className="btn" onClick={() => organizationListsByUser()}>
                List
            </button>
            <input className="input input-bordered" type="text" value={num} onChange={(e) => setNum(e.target.value)} />
            <button className="btn" onClick={() => deleteOrg(num)}>
                deleteOrg
            </button>
            <button className="btn" onClick={orgMeta}>
                Show
            </button>
        </div>
    );
}

Home.Layout = MainLayout;

export default Home;
