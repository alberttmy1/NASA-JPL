#include <stdio.h>
#include <stdlib.h>
#include "SpiceUsr.h"

int main() {
	#define   STRLEN    37

    SpiceChar      utc[STRLEN];
    SpiceChar      obs[STRLEN];
    SpiceChar      targ[STRLEN];
    SpiceChar      kern[STRLEN];

    SpiceDouble    et;
    SpiceDouble    lt;
    SpiceDouble    state[6];

	prompt_c("Enter kernel file name > ", STRLEN, kern);
    furnsh_c(kern);

    prompt_c("Enter UTC epoch             > ", STRLEN, utc);
    prompt_c("Enter observer name         > ", STRLEN, obs);
    prompt_c("Enter target name           > ", STRLEN, targ);

    str2et_c(utc, &et);

    spkezr_c(targ, et, "J2000", "NONE", obs, state, &lt);

    printf("\nEpoch               : %22.10f\n", et);
    printf("   x-position   (km): %22.10f\n", state[0]);
    printf("   y-position   (km): %22.10f\n", state[1]);
    printf("   z-position   (km): %22.10f\n", state[2]);
    printf("   x-velocity (km/s): %22.10f\n", state[3]);
    printf("   y-velocity (km/s): %22.10f\n", state[4]);
    printf("   z-velocity (km/s): %22.10f\n", state[5]);

    //TODO: How to keep state[0], state[1], state[2] in a json file.

    //json_object* root = json_object_new_object();

    //json_object_object_add(root, "x", json_object_new_double(state[0]));
    //json_object_object_add(root, "y", json_object_new_double(state[1]));
    //json_object_object_add(root, "z", json_object_new_double(state[2]));

    //if (json_object_to_file("results.json", root))
    //    printf("Error: failed to save %s!!\n", filename);
    //else
    //    printf("%s saved.\n", filename);

    //notes
    //break up results into multiple json files,
    //goals: get data to front end, don't have to take in all data for every sec

    return (0);



}