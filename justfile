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
    pnpm --filter {{name}} start & \
    sleep 1.5 && \
    chromium --app=http://localhost:9000
