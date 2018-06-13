
def handler(event, context):

    return {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": {},
        "body": {
            "message": "Hello from Lambda!"
        }
    }