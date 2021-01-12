### Run
`docker-compose up --build`

Open browser windows:  

**CRM** `localhost:3000`  

**Platform** `localhost:4000` 

**Queue monitor** `localhost:5000`

Send requests from Platform to CRM. If you tick the bad request box, the update will be treated as unresolvable and moved to the 'failed' queue.
If you tickt the disable api box in the CRM, the api will mock being down and will return a 500 error, these will be requeued for further attempts.
