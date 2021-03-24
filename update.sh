#!/usr/bin/env bash
git pull
npm install
npm run build
sudo nginx -s reload

echo 'done'