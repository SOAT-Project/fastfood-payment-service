variable "aws_region" {
    description = "AWS Region"
    type        = string
}

variable "aws_access_key" {
    description = "AWS Access Key"
    type        = string
    sensitive   = true
}

variable "aws_secret_key" {
    description = "AWS Secret Key"
    type        = string
    sensitive   = true
}

variable "application_port" {
    description = "Application port"
    type        = string
}

variable "database_host" {
    description = "Database host"
    type        = string
}

variable "database_port" {
    description = "Database port"
    type        = string
}

variable "database_username" {
    description = "Database username"
    type        = string
}

variable "database_password" {
    description = "Database password"
    type        = string
    sensitive   = true
}

variable "database_name" {
    description = "Database name"
    type        = string
}

variable "mercado_pago_collector_id" {
    description = "Mercado Pago Collector ID"
    type        = string
}

variable "mercado_pago_pos_id" {
    description = "Mercado Pago POS ID"
    type        = string
}

variable "mercado_pago_access_token" {
    description = "Mercado Pago Access Token"
    type        = string
    sensitive   = true
}

variable "mercado_pago_base_url" {
    description = "Mercado Pago Base URL"
    type        = string
}

variable "aws_order_to_payment_queue_url" {
    description = "AWS Order to Payment Queue URL"
    type        = string
}

variable "aws_payment_to_order_queue_url" {
    description = "AWS Payment to Order Queue URL"
    type        = string
}