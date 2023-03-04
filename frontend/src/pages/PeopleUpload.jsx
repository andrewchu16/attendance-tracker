import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

function NewPersonForm() {
  const [studentId, setStudentId] = useState(null);
  const [imgURL, setImgURL] = useState(null);

  const firstNameInput = useRef();
  const lastNameInput = useRef();
  const detailsInput = useRef();
  const fileInput = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("first_name", firstNameInput.current.value);
    data.append("last_name", lastNameInput.current.value);
    data.append("details", detailsInput.current.value);
    data.append("student_photo", fileInput.current.files[0]);

    fetch("http://127.0.0.1:5000/upload_student", {
      method: "POST",
      body: data,
    }).then((response) => {
      return response.json();
    }).then((value) => {
      console.log(value);
      setStudentId(value["id"]);
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImgURL(window.URL.createObjectURL(e.target.files[0]));
    }
  }

  const imagePreview = imgURL !== null ? <img src={imgURL} className="max-w-full max-h-full" /> : "";
  const banner = studentId !== null ? <p className="w-full h-20 rounded-md bg-green-100 mb-6">Uploaded successful.</p> : <></>;
  return (
    <>
      {banner}
      <form className="bg-gray-200 flex flex-col gap-2 p-5 rounded-lg" onSubmit={handleSubmit}>
        <label htmlFor="first_name" className="ml-2">
          First Name
        </label>
        <input
          ref={firstNameInput}
          name="first_name"
          id="first_name"
          type="text"
          className="bg-white p-2 rounded-md mb-2"
          placeholder="Michael"
          required
        />
        <label htmlFor="last_name" className="ml-2">
          Last Name
        </label>
        <input
          ref={lastNameInput}
          name="last_name"
          id="last_name"
          type="text"
          className="bg-white p-2 rounded-md mb-2"
          placeholder="Smith"
          required
        />
        <label htmlFor="details" className="ml-2">
          Details
        </label>
        <textarea
          ref={detailsInput}
          name="details"
          id="details"
          className="bg-white p-2 rounded-md mb-3"
          placeholder="Details"
          required
        />
        <label
          htmlFor="student_photo"
          className="flex flex-col relative items-center justify-center w-full h-[500px] border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 mb-4"
        >
          {imagePreview}
          <div className="bg-white z-20 flex justify-center flex-col bg-[rgba(255,255,255,0.6)] rounded-xl p-2 absolute">
            <FontAwesomeIcon icon={faUpload} className="text-gray-500 text-2xl" />
            <p className="mb-2 text-gray-500">
              <span className="font-semibold">Upload</span> student image.
            </p>
          </div>
          <input
            ref={fileInput}
            id="student_photo"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <button
          type="submit"
          className="bg-gray-600 text-gray-100 p-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Upload
        </button>
      </form>
    </>
  );
}

function PeopleUpload() {
  return (
    <div className="mb-8 py-8 px-14 flex flex-col h-fulll">
      <h1 className="text-4xl mb-4 text-center">Upload Student</h1>
      <NewPersonForm />
    </div>
  );
}
export default PeopleUpload;
