###### Roku Remote
<img src="https://user-images.githubusercontent.com/30498791/124700488-d55f2d80-deba-11eb-9016-502baed92eeb.png" alt="mp4">
<br>
<br>
.mov <a href="https://github.com/rootVIII/rokuremote/issues/1"></a>
<br>
<br>
Basic remote features offered:<br>
up, down, left, right, ok, home, play/pause, back, and power
<br>
<br>
You shouldn't really need to use the power button as most<br>
Rokus will turn on when the input receives power from the<br>
TV. However it may be useful for turning the Roku OFF.
<br>
<br>
This code should run on any OS, but has only been tested on<br>
MacOS Big Sur.
<br>
<br>
A network scan is performed based on your machine's IPv4<br>
address and netmask at application starup. Any found Roku<br>
devices should load into the dropdown.
<br>
<br>
The remote has only been tested on the typical /24 private<br>
network and finds available devices in under a second. The<br>
remote has not been tested on larger networks (less than<br>
/24 and with more hosts). It should work the same in theory.
<br>
<br>
<br>
There is a signed/Apple-notarized macOS installer found in<br>
<a href="https://github.com/rootVIII/rokuremote/releases/tag/V1.0">Releases</a> (built on Intel Big Sur).
<br>
<br>
Otherwise use <code>npm</code> to run:
<pre>
  <code>
# Navigate to project root and run npm start (requires electron):
npm start .
# Build electron dist/ with executable (requires electron-builder)
npm run pack
  </code>
</pre>
<br>
<hr>
<b>Author: rootVIII 2020</b><br>
