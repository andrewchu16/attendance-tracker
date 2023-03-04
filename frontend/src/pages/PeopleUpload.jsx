import React, { useState, useEffect, useRef } from "react";
import localforage from "localforage";

function NewPersonForm() {
  const [studentId, setStudentId] = useState(null);

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
    }).then((id) => {
      console.log(id);
      setStudentId(studentId);
    });
  };

  return (
    <>
      <p>
        {studentId !== null ? `Student id: ${studentId}` : "empty for now..."}
      </p>
      <form
        action="http://127.0.0.1:5000/upload_student"
        method="POST"
        encType="multipart/form-data"
        className="bg-gray-200 flex flex-col gap-4 p-4"
      >
        <h2 className="text-2xl mb-1">Add a Student</h2>
        <input
          ref={firstNameInput}
          name="first_name"
          type="text"
          className="bg-white p-2 rounded-md"
          placeholder="Michael"
          required
        />
        <input
          ref={lastNameInput}
          name="last_name"
          type="text"
          className="bg-white p-2 rounded-md"
          placeholder="Smith"
          required
        />
        <textarea
          ref={detailsInput}
          name="details"
          className="bg-white p-2 rounded-md"
          placeholder="Details"
          required
        />
        <input
          ref={fileInput}
          name="student_photo"
          type="file"
          accept="image/*"
          required
        />
        <button
          type="submit"
          className="bg-gray-600 text-gray-100 p-2 rounded-md hover:bg-gray-700 transition-colors"
          onSubmit={handleSubmit}
        >
          Upload
        </button>
      </form>
    </>
  );
}

function PeopleUpload() {
  return (
    <div className="mb-8 py-8 px-14">
      <h1 className="text-4xl mb-4">Upload Students</h1>
      <NewPersonForm />
      {/* <div className="grid grid-cols-2 bg-gray-100 rounded-lg gap-8 w-full px-8 py-8">
      </div> */}
    </div>
  );
}
export default PeopleUpload;
