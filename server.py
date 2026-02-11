import http.server
import json
import os

PORT = 5000

STRATEGY_FILES = {
    "max": "max.json",
    "jorgen": "jorgen.json",
    "imon": "imon.json"
}

class ScoreHandler(http.server.SimpleHTTPRequestHandler):
    def get_file_for_strategy(self, strategy):
        return STRATEGY_FILES.get(strategy, 'scores.json')

    def load_scores(self, filename):
        if os.path.exists(filename):
            try:
                with open(filename, 'r') as f:
                    return json.load(f)
            except:
                return []
        return []

    def get_leaderboard_data(self, scores):
        sorted_scores = sorted(scores, key=lambda x: x.get('score', 0), reverse=True)
        return {
            "top_10": sorted_scores[:10],
            "bot_10": sorted_scores[-10:] if len(sorted_scores) > 10 else []
        }

    def do_POST(self):
        if self.path == '/save-score':
            content_length = int(self.headers['Content-Length'])
            new_score = json.loads(self.rfile.read(content_length))
            
            strategy = new_score.get('strategy')
            filename = self.get_file_for_strategy(strategy)
            
            scores = self.load_scores(filename)
            scores.append(new_score)
            
            with open(filename, 'w') as f:
                json.dump(scores, f)

            response_data = self.get_leaderboard_data(scores)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
        else:
            self.send_error(404)
    
    def do_GET(self):
        if self.path == '/get-score':
            all_leaderboards = {}

            for strategy, filename in STRATEGY_FILES.items():
                scores = self.load_scores(filename)
                all_leaderboards[strategy] = self.get_leaderboard_data(scores)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()

            # Returns { "max": { "top_10": [...], "bot_10": [...] }, "jorgen": ... }
            self.wfile.write(json.dumps(all_leaderboards).encode())
        else:
            super().do_GET()

print(f"Server running on port {PORT}")
http.server.HTTPServer(('0.0.0.0', PORT), ScoreHandler).serve_forever()