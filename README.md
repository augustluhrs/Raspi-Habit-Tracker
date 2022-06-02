# Raspi Habit Tracker

A 16x32 HUB75 LED matrix hooked up to a Raspberry Pi that displays habit tracking data from a glitch server with a simple p5 entry interface and an nedb database. Tracks 16 daily habits over the most recent 32 days.

This repo contains the glitch server files. The raspi node server file currently lives on [this repo](https://github.com/augustluhrs/Raspi-Habit-Tracker-LEDs).

## Components
* 16x32 HUB75 LED Matrix
* Raspberry Pi 3B+
* [Glitch](https://glitch.com/) server with [p5](https://p5js.org/) front end and [nedb](https://github.com/louischatriot/nedb) backend
* [Easybotics Raspi LED Matrix Library](https://github.com/easybotics/node-rpi-rgb-led-matrix)
* Wires, Mounting Hardware, Etc.
