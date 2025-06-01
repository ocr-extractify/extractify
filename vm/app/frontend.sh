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
            cd "$PROJECT_PATH/"
            find ./ -mindepth 1 ! -regex "^./$PROJECT_NAME\(/.*\)?" -delete
            cd $PROJECT_NAME 
            mv * ../
            cd ..
            find ./ -mindepth 1 ! -regex "^./dist\(/.*\)?" -delete
            cd dist
            mv * ../
            cd ..
            rm -rf dist
        fi
    }

    setup_filesystem
}

main