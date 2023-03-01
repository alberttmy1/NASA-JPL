#
# Solution getsta.py
#
from __future__ import print_function

from http.server import HTTPServer, SimpleHTTPRequestHandler

from flask_restful import Resource, Api, reqparse

import spiceypy
from flask import Flask, jsonify
app = Flask(__name__)
api = Api(app)
from flask_cors import CORS

CORS(app)

@app.after_request
def after_request(response):
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

#make different types of calls for different spice calcs(rotation vector, positioning)
class SpiceCalc(Resource):
    def get(self):
        # self.send_header('Access-Control-Allow-Origin', '*')
        # SimpleHTTPRequestHandler.end_headers(self)
        print("init post")
        #
        # Local parameters
        #



        parser = reqparse.RequestParser()  # initialize

        parser.add_argument('METAKR', required=True)  # add args
        parser.add_argument('target', required=True)
        parser.add_argument('obs', required=True)
        parser.add_argument('utctim', required=True)
        print("arguments sent")
        # args = parser.parse_args()
        # print("arguments parsed")
        #
        # METAKR = args['METAKR']
        # target = args['target']
        # obs = args['obs']
        # utctim = args['utctim']

        METAKR = 'getsa.tm'
        target = 'EARTH'
        obs='CASSINI'
        utctim = "2004 jun 11 19:32:00"
        print(METAKR)
        print(target)
        print(obs)
        print(utctim)

        #
        # Load the kernels that this program requires.  We
        # will need a leapseconds kernel to convert input
        # UTC time strings into ET.  We also will need the
        # necessary SPK files with coverage for the bodies
        # in which we are interested.
        #
        spiceypy.furnsh( METAKR )

        #
        #Prompt the user for the input time string.
        #
        #utctim = input( 'Input UTC Time: ' )

        print( 'Converting UTC Time: {:s}'.format(utctim)  )

        #
        #Convert utctim to ET.
        #
        et = spiceypy.str2et( utctim )

        print( '   ET seconds past J2000: {:16.3f}'.format(et) )


        #
        # Compute the apparent position of Earth as seen from
        # CASSINI in the J2000 frame.  Note: We could have
        # continued using spkezr and simply ignored the
        # velocity components.
        #
        [return_pos, ltime] = spiceypy.spkpos( target, et,        'J2000',
                                        'LT+S',  obs,         )

        print( '   Apparent position of Earth as '
               'seen from CASSINI in the J2000\n'
               '      frame (km):'                )
        print( '      X = {:16.3f}'.format(return_pos[0])  )
        print( '      Y = {:16.3f}'.format(return_pos[1])  )
        print( '      Z = {:16.3f}'.format(return_pos[2])  )

        #
        # We need only display LTIME, as it is precisely the
        # light time in which we are interested.
        #
        print( '   One way light time between CASSINI and '
               'the apparent position\n'
               '      of Earth (seconds):'
               ' {:16.3f}'.format(ltime) )





        #
        # Compute the distance between the body centers in
        # kilometers.
        #
        dist = spiceypy.vnorm( return_pos )

        #
        # Convert this value to AU using convrt.
        #
        dist = spiceypy.convrt( dist, 'KM', 'AU' )

        print( '   Actual distance between'+ target + 'and' + obs
                +'body centers:\n'
               '      (AU): {:16.3f}'.format(dist) )




        spiceypy.unload(METAKR)

        return jsonify({"x":return_pos[0], "y":return_pos[1], "z":return_pos[2] ,"dist":dist})

api.add_resource(SpiceCalc, '/calc')

if __name__ == '__main__':
    app.run(port=5000, debug=True)