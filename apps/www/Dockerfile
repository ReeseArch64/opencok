FROM httpd:2.4.69-alpine

COPY apache/www.conf /usr/local/apache2/conf/extra/www.conf

RUN sed -i -e 's/^#LoadModule headers_module/LoadModule headers_module/' \
    -e '/^Listen /d' /usr/local/apache2/conf/httpd.conf \
    && printf '\nInclude conf/extra/www.conf\n' >> /usr/local/apache2/conf/httpd.conf

COPY dist/ /usr/local/apache2/htdocs/

USER daemon
EXPOSE 8080
STOPSIGNAL SIGWINCH
