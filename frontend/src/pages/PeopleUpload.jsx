import React, { useState, useEffect } from "react";
import localforage from "localforage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

function NewPeopleButton({ uploadFile }) {
  const handleFileChange = (e) => {
    if (e.target.files) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center rounded-lg">
      <label
        htmlFor="user_photo"
        className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <FontAwesomeIcon icon={faUpload} className="text-gray-500 text-2xl" />
        <p className="mb-2 text-gray-500">
          <span className="font-semibold">Upload</span> student image.
        </p>
        <input
          id="user_photo"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}

function PeopleUpload(){
  const handleUpload = (file) => {
    console.log(file);
    localforage.getItem("people").then((value) => {
      const newAttendance = {
        image: file,
        user_id:
          value !== null ? value[value.length - 1]["ticket_id"] + 1 : 0,
      };
      localforage
        .setItem(
          "people",
          value !== null ? [...value, newAttendance] : [newAttendance]
        )
        .then((value) => {
          setAttendances([
            ...attendances,
            <AttendanceImage
              image={window.URL.createObjectURL(newAttendance.image)}
              user_id={newAttendance.ticket_id}
              key={newAttendance.ticket_id}
            />,
          ]);
        });
    });
  };
  return(
    <div className="mb-8 py-8 px-14">
      <h1 className="text-4xl">Upload Students</h1>
      <div className="grid grid-cols-2 bg-gray-100 rounded-lg gap-8 w-full px-8 py-8">
        <NewPeopleButton uploadFile={handleUpload} />
      </div>
    </div>
  )
}
export default PeopleUpload;
