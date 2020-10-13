FROM nginx as openolitor-client-kundenportal
COPY ./client-kundenportal-dist/ /usr/share/nginx/html
EXPOSE 80
