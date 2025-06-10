// const { Pool } = require("pg");
// const fs = require("fs");
// const copyFrom = require("pg-copy-streams").from;

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "EduForecast",
//   password: "abc@abc@",
//   port: 5432,
// });

// const csvFilePath = "C:\\Users\\usman\\OneDrive\\Desktop\\PREADV\\fact_dropout_aligned.csv";

// async function importCSV(filePath) {
//   const client = await pool.connect();

//   try {
//     const stream = client.query(copyFrom(`
//       COPY fact_dropout FROM STDIN WITH CSV HEADER DELIMITER ','
//     `));
//     const fileStream = fs.createReadStream(filePath);

//     fileStream.pipe(stream)
//       .on('finish', () => {
//         console.log("✅ CSV imported successfully.");
//         client.release();
//       })
//       .on('error', (err) => {
//         console.error("❌ Stream error during import:", err.message);
//         client.release();
//       });
//   } catch (err) {
//     console.error("❌ Database error:", err.message);
//     client.release();
//   }
// }

// // Call the function
// importCSV(csvFilePath);
