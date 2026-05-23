# HACRO Labs Project Summary

This repository is a full-stack membership platform for HACRO Labs, built as a monorepo with three main app layers.

## Project Structure

- `apps/web`
  - React + Vite frontend
  - Routes for home, member login, admin login, dashboards, and registration
  - Uses `react-router-dom`, `framer-motion`, `@react-three/fiber`, and `@react-three/drei`
  - Auth state is managed through React context and localStorage

- `apps/api`
  - Node.js + Express backend
  - Uses PocketBase for authentication and data storage
  - Provides API endpoints such as member/admin login, profile, and session management
  - Implements custom session tables for members and admins

- `apps/pocketbase`
  - PocketBase app storage and business logic
  - `pb_data/` stores the local database
  - `pb_migrations/` defines the schema and collections
  - `pb_hooks/` contains automation scripts for workflows like member registration, group assignment, notifications, and more

## Key Features

- Member and admin authentication with separate flows
- Group-focused member ecosystem with savings, notifications, and automation
- 3D animated homepage experience using React Three Fiber
- Automated backend workflows via PocketBase hooks
- Seed and test scripts for credentials and auth verification

## Purpose

The project is designed as a community/member-focused platform for HACRO Labs, emphasizing cooperative membership, financial participation, and group-based support. It combines a modern frontend experience with a PocketBase-powered backend and Express API layer.
