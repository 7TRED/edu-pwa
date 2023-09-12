import azure.functions as func
import logging
import json
from chatbot import get_completion_from_messages

app = func.FunctionApp(http_auth_level=func.AuthLevel.FUNCTION)


@app.route(route="ChatBotTrigger")
def ChatBotTrigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    response = dict()
    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
            print(req_body)
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


@app.route(route="YTBotTrigger")
def YTBotTrigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    response = dict()
    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
            print(req_body)
            # response_content = get_completion_from_messages(
            #     req_body["context"])
            # response = {
            #     "role": "assistant",
            #     "content": response_content
            # }
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
