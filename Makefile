SHELL := /bin/bash

APP_NAME ?= tese-app
IMAGE_NAME ?= tese-app:prod
HOST_PORT ?= 50811
CONTAINER_PORT ?= 3000

API_RATE_LIMIT ?= 120
API_RATE_WINDOW_MS ?= 60000
PYTHON_EXEC_TIMEOUT_MS ?= 15000
PYTHON_MAX_STDOUT_BYTES ?= 2000000

.PHONY: help pull build stop run restart update logs status test clean

help:
	@echo "Available targets:"
	@echo "  make pull     - git pull on current branch"
	@echo "  make build    - build Docker image ($(IMAGE_NAME))"
	@echo "  make stop     - stop/remove running container ($(APP_NAME))"
	@echo "  make run      - run container on port $(HOST_PORT)"
	@echo "  make restart  - stop + run"
	@echo "  make update   - git pull + build + restart"
	@echo "  make logs     - tail container logs"
	@echo "  make status   - show container status"
	@echo "  make test     - HTTP check on localhost"
	@echo ""
	@echo "Optional overrides:"
	@echo "  make update HOST_PORT=50812"

pull:
	@git pull --ff-only

build:
	@docker build -t $(IMAGE_NAME) .

stop:
	@docker rm -f $(APP_NAME) 2>/dev/null || true

run:
	@docker run -d \
		--name $(APP_NAME) \
		-p $(HOST_PORT):$(CONTAINER_PORT) \
		-e NODE_ENV=production \
		-e API_RATE_LIMIT=$(API_RATE_LIMIT) \
		-e API_RATE_WINDOW_MS=$(API_RATE_WINDOW_MS) \
		-e PYTHON_EXEC_TIMEOUT_MS=$(PYTHON_EXEC_TIMEOUT_MS) \
		-e PYTHON_MAX_STDOUT_BYTES=$(PYTHON_MAX_STDOUT_BYTES) \
		-v cocktail_data:/app/src/python/cocktail/data \
		-v ingredient_data:/app/src/python/ingredient/data \
		$(IMAGE_NAME)

restart: stop run

update: pull build restart

logs:
	@docker logs --tail=200 -f $(APP_NAME)

status:
	@docker ps -a --filter name=$(APP_NAME)

test:
	@curl -4 -I http://127.0.0.1:$(HOST_PORT)

clean: stop
	@docker image rm $(IMAGE_NAME) 2>/dev/null || true
