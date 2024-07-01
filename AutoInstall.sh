#!/bin/bash


# Please note to change the BASE_DIR to a path where you want it to install to.
# This is a work in progress and only tested/developed on Debian 11 so far.


# Ensure the script is run as root
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root"
    exit 1
fi

# Kill all existing screen sessions
screen -ls | grep 'Detached' | cut -d. -f1 | awk '{print $1}' | xargs -r kill

# Update and upgrade the system
apt update && apt upgrade -y

# Install required packages
apt install -y openjdk-21-jdk mongodb redis-server wget unzip git screen

# Setup MongoDB
systemctl start mongodb
systemctl enable mongodb

# Setup Redis
systemctl start redis-server
systemctl enable redis-server

# Create a base directory for the server
BASE_DIR="/home/changeme"
mkdir -p $BASE_DIR

# Create and setup Velocity Proxy
mkdir -p $BASE_DIR/velocity
cd $BASE_DIR/velocity
wget https://api.papermc.io/v2/projects/velocity/versions/3.3.0-SNAPSHOT/builds/400/downloads/velocity-3.3.0-SNAPSHOT-400.jar -O velocity.jar
wget https://raw.githubusercontent.com/Swofty-Developments/HypixelSkyBlock/master/configuration/velocity.toml -O velocity.toml
mkdir -p configuration
wget https://raw.githubusercontent.com/Swofty-Developments/HypixelSkyBlock/master/configuration/resources.json -O configuration/resources.json

# Run Velocity Proxy in a screen session
screen -dmS velocity java -jar velocity.jar
sleep 10

# Download and configure SkyBlockProxy
mkdir -p $BASE_DIR/skyblockproxy
cd $BASE_DIR/skyblockproxy
wget https://github.com/Swofty-Developments/HypixelSkyBlock/releases/download/latest/SkyBlockProxy.jar -O SkyBlockProxy.jar

# Move SkyBlockProxy.jar to Velocity plugins folder
mkdir -p $BASE_DIR/velocity/plugins
mv SkyBlockProxy.jar $BASE_DIR/velocity/plugins/

# Restart Velocity Proxy
screen -S velocity -X quit
screen -dmS velocity java -jar $BASE_DIR/velocity/velocity.jar

# Create and setup SkyBlockCore
mkdir -p $BASE_DIR/skyblockcore
cd $BASE_DIR/skyblockcore
wget https://github.com/Swofty-Developments/HypixelSkyBlock/releases/download/latest/SkyBlockCore.jar -O SkyBlockCore.jar
mkdir -p configuration
wget https://raw.githubusercontent.com/Swofty-Developments/HypixelSkyBlock/master/configuration/resources.json -O configuration/resources.json

# Unzip the world file
unzip /home/world.zip -d $BASE_DIR/skyblockcore/configuration

# Run SkyBlockCore in a screen session
screen -dmS skyblockcore java -jar SkyBlockCore.jar ISLAND

# Create and setup NanoLimbo
mkdir -p $BASE_DIR/nanolimbo
cd $BASE_DIR/nanolimbo
wget https://github.com/Swofty-Developments/HypixelSkyBlock/blob/master/configuration/NanoLimbo-1.7-all.jar -O NanoLimbo.jar

# Run NanoLimbo in a screen session
screen -dmS nanolimbo java -jar NanoLimbo.jar

# Setup MongoDB collections
wget https://raw.githubusercontent.com/Swofty-Developments/HypixelSkyBlock/master/configuration/Minestom.regions.csv -O /tmp/Minestom.regions.csv
mongoimport --db Minestom --collection regions --type csv --file /tmp/Minestom.regions.csv --headerline

# Optional setups
# Fairy Souls
wget https://raw.githubusercontent.com/Swofty-Developments/HypixelSkyBlock/master/configuration/Minestom.fairysouls.csv -O /tmp/Minestom.fairysouls.csv
mongoimport --db Minestom --collection fairysouls --type csv --file /tmp/Minestom.fairysouls.csv --headerline

# Hub Crystals
wget https://raw.githubusercontent.com/Swofty-Developments/HypixelSkyBlock/master/configuration/Minestom.crystals.csv -O /tmp/Minestom.crystals.csv
mongoimport --db Minestom --collection crystals --type csv --file /tmp/Minestom.crystals.csv --headerline

# Songs
mkdir -p $BASE_DIR/configuration/songs
wget https://raw.githubusercontent.com/Swofty-Developments/HypixelSkyBlock/master/configuration/songs/wilderness.mid -O $BASE_DIR/configuration/songs/wilderness.mid
wget https://raw.githubusercontent.com/Swofty-Developments/HypixelSkyBlock/master/configuration/songs/wilderness.nbs -O $BASE_DIR/configuration/songs/wilderness.nbs

# Print completion message
echo "Hypixel SkyBlock setup complete. Ensure to apply the resource pack in Minecraft."

# List all running screen sessions
screen -ls
