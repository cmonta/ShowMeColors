FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node package.json ./
RUN npm install --omit=dev && npm cache clean --force
# --chown + chmod : les fichiers appartiennent à l'utilisateur qui lance l'appli
# et sont lisibles quelles que soient les permissions du dossier d'origine
# (sur un NAS, les fichiers copiés sont souvent réservés à leur propriétaire)
COPY --chown=node:node . .
# (node_modules est exclu : il a déjà les bons droits et contient des milliers
# de fichiers, ce qui rendait cette étape très lente)
RUN find /app -path /app/node_modules -prune -o -exec chmod u+rwX,go+rX {} + \
 && mkdir -p public/upload && chown -R node:node public/upload
USER node
EXPOSE 3000
VOLUME ["/app/public/upload"]
CMD ["node", "app.js"]
