#!/bin/bash
# command to backup db container 

# today
today=$(date +%Y-%m-%d)

# backup data from docker to host
docker exec -it flask-psql bash -c "pg_dump -U postgres -W -Fc psql > home/backup-$today.dump"
docker cp flask-psql:/home/backup-$today.dump ~/Documents