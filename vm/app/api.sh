#!/bin/bash
LIGHT_GREEN="\033[1;32m"
RESET="\033[0m"

highlight() {
  local text="$@"
  echo -e "${LIGHT_GREEN}${text}${RESET}"
}


main() {
    PROJECT_NAME="api"
    PROJECT_PATH="/srv/api"
    PROJECT_REPO="https://github.com/ocr-extractify/extractify"

    setup_filesystem() {
        if [ -d "$PROJECT_PATH" ]; then
            rm -rf $PROJECT_PATH
            setup_filesystem
        else
            git clone "$PROJECT_REPO" "$PROJECT_PATH"
            cd "$PROJECT_PATH" || exit

            # uv automatically creates the .venv
            uv sync --frozen --no-cache
        fi

        # create folder only if exist
        mkdir -p logs/
        mkdir -p run/
    }

    change_app_config_to_production() {
        printf "$(highlight "1. Modifying application mode to production files\n\n")"

        file_path="$PROJECT_PATH/config.py"

        sed -i 's/MODE: Literal\["development", "production"\] = "development"/MODE: Literal\["development", "production"\] = "production"/' "$file_path"
    }

    setup_config_files() {
        printf "$(highlight "2. Setting up the configuration files\n\n")"

        source $PROJECT_PATH/.venv/bin/activate
        
        file_path="/etc/supervisor/conf.d/$PROJECT_NAME.conf"
        sudo printf "
            [program:$PROJECT_NAME]
            directory=$PROJECT_PATH
            command=/root/.local/bin/uv run fastapi run app/main.py --port 8000
            autostart=true
            autorestart=true
            stdout_logfile=$PROJECT_PATH/logs/supervisor-error.log
        " > $file_path
    }

    restart_supervisor_app() {
        printf "$(highlight "3. Restarting the supervisor application\n\n")"

        sudo supervisorctl restart $PROJECT_NAME
        sudo supervisorctl reread 
        sudo supervisorctl update
        sudo supervisorctl status  
    }

    setup_filesystem
    change_app_config_to_production
    setup_config_files
    restart_supervisor_app
}

main