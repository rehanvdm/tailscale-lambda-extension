#!/bin/bash
# https://pkgs.tailscale.com/stable/#amazon-linux-2023
yum install -y yum-utils
yum-config-manager --add-repo https://pkgs.tailscale.com/stable/amazon-linux/2023/tailscale.repo
yum -y install tailscale

cp /usr/bin/tailscale /workspace/
cp /usr/sbin/tailscaled /workspace/
