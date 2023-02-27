FROM node:19.6

RUN apt update && apt -y upgrade
RUN npm i -g next@13.1.6 react@18.2.0 react-dom@18.2.0 eslint-config-next@13.1.6 @apollo/client@3.7.7 react-google-charts@4.0.0

WORKDIR /opera
ENTRYPOINT ["/bin/bash"]

