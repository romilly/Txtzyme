Txtzyme
=======

Txtzyme is a nano-interpreter designed for expanding DIY DSLs (domain specific languages) on USB connected microcontrollers such as the Teensy.

Most commands are single characters that take immediate action. Other commands, like the curly braces, are normally used in pairs. Finally, strings of digits are interpreted as a single integer which can be used by one or more subsequent commands.

One often *echos* commands from the host's shell to the Teensy's USB device file. This shell command blinks the Teensy's LED (on pin D6) 5 times in 1  second:

        $ echo '5{ 6d 1o 100m 0o 100m }' >/dev/cu.usbmodem12341


Getting Started
---------------

Txtzyme runs on Teensy and Teensy++ versions 1.0 and 2.0. These devices are available, inexpensive and well supported by <http://pjrc.com/teensy>. Once you are in possession of a device you will need to:

- Download the Teensy loader from <http://pjrc.com/teensy/loader.html>
- Download Txtzyme hex from <http://github.com/WardCunningham/Txtzyme/tree/master/hex/>

Choose the hex file that corresponds to your Teensy.
(The loader will check that you chose correctly.)
Once Txtzyme is running you can send commands to it from the shell as above or try any of the examples in the projects directory.

Txtzyme is distributed as source on GitHub.
To build a custom Txtzyme you will need to:

- Download Txtzyme source from <http://github.com/WardCunningham/Txtzyme>
- Download the AVR cross compiler from <http://www.obdev.at/products/crosspack/download.html>

You are encouraged to add commands that make your projects easier.
We'd like to hear about what you've done.
Fork the Txtzyme repo to share versions of Txtzyme you've found useful.


Standard Commands
-----------------

Commands are read line at a time from a flow-controlled USB stream into a sixty character buffer from which they are interpreted. Unrecognized commands do nothing, improperly used commands will try to do someing predictable if not useful.

- `0`-`9` replaces x with the 16-bit unsigned integer formed from this and subsequent digits.
- `p` prints the x register, followed by crlf.

Input from the host is normally embedded in programs as literal digits that are simply regerated when inputs change. Output goes back to the host over the USB where it may or may not be read. There is some buffering but unread output will eventually be discarded.

- `a`-`f` selects i/o port a-f, and pin x, for subsequent i/o.
- `i` reads the selected pin, leave it as 0-1 in x.
- `o` write the selected pin from x mod 2.

Input from pins and output to pins automatically set the data direction for the individual pin. The impedance of the input state is influenced by the last output data (0o for highest impedance). The LED pin (D6) is selected on reset and by convention at the end of scripts.


- `m` delays x milliseconds.
- `u` delays x microseconds.

A delay precise delay of, say 14.666 milliseconds can be written as the program `14m666u`. The command interpreter overhead is about 2.5 microseconds per character.

- `{` starts a loop to be executed x times.
- `}` ends a loop that will be executed zero or more times.
- `k` sets x to the remaining loop count, decremented as each loop starts.

Loops can't (yet) be nested, nor can loops span lines. The x that controls the loop need not be literal. For example, `3bi{ ... }` describes a loop that will be executed only when pin B3 is high.

The program `11{kp1000m}` counts down by seconds from 10 to 0. The program `8{kbip}` prints each bit of input port B, from B7 to B0.

- `_` outputs characters to the USB host, up to the next _ character or end of line.

The underscore was chosen over single or double quotes for the simple reason that they need not be escaped in command line arguments. A crlf follows the quoted output.

- `s` samples analog input from mux channel x, replacing x with the sampled data.

Input is referenced to vcc and ranges from 0 to 1023. Teensy mux channels correspond to pins in the order they appear on the edge of the board: F0, F1, F4, F5, F6, F7, B6, B5, B4, D7, D6, D4. Any operation of the LED is likely to interfere with using D6 as an analog input.

- `v` outputs the MCU version, as set by, for example, `MCU = atmega32u4` in the Makefile.

Each Teensy uses a different MCU as follows: at90usb162: Teensy 1.0, atmega32u4: Teensy 2.0, at90usb646: Teensy++ 1.0, at90usb1286: Teensy++ 2.0.

- `h` outputs a summary of available commands.

Each command is listed with a signature indicating pre and post conditions and followed with a word or two of description. Command signatures and descriptions will not be change unless the commands themselves change so that drivers can sense remote capability by parsing this output.

- `t` measure pulse width on selected pin

Wait for two transitions on selected pin. Set x to exlapsed time between these transitions, or zero if wait for either transition overflows x (about 1/30 second). Time unit is clock period divided by nine (Millisconds = result * 9 / 16). 



Learn More
----------

Much of Txtzyme's development has been done as a recreational activity within Portland's Dorkbot community. Be sure to read the posts that recount this development.

- <http://dorkbotpdx.org/blog/wardcunningham/shell_programming_with_txtzyme>
- <http://dorkbotpdx.org/blog/wardcunningham/plotting_signals_with_txtzyme>

Txtzyme has been named to suggest *text* as *emzyme* within a larger system. The term has been tested to Google well too. 

- <http://www.google.com/search?q=txtzyme>

Please mention Txtzyme as you blog projects that use it.

