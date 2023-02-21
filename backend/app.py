import json
import requests
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

firebase_url = "https://rudderstack-api-default-rtdb.firebaseio.com"
firebase_headers = {
    'Content-Type': 'application/json'
}


@app.post("/template")
async def create_template(source: dict = Body(...)):

    payload = json.dumps(source)

    response = requests.request(
        "POST", f"{firebase_url}/templates.json", headers=firebase_headers, data=payload)

    if response.status_code not in range(200, 300):
        return {"error": "Error adding source template"}

    return {"message": "Source template successfully added"}


@app.get("/template/{type}")
async def get_template(type: str):

    response = requests.request(
        "GET", f"{firebase_url}/templates.json", headers={}, data={})

    if response.status_code not in range(200, 300):
        return {"error": "Error getting template"}

    response = response.json()

    for key, template in response.items():
        if template.get("type", None) == type:
            return template

    return {"error": "Template not found"}


@app.get("/templates")
async def get_templates():

    response = requests.request(
        "GET", f"{firebase_url}/templates.json", headers={}, data={})

    if response.status_code not in range(200, 300):
        return {"error": "Error getting template"}

    response = response.json()
    templates = []
    for key, template in response.items():
        if template.get("type", None):
            templates.append(template.get("type"))

    if templates:
        return templates
    return {"error": "Template not found"}


@app.get("/sources")
async def get_sources():

    response = requests.request(
        "GET", f"{firebase_url}/sources.json", headers={}, data={})

    if response.status_code not in range(200, 300):
        return {"error": "Error getting sources"}

    response = response.json()
    return response


@app.post("/source")
async def create_source(source: dict = Body(...)):
    payload = json.dumps(source)

    response = requests.request(
        "POST", f"{firebase_url}/sources.json", headers=firebase_headers, data=payload)

    if response.status_code not in range(200, 300):
        return {"error": "Error adding source"}

    return {"message": "Source created successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
