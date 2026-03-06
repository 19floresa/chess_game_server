FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY . .

FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY --from=base /app ./
EXPOSE 3056
CMD ["npm", "run", "dev"]