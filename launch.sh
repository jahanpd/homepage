#!/bin/bash

SESSION="homepage_backend"

tmux new-session -d -s $SESSION

# Window 1
tmux rename-window -t $SESSION:1 'ai'
tmux send-keys -t $SESSION:1 'cd ~/Sync/homepage' C-m
tmux send-keys -t $SESSION:1 'nix-shell' C-m
tmux send-keys -t $SESSION:1 'serve_backend' C-m


# Window 1
tmux new-window -t $SESSION:2 -n 'tunnel'
tmux send-keys -t $SESSION:2 'cd ~/Sync/.cloudflared' C-m
tmux send-keys -t $SESSION:2 'zsh homepage.sh' C-m

