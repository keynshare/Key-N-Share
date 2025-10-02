# 🤝 Contributing to KeyNShare

We welcome contributions from the community! This document provides guidelines and instructions for contributing to the KeyNShare project.

## Code of Conduct

We expect all contributors to adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before participating in the project.

## How to Contribute

### 1. Fork and Clone

```bash
git fork https://github.com/keynshare/Key-N-Share.git
git clone https://github.com/keynshare/Key-N-Share.git
```

### 2. Set Up Development Environment

Follow the installation instructions in the [README.md](./README.md) to set up your development environment.

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 4. Make Changes

Implement your changes, following these guidelines:
- Follow the existing code style and conventions
- Update documentation as needed
- Build the app before commit to check if any error exists (pnpm build)

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

### 6. Push Changes

```bash
git push origin feature/your-feature-name
```

### 7. Submit a Pull Request

Open a pull request against the main repository with a clear description of your changes.

## Development Guidelines

- **Code Style**: Follow the existing code style in each part of the project
- **Testing**: Add tests for new features and ensure existing tests pass
- **Documentation**: Update documentation for any changes to APIs or features
- **Branching**: Use feature branches for development
- **Commits**: Use clear, descriptive commit messages

## Project Structure

KeyNShare consists of three main components:

1. **Frontend (Next.js)**: Modern React application with TypeScript
2. **Backend (Express)**: RESTful API server for business logic
3. **Blockchain (Solana)**: Smart contracts for dataset metadata and ownership

## Getting Help

If you have questions or need help with your contribution, please:
- Open an issue on GitHub
- Reach out to the maintainers

Thank you for contributing to KeyNShare!