#!/bin/bash

regions=("ap-southeast-2" "eu-west-1" "eu-central-1" "us-west-1" "us-east-1")

for i in ${!regions[@]}
do
  region=${regions[$i]}
  sls info --region $region | grep beta/check
done