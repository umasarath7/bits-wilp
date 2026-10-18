"""Local dev server that tells the browser never to reuse stale copies.

Plain `python3 -m http.server` sends no Cache-Control header, so browsers may keep
serving an old data/subjects.js (or lecture file) after it changes.
Usage: python3 tools/serve.py [port]   (run from study-site/)
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    ThreadingHTTPServer(("0.0.0.0", port), NoCacheHandler).serve_forever()
