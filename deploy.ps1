# Deploy script for Dentissimo
$password = "j]bW[s}0wZE15G1"
$server = "root@188.137.230.209"

Write-Host "Step 1: Creating archive..."
Compress-Archive -Path "dist\*" -DestinationPath "dentissimo.zip" -Force

Write-Host "Step 2: Uploading to server..."
pscp -scp -pw $password dentissimo.zip ${server}:/tmp/

Write-Host "Step 3: Setting up on server..."
$commands = @"
mkdir -p /var/www/dentissimo.sale
cd /tmp
unzip -o dentissimo.zip -d /var/www/dentissimo.sale/
chown -R www-data:www-data /var/www/dentissimo.sale
chmod -R 755 /var/www/dentissimo.sale
rm dentissimo.zip

# Create Nginx config
cat > /etc/nginx/sites-available/dentissimo.sale << 'EOF'
server {
    listen 80;
    server_name dentissimo.sale www.dentissimo.sale;
    root /var/www/dentissimo.sale;
    index index.html;

    location / {
        try_files \`$uri \`$uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/dentissimo.sale /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "Deployment complete! Site available at http://dentissimo.sale"
"@

$commands | ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@188.137.230.209

Write-Host "Done! Your site should be live at http://dentissimo.sale"
