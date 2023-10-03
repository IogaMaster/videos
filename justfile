serve project:
    @echo "Serving {{project}}..."
    cd "videos/{{project}}/" && npm run serve

format:
    @echo "Formatting all files..."
    npm run format


init project:
    @echo "Initializing a new motion canvas project of name {{project}}..."
    cd "videos/" && npm init @motion-canvas@latest
