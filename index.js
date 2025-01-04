const welcomeScreen = document.getElementById('welcomeScreen');
const newSaleScreen = document.getElementById('newSaleScreen');
const viewSalesScreen = document.getElementById('viewSalesScreen');
const newSaleScreenBtn = document.getElementById('newSaleScreenBtn');
const viewSalesBtn = document.getElementById('viewSalesBtn');
const goBackBtn = document.getElementById('goBackBtn');
const goBackFromSalesBtn = document.getElementById('goBackFromSalesBtn');
const calculateProfitBtn = document.getElementById('calculateProfitBtn');
const saveSaleBtn = document.getElementById('saveSaleBtn');
const profitResults = document.getElementById('profitResults');
const deleteAllSalesBtn = document.getElementById('deleteAllSalesBtn');
const salesList = document.getElementById('salesList');
const downloadJsonBtn = document.getElementById('downloadJson');
const filterLocation = document.getElementById('filterLocation');
const filterDate = document.getElementById('filterDate');
const now = new Date();
const date = now.toLocaleDateString(); // Tämä asettaa päivämäärän oikein
// Tallennetut myynnit
let sales = JSON.parse(localStorage.getItem('sales')) || [];
let filteredSales = [...sales];

// Näyttöjen hallinta
document.addEventListener('DOMContentLoaded', () => {
  welcomeScreen.classList.remove('hidden');
  newSaleScreen.classList.add('hidden');
  viewSalesScreen.classList.add('hidden');
});

newSaleScreenBtn.addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  newSaleScreen.classList.remove('hidden');
  document.getElementById('saleDate').value = ''; // Tyhjennä kenttä oletuksena

  // Generoi satunnainen tunnus
  const randomId = Math.floor(1000 + Math.random() * 9000);

  // Päivitä URL
  const newUrl = `${window.location.origin}/neworder-${randomId}`;
  window.history.pushState({ page: "newsale" }, "", newUrl);
});

document.addEventListener('DOMContentLoaded', () => {
  // Asetetaan osoiteriville /front sovelluksen käynnistyessä
  history.replaceState({}, '', '/front');
  
  welcomeScreen.classList.remove('hidden');
  newSaleScreen.classList.add('hidden');
  viewSalesScreen.classList.add('hidden');
});

// Uuden myynnin näkymä
newSaleScreenBtn.addEventListener('click', () => {
  const randomSaleNumber = Math.floor(Math.random() * 100000); // Satunnainen myyntinumero
  history.pushState({}, '', `/newsale-${randomSaleNumber}`); // Päivitetään osoiterivi
  welcomeScreen.classList.add('hidden');
  newSaleScreen.classList.remove('hidden');
});

// Vanhojen myyntien näkymä
viewSalesBtn.addEventListener('click', () => {
  history.pushState({}, '', '/oldsales'); // Päivitetään osoiterivi
  welcomeScreen.classList.add('hidden');
  viewSalesScreen.classList.remove('hidden');
  showFilteredSales(); // Näytetään myynnit
});

// Paluu etusivulle uuden myynnin näkymästä
goBackBtn.addEventListener('click', () => {
  history.pushState({}, '', '/front'); // Palautetaan osoiterivi /front
  newSaleScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
  resetForm(); // Nollaa lomake
});

// Paluu etusivulle vanhojen myyntien näkymästä
goBackFromSalesBtn.addEventListener('click', () => {
  history.pushState({}, '', '/front'); // Palautetaan osoiterivi /front
  viewSalesScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
});

// Laske kate ja näytä tulokset
calculateProfitBtn.addEventListener('click', () => {
  const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
  const salePrice = parseFloat(document.getElementById('salePrice').value);

  if (!isNaN(purchasePrice) && !isNaN(salePrice)) {
    const profit = salePrice - purchasePrice;
    const profitPercentage = ((profit / purchasePrice) * 100).toFixed(2);

    document.getElementById('profit').textContent = profit.toFixed(2);
    document.getElementById('profitPercentage').textContent = profitPercentage;
    profitResults.classList.remove('hidden');
    saveSaleBtn.classList.remove('hidden');
  } else {
    alert('Täytä sekä ostohinta että myyntihinta oikein.');
  }
});

