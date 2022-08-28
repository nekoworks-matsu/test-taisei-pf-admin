# Check out https://hub.docker.com/_/node to select a new base image
FROM nginx:1.21.5
RUN apt-get update && \
    apt-get install -y apt-utils curl \
    locales && \
    echo "ja_JP.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen ja_JP.UTF-8
ENV LC_ALL ja_JP.UTF-8
ADD infrastructure/stagingv2/nginx/nginx_admin.conf /etc/nginx/conf.d/default.conf
ADD infrastructure/stagingv2/nginx/.htpasswd /etc/nginx/.httpasswd
RUN nginx -t
EXPOSE 80