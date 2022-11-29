// Test App.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>

extern "C" {
    #include "SpiceUsr.h"
    #include "SpiceCK.h"
    #include "SpiceZpr.h"
}


int main()
{
    // furnsh_c("mykernels.furnsh");

    #define  MAXWIN  200

    SPICEDOUBLE_CELL(cnfine, MAXWIN);
    SPICEDOUBLE_CELL(result, MAXWIN);

    SpiceDouble             adjust;
    SpiceDouble             et0;
    SpiceDouble             et1;
    SpiceDouble             refval;
    SpiceDouble             step;

    /*
        Load kernels.
    */
    furnsh_c("naif0008.tls");
    furnsh_c("de421.bsp");

    /*
        Store the time bounds in the confinement window.
    */
    str2et_c("2007 JAN 1", &et0);
    str2et_c("2007 APR 1", &et1);

    wninsd_c(et0, et1, &cnfine);

    /*
        Set search parameters. Use a step size of 1 day (in units of
        seconds).
    */
    step = spd_c();
    refval = 4.e5;
    adjust = 0.0;

    /*
        Perform search.
    */
    gfdist_c("MOON", "NONE", "EARTH", ">", refval,
        adjust, step, MAXWIN, &cnfine, &result);
    
    std::cout << &result;

    std::cout << "Hello World!\n";
}

// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
