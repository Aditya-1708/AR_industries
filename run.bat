pm2 start npm --name "client-dev" -- run dev --cwd ./client
pm2 save
pm2 start npm --name "server-dev" -- run dev --cwd ./server
pm2 save
