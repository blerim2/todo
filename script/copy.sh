#!/bin/bash
# command copy db backup to container 

# today
today=$(date +%Y-%m-%d)

docker cp ~/Documents/backup-$today.dump flask-psql:/home/backup-$today.dump