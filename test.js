
    window.onerror = function(message, source, lineno, colno, error) {
      alert("ERROR JS: " + message + " en linea " + lineno);
      return false;
    };
  