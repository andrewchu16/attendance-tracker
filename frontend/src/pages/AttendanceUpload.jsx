import React, { useState, useEffect } from "react";
import localforage from "localforage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrash } from "@fortawesome/free-solid-svg-icons";
import CanvasOverlay from "../components/CanvasOverlay";

function AttendanceImage({ image, ticket_id }) {
  console.log(image);
  return (
    <div className="bg-gray-100 rounded-lg flex justify-center items-center relative aspect-square">
      <CanvasOverlay className="h-full w-full absolute top-0 left-0" />
      <img src={image} className="aspect-square rounded-lg object-scale-down" />
    </div>
  );
}

function NewAttendanceButton({ uploadFile }) {
  const handleFileChange = (e) => {
    if (e.target.files) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center rounded-lg">
      <label
        htmlFor="attendance_photo"
        className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <FontAwesomeIcon icon={faUpload} className="text-gray-500 text-2xl" />
        <p className="mb-2 text-gray-500">
          <span className="font-semibold">Upload</span> attendance image.
        </p>
        <input
          id="attendance_photo"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}

function AttendanceUpload() {
  const [attendances, setAttendances] = useState([]);
  const [status, setStatus] = useState("");

  const handleUpload = (file) => {
    console.log(file);
    // localforage.getItem("attendances").then((value) => {
    //   const newAttendance = {
    //     image: file,
    //     ticket_id:
    //       value !== null ? value[value.length - 1]["ticket_id"] + 1 : 0,
    //   };
    //   localforage
    //     .setItem(
    //       "attendances",
    //       value !== null ? [...value, newAttendance] : [newAttendance]
    //     )
    //     .then((value) => {
    //       setAttendances([
    //         ...attendances,
    //         <AttendanceImage
    //           image={window.URL.createObjectURL(newAttendance.image)}
    //           ticket_id={newAttendance.ticket_id}
    //           key={newAttendance.ticket_id}
    //         />,
    //       ]);
    //     });
    // });

    fetch("http://127.0.0.1:5000/upload_attendance", {
      method: "POST",
      body: file,
      headers: {
        "content-type": file.type,
        "content-length": `${file.size}`,
      },
    })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        console.log(data);
        localforage.getItem("attendances").then((value) => {
          const newAttendanceData = {
            image: file,
            ticket_id: data,
          };
          localforage
            .setItem(
              "attendances",
              value !== null ? [...value, newAttendanceData] : [newAttendanceData]
            )
            .then((value) => {
              setAttendances([
                ...attendances,
                <AttendanceImage
                  image={window.URL.createObjectURL(newAttendanceData.image)}
                  ticket_id={newAttendanceData.ticket_id}
                  key={newAttendanceData.ticket_id}
                />,
              ]);
            });
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    setStatus("loading");
    localforage
      .getItem("attendances")
      .then((value) => {
        setStatus("success");
        if (value === null) {
          setAttendances([]);
        } else {
          let tmp = value.map((v) => (
            <AttendanceImage
              image={window.URL.createObjectURL(v["image"])}
              ticket_id={v["ticket_id"]}
              key={v["ticket_id"]}
            />
          ));

          setAttendances(tmp);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setStatus("error");
        setError(err);
      });
  }, []);

  if (status === "error") {
    return { error };
  } else if (status === "loading") {
    return "loading";
  }

  return (
    <div className="h-full w-full mb-8 py-8 px-12">
      <h1 className="text-4xl text-center mb-3">Upload Attendance Photos</h1>
      <div className="grid grid-cols-3 min-h-96 w-full gap-4">
        {attendances}
        <NewAttendanceButton uploadFile={handleUpload} />
      </div>
    </div>
  );
}

export default AttendanceUpload;
