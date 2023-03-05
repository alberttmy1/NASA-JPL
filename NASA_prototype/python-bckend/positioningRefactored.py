from flask import Flask, request
from flask import jsonify
import spiceypy
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api, reqparse


app = Flask(__name__)
api = Api(app)
CORS(app)

@app.route('/orbits', methods=['GET'])
def return_position():
    METAKR = 'getsa.tm'
    target = request.args.get('planet')
    obs = 'SUN'
    utctim = "2004 jun 11 19:32:00"
    print(target)

    spiceypy.furnsh(METAKR)
    et = spiceypy.str2et(utctim)
    [return_pos, ltime] = spiceypy.spkpos(target, et, 'J2000',
                                          'LT+S', obs, )

    spiceypy.unload(METAKR)


    print(jsonify({"x": return_pos[0], "y": return_pos[1], "z": return_pos[2]}))

    return jsonify({"x": return_pos[0], "y": return_pos[1], "z": return_pos[2]})

#api.add_resource(SpiceCalc, '/orbits')

if __name__ == "__main__":
    app.run(threaded=True, port=5000)




