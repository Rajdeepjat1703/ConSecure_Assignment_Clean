import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import prisma from '../db/prisma';

const filePath = path.join(__dirname, '../../Cybersecurity_Dataset.csv');

async function run() {
  const threats: any[] = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      try {
        const cleanedRow = {
          Threat_Category: row["Threat Category"] || null,
          IOCs: row["IOCs (Indicators of Compromise)"]
            ? JSON.parse(row["IOCs (Indicators of Compromise)"].replace(/'/g, '"'))
            : [],
          Threat_Actor: row["Threat Actor"] || null,
          Attack_Vector: row["Attack Vector"] || null,
          Geography: row["Geographical Location"] || null,
          Sentiment: row["Sentiment in Forums"] ? parseFloat(row["Sentiment in Forums"]) : null,
          Severity_Score: row["Severity Score"] ? parseInt(row["Severity Score"]) : 0,
          Predicted_Threat: row["Predicted Threat Category"] || null,
          Suggested_Action: row["Suggested Defense Mechanism"] || null,
          Risk_Level: row["Risk Level Prediction"] ? parseInt(row["Risk Level Prediction"]) : 0,
          Cleaned_Threat_Description: row["Cleaned Threat Description"] || null,
          Keywords: row["Keyword Extraction"]
            ? JSON.parse(row["Keyword Extraction"].replace(/'/g, '"'))
            : [],
          Named_Entities: row["Named Entities (NER)"]
            ? JSON.parse(row["Named Entities (NER)"].replace(/'/g, '"'))
            : [],
          Topic_Model: row["Topic Modeling Labels"] || null,
          Word_Count: row["Word Count"] ? parseInt(row["Word Count"]) : 0,
        };

        threats.push(cleanedRow);
      } catch (err) {
        console.error('Error parsing row:', row, '\nError:', err);
      }
    })
    .on('end', async () => {
      console.log(`Parsed ${threats.length} records.`);

      for (const threat of threats) {
        try {
          await prisma.threat.create({ data: threat });
        } catch (err) {
          console.error('Error inserting into DB:', threat, '\nError:', err);
        }
      }

      console.log('Data inserted into DB successfully!');
      process.exit(0);
    });
}

run().catch((err) => {
  console.error('Failed to ingest data:', err);
  process.exit(1);
});
