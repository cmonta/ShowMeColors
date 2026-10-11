FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY . .
# Le dossier d'upload est ignoré par git : on le crée
RUN mkdir -p public/upload && chown -R node:node public/upload
USER node
EXPOSE 3000
VOLUME ["/app/public/upload"]
CMD ["node", "app.js"]
