import axios from "axios";

export const callPythonOMR = async (imagePath) => {
  try {
    const res = await axios.post("http://localhost:5001/process-omr", {
      image: imagePath,   // or you can send base64 instead of path
    });
    return res.data; // { answers: { Q1: "B", Q2: "C", ... } }
  } catch (err) {
    console.error("Error calling Python OMR:", err.message);
    throw err;
  }
};
