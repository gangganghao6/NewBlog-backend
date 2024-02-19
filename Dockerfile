FROM node:20.11.1

WORKDIR /app

COPY . .

# RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install -g pnpm
# RUN yarn config set registry https://registry.npmmirror.com/
RUN npm install -g node-gyp
RUN npm install -g node-pre-gyp
# RUN npm install -g bcrypt
RUN pnpm i
RUN pnpm prisma


EXPOSE 8080

CMD ["yarn", "dev"]

