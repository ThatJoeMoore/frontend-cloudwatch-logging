import json
def handler(event, context):
    # print(event)
    logs = []
    headers = {k.lower():v for k,v in event['headers'].items()}
    # print(headers)
    if 'content-type' not in headers:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": '{"message": "Content-Type header is required"}'
        }
    content_type = headers['content-type']
    if 'text/plain' in content_type:
        # print(event['body'])
        log_lines = str(event['body']).splitlines()
        # print(len(log_lines))
        for line in log_lines:
            line_pieces = line.split('\t')
            parts = []
            # print(line_pieces)
            for arg in line_pieces[2:]:
                if arg.startswith('{str}'):
                    parts.append({"string": arg[6:-1]})
                elif arg.startswith('{err}'):
                    parts.append({"error": arg[5:]})
                elif arg.startswith('{obj}'):
                    parts.append({"object": arg[5:]})
                elif arg.startswith('{evt}'):
                    parts.append({"event": arg[5:]})
            logs.append({
                "timestamp": line_pieces[0],
                "level": line_pieces[1],
                "parts": parts
            })
    elif 'application/json' in content_type:
        logs = json.loads(event['body'])
    else:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": '{"message": "Unknown Content-Type header. Please use application/json or text/plain"}'
        }

    successfull_logs = 0
    for log in logs:
        log_string = "{}\t{}".format(log['timestamp'], log['level'])
        for part in log['parts']:
            if 'string' in part:
                log_string += "\t{}".format(part['string'])
            elif 'object' in part:
                log_string += "\t{}".format(part['object'])
            elif 'error' in part:
                log_string += "\t{}".format(part['error'])
            elif 'event' in part:
                log_string += "\t{}".format(part['event'])
        print(log_string)
        successfull_logs += 1

    body_str = '{"message": "Successfully logged ' + str(successfull_logs) + ' log entries"}'

    response = {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": body_str
    }
    # print(response)
    return response