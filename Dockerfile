FROM node:16-alpine as deps

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

# BUILDER
FROM deps as builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# RUNNER
FROM builder as runner

WORKDIR /app

COPY --from=builder /app ./

CMD yarn install && yarn dev