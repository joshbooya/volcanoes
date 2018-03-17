#Project 02 - Volcanoes
#Brett Brandom, Joshua Bui, Jonathan Orozco, Caitlyn Ta

import datetime as dt
import numpy as np
import pandas as pd
import os

import sqlalchemy

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import Session

from sqlalchemy import create_engine, MetaData
from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy import Float, create_engine, func
from sqlalchemy import and_, or_, inspect, text

from flask import Flask, render_template, jsonify, redirect
from flask_pymongo import PyMongo
from flask import Markup
import scrape_volcanoimgs
import sqlite3

#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///volcano.sqlite")
# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)
# Save references to the Eruptions and eruptions table
Eruptions = Base.classes.eruptions
# Save references to the TempInfo and tempinfo table
TempInfo = Base.classes.tempinfo
Risk = Base.classes.risk
# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
mongo = PyMongo(app)


@app.route('/')
def index():
    volcanoes = mongo.db.volcanoes.find_one()
    return render_template('index.html', volcanoes=volcanoes)

@app.route('/welcome')
def welcome():
    """List all available api routes."""
    return (
        f"Avalable Routes:<br/> "

        f"/scrape "
        f" - Scrapes http://volcano.si.edu/ for images and returns index.html<br/>"

        f"/process "
        f" - Layout of the project workflow<br/>"

        f"/graphs "
        f" - Charts displayed here<br/>"

        f"/maps "
        f" - Leaflet Map of Volcanic Activities<br/>"

        f"/maps2 "
        f" - Leaflet Map of Volcanic Activities<br/>"
    )

@app.route('/scrape')
def scrape():
    volcanoes = mongo.db.volcanoes
    data = scrape_volcanoimgs.scrape()
    volcanoes.update(
        {},
        data,
        upsert=True
    )
    # return 'Scraping Volcano Images Successfully!'
    return redirect("http://localhost:5000/", code=302)

@app.route('/process')
def process():
    return render_template('process.html')

@app.route('/graphs')
def graphs():
    return render_template('graphs.html')

@app.route('/eruption_map')
def eruption_map():
    volcanoes = mongo.db.volcanoes.find_one()
    return render_template('eruption_map.html', volcanoes=volcanoes)

@app.route('/yearly_eruptions.html')
def yearly_eruptions():
    return render_template('yearly_eruptions.html')

@app.route('/risk_assessment')
def data():
    return render_template('risk_assessment.html')

@app.route('/climate')
def climate():
    return render_template('climate.html')

@app.route('/references')
def references():
    return render_template('references.html')

@app.route('/database/eruptions')
def eruptions():
    # No FillNA's
    results = session.query(Eruptions.id,Eruptions.volcano_name, Eruptions.vei, Eruptions.start_year, Eruptions.start_month, Eruptions.start_day, Eruptions.end_year, Eruptions.end_month, Eruptions.end_day, Eruptions.country, Eruptions.region, Eruptions.latitude, Eruptions.longitude, Eruptions.elevation, Eruptions.primary_volcano_type, Eruptions.status).all()
    erupt_df = pd.DataFrame(results)
    erupt_df_vs = erupt_df.fillna({'vei':'NaN','start_month':'NaN','start_day':'NaN'}).drop(['end_year', 'end_month', 'end_day'], axis=1)
    erupt_dict = erupt_df_vs.to_dict('records')
    return jsonify(erupt_dict)

@app.route('/database/risk')
def risk():
    results = session.query(Risk.id,Risk.city,Risk.country,Risk.lat,Risk.lng,Risk.pop,Risk.risk,Risk.time).all()
    risk_data_v1 = pd.DataFrame(results)
    risk_data_v2 = risk_data_v1.fillna({'id':'NeN','lat':'NeN','lng':'NeN','pop':'NeN','risk':'NeN','time':'NeN','city': 'unknown','country': 'unknown'})
    
    risk_data_v2.id = risk_data_v2.id.astype(float)
    risk_data_v2.lat = risk_data_v2.lat.astype(float)
    risk_data_v2.lng = risk_data_v2.lng.astype(float)
    risk_data_v2.risk = risk_data_v2.risk.astype(float)
    risk_data_v2.time = risk_data_v2.time.astype(float)
    
    risk_data_final = risk_data_v2.to_dict('records')
    return jsonify(risk_data_final)

