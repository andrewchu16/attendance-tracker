import { Component, useEffect, useState } from "react";

function Home() {
  return (
    <div className="w-full justify-center items-center">
      <div className="w-full flexbox items-center py-6">
        <h1 className="text-4xl text-center">HOME</h1>
      </div>
      <div className="w-full flexbox items-center px-20 py-12 mx-15">
        <Table />
      </div>
    </div>
  );
}

function Table(){
  const [data, setData] = useState([])
  useEffect(() => {
    fetch("http://127.0.0.1:5000/current_attendance", {
      method: "GET",
      body: data,
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    []
  });
  return (
    <div className="text-xl">
      <table className="w-full m-0 border">
        <tr className="w-full border p-2">
          <th className="w-1/6 px-5 text-left">First Name</th>
          <th className="w-1/6 px-1 text-left">Last Name</th>
          <th className="w-2/3 text-right px-5">Here</th>
        </tr>
        {data.map((val, key) => {
          return (
            <tr key={key} className="w-full p-1">
              <td className="w-1/6 px-5">{val.firstname}</td>
              <td className="w-1/6 px-1">{val.lastname}</td>
              <td className="w-2/3 text-right px-5">{val.present}</td>
            </tr>
          )
        })}
      </table>
    </div>
  );
}
export default Home;
