

from __future__ import print_function
import spiceypy as spice
from flask import Flask
app = Flask(__name__)


@app.route("/")
def print_ver():
       """Prints the TOOLKIT version"""
       return(spice.tkvrsn('TOOLKIT'))





if __name__ == '__main__':
       print_ver()