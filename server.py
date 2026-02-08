import http.server
import json
import os

PORT = 5000
SCORE_FILE = 'scores.json'

class ScoreHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/save-score':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            new_score = json.loads(post_data)

            scores = []
            if os.path.exists(SCORE_FILE):
                try:
                    with open(SCORE_FILE, 'r') as f:
                        scores = json.load(f)
                except: scores = []

            scores.append(new_score)
            scores.sort(key=lambda x: x['score'], reverse=True)
            scores = scores[:10]

            with open(SCORE_FILE, 'w') as f:
                json.dump(scores, f)

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(scores).encode())
        else:
            self.send_error(404, "File not found")
    
    def do_GET(self):
        if self.path == '/save-score':
            scores = []

            if os.path.exists(SCORE_FILE):
                try:
                    with open(SCORE_FILE, 'r') as f:
                        scores = json.load(f)
                except (json.JSONDecodeError, IOError):
                    scores = []

            scores.sort(key=lambda x: x['score'], reverse=True)
            scores = scores[:10]

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(scores).encode())
        else:
            self.send_error(404, "Not found")


http.server.HTTPServer(('0.0.0.0', PORT), ScoreHandler).serve_forever()