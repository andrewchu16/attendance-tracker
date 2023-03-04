import React, { useState, useEffect } from "react";
import localforage from "localforage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrash } from "@fortawesome/free-solid-svg-icons";
import CanvasOverlay from "../components/CanvasOverlay";

function AttendanceImage({ image, ticketId, onDelete }) {
  // console.log(image);
  return (
    <div className="bg-gray-100 rounded-lg flex justify-center items-center relative aspect-square overflow-clip">
      <div className="z-20 opacity-0 absolute hover:opacity-100 h-full w-full transition-opacity cursor-pointer">
        <div className="bg-gray-900 h-full w-full opacity-30"></div>
        <FontAwesomeIcon
          icon={faTrash}
          className="absolute right-5 top-5 text-4xl text-gray-600 hover:text-red-600 transition-colors"
          onClick={onDelete}
        />
      </div>
      <CanvasOverlay className="h-full w-full absolute top-0 left-0" />
      <img src={image} className="aspect-square object-scale-down" />
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
    // console.log(file);
    // localforage.getItem("attendances").then((value) => {
    //   const newAttendanceData = {
    //     image: file,
    //     ticketId: value !== null ? value[value.length - 1]["ticketId"] + 1 : 0,
    //   };

    //   // save to local forage
    //   localforage
    //     .setItem(
    //       "attendances",
    //       value !== null ? [...value, newAttendanceData] : [newAttendanceData]
    //     )
    //     .then((_) => {
    //       // update component
    //       let newAttendance = {
    //         ...newAttendanceData,
    //         handleDelete: () => {
    //           setAttendances(attendances.filter((a) => newAttendance !== a));
    //         },
    //       };
    //       setAttendances([...attendances, newAttendance]);
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
      .then((serverTicketId) => {
        localforage.getItem("attendances").then((value) => {
          const newAttendanceData = {
            image: file,
            ticketId: serverTicketId,
          };

          // save to local forage
          localforage
            .setItem(
              "attendances",
              value !== null
                ? [...value, newAttendanceData]
                : [newAttendanceData]
            )
            .then((value) => {
              // update component
              let newAttendance = {
                ...newAttendanceData,
                handleDelete: () => {
                  setAttendances(
                    atttendances.filter((a) => newAttendance !== a)
                  );
                },
              };
              setAttendances([...attendances, newAttendance]);
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
          let tmpAttendances = value.map((attendanceData) => ({
            ...attendanceData,
            handleDelete: () => {
              setAttendances(
                attendances.filter(
                  (v, i) => v.ticketId !== attendanceData.ticketId
                )
              );
            },
          }));

          setAttendances(tmpAttendances);
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

  const attendanceElems = attendances.map((v) => (
    <AttendanceImage
      image={window.URL.createObjectURL(v.image)}
      ticketId={v.ticketId}
      key={v.ticketId}
      onDelete={v.handleDelete}
    />
  ));

  return (
    <div className="h-full w-full mb-8 py-8 px-12">
      <h1 className="text-4xl text-center mb-3">Upload Attendance Photos</h1>
      <div className="grid grid-cols-3 min-h-96 w-full gap-4">
        {attendanceElems}
        <NewAttendanceButton uploadFile={handleUpload} />
      </div>
    </div>
  );
}

export default AttendanceUpload;
