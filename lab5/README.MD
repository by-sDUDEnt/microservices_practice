GOALS : 
install rabbti mq
test first read/write
create history service
integrate rabbitmq



commands history:

kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"

kubectl apply -f https://raw.githubusercontent.com/rabbitmq/cluster-operator/main/docs/examples/hello-world/rabbitmq.yaml

for rabbitmq ui
kubectl port-forward "service/hello-world" 15672

for client : 
minikube tunnel