import React, { useState, useEffect } from "react";
import localforage from "localforage";

function NewPersonForm() {
  return (
    <form action="http://127.0.0.1/upload_student" method="POST" encType="multipart/form-data" className="bg-gray-200 flex flex-col gap-4 p-4" >
      <h2 className="text-2xl mb-4">Add a Student</h2>
      <input name="first_name" type="text" className="bg-white p-2 rounded-md" placeholder="Michael" />
      <input name="last_name" type="text" className="bg-white p-2 rounded-md" placeholder="Smith" />
      <input name="student_photo" type="file" accept="image/*" />
      <button type="submit" className="bg-gray-600 text-gray-100 p-2 rounded-md hover:bg-gray-700 transition-colors">Upload</button>
    </form>
  );
}

function PeopleUpload() {

  return(
    <div className="mb-8 py-8 px-14">
      <h1 className="text-4xl">Upload Students</h1>
      <NewPersonForm />
      {/* <div className="grid grid-cols-2 bg-gray-100 rounded-lg gap-8 w-full px-8 py-8">
      </div> */}
    </div>
  )
}
export default PeopleUpload;