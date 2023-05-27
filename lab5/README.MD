commands history:
```
kubectl apply -f "https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml"

kubectl apply -f https://raw.githubusercontent.com/rabbitmq/cluster-operator/main/docs/examples/hello-world/rabbitmq.yaml
```
for rabbitmq ui (decode pass and username in base64)
```
kubectl get secret hello-world-default-user -o jsonpath='{.data.username}'
kubectl get secret hello-world-default-user -o jsonpath='{.data.password}'
kubectl port-forward "service/hello-world" 15672
```

for helm
```
helm dep build helm/v5/charts/client
helm dep build helm/v5/charts/service1
helm dep build helm/v5/charts/service2
helm dep build helm/v5/charts/service3
helm dep build helm/v5

helm install lab5test01 helm/v5
```


for client :
``` 
minikube tunnel
```
