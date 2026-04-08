# Task Service

Сервис для управления задачами с HTTP API на Go.

## Требования

- Go `1.23+`
- Docker и Docker Compose

## Быстрый запуск через Docker Compose

```bash
docker compose up --build
```

После запуска сервис будет доступен по адресу `http://localhost:8080`.

Если `postgres` уже запускался ранее со старой схемой, пересоздай volume:

```bash
docker compose down -v
docker compose up --build
```

Причина в том, что SQL-файл из `migrations/0001_create_tasks.up.sql` монтируется в `docker-entrypoint-initdb.d` и применяется только при инициализации пустого data volume.

## Swagger

Swagger UI:

```text
http://localhost:8080/swagger/
```

OpenAPI JSON:

```text
http://localhost:8080/swagger/openapi.json
```

## API

Базовый префикс API:

```text
/api/v1
```

Основные маршруты:

- `POST /api/v1/tasks`
- `GET /api/v1/tasks`
- `GET /api/v1/tasks/{id}`
- `PUT /api/v1/tasks/{id}`
- `DELETE /api/v1/tasks/{id}`

### Periodicity Features

The service now supports recurring tasks with the following periodicity types:

- **Daily**: Every N-th day
- **Monthly**: On specific day of month (1-30)
- **Specific dates**: Only on specified dates
- **Even/Odd days**: Only on even or odd days of month

#### Additional Endpoints for Periodicity:

- `POST /api/v1/tasks/generate-recurring` - Generate tasks from periodic templates
- `GET /api/v1/tasks/templates` - List all periodic template tasks
- `GET /api/v1/tasks/{id}/children` - List tasks generated from a template

#### Periodicity Example:

```json
{
  "title": "Daily Patient Check-in",
  "description": "Call patients for daily check-in",
  "status": "new",
  "scheduled_at": "2023-10-25T09:00:00Z",
  "periodicity": {
    "type": "daily",
    "daily_interval": 1,
    "start_date": "2023-10-25T00:00:00Z",
    "is_template": true
  }
}
```

For detailed information about the periodicity feature implementation, see [PERIODICITY_FEATURE.md](PERIODICITY_FEATURE.md).
