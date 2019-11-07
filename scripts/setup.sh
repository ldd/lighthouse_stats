PG_USER="worker"

## install dependencies
CURRENT_FOLDER=`pwd`

cd $CURRENT_FOLDER/scripts
# # make sure to update the systemd's postgres password
sudo sed -i -- "s|PG_PASSWORD|${PG_PASSWORD}|g; s|PG_USER|${PG_USER}|g" lighthouse_stats.service

# # copy systemd service and timer files
sudo cp lighthouse_stats.service /etc/systemd/system/lighthouse_stats.service
sudo chmod 644 /etc/systemd/system/lighthouse_stats.service

sudo cp lighthouse_stats.timer /etc/systemd/system/lighthouse_stats.timer
sudo chmod 644 /etc/systemd/system/lighthouse_stats.timer

# start systemd service and timer
sudo systemctl enable lighthouse_stats
sudo systemctl start lighthouse_stats
sudo systemctl enable lighthouse_stats.timer
sudo systemctl start lighthouse_stats.timer

