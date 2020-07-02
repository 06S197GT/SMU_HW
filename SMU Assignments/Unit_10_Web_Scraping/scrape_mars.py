from splinter import Browser
from bs4 import BeautifulSoup as bs
import time
import datetime
import pandas as pd
from datetime import datetime
import json
import re
  

def marsData():
    #---------------------------------------------------Open Browser-------------------------------------------------------
    executable_path = {'executable_path': "Missions_to_Mars/chromedriver.exe"}
    browser = Browser('chrome', **executable_path, headless=True)
    
    #--------------------------------------------------Nasa Site Scrape----------------------------------------------------
    url = "https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest"
    browser.visit(url)
    
    html = browser.html
    soup = bs(html, 'lxml')
    
    titles = soup.find_all(class_="content_title")
    time.sleep(20)
    articles = soup.find_all(class_="article_teaser_body")

    title = ""
    for head in titles:
        if head.a:
            title = head
            break
    
    time.sleep(3)
    
    titleTxt = title.text
    article_link = f"https://mars.nasa.gov{title.a['href']}"
    articleTxt = articles[0].text
    
    #------------------------------------------------Now scrape JPL site --------------------------------------------------
    url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(url)
    html = browser.html
    soup = bs(html, 'lxml')
    
    images = soup.find(class_='carousel_item')
    main_img = images['style'].split()[1].split("'")[1]
    featured_image = f"https://www.jpl.nasa.gov{main_img}"
    time.sleep(20)
    #------------------------------------------------Next scrape twitter--------------------------------------------------
    url = "https://twitter.com/marswxreport?lang=en"
    browser.visit(url)
    html = browser.html
    soup = bs(html, "lxml")
    
    time.sleep(5)
    
    tweets = browser.find_by_tag("span")   
    tweetText = "" 
    for tweet in tweets:
        if tweet.text:
            if "InSight sol" in tweet.text:
                tweetText = tweet.text
                break
    
    time.sleep(6)
    
    links = browser.find_by_tag("a")
    tweeters = ""
    for link in links:
        if link['href']:
            if "status" in link['href']:
                tweeters = f"https://www.twitter.com{link['href']}"
                break

    #----------------------------------------Navigate to space-facts and scrape-------------------------------------------
    url = "https://space-facts.com/mars/"
    browser.visit(url)
    html = browser.html
    mars_df = pd.read_html(html)[0]
    mars_df.columns = ["Data", "Values"]
    
    html_table = mars_df.to_html(index=False)
    json.loads(mars_df.to_json(orient="records"))
    #-------------------------------------Scrape hemisphere data from astrogeology----------------------------------------
    url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    browser.visit(url)
    html = browser.html
    soup = bs(html, "lxml")
    
    page_data = soup.find_all(class_="product-item")
    
    hemi_name = []
    img_src = []
    imageURL = []
    
    for href in page_data:
        if href['href']:
            if "Viking" in href['href']:
                img_src.append(href['href'])

    src_list = (list(set(img_src)))
    
    base_page = "https://astrogeology.usgs.gov"

    for x in range(4):
        image_page = f"{base_page}{src_list[x]}"
        browser.visit(image_page)
        html = browser.html
        soup = bs(html, "lxml")
        hemi_title = soup.find(class_="title").text
        hemi_name.append(hemi_title)
        img_full = soup.find("img", class_="wide-image")["src"]
        imageURL.append(f"{base_page}{img_full}")
    
    
    browser.quit()
    
    #-------------------------------------------Create dictionary for MongoDB---------------------------------------------
    mars_dict = {
        "articleTitle": titleTxt,
        "article_link": article_link,
        "articleText": articleTxt,
        "featuredimage_URL": featured_image,
        "weatherTweetTxt": tweetText,
        "weatherTweet_URL": tweeters,
        "mars_html_stats": html_table,
        "mars_json_stats": json.loads(mars_df.to_json(orient="records")),
        "hemispheres": [{"title":hemi_name[0], "img_url": imageURL[0]},
                        {"title":hemi_name[1], "img_url": imageURL[1]},
                        {"title":hemi_name[2], "img_url": imageURL[2]},
                        {"title":hemi_name[3], "img_url": imageURL[3]}],
        "active": 1,
        "data_scraped_on": datetime.now()
    }
    return mars_dict

if __name__ == "__main__":
    print(marsData())