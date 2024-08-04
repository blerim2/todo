#!/bin/bash
# command copy db backup to container 

# today
today=$(date +%Y-%m-%d)

# dropdb 
docker exec -it flask-psql bash -c "dropdb -U postgres -W restore"

# createdb
docker exec -it flask-psql bash -c "createdb -U postgres -W restore"


docker exec -it flask-psql bash -c "pg_restore -U postgres -W -d restore /home/backup-$today.dump"