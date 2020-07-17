import enum
import json
import logging
import os

import requests
from requests.compat import urljoin


class DocumentStatus(enum.Enum):
    pending = "Pending"
    finished = "Finished"
    failed = "Failed"
    processing = "Processing"


SERVER = "https://app.extracthd.com/"
TOKEN = "<TOKEN>"
UNFINISHED = [DocumentStatus.pending.value, DocumentStatus.processing.value]
SLEEP_TIME = 10


def send_file(document_type, title, file_name, blob, mime_type="application/pdf"):
    # Prepare payload
    payload_files = {"file": (file_name, blob, mime_type)}
    payload_data = {
        "title": title,
        "send_email": "false",
        "document_type": document_type,
        "web_hook": "https://your_server_address/api/web_hook/",
    }

    # Post file and data - "content-type": "multipart/form-data"
    logging.warning("Sending request")
    response = requests.post(
        urljoin(SERVER, "/api/jobs/documents/"),
        data=payload_data,
        files=payload_files,
        headers={"authorization": TOKEN},
    )
    assert response.ok
    id = response.json()["id"]
    logging.warning(f"Sent with id: {id}")
    data = {"document_type": document_type, "title": title, "file_name": file_name, "mime_type": mime_type, "id": id}
    os.makedirs("../.cache/", exist_ok=True)
    with open(f"../.cache/{id}.json", "w") as f:
        json.dump(data, f, indent=2)
    return data
