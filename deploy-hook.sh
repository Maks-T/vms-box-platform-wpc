#!/bin/bash
set -e # Останавливать выполнение при любых ошибках

BRANCH_NAME=${1:-"deploy/build"}

echo "Обновление статических файлов виджета калькулятора (Ветка: $BRANCH_NAME)..."

rm -rf public/calculator-app

git clone -b "$BRANCH_NAME" --single-branch git@github.com:kapitulin24/projectstroy.git public/calculator-app

rm -rf public/calculator-app/.git

chmod -R 775 public/calculator-app

echo "Виджет успешно обновлен."
