import spiceypy as spice
def printStatemet():

    METAKR = 'getsa.tm'
    target = 'Earth'
    obs = 'EARTH'
    utctim = "2004 jun 11 19:32:00"
    print(target)

    spice.furnsh(METAKR)
    et = spice.str2et(utctim)
    [return_pos, ltime] = spice.spkpos(target, et, 'J2000',
                                          'LT+S',obs, )
    print(return_pos)
if __name__ == "__main__":
    printStatemet()
