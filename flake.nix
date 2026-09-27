{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            # Original tools
            typescript-language-server # (Updated from nodePackages)
            nodejs_22 # Specific stable Node version recommended
            just
            chromium

            # Monorepo Orchestration
            pnpm
            turbo

            # Video backend needed for Canvas Commons rendering
            ffmpeg-headless
          ];

          buildInputs = with pkgs; [ ];

          shellHook = ''
            # Ensures Chromium path is set if headless testing/rendering needs it
            export CHROME_BIN="${pkgs.chromium}/bin/chromium"
          '';
        };
      }
    );
}
