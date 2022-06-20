#! /bin/sh

sleep 15
echo "--> Running push...\n"
npm run prisma:push
echo "--> Running seed...\n"
npm run prisma:seed
echo "--> Server starting...\n"
npm run dev