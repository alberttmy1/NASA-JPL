import cspice

/*
    load LSK file
*/
furnsh_c  ( "naif0008.tls" );

SpiceDouble   radii[3];
SpiceDouble   et;

/*
    retrieve Mars radii
*/
bodvrd_c ( "MARS", "RADII", 3, &n, radii );

/*
    convert UTC to ET: it seems we always need to convert to ET(all the examples have it)
*/
str2et_c ( "2006 JAN 31 01:00", &et );


/*
This seems pretty important, it's basically what we're wanting to do: take a spacecraft mission name
and turn it into a rendering of all the orbiting bodies 

implications: We load in all the kernels somehow , how ? idk. then we present the user with a friendly name choice 

The following example computes the set of orbital elements for the
   state of the Mars Express spacecraft at a given time:
   */

SpiceInt      n;
SpiceDouble   gm;
SpiceDouble   et;
SpiceDouble   state[6];
SpiceDouble   lt;
SpiceDouble   elts[8];

/*
    load kernels: LSK, MEX trajectory SPK, and gravity PCK
*/
furnsh_c ( "naif0008.tls" );
furnsh_c ( "ORMM__050901000000_00165.BSP" );
furnsh_c ( "DE403-MASSES.TPC" );

/*
    retrieve GM for Mars
*/
bodvrd_c ( "MARS", "GM", 1, &n, gm );

/*
    convert UTC to ET
*/
str2et_c ( "2005 SEP 02 04:50:45", &et );

/*
    compute state of MEX at given UTC
*/
spkezr_c ( "MEX", et, "MARSIAU", "NONE", "MARS",
            state, &lt );

/*
    compute orbital elements
*/
oscelt_c ( state, et, gm, elts );


/*
We are allowing the user to set the time parameter of their constraints: this is how. 

implications: the user can set step (1 day, 5 days, etc) along with time frame parameters 

The following example determines time intervals between Jan 1 and
and April 1, 2007 when the distance between the Moon and the Earth
was greater than 400,000 km.
*/

#define  MAXWIN  200

SPICEDOUBLE_CELL      ( cnfine, MAXWIN );
SPICEDOUBLE_CELL      ( result, MAXWIN );

SpiceDouble             adjust;
SpiceDouble             et0;
SpiceDouble             et1;
SpiceDouble             refval;
SpiceDouble             step;

/*
    Load kernels.
*/
furnsh_c( "naif0008.tls" );
furnsh_c( "de421.bsp"    );

/*
    Store the time bounds in the confinement window.
*/
str2et_c ( "2007 JAN 1", &et0 );
str2et_c ( "2007 APR 1", &et1 );

wninsd_c ( et0, et1, &cnfine );

/*
    Set search parameters. Use a step size of 1 day (in units of
    seconds).
*/
step   = spd_c();
refval = 4.e5;
adjust = 0.0;

/*
    Perform search.
*/
gfdist_c ( "MOON", "NONE", "EARTH", ">",     refval,
            adjust, step,   MAXWIN,  &cnfine, &result );

/* Where to find all the kernels 

Suppose in our example above the MGS kernels reside in the path

   /flight_projects/mgs/SPICE_kernels

and the other kernels reside in the path
   
   /generic/SPICE_kernels

   */