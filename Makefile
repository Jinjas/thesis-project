SHELL := /bin/bash

APP_NAME ?= tese-app
IMAGE_NAME ?= tese-app:prod
HOST_PORT ?= 50811
CONTAINER_PORT ?= 3000

API_RATE_LIMIT ?= 120
API_RATE_WINDOW_MS ?= 60000
PYTHON_EXEC_TIMEOUT_MS ?= 15000
PYTHON_MAX_STDOUT_BYTES ?= 2000000
BACKUP_DIR ?= ./backups
TIMESTAMP := $(shell date +%Y%m%d-%H%M%S)

.PHONY: help pull build stop run restart update logs status test clean backup backup-list restore

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
	@echo "  make backup   - backup persistent volumes"
	@echo "  make backup-list - list backups"
	@echo "  make restore FILE=<backup.tar.gz> - restore volumes from backup"
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

backup:
	@mkdir -p $(BACKUP_DIR)
	@docker run --rm \
		-v cocktail_data:/source/cocktail \
		-v ingredient_data:/source/ingredient \
		-v $(PWD)/$(BACKUP_DIR):/backup \
		alpine sh -c "tar czf /backup/tese-data-$(TIMESTAMP).tar.gz -C /source cocktail ingredient"
	@echo "Backup created: $(BACKUP_DIR)/tese-data-$(TIMESTAMP).tar.gz"

backup-list:
	@ls -lh $(BACKUP_DIR) 2>/dev/null || echo "No backups yet."

restore:
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make restore FILE=backups/tese-data-YYYYMMDD-HHMMSS.tar.gz"; \
		exit 1; \
	fi
	@docker run --rm \
		-v cocktail_data:/target/cocktail \
		-v ingredient_data:/target/ingredient \
		-v $(PWD):/work \
		alpine sh -c "rm -rf /target/cocktail/* /target/ingredient/* && tar xzf /work/$(FILE) -C /tmp && cp -a /tmp/cocktail/. /target/cocktail/ && cp -a /tmp/ingredient/. /target/ingredient/"
	@echo "Restore completed from: $(FILE)"

clean: stop
	@docker image rm $(IMAGE_NAME) 2>/dev/null || true
