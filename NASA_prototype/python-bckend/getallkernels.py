import requests
from bs4 import BeautifulSoup
import json

missions = ["APOLLO", "BEPICOLOMBO", "CASSINI","CHANDRA", 
"CLEMENTINE","CONTOUR","DART","DAWN","DEEPIMPACT","DS1","EUROPACLIPPER","EXOMARS2016","FIDO","GIOTTO","GLL","GNS","GRAIL",
"HAYABUSA", "HELIOS", "HST","INSIGHT","IUE","JUNO","JWST","LADEE","LPM","LRO","LUCY","LUNARORBITER",
"M01", "M10",  "M2", "M9", "MARS2020", "MAVEN", "MCO", "MER", "MESSENGER", "MEX", "MGN", "MGS", "MPF", "MPL", "MRO", 
"MSL", "MSR", "NEAR", "NEWHORIZONS", "NOZOMI", "ORX", "PHOBOS88", "PHOENIX", "PHSRM", "PIONEER10", "PIONEER11", "PIONEER12", 
"PIONEER6", "PIONEER8", "PSYCHE", "ROCKY7", "ROSETTA", "SDU", "SELENE", "SIRTF", "SMAP", "SMART1", "SPP", "STEREO", "TDRSS", 
"THEMIS", "ULYSSES", "VEGA", "VEX", "VIKING", "VOYAGER"]; 

missions_dict = {}

def get_bsp_links(mission):
    url = f"https://naif.jpl.nasa.gov/pub/naif/{mission}/kernels/spk/"
    r = requests.get(url)
    soup = BeautifulSoup(r.content, "html.parser")
    links = []
    for link in soup.find_all("a"):
        href = link.get("href")
        if href and href.endswith(".bsp"):
            links.append(href)
    return links

for m in missions: 
    bsp_links = get_bsp_links(m)
    missions_dict[m] = bsp_links


# write missions dictionary to a file
with open('missions.json', 'w') as f:
    json.dump(missions_dict, f)

# read missions dictionary from the file
with open('missions.json', 'r') as f:
    missions = json.load(f)

# print the dictionary
print(missions)