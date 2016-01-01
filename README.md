# Swarm processing #

Compute pi using a distributed monte-carlo method over http. The more clients are connected to the server, the faster pi is computed. 

Clients and server are coded in Javascript. 

The computation are made in background by webworkers. The same method could be used by websites, cpu of their visitors would be used for ditributed computing without them noticing or degrading their experience on the website.