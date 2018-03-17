
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import datetime as dt
from functools import partial
from decimal import Decimal

import warnings
warnings.filterwarnings('ignore')

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, func, and_, or_

import seaborn as sns
import matplotlib.dates as mdates
import matplotlib.ticker as ticker


from flask import Flask, jsonify

import time
from splinter import Browser
from bs4 import BeautifulSoup as bs
from selenium import webdriver
import re


# In[2]:


# df0_sig = pd.read_csv("raw_data/Significant_Volcanic_Eruption.csv")
# df0_sig.info()
# df0_sig.head()


# In[3]:


# df1_sig = df0_sig[[
#     'Year', 'Month'
#     , 'Day', 'TSU'
#     , 'EQ', 'Name'
#     , 'Location', 'Country'
#     , 'Latitude', 'Longitude'
#     , 'Elevation', 'Type'
#     , 'Status', 'Time'
#     , 'VEI', 'Agent'
#     ]].fillna(0)

# df1_sig.info()
# df1_sig.head()


# ## Data Set 1: Volcanos with Confirmed Erruptions -- Smithsonian Institute Global Volcanism Program
# http://volcano.si.edu/database/search_eruption_results.cfm
# - confirmed erruptions database search results

# In[4]:


df0_erupt_gvp = pd.read_excel("raw_data/GVP_Eruption_Results.xlsx", sheetname='Eruption List')
df0_erupt_gvp.info()
df0_erupt_gvp.head()


# In[5]:


df1_erupt_gvp = df0_erupt_gvp.rename(
    columns = df0_erupt_gvp.iloc[0]).drop(
    df0_erupt_gvp.index[0]).reset_index(drop=True)

df1_erupt_gvp.info()
df1_erupt_gvp.head()


# In[6]:


df1_erupt_gvp.Latitude[0]
type(df1_erupt_gvp.Latitude[0])


# #### Descriptions of VEI found in the link below
# https://www.ngdc.noaa.gov/nndc/DescribeField.jsp?dataset=102557&s=77&field_name=HAZ.VOLCANO_EVENT.VEI
#  - filled NaN with 0 

# In[7]:


df2_erupt_gvp = df1_erupt_gvp[[
    'Volcano Number'
    ,'Volcano Name'
   ,'VEI','Start Year'
   ,'Start Month','Start Day'
   ,'End Year','End Month','End Day'
   ,'Latitude','Longitude'
]].apply(
    partial(
        pd.to_numeric
        , errors='ignore'
    ))
df2_erupt_gvp.info()
df2_erupt_gvp


# In[8]:


df2_erupt_gvp.Latitude[0]
type(df2_erupt_gvp.Latitude[2])


# ## Data Set 2: Volcanos With Metadata -- Smithsonian Institute
# http://volcano.si.edu/database/search_volcano_results.cfm
# - All volcanos

# In[9]:


df0_vol_gvp = pd.read_excel("raw_data/GVP_Volcano_List_ALL.xlsx", sheetname='Volcano List')
df0_vol_gvp.info()
# df0_vol_meta.head()


# In[10]:


df1_vol_gvp = df0_vol_gvp.rename(
    columns=df0_vol_gvp.iloc[0]).drop(
    df0_vol_gvp.index[0]).reset_index(drop=True)

df1_vol_gvp.info()
df1_vol_gvp.head()


# In[11]:


df2_vol_gvp = df1_vol_gvp[[
    'Volcano Number'
    ,'Volcano Name'
    ,'Country','Region'
    ,'Latitude'
    ,'Longitude','Elevation'
    ,'Evidence Category'
    ,'Primary Volcano Type'
]].dropna(subset = ['Country']).reset_index(drop=True).apply(
    partial(
        pd.to_numeric
        , errors='ignore'))

df2_vol_gvp.info()
df2_vol_gvp


# In[12]:


type(df2_vol_gvp.Latitude[2])


# ## Merge Data Sets 1 & 2

# In[13]:


df_erupt_merge0 = pd.merge(
    df2_erupt_gvp, df2_vol_gvp, 
    how='left', 
    on=['Volcano Number',
        'Volcano Name',
        'Latitude',
        'Longitude'], 
    left_on=None, right_on=None,
    left_index=False, right_index=False, 
    sort=True, suffixes=('_x', '_y'), 
    copy=True, indicator=False)

df_erupt_merge0.info()
df_erupt_merge0.head()

