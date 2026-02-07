import http.server
import json
import os

PORT = 5000
SCORE_FILE = 'scores.json'

class ScoreHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/save-score':
            content_length = int(self.headers['Content-Length'])
            new_score = json.loads(self.rfile.read(content_length))

            scores = []
            if os.path.exists(SCORE_FILE):
                with open(SCORE_FILE, 'r') as f:
                    scores = json.load(f)

            scores.append(new_score)
            scores.sort(key=lambda x: x['score'], reverse=True)
            scores = scores[:10]  # Keep Top 10

            with open(SCORE_FILE, 'w') as f:
                json.dump(scores, f)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(scores).encode())
        else:
            super().do_POST()

print(f"Serving at http://localhost:{PORT}")
http.server.HTTPServer(('', PORT), ScoreHandler).serve_forever()