from fastapi import FastAPI, UploadFile, File
import uvicorn
from omr_processor import process_omr

app = FastAPI()

@app.post("/process-omr")
async def process_omr_api(file: UploadFile = File(...)):
    # Save uploaded file
    contents = await file.read()
    with open("temp_omr.jpg", "wb") as f:
        f.write(contents)
    
    # Process OMR
    answers = process_omr("temp_omr.jpg")
    
    return {"answers": answers}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
