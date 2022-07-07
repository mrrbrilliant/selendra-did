import React from "react";
import Link from "next/link";

const Detailorg = () => {
  const data = [
    {
      name: "Certificate grade 9",
      des: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      link: "www.Moeyscambodia",
      logo: "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/best-attendance-certificate-design-template-03eed0c5e01d99fe53f9db966464ea5a_screen.jpg?ts=1561443060",
    },
    {
      name: "Certificate grade 12",
      des: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      link: "www.Moeyscambodia",
      logo: "https://images.sampletemplates.com/wp-content/uploads/2016/03/24064236/sample-certificate-of-appreciation-editable.jpg",
    },
    {
      name: "Doctorate certificate",
      des: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      link: "www.Moeyscambodia",
      logo: "https://i.pinimg.com/originals/55/a9/d8/55a9d8819866579ec7429023cb6735cf.jpg",
    },
    {
      name: "PhD in Neuroscience Certificate",
      des: "When a person creates an original work, fixed in a tangible medium, he or she automatically owns copyright to the work.",
      link: "www.Moeyscambodia",
      logo: "https://www.kuleuven.be/brain-institute/afbeeldingen/phd-neuroscience-certificate.png/image",
    },
  ];
  return (
    <>
      <h1 className="font-bold mb-10 bg-accent py-1 px-2 w-80 text-center rounded-xl text-white">
        Documents type of Moey Cambodia
      </h1>
      <div className="grid grid-cols-2 gap-7 mt-3">
        <div className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer h-52">
          <img
            className="object-center w-full"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MoEYS_%28Cambodia%29.svg/1200px-MoEYS_%28Cambodia%29.svg.png"
            alt="Flower and sky"
          />
          <div className="h-full absolute top-0 left-0 px-6 py-4 bg-opacity-60 bg-accent">
            <h4 className="mb-3 text-2xl font-semibold tracking-tight text-white">Certification</h4>
            <p className="leading-normal text-white text-lg">
              Lorem ipsum dolor, sit amet cons ectetur adipis icing elit. Praesen tium, quibusdam facere quo laborum
              maiores sequi nam tenetur laud.
            </p>
            <Link href="/ctypes/create1">
              <button className=" w-32 mt-4 text-white font-medium p-2 rounded bg-primarypink bg-opacity-80">
                Create
              </button>
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer h-52">
          <img
            className="object-cover w-full"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MoEYS_%28Cambodia%29.svg/1200px-MoEYS_%28Cambodia%29.svg.png"
            alt="Flower and sky"
          />
          <div className="h-full absolute top-0 left-0 px-6 py-4 bg-opacity-60 bg-accent">
            <h4 className="mb-3 text-2xl font-semibold tracking-tight text-white">Certification</h4>
            <p className="leading-normal text-white text-lg">
              Lorem ipsum dolor, sit amet cons ectetur adipis icing elit. Praesen tium, quibusdam facere quo laborum
              maiores sequi nam tenetur laud.
            </p>
            <Link href="/ctypes/create1">
              <button className=" w-32 mt-4 text-white font-medium p-2 rounded bg-primarypink bg-opacity-80">
                Create
              </button>
            </Link>
          </div>
        </div>
      </div>
      <br />
      <div className="grid grid-cols-2 mt-3 gap-7">
        {data.map((res) => {
          return (
            <div className=" rounded-lg p-3  border-gray-100 bg-white">
              <div className="grid md:grid-cols-5 gap-10">
                <div className="md:col-span-2">
                  {/* <div
                    className="bg-no-repeat bg-center h-40 w-auto rounded"
                    // className="h-72 mx-auto object-cover w-max"
                    style={{
                      backgroundImage: `url(${res.logo})`,
                    }}
                  ></div> */}
                  <div>
                    <img className="h-40 mx-auto object-cover w-max" src={res.logo} />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <h4 className="text-xl font-semibold">{res.name}</h4>
                  <p className="text-lg mt-2">{res.des.substring(0, 100)}...</p>
                  <Link href="/ctypes/create1">
                    <button className="p-2 text-white w-32 leading-none rounded font-bold mt-2 bg-primarypink hover:bg-opacity-75 text-xs uppercase">
                      Create
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Detailorg;
