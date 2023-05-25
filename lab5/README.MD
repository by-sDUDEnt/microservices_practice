GOALS : 
install rabbti mq
test first read/write
create history service
integrate rabbitmq



commands history:

kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"

kubectl port-forward "service/hello-world" 5672
kubectl port-forward "service/hello-world" 15672
