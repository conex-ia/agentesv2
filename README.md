# ConexIA

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

These credentials can be found in your Supabase project settings under Project Settings > API.

**Important:** Never commit the `.env` file to version control. It contains sensitive information and is already added to `.gitignore`.