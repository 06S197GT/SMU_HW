#Import dependencies
import numpy as np
import pandas as pd
import json

#Import Flask and, Jsonify and my Created class
from VacaHelper import VacaHelper
from flask import Flask, jsonify

#Setup Flask
app = Flask(__name__)

#Call my class
vacaHelper = VacaHelper()

#App routes
@app.route("/")
def home_page():
    return (f"Optional pages include:<br/>" 
            f"""
            <ul>
            <li><a target="_blank" href= '/api/v1.0/precipitation'>Hawaii precipitation results </a></li>
            <li><a target="_blank" href= '/api/v1.0/stations'>Hawaii weather station results </a></li>
            <li><a target="_blank" href= '/api/v1.0/tobs'>Hawaii temperature observation results of top station for previous 12-Months </a></li>
            <li><a target="_blank" href= '/api/v1.0/filterby/<start_date>'> TObs MIN, MAX and AVG for any given date: "YYYY-MM-DD". Click and add date to URL to continue.</a></li>
            <li><a target="_blank" href= '/api/v1.0/filterby/<start_date>/<end_date>'> TObs MIN, MAX and AVG between two given dates: "YYYY-MM-DD"/"YYYY-MM-DD". Click and add dates to URL to continue.</a></li>
            <li><a target="_blank" href= '/api/v1.0/all_entries'>All data entries </a></li>
            </ul>
    """)
@app.route("/api/v1.0/all_entries")
def all_data_page():
    all_data = vacaHelper.getAllRows()
    print("Server received request for 'all entries' page...")
    return (jsonify(json.loads(all_data.to_json(orient='records'))))

@app.route("/api/v1.0/precipitation")
def precipitation_page():
    all_data = vacaHelper.all_prcp()
    print("Server received request for 'Precipitation' page...")
    return (jsonify(json.loads(all_data.to_json(orient='records'))))

@app.route("/api/v1.0/stations")
def stations_page():
    all_data = vacaHelper.all_stations()
    print("Server received request for 'Stations' page...")
    return (jsonify(json.loads(all_data.to_json(orient='records'))))

@app.route("/api/v1.0/tobs")
def tobs_page():
    all_data = vacaHelper.twelve_month_tobs()
    print("Server received request for 'TObs' page...")
    return (jsonify(json.loads(all_data.to_json(orient='records'))))

@app.route("/api/v1.0/filterby/<start_date>")
def filter_temp(start_date):
    data = vacaHelper.filter_temp(start_date)
    print("Server received request for 'filterd TObs' page...")
    return(jsonify(json.loads(data.to_json(orient='records'))))

@app.route("/api/v1.0/filterby/<start_date>/<end_date>")
def filter_temp_range(start_date,end_date):
    data = vacaHelper.filter_temp_range(start_date,end_date)
    print("Server received request for 'multi-filterd TObs' page...")
    return(jsonify(json.loads(data.to_json(orient='records'))))

#Run Flask
if __name__ =="__main__":
    app.run(debug=True)
