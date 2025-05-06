# smartyPlants
A Plant Monitoring and Care System that integrates sensors with a microcontroller to monitor plant health parameters such as soil moisture, temperature, humidity, and light intensity. 

## Installation
1. Install required python packages;
```shell
pip install -r requirements.txt
```
2. put our private clusterLink for MongoDB Atlas in `.env` file like this:
`clusterLink = "mongodb+srv://example"`

3. Install arduino IDE: https://www.arduino.cc/en/software/


## How to use
1. Transfer program to arduino in arduino IDE
2. run `python arduino_to_mongo.py`
