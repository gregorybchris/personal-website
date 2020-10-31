# Personal Website

## Local Frontend

### Install

```bash
npm install frontend
```

### Start

```bash
cd frontend/app
npm start
```

## Local Backend

### Install

```bash
pip install -e backend/src/backend_package/
```

### Start

```bash
cgme app
```

### Update Data

```bash
python backend/src/backend_package/cgme/validation/generate_id.py
python backend/src/backend_package/cgme/validation/posts/post_validator.py
python backend/src/backend_package/cgme/validation/projects/project_validator.py
```
