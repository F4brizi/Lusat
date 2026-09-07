import http.server
import socketserver

PORT = 8085

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    # Sobrescribimos el metodo que hace la resolucion DNS inversa
    def address_string(self):
        # En vez de buscar el hostname, devolvemos la IP cruda instantaneamente
        return self.client_address[0]

# Nos aseguramos de bindear a todas las interfaces de red (0.0.0.0)
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Servidor HTTP ultrarrapido corriendo en el puerto {PORT} (Cache deshabilitado)")
    httpd.serve_forever()
