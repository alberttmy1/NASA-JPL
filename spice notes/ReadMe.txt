First: If on windows press Start and go to Environment Variables and add a path to C

How to link compile:
clang-cl -I ..\cspice\cspice\include\ -o demo Wayne.c ..\cspice\cspice\lib\cspice.lib -lm

