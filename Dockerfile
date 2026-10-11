FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node package.json ./
RUN npm install --omit=dev && npm cache clean --force
# --chown + chmod : les fichiers appartiennent à l'utilisateur qui lance l'appli
# et sont lisibles quelles que soient les permissions du dossier d'origine
# (sur un NAS, les fichiers copiés sont souvent réservés à leur propriétaire)
COPY --chown=node:node . .
RUN chmod -R u+rwX,go+rX /app \
 && mkdir -p public/upload && chown -R node:node public/upload
USER node
EXPOSE 3000
VOLUME ["/app/public/upload"]
CMD ["node", "app.js"]
