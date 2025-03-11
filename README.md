# Deploying a Next.js PWA with Nginx and PM2 on a Remote Server

## Introduction
This guide provides a step-by-step approach to deploying a Next.js Progressive Web App (PWA) on a remote server using Nginx as a reverse proxy and PM2 for process management. It also covers common issues and troubleshooting steps.

---

## *1. Server Setup*
### *1.1 Install Required Packages*
Ensure your server has *Node.js, PM2, and Nginx* installed:
sh
sudo apt update && sudo apt install nginx
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g pm2


### *1.2 Clone Your Next.js App and Install Dependencies*
sh
cd /var/www/
git clone <your-repo-url> visitor-card
cd visitor-card
npm install


### *1.3 Build and Start the Next.js App with PM2*
sh
npm run build
pm run start
pm run pm2 start npm --name "vcards" -- start
pm2 save
pm2 startup


---

## *2. Configure Nginx as a Reverse Proxy*
### *2.1 Create an Nginx Configuration File*
sh
sudo nano /etc/nginx/sites-available/vcards


Paste the following configuration:
nginx
server {
    listen 80;
    server_name vcards.gtel.in;

    gzip on;
    gzip_types application/javascript text/css text/javascript;
    gzip_comp_level 5;

    location /_next/static/ {
        root /var/www/visitor-card/.next/;
        expires 365d;
        access_log off;
    }

    location / {
        proxy_pass http://127.0.0.1:3006/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}


### *2.2 Enable and Restart Nginx*
sh
sudo ln -s /etc/nginx/sites-available/vcards /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx


---

## *3. Enable HTTPS with Let's Encrypt (Optional but Recommended)*
<!-- sh
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d vcards.gtel.in

Auto-renew SSL:
sh
sudo crontab -e

Add this line at the end:
sh
0 3 * * * certbot renew --quiet


--- -->

## *4. Configure Next.js for Production*
Modify *next.config.mjs*:
javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;


Rebuild and restart PM2:
sh
npm run build
pm2 restart vcards


---

## *5. Common Issues & Fixes*
### *Issue: Only Some Static Assets Load (404 Errors on _next/static/)*
✅ *Fix:* Ensure Nginx is serving _next/static/ from the correct path:
nginx
location /_next/static/ {
    root /var/www/visitor-card/.next/;
    expires 365d;
    access_log off;
}

Restart Nginx:
sh
sudo nginx -t && sudo systemctl restart nginx


### *Issue: PWA Doesn't Work on HTTPS*
✅ *Fix:* PWAs require HTTPS. Make sure SSL is properly configured using Certbot.

### *Issue: Service Worker Not Updating*
✅ *Fix:* Clear service worker cache in the browser:
1. Open *DevTools (F12)* → *Application* → *Service Workers*
2. Click *Unregister* → *Reload the page*

---

## *6. Debugging Techniques*
✅ *Check Nginx Logs:*
sh
sudo tail -f /var/log/nginx/error.log

✅ *Check PM2 Logs:*
sh
pm2 logs vcards

✅ *Check Network Requests in Browser (F12 > Network)*

---

## *Conclusion*
You have successfully deployed a Next.js PWA with Nginx and PM2 on a remote server. If you encounter any issues, follow the debugging steps and check logs for further troubleshooting. 🚀