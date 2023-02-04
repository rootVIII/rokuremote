from os.path import realpath, basename
from roku.roku import Roku
from tkinter import Tk
# rootVIII


if __name__ == '__main__':
    try:
        root = Tk()
        Roku(root, realpath(__file__)[:-len(basename(__file__))])
        root.mainloop()
    except KeyboardInterrupt:
        print('ctrl-c pressed')
