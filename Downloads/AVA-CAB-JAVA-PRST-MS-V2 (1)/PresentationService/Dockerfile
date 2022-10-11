FROM gradle:jdk11-openj9 AS build
RUN mkdir /app
WORKDIR /app
COPY . .
RUN gradle bootWar
WORKDIR /app/build/libs/

FROM adoptopenjdk/openjdk11:alpine-jre
RUN mkdir /app
COPY apache-tomcat-9.0.56.tar.gz .
RUN tar xvfz apache-tomcat-9.0.56.tar.gz
RUN mkdir /opt/tomcat/
RUN mv apache-tomcat-9.0.56/* /opt/tomcat/.
RUN rm -rf /opt/tomcat/webapps/ROOT
COPY --from=build /app/build/libs/ROOT.war /opt/tomcat/webapps/
CMD ["/opt/tomcat/bin/catalina.sh", "run"]