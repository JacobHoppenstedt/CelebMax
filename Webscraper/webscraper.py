import os
import csv
import time
import requests
import pandas as pd
from PIL import Image
from io import BytesIO
from tqdm import tqdm

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

# Webscraper to capture celeb images from given csv

# configs
CHROMEDRIVER_PATH = "./chromedriver.exe"
INPUT_CSV = "all_celeb_names.csv"
OUTPUT_MAPPING_CSV = "image_mapping.csv"
SAVE_DIR = "celebrity_images"
SLEEP_BETWEEN_CLICKS = 0.3
THUMBNAIL_LIMIT = 5
WAIT_TIMEOUT = 2
START_INDEX = 36077
options = webdriver.ChromeOptions()
options.add_argument("--headless")
options.add_argument("--log-level=3")
options.add_argument("--disable-gpu")

service = Service(CHROMEDRIVER_PATH)
driver = webdriver.Chrome(service=service, options=options)

os.makedirs(SAVE_DIR, exist_ok=True)

def scrape_single_image(celebrity_name):
    """
    Scrape exactly 1 image for `celebrity_name`.
    Returns local file path or None.
    """
    # Query
    query = celebrity_name + " headshot"
    search_url = f"https://www.google.com/search?tbm=isch&q={query.replace(' ', '+')}"
    driver.get(search_url)
    
    # Find the first few thumbnails
    thumbnails = driver.find_elements("css selector", "img.YQ4gaf")[:THUMBNAIL_LIMIT]
    if not thumbnails:
        print(f"No thumbnails found for {celebrity_name}")
        return None

    # Attempt each thumbnail until we get a valid large image
    for thumb in thumbnails:
        try:
            thumb.click()
            time.sleep(SLEEP_BETWEEN_CLICKS)
            
            # Wait for the large overlay image with shorter timeout
            WebDriverWait(driver, WAIT_TIMEOUT).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "img.sFlh5c.FyHeAf.iPVvYb"))
            )
            large_img = driver.find_element("css selector", "img.sFlh5c.FyHeAf.iPVvYb")
            url = large_img.get_attribute("src")
            if url and url.startswith("http"):
                # Download and save
                return download_image(url, celebrity_name)
        except Exception as e:
            # Move to the next thumbnail
            continue
    
    return None


def download_image(img_url, celeb_name):
    """
    Download the image from `img_url` and save as PNG. Returns file path or None.
    """
    safe_name = celeb_name.replace(' ', '_').replace('/', '_')
    save_path = os.path.join(SAVE_DIR, f"{safe_name}.png")

    try:
        response = requests.get(img_url, stream=True, timeout=5)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content)).convert("RGB")
        image.save(save_path, "PNG")
        print(f"Saved '{celeb_name}' to {save_path}")
        return save_path
    except Exception as e:
        print(f"Error downloading {img_url}: {e}")
        return None


# run it
def main():
    if not os.path.exists(INPUT_CSV):
        print(f"Error: CSV file '{INPUT_CSV}' not found.")
        return
    
    df = pd.read_csv(INPUT_CSV)
    if 'title' not in df.columns:
        print(f"Error: 'title' column not found in {INPUT_CSV}.")
        return
    df_subset = df.iloc[START_INDEX:].reset_index(drop=True)

    mappings = []
    for name in df_subset['title']:
        # skip blank or NaN
        if not isinstance(name, str) or not name.strip():
            continue
        
        local_path = scrape_single_image(name)
        mappings.append((name, local_path))
    
    out_df = pd.DataFrame(mappings, columns=['celebrity_name', 'image_path'])
    out_df.to_csv(OUTPUT_MAPPING_CSV, index=False)
    print(f"Mapping CSV created: {OUTPUT_MAPPING_CSV}")

    driver.quit()
    print("Closed WebDriver. All done!")

# -----------------------------------------------------------------------------
if __name__ == "__main__":
    main()
