from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4321"
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.environ["OPENROUTER_API_KEY"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


class CoverLetter(BaseModel):
    text: str

class Feedback(BaseModel):
    feedback: list[str]

@app.post("/cover/letter/advice")
def advice(text: CoverLetter):
    completion = client.chat.completions.parse(
        model="openai/gpt-oss-20b:free",
        messages=[
            {"role": "system", "content": "You are a human resources expert. \
You are asked to provide some concise and insightful feedback on the main body of a cover letter. \
Could you provide 1-5 concise and helpful suggestions to improve the cover letter. \
Please try and think of things that might make the candidate stand out from the crowd."
             },
            {"role": "user", "content": f""" COVERLETTER:
BODY:
{text.text}
"""
             },
        ],
        response_format=Feedback,
        temperature=0.1
    )
    print(completion)
    feedback: Feedback | None = completion.choices[0].message.parsed
    print(feedback)
    assert feedback, "inference, failed"
    return feedback.feedback
