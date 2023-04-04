import subprocess
def brief_parse():

    # print out summary of file
    stdout = subprocess.run(["brief", "kernels/jup068.bsp"], check=True, capture_output=True, text=True).stdout

    print(stdout)
if __name__ == "__main__":
    brief_parse()