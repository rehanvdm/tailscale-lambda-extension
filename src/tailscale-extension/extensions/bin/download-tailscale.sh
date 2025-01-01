#!/bin/bash
docker run --rm -v $(pwd):/workspace --platform linux/amd64 public.ecr.aws/amazonlinux/amazonlinux:2023 /workspace/download-tailscale-docker-commands.sh