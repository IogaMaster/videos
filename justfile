set shell := ["bash", "-c"]

default:
    @just --list

# Create a new video by copying the template folder
create name:
    @echo "🎬 Scaffolding videos/{{name}}..."
    @cp -r videos/_template videos/{{name}}
    @sed -i 's/TEMPLATE_NAME/{{name}}/g' videos/{{name}}/package.json
    @echo "🔄 Updating workspace dependencies..."
    @pnpm install
    @echo "✅ Setup complete! Run 'just edit {{name}}' to start."

# Edit an existing video
edit name:
    @echo "🚀 Spawning server..."
    chromium --app=http://localhost:9000 & \
    pnpm --filter {{name}} install && \
    pnpm --filter {{name}} start \

# Expose the local server to eduroam / external devices and print a qrencode matrix
tunnel name:
    @echo "🔗 Opening secure proxy to port 9000..."
    @echo "🚀 Spawning server..."
    chromium --app=http://localhost:9000 & \
    pnpm --filter {{name}} install && \
    ( \
        pnpm dlx localtunnel --port 9000 2>&1 | while read -r line; do \
            echo "$line"; \
            if [[ "$line" =~ https://.*\.loca\.lt ]]; then \
                url=$(echo "$line" | grep -oE "https://[^ ]+\.loca\.lt"); \
                echo -e "\n\033[1;32m📱 SCAN THIS QR CODE WITH YOUR PHONE:\033[0m\n"; \
                qrencode -t ansiutf8 "$url"; \
                echo -e "\nURL: $url\n"; \
            fi; \
        done \
    ) & \
    pnpm --filter {{name}} start