@app.route('/database/tempinfo')
def tempinfo():
    results = session.query(TempInfo.id,TempInfo.year,TempInfo.temp,TempInfo.fit).all()
    tempinfo_df = pd.DataFrame(results)
    tempinfo_dict = tempinfo_df.to_dict('records')
    return jsonify(tempinfo_dict)

@app.route('/database/yearly_count')
def yearly_count():
    conn = sqlite3.connect("volcano.sqlite")
    eruptions_per_year = pd.read_sql_query('SELECT DISTINCT(start_year) as start_year, count(start_year) AS eruptions FROM eruptions GROUP BY start_year ORDER BY start_year ASC', conn)
    eruptions_per_year = eruptions_per_year.drop(eruptions_per_year.index[1614])
    eruptions_per_year = eruptions_per_year[eruptions_per_year.start_year>=1750]
    eruptions_per_year.start_year = eruptions_per_year.start_year.astype(float)
    eruptions_per_year.eruptions = eruptions_per_year.eruptions.astype(float)
    eruptions_per_year = eruptions_per_year.to_dict('records')
    return jsonify(eruptions_per_year)

volcano_dict = {1:0,
1700.042: 2.8091,
1711.5: 3.8596,
1719.5: 31.4825,
1729.5: 12.0218,
1738.5: 3.3445,
1755.5: 7.963,
1761.5: 12.9174,
1783.5: 92.9645,
1794.5: 1.8782,
1796.5: 6.6983,
1809.5: 53.74,
1815.5: 109.719,
1831.5: 16.9715,
1835.5: 40.16,
1861.5: 4.2275,
1883.5: 21.8643,
1886.5: 1.9275,
1902.5: 3.7747,
1912.5: 11.0446,
1925.5: 11.1527,
1943.5: 6.61,
1963.5: 20.8705,
1976.5: 4.7153,
1982.5: 14,
1991.5: 30.094}

index_to_year = {0:1,
1: 1783.5,
2: 1815.5,
3: 1835.5,
4: 1883.5,
5: 1963.5,
6: 1982.5,
7: 1991.5}

@app.route("/<intstring>")
def get_temps(intstring):
    #First get indices
    string_split = intstring.split(',')
    indices = string_split[0:len(string_split)-1]
    for j in range(len(indices)):
        indices[j] = int(indices[j])
    #Construct a helper function
    def theta(x): return np.heaviside(x,1)
    #Parameter of the fit model
    lamb = 2/np.log(2)
    #Define the function to get volcanic acitivity
    def vol(t):
        ret_val = 0
        for key in volcano_dict.keys():
            ret_val += volcano_dict[key]*np.exp(-(t-key)/lamb)*theta(t-key)
        for index in indices:
            year = index_to_year[index]
            ret_val -= volcano_dict[year]*np.exp(-(t-year)/lamb)*theta(t-year)
        return ret_val
    def vol_mean(t):
        ret_val = 0
        for j in range(1,7):
            ret_val += (vol(t-j/12)+vol(t+j/12))/12
        return ret_val
    #Define our fitting function
    def fitfunc(x,y):
        alpha = 8.3421049
        beta = 4.4663687
        gamma = -0.0151461
        return alpha + beta*x + gamma*y
    #get the df with Berkeley data
    mydf = pd.read_sql("SELECT * FROM berkeleydata", engine)
    #Update with our calculated volcanic acitivty
    mydf["My Volcanic"] = vol_mean(mydf["year"])
    #Update with our fit values
    mydf["My Fit"] = fitfunc(mydf["log_CO2_277_3"], mydf["My Volcanic"])
    #Trim what we won't be using
    retdf = mydf[["year", "temperature_C", "fit", "My Fit"]]
    return retdf.to_json(orient='split')

@app.route("/table")
def table():
    conn = sqlite3.connect("volcano.sqlite")
    riskdf = pd.read_sql("SELECT * FROM risk", conn)
    return riskdf.to_json(orient='split')

@app.route("/statsplot")
def get_statsplot():
    #get the df with statsplot data
    mydf = pd.read_sql("SELECT * FROM risk_stats", engine)
    return mydf.to_json(orient='split')

if __name__ == "__main__":
    app.debug = True
    app.run()