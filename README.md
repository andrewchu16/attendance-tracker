# Eyedentify
YRHacks 2023 project

Eyedentify is a web app for completing attendances of large classrooms with facial recognition.

## What It Does
From the Eyedentify app, the user is able to create an attendance sheet with the faces of students. When it is time to do attendance, the user submits a picture containing some of the students and the app automatically marks off who is present.

## How It Works
Eyedentify is split into a server and client. The server was written in Python with Flask and the `facial_recognition` library. The client was written in React with TailwindCSS.

## Challenges We Encountered
We found communicating between the server and client to be tedious. There is a lot of design work on top of actual coding to go through, and web technologies sometimes made things difficult.

## Future Goals
Performing facial recognition in live video feeds and creating a mobile version.
