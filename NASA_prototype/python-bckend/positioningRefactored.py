from flask import Flask, request
from flask import jsonify
import spiceypy
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api, reqparse
import subprocess


app = Flask(__name__)
api = Api(app)
CORS(app)

@app.after_request
def after_request(response):
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  print("CORS")
  return response

@app.route('/orbits', methods=['GET'])
def return_position():
    METAKR = 'getsa.tm'
    target = request.args.get('planet')
    utctim = request.args.get('utc')
    obs = 'SUN'
    if(utctim == None):
        utctim = "2004 jun 11 19:32:00"
    #utctim = "2004 jun 11 19:32:00"
    print(target)

    spiceypy.furnsh(METAKR)
    et = spiceypy.str2et(utctim)
    [return_pos, ltime] = spiceypy.spkpos(target, et, 'J2000',
                                          'LT+S', obs, )

    spiceypy.unload(METAKR)


    print(jsonify({"x": return_pos[0], "y": return_pos[1], "z": return_pos[2]}))

    return jsonify({"x": return_pos[0], "y": return_pos[1], "z": return_pos[2]})

#Endpoint: form_data.
#Description: a function that processes the requested object and time with spkpos through the form
@app.route('/form_data', methods=['GET'])
def return_position_form():
    METAKR = 'getsa.tm' #Kernel name. getsa.tm is a metakernel that processes the data for the CASSINI misison. Eventually this will work with all missions
    target = request.args.get('Planet') #planet: self explanatory
    obs = 'SUN' #for now, all missions will be observed from the reference frame of the sun.
    utctim = request.args.get('Time') #time: the requested time
    print(target)

    spiceypy.furnsh(METAKR) #load the kernel.
    et = spiceypy.str2et(utctim) #CONVERT TIME TO UTC
    [return_pos, ltime] = spiceypy.spkpos(target, et, 'J2000',
                                          'LT+S', obs, )

    spiceypy.unload(METAKR)


    print(jsonify({"x": return_pos[0], "y": return_pos[1], "z": return_pos[2]}))

    return jsonify({"x": return_pos[0], "y": return_pos[1], "z": return_pos[2]}) #RETURN COORDINATES IN JSON.

@app.route('/get_body', methods=['GET'])
def getBody():
    kernel = request.args.get('kernels')  # planet: self explanatory
    ids = []
    idso = []
    bodylist = []
    # for x in Kernels:
    #     ids = spiceypy.spkobj(Kernels, idso)
    #     for i in range(len(ids)):
    #         body = spiceypy.bodc2n(ids[i])
    #         bodylist.append(body)
    ids = spiceypy.spkobj(kernel, idso)
    for i in range(len(ids)):
        body = spiceypy.bodc2n(ids[i])
        bodylist.append(body)
    return bodylist


@app.route('/')
def index():
    # A welcome message to test our server
    return "<h1>Welcome to spice-api!</h1>"

#api.add_resource(SpiceCalc, '/orbits')

if __name__ == "__main__":
    app.run(threaded=True, port=5000)




