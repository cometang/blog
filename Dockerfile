From nginx
LABEL name = "blog"
LABEL version ="1.0"
COPY ./dist /usr/share/nginx/html
COPY ./font.conf  /etc/nginx/conf.d
EXPOSE 80
