#Import dependencies
import numpy as np
import pandas as pd
from sqlalchemy import create_engine

#Setup Class
class VacaHelper():
    #Define the class, create connect path to DB and create engine
    def __init__(self):
        self.connection_string = "sqlite:///hawaii.sqlite"
        self.engine = create_engine(self.connection_string)
    #Define 1st query
    def getAllRows(self):
        query = f"""
                    SELECT
                        m.station,
                        s.name,
                        s.latitude,
                        s.longitude,
                        s.elevation,
                        m.prcp,
                        m.tobs,
                        m.date
                    FROM
                        measurement m
                        join station s on m.station = s.station

                """
        #Establish connection and return DataFrame from SQL Query
        conn = self.engine.connect()
        everything_df = pd.read_sql(query, conn)
        conn.close()

        return everything_df

    #Define 2nd query
    def all_prcp(self):
        query = """
                    SELECT
                        date,
                        prcp
                    FROM
                        measurement 
                    GROUP BY
                        date  
                """

        conn = self.engine.connect()
        twelve_month_df = pd.read_sql(query, conn)
        conn.close()
        #Establish connection and return DataFrame from SQL Query
        return twelve_month_df

    #Define 3rd query
    def all_stations(self):
        query = """
                    SELECT 
                        station,
                        name,
                        latitude,
                        longitude,
                        elevation
                    FROM 
                        station
                """
        conn = self.engine.connect()
        all_stations_df = pd.read_sql(query, conn)
        conn.close()
        #Establish connection and return DataFrame from SQL Query
        return all_stations_df

    #Define 4th query
    def twelve_month_tobs(self):
        query =  """
                    SELECT
                        date,
                        tobs
                    FROM
                        measurement 
                    WHERE
                        date >= '2016-08-01' and date <= '2017-12-31'
                    GROUP BY
                        station
                    ORDER BY
                        count(station) 
                """
        conn = self.engine.connect()
        twelve_tobs_df = pd.read_sql(query, conn)
        conn.close()
        #Establish connection and return DataFrame from SQL Query
        return twelve_tobs_df

    #Define 5th query
    def filter_temp(self, startdate):
        query = f"""
                    SELECT
                        MIN(m.tobs) as TMIN,
                        AVG(m.tobs) as TAVG,
                        MAX(m.tobs) as TMAX,
                        m.date
                    FROM
                        measurement m
                        join station s on m.station = s.station
                    WHERE
                        m.date = '{startdate}'
                """

        conn = self.engine.connect()
        everything_df = pd.read_sql(query, conn)
        conn.close()
        #Establish connection and return DataFrame from SQL Query
        return everything_df

    #Define 6th query
    def filter_temp_range(self, start_date, end_date):
        query = f"""
                    SELECT
                        MIN(m.tobs) as TMIN,
                        AVG(m.tobs) as TAVG,
                        MAX(m.tobs) as TMAX,
                        m.date
                    FROM
                        measurement m
                        join station s on m.station = s.station
                    WHERE
                        m.date BETWEEN '{start_date}' AND '{end_date}'
                """

        conn = self.engine.connect()
        everything_df = pd.read_sql(query, conn)
        conn.close()
        #Establish connection and return DataFrame from SQL Query
        return everything_df