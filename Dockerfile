From nginx
LABEL name = "blog"
LABEL version ="1.0"
COPY ./docs/.vuepress/dist  /usr/share/nginx/html
COPY ./blog.conf  /etc/nginx/conf.d
EXPOSE 80
