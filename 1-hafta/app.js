/*
Soru - 1
Aşağıdaki modern JavaScript özelliklerini kullanarak bir fonksiyon yazın:
Template Literals (şablon dizgiler)
Arrow Functions (ok fonksiyonları)
Destructuring (parçalama ataması)
Spread Operator (yayılma operatörü)
*/

//arrow function
const handleHelloUser = (user) => {
  const { name, age, city } = user; // Destructing

  const message = `Merhabalar ${name}, ${age} yaşındasınız ve ${city} şehrinde yaşıyorsunuz.`; // Template Literals

  const updatedUser = {
    ...user,
    message, // Spread Operator
  };

  console.log(message);
  return updatedUser;
};

const fakeUser = {
  name: "Ahmet",
  age: 30,
  city: "İstanbul",
};

handleHelloUser(fakeUser);

// Soru - 2
// Aşağıdaki müşteri listesini kullanarak soruları çözmeye çalışın. İstenen çıktıları belirttim. Kendi kodunuzu yazıp çalıştırarak öğrenmeye çalışın.

const customers = [
  { id: 1, name: "Ahmet", age: 32, city: "Ankara", orders: [100, 200, 150] },
  { id: 2, name: "Ayşe", age: 27, city: "İstanbul", orders: [300, 50] },
  { id: 3, name: "Mehmet", age: 40, city: "İzmir", orders: [500, 100, 200] },
  { id: 4, name: "Fatma", age: 35, city: "Ankara", orders: [300] },
  { id: 5, name: "Zeynep", age: 28, city: "Bursa", orders: [] },
];

//   Soru: İstanbul'da yaşayan müşterilerin isimlerini bir dizi olarak döndür.

const istanbulCustomers = customers
  .filter((customer) => customer.city === "İstanbul")
  .map((customer) => customer.name);

// Soru: Siparişleri toplamda 300 TL’den fazla olan ilk müşterinin adını döndür.

const customerBiggerThan300 = customers.find(
  (customer) => customer.orders.reduce((acc, order) => acc + order, 0) > 300
).name;

// Soru: Şehir bazında toplam sipariş miktarlarını döndür.
const cityOrderCount = customers.reduce((acc, customer) => {
  acc[customer.city] = (acc[customer.city] || 0) + customer.orders.length;

  return acc;
}, {});

// Soru: Her müşterinin toplam sipariş miktarını ve yaşını bir string olarak şu formatta döndür: Ahmet (32): 450 TL

const customerAgeAndOrder = customers.map((customer)=>{
    const orderCount = customer.orders.reduce((acc,order)=>acc+order,0);
    const message = `${customer.name} (${customer.age}): ${orderCount} TL`;
    return message;
})


// Soru: Tüm müşterilerin siparişlerini en yüksekten en düşüğe sıralayıp tek bir dizi olarak döndür.

const allOrders = customers.map((customer)=>customer.orders).flat().sort((a,b)=>b-a)

