const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());
const persons = JSON.parse(fs.readFileSync(`${__dirname}/person.json`));

app.get("/", (req, res) => {
  res.send("Hello kamu masuk app");
});

app.get("/person", (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      persons: persons,
    },
  });
});

app.post("/person", (req, res) => {
  console.log(persons.length - 1);
  const newId = persons.length - 1 + 10;
  const newPerson = Object.assign({ id: newId }, req.body);

  persons.push(newPerson);
  fs.writeFile(`${__dirname}/person.json`, JSON.stringify(persons), (errr) => {
    res.status(201).json({
      status: "success",
      data: {
        person: newPerson,
      },
    });
  });
});

// DAILY TASK CHAPTER 3
// 1) bikin proses put/edit data sukses sampai data nya teredit di file json nya
// 2) bikin validasi jika id tidak ditemukan dari params id nya di api get data by id, delete dan put
// 3) bikin validasi di create/edit API utk request body

// Methode GET Data Person
app.get("/person/:id", (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const person = persons.findIndex((el) => el.id === id);

  // Validasi Ketersediaan ID
  if (person !== -1) {
    res.status(200).json({
      status: "success",
      data: {
        person,
      },
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: `Data dengan id ${id} tidak ditemukan`,
    });
  }
});

// Methode PUT Data Person
app.put("/person/:id", (req, res) => {
  const id = req.params.id * 1;
  const personIndex = persons.findIndex((el) => el.id === id);

  const position = persons[personIndex].position === "student";
  const length = req.body.name.length;

  // Validasi ketika nama melebihi 20 karakter maka tidak bisa dilakukan perubahan
  if (length > 20) {
    res.status(400).json({
      status: "fail",
      message: `Data nama anda terlalu panjang`,
    });

    // Validasi jika data yang akan diedit adalah data guru, maka data tidak bisa dirubah
  } else if (position === false) {
    res.status(400).json({
      status: "fail",
      message: `Data dengan id ${id} merupakan data guru, ANDA TIDAK BISA MELAKUKAN PERUBAHAN`,
    });

    // Validasi Ketersediaan ID
  } else if (personIndex !== -1) {
    persons[personIndex] = { ...persons[personIndex], ...req.body };
    res.status(200).json({
      status: "success",
      message: `Data dengan id ${id} berhasil diubah`,
      data: persons[personIndex],
    });
    fs.writeFile(
      `${__dirname}/person.json`,
      JSON.stringify(persons),
      (errr) => {
        res.status(200).json({
          status: "success",
          message: `data dari id ${id} berhasil berubah`,
        });
      }
    );
  } else {
    res.status(404).json({
      status: "fail",
      message: `Data dengan id ${id} tidak ditemukan`,
    });
  }
});

// Methode DELETE Data Person
app.delete("/person/:id", (req, res) => {
  const id = req.params.id * 1;

  const index = persons.findIndex((element) => element.id === id);
  // const person = persons.find((el) => el.id === id);

  const position = persons[index].position === "student";

  // Validasi jika data yang akan dihapus adalah data guru, maka data tidak bisa dihapus

  if (position === false) {
    res.status(400).json({
      status: "fail",
      message: `Data dengan id ${id} merupakan data guru, ANDA TIDAK BISA MELAKUKAN PERUBAHAN`,
    });
  } else if (index !== -1) {
    persons.splice(index, 1);

    fs.writeFile(
      `${__dirname}/person.json`,
      JSON.stringify(persons),
      (errr) => {
        res.status(200).json({
          status: "success",
          message: `data dari id ${id} nya berhasil dihapus`,
        });
      }
    );
  } else {
    res.status(400).json({
      status: "failed",
      message: `person dengan id ${id} tersebut invalid/gak ada`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`App running on local host: ${PORT}`);
});
