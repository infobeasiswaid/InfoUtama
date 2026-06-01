/* =========================
   DATABASE
========================= */

const DATABASE = {
  cardbeasiswa:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSN6givlinQGBY_iKXPOgtEhyOIvvwfz1j5u7AUvG1JcxUcntBEDYtq3cmislvtQEUWHfgqpI0euy53/pub?gid=0&single=true&output=csv"
};

function getDriveImage(id) {

  if (!id) {
    return "https://via.placeholder.com/400x250";
  }

  return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;

}

function getStatusClass(status) {

  if (!status) return "open";

  switch(status.toLowerCase()) {

    case "dibuka":
      return "open";

    case "segera dibuka":
      return "soon";

    case "ditutup":
      return "closed";

    default:
      return "open";

  }

}


/* =========================
   GLOBAL
========================= */

let data = [];
let currentFilter = "Semua";

const list = document.getElementById("list");
const search = document.getElementById("search");


list.innerHTML = `
  <p style="text-align:center;">
    Memuat data beasiswa...
  </p>
`;

/* =========================
   LOAD DATA
========================= */

async function loadData() {
  try {

    const response = await fetch(
      DATABASE.cardbeasiswa
    );

    const csv = await response.text();

    data = csvToJson(csv);

    render();

  } catch (error) {

  console.error("ERROR DETAIL:", error);

  list.innerHTML = `
    <p style="text-align:center;color:red;">
      Gagal mengambil data beasiswa.
    </p>
  `;

}
}

/* =========================
   CSV TO JSON
========================= */

function csvToJson(csv) {

  const lines = csv
    .trim()
    .split("\n");

  const headers = lines[0]
    .split(",")
    .map(item => item.trim());

  const result = [];

  for (let i = 1; i < lines.length; i++) {

    const values = lines[i].split(",");

    let obj = {};

    headers.forEach((header, index) => {
      obj[header.trim()] =
        values[index]?.trim() || "";
    });

    result.push(obj);

  }

  return result;
}

/* =========================
   RENDER CARD
========================= */

function render() {

  list.innerHTML = "";

  const keyword =
    search.value.toLowerCase();

  const filtered = data.filter(item => {

    const nama =
      (item.nama || "").toLowerCase();

    const negara =
      (item.negara || "").toLowerCase();

    const jenjang =
      (item.jenjang || "").toLowerCase();

    return (

      (
        currentFilter === "Semua" ||
        item.kategori === currentFilter
      ) &&

      (
        nama.includes(keyword) ||
        negara.includes(keyword) ||
        jenjang.includes(keyword)
      )

    );

  });

  if (filtered.length === 0) {

    list.innerHTML = `
      <p style="text-align:center;">
        Data tidak ditemukan.
      </p>
    `;

    return;
  }

  filtered.forEach(item => {

    list.innerHTML += `
      <div class="card">

        <img
        src="${getDriveImage(item.logo)}"
        alt="${item.nama}"
        loading="lazy"
        />
        <span class="tag">
          ${item.kategori || "-"}
        </span>

        <span class="badge">
          ${item.jenjang || "-"}
        </span>

        <span class="status ${getStatusClass(item.status)}">
        ${item.status || "Dibuka"}
        </span>

        <h3>
          ${item.nama || "-"}
        </h3>

        <p class="hook">
          🎓 ${item.hook || ""}
        </p>

        <p>
          🌍 <strong>
            ${item.negara || "-"}
          </strong>
        </p>

        <p>
          ⏰ Deadline:
          <strong>
            ${item.deadline || "-"}
          </strong>
        </p>

        <p class="desc">
          ${item.deskripsi || ""}
        </p>

        <a
          href="${item.link || '#'}"
          target="_blank"
          class="btn"
        >
          Lihat Detail
        </a>

      </div>
    `;
  });

}

/* =========================
   FILTER
========================= */

function filterKategori(kategori) {
  currentFilter = kategori;
  render();
}

/* =========================
   SEARCH
========================= */

search.addEventListener(
  "input",
  render
);

/* =========================
   START
========================= */

loadData();
