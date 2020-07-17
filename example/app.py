import json
import mimetypes

from flask import Blueprint, Flask, request
from flask import render_template
from flask_restx import Api, Resource
from flask_socketio import SocketIO, emit, send
from werkzeug.datastructures import FileStorage

from sdk.async_client import send_file

app = Flask(__name__)
app.config["SECRET_KEY"] = "EXAMPLE"
app.config["JSON_AS_ASCII"] = False
app.config["SWAGGER_UI_DOC_EXPANSION"] = "list"
app.config["RESTPLUS_MASK_SWAGGER"] = False
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

blueprint = Blueprint("datapoint-extraction-api", __name__, url_prefix="/api")

api = Api(
    blueprint,
    version="1.0",
    title="Extract API",
    description="Extract API",
    doc="/docs",
)

app.register_blueprint(blueprint, url_prefix="/api")

document_parser = api.parser()
document_parser.add_argument("document_type", location="form", required=True)
document_parser.add_argument("title", location="form", required=True)
document_parser.add_argument(
    "file", location="files", type=FileStorage, required=True, help="The Document file is required"
)


@api.route("/upload/")
class Upload(Resource):
    @api.doc("Create a document")
    @api.expect(document_parser, validate=True)
    def post(self):
        args = document_parser.parse_args()
        document_type = args.get("document_type")
        title = args.get("title")
        blob = args.file.read()
        data = send_file(document_type, title, args.file.filename, blob, mime_type=args.file.content_type)
        return data


@api.route("/web_hook/")
class WebHook(Resource):
    @api.doc("Web hook")
    def post(self):
        data = request.json
        file_path = f"../.cache/{data['id']}.result.json"
        with open(file_path, "w") as f:
            json.dump(data, f, indent=2)
        emit("data", data, json=True, namespace="/", broadcast=True, async_mode="gevent")
        return {}


@app.route("/")
def documents():
    return render_template("index.html")


socketio = SocketIO(app, path="/socket.io/")


def handle_message(json):
    print("received json: " + str(json))


if __name__ == "__main__":
    socketio.run(app, port=8080)
