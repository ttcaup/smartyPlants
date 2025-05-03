import serial
import time
import json
from pymongo import MongoClient

# MongoDB Atlas Connection 
client = MongoClient()
db = client["plant_monitor"]
collection = db["sensor_data"]  # Collection for sensor logs, this is a datatype from the mongo library

# Arduino Serial Connection 
ser = serial.Serial('COM3', 9600)  # Change to match your port
time.sleep(2)

# Plant Link (Hardcoded for now) 
PLANT_LINK = "plant_123"  # Replace with the actual plant_link identifier

# Main Loop 
while True:
    try:
        line = ser.readline().decode('utf-8').strip() #converts into text from binary
        print("Received:", line)

        #decoding json
        if line.startswith('{') and line.endswith('}'):
            arduino_data = json.loads(line)

            # Map Arduino fields to db formatt
            document = {
                "plant_info": {
                    "plant_link": PLANT_LINK
                },
                "timestamp": {
                    "date": time.time()
                },
                "soil_moisture": arduino_data.get("moisture"),
                "temperature": arduino_data.get("temperature"),
                "humidity": arduino_data.get("humidity"),
                "light": arduino_data.get("light")
            }

            # Insert the formatted document into MongoDB
            collection.insert_one(document) 
            print("Inserted:", document)

    except KeyboardInterrupt:
        print("Stopped by user.")
        break

    except Exception as e:
        print("Error:", e)
