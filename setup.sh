echo "Downloading node"

wget https://nodejs.org/dist/v10.12.0/node-v10.12.0-linux-armv7l.tar.xz

echo "Unzipping"

tar -xf node-v10.12.0-linux-armv7l.tar.xz

echo "Installing"

cd node-v10.12.0-linux-armv7l/
sudo cp -R * /usr/local/

echo "Preparing directory"

cd

mkdir workspace && cd workspace

sudo apt-get install pigpio

npm install onoff
npm install mic
npm install pigpio
npm install wav-decoder
npm install waveheader
npm install dialogflow

mkdir ~/.backup

cp -R node_modules ~/.backup

