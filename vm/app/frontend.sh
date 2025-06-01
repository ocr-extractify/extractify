#!/bin/bash

main() {
    PROJECT_NAME="frontend"
    PROJECT_PATH="/srv/frontend"
    PROJECT_REPO="https://github.com/ocr-extractify/extractify"

    setup_filesystem() {
        if [ -d "$PROJECT_PATH" ]; then
            rm -rf $PROJECT_PATH
            setup_filesystem
        else
            git clone "$PROJECT_REPO" "$PROJECT_PATH"
            cd "$PROJECT_PATH/$PROJECT_NAME/dist"
            mv * ../
        fi
    }

    setup_filesystem
}

main