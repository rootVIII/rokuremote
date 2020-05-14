package main

/*
	- rootVIII 04FEB2020
	- roku.go
	- cross platform GUI Roku remote
*/

import (
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"os/user"

	"fyne.io/fyne"
	"fyne.io/fyne/app"
	"fyne.io/fyne/canvas"
	"fyne.io/fyne/layout"
	"fyne.io/fyne/theme"
	"fyne.io/fyne/widget"
)

// RokuRemote is implemented by remote.
type RokuRemote interface {
	postCommand(endpoint string)
	setIP(ipAddress string)
	buildUI()
	setStatus(state string)
}

type remote struct {
	RokuRemote
	IP          string
	response    []byte
	statusLabel *widget.Label
}

func (r *remote) postCommand(endpoint string) {
	if net.ParseIP(r.IP) != nil {
		URL := fmt.Sprintf("http://%s:8060/keypress/%s", r.IP, endpoint)
		client := &http.Client{}
		req, err := http.NewRequest("POST", URL, nil)
		resp, err := client.Do(req)
		if err != nil {
			r.response = []byte("IP is unreachable")
		} else {
			defer resp.Body.Close()
			rBytes, readErr := ioutil.ReadAll(resp.Body)
			if readErr != nil {
				r.response = []byte(readErr.Error())
			} else {
				r.response = rBytes
			}
		}
	} else {
		r.response = []byte("Invalid IP")
	}
}

func (r *remote) setIP(ipAddress string) {
	r.IP = ipAddress
}

func (r *remote) setStatus(state string) {
	if len(r.response) > 0 {
		r.statusLabel.SetText(string(r.response))
	} else {
		r.statusLabel.SetText(state)
	}
}

func (r *remote) buildUI() {
	a := app.New()
	icon, _ := fyne.LoadResourceFromPath("icon.png")
	a.SetIcon(icon)
	window := a.NewWindow("Roku")
	user, _ := user.Current()
	img := canvas.NewImageFromFile("rokulogo.png")
	r.statusLabel = widget.NewLabel("Hello " + user.Username)
	ipLabel := widget.NewLabel("Roku Server IP:")
	ipEntry := widget.NewEntry()

	saveBtn := widget.NewButtonWithIcon("SAVE", theme.DocumentSaveIcon(), func() {
		ip := ipEntry.Text
		if net.ParseIP(ip) == nil {
			r.statusLabel.SetText(fmt.Sprintf("Invalid IP: %s", ip))
		} else {
			r.statusLabel.SetText(fmt.Sprintf("Saved %s", ip))
		}
		r.setIP(ip)
	})

	upBtn := widget.NewButtonWithIcon("", theme.MoveUpIcon(), func() {
		r.postCommand("up")
		r.setStatus("up")
	})
	leftBtn := widget.NewButtonWithIcon("", theme.NavigateBackIcon(), func() {
		r.postCommand("left")
		r.setStatus("left")
	})
	rightBtn := widget.NewButtonWithIcon("", theme.NavigateNextIcon(), func() {
		r.postCommand("right")
		r.setStatus("right")
	})
	downBtn := widget.NewButtonWithIcon("", theme.MoveDownIcon(), func() {
		r.postCommand("down")
		r.setStatus("down")
	})
	okBtn := widget.NewButton("OK", func() {
		r.postCommand("select")
		r.setStatus("ok")
	})
	homeBtn := widget.NewButtonWithIcon("", theme.HomeIcon(), func() {
		r.postCommand("home")
		r.setStatus("home")
	})
	playBtn := widget.NewButtonWithIcon("", theme.MediaPlayIcon(), func() {
		r.postCommand("play")
		r.setStatus("play")
	})
	backBtn := widget.NewButtonWithIcon("", theme.NavigateBackIcon(), func() {
		r.postCommand("back")
		r.setStatus("back")
	})
	powerBtn := widget.NewButton("I|O", func() {
		r.postCommand("power")
		r.setStatus("power")
	})

	window.SetContent(
		fyne.NewContainerWithLayout(
			layout.NewVBoxLayout(),
			fyne.NewContainerWithLayout(
				layout.NewGridLayout(1),
				img,
				layout.NewSpacer(),
				ipLabel),
			fyne.NewContainerWithLayout(
				layout.NewGridLayout(1),
				ipEntry),
			fyne.NewContainerWithLayout(
				layout.NewGridLayout(3),
				saveBtn,
				layout.NewSpacer(),
				layout.NewSpacer()),
			fyne.NewContainerWithLayout(
				layout.NewGridLayout(1),
				layout.NewSpacer(),
				upBtn),
			fyne.NewContainerWithLayout(
				layout.NewGridLayout(3),
				leftBtn,
				okBtn,
				rightBtn),
			fyne.NewContainerWithLayout(
				layout.NewGridLayout(1),
				downBtn,
				layout.NewSpacer(),
				layout.NewSpacer()),
			fyne.NewContainerWithLayout(
				layout.NewGridLayout(1),
				homeBtn),
			fyne.NewContainerWithLayout(
				layout.NewGridLayout(1),
				playBtn),
			fyne.NewContainerWithLayout(
				layout.NewGridLayout(1),
				backBtn),
			fyne.NewContainerWithLayout(
				layout.NewGridLayout(1),
				powerBtn,
				layout.NewSpacer(),
				r.statusLabel),
		),
	)
	window.Resize(fyne.NewSize(200, 430))
	window.ShowAndRun()
}

func main() {
	var roku RokuRemote
	roku = &remote{}
	roku.buildUI()
}
