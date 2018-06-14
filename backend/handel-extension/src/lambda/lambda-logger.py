import json
def handler(event, context):

    logs = []
    if 'Content-Type' in event['headers'] and event['headers']['Content-Type'] == 'text':
        log_lines = event['body'].split('\n')
        for line in log_lines:
            line_pieces = line.split('\t')
            parts = []
            for arg in line_pieces[2:]:
                if arg.startswith('{str}'):
                    parts.append({"string": arg[5:].replace('"', '')})
                elif arg.startswith('{err}'):
                    parts.append({"error": arg[5:].replace('"', '')})
                elif arg.startswith('{obj}'):
                    parts.append({"object": arg[5:].replace('"', '')})
            logs.append({
                "timestamp": line_pieces[0],
                "level": line_pieces[1],
                "parts": parts
            })
    elif 'Content-Type' in event['headers'] and event['headers']['Content-Type'] == 'application/json':
        logs = json.loads(event['body'])

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
        print(log_string)
        successfull_logs += 1

    body_str = '{"message": "Successfully logged ' + str(successfull_logs) + ' log entries"}'

    return {
        "isBase64Encoded": False,
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": body_str
    }