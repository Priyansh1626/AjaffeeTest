
echo "Switching to branch master"
git checkout master

echo "Building app..."
npm run build

echo "Deploying app..."
scp -r build/* root@5.181.217.225:/var/www/5.181.217.225/

echo "Done" 