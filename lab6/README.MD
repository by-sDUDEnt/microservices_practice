1. Система логування побудована на EFK. Розротання через `kubectl apply -f k8s/logging`
Можливо треба зробити двічі, вирішив не розділяти по папках

`
helm dep build helm/v5/charts/client
helm dep build helm/v5/charts/service1
helm dep build helm/v5/charts/service2
helm dep build helm/v5
`

1.1 Ловить весь stdout зі всього кластеру. Або ж запустити `helm install local v5`, або `test-pod `в папці `k8s/logging` - останній це просто busybox 
Все відображається чудово у Kibana

Для логів безспосередньо сервіса veggie-service 
1. 'kubectl describe pod <veggie-service-pod>
2. Знайди Containter id для veggie-nodejs
3. У Кібані у фільтрі виставити docker.container_id is <id>
4. При операції на додавання, видалення буде логуватися query bd, помилки і т.п.

`
kubectl port-forward svc/kibana-np 8080 
`

2. Встановлюється стандартна конфігруація Prometeus + Grafana відповідними командами з helm
В середині Grafana будуть доступні метрики в навбарі у вкладці Explore
Юзер і пароль закодовані в base64, потрібно декодувати

`
kubectl create namespace monitoring
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install --namespace monitoring prometheus prometheus-community/kube-prometheus-stack
kubectl port-forward -n monitoring svc/prometheus-kube-prometheus-prometheus  9090
kubectl port-forward --namespace monitoring service/prometheus-grafana 3000:80

kubectl get secret --namespace monitoring prometheus-grafana -o jsonpath="{.data.admin-password}" 
kubectl get secret --namespace monitoring prometheus-grafana -o jsonpath="{.data.admin-user}"  

`

localhost:9090 - prometheus
localhost: 300 - grafana

Далі буде доступ в Explore-> Run Query для власних запитів метрик

3. Можливе ручне встановлення окремо  Grafana i Prometheus, відповідні папки наведені (зручні було дебажити конфіг Prometheus). Тоді він ще окремо збирає vegetables/metrics у відповідному сервісі.