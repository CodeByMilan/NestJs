FROM node:20
WORKDIR /backend
COPY ./package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
COPY .env .env
EXPOSE 3000

CMD ["pnpm", "start"]
