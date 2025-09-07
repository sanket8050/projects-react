import xlsx from "xlsx";

export const parseAnswerKey = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  // Expect Excel format: | Question | Answer |
  let answers = {};
  data.forEach(row => {
    answers[`Q${row.Question}`] = row.Answer;
  });

  return answers;  // { Q1: "B", Q2: "D", Q3: "C" }
};
