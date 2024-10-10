#!/bin/bash

pkill -f 'yarn dev' || pkill -f 'yarn server' || echo 'No server to kill'
