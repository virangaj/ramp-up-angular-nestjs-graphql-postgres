#!/bin/bash

# Start Zookeeper
${KAFKA_HOME}/bin/zookeeper-server-start.sh -daemon ${KAFKA_HOME}/config/zookeeper.properties

# Wait for Zookeeper to be up
sleep 5

# Start Kafka
${KAFKA_HOME}/bin/kafka-server-start.sh ${KAFKA_HOME}/config/server.properties
