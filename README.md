# frontend-cloudwatch-logging
Experimental setup for logging frontend events to AWS CloudWatch

# Major Parts

* Handel extension for setting up backend
* Backend Lambda that implements API
* API ES Module that dispatches events to a logging 'provider'
* 'Provider' ES Module that receives log events and sends them to server

