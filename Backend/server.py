import json
import random
import os

import recognition

class Server:
    
    """Initialize the server"""
    def __init__(self) -> None:
        # Read the database
        with open("database.json", "r") as d:
            self.data = json.loads(d.read())

    """Update the database"""
    def write(self) -> None:
        with open("database.json", "w") as d:
            # Parse the data to JSON format
            json_data = json.dumps(self.data)
            d.write(json_data)

    # "Setter methods"
    """Add a student to the student list
    Returns the id of the new student
    """
    def add_student(self, 
                    first_name: str, 
                    last_name: str, 
                    image, 
                    details: str = "") -> int:
        student = {
            "first_name": first_name,
            "last_name": last_name,
            "details": details,
            "appears": []
        }
        # Generate student id
        id = -1
        while id == -1 or id in self.data["students"]:
            id = random.randint(1, 1e9)
        # Save the student image
        filename = str(id) + "." + image.filename.split(".")[-1].lower()
        filepath = os.path.join("imgs/students", filename)
        image.save(filepath)
        # Set the image filepath
        student["image_path"] = filepath
        # Get the student's face encoding
        student["encoding"] = recognition.encode_student(filepath)
        # Add the student to the student list
        self.data["students"][id] = student
        return id

    """Remove the student with the specified id
    Returns a boolean to indicate if the action was successful
    """
    def remove_student(self, id: int) -> bool:
        if id in self.data["students"]:
            del self.data["students"][id]
            return True
        return False

    """Adds an appearance to a student
    Returns a boolean to indicate if the action was successful
    """
    def add_student_appearance(self, studentId: int, attendanceId: int) -> bool:
        if attendanceId not in self.data["students"][studentId]["appears"]:
            self.data["students"][studentId]["appears"].append(attendanceId)
            return True
        return False

    """Add an attendance list
    Returns the id of the new attendance list
    """
    def add_attendance(self, image) -> int:
        attendance = {
            "completed": False,
            "faces": []
        }
        # Generate attendance id
        id = -1
        while id == -1 or id in self.data["attendances"]:
            id = random.randint(1, 1e9)
        # Save the attendance image
        # assuming its a jpg right now
        filename = str(id) + ".jpg"
        filepath = os.path.join("imgs/attendances", filename)
        with open(filepath, "wb") as picture:
            picture.write(image)
        # Set the image filepath
        attendance["image_path"] = filepath
        # Add the attendance to the attendance list
        self.data["attendances"][id] = attendance
        return id

    """Judge the attendance image with the specified id"""
    def judge_attendance(self, id: int) -> None:
        attendance = self.data["attendances"][id]
        attendance["faces"] = recognition.take_attendance(attendance["image_path"], self.get_students())
        for face in attendance["faces"]:
            self.add_student_appearance(face["student"], id)
        return attendance["faces"]
    
    """Remove an attendance list
    Returns a boolean to indicate if the action was successful
    """
    def remove_attendance(self, id) -> bool:
        if id in self.data["attendances"]:
            del self.data["attendances"][id]
            return True
        return False

    # "Getter" methods
    """Get the entire student list"""
    def get_students(self) -> dict:
        return self.data["students"]

    """Get information about the specified student"""
    def get_student(self, id: int) -> dict:
        student = self.data["students"][id]
        appears = []
        # Check if the attendances associated with the student are still valid
        for attendanceId in student["appears"]:
            if attendanceId in self.data["attendances"]:
                appears.append(attendanceId)
        student["appears"] = appears
        return student

    """Returns whether the student is found in any attendance images"""
    def student_present(self, id: int) -> bool:
        student = self.get_student(id)
        return len(student["appears"]) > 0
    
    """Get the entire attendance list"""
    def get_attendances(self) -> dict:
        return self.data["attendances"]

    """Get information about the specified attendance image"""
    def get_attendance(self, id: int) -> dict:
        return self.data["attendances"][id]
    