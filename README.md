# Fastfood Payment Service

Serviço de pagamentos do sistema Fastfood, desenvolvido em NestJS, com integração a banco de dados PostgreSQL, MercadoPago, AWS SQS e deploy automatizado via Docker, Kubernetes e Terraform.

## Funcionalidades

- API REST para operações de pagamento
- Integração com MercadoPago
- Processamento assíncrono via AWS SQS
- Health check para readiness/liveness
- Suporte a CI/CD, deploy em Kubernetes/EKS

## Instalação e Build

```bash
npm install
npm run build
```

## Execução Local

```bash
npm run start:dev
```

## Testes

```bash
npm run test
npm run test:cov
```

## Docker

Build da imagem:

```bash
docker build -t soatproject/fastfood-payment-service:latest .
```

Rodar localmente:

```bash
docker run -p 8080:8080 --env-file .env soatproject/fastfood-payment-service:latest
```

## Deploy Kubernetes

- Os manifests estão em `infra/kubernetes/`
- O serviço é exposto via Gateway/Ingress no path `/payments`
- Health check: `/payments/health`

Exemplo de apply:

```bash
kubectl apply -f infra/kubernetes/
```

## Deploy Terraform

- Infraestrutura como código em `infra/terraform/`
- Provisionamento de EKS, banco, secrets/configmaps

```bash
cd infra/terraform
terraform init
terraform plan -var-file="./environment/dev/terraform.tfvars"
terraform apply
```

## Health Check

- Readiness/Liveness: `GET /payments/health`
- Atende também: `/payments/api/actuator/health/readiness` e `/payments/api/actuator/health/liveness`

## Variáveis de Ambiente

Configuração via ConfigMap e Secret no Kubernetes. Veja exemplos em `infra/kubernetes/configmap.yaml` e `infra/kubernetes/deployment.yaml`.
