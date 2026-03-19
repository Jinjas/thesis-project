FROM node:20-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    graphviz \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY requirements.txt ./
RUN python3 -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

ENV PATH="/opt/venv/bin:$PATH"

COPY . .
RUN npm run build

RUN mkdir -p /app/src/python/cocktail/data /app/src/python/ingredient/data \
    && chown -R node:node /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000

USER node
CMD ["npm", "run", "start"]