#######################################################
#### This merge causese Lat/Long to be a floating point 
#### with more than numbers more than 3 decimals places
#######################################################

df_erupt_merge0.to_csv('data_check/EruptionData0_chk.csv')


# In[14]:


for index, row in df_erupt_merge0.iterrows():
    df_erupt_merge0['Latitude'][index] = round(row['Latitude'],3)
    print('.', end='')


# In[15]:


type(df_erupt_merge0['Latitude'][0])
df_erupt_merge0['Latitude'][0]


# ## Comprehensive list of Volcanos -- NOAA
# https://www.ngdc.noaa.gov/nndc/struts/results?type_0=Like&query_0=&op_8=eq&v_8=&type_10=EXACT&query_10=None+Selected&le_2=&ge_3=&le_3=&ge_2=&op_5=eq&v_5=&op_6=eq&v_6=&op_7=eq&v_7=&t=102557&s=5&d=5

# In[16]:


url = 'https://www.ngdc.noaa.gov/nndc/struts/results?type_0=Like&query_0=&op_8=eq&v_8=&type_10=EXACT&query_10=None+Selected&le_2=&ge_3=&le_3=&ge_2=&op_5=eq&v_5=&op_6=eq&v_6=&op_7=eq&v_7=&t=102557&s=5&d=5'
noaa_tablesv0 = pd.read_html(url)[1]

noaa_tablev1 = noaa_tablesv0.rename(
    columns = noaa_tablesv0.iloc[1]).drop(
    noaa_tablesv0.index[[0,1]]).reset_index(drop=True)


# In[17]:


noaa_vol_table = noaa_tablev1[[
    'Volcano Name', 
    'Country', 'Region', 
    'Latitude', 'Longitude', 
    'Elev', 'Type', 'Status']].apply(
    partial(
        pd.to_numeric
        , errors='ignore'
    )).rename(columns = {
    'Elev':'Elevation',
    'Type':'Primary Volcano Type'}).drop_duplicates([
    'Volcano Name','Country','Region'])

noaa_vol_table.info()
noaa_vol_table


# In[18]:


type(noaa_vol_table.Latitude[0])
noaa_vol_table.Latitude[0]


# In[19]:


noaa_vol_table.info()
print('')
df_erupt_merge0.info()
noaa_vol_table.to_csv('data_check/noaa_vol_table1_chk.csv')


# ## Merging Data Sets (1/2) + 3

# In[20]:


df_erupt_merge2 = pd.merge(df_erupt_merge0[[
    'Volcano Name','VEI',
    'Start Year','Start Month','Start Day',
    'End Year','End Month','End Day',
    'Country','Region','Latitude',
    'Longitude','Elevation', 
    'Primary Volcano Type']], noaa_vol_table[[
    'Volcano Name','Country','Region',
    'Latitude', 'Longitude',
    'Elevation','Primary Volcano Type',
    'Status']], how='left', on=['Volcano Name','Latitude', 'Longitude'], left_on=None, right_on=None,
         left_index=False, right_index=False, sort=True,
         suffixes=('_x', '_y'), copy=True, indicator=False)

df_erupt_merge2.info()
df_erupt_merge2

# s1 = 'Primary Volcano Type'
# s2 = 'Status'

# x = vol_table[s1].isnull().sum()
# y = vol_table[s2].isnull().sum()

# print(f'There are {x} unknown {s1} values.\n There are {y} unknown {s2} values')


# In[21]:


df_erupt_merge2.to_csv('data_check/EruptionData1_chk.csv') 


# In[22]:


df_erupt_merge3 = df_erupt_merge2.where((pd.notnull(df_erupt_merge2)), None)

for index, row in df_erupt_merge3.iterrows():
    if row['Country_x'] is None:
        print('.', end='')
        row['Country_x'] = row['Country_y']
        row['Primary Volcano Type_x'] = row['Primary Volcano Type_y']
        row['Region_x'] = row['Region_y']
        row['Elevation_x'] = row['Elevation_y']
    else:
        print('-', end = '')


# #### Handling Start Date Tip
# https://www.ngdc.noaa.gov/nndc/DescribeField.jsp?dataset=102557&s=77&field_name=HAZ.VOLCANO_EVENT.DAY
# 
# Day:
# Valid values: 1-31 (where months apply)
# The Date and Time are given in Universal Coordinated Time (also known as Greenwich Mean Time). The local date may be one day different.

# In[23]:


