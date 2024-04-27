#!/bin/bash

# Define the local Docker registry address
LOCAL_REGISTRY="localhost:5050"
REGISTRY_CONTAINER_NAME="local-registry"

# Path to the Kind configuration file
KIND_CONFIG_PATH="kubernetes/kind-config.yml"

# Function to display usage instructions
usage() {
    echo "Usage: $0 [-b] [-m mode]"
    echo "Options:"
    echo "  -b       Rebuild the frontend Docker image"
    echo "  -m       Mode of operation: 'r' for running the Docker container, 'd' for deploying to Kubernetes using Kind"
    exit 1
}

# Function to log debug messages
log_debug() {
    echo "DEBUG: $1"
}

# Function to stop and remove Docker registry container
stop_and_remove_registry() {
    if [ "$(docker ps -q -f name=$REGISTRY_CONTAINER_NAME)" ]; then
        log_debug "Stopping existing local Docker registry..."
        docker stop $REGISTRY_CONTAINER_NAME
        docker rm $REGISTRY_CONTAINER_NAME
    fi
}

# Function to delete Kind cluster
delete_kind_cluster() {
    if kind get clusters | grep -q "kind-cluster"; then
        log_debug "Deleting existing Kind cluster to avoid conflicts..."
        kind delete cluster --name kind-cluster
    fi
}

# Default values
REBUILD_IMAGE=false
MODE=""

# Parse command-line options
while getopts "bm:" opt; do
    case ${opt} in
        b )
            REBUILD_IMAGE=true
            ;;
        m )
            MODE="$OPTARG"
            ;;
        \? )
            echo "Invalid option: $OPTARG" 1>&2
            usage
            ;;
        : )
            echo "Option -$OPTARG requires an argument." 1>&2
            usage
            ;;
    esac
done
shift $((OPTIND -1))

# Get the directory containing this script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
log_debug "Script directory: $SCRIPT_DIR"

# Change to the script directory
cd "$SCRIPT_DIR" || exit
log_debug "Changed to script directory: $(pwd)"

# Check if the Docker image exists, if not, rebuild it
if [ "$REBUILD_IMAGE" = true ] || ! docker image inspect "$LOCAL_REGISTRY/frontend-image:latest" &> /dev/null; then
    log_debug "Building or rebuilding Docker image"
    docker build -t "$LOCAL_REGISTRY/frontend-image:latest" -f Dockerfile .
    log_debug "Pushing Docker image to the local registry"
    docker push "$LOCAL_REGISTRY/frontend-image:latest"
else
    log_debug "Docker image already exists"
fi

# Ensure Kind and Docker are properly managed based on mode
if [ -n "$MODE" ]; then
    if [ "$MODE" = "d" ]; then
        # Ensure Kind is installed
        if ! command -v kind &> /dev/null; then
            log_debug "Kind is not installed. Please install Kind: https://kind.sigs.k8s.io/docs/user/quick-start/"
            exit 1
        fi

        # Stop and remove Docker registry if running
        stop_and_remove_registry

        # Delete existing Kind cluster
        delete_kind_cluster

        # Start local Docker registry
        log_debug "Starting local Docker registry on port 5500..."
        docker run -d -p 5500:5000 --restart=always --name $REGISTRY_CONTAINER_NAME registry:2

        # Create Kind cluster
        log_debug "Creating Kind Kubernetes cluster..."
        kind create cluster --name kind-cluster --config $KIND_CONFIG_PATH

    elif [ "$MODE" = "r" ]; then
        # Stop and remove Docker registry if running
        stop_and_remove_registry

        # Delete existing Kind cluster
        delete_kind_cluster
    fi
fi

# Perform cleanup and mode-specific operations if a mode is specified
case $MODE in
    r)
        # Start the Docker container
        log_debug "Starting Docker container frontend-app"
        docker run -d -p 8081:80 --name frontend-app "$LOCAL_REGISTRY/frontend-image:latest"
        sleep 2
        log_debug "Fetching Docker container logs for frontend-app"
        docker logs frontend-app
        ;;
    d)
        # Deploy to Kind Kubernetes cluster
        log_debug "Deploying to Kind Kubernetes cluster"
        kubectl apply -f kubernetes/deployment.yml
        kubectl apply -f kubernetes/service.yml
        ;;
    *)
        echo "No mode specified."
        ;;
esac

# Verify the frontend app is running on: http://localhost:8081
# Stop the frontend app with: docker stop <container_id_or_name>
