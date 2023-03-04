from flask import Flask, render_template, redirect, request, url_for, make_response
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
    first_name = request.args.get("first_name")
    last_name = request.args.get("last_name")
    details = request.args.get("details")
    if "student_photo" in request.files and request.files["student_photo"].filename.split(".")[-1].lower() in VALID_FILE_TYPES:
        image = request.files["student_photo"]
    else:
        image = None
        status = 400
    
    server.add_student(first_name, last_name, image, details)

    response = make_response('upload_student_response')
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

    client request results for a "ticket_id" ("ticket_id" should be associated with an image in the server)
    server sends back:
    {
        "status": <1 = found, 0 = not found(cache cleared from last input)>
        "<student_id1>": [<top>, <right>, <bottom>, <left>]
        "<student_id2>": [<top>, <right>, <bottom>, <left>]
        "<student_id3>": null
        "<student_id4>": [<top>, <right>, <bottom>, <left>]
    }
    """

    return ""
    # send the json
    pass 

@app.route("/current_attendance", methods=["GET"])
def get_current_attendance():
    """
    Send json containing people who are present and absent.
    {
        "john doe": true,
        "mike zhan": true,
        "peter pa": true,
        "luke zhan": false,
        "william wu's girl": false
    }
    """
    results = {}
    students = server.get_students()
    for id in sorted(students, key = lambda x: (students[x]["last_name"], students[x]["first_name"], x)):
        name = students[id]["first_name"] + " " + students[id]["last_name"]
        results[name] = server.student_present(id)
    results_json = json.dumps(results)
    response = make_response(results_json)
    response.status_code = 200
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
