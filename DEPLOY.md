### Deploy Conflux Dex Admin UI

####Setup build parameter
Modify vue.config.js, set outputDir properly. 
This step is necessary when you have multiple distribution.
#### Build (Two options) 
Option 1, build on a server: (see update.sh)
#### Check out the project from github
```
git clone git@github.com:Conflux-Dev/conflux-dex-admin.git
cd conflux-dex-admin
```
#### Install library:
```
npm install
```
#### Build
```
npm run build
```
A directory will be generated at ./dist/XXX

Option 2, build on development machine, then upload to server:
##### Under project folder:
```
# Build the VUE project
npm build 

# Enter dist directory
cd ./dist

# Pack directory, 0817 in this case, it will create 0817.zip
zip -r 0817 0817

# Upload zip file to server
scp -o ConnectTimeout=60 0817.zip user@host:PATH_TO_DIRECTORY
```
#### Setup Nginx (or other web container if you want)
##### Install nginx (ubuntu)
```
sudo apt install nginx
```
##### Add server entry to Nginx
You may need to change the listen port, server_name, root location.

Put this file under /etc/nginx/conf.d/, named as 'dex-admin.conf'.
```
server {
    listen       9527;
    server_name  _;
    location / {
        root   /home/ubuntu/dex-admin/0817;
        #root   /home/ubuntu/conflux-dex-admin/dist/0817;
        index  index.html index.htm;
    }
}
```
##### Test the configuration
```
sudo nginx -t
```
##### Reload nginx to enable our server
```
sudo nginx -s reload
```
##### Test whether Dex Admin is running
```
curl -v localhost:9527
```
##### Open network port
```
sudo ufw allow 9527
```
You should also check the network access
 rule configuration if your server is on Cloud(e.g. AWS).

##### Disable default 80 port server if you don't use it
```
sudo vim /etc/nginx.conf
``` 
Comment out the line:
```
        #include /etc/nginx/sites-enabled/*;
``` 