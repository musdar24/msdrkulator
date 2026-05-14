document.getElementById("mode").addEventListener("change", function(){

  let mode = this.value;

  let label =
  document.getElementById("labelInput");

  let input =
  document.getElementById("nilai");

  if(mode == "jarak"){

    label.innerHTML = "Waktu";
    input.placeholder = "Contoh: 2 jam";

  }

  else{

    label.innerHTML = "Jarak";
    input.placeholder = "Contoh: 120 km";

  }

});

function hitung(){

  let mode =
  document.getElementById("mode").value;

  // Ambil input kecepatan
  let kecepatanInput =
  document.getElementById("kecepatan").value.toLowerCase();

  // Validasi km/jam
  if(!kecepatanInput.includes("km/jam")){

    alert("Kecepatan harus memakai km/jam");

    return;
  }

  let kecepatan =
  parseFloat(
  kecepatanInput.replace("km/jam","")
  );

  // Ambil input kedua
  let nilaiInput =
  document.getElementById("nilai").value.toLowerCase();

  let nilai;

  // MODE HITUNG JARAK
  if(mode == "jarak"){

    // Harus jam/menit/detik
    if(
      !nilaiInput.includes("jam") &&
      !nilaiInput.includes("menit") &&
      !nilaiInput.includes("detik")
    ){

      alert(
      "Waktu harus memakai jam, menit, atau detik"
      );

      return;
    }

    nilai = parseFloat(nilaiInput);

    // Konversi ke jam
    if(nilaiInput.includes("menit")){

      nilai = nilai / 60;

    }

    else if(nilaiInput.includes("detik")){

      nilai = nilai / 3600;

    }

    let jarak =
    kecepatan * nilai;

    document.getElementById("hasilAkhir").innerHTML =
    "Jarak : " + jarak.toFixed(2) + " km";

    document.getElementById("penjelasan").innerHTML =

    "<b>Penjelasan:</b><br><br>" +

    "Jarak = Kecepatan × Waktu<br><br>" +

    kecepatan + " × " +

    nilai.toFixed(2) +

    " = " +

    jarak.toFixed(2) + " km";

  }

  // MODE HITUNG WAKTU
  else{

    // Harus km
    if(!nilaiInput.includes("km")){

      alert("Jarak harus memakai km");

      return;
    }

    nilai = parseFloat(
    nilaiInput.replace("km","")
    );

    let waktu =
    nilai / kecepatan;

    document.getElementById("hasilAkhir").innerHTML =
    "Waktu : " + waktu.toFixed(2) + " jam";

    document.getElementById("penjelasan").innerHTML =

    "<b>Penjelasan:</b><br><br>" +

    "Waktu = Jarak ÷ Kecepatan<br><br>" +

    nilai + " ÷ " +

    kecepatan +

    " = " +

    waktu.toFixed(2) + " jam";

  }

}