saveSaleBtn.addEventListener('click', () => {
  const saleId = document.getElementById('saleId').value; // Hae myyntinumero
  const purchaseLocation = document.getElementById('purchaseLocation').value.trim();
  const productName = document.getElementById('productName').value.trim();
  const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
  const salePrice = parseFloat(document.getElementById('salePrice').value);
  const saleDate = document.getElementById('saleDate').value.trim();

  if (!purchaseLocation || !productName || isNaN(purchasePrice) || isNaN(salePrice) || !saleDate) {
    alert('Täytä kaikki kentät oikein ennen tallennusta.');
    return;
  }

  // Laskee kate ja kateprosentti
  const profit = (salePrice - purchasePrice).toFixed(2);
  const profitPercentage = ((profit / purchasePrice) * 100).toFixed(2);

  // Lisää päivämäärän ja kellonajan
  const now = new Date();
  const time = now.toLocaleTimeString(); // Esim. "15:45:30"

  // Luo myyntitieto-objektin
  const sale = {
    id: saleId, // Käytä olemassa olevaa myyntinumeroa
    purchaseLocation,
    productName,
    purchasePrice,
    salePrice,
    profit,
    profitPercentage,
    saleDate,
    time,
  };

  // Tallenna localStorageen
  let sales = JSON.parse(localStorage.getItem('sales')) || [];
  sales.push(sale);
  localStorage.setItem('sales', JSON.stringify(sales));

  alert(`Myynti tallennettu! Myyntinumero on: ${saleId}`);
  resetForm();
});

// Näytä myynnit
function showFilteredSales() {
  salesList.innerHTML = '';
  filteredSales.forEach((sale, index) => {
    const saleItem = document.createElement('div');
    saleItem.className = 'sale-item';

    saleItem.innerHTML = `
      <p><strong>${sale.productName}</strong> (${sale.purchaseLocation}, ${sale.saleDate})</p>
      <p>Ostohinta: €${sale.purchasePrice}, Myyntihinta: €${sale.salePrice}</p>
      <p>Kate: €${sale.profit}, Kateprosentti: ${sale.profitPercentage}%</p>
      <p><strong>Myyntinumero:</strong> ${sale.id}</p>
      <button onclick="editSale(${index})">Muokkaa</button>
      <button onclick="deleteSale(${index})">Poista</button>
    `;
    salesList.appendChild(saleItem);
  });
}

// Muokkaa myyntiä
function editSale(index) {
  const sale = filteredSales[index];
  document.getElementById('purchaseLocation').value = sale.purchaseLocation;
  document.getElementById('productName').value = sale.productName;
  document.getElementById('purchasePrice').value = sale.purchasePrice;
  document.getElementById('salePrice').value = sale.salePrice;
  document.getElementById('saleDate').value = sale.saleDate; // Korjattu tästä

  sales.splice(index, 1);
  localStorage.setItem('sales', JSON.stringify(sales));
  newSaleScreen.classList.remove('hidden');
  viewSalesScreen.classList.add('hidden');
}

// Muokkaa myyntiä
function editSale(index) {
  const sale = filteredSales[index];
  document.getElementById('purchaseLocation').value = sale.purchaseLocation;
  document.getElementById('productName').value = sale.productName;
  document.getElementById('purchasePrice').value = sale.purchasePrice;
  document.getElementById('salePrice').value = sale.salePrice;
  document.getElementById('saleDate').value = sale.date;

  sales.splice(index, 1);
  localStorage.setItem('sales', JSON.stringify(sales));
  newSaleScreen.classList.remove('hidden');
  viewSalesScreen.classList.add('hidden');
}

// Poista myynti
function deleteSale(index) {
  sales.splice(index, 1);
  localStorage.setItem('sales', JSON.stringify(sales));
  applyFilters();
}

// Suodata myynnit
function applyFilters() {
  const locationFilter = filterLocation.value;
  const dateFilter = filterDate.value;

  filteredSales = sales.filter((sale) => {
    return (
      (locationFilter === '' || sale.purchaseLocation === locationFilter) &&
      (dateFilter === '' || sale.date === dateFilter)
    );
  });
  showFilteredSales();
}

// Tyhjennä suodatus
function clearFilters() {
  filterLocation.value = '';
  filterDate.value = '';
  filteredSales = [...sales];
  showFilteredSales();
}

// Poista kaikki myynnit
deleteAllSalesBtn.addEventListener('click', () => {
  if (confirm('Oletko varma, että haluat poistaa kaikki myynnit?')) {
    sales = [];
    localStorage.removeItem('sales');
    applyFilters();
  }
});

newSaleScreenBtn.addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  newSaleScreen.classList.remove('hidden');
  document.getElementById('saleDate').value = ''; // Tyhjennä kenttä oletuksena
});

viewSalesBtn.addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  viewSalesScreen.classList.remove('hidden');
  showFilteredSales();
  document.getElementById('saleDate').classList.add('hidden'); // Varmista piilotus
});

// Lataa tiedot JSON-muodossa
downloadJsonBtn.addEventListener('click', () => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sales));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', 'sales_data.json');
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
});


// Nollaa lomake
function resetForm() {
  document.getElementById('purchaseLocation').value = '';
  document.getElementById('productName').value = '';
  document.getElementById('purchasePrice').value = '';
  document.getElementById('salePrice').value = '';
  document.getElementById('saleDate').value = '';
  profitResults.classList.add('hidden');
  saveSaleBtn.classList.add('hidden');
}

