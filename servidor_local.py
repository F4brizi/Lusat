import http.server
import os
import re
import socketserver

PORT = 8085
RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)")
CHUNK = 64 * 1024


class Handler(http.server.SimpleHTTPRequestHandler):
    # HTTP/1.1 permite keep-alive: el navegador reutiliza conexiones para teselas y datasets
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    # Sobrescribimos el metodo que hace la resolucion DNS inversa
    def address_string(self):
        # En vez de buscar el hostname, devolvemos la IP cruda instantaneamente
        return self.client_address[0]

    # --- Soporte de HTTP Range (byte serving) ---
    # PMTiles pide rangos de bytes del archivo .pmtiles. Sin esto el servidor devolvia
    # el archivo completo (20 MB) por cada tesela y la libreria abortaba la peticion.
    def send_head(self):
        self._range_length = None
        range_header = self.headers.get("Range")
        path = self.translate_path(self.path)
        if not range_header or os.path.isdir(path):
            return super().send_head()

        match = RANGE_RE.match(range_header)
        if not match:
            return super().send_head()

        try:
            f = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = os.fstat(f.fileno()).st_size
        start_s, end_s = match.groups()
        if start_s == "":
            # Rango por sufijo: bytes=-N (ultimos N bytes)
            start = max(0, size - int(end_s or 0))
            end = size - 1
        else:
            start = int(start_s)
            end = int(end_s) if end_s else size - 1
        end = min(end, size - 1)

        if start > end or start >= size:
            f.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None

        self._range_length = end - start + 1
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(self._range_length))
        self.end_headers()
        f.seek(start)
        return f

    def copyfile(self, source, outputfile):
        remaining = self._range_length
        if remaining is None:
            return super().copyfile(source, outputfile)
        while remaining > 0:
            chunk = source.read(min(CHUNK, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)

    def handle(self):
        # El navegador cancela descargas a mitad de camino (teselas fuera de vista):
        # no es un error, no ensuciamos la consola con tracebacks.
        try:
            super().handle()
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass


class ThreadingServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    # Un hilo por conexion: un GeoJSON de 20 MB ya no bloquea el resto de las peticiones
    daemon_threads = True
    allow_reuse_address = True


# Nos aseguramos de bindear a todas las interfaces de red (0.0.0.0)
with ThreadingServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Servidor HTTP multihilo con soporte Range corriendo en el puerto {PORT} (Cache deshabilitado)")
    httpd.serve_forever()
