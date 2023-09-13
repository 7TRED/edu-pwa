import azure.functions as func
import logging
import json
from chatbot import get_completion_from_messages
from qa import answerQuery

app = func.FunctionApp(http_auth_level=func.AuthLevel.ADMIN)


@app.route(route="ChatBotTrigger")
def ChatBotTrigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    response = dict()

    if not name:
        try:
            req_body = req.get_json()
            response_content = get_completion_from_messages(
                req_body["context"])
            response = {
                "role": "assistant",
                "content": response_content
            }
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(json.dumps(response))
    else:
        return func.HttpResponse(
            json.dumps(response
                       ),
            status_code=200
        )


@app.route(route="QATrigger")
def QATrigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    response = dict()
    collection_name = ""  # from user
    query = ""
    if not name:
        try:
            req_body = req.get_json()
            collection_name = req_body["collection_name"]
            query = req_body["query"]
            response_content = answerQuery(
                query=query, collection_name=collection_name)
            response = {
                "role": "assistant",
                "content": response_content
            }
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(json.dumps(response))
    else:
        return func.HttpResponse(
            json.dumps(response
                       ),
            status_code=200
        )
