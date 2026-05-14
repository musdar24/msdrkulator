function konversi(){

  let jenis =
  document.getElementById("jenis").value;

  let nilai =
  parseFloat(
  document.getElementById("nilai").value
  );

  // Validasi input
  if(isNaN(nilai)){

    alert("Masukkan angka terlebih dahulu!");

    return;
  }

  let hasil;
  let penjelasan;

  // =====================
  // KONVERSI PANJANG
  // =====================

  // CM → METER
  if(jenis == "cm-meter"){

    hasil = nilai / 100;

    penjelasan =
    nilai + " cm ÷ 100 = " +
    hasil + " meter";

    hasil += " meter";

  }

  // METER → CM
  else if(jenis == "meter-cm"){

    hasil = nilai * 100;

    penjelasan =
    nilai + " meter × 100 = " +
    hasil + " cm";

    hasil += " cm";

  }

  // KM → METER
  else if(jenis == "km-meter"){

    hasil = nilai * 1000;

    penjelasan =
    nilai + " km × 1000 = " +
    hasil + " meter";

    hasil += " meter";

  }

  // METER → KM
  else if(jenis == "meter-km"){

    hasil = nilai / 1000;

    penjelasan =
    nilai + " meter ÷ 1000 = " +
    hasil + " km";

    hasil += " km";

  }

  // =====================
  // KONVERSI BERAT
  // =====================

  // KG → GRAM
  else if(jenis == "kg-gram"){

    hasil = nilai * 1000;

    penjelasan =
    nilai + " kg × 1000 = " +
    hasil + " gram";

    hasil += " gram";

  }

  // GRAM → KG
  else if(jenis == "gram-kg"){

    hasil = nilai / 1000;

    penjelasan =
    nilai + " gram ÷ 1000 = " +
    hasil + " kg";

    hasil += " kg";

  }

  // =====================
  // KONVERSI SUHU
  // =====================

  // CELCIUS → FAHRENHEIT
  else if(jenis == "c-f"){

    hasil = (nilai * 9/5) + 32;

    penjelasan =
    "(" + nilai + " × 9/5) + 32 = " +
    hasil + " °F";

    hasil += " °F";

  }

  // FAHRENHEIT → CELCIUS
  else if(jenis == "f-c"){

    hasil = (nilai - 32) * 5/9;

    penjelasan =
    "(" + nilai + " - 32) × 5/9 = " +
    hasil.toFixed(2) + " °C";

    hasil =
    hasil.toFixed(2) + " °C";

  }

  // =====================
  // TAMPILKAN HASIL
  // =====================

  document.getElementById("hasil").innerHTML =
  hasil;

  document.getElementById("penjelasan").innerHTML =

  "<b>Penjelasan:</b><br><br>" +

  penjelasan;

}