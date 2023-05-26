1. Було додано істіо
2. Змінено виклик orders/create, який тепер посилається всередині кластеру на vegetabls аби перевірити 
чи є достатня кількість, та змінює кількість на вказану в оредері, чи видаляє якщо ==
3. Додано circut breaker та retry-timeout для обох сервісів


### Commands: 
for helm deps
```
helm dep build helm/v5/charts/client
helm dep build helm/v5/charts/service1
helm dep build helm/v5/charts/service2
helm dep build helm/v5

```
for istio-setup
```
kubectl create namespace istio-system
helm install istio-base istio/base -n istio-system
helm install istiod istio/istiod -n istio-system --wait
kubectl label namespace default istio-injection=enabled
```

```
helm install test01 helm/v5
```
```
kubectl apply -f k8s/istio/braker
kubectl apply -f k8s/istio/retry 
kubectl apply -f k8s/test-pod.yaml
kubectl port-forward pod/istio-test 8081
```
Для перевірки доцільно спочатку тільки ретай, потім брейкер.
http://localhost:8081/istio/slow-test  -- тест сервісу veggie

 http://localhost/vegetables/breakpod  -- брейк одного поду. Брейк == затримка в 4 секунди і після респонс 500
 http://localhost/vegetables/revive -- ревайв поду (пару разів аби точно)


 (ще є localhost/vegetables/slowpod, але вона просто змушує ПОД мати затримку в 2.5 секунди.)
 Затримки працюють лише для шляху localhost/vegetables





