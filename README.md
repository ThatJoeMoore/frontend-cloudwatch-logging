# frontend-cloudwatch-logging
Experimental setup for logging frontend events to AWS CloudWatch

# Major Parts

* Handel extension for setting up backend
* Backend Lambda that implements API
* API ES Module that dispatches events to a logging 'provider'
* 'Provider' ES Module that receives log events and sends them to server


# API

```javascript
log.log(''); // alias to info?
log.time('label');
log.timeEnd('label');
log.debug('');
log.info('');
log.warn('');
log.error('');

log.error('I got an error', error, someObj);

log.event({});

```

```json
{
  "level": "debug",
  "timestamp": "",
  "parts": [
    {"string": "I got an error"},
    {"error": {}},
    {"object": {}}
  ]
}
```

```text
2018-something-something    DEBUG   {str}I got an error  {err}{}  {obj}{}
```
