from flask import Flask, render_template, redirect, request, url_for, make_response, jsonify
from server import Server
from recognition import take_attendance
from random import randint
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
VALID_FILE_TYPES = {'png', 'jpg', 'jpeg'}
PHOTO_PATH = "imgs/"



server = Server()
app.run()

@app.route("/upload_student", methods=["POST"])
def upload_student():
    """
    Upload and store student's name and their image to the server.
    {
        "id": xx
        "name": "bob smith"
        "photo_path": "photos/rhhs_lefler.jpg"
    }
    """
    first_name = request.form.get("first_name")
    last_name = request.form.get("last_name")
    details = request.form.get("details")
    print(first_name, last_name, details)
    status = 200
    if "student_photo" in request.files and request.files["student_photo"].filename.split(".")[-1].lower() in VALID_FILE_TYPES:
        image = request.files["student_photo"]
    else:
        image = None
        status = 400
    
    student_id = server.add_student(first_name, last_name, image, details)

    result = {"id": student_id}
    response = jsonify(result)
    response.status_code = status
    return response
        
    

@app.route("/remove_student", methods=["POST"])
def remove_student():
    """
    Remove a student and their image from the server.
    client sends a student_id
    server does work, could send a response status or smth

    return:
    {
        "response_status":
    }
    """
    id = request.args.get("id")
    
    if not server.remove_student(id):
        response = make_response('remove_student_response')
        response.status_code = 400
        return response


@app.route("/upload_attendance", methods=["POST"])
def upload_attendance():
    """
    Upload an attendance image to check who is present, so can start calculating in the background even? Give a ticket for request.
    client sends an image file, server returns a ticket id (string) for getting the result

    input:
    *file itself*
    {
        "photo_path": <"aaaa/wow_a_folder/foto.jpg">
    }

    return:
    {
        "ticket_id": <id>
    }
    """
    #with open("thing.png", "wb") as f:
    #    f.write(request.data)
    #if "attendance_photo" in request.files and request.files["attendance_photo"].filename.split(".")[-1].lower() in VALID_FILE_TYPES:
    #    image = request.files["attendance_photo"]
    #else:
    #    image = None
    #    status = 400

    id = server.add_attendance(request.data)
    server.judge_attendance(id)
    
    # i think you can just create a ticket id as dict key, call recognition.py on the file, and then store it in the dict
    # send id back to client
    # Flask request documentation **
    # request.files
    response = make_response(f"{id}")
    response.status_code = 200
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/remove_attendance", methods=["POST"])
def remove_attendance():
    """
    Removes an attendance image using a ticket id.

    Client input:
    {
        "ticket_id": <id>
    }
    """
    ticket_id = request.args.get("ticket_id")
    if not server.remove_attendance(ticket_id):
        response = make_response('remove_attendance_response')
        response.status_code = 400
        return response
    pass

@app.route("/attendance_results", methods=["GET"])
def get_attendance_results():
    """
    Send the json containing the location of students present in a particular image.

    client request results for a "attendance_id" ("attendance_id" should be associated with an image in the server)
    a null student id represents a face that could not be matched with an existing student
    server sends back:
    {
        "count": # of students found
        "students": {
            "<student_id1>": [<top>, <right>, <bottom>, <left>],
            "<student_id2>": [<top>, <right>, <bottom>, <left>],
            "<student_id4>": [<top>, <right>, <bottom>, <left>],
            "null": [<top>, <right>, <bottom>, <left>]
        }
    }
    """
    attendance_id = request.args.get("attendance_id")
    attendance = server.get_attendance(attendance_id)
    faces = attendance["faces"]
    results = {
        "count": len(faces),
        "students": faces
    }
    response = jsonify(results)
    response.status_code = 200
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/current_attendance", methods=["GET"])
def get_current_attendance():
    """
    Send json containing people who are present and absent.
    {
        "firstname":"john", "lastname":"doe", "present:true,
        "firstname":"mike", "lastname":"zhan", "present:true,
        "firstname":"peter", "lastname":"pa", "present:true,
        "firstname":"luke", "lastname":"zhan", "present:false,
        "firstname":"wu's", "lastname":"gf", "present:true
    }
    """
    results = {"data":[]}
    students = server.get_students()
    for id in sorted(students, key = lambda x: (students[x]["last_name"], students[x]["first_name"], x)):
        results["data"]["firstname"] = students[id]["first_name"]
        results["data"]["lastname"] = students[id]["last_name"]
        results["data"]["present"] = server.student_present(id)
    response = jsonify(results)
    response.status_code = 200
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
