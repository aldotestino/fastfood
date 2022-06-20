#! /bin/sh

sleep 15
echo "--> Running push...\n"
npm run prisma:push
echo "--> Running seed...\n"
npm run prisma:seed
echo "--> Building...\n"
npm run build
echo "--> Copying images...\n"
cp -R ./src/public ./dist
echo "--> Server starting...\n"
npm start