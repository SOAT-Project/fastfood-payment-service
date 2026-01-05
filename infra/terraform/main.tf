resource "kubernetes_manifest" "payment_namespace" {
  manifest = yamldecode(file("${path.module}/../kubernetes/namespace.yaml"))
}

resource "kubernetes_manifest" "payment_service_account" {
  manifest = yamldecode(file("${path.module}/../kubernetes/service-account.yaml"))
}

resource "kubernetes_manifest" "payment_service" {
  manifest = yamldecode(file("${path.module}/../kubernetes/service.yaml"))
}

resource "kubernetes_manifest" "payment_deployment" {
  manifest = yamldecode(file("${path.module}/../kubernetes/deployment.yaml"))
}

resource "kubernetes_manifest" "payment_http_route" {
  manifest = yamldecode(file("${path.module}/../kubernetes/http-route.yaml"))
}

resource "kubernetes_manifest" "payment_configmap" {
  manifest = yamldecode(file("${path.module}/../kubernetes/configmap.yaml"))
}

resource "kubernetes_manifest" "payment_hpa" {
  manifest = yamldecode(file("${path.module}/../kubernetes/hpa.yaml"))
}

resource "kubernetes_secret" "payment_secret" {
  metadata {
    name      = "payment-secret"
    namespace = "payment"
  }

  data = {
    AWS_REGION                        = var.aws_region
    AWS_ACCESS_KEY_ID                 = var.aws_access_key
    AWS_SECRET_ACCESS_KEY             = var.aws_secret_key
    DATABASE_HOST                     = var.database_host
    DATABASE_PORT                     = var.database_port
    DATABASE_USERNAME                 = var.database_username
    DATABASE_PASSWORD                 = var.database_password
    DATABASE_NAME                     = var.database_name
    MERCADO_PAGO_COLLECTOR_ID         = var.mercado_pago_collector_id
    MERCADO_PAGO_POS_ID               = var.mercado_pago_pos_id
    MERCADO_PAGO_ACCESS_TOKEN         = var.mercado_pago_access_token
    MERCADO_PAGO_BASE_URL             = var.mercado_pago_base_url
    AWS_ORDER_TO_PAYMENT_QUEUE_URL    = var.aws_order_to_payment_queue_url
    AWS_PAYMENT_TO_ORDER_QUEUE_URL    = var.aws_payment_to_order_queue_url
    APPLICATION_PORT                  = var.application_port
  }

  type = "Opaque"

  depends_on = [kubernetes_manifest.payment_namespace]
}