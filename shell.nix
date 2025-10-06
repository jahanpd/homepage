# shell.nix
{ pkgs ? import <nixpkgs> {} }:

let
  python = pkgs.python313;
in
pkgs.mkShell {
  packages = [
		pkgs.python313
		pkgs.python313Packages.fastapi
		pkgs.python313Packages.fastapi-cli
		pkgs.python313Packages.pydantic
		pkgs.python313Packages.openai
		pkgs.basedpyright
  ];

  # note need to be in backend for alembic things to run
  shellHook = ''
		# define a simple function instead of an alias
    serve_backend() {
      python -m uvicorn main:app --reload --port 8765
    }
		set -a
		. .env
		set +a
		echo '✅ dev shell ready. Run: serve_backend'
  '';
}
