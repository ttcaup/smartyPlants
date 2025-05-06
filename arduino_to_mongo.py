# Company: RNK
# Author: Eden Reader
# Date: 05/05/25

import serial
import os
import time
from datetime import datetime, timezone
import json
from pymongo import MongoClient
import dotenv


dotenv.load_dotenv()
cluster_link = os.environ.get("clusterLink") # read from .env file

# MongoDB Atlas Connection 
client = MongoClient(cluster_link)
db = client["smartyPlants"]
collection = db["readings"]  # Collection for sensor logs

# Arduino Serial Connection 
ser = serial.Serial('COM4', 9600)  
PLANT_LINK = "monstera"
time.sleep(2)

# Main Loop 
while True:
    try:
        line = ser.readline().decode('utf-8').strip()  # converts into text from binary
        print("Received:", line)

        # decoding json
        if line.startswith('{') and line.endswith('}'):
            arduino_data = json.loads(line)

            # print(datetime.now(timezone.utc))
            # Map Arduino fields to db format
            document = {
                "plant_info": {
                    "plant_link": PLANT_LINK
                },
                "timestamp": datetime.now(timezone.utc),

                "soil_moisture": arduino_data.get("moisture"),
                "temperature": arduino_data.get("temperature"),
                "humidity": arduino_data.get("humidity"),
                "light": arduino_data.get("light")
            }
            if arduino_data["watered"]:
                document["watered"] = True
                 
            # Insert the formatted document into MongoDB
            collection.insert_one(document)
            print("Inserted:", document)

        elif line == "Finished Watering Plant!":
            document = {
                "plant_info": {
                    "plant_link": PLANT_LINK
                },
                "timestamp": datetime.now(timezone.utc),

            }

    except KeyboardInterrupt:
        print("Stopped by user.")
        break

    except Exception as e:
        print("Error:", e)

