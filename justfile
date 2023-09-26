serve project:
    @echo "Serving {{project}}..."
    cd "videos/{{project}}/" && npm run serve

format:
    @echo "Formatting all files..."
    npm run format
