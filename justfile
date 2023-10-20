serve-video project:
    @echo "Serving {{project}}..."
    cd "videos/{{project}}/" && npm run serve

serve-short project:
    @echo "Serving {{project}}..."
    cd "shorts/{{project}}/" && npm run serve

init-video project:
    @echo "Initializing a new motion canvas project of name {{project}}..."
    cd "videos/" && npm init @motion-canvas@latest

init-short project:
    @echo "Initializing a new motion canvas project of name {{project}}..."
    cd "shorts/" && npm init @motion-canvas@latest
