bun run build

cp -r ./.next/standalone/* ~/build/contract-inspector
cp -r ./.next/standalone/.next/* ~/build/contract-inspector/.next
cp -r ./.next/static/* ~/build/contract-inspector/.next/static
cp -r ./public/* ~/build/contract-inspector/public

pm2 restart contract-inspector