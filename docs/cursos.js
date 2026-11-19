/*
  ACTUALIZACIÓN MÉDICA CONTINUA (cursos, congresos y reconocimientos del doctor)
  ------------------------------------------------------------------------------
  Agrega cada curso nuevo AL INICIO de la lista, para que el más reciente salga primero.
  Cada curso va entre llaves { } y separado por coma.

  - fecha: mes y año (ej. "noviembre 2026")
  - titulo: nombre oficial del curso, congreso o reconocimiento
  - sede: institución o ciudad (ej. "Sociedad Mexicana de ORL, Ciudad de México")
  - tema: para qué le sirve al paciente, en lenguaje profesional
          (ej. "Actualización en técnicas de rinoplastia preservadora.")
  - premio: true si es un premio o reconocimiento (se resalta en dorado). Opcional.
  - foto: opcional, ruta de una foto del diploma o del evento guardada en assets/cursos/

  Ejemplo (borra las dos diagonales // del inicio para activarlo):
  // { fecha: "noviembre 2026", titulo: "Nombre del curso", sede: "Institución, ciudad", tema: "Actualización en ...", premio: false, foto: "assets/cursos/curso-nov-2026.jpg" },

  Mientras esta lista esté vacía, la sección muestra solo el texto general de actualización continua.
*/
window.CURSOS = [

];
