#
# Solution getsta.py
#
from __future__ import print_function

from http.server import HTTPServer, SimpleHTTPRequestHandler

from flask_restful import Resource, Api, reqparse

import spiceypy
from flask import Flask, jsonify, request
app = Flask(__name__)
api = Api(app)
from flask_cors import CORS, cross_origin

CORS(app)

@app.after_request
def after_request(response):

  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  print("CORS")
  return response

#make different types of calls for different spice calcs(rotation vector, positioning)
class SpiceCalc(Resource):

    def get(self):

        print("init post")


        target = request.args.get('planet')
        #target = "EARTH"
        print("arguments sent")

        METAKR = 'getsa.tm'
        obs='SUN'
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


        print( 'Converting UTC Time: {:s}'.format(utctim)  )

        #
        #Convert utctim to ET.
        #
        et = spiceypy.str2et( utctim )

        print( '   ET seconds past J2000: {:16.3f}'.format(et) )


        [return_pos, ltime] = spiceypy.spkpos( target, et,        'J2000',
                                        'LT+S',  obs,         )

        print( '   Apparent position of Earth as '
               'seen from Sun in the J2000\n'
               '      frame (km):'                )
        print( '      X = {:16.3f}'.format(return_pos[0])  )
        print( '      Y = {:16.3f}'.format(return_pos[1])  )
        print( '      Z = {:16.3f}'.format(return_pos[2])  )

        #
        # We need only display LTIME, as it is precisely the
        # light time in which we are interested.
        #
        print( '   One way light time between Sun and '
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
    app.run(host='0.0.0.0', port=8000, debug=True)