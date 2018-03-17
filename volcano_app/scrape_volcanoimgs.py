#Project 02 - Volcanoes
#Brett Brandom, Joshua Bui, Jonathan Orozco, Caitlyn Ta
#Web Scraping for Volcano images 

# import libraries and dependencies

import time
from splinter import Browser
from bs4 import BeautifulSoup as bs
import requests
import pandas as pd
import numpy as np
from selenium import webdriver
import re


def init_browser():
	
	executable_path = {'executable_path': 'chromedriver'}
	browser = Browser('chrome', **executable_path, headless=True)
	return browser
	

def scrape():
	browser = init_browser()
	volcanoes = {}

	#visit volcano site for images
	vol_url = 'http://volcano.si.edu/'
	browser.visit(vol_url)
	html = browser.html
	soup = bs(html, 'html.parser')
	vol_img = []

	for link in soup.find_all(alt="Volcano photo slideshow"):
   		vol_img.append(f'http://volcano.si.edu{link["src"]}')
	# print(vol_img)
	volcanoes['vol_img'] = vol_img

	# Retrieve Volcano Twitter Feeds
	# Retrieve latest twitter feeds about volcanoes from USGS Volcanoes twitter site
	# USGS Volcanoes
	usgsvolcano_url = 'https://twitter.com/usgsvolcanoes?lang=en'
	# Retrieve data from USGS Volcanoes
	html = requests.get(usgsvolcano_url)
	#Create BeautifulSoup object; parse with 'html.parser'
	soup = bs(html.text, 'html.parser')
	vol_tweet = []
	# Find the div that will allow you to retrieve USGS Volcanoes tweets
	usgs_vol_tweet = soup.find_all('p', class_='TweetTextSize TweetTextSize--normal js-tweet-text tweet-text')[0].text
	vol_tweet.append(usgs_vol_tweet)
	#print(usgs_vol_tweet)
	volcanoes['vol_tweet'] = vol_tweet



	# Volcanos News
	# Visit Science Daily to get news on volcanoes
	vol_news_url = 'https://www.sciencedaily.com/news/earth_climate/volcanoes/'
	browser.visit(vol_news_url)
	# Retrieve data from Science Daily
	html = browser.html
	#Create BeautifulSoup object; parse with 'html.parser'
	soup = bs(html, 'html.parser')
	vol_dailynews_link = []
	vol_dailynews_title =[]
	abstract = []
	
	# Find the div that will allow you to retrieve the news title
	# Use this html, do not go back to the website to look for it
	# Latest news title
	vol_dailynews_title = soup.find_all("h3", class_="hero")[0].text
	volcanoes['vol_dailynews_title'] = vol_dailynews_title

	link = soup.find_all('div', class_='col-xs-6 col-md-3')[0].find_all('a', href=True)[0]['href']
	volcanoes['vol_dailynews_link'] = 'https://www.sciencedaily.com'+link
	

	url2 = 'https://www.sciencedaily.com'+link
	browser.visit(url2)
	html = browser.html
	soup = bs(html, 'html.parser')
	abstract.append(soup.find(id="abstract").text.replace('\n',""))
	volcanoes['abstract'] = abstract
	

	# Volcanoes - Latest Headlines
	# Visit Science Daily to get latest headlines on volcanoes
	vol_headline_url = 'https://www.sciencedaily.com/news/earth_climate/volcanoes/'
	browser.visit(vol_headline_url)
	# Retrieve data from Science Daily
	html = browser.html
	#Create BeautifulSoup object; parse with 'html.parser'
	soup = bs(html, 'html.parser')
	vol_headline_link = []
	vol_headline_title = []
	# Find the div that will allow you to retrieve the latest headline
	# Use this html, do not go back to the website to look for it
	# Latest headline
	vol_headline_title = soup.find_all("h3", class_="latest-head")[0].text
	volcanoes['vol_headline_title'] = vol_headline_title

	vol_headline_link = soup.find_all("h3", class_="latest-head")[0].find("a", href=True)['href']
	volcanoes['vol_headline_link']='https://www.sciencedaily.com'+ vol_headline_link
	

	vei_table_html = []
	vei_url = 'https://www.ngdc.noaa.gov/nndc/DescribeField.jsp?dataset=102557&s=77&field_name=HAZ.VOLCANO_EVENT.VEI'
	tables = pd.read_html(vei_url)[0]
	tablesv1 = tables.rename(columns=tables.iloc[0]).drop(tables.index[0]).reset_index(drop=True)
	tablesv2 = tablesv1.drop(tablesv1.index[9])
	tablesv3 = tablesv2.set_index('VEI',drop=True)
	vei_table = tablesv3.to_html()
	volcanoes['vei_table_html'] = vei_table
	return volcanoes