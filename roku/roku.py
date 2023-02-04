from getpass import getuser
from html import unescape
from json import dumps
from tkinter import Entry, Label, PhotoImage, E, W, END
from tkinter.ttk import Button, Style
from urllib.request import Request, urlopen


class Roku:
    def __init__(self, master, project_path):
        magenta = '#FF00FF'
        dark = '#181818'
        gray = '#202020'
        black = '#000000'
        cyan = '#80DFFF'
        text_style = 'Arial 10'

        self.master = master
        self.master.title('ROKU REMOTE')
        self.master.configure(bg=dark)
        self.master.maxsize('283', '480')
        self.master.minsize('283', '480')
        self.master.geometry('283x480')

        self.master.grid_columnconfigure(3, weight=1, uniform='column')
        self.master.grid_columnconfigure(6, weight=1, uniform='column')
        self.master.grid_columnconfigure(9, weight=1, uniform='column')

        self.roku_img = PhotoImage(file=f'{project_path}assets/roku_logo.png')
        self.roku_label = Label(master, image=self.roku_img, bg=black)
        self.roku_label.image = self.roku_img
        self.roku_label.grid(row=0, column=0, sticky=E+W, pady=3)

        btn_style = Style()
        btn_style.theme_use('alt')
        btn_style.map(
            'Mod.TButton',
            background=[('active', dark), ('!active', black)],
            foreground=[('active', cyan), ('!active', magenta)],
            focuscolor=cyan
        )

        self.spacer1 = Label(master, bg=dark)
        self.spacer1.grid(row=1, pady=10)

        self.up_button = Button(master, style='Mod.TButton', width=10,
                                text=unescape('&#8593;'), command=self.up)
        self.up_button.grid(row=2, column=0, pady=3)

        self.left_button = Button(master, style='Mod.TButton', width=10,
                                  text=unescape('&#8592;'), command=self.left)
        self.left_button.grid(row=3, sticky=W, padx=10, pady=3)

        self.ok_button = Button(master, style='Mod.TButton', width=10,
                                text=unescape('OK'), command=self.select)
        self.ok_button.grid(row=3, pady=3)

        self.right_button = Button(master, style='Mod.TButton', width=10,
                                   text=unescape('&#8594;'), command=self.right)
        self.right_button.grid(row=3, sticky=E, padx=10, pady=3)

        self.down_button = Button(master, style='Mod.TButton', width=10,
                                  text=unescape('&#8595;'), command=self.down)
        self.down_button.grid(row=4, column=0, padx=3, pady=3)

        self.spacer2 = Label(master, bg=dark)
        self.spacer2.grid(row=5, pady=10)

        self.back_button = Button(master, style='Mod.TButton', width=10,
                                  text=unescape('↩'), command=self.back)
        self.back_button.grid(row=6, padx=10, pady=3, sticky=W)

        self.home_button = Button(master, style='Mod.TButton', width=10,
                                  text=unescape('&#8962;'), command=self.home)
        self.home_button.grid(row=6, pady=3)

        self.play_pause_button = Button(master, style='Mod.TButton', width=10,
                                        text=unescape('⏯️'),
                                        command=self.play_pause)
        self.play_pause_button.grid(row=6, padx=10, pady=3, sticky=E)

        self.spacer3 = Label(master, bg=dark)
        self.spacer3.grid(row=8, pady=10)

        self.ip_input_label = Label(master, fg=magenta, bg=dark, font=text_style,
                                    anchor=W, width=16, padx=10, text='Roku IP:')
        self.ip_input_label.grid(row=9, sticky=W)

        self.edit_ip_button = Button(master,  style='Mod.TButton', width=13,
                                     text='Edit',  command=self.edit_ip)
        self.edit_ip_button.grid(row=9, pady=3)

        self.save_ip_button = Button(master, style='Mod.TButton', width=13,
                                     text='Save', command=self.store_ip)
        self.save_ip_button.grid(row=9, padx=10, pady=3, sticky=E)

        self.ip_input = Entry(master, fg=cyan, bg=dark, width=37,
                              font=text_style, highlightbackground=gray,
                              disabledbackground=black,
                              disabledforeground=cyan, insertbackground=cyan)
        self.ip_input.grid(row=10, padx=10, pady=3, sticky=W)
        self.ip_input.config(state='disabled')

        self.spacer4 = Label(master, bg=dark)
        self.spacer4.grid(row=11, pady=4)

        self.status_label = Label(master, fg=cyan, bg=dark, font=text_style,
                                  width=8, text='Hello %s' % getuser())
        self.status_label.grid(row=12, sticky=E+W, pady=15)

        self.roku_ip = None
        self.port = 8060
        self.status_label.after(4000, self.clear_status)

    def post_keypress(self, cmd):
        if self.roku_ip is None:
            self.status_label.config(text='Use Edit button to store Roku IP')
            self.status_label.after(3000, self.clear_status)
        else:
            try:
                req = Request(f'http://{self.roku_ip}:{self.port}/keypress/{cmd}',
                              headers={'Content-Type': 'application/json'},
                              data=dumps({}).encode('utf-8'),
                              method='POST')
                _ = urlopen(req, timeout=3).read()
            except Exception as err:
                self.status_label.config(text=str(err))
                self.status_label.after(3000, self.clear_status)

    def set_roku_url(self, ip):
        try:
            device_text = urlopen(f'http://{ip}:{self.port}', timeout=10).read()
            if 'roku' not in device_text.decode('utf-8'):
                raise
            self.roku_ip = ip
        except Exception:
            self.status_label.config(text='Invalid Roku IP provided')
            self.ip_input.delete(0, END)
            self.roku_ip = None
            self.status_label.after(3000, self.clear_status)

    def clear_status(self):
        self.status_label.config(text='')

    def up(self):
        self.post_keypress('up')

    def down(self):
        self.post_keypress('down')

    def left(self):
        self.post_keypress('left')

    def right(self):
        self.post_keypress('right')

    def home(self):
        self.post_keypress('home')

    def back(self):
        self.post_keypress('back')

    def play_pause(self):
        self.post_keypress('play')

    def select(self):
        self.post_keypress('select')

    def store_ip(self):
        self.set_roku_url(self.ip_input.get().strip())
        self.ip_input.config(state='disabled')

    def edit_ip(self):
        self.ip_input.config(state='normal')
        self.ip_input.focus_set()
        self.ip_input.icursor(0)