df_erupt_merge4 = df_erupt_merge3.drop([
    'Country_y','Region_y',
    'Elevation_y',
    'Primary Volcano Type_y'], axis=1).rename(columns = {
    'Country_x' : 'Country',
    'Region_x' : 'Region',
    'Elevation_x' : 'Elevation',
    'Primary Volcano Type_x' : 'Primary Volcano Type'})
# .fillna({
#     'VEI':0,'Start Month':0,'Start Day':0,
#     'End Year':0,'End Month':0,'End Day':0})

df_erupt_merge4.info()


# In[24]:


# remove row with no start erruption date

for index, row in df_erupt_merge4.iterrows():
    if row['Start Year']is None:
        df_erupt_merge4.drop(index, inplace=True)
    else:
        print('.',end='')
df_erupt_merge4.info()


# In[25]:


df_erupt_merge4.to_csv('data_check/EruptionData2_chk.csv', index=False)


# In[26]:


df3_vol_gvp =  df2_vol_gvp[['Volcano Name','Country','Region','Latitude','Longitude','Elevation','Primary Volcano Type']].dropna(subset = ['Country']).reset_index(drop=True)
df3_vol_gvp.info()
df3_vol_gvp


# ## Merge by Name & Latitude (Floating Point Issue Resolved)

# In[27]:


df_erupt_merge5 = pd.merge(df_erupt_merge4, df3_vol_gvp, how='left', on=['Volcano Name','Latitude'], left_on=None, right_on=None,
         left_index=False, right_index=False, sort=True,
         suffixes=('_x', '_y'), copy=True, indicator=False)

df_erupt_merge5.info()
df_erupt_merge5


# In[28]:


df_erupt_merge5.to_csv('data_check/EruptionData3_chk.csv')


# In[29]:


df_erupt_merge6 = df_erupt_merge5.where((pd.notnull(df_erupt_merge5)), None)

for index, row in df_erupt_merge6.iterrows():
    if row['Country_x'] is None:
        print('.', end='')
        row['Country_x'] = row['Country_y']
        row['Region_x'] = row['Region_y']
        row['Elevation_x'] = row['Elevation_y']
        row['Primary Volcano Type_x'] = row['Primary Volcano Type_y']
    else:
        print('-', end = '')

df_erupt_merge7 = df_erupt_merge6.drop([
    'Longitude_y','Country_y',
    'Region_y','Elevation_y',
    'Primary Volcano Type_y'], axis=1).rename(columns = {
    'Country_x' : 'Country',
    'Region_x' : 'Region',
    'Longitude_x' : 'Longitude',
    'Elevation_x' : 'Elevation',
    'Primary Volcano Type_x' : 'Primary Volcano Type'})


# In[30]:


df_erupt_merge7.to_csv('data_check/EruptionData4_chk.csv')


# ## Re-merge by Lat/Long

# In[31]:


df_erupt_merge8 = pd.merge(df_erupt_merge7, df3_vol_gvp, how='left', on=['Latitude', 'Longitude'], left_on=None, right_on=None,
         left_index=False, right_index=False, sort=True,
         suffixes=('_x', '_y'), copy=True, indicator=False)

df_erupt_merge8.info()
df_erupt_merge8


# In[32]:


df_erupt_merge8.to_csv('data_check/EruptionData5_chk.csv')


# In[33]:


df_erupt_merge9 = df_erupt_merge8.where((pd.notnull(df_erupt_merge8)), None)

for index, row in df_erupt_merge9.iterrows():
    if row['Country_x'] is None:
        print('.', end='')
        row['Country_x'] = row['Country_y']
        row['Region_x'] = row['Region_y']
        row['Elevation_x'] = row['Elevation_y']
        row['Primary Volcano Type_x'] = row['Primary Volcano Type_y']
    else:
        print('-', end = '')

df_erupt_final = df_erupt_merge9.drop([
    'Volcano Name_y',
    'Country_y','Region_y','Elevation_y',
    'Primary Volcano Type_y'], axis=1).rename(columns = {
    'Volcano Name_x':'Volcano Name',
    'Country_x' : 'Country',
    'Region_x' : 'Region',
    'Elevation_x' : 'Elevation',
    'Primary Volcano Type_x' : 'Primary Volcano Type'})


# In[34]:


df_erupt_final.to_csv('clean_eruptions.csv', index=True)


# In[37]:


df_erupt_final.to_excel('clean_eruptions.xlsx', index=True)

