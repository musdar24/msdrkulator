function hitungDiskon(){

  // Ambil harga lalu hapus titik
  let hargaInput =
  document.getElementById("harga").value;

  let harga =
  parseFloat(hargaInput.replace(/\./g,""));

  // Ambil diskon
  let diskonInput =
  document.getElementById("diskon").value;

  // Cek apakah ada %
  if(!diskonInput.includes("%")){

    alert("Diskon harus menggunakan tanda %");

    return;
  }

  // Ambil angka diskon
  let diskon =
  parseFloat(diskonInput.replace("%",""));

  // Validasi angka
  if(isNaN(harga) || isNaN(diskon)){

    alert("Masukkan angka dengan benar!");

    return;
  }

  // Hitung
  let potongan =
  harga * diskon / 100;

  let total =
  harga - potongan;

  // Format rupiah dengan titik
  let formatHarga =
  harga.toLocaleString("id-ID");

  let formatPotongan =
  potongan.toLocaleString("id-ID");

  let formatTotal =
  total.toLocaleString("id-ID");

  // Tampilkan hasil
  document.getElementById("hargaAwal").innerHTML =
  "Harga Awal : Rp" + formatHarga;

  document.getElementById("diskonPersen").innerHTML =
  "Diskon : " + diskon + "%";

  document.getElementById("potongan").innerHTML =
  "Potongan Harga : Rp" + formatPotongan;

  document.getElementById("total").innerHTML =
  "Total Bayar : Rp" + formatTotal;

  // Penjelasan
  document.getElementById("penjelasan").innerHTML =

  "<b>Penjelasan:</b><br><br>" +

  "Potongan harga dihitung menggunakan rumus:<br>" +

  "<b>Harga × Diskon ÷ 100</b><br><br>" +

  "Rp" + formatHarga +

  " × " + diskon + "% ÷ 100 = Rp" +

  formatPotongan +

  "<br><br>" +

  "Kemudian total pembayaran dihitung:<br>" +

  "<b>Harga Awal - Potongan</b><br><br>" +

  "Rp" + formatHarga +

  " - Rp" + formatPotongan +

  " = Rp" + formatTotal;

}