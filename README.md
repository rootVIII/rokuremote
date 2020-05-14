###### GUI Roku Remote
<img src="https://github.com/rootVIII/rokuremote/blob/master/example_screenshot.png" alt="example1">
<br><br>
<b>First follow these quick/simple steps to enable your Roku Server:</b>
<br>
https://blog.roku.com/developer/developer-setup-guide
<br>
* Remember its IP address as you'll need to
enter it as shown in the image above.
<br><br>
Press the Save button after entering your IP
<br><br>
You shouldn't really need to use the power button as most Rokus
will turn on when the input receives power from the TV.
However it may be useful for turning the Roku OFF.
<br><br>
<code>go get github.com/rootVIII/rokuremote</code>
<br>
If unable to get or build on Windows, these steps may be needed:
<pre>
  <code>
Install MSYS2 x86_64 from https://msys2.github.io/
In MSYS2 shell: pacman -S mingw-w64-x86_64-make mingw-w64-x86_64-gcc
Add C:\msys64\mingw64\bin and C:\msys64\usr\bin to PATH
  </code>
</pre>
<br>
<br>
Runs on Linux, Mac, and Windows
<br>
This was developed on Ubuntu 18.04.4 LTS.
<hr>
<b>Author: rootVIII 2020</b><br>
