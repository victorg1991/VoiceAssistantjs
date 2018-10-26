echo "Downloading node"

wget https://nodejs.org/dist/v10.12.0/node-v10.12.0-linux-armv7l.tar.xz

echo "Unzipping"

tar -xf node-v10.12.0-linux-armv7l.tar.xz

echo "Installing"

cd node-v10.12.0-linux-armv7l/
sudo cp -R * /usr/local/
