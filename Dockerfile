FROM node:19.6

RUN apt update && apt -y upgrade
RUN git clone https://github.com/epicosy/opera
WORKDIR /opera
RUN npm install & npm build

ENTRYPOINT ["/usr/local/bin/npm", "run", "dev"]
