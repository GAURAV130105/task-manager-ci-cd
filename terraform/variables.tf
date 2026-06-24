variable "location" {
  type        = string
  default     = "southeastasia"
  description = "The Azure region where resources will be created"
}

variable "resource_group_name" {
  type        = string
  default     = "taskflow-rg"
  description = "The name of the resource group"
}

variable "vm_name" {
  type        = string
  default     = "taskflow-vm"
  description = "The name of the virtual machine"
}

variable "vm_size" {
  type        = string
  default     = "Standard_D2s_v3"
  description = "The size of the Azure VM (2 vCPUs, 8 GB RAM)"
}

variable "admin_username" {
  type        = string
  default     = "azureuser"
  description = "The administrator username for the VM"
}

variable "ssh_public_key_path" {
  type        = string
  default     = "~/.ssh/taskmanager-key.pub"
  description = "The local path to the SSH public key file used to access the VM"
}